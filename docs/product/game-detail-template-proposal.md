# GAME-TPL-001 · 统一 Game Detail Page Template 方案（已实施，待验收）

> 方案状态：`已实施，待验收`  
> 当前任务：`GAME-TPL-001`  
> 前置验收：用户于 2026-09-01 明确回复 `确认验收，进行下一步开发`，`PERF-HOME-001` 已验收  
> 方案确认：用户于 2026-09-01 明确回复 `确认 GAME-TPL-001 方案，进行开发`  
> 预计影响：新增可复用详情模板，并让现有 `/games/[slug]` 未来路由边界在资格通过时调用该模板  
> 发布权限：只允许本地实现、检查、证据与看板回写；未授权提交、推送或部署

## 1. 当前事实与任务边界

- `PLAYER-001`、`COMP-001`、`META-001` 已验收：五类 Player adapter、十个共享组件、Game Data metadata/H1 builder 都已存在。
- 当前 `/games/[slug]` 仍是 fail-closed 路由门。仓库没有任何符合“非 legacy + PUBLISHED + 正确 `/games/{slug}` + 权利允许”的新记录，因此当前所有新 slug 都返回真实 404；符合条件的未来记录也仍被 `forceNoIndex` 保护。
- `GameMeta` 与 `RelatedGames` 已完成但尚未挂到详情模板；`AdSlotShell` 保持未挂载且不加载广告脚本。
- 现有 `/`、`/oval-face-icon-generator`、`/pixel-art-avatar-icon-generator` 仍由各自页面实现。它们分别属于后续 `MIG-SQUARE-001`、`MIG-OVAL-001`、`MIG-PIXEL-001`，本任务不迁移、不重排、不改 URL。
- Square 与 Oval 的精确许可仍为 `UNKNOWN / REVIEW_REQUIRED`；Pixel 仍为 `RESTRICTED / DIRECT_LINK_ONLY`。模板必须原样显示事实，不能把 UNKNOWN 写成允许。
- 当前 Game Data 有短摘要 `content.summary`，但没有独立长描述字段。为避免重复摘要或把 SEO description 当正文，确认后的实现将只做一个向后兼容的可选字段：`content.description: readonly string[]`。现有记录只允许搬入当前页面已经存在并核对过的事实句；不新增权利、作者、功能或热度声明。
- `howToPlay`、`features`、`tips`、`faq` 继续保持发布记录的非空质量门；模板仍逐模块检查运行时数据，缺失时不渲染空壳，但不会借“条件渲染”放宽薄页准入。

## 2. 视觉概念与用途

- [桌面首屏概念](./concepts/game-tpl-001-desktop-first-viewport-concept.png)
- [桌面中段内容概念](./concepts/game-tpl-001-desktop-content-concept.png)
- [桌面 FAQ / Source & Rights / 更多游戏概念](./concepts/game-tpl-001-desktop-trust-and-navigation-concept.png)
- [移动首屏与 Related 延续概念](./concepts/game-tpl-001-mobile-first-viewport-concept.png)

四张图由内置 Image Gen 生成并经定向复核，只用于确认布局、层级、密度、图标语义和响应式延续；不作为生产网页截图或可发布图片。Oval 只作为现有 Game Data 的内部示例，不代表本任务迁移 Oval。生产实现继续使用真实 Game Data、现有图片和代码原生 HTML 控件，不把概念图嵌入页面。

视觉沿用现有站点，不另起设计系统：`#fffaf1` 背景、`#fffdf8` surface、`#d8f5e1` mint、`#19c58d / #08795e` green、`#ff7a1a` orange、`#3f3028` 正文、`#efd8b7` 边框、`8px` 圆角和克制阴影。内容容器为现有 `1120px`；不新增字体、第三方设计库、大渐变、装饰插画、卡片墙或大型圆角外壳。

## 3. 固定页面顺序

