# HOME-HERO-001 · 首页 Hero 与核心游戏入口方案（已实施并验收）

> 方案状态：已确认、完成本地实施并通过用户验收  
> 确认记录：用户于 2026-09-01 明确回复 `确认 HOME-HERO-001 方案，进行开发`  
> 验收记录：用户于 2026-09-01 明确回复 `验收通过，现在进行下一步开发`  
> 当前任务：`HOME-HERO-001`  
> 前置状态：用户已明确验收 `HOME-IA-001`  
> 预计影响：仅重构英文根首页 `/` 的首屏 Hero 与 Square 核心游戏入口；不改变后续发现区、Gallery、长内容或 Resources  
> 发布权限：允许按本方案修改本地生产页面代码；本任务不提交、不推送、不部署

## 1. 当前事实与任务边界

- `/` 当前首屏为居中单列：Eyebrow → 唯一 H1 → 价值说明 → Square 固定比例封面/Play → 三个控制按钮。
- 已验收的首页信息架构要求 Square 继续占据首页上半部分，随后才是 `Discover More Avatar Games`；`HOME-HERO-001` 不重新设计或扩充该发现区。
- 当前初始 DOM 不加载 Ruffle、WASM 或 SWF，用户点击封面后才初始化播放器；该边界必须保持。
- 当前封面来自已登记的 Square Game Data，比例为 `690:600`。本任务不替换、重绘、反编译或修改游戏/SWF 资产。
- Square/Oval 精确许可仍为 `UNKNOWN`，因此首屏只能描述真实玩法与页面功能，不得暗示官方、原创、授权或商业使用权。
- 当前移动 Lighthouse LCP 为 4.6s，属于全局未解决风险；本任务不得新增字体、第三方脚本、装饰图或另一个首屏媒体请求。

## 2. 推荐视觉方向

概念稿：

- [桌面首屏概念](./concepts/home-hero-001-desktop-concept.png)
- [390px 移动首屏概念](./concepts/home-hero-001-mobile-concept.png)

概念稿用于确认层级、构图与色彩，不作为生产图片。图中的游戏画面为视觉近似；生产实现继续使用现有真实 CDN cover，所有 UI 文本、尺寸和交互以本方案为准。

视觉继续沿用已经验收的 mint / cream / dark brown / green / orange 系统，保持轻量、可爱、实用的复古 Flash 游戏气质。使用代码原生排版、边框、按钮和轻阴影；圆角控制在约 `8–12px`，不加入玻璃拟态、大型插画、人物、设备框或装饰性媒体。

## 3. 桌面布局（建议基准 `1440 × 1000`）

```text
Compact Header
  ↓
Mint Home Hero · max-width 1220px
  ├─ Left value column (~40%)
  │    CLASSIC FLASH AVATAR MAKER
  │    H1: Square Face Generator
  │    现有真实价值段落
  │    Primary: Play Game
  └─ Right core preview (~60%)
       690:600 stable cover / click target
       Play Game overlay
       Fullscreen | Reload Game | Report Issue
  ↓
Discover More Avatar Games heading enters the lower viewport edge
```

- Hero 从当前上下堆叠改为双栏，减少空白 mint 高度，让 H1、真实价值、Preview 与 Play 在同一首屏可见。
- 左列垂直居中；H1 建议 `clamp(52px, 5vw, 68px)`，保持一页唯一 H1，不添加副标题式第二 H1。
- 右列继续使用稳定 `690 / 600` aspect ratio；Preview、Loading、Player 三种状态不得改变外框尺寸。
- 桌面左侧 `Play Game` 与封面内 `Play Game` 都触发同一播放器激活行为；不是跳转到另一页面，也不会生成两个播放器实例。
- 控制栏保留现有三项能力与可访问名称；未激活时 Fullscreen/Reload 的现有能力规则保持，不伪造成功状态。
- 首屏下缘只露出已经验收的 `Discover More Avatar Games` 开头，以表达垂直门户关系；不在 Hero 内复制游戏卡片或分类数据。

