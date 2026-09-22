# FAV-001 · Favorites 本地收藏方案

> 2026-09-07 · 看板 v1.89 实施阶段 · **方案已确认，本地实现待验收**  
> 当前任务：`FAV-001`  
> 用户确认：`确认 FAV-001 方案，进行开发`

## 0. 实施状态

- 已按本方案完成本地实现，未扩大到账号、网络、云同步、新 URL、统计或热度排序。
- 专项、TypeScript、零警告 lint、相关冻结回归、Next/OpenNext、本地 production HTTP/SEO/robots 与浏览器交互已验证；精确 1280×900、390×844、360×800 均无横向溢出。
- 当前状态为 `待验收`；自动检查通过不等于用户验收、权利批准或生产发布。
- 实施证据见 `docs/quality/evidence/fav-001/README.md` 与 `checks.json`。未 commit、push、deploy 或运行 `seo:prod`。

## 1. 当前事实

- `RECENT-001` 已获本地验收；它使用独立的 `msfi-recently-played-v1`，本任务不得复用、迁移或清除该 key。
- 当前 Game Data 有 3 条 published 记录：Square、Oval 两个本站游戏，以及明确标识的 Pixel External Tool。
- 共享 `GameCard` / `GameGrid` 覆盖英文首页发现区、`/games`、五个分类和 future `/games/[slug]` Related；`RecentlyPlayed` 有独立卡片结构。
- Oval、Pixel 页尾的已验收 Related 卡片仍是各自的 legacy 结构，不能为收藏功能改写原文、顺序、href 或 External Tool 口径。
- 当前 `/`、`/oval-face-icon-generator`、`/pixel-art-avatar-icon-generator` 是三个实际发布入口；future `/games/[slug]` 使用共享 `GameDetailTemplate`，当前仍受许可与 force-noindex 门禁约束。
- 现有代码没有 Favorite/Favourite/Bookmark 存储或交互。Privacy 已披露安装提示、评论点赞与 Recently Played，但尚未披露 Favorites。
- `GameCard` 当前整卡是链接；收藏按钮不能嵌套在链接内，必须使用链接与按钮为兄弟节点的结构。

## 2. 数据与资格边界

- 新 key：`msfi-favorites-v1`。
- v1 数据：`{ "version": 1, "gameIds": ["square-face", ...] }`；只保存稳定 Game Data ID，不保存姓名、邮箱、账号、页面文案、URL、设备标识、时间或行为次数。
- 最多保存 50 个 ID，最近收藏的排在前面；重复收藏不会产生重复 ID。
- 只有当前 resolver 判定为 published 且可公开访问的 Game Data 才显示；失效、draft、broken、重复、未知 ID 与不安全路径 fail closed，不生成占位或死链。
- Pixel External Tool 可以收藏，但按钮和收藏列表继续明确写 `External tool` / `Save tool`，收藏不等于本站托管、玩过、授权或推荐。
- 解析损坏 JSON、错误版本或存储异常时返回空状态；收藏失败只给出可恢复提示，不阻断卡片导航或游戏启动。
- 无账号、无 Cookie、无 API、无 KV/D1/R2、无跨设备同步、无网络写入。

## 3. 页面布局

### 3.1 所有 Game Data 卡片

- 共享卡片改为一个非交互外壳，主链接与 44×44px 收藏按钮互为兄弟节点，禁止 button-in-anchor。
- 收藏按钮位于卡片右上角或独立操作区，不遮挡名称、摘要、External Tool badge 或主链接点击区。
- 英文首页、`/games`、五个分类、future detail Related 均通过共享结构获得同一行为。
- `RecentlyPlayed` 的独立卡片也接入同一收藏按钮；其 Continue game 链接、排序和 Clear 行为不变。
- Oval/Pixel legacy Related 只加同级按钮外壳，不迁移到新文案模板，不改变已验收的推荐选择、原文、顺序与 href。

### 3.2 三个当前发布入口与 future detail

- `/`：在现有 Play 主操作旁加入次级 Favorite 控件；Play 仍为视觉主按钮，Player 位置与 click-to-load 行为不变。
- `/oval-face-icon-generator`：在现有 hero actions 中加入次级 Favorite；Play 与 How to Play 顺序保持。
- `/pixel-art-avatar-icon-generator`：加入 `Save tool` / `Saved tool`，仍明确为 External Tool；Open Original CTA 继续是主操作。
- future `/games/[slug]`：在 `GameDetailTemplate` 标题区加入 Favorite 操作，不改变 Breadcrumb → H1 → Player 的语义和 Player-first 顺序。
- 当前入口的收藏操作旁提供 `View favorites` 到 `/games`；不新建 `/favorites` URL。

