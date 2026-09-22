# MIG-SQUARE-001 · Square 首页数据绑定方案

> 当前 v1.64 · 2026-09-03：用户已明确验收 MIG-SQUARE-001 本地数据绑定，任务本地已完成；证据 `docs/quality/evidence/mig-square-001/acceptance-checks.json`。完整通用许可模型迁移/真实许可/生产发布不在该验收内。用户要求下一步，现只准备 Oval 本地阶段方案。
>
> 以下保留 v1.63 方案头部及 v1.62 原始方案正文，用作历史范围对照；其中“待验收”描述当时状态，当前状态以权威看板为准。

> 2026-09-03 · 当前看板 v1.63 · 方案已确认，本地实施完成，待用户验收。
>
> 已收到 `确认 MIG-SQUARE-001 方案，进行开发`。本地绑定及范围 QA 已完成，证据见 `docs/quality/evidence/mig-square-001/README.md` 和 `docs/quality/evidence/mig-square-001/checks.json`；尚未收到实施验收，不启动下一项，不提交、推送或部署。
>
> LICENSE-GATE 与累计发布继续暂缓，UNKNOWN 与通用许可拒绝策略不变。以下保留 v1.62 原始方案正文（含当时“确认后”“尚未实施”等时间口径），用于对照确认范围，不是当前进度声明。当前状态以权威 HTML 看板为准。

## 1. 本次交付边界

保持 Square 的特殊首页布局，把首页实际使用的播放器入参、游戏正文和 FAQ 接入同一 Square Record。已有 metadata、H1、推荐与分类绑定不重做。

当前通用 `createGamePlayerModel(squareFaceGame)` 会因 `allowedDeliveryTypes: []` 拒绝该记录；本轮只读调用确认了这个预期拒绝。不能为了迁移把 UNKNOWN 改成允许，也不添加 localhost 豁免或临时“已授权”记录。因此，本地阶段保留已经验收的 `FlashGenerator → GamePlayer` 兼容路径，仅统一其 19 项页面级可配置输入。**完全移除兼容层、直接使用受许可校验的通用模型，不属于这次本地交付**，须待许可门恢复后另行确认；不得据此宣称完整模型迁移或发布门已经通过。

## 2. 当前代码与剩余改造

| 部分 | 已有实现 / 当前差异 | 确认后改造 |
|---|---|---|
| URL / metadata / H1 | `/` 经 legacy resolver 读取 Square Record，metadata/H1 已统一 | 保持 `app/page.tsx`、metadata builder、路由及全部 SEO 值 |
| Hero / Player | 首页已传 name、SWF、cover、背景和比例，但仍继承 7 项默认值 | 从记录派生全部 19 项入参；客户端只接收 Hero 文案与必要播放器字段，不序列化完整 GameRecord |
| Features / FAQ / Tips | 6 / 6 / 5 条与 Record 逐项相同；当前 Tips 仅显示前 4 条 | 删除页面内这三组重复定义，直接读取 Record；继续只显示 4 条 Tips |
| How-to | 3 条中第 1、3 条与 Record 措辞不同 | 将 Record 两句对齐已经验收的页面原文，再绑定；不改可见文案 |
| 其余 Square 正文 | Hero、What Is、Tips 导语、收尾 CTA、VideoGame description 仍散落组件 | 在 Record 的类型化 `content.homepage` 中存放首页专属呈现文本；保留通用 `content.summary/description/sections`，避免连带改变目录卡片和其他模板 |
| FAQ schema | 当前与页面 FAQ 共用局部数组 | 改为可见 FAQ 与 FAQPage 共用 `record.faq`，三个 JSON-LD 对象的输出值不变 |
| 共享草稿 | 7 个语言页共用 HomePage，但保留旧布局 | 仅接受相同数据来源调整，渲染、语言状态与 LOCALE-001 短句不变；不开展多语言上线 |

How-to 以当前页面这两句为准，不采用另一套略短的 Record 文字：

1. `Wait for the Flash game to load in the player above, then press the START button inside the game.`
2. `Try different combinations until you make a funny or cute square face icon. If the original game does not include a save button, you can take a screenshot of your creation.`

7 项目前继承的值为 `ariaLabel`、`coverLabel`、`loadingMessage`、`errorMessage`、`slowLoadingHint`、`deviceNotice`、`maxWidth`。确认后原样保存到记录的首页播放器呈现字段；不以通用 builder 的不同默认文案替换它们。其余 12 项显式值、970 × 844 cover、690 / 600 比例及 980px max-width 保持。

建议数据结构：`content.homepage` 包含 `hero`、`about`、`headings`、`tipsIntro`、`finalCta`、`videoGameDescription`、`playerPresentation`。现有 `features/howToPlay/tips/faq` 不再复制进该对象。新增服务端纯函数 `resolveSquareHomepage` 校验 Square 身份、根路径、Ruffle 类型、完整 cover 与呈现字段；缺数据直接报错，不静默回落到页面硬编码值。通用 schema 将该扩展设为可选，其他游戏无需伪造首页字段。