## 4. 移动布局（`390 × 844` 验收宽度）

- 保留当前紧凑 Header：品牌、`Play`、`Menu`；每个交互目标至少 `44px` 高，品牌可以安全截断但不能挤出视口。
- Hero 改回真实 DOM 单列：Eyebrow → H1 → 价值段落 → Preview/Play → Controls。
- H1 只占两行；生产实现应比概念稿更紧凑，确保在 `390 × 844` 内至少完整看到 H1、价值段落、Preview 主要区域和明确的 `Play Game`。
- 移动端隐藏左列重复 CTA，只保留封面内的主 Play，避免同一小屏出现两个等价主操作。
- 控制栏为两列 `Fullscreen` / `Reload Game`，下一行全宽 `Report Issue`；按钮不得横向溢出或压缩为难以辨认的小字。
- Play overlay 始终完全位于 player 内；默认与 hover/focus/active 状态都保持水平居中，不能重现已修复的移动裁切问题。
- CSS 视觉顺序与 DOM/键盘顺序一致，不使用 `order` 造成阅读顺序错位。

## 5. 固定文案与 SEO 边界

首屏继续使用以下可见内容：

- Eyebrow：`Classic Flash avatar maker`
- H1：`Square Face Generator`
- 价值段落：`Play the classic Square Face Generator online and create retro square face icons for avatars, Discord PFPs, GitHub profiles, favicons, and more.`
- 主操作：`Play Game`
- 控制：`Fullscreen`、`Reload Game`、`Report Issue`

以下项目逐值冻结：

- `/` 的 `square face generator` 主搜索意图。
- Title、description、唯一 H1、canonical、Open Graph、Twitter、robots/indexability、语言 alternates 与现有 JSON-LD。
- sitemap membership、30 URL 冻结表、三个 legacy 游戏 URL 和现有锚点 `#game-player` / `#maker`。
- `Discover More Avatar Games` 的数据、卡片、分类、标签与后续模块顺序。

不新增 `official`、`original`、授权、作者、用户数、评分、点赞、Popular、Trending、性能结果、AI 或“现代重建版”等未经证据支持的表述。

## 6. 交互与组件方案

- 新增最小 `HomeHero` / `CoreGamePreview` 组合，由同一个客户端边界管理激活状态；桌面两个 Play 入口调用同一 action，移动端通过 CSS/响应式规则只显示封面入口。
- 继续调用已验收的 `FlashGenerator` / `GamePlayer` adapter 和 Square Game Data，不复制 SWF URL、封面 URL、比例或控制能力。
- 初始渲染只输出 cover 与原生按钮；Play 前网络与 DOM 中不得出现 Ruffle runtime、WASM 或 SWF。
- Play 后在原预留比例内初始化播放器；Loading/Error/Retry、Reload、Fullscreen、Report 的既有语义和键盘能力保持。
- 左侧 Play 和移动 Header 的 Play 均需有明确行为：桌面 Hero Play 直接激活；Header Play 保持跳到 `#game-player`，不暗示已经启动游戏。
- 不加入 autoplay、预加载 runtime、client-only 首屏文案、滚动劫持、弹窗或第三方依赖。

## 7. 确认后的实施与验证

