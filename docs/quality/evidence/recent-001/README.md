# RECENT-001 本地实施与验收证据

> 记录时间：2026-09-07T07:24:12.4747720Z  
> 看板版本：v1.86  
> 当前状态：`待验收`  
> 用户确认：`确认 RECENT-001 方案，进行开发`

## 结论

`RECENT-001` 已按确认的单页方案完成本地实施。专项检查、相关冻结回归、TypeScript、零警告 lint、Next.js/OpenNext 构建、本地 built/HTTP/SEO/robots 检查和 1280 CSS px 实际浏览器交互通过。内置浏览器的 viewport 覆盖未生效，实际宽度始终为 1280 CSS px，因此精确 390/360 移动视觉与带历史状态的 CLS 保持 `未验证`。

当前只提交本地成果验收，不增加路线图完成数或源验收键；`FAV-001` 未开始。没有 commit、push、deploy 或 `seo:prod`。Square/Oval 权利仍为 UNKNOWN，原 P0、广告/CMP、人工事实审核、真实 CWV 与生产门禁没有被本项关闭，全站发布结论仍是 `不通过 / 未部署`。

## 已实施范围

- 新增版本化浏览器存储 `msfi-recently-played-v1`，只保存 `gameId` 与 ISO `startedAt`；最多保存 8 条、显示 4 条。
- 无效 JSON、错误版本、非法 ID/时间、重复项和不存在/不可用的游戏记录均安全过滤；读取或写入失败不阻塞游戏启动。
- 只在可玩 Player 本次挂载第一次有效 `idle → Play` 时记录；同一游戏去重、更新时间并置顶。
- Square 与 Oval 通过既有 Game Data resolver 显式传入真实 ID；Reload、Retry、页面访问与 Pixel External Tool 均不记录。
- 英文首页 discovery 内、Related 之前条件式显示 `Continue Playing`；`/games` 在 hero 后、On-site 分组前条件式显示。
- 无有效历史时不输出标题、卡片、空状态或占位高度。
- 使用同标签自定义事件和跨标签原生 `storage` 事件同步；Clear 只删除本任务 key，提供 live announcement，并把焦点移到下一标题。
- Privacy Policy 可见更新时间改为 September 7, 2026，并披露稳定游戏 ID、启动时间、用途、清除方式、无账号同步与本机边界。
- URL、Title/description、H1、canonical、OG/Twitter、schema、robots/index、sitemap 和搜索意图不变。

## 代码与文档

核心实现：

- `lib/recently-played.ts`
- `lib/games/recently-played.ts`
- `components/game/RecentlyPlayed.tsx`
- `components/game-player/GamePlayer.tsx`
- `components/game/GameControls.tsx`
- `components/FlashGenerator.tsx`
- `lib/games/square-homepage.ts`
- `lib/games/oval-legacy-page.ts`
- `components/home/HomeDiscoveryRegion.tsx`
- `app/games/page.tsx`
- `app/privacy-policy/page.tsx`
- `app/globals.css`

专项验证与兼容层：

- `scripts/run-recently-played-check.mjs`
- `scripts/validate-recently-played.tsx`
- `tsconfig.recently-played-check.json`
- `scripts/recently-played-compat.mjs`
- `scripts/games-index-compat.mjs`
- `scripts/check-square-homepage.mjs`
- `scripts/check-oval-legacy-page.mjs`
- `scripts/check-locale-rights.mjs`
- `scripts/related-games-compat.mjs`
- `package.json`
- `scripts/README.md`

治理文档：

- `docs/product/recently-played-proposal.md`
- `PAGE_PLAN.md`
- `LAUNCH_CHECKLIST.md`
- `SEO_LOG.md`
- 权威 HTML 看板 v1.86

## 自动检查

最终结果：

- `npm run recent:check`：通过。
- `npx tsc --noEmit`：通过。
- `npm run lint`：通过，0 warning / 0 error。
- `npm run cf:build`：通过；Next.js production build 42 pages，OpenNext worker 已生成；build ID `Q4ukIJY87jlNStoksFbdV`。仅保留 Windows compatibility warning。
- 相关源/SSR 回归：player、routes、components、metadata、games、home、home-hero、home-discovery、home-gallery、perf-home、game-template、games-index、CATEGORY 两阶段、RELATED、Terms/About/Editorial/Gallery/Pixel/Square/Oval/Locale 均通过。`game-template:check` 仍只有既有 React `fetchPriority` SSR warning。
- 最终构建后的 canonical、SEO、robots、games-index built/HTTP、Oval built/HTTP、Locale built/HTTP 通过；同轮较早构建后的 Pixel、rights pages、categories、RELATED built/HTTP 也通过。
- SEO：20 URLs，0 mandatory，12 个既有 should（KW-03 1、META-03 7、META-04 4）。
- robots：6 blocked、5 allowed。

