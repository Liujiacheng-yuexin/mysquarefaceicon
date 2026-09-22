# ROUTE-001 · 新路由与历史 URL 适配方案（已确认）

> 方案状态：已确认；用户原文：`确认 ROUTE-001 方案，进行开发`（2026-08-31）<br>
> 当前任务：`ROUTE-001`<br>
> 预计影响：新增路由骨架、集中式 route resolver 与 legacy route adapter；冻结现有公开 URL、metadata、canonical 和索引状态<br>
> 发布权限：本任务不提交、不推送、不部署；确认前不修改路由代码

## 1. 当前事实与任务边界

- 已验收的 Game Data 目前只有 3 条 `PUBLISHED` 记录，且都标记为 `existingPublishedRoute: true`：Square 为 `/`、Oval 为 `/oval-face-icon-generator`、Pixel External Tool 为 `/pixel-art-avatar-icon-generator`。
- `lib/games/catalog.ts` 已支持按 `id`、`slug`、`route.path` 查找，但尚未区分 legacy URL 与未来 `/games/[slug]`，也没有分类路由白名单。
- 仓库当前没有 `/games`、`/games/[slug]` 或 `/category/[slug]` 页面；共享导航也没有这些入口。
- `ROUTE-001` 的交付物是 route map 与 legacy route adapter；完整目录 UI、可索引分类内容和统一详情模板分别属于后续 `GAMES-INDEX-001`、`CATEGORY-001`、`GAME-TPL-001`。
- 因此本任务只建立可验证、失败关闭的路由骨架。不会提前把 1–3 条记录的聚合页当作可索引 SEO 页面，也不会吞并后续模板/组件任务。

## 2. 建议路由表

| URL / route family | ROUTE-001 行为 | 索引与 canonical | 关键保护 |
|---|---|---|---|
| `/` | 精确映射 Square legacy record | 保持当前 index 与根 canonical | 不生成 `/games/square-face-generator` 副本 |
| `/oval-face-icon-generator` | 精确映射 Oval legacy record | 保持当前 index 与 canonical | URL、Title、H1 不迁移 |
| `/pixel-art-avatar-icon-generator` | 精确映射 Pixel External record | 保持当前 index 与 canonical | 仍先到本站来源说明页，不伪装成本地游戏 |
| `/games` | 200 的最小目录骨架，只列真实 `PUBLISHED` Game Data | `noindex, follow` + 自引用 canonical；不进 sitemap | 完整上线与 index 决策留给 `GAMES-INDEX-001` |
| `/category/[slug]` | 仅显式分类白名单可解析；有真实记录才 200 | 本阶段全部 `noindex, follow` + 自引用 canonical；不进 sitemap | 未知/空分类 404，不接受任意 slug |
| `/games/[slug]` | 只解析 `existingPublishedRoute: false` 且 `route.path === /games/[slug]` 的可发布记录 | 页面模板与 index 资格由后续任务决定；本阶段不进 sitemap | 当前 3 个 legacy slug 和未知 slug 均 404，避免重复 URL |

不新增 301、302 或 rewrite。所有站内游戏链接统一调用 `getPublicGameHref(game)` 并返回 `game.route.path`，禁止按 slug 猜测地址。

## 3. Route resolver 与 legacy adapter

```text
GameRecord.route / category fields
               │
               ▼
      centralized route policy
      ├── getPublicGameHref(game)
      ├── resolveLegacyGamePath(path)
      ├── resolveNewGameSlug(slug)
      ├── resolveCategorySlug(slug)
      └── listPublishedGamesForRoute()
               │
      ┌────────┼──────────────┐
      ▼        ▼              ▼
 legacy URLs  /games shell   category shell
```

实施时建议新增：

- `lib/games/routes.ts`：唯一的 legacy/new-game/href 判定与失败关闭逻辑。
- `data/game-categories.ts`：首批垂直分类的固定 slug、英文标签和人工编写简介；不从 URL 自动生成文案。
- `app/games/page.tsx`、`app/category/[slug]/page.tsx`、`app/games/[slug]/page.tsx`：路由骨架。
- `scripts/validate-game-routes.ts` 与隔离的 `routes:check`：验证 route family、重复路径、legacy 冻结、分类白名单和 404 边界。

legacy adapter 只证明现有路径能稳定解析到同一 Game Record；Square/Oval/Pixel 的完整 metadata、正文、related 与模板迁移仍由 `MIG-SQUARE-001`、`MIG-OVAL-001`、`MIG-PIXEL-001` 负责。

## 4. 页面布局

### `/games` 路由骨架