1. 将根首页首屏抽成 `HomeHero` 与 `CoreGamePreview`，接入现有 Square record 和 player；draft locale 继续保留现有结构，避免范围扩张。
2. 实现桌面双栏、移动单列与控制栏响应式规则，保留稳定比例和现有色彩 token。
3. 增加任务级检查，断言唯一 H1、固定文案、真实 Game Data 绑定、单一 player、初始无 Ruffle/WASM/SWF、发现区仍紧随 Hero。
4. 运行 `home:check`、`metadata:check`、`games:check`、`player:check`、`routes:check`、`components:check`、任务 type-check/ESLint、`lint`、`build` 与 `cf:build`；失败或跳过项按真实状态记录。
5. 浏览器检查 `1440 × 1000`、`1280 × 900`、`390 × 844`：布局、文本、键盘、focus、Play/Reload/Fullscreen/Report、无横向溢出、hover 不裁切。
6. 记录首载请求：点击前无 Ruffle/WASM/SWF，点击后仅生成一个 player；对比 Preview/Loading/Player 几何，检查 CLS 风险。
7. 对照本方案概念截图进行视觉复核；概念图不是像素级验收标准，若精确性与可访问性冲突，以本文件的尺寸、内容和交互规则为准。

## 8. 明确不在本任务范围

- 不修改 Featured/New/Categories 数据或完整发现区样式；留给 `HOME-DISC-001`。
- 不处理 Gallery 的 Community 文案与硬编码点赞；留给 `HOME-GALLERY-001`。
- 不声称已解决移动 LCP/CLS，也不建立完整性能预算；留给 `PERF-HOME-001` / `CWV-001`。
- 不修改图片规范、转换 cover 格式或迁移 CDN；留给 `IMG-001` / `ASSET-001`。
- 不修复既有 `app/sitemap.ts`、HTTP→HTTPS、许可证据或 KW-02 findings；这些全局阻塞继续显示。
- 不提交、不推送、不部署。

## 9. 用户确认与后续门禁

用户先明确回复 `确认 HOME-HERO-001 方案，进行开发`，解除本地实施门禁；本地实施完成后又于 2026-09-01 明确回复 `验收通过，现在进行下一步开发`。因此 `HOME-HERO-001` 已验收，可进入 `HOME-DISC-001` 方案门禁；该下一任务在方案确认前仍不得修改生产页面代码。

## 10. 本地实施记录（2026-09-01）

- 英文根首页 `/` 已接入 `HomeHero` 与 `CoreGamePreview`；draft locale 首页继续使用原结构。
- 桌面实现已确认的双栏构图；`390px` 移动端恢复单列，隐藏重复 Hero CTA，并以 `Fullscreen / Reload Game` 两列加全宽 `Report Issue` 呈现控制区。
- 桌面 Hero CTA 与封面 CTA 共用一个 `GamePlayer`，通过 ref 暴露的直接事件 action 激活或重载；没有复制播放器或以 effect 间接触发。
- 初始 HTML 仍只渲染真实 Game Data cover 与原生按钮；浏览器实测 Play 前 `ruffle-player = 0`，Play 后 `ruffle-player = 1`，player shell 始终为 `1`。
- 视觉 QA 发现旧通用 hover 规则会让桌面 cover CTA 横移约 `107px`，已用 Home-player 局部规则修复；复测横移为 `0px`，移动默认与 hover 也都保持居中。
- `/` 的固定 H1、价值文案、title、description、canonical、Open Graph、Twitter、schema、robots/indexability、sitemap membership、language alternates、已验收发现区数据与模块顺序均未改动。
- 任务级检查、关联数据/玩家/路由/组件检查、限定 TypeScript/ESLint、差异空白检查和 `1440 x 1000`、`1280 x 900`、`390 x 844` 浏览器检查均通过。Fullscreen 控件存在且处理路径已触发，但内置浏览器未建立 fullscreen 状态，故该项仍为环境内未验证。
- 完整 `lint`、Next build 与 Cloudflare build 仍被任务前既有的 `app/sitemap.ts` 首行语法错误阻塞；未生成本地 production build，因此未运行 `seo:check`。未获授权执行 commit、push、deploy 或 `seo:prod`。
- 持久化证据见 `docs/quality/evidence/home-hero-001/README.md`。用户于 2026-09-01 明确验收本任务；`HOME-HERO-001` 状态更新为 `已完成`，下一任务 `HOME-DISC-001` 进入方案待确认，不提前修改生产页面代码。