```text
SiteHeader
  ↓
Breadcrumb：Home / Games / {game.name}
  ↓
H1 + 一句真实 summary
  ↓
Player preview / External open panel
  ↓
Controls + 状态 + device notice
  ↓
Metadata facts
  ↓
Related avatar games（非空才显示）
  ↓
How to play（非空才显示）
  ↓
About / Description（content.description 非空才显示）
  ↓
Features + Tips（各自非空才显示）
  ↓
FAQ（非空才显示）
  ↓
Source & Rights
  ↓
More avatar games / category navigation
  ↓
SiteFooter
```

- Breadcrumb、H1、短摘要之后立即进入玩家区域；不得在 Player 前插入长篇 SEO 正文、广告、推荐卡或营销 Hero。
- 页面只有一个 H1；不用 H1 上方的 hero eyebrow、badge 或 popularity 标签。
- Related 是与当前记录明确关联的游戏；More avatar games 是返回目录、分类和 Square 核心页的导航，两者语义分开。
- `AdSlotShell` 不在本模板挂载。广告布局属于后续 `ADS-001`，不能在没有广告策略与真实填充测试时提前占用首屏。

## 4. 首屏与桌面布局

- 桌面验证目标为 `1440 × 1100`，补查 `1280 × 900`。页面使用单一 1120px 主列，不把 H1/正文做成独立营销侧栏。
- Breadcrumb 后是 `getGamePageH1(game)` 与 `game.content.summary`；允许的首屏动态文案仅限当前面包屑、H1、summary、Player 标签、控制条和事实字段。
- GamePlayer 使用 Game Data cover 与稳定 `aspect-ratio`。Ruffle、HTML5 和 iframe 类型都保持用户激活后才创建 adapter；External Tool 直接显示明确的原站边界和 `Open Original`，不出现假的 Play / Fullscreen / Reload。
- Playable 控制条复用 `GameControls`：Play、Fullscreen、Reload、Report Issue 按 capability 显示。状态使用现有 `aria-live`，加载/错误/重试在同一预留 surface 内完成。
- Player 后复用 `GameMeta`，以横向 definition-list rail 展示 Experience、Category、Mobile、Fullscreen、Source；不用评分、热度、发布日期或作者占位。

## 5. 移动布局

- 主要验收宽度 `390px`，补查 `360px`、`430px`；DOM 顺序与桌面一致，不用 CSS 反转阅读或 Tab 顺序。
- Header 延续当前短品牌、Play 与 Menu 行为；Breadcrumb 可换行，不能挤出视口。
- H1 与 summary 后立即是全宽 Player。播放器图片按 Game Data 比例缩放，不能裁掉核心画面或产生横向滚动。
- Fullscreen 与 Reload 两列，Report Issue 跨整行；External Tool 只保留真实外链与 Report Issue。触控目标至少 `44px`，focus-visible 不能被裁切。
- Metadata 在移动端改为单列事实行；Related、How-to、Features/Tips、FAQ、Rights 和 More Games 依次纵向堆叠。
- FAQ 使用原生 `details / summary`；折叠只改变可见状态，答案始终存在于服务端 DOM。

## 6. 数据与条件渲染合同

`GameDetailTemplate` 接收经过验证的 `GameRecord` 与对应 `GamePlayerModel`。默认的新游戏路由通过 `createGamePlayerModel(game)` 构造模型；后续 legacy 迁移可显式传入已核对的兼容模型，避免本任务擅自绕过 Square/Oval 的权利门。

| 模块 | 数据来源 | 空数据行为 |
|---|---|---|
| Breadcrumb / H1 | route + `seo.h1` | 必填；失败即抛错，不输出薄页 |
| Summary / Description | `content.summary` / 可选 `content.description` | summary 必填；description 空则整个 About 模块不输出 |
| Player / Controls | `GamePlayerModel` + capability | policy 不允许则 fail closed；External 不伪装可玩 |
| Metadata | pageType/category/mobile/fullscreen/source | 必填事实；不猜 unknown 值 |
| Related | `relatedGameIds` + published/public route gate | 0 条则不输出 heading、section 或 empty state |
| How-to / Features / Tips / FAQ | 对应 Game Data 字段 | 逐模块非空渲染；不生成占位文案 |
| Source & Rights | `source` + `license` | 总是显示事实；null attribution/original URL 不输出空行 |
| More Games | `/games`、真实非空分类与 `/` | 普通服务端 `<a>`；不使用随机或 JS-only 导航 |