## 3. 布局、SEO 与交互冻结

- 模块顺序不变：Hero → Discovery → Curated Icon Ideas → What Is → Features → How-to → Tips → FAQ → Resources → final CTA。桌面左右首屏与手机单列不变，不新增设计图或重做 CSS。
- `/` 仍承担 `square face generator` 意图；Title 为 `Square Face Generator - Classic Flash Avatar & Icon Maker`，H1 为 `Square Face Generator`。description、canonical、OG/Twitter、robots、sitemap、全部 href/锚点、三个 JSON-LD 不变，不生成 `/games/square-face-generator` 副本。
- `/es`、`/vi`、`/ja`、`/th`、`/ar`、`/ru`、`/id` 仍 noindex/follow、自引用 canonical、无 hreflang、不进 sitemap；Arabic rtl 保留。已验收侧栏短句 `Style examples; approved posts when available.` 原样保留。
- Hero CTA 与 cover Play 仍操作同一个播放器；保留 ref、键盘 Enter/Space、loading 先绘制、重载、全屏与 Report Issue。`GamePlayer`、Ruffle adapter、SWF、service worker、CSS 不改；Ruffle/WASM/SWF 仍仅点击后请求。
- Discovery、Gallery 数据和 Resources 保持各自现有来源，不把站点通用导航、UGC、其他工具或历史未渲染数据搬进 Square Record。Registry 的 UNKNOWN、空 allowedDeliveryTypes、时间戳、许可字段均保持；不新增来源或权利承诺。

## 4. 文件边界与验收

预计应用改动：`lib/games/game-schema.ts`、`data/games/square-face.ts`、新增 `lib/games/square-homepage.ts`、`components/HomePage.tsx`、`components/home/HomeHero.tsx`。CoreGamePreview 可沿用现有 props 转发，FlashGenerator / GamePlayer / 通用权限校验不改；若实施发现必须扩大此边界，先回到方案确认。

检查配套：新增 Square 绑定检查器与 npm/文档入口；按新数据接口调整 Hero 等受影响的任务测试。`check-locale-rights.mjs` 当前有整文件保护与局部源码反例，不能只改 hash 放行：须先证明批准的字段搬迁、八个页面的可见文本/链接/结构化数据/渲染契约保持，再更新仅受重构影响的保护条件；全部 19 个 source / 116 个 HTML / 4 个 sitemap 反例要等价保留或增强，原 v1.57/v1.58 证据不改写。

实施后至少提供：

1. 数据单一来源正例与负例：每组内容、19 项播放器入参均能追溯 Record；变更内存记录能传递到对应输出，缺字段/空 SWF/错误类型被拒绝；通用 builder 仍拒绝当前 UNKNOWN 记录，不运行 SWF 反例。
2. 重构前后比较首页与 7 个草稿的可见正文、标题、链接、三个 JSON-LD、DOM 结构与无障碍名称。RSC 或组件 props 的序列化变化单独解释，不误报成可见内容变化，也不笼统忽略 HTML 差异。
3. type、零警告 lint、所有相关回归、Next 与 Cloudflare/OpenNext 构建，保存超时、日志、退出码；本地 production HTTP / robots / sitemap / `seo:check`。既有 KW-04 未验证和 12 should 不自动关闭。
4. 浏览器 `/` 的 1280 / 390 / 360 宽度和 `/es`、`/ar` 共享回归：首屏、无横向溢出、单实例 Play、先 loading 后运行、重载、Report、FAQ、关键链接与键盘。记录首次资源请求及稳定容器，不以旧 PF-01 数值冒充新性能测量；无真实全屏/完整 SWF 内部验证时明确标注。
5. 仅将本地实施成果置为 `待验收`。等待用户确认后才开始下一项，仍不发布。

本轮只完成代码核对、现存产物读取和不变性检查；未做上述实施验证、type/lint/完整测试、构建、HTTP、浏览器、移动/CWV 或生产检查。历史 v1.58 产物及结果仅用于冻结基线，不是本轮复测。证据：`docs/quality/evidence/mig-square-001/proposal-checks.json`。看板文件视觉继续未验证，保留既有访问限制。

## 5. 发布、回滚与确认

质量监管 skill 保留许可和生产 P0，不把暂缓当成通过；React 性能规则要求最小客户端字段和按需运行资源。当前发布仍 `不通过 / 暂缓 / 未部署`；26 条已验收记录不变。

本轮仅方案/看板/治理增量，无应用或线上回滚。未来实现如退回，仅逆向本任务字段搬迁、绑定和测试增量；保留既有 LOCALE/页面成果、脏工作区、Registry、SWF 和用户的暂缓发布决定，不使用整仓回滚。

确认语句：**确认 MIG-SQUARE-001 方案，进行开发**。该确认只授权以上本地绑定范围，不授权更改许可、直接启用受限通用模型或部署。