```text
SiteHeader
Breadcrumb: Home / Games
H1: Avatar Games & Face Makers
一句范围说明：只收录头像、脸型、像素头像和角色创建体验
On-site Games：Square、Oval（链接到冻结的 legacy URL）
External Tools：Pixel（明确 External badge，链接到本站说明页）
Browse by Category：只展示当前有真实记录的白名单分类
SiteFooter
```

- 只使用 Game Data，不混入 Guide、Gallery 或 Blog。
- 不显示 Popular、Trending、评分、用户数或虚构发布时间。
- 本阶段使用轻量语义列表，不提前建设 `GameCard`/`GameGrid` 组件库。

### `/category/[slug]` 路由骨架

```text
SiteHeader
Breadcrumb: Home / Games / {Category}
H1: 人工定义的分类名称
人工定义的分类边界说明
真实 PUBLISHED records 列表（External 单独标记）
返回 Games / Home 的相关链接
SiteFooter
```

- 未知 slug、无真实记录或不在垂直范围内的分类直接 404。
- 当前数据按主/次分类合并后：Face Makers 2、Avatar Makers 3、Pixel Avatars 1、Retro Flash 2、Character Creators 1；均未达到聚合页建议的 8 条有效条目，因此全部保持 noindex。

### `/games/[slug]`

- 当前目录没有非 legacy 游戏，所以 `square-face-generator`、`oval-face-icon-generator`、`pixel-art-avatar-icon-generator` 及未知 slug 都应返回 404。
- resolver 用测试 fixture 证明未来非 legacy 记录默认得到 `/games/[slug]`；只有记录、权利、状态和路径均满足条件时才可进入页面渲染。
- 完整的 Player、Controls、How-to、Features、FAQ、Source & Rights 和 Related 布局不在本任务实现，留给 `GAME-TPL-001`。

## 5. SEO 与索引策略

- 冻结 30 条 URL 基线；尤其 `/`、Oval、Pixel 的 status、Title、H1、canonical、robots/indexability 不变。
- 新增骨架页默认 `noindex, follow` 且不写入 sitemap；当前损坏的 `app/sitemap.ts` 也不在本任务修改范围。
- `/games` 的未来搜索意图是“浏览垂直 avatar/face creator games”，但在 `GAMES-INDEX-001` 完成独立内容与语义调研前不申请索引。
- 分类只有在有效条目至少 8、内容独立、`qualityScore` 与全部必须级规则满足后才是 index 候选；阈值达成也不自动发布。
- 不建立 `/new-games`、`/popular-games`、`/trending-games`、搜索或筛选 URL；避免无数据页面和无限 URL 空间。
- 不发布 hreflang、schema 或 sitemap 变更；这些由后续 Metadata/SEO 任务独立验收。

## 6. 交互与可访问性

- 全部站内跳转使用普通可抓取链接；卡片/列表项有清晰可访问名称和可见焦点。
- External badge 与来源边界必须可见；目录点击 Pixel 先进入本站来源说明页，只有页面内明确 CTA 才打开原站。
- 不添加搜索、筛选、收藏、Recently Played 或复杂客户端状态。
- 桌面与 `390 × 844` 均检查无横向滚动；未知路由显示真实 404，不显示空白页面或软 404。

## 7. 确认后的开发与验收

1. 建立集中式 route policy、分类白名单和 legacy/new-game resolver。
2. 增加 3 个 route family 的最小骨架与明确 noindex metadata；不改共享导航和 sitemap。
3. 让现有三个公开入口通过 legacy adapter 校验其 Game Record 映射，同时保持当前可见布局与 metadata。
4. 新增 `routes:check`，覆盖路径唯一性、legacy URL 冻结、分类计数、未知 slug、legacy duplicate 和未来非 legacy fixture。
5. 运行 `games:check`、`player:check`、任务级 TypeScript/ESLint、`git diff --check`，并如实记录全局 lint/build/cf:build。
6. 浏览器检查 `/games`、一个有效分类、一个未知分类、三个 legacy duplicate URL、桌面与 390px；同时回归 `/`、Oval、Pixel 的 status、H1、canonical 和核心交互。

已知 `app/sitemap.ts` 裸文本语法损坏、HTTP 未强制 HTTPS、移动 LCP 4.6s 和 Square/Oval 许可证据 UNKNOWN 继续是 P0/发布风险。即使 ROUTE-001 局部通过，全局发布状态仍为“不通过”。

## 8. 回滚与用户决定

回滚只需删除新增 route family、route/category 数据和校验脚本，并移除 legacy adapter 接入；此前已验收的 Game Data、Player、License Registry、URL 冻结表和现有页面不回滚。

用户已明确确认整套方案。开发严格限定为本文件定义的路由骨架、集中式 resolver、分类白名单、legacy adapter 与验证；不扩展到共享组件库、完整详情模板、提交、推送或部署。