Source & Rights 映射锁定为可理解的公开值：Provider、License status、Release decision、Delivery boundary，以及有数据时的 attribution/original URL。`UNKNOWN` 显示明确提醒“UNKNOWN does not mean permission”；`DIRECT_LINK_ONLY` 显示只能访问原站；不得显示 Verified/Authorized，除非 Registry 的证据状态确实允许。

## 7. SEO 与结构化数据

- 本任务不改变任何现有 URL、title、description、canonical、robots、indexability、sitemap membership、语言 alternate 或搜索意图。
- `/games/[slug]` 继续由 `resolveNewGameSlug` fail closed，metadata 继续使用 `buildGameMetadata(game, { forceNoIndex: true })`。何时允许索引留给内容质量、目录与发布任务，不因模板完成自动开放。
- 模板 H1 只能来自 `getGamePageH1(game)`；可见 summary、How-to、Description、Features、Tips、FAQ 都来自 Game Data，不从 title/keyword 自动拼正文，不按旧 3%–5% 密度口径插词。
- 确认后新增小型结构化数据 builder，且只标记页面上真实可见的模块：`BreadcrumbList`；FAQ 存在时才有 `FAQPage`；`GAME` 可使用保守的 `VideoGame`；`EXTERNAL_TOOL` 只使用 `WebPage` 边界，不输出暗示本站托管、拥有或可玩的 `VideoGame / WebApplication` 声明。
- 不输出 `aggregateRating`、review、user count、author、datePublished/dateModified 或 performance 字段，除非未来 Game Data 有已验证事实且另经任务批准。
- 当前 Pixel 的既有 legacy schema 与模板迁移留给 `MIG-PIXEL-001`；本任务不改其公开结构化数据。

适用规则：IA-01～IA-03、IDX-01～IDX-07、META-01/02/05/06/09、KW-01～KW-07、LINK-01/04/07/08、CT-01～CT-07、PS-02/03/06/07、PF-02/04/05、AY-01/03/05/06、OP-05/09。

## 8. 组件与样式实施清单

确认后按最小结构实施：

1. 新增 `components/game/GameDetailTemplate.tsx`，只负责页面组合与 section 条件渲染。
2. 新增小型 `GameFaq` 与 `GameSourceRights` 组件；复用现有 `GameBreadcrumb`、`GamePlayer`、`GameMeta`、`RelatedGames`、`GameGrid` 与 `SiteHeader / SiteFooter`。
3. 为 `content.description` 做兼容性 schema/validator 扩展，并给三条现有记录录入已存在、可核对的事实文本；现有公开页面暂不读取该字段。
4. 新增安全的 game-detail structured-data builder，并验证 External Tool 不产生本站可玩/拥有暗示。
5. 将 `app/games/[slug]/page.tsx` 的 future route summary shell 替换为模板调用；resolver、static params、404 与 `forceNoIndex` 不变，因此当前没有新增可访问页面。
6. 在 `app/globals.css` 新增 `.game-detail-*` 范围样式，复用现有 token；不重写全站样式或当前 legacy 页面类名。
7. 新增 `npm run game-template:check` 与隔离 TypeScript 配置，覆盖结构、数据、SEO、rights、player type 和缺省分支。

图标只使用现有 Lucide 风格：Play、Maximize、RotateCcw、Flag、Monitor、Grid、Smartphone、File/Search、Chevron、ExternalLink。不得把 Source & Rights 画成带勾的认证盾牌；使用中性的文档检查图形，避免视觉上暗示许可已通过。

## 9. 确认后的验证计划