### 3.3 `/games` Favorites 视图

- 在 Recently Played 之后、On-site avatar games 之前加入条件式 `Favorites` 区块。
- 只在存在有效本地收藏时渲染标题和卡片；空列表不显示 empty state、不预留模块高度。
- 列表按最近收藏顺序显示最多 50 条；当前三条数据保持原 Game/External 类型标签和真实详情链接。
- 在 Favorites 列表取消一项时，焦点移到下一可用收藏按钮；删除最后一项时转到 `On-site avatar games` 标题，并通过 live region 宣布结果。

## 4. 交互与可访问性

- 使用原生 `button`、固定可访问名称和 `aria-pressed`；可见文案为 `Favorite` / `Favorited`，External Tool 为 `Save tool` / `Saved tool`。
- 点击、Enter、Space 均可操作；按钮与链接焦点样式清晰，移动端命中区至少 44×44px。
- 同标签页通过项目自定义事件立即同步，跨标签页监听精确 key 的原生 `storage` 事件。
- 成功或失败均通过 `aria-live` 文案反馈；不会弹出登录提示，也不暗示云同步。
- 服务端快照保持未收藏，客户端以 `useSyncExternalStore` 读取；按钮尺寸固定，状态切换不改变卡片几何尺寸。

## 5. SEO、隐私和性能锁定

- 不新增 URL，不改 `/`、Oval、Pixel、`/games`、分类或 future detail 的 Title/description、H1、canonical、OG/Twitter、schema、robots/index、sitemap 或搜索意图。
- Favorites 列表只来自浏览器本机，不进入服务器结构化数据、静态内链计数、推荐排序、quality/popularity 或 sitemap。
- Privacy 在 Cookies and Local Storage 中增加：保存稳定游戏 ID、用途、取消方式、无账号/网络/跨设备同步；可见日期仍为 September 7, 2026。
- 不修改 Square/Oval SWF，不改变 Ruffle/WASM/SWF click-to-load，不增加首次加载网络请求。
- 收藏按钮状态使用固定尺寸，浏览器验证必须覆盖未收藏→收藏→取消的 CLS/溢出风险；未实测不能写通过。

## 6. 预计实现文件

- 新增：`lib/favorites.ts`、`lib/games/favorites.ts`。
- 新增：`components/game/FavoriteToggle.tsx`、`components/game/FavoritesSection.tsx`，必要时增加只负责“主链接 + 按钮兄弟结构”的轻量外壳。
- 修改：`components/game/GameCard.tsx`、`GameGrid.tsx`、`RecentlyPlayed.tsx`、`GameDetailTemplate.tsx`。
- 修改：`components/home/HomeHero.tsx`、`app/games/page.tsx`、Oval/Pixel legacy 页面和 Privacy；只增加所需样式。
- 新增 `npm run favorites:check` 与负向 fixture；既有冻结检查用精确、可逆兼容变换接受本任务差异，不重写历史 golden。
- 更新 `scripts/README.md`、`PAGE_PLAN.md`、`LAUNCH_CHECKLIST.md`、`SEO_LOG.md` 和权威看板。

## 7. 实施后的验收范围

1. 存储版本、50 条上限、去重/顺序、非法/损坏数据和 storage failure。
2. 三条 published 记录的收藏/取消；Pixel 始终保持 External Tool/Save tool 语义。
3. 共享 GameGrid、Recently Played、Oval/Pixel legacy Related、三个当前入口与 future detail 的按钮覆盖。
4. `/games` Favorites 条件显示、刷新保留、同标签/跨标签同步、取消后的焦点恢复。
5. 不存在嵌套交互；键盘、aria-pressed、live region、44px 命中区与移动端无横向溢出。
6. URL/metadata/H1/canonical/schema/index/sitemap、RECENT key、Player 与首次网络请求冻结。
7. 专项、type、lint、相关回归、Next/OpenNext、built/HTTP、SEO/robots，以及 1280×900、390×844、360×800 浏览器检查。

## 8. 不在本任务范围

- 账号、登录、云同步、数据库、收藏分享、收藏计数、热门榜、个性化推荐或 analytics 事件。
- 新建 `/favorites` 页面、开放分类索引、新增游戏或改变 Related 排序。
- 将收藏解释为使用次数、质量、热度、权利或官方推荐。
- commit、push、deploy、`seo:prod` 或关闭现有 P0/UNKNOWN。

## 9. 验收点

已确认并实施：Pixel External Tool 可作为“保存的外部工具”进入 Favorites，但始终明确外部属性；Favorites 只在 `/games` 查看，不新增 URL；所有收藏只保存在当前浏览器。

请按证据文档的人工步骤验收；通过后回复：`FAV-001 验收通过`。
