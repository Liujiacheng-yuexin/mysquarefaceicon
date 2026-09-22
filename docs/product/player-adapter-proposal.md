# PLAYER-001 · 统一 GamePlayer Adapter 实施方案（已确认）

> 方案状态：已确认；用户原文：`确认方案，进行开发`（2026-08-31）  
> 当前任务：`PLAYER-001`  
> 预计影响：仅替换现有三个页面的播放器/外链交互内核，不改变页面信息架构、URL、metadata、H1、canonical、schema 或索引状态  
> 发布权限：本任务不提交、不推送、不部署

## 1. 当前事实与目标

- Square 与 Oval 共用 `FlashGenerator`，但预览态和运行态分别维护全屏、重载、状态与控件，存在重复逻辑。
- Ruffle runtime 已用动态组件隔离，SWF 只有用户点击后才加载；该 click-to-load 行为必须保留。
- Pixel 页面已经使用直接外链，没有 iframe，但仍是页面内手工实现，尚未由同一个播放器能力模型约束。
- 已验收 Game Data 能表达 `RUFFLE_SWF`、`HTML5`、`LOCAL_IFRAME`、`OFFICIAL_IFRAME`、`EXTERNAL_LINK` 五种类型。

本任务建立一个 `GamePlayer` 入口：根据 `type` 做穷尽分派，统一状态、能力、控件和恢复方式；不把 External Tool 伪装成本站可玩的游戏。

## 2. 推荐组件结构

```text
Game Data / legacy props
        │
        ▼
createGamePlayerModel（只挑客户端需要的最小字段）
        │
        ▼
GamePlayer ── shared frame / status / controls / device notice
        ├── RuffleAdapter          用户点击后才动态导入 runtime + SWF
        ├── Html5Adapter           本地 HTML5 entry，点击后加载
        ├── LocalIframeAdapter     本地受控 iframe，点击后加载
        ├── OfficialIframeAdapter  仅有嵌入许可时加载，并提供原站出口
        └── ExternalLinkAdapter    不创建 iframe，只展示来源与 Open Original
```

实施约束：

- 适配器直接导入，不创建聚合 barrel；重型 Ruffle 运行代码继续动态、条件加载。
- Server/Client 边界不序列化整条 Game Record，只传播放器所需的 name、type、player、cover、mobile/fullscreen 和 source 摘要。
- 公共能力用穷尽类型检查；未知类型在构建/测试中失败，不静默回退成 iframe 或外链。
- 不新增依赖；Ruffle 的版本固定、自托管和 CDN fallback 策略留给 `RUFFLE-001`，本任务只保留现状并移动职责。

## 3. 布局与页面接入

可玩类型保持现有视觉顺序和稳定比例：

```text
┌──────────── 固定 aspect-ratio stage ────────────┐
│ Preview + Play → Loading → Ready / Error + Retry │
└───────────────────────────────────────────────────┘
 [Play（按页面变体）] [Fullscreen] [Reload] [Report]
              aria-live 状态 / 设备提示
```

External 类型使用明确不同的外链面板：

```text
┌─ External Tool · 来源域名 ───────────────────────┐
│ 此工具由原站提供，本站不托管、不 iframe          │
│                         [Open Original ↗]         │
└───────────────────────────────────────────────────┘
```

接入边界：

| URL | PLAYER-001 变更 | 明确保留 |
|---|---|---|
| `/` | 现有 `FlashGenerator` 变为新 `GamePlayer` 的兼容入口 | 首屏位置、比例、Play、Fullscreen、Reload、Report 与 click-to-load |
| `/oval-face-icon-generator` | 同一兼容入口分派到 Ruffle adapter | URL、Oval 比例、文案与页面模块顺序 |
| `/pixel-art-avatar-icon-generator` | 核心外链面板改用 External adapter | 原站来源、直接新标签打开、无 iframe、页面其余内容 |

`MIG-SQUARE-001`、`MIG-OVAL-001`、`MIG-PIXEL-001` 仍负责以后把 metadata、正文、related、模板和全部页面字段迁移到 Game Data；本任务不提前吞并这些范围。

## 4. 统一交互与能力矩阵

| 类型 | 初始状态 | Loading / Error | Fullscreen | Reload | Outbound |
|---|---|---|---|---|---|
| Ruffle SWF | 静态 cover + Play | runtime/SWF 超时、错误、Retry | 浏览器 API 可用时显示 | 重建 Ruffle player | Report only |
| HTML5 | 静态 cover + Play | iframe load/timeout/error | 浏览器 API | 更新实例 key | 可选 Report |
| Local iframe | 静态 cover + Play | load/timeout/error | 浏览器 API | 更新实例 key | 可选 Report |
| Official iframe | 来源标记 + Play | load/timeout/error | 浏览器 API | 更新实例 key | Open Original + Report |
| External link | External 标记 | 不伪造 Loading/Error | 不显示 | 不显示 | Open Original + Report |

- 不适用的按钮直接省略，不展示看似可用的假控件。
- 所有真实按钮和链接有可访问名称；Preview 使用原生 `button`，Enter/Space 可启动。
- 状态使用 `aria-live="polite"`；错误必须提供 Retry，浏览器不支持全屏时给出可恢复说明。
- Fullscreen、Reload、Play 由事件处理器直接触发，不用“先改 state 再靠 effect 执行动作”。

## 5. SEO、权利与性能不变量

- `/`、Oval、Pixel 的 title、description、H1、canonical、schema、indexability 和 sitemap 不变。
- External adapter 永不输出本站可玩、VideoGame、本地托管或拥有第三方工具的表达。
- `DIRECT_LINK_ONLY` 只能分派到 External adapter；`UNKNOWN / REVIEW_REQUIRED` 不获得新的发布、复制或迁移权限。
- 首次加载不得请求 Ruffle JS/WASM 或 SWF；Ruffle adapter 及运行资源只在 Play 后加载。
- Preview、Loading、Ready、Error 共用同一稳定容器，避免状态切换产生布局位移。
- 不修改、不反编译 Square/Oval SWF；不代理、镜像、复制 Pixel 原站资源。

## 6. 实施与验收证据

编码获确认后按以下小步实施：

1. 补齐最小 player view model、能力矩阵和五类适配器；增加负向类型/权限断言。
2. 将现有 `FlashGenerator` 收敛为兼容层，再接入 Square/Oval；只替换 Pixel 核心外链面板。
3. 增加任务级 `player:check`：五类 fixture、穷尽分派、能力矩阵、External 无 iframe、DIRECT_LINK_ONLY fail-closed。
4. 运行 `games:check`、任务 ESLint/type-check，并记录全局 lint/build 的真实结果。
5. 浏览器检查桌面与 `390 × 844`：键盘启动、Play/Loading/Error/Retry、Fullscreen、Reload、Pixel 新标签外链。
6. 对首页首次网络请求做断言：点击 Play 前没有 Ruffle/WASM/SWF，点击后才出现。

当前已有 `app/sitemap.ts` 语法损坏仍是 P0 全局发布阻断；即使 PLAYER-001 功能通过，也不能写成全站或发布通过。

## 7. 回滚

- 恢复 `FlashGenerator.tsx` 与 `FlashGeneratorRuntime.tsx` 的当前实现。
- 恢复 Pixel 页面当前外链面板。
- 删除 `components/game-player/*`、player 校验脚本和新增 npm 命令。
- Game Data、License Registry、URL 冻结表和此前已验收任务不回滚。

## 8. 用户决定

用户已确认本方案。开发严格限定为当前三个播放器表面的真实接入与 PLAYER-001 验证，不扩展到页面迁移、提交、推送或部署。