- 自动检查：`game-template:check`、`games:check`、`player:check`、`routes:check`、`components:check`、`metadata:check`、任务范围 TypeScript/ESLint、runner `node --check`、JSON parse 与 `git diff --check`。
- Fixture 矩阵：RUFFLE_SWF、HTML5、LOCAL_IFRAME、OFFICIAL_IFRAME、EXTERNAL_LINK；另测无 Related、无 description、单模块缺失、UNKNOWN rights、DIRECT_LINK_ONLY 与 policy blocked。
- 断言初始服务端/水合页面没有 Ruffle runtime、WASM 或 SWF 请求；只有 Play 后才创建对应 adapter。
- 浏览器检查 `1440 × 1100`、`1280 × 900`、`390 × 1200`，补查 `360 / 430`：首屏 Player、控制条、focus/Tab、FAQ、External 边界、Rights 提醒、普通内链、错误/重试、无横向溢出。
- 因当前没有可路由的新记录，浏览器 QA 使用临时的本地 APPROVED fixture 挂载模板；截图完成后必须删除 fixture，并重新证明该 slug 返回 404、未进入 sitemap、没有留在最终代码。
- 每段实现截图分别与四张概念图用 `view_image` 对照，记录至少五项 fidelity：文案、首屏比例、控件、颜色/字体、container/radius、移动堆叠、Source & Rights 图标语义。
- 完整运行 `npx tsc --noEmit`、`npm run lint`、`npm run build`、`npm run cf:build`。若仍被既有 `app/sitemap.ts` P0 解析错误阻断，按失败记录，不能写成通过。
- 只有形成可运行的本地 production build 才执行 `npm run seo:check`；没有部署授权，不运行 `seo:prod`。

## 10. 明确不在本任务范围

- 不迁移或重排 `/`、Oval、Pixel；不修改 SWF、本地游戏文件、外站内容或 Pixel delivery boundary。
- 不上线 `/games` 目录、不让分类 index、不新增 public game record、不修改导航或 sitemap。
- 不实现 Related 评分算法、Recently Played、Favorites、analytics、Popular/Trending、UGC 或搜索。
- 不发布自动生成内容，不为每个游戏机械凑字数；页面独特内容规则仍由后续 `CONTENT-QA-001` 完成。
- 不挂广告或广告占位，不做 CMP/ads.txt 变更。
- 不顺手修复既有 `app/sitemap.ts`、HTTP→HTTPS、生产移动 LCP/INP、Square/Oval 精确许可或既有 KW-02 findings。
- 不提交、不推送、不部署。

## 11. 回滚

若实现后退回：删除新增 Template/FAQ/Rights/structured-data/check 文件，恢复 `/games/[slug]` 的只读 future shell，撤回 `.game-detail-*` 样式和可选 description 字段/记录，删除临时 fixture 与概念对照实施截图。现有 Game Data、Player、Components、Metadata、route resolver、legacy 页面、URL、索引、SWF 和部署状态不需要数据迁移回滚。

## 12. 用户确认

请确认以下完整边界：

- 采用四张概念图的单列 Player-first 模板；
- 首屏只放 Breadcrumb、H1、真实 summary、Player/Controls/状态与事实 Metadata；
- 中下段固定为 Related → How-to → 条件式 Description → Features/Tips → FAQ → Source & Rights → More Games；
- 新 route 继续 404/noindex fail closed，现有三个公开游戏不在本任务迁移；
- 不挂广告、不改 URL/索引/metadata 文案、不提交/推送/部署。

用户已于 2026-09-01 明确回复 `确认 GAME-TPL-001 方案，进行开发`。该确认只授权按本文件与四张概念图实施 GAME-TPL-001：不迁移现有三个公开游戏，不改变 URL、metadata、索引或 sitemap，不提交、推送或部署。实现完成后任务必须进入 `待验收`，等待用户逐项验收。

## 13. 方案确认前历史校验记录

2026-09-01 在未实现模板、未改变生产路由的前提下完成：