本机 C 盘没有可用空间，所有 npm/构建临时目录与缓存显式转到仓库内临时目录；最初的 `ENOSPC` 属于环境失败，不是应用检查结果。PowerShell/npm 环境中的 `npm run start -- -H ...` 未正确转发参数，验收服务改用 `npm run start` 在 `http://localhost:3000` 运行。

## 浏览器验证

在本地 production build 上完成：

- 1280 CSS px 下文档宽度与滚动宽度相等，无横向溢出。
- 空历史时首页不显示 Continue Playing。
- Square 首次 Play 后模块在同页立即出现；刷新后保留。
- Clear 后模块消失，live 文案为 `Recently played history cleared.`，焦点移到 `Related Avatar Games`。
- 清空后点击 idle 状态的 `Reload Game` 不产生记录；刷新后再点 Play 会产生 Square 记录。
- Oval `Start Game` 产生记录；`/games` 按最新顺序显示 Oval、Square，再次 Play Square 后变为 Square、Oval。
- 第二标签页 `/games` 能在第一标签页记录后自动刷新顺序，跨标签同步通过。
- Pixel 页为 `EXTERNAL_LINK`；访问后不进入历史。
- `/games` 的 Square Continue 链接能返回 `/`。
- Privacy 日期与新增披露可见且各出现一次。
- 两个测试标签页 console warning/error 均为 0。
- Clear 按钮测得 142.03 × 44 px。

浏览器实际暴露并修复了一处问题：共享 Play/Reload callback 会让 idle Reload 误记为开始游戏。现已把 Play 的 `activateOrReload` 与永不记录的 `reload` 分开，并新增源断言与复测。

## 未验证与失败留痕

- `未验证`：390×844 与 360×800 的精确移动端视觉。自动化 viewport 设置后实际 CSS width 仍为 1280，不能把桌面截图当作移动端证据。
- `未验证`：带预置历史模块时的真实浏览器 CLS、真机、其它浏览器、生产环境与 `seo:prod`。
- 初始专项 fixture 缺少更新后的 canonical、隔离 CSS module 解析失败、placement 断言过脆、home discovery 空数据 guard 漂移、冻结检查兼容链次序、README baseline、并发 RELATED built/HTTP 临时目录争用、C 盘 `ENOSPC`、npm 参数转发、idle Reload 误记录及一次错误 callback 断言目标均已保留为开发过程失败；修正后对应最终检查通过。

## 人工验收步骤

1. 打开 `http://localhost:3000/`，先清除历史，确认 Continue Playing 完全隐藏。
2. 在 Square 区先点 `Reload Game`，确认模块仍隐藏；刷新后点 Play，确认 Square 立即出现。
3. 打开 `http://localhost:3000/oval-face-icon-generator` 并点 Start Game，再进入 `http://localhost:3000/games`，确认 Oval、Square 按最近顺序出现。
4. 在另一个标签页打开 `/games`，回到 Square 再 Play，确认第二个标签页顺序自动更新。
5. 打开 Pixel External Tool 页面后返回 `/games`，确认 Pixel 不在列表。
6. 点击 Clear，确认只清除 Recently Played、模块消失且键盘焦点落到下一标题。
7. 检查 Privacy Policy 的 September 7, 2026 日期和 Recently Played 披露。

通过后回复：`RECENT-001 验收通过`。

## 回滚

移除 Recently Played 组件在首页和 `/games` 的接入、Player 的记录调用、Privacy 增量文案与本任务样式/验证脚本即可回滚代码。已写入用户浏览器的单一 key 可安全保留（模块移除后不会读取），或由用户在 Clear/浏览器站点数据中删除。回滚不应触碰 Game Data、URL、metadata、索引、RELATED、CATEGORY、已有用户验收或其它 localStorage key。
