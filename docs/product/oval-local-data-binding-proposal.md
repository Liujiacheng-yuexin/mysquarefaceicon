# MIG-OVAL-001 · Oval 本地数据绑定方案

> 当前 v1.66 · 2026-09-03 · 用户明确验收 LOCAL_DATA_BINDING；28 条源验收，完整模板迁移仍延期、未完成。原方案与 v1.65 QA 保留；本轮未改应用或重跑完整检查、未部署。当前证据：docs/quality/evidence/mig-oval-001/acceptance-checks.json；下一项 Pixel 仅方案待确认。
>
> 下方所有旧待确认/待验收文字均为原日期历史状态，不撤销此次本地阶段验收。
>
> 历史 v1.65 · 2026-09-03 · 已收到明确方案确认；本地数据绑定已实施，待本地阶段人工验收。完整模板迁移仍未完成。
>
> 39 项最终命令、7 组响应式对照及真实交互已记录；窄屏入口偏低为既有问题，视觉有条件通过。详见 docs/quality/evidence/mig-oval-001/README.md 与 checks.json；等待 MIG-OVAL-001 本地数据绑定验收通过，不提交、推送、部署或推进 Pixel。
>
> 以下保留 v1.64 原方案。原文“待确认/未实施/未重跑”是 2026-09-03 原方案时点状态，不代表 v1.65 当前状态。
>
> 历史 2026-09-03 · 看板 v1.64 · 方案待确认，尚未实施。
>
> MIG-SQUARE-001 已获用户明确本地验收。当前只准备 Oval 的下一阶段；LICENSE-GATE 与累计发布继续暂缓，UNKNOWN 不等于允许。

## 本次范围与原路线图的区别

原任务是“迁移 Oval 到统一模板”。本方案建议先交付**保留既有页面的本地数据绑定阶段**，不把该阶段冒充完整模板迁移。当前 `createGamePlayerModel(ovalFaceGame)` 明确拒绝 `RUFFLE_SWF`；`GameDetailTemplate` 又会校验 model 的 policy、id 和 type。不能为了换模板伪造授权、复制允许列表、添加例外开关或移除这些校验。

本阶段保留现有 `FlashGenerator → GamePlayer` 兼容路径，只集中输入。直接切到 `GameDetailTemplate`、重排首屏、移除兼容层及完整模板交付仍未开始，需要其接入方案和许可边界另行确认；本方案不授权提交、推送或部署。

## 页面、布局、SEO 与交互

- URL 固定 `/oval-face-icon-generator`，独立意图仍为 `oval face icon generator`。Title、description、H1、canonical、index、sitemap、OG/Twitter、三个 JSON-LD 的输出值保持；不增页、不迁址、不改关键词口径。
- 保留现有顺序：导航 → 标题/简介/播放器（桌面右侧 More Avatar Games）→ Curated Icon Ideas → About → How-to → Features → Tips → Troubleshooting → FAQ → Related → 原页脚。桌面/移动结构、CSS、文案、图片文件和原有锚点不改。
- Play Now 仍为原锚点入口，不改成新的自动激活行为；封面/控制条继续点击或键盘激活同一个播放器。保留 Loading、Reload、Fullscreen、Report、FAQ、侧栏、Gallery 和返回链路。
- Ruffle/WASM/SWF 继续用户激活后加载；不修改 SWF、适配器、服务工作线程或已验收 Square。仅向客户端传必要的 19 项播放器值，不传整份 Record。
- **唯一计划中的输出属性例外**：PNG 文件头实测封面为 `974×775`，Record 和现有 img 声明却为 `972×774`。拟将 COVER 元数据及派生 img 的 width/height 修正为真实尺寸；播放器 `aspectRatio="972 / 774"`、`maxWidth="972px"`、预留容器和图片文件不变。视觉/几何是否保持须实现后实测，不能预先声称通过。

## 绑定清单

