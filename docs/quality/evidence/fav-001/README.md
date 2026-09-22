# FAV-001 本地实施与验收证据

> 记录时间：2026-09-07T10:46:24.4334021Z  
> 看板版本：v1.89  
> 当前状态：`待验收`  
> 用户确认：`确认 FAV-001 方案，进行开发`

## 结论

`FAV-001` 已按确认方案完成本地实现。专项检查、TypeScript、零警告 lint、相关冻结回归、Next.js/OpenNext 构建、本地 production HTTP/SEO/robots 检查和真实浏览器交互通过。精确 1280×900、390×844、360×800 视口均无横向溢出；收藏控件高度为 44 CSS px，未收藏→收藏→取消的宽高保持不变。

当前只提交本地成果验收，不增加路线图完成数或源验收键。没有 commit、push、deploy 或 `seo:prod`。Square/Oval 权利仍为 UNKNOWN；人工事实审核、真机、其它浏览器、现场 CWV、广告/CMP 与生产门禁未被本任务关闭，全站发布结论仍为 `不通过 / 未部署`。

## 已实施范围

- 新增 `msfi-favorites-v1`，v1 只保存稳定 Game Data ID；去重、最近收藏置前，最多 50 条。
- 损坏 JSON、错误版本、非法/重复/未知/不可发布 ID 与读写异常 fail closed；收藏失败不阻断导航、Player 或 External Tool 主链接。
- Square、Oval 和 Pixel External 三条 published Game Data 均可保存；Pixel 的可见及无障碍文案始终是 `External tool`、`Save tool` / `Saved tool`。
- 共享 GameCard/GameGrid、Recently Played 卡片、Oval/Pixel legacy Related、首页、Oval/Pixel 详情入口和 future GameDetailTemplate 均接入同一行为。
- 卡片主链接与收藏按钮为兄弟节点，不存在 button-in-anchor；当前入口旁提供 `View favorites` 到 `/games`。
- `/games` 只在存在有效收藏时渲染 Favorites，位置在 Recently Played 之后、On-site 之前；无收藏时不输出标题、空状态或占位高度。
- 同标签页使用 `msfi:favorites-change`，跨标签页监听精确 key 的原生 `storage` 事件；刷新保留。
- 从 Favorites 删除时焦点移到相邻收藏按钮；删除最后一项时移到 `On-site avatar games` 标题，并由 live region 宣布结果。
- Privacy Policy 说明稳定 ID、用途、本机边界、无账号/个人信息/跨设备同步，以及再次按下按钮或清除浏览器站点数据的删除方式。
- URL、Title/description、H1、canonical、OG/Twitter、schema、robots/index、sitemap、搜索意图、Player/SWF 与 Recently Played key 均保持。

## 代码与文档

核心实现：

- `lib/favorites.ts`
- `lib/games/favorites.ts`
- `components/game/FavoriteToggle.tsx`
- `components/game/FavoritesSection.tsx`
- `components/game/GameCard.tsx`
- `components/game/GameGrid.tsx`
- `components/game/RecentlyPlayed.tsx`
- `components/game/GameDetailTemplate.tsx`
- `components/home/HomeHero.tsx`
- `app/games/page.tsx`
- `app/oval-face-icon-generator/page.tsx`
- `app/pixel-art-avatar-icon-generator/page.tsx`
- `app/privacy-policy/page.tsx`
- `app/globals.css`

专项验证与兼容层：

- `scripts/run-favorites-check.mjs`
- `scripts/validate-favorites.tsx`
- `scripts/favorites-compat.mjs`
- `scripts/favorites-markup-compat.ts`
- `scripts/validate-favorites-compat.mjs`
- `tsconfig.favorites-check.json`
- `package.json`
- `scripts/README.md`
- 既有目录、分类、Related、Recent、组件与首页冻结检查的有界 FAV 逆变换接入。

治理文档：

- `docs/product/favorites-local-storage-proposal.md`
- `PAGE_PLAN.md`
- `LAUNCH_CHECKLIST.md`
- `SEO_LOG.md`
- 权威 HTML 看板 v1.89

## 自动检查

- `npm run favorites:check`：通过；存储、顺序、50 条上限、非法输入、三条资格记录、非嵌套结构、详情操作、空 SSR、焦点、隐私、无网络和精确 pre-FAV 兼容哈希均通过。
- `npx tsc --noEmit`：通过。
- `npm run lint`：通过，0 warning / 0 error。
- `npm run build`：通过；Next.js 14.2.35 共 42 页，`/games` 15.2 kB / 117 kB。
- `npm run cf:build`：通过；OpenNext worker 已生成，build ID `mWjiOpm1VaKo3fn7FXuFq`；只保留 Windows compatibility warning。
- 源/SSR 回归：games、player、routes、components、metadata、home、home-hero、home-discovery、home-gallery、perf-home、game-template、games-index、CATEGORY 两阶段、RELATED、RECENT、Square、Oval、Pixel、Locale、Terms、About、Editorial、Gallery、canonical 均通过。`game-template` 仅保留既有 React `fetchPriority` SSR warning。
- 最终构建 built/HTTP：games-index 338/62；CATEGORY sample 587/90、598/90；CATEGORY remaining 386/182、397/182；Oval、Pixel、Locale、canonical 与 Privacy 披露通过。
- 本地 production SEO：20 URLs，0 mandatory，12 个既有 should（KW-03 1、META-03 7、META-04 4）。
- robots：6 blocked、5 allowed；本地策略通过。
- 权威看板：完整内联脚本语法与状态模型通过；实际渲染显示 `FAV-001 / 待验收 / 23/60 / 34 个验收键`，验收与退回按钮可用，导出版本为 v1.89。