- `npm run games:check`：通过；3 条记录、关系、License Registry、SWF hash、资产与 External direct-link boundary 保持有效。
- `npm run player:check`：通过；五类 adapter、capability、click-to-load 与 policy fail-closed 保持有效。
- `npm run routes:check`：通过；legacy URL、future route 资格门、五类 allowlist、noindex 与真实 404 保持有效。
- `npm run components:check`：通过；十个共享组件存在，External controls 与 AdSlotShell 边界保持有效。
- `npm run metadata:check`：通过；Game Data metadata/H1、legacy canonical、future noindex 和缺字段 fail-closed 保持有效。
- 权威看板 JavaScript 语法、版本 `1.29`、PERF source acceptance、GAME-TPL current focus/proposal path、四张概念与方案文件存在性、`git diff --check`：通过。
- `app/sitemap.ts` SHA-256 仍为 `B21AEF365B81499147B4DAAF12F11A6802402D391185CD85E27E8BB6B34CEDD9`，证明本方案未改该既有阻断文件。
- `npx tsc --noEmit`、`npm run lint`、`npm run build`、`npm run cf:build`：均失败于既有 `app/sitemap.ts` 解析错误；不是本方案通过。
- `seo:check`：未验证，因为没有 production build；`seo:prod`：未运行，因为没有部署授权。
- 浏览器实施与概念 fidelity：在当时尚未执行，因为方案仍待确认且没有模板实现；结果见第 14 节。

当时结论：方案依赖与记录 `通过`；模板实现状态 `未开始`；全局发布状态 `不通过`。

## 14. 实施与待验收记录

2026-09-01 按用户确认边界完成本地实施，当前状态只进入 `待验收`：

- 新增 `GameDetailTemplate`、原生 FAQ、事实型 Source & Rights、保守 structured-data builder、可选 `content.description` 与 `.game-detail-*` 范围样式；future route 已改为模板调用，但 resolver、真实 404 与 `forceNoIndex` 不变。
- External Tool 只出现 `Open Original Page` 和 `Report Issue`，安全外链为 `_blank + noopener noreferrer`；模板 JSON-LD 只输出 WebPage，不输出 VideoGame/WebApplication。
- 浏览器完成 `1440/1280/430/390/360` 响应式检查、FAQ/Related/More/rights 交互与四张概念逐图对照；无横向溢出。移动 Fullscreen/Reload 为两列、Report 跨行，页头 Play 触控高度为 44px。
- 初始页面无 Ruffle/WASM/SWF。使用现有本地 Oval SWF 的临时记录完成真实激活复测：`idle → ready`，Ruffle 元素为 1，状态为 loaded，surface 在前后保持 `980 × 780.359`、document top `268.828`，fresh-tab console 无 warn/error。
- External 与 playable 临时 QA records 均已删除；临时 slug 最终返回 HTTP 404、noindex、无模板 DOM，代码中无 fixture 引用或 sitemap 备份。
- `game-template:check`、games/player/routes/components/metadata、五项 homepage 回归、范围化 ESLint、runner/JSON 与 `git diff --check` 通过。静态渲染 check 仍显示已知 React 18 `fetchPriority` casing 提示；水合浏览器无相应 warn/error。
- 真实工作树上的 `npx tsc --noEmit`、`npm run lint`、`npm run build`、`npm run cf:build` 仍全部失败于未修改的 `app/sitemap.ts:1`；其 SHA-256 已原样恢复为 `B21AEF365B81499147B4DAAF12F11A6802402D391185CD85E27E8BB6B34CEDD9`。因此 `seo:check` 未验证，`seo:prod` 未运行，全局发布继续 `不通过`。
- 持久证据：`docs/quality/evidence/game-tpl-001/README.md`。无 commit、push、部署或生产写入。

任务实施证据为 `通过`，但人工验收尚未发生。用户明确回复 GAME-TPL-001 验收通过前，不标 `已完成`，也不启动 `MIG-SQUARE-001`。