| 当前事实 | 确认后实施 |
|---|---|
| 3 How-to、6 Features、5 Tips、5 FAQ 与 Record 逐项完全相同 | 删除四组页面重复定义，直接读取相应字段；五条 Tips 全部保留 |
| 19 项有效播放器输入中 14 项显式、5 项继承默认 | 从 Record/类型化呈现字段派生全部 19 项；新增显式值为 `reportHref=/contact`、`startLabel=Start Game`、`reloadLabel=Reload`、`helpLabel=Game Help`、`showStartControl=true`，其余原值保持，尺寸例外见上 |
| Hero、卡片说明、About、段落标题、4 条排错、VideoGame description 散落页面 | 在可选且运行时校验的 `content.legacyPage` 中保存这些既有文字；不改通用 summary/description、权利、日期或语义评分，也不改 Square 的 `content.homepage` |
| Oval 的 `relatedGameIds` 已指向 Square/Pixel，页面仍写死游戏目的地 | 用现有 Catalog/public-route 规则解析这两个已有游戏入口及底部 Square 链接；保留现有名称、描述、图片 alt、顺序和布局。排除自身/重复/未知/不可公开记录，不硬编码新的游戏 URL |
| 侧栏还混有指南/Gallery/Blog 等资源；Gallery 使用已共享的 curated 数据 | 资源链接与六张 curated 示例保持各自来源，不把资源冒充游戏，不新造社区数量/原创/授权声明 |
| 可见 FAQ 与 FAQPage 共用页面数组 | 改为共用 Record FAQ；保留 VideoGame/FAQPage/BreadcrumbList 三份原输出与元数据 builder |

拟应用文件仅 4 个：`lib/games/game-schema.ts`、`data/games/oval-face.ts`、新增 `lib/games/oval-legacy-page.ts`、`app/oval-face-icon-generator/page.tsx`。不改 `FlashGenerator`、`GamePlayer`、`GameDetailTemplate`、通用 model/权限规则、路由规则或全站样式。

## 确认后的验证与验收门

1. 新增 `oval-page:check`：固定当前 SSR/metadata/原始内容基线；除唯一封面 img 两个尺寸属性外输出等价。覆盖 19 项逐字段转发、内容绑定、Related 双向链接、缺字段/错误路径/非法尺寸/未知关系、通用 UNKNOWN 仍拒绝等反例。
2. 既有 `square-home:check` 当前冻结整个 Oval 源文件。只允许针对“新增 legacyPage + COVER 两个尺寸”的精确适配：移除该新增块并还原两个标量后，证明原 Oval 数据契约未变；Square 的 8 语言真实 SSR、19 参数、绑定/转发/反例与其余冻结文件继续原样检查。不得直接刷新黄金快照来消除失败。其它旧检查如受影响，也须先证实精确变化并保持原输出契约。
3. 执行完整 type/lint、相关及既有回归、Next build、Cloudflare/OpenNext build；在当前产物启动的本地生产预览核查 raw HTML、sitemap、robots 和 20 页 SEO。沿用 v2.1；既有 12 should/KW-04 不在此次顺手优化。
4. 浏览器核查 Oval 的 1280/390/360 宽度、首屏/图片尺寸修正、无横向溢出、Play/Enter/Space、loading-visible→ready、Reload、FAQ/排错、Gallery/内链/Back 和控制台；回归 Square 及必要的草稿页面。记录激活前后资源和容器几何，不把它当 CWV；真实全屏/全部 SWF 内部控件未测则如实标记。
5. 证据写回原看板后只设 `待验收`，等待用户验收**本地阶段**。`templateMigrationCompleted=false` 与发布 P0 保留，不能自动宣告整个统一模板目标完成或推进 Pixel。

当前仅完成只读代码/SSR/既有构建快照核对：150 项源码、21 份既有 JSON、52 张截图、15 个构建产物保持。未实施以上绑定或图片字段修正，未重跑完整 type/lint/回归/构建/HTTP/SEO/Browser/移动/CWV，也未确认预览服务当前存活。旧 v1.63 QA 保留原日期，不作为本轮新验证。

原始核对与差异见 `docs/quality/evidence/mig-oval-001/proposal-checks.json`。治理改动可仅逆向本轮文档/看板补丁；没有应用或线上回滚事项。

确认语句：**确认 MIG-OVAL-001 本地数据绑定方案，进行开发**。