## 浏览器验证

在 `http://127.0.0.1:3100` 的本地 production build 上完成：

- 首页 Favorite 变为 Favorited，`aria-pressed` 0→1，live 文案正确，Play 仍是主操作。
- `/games` 出现 1 条 Square Favorites；保存 Pixel 后显示 2 条，Pixel 最新置前且仍写 `External Tool` / `Saved tool`。
- 从 Favorites 删除 Pixel 后焦点落到 Square；删除最后的 Square 后模块消失，焦点落到 `On-site avatar games` 标题。
- 第二个 `/games` 标签页在第一标签页收藏 Square 后无需刷新即出现 Favorites，原生跨标签同步通过。
- Oval hero 保持 Play、How to Play、Favorite、View favorites 顺序；Pixel hero 保持 Open Original 为主操作，之后是 Save tool 与 View favorites。
- 1280×900：`clientWidth=1265`、`scrollWidth=1265`，2 条 Favorites 布局清晰，console error 0。
- 390×844：首页与 `/games` 的 `clientWidth=scrollWidth=390`；按钮分别 346×44、326×44 CSS px，console error 0。
- 360×800：首页与 `/games` 的 `clientWidth=scrollWidth=360`；按钮分别 316×44、296×44 CSS px，console error 0。
- 390px 未收藏→收藏→取消循环中按钮始终 346×44，页面 scrollWidth 始终 390；交互归因 shift 为 0.009399，非输入 shift 合计约 0.000055。该本地 trace 只证明本控件几何稳定，不等于生产 CWV。

浏览器截图用于本轮人工视觉检查，保存在任务临时目录并在收尾清理，不作为仓库资产提交；精确数值已固化在 `checks.json`。

## 未验证与失败留痕

- `未验证`：真机、Safari/Firefox、生产环境、生产真实 CWV、`seo:prod`、广告/CMP 和全站人工事实审核。
- `不通过`：全站发布门禁；Square/Oval 权利证据仍为 UNKNOWN，不能由收藏功能或本地检查替代。
- 初次用 Edge `--window-size` 的截图受到外窗最小宽度裁切，未作为移动证据；随后用 DevTools device metrics 得到真实 390/360 CSS viewport 并复测通过。
- Privacy 删除方式补充后，第一次兼容检查因批准片段未同步而失败；已更新有界 inverse，最终专项与精确 pre-FAV 哈希复测通过。
- 最终 HTTP Privacy 检查首次因 PowerShell 将 curl 输出拆成数组而误报；改为 `Out-String` 后在同一构建上确认日期与删除说明均存在。该失败属于验证命令问题，不是页面失败。
- `robots:check` 的 package script 固定指向 3000，那里有旧服务；本轮使用同一脚本的 `--base http://127.0.0.1:3100` 对当前构建验证通过。

## 人工验收步骤

1. 打开 `http://127.0.0.1:3100/`，确认 Play 仍为主按钮，Favorite 与 View favorites 在其后；点击后变为 Favorited，刷新仍保留。
2. 打开 `/games`，确认 Favorites 在 Recently Played（若存在）之后、On-site 之前；无收藏时整个模块隐藏。
3. 在 Pixel 页面或目录保存工具，确认显示 Save tool / Saved tool，进入 `/games` 后 Pixel 保持 External Tool 且排在最新位置。
4. 在两个 `/games` 标签页之间收藏/取消，确认另一标签页无需刷新同步。
5. 从 Favorites 依次删除项目，确认焦点先到相邻按钮，最后一项删除后到 On-site 标题。
6. 检查 Oval、Pixel 和页尾 Related 的按钮与主链接可分别键盘操作，没有嵌套或遮挡。
7. 检查 Privacy Policy 的 September 7, 2026 日期、稳定 ID、本机保存和删除说明。

通过后回复：`FAV-001 验收通过`。

## 回滚

移除 Favorites 组件在共享卡片、Recent、current/future 详情和 legacy Related 的接入，删除 `/games` 条件模块、Privacy 增量、本任务样式与验证脚本即可回滚。浏览器中既有 `msfi-favorites-v1` 可安全保留（模块移除后不会读取），或由用户取消收藏/清除站点数据。回滚不得触碰 `msfi-recently-played-v1`、Game Data、URL、metadata、索引、Player/SWF、RELATED/CATEGORY 或既有用户验收。
