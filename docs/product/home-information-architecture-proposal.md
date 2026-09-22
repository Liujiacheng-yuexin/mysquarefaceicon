# HOME-IA-001 · 首页信息架构与组件重排方案（已确认）

> 方案状态：已确认；用户原文：`确认并进行开发`（2026-08-31）  
> 当前任务：`HOME-IA-001`  
> 预计影响：只重排 `/` 的首页模块与类型边界；不改变 URL、搜索意图、metadata、H1、canonical、schema、索引状态、sitemap 或游戏资源  
> 发布权限：允许按本方案修改本地生产页面代码；本任务不提交、不推送、不部署

## 1. 当前事实与任务边界

- 当前首页顺序为：Header → Square 标题/播放器 + 右侧混合栏 → Community Gallery → What Is → Features → How to Play → Tips → FAQ → CTA。
- 右侧栏目前同时包含 Oval、Pixel 两个游戏/工具，以及 Free Avatar Maker、Guide、Gallery、Blog，违反已经确认的 GAME / EXTERNAL_TOOL / GUIDE / GALLERY / BLOG 类型边界。
- 当前只有 3 条 `PUBLISHED` Game Data：Square、Oval 与 Pixel External Tool。Square 的 `relatedGameIds` 明确关联 Oval 与 Pixel，可作为首页第一组人工策展来源，但不能称为 Popular 或 Trending。
- 三条记录的 `publication.publishedAt` 均为 `null` 且时间状态为 `UNKNOWN`，因此当前不能真实生成 New Games 排序。
- Recently Played 尚未实现，也没有可读取的本地记录，因此 Continue Playing 当前不能渲染空栏目或假数据。
- `HOME-IA-001` 只建立首页顺序、模块边界和数据为空时的行为；Hero 视觉重构、完整发现模块、Gallery 信任修复和性能预算仍分别由 `HOME-HERO-001`、`HOME-DISC-001`、`HOME-GALLERY-001`、`PERF-HOME-001` 验收。

## 2. 推荐的一页布局

```text
Header
  ↓
Core Square Face Generator
  H1 + 真实价值说明 + 固定比例 Preview / Play
  现有 click-to-load Player + Controls
  ↓
Home Discovery Region
  Continue Playing        有真实本地记录才显示；当前不渲染
  Featured Avatar Games   Oval + Pixel，来自 Square relatedGameIds
  New Games               有 VERIFIED publishedAt 才显示；当前不渲染
  Browse by Category      只显示拥有真实 PUBLISHED records 的分类
  ↓
Gallery Preview           本任务只移动顺序，不改其数据口径
  ↓
Square 内容区
  What Is → Features → How to Play / Save → Tips → FAQ
  ↓
Guides & Resources
  Guide / Gallery / Blog 与 Games 明确分组
  ↓
Final CTA → Footer
```

桌面端移除核心游戏旁边的“混合内容侧栏”，让 Square 的标题、Preview 与 Play 保持主视觉；发现模块在核心游戏结束后占满内容宽度。移动端完全按以上 DOM 顺序单列展示，视觉顺序与键盘顺序一致。

## 3. 发现模块的数据与公开文案规则

| 模块 | HOME-IA-001 初始行为 | 失败关闭规则 |
|---|---|---|
| Continue Playing | 只保留条件插槽；当前不输出标题、占位或空卡 | 没有真实 localStorage 记录就整段不渲染 |
| Featured Avatar Games | 使用 `squareFaceGame.relatedGameIds` 解析 `PUBLISHED` records；初始为 Oval 与 Pixel | 缺记录、draft/broken 或重复当前游戏时排除；不声称 Popular/Trending |
| New Games | 当前不渲染 | 只有 `publishedAt` 为已核验时间才允许按日期排序 |
| Browse by Category | 从允许列表中筛出至少有一条真实 `PUBLISHED` record 的分类 | 不生成任意 slug；分类继续 `noindex, follow`，不改 sitemap |

- 游戏卡片只读取 Game Data，Guide、Gallery 和 Blog 不进入游戏卡片集合。
- Pixel 必须显示 `External Tool` 边界，卡片先进入本站说明页，不直接伪装为本站可玩游戏。
- Featured 是明确的编辑选择，不显示星级、点赞、用户数或热度数字。
- 当前数据不足的模块不保留空白高度，也不输出不可用的 heading。

## 4. SEO 与内容冻结

以下项目保持逐字或逐值不变：

- `/` 继续承担 `square face generator` 主搜索意图。
- Title、description、唯一 H1 `Square Face Generator`、根 canonical、Open Graph、Twitter、robots/indexability 与语言 alternates。
- 当前 JSON-LD 类型和可见 FAQ 的对应关系；本任务不新增评分、评论或虚假游戏 schema。
- `#maker`、`#game-player`、`#what-is`、`#features`、`#how-to-play`、`#how-to-use`、`#faq` 等已有锚点。
- sitemap membership、30 URL 冻结表及三个 legacy game URL。

首页主内容中的 What Is、Features、How to Play、Tips 与 FAQ 不删除、不改写，只移动到发现模块之后。这样既保持 Square 的语义覆盖，又让用户在长篇说明前先看到下一款相关游戏。

## 5. 交互、响应式与可访问性

- Preview 与 Play 继续使用现有原生可聚焦控件；Ruffle、WASM 与 SWF 仍只在点击后请求。
- 卡片和分类使用普通 `<a>`，保留可见焦点与清晰可访问名称。
- DOM 顺序等于视觉顺序，不用 CSS `order` 制造键盘与视觉错位。
- 390px 单列；桌面发现卡片使用现有共享 `GameGrid` / `GameCard` / `CategoryChip`，不复制整段卡片 markup。
- Preview、Loading、Player 继续共用稳定比例；本任务不改变 SWF、播放器 adapter 或资源加载策略。
- 首屏不增加图片、字体、第三方脚本或客户端状态依赖。

## 6. 确认后的实施步骤

1. 将首页核心游戏与混合侧栏解耦，保持 Square 标题、播放器、控件和锚点不变。
2. 新增最小 `HomeDiscoveryRegion`，直接复用已验收的 Game Data、GameGrid、GameCard 与 CategoryChip；按上表隐藏无数据模块。
3. 将 Guide、Gallery、Blog 等支持入口移到长内容之后的独立 `Guides & Resources` 区，不再标成 Games。
4. 保留 Gallery 现有内容实现，只把它放到发现区之后；硬编码互动数字与 Community/Curated 口径留给 `HOME-GALLERY-001` 单独修复和验收。
5. 增加任务级结构检查：核心游戏 < 发现区 < Gallery < 长内容 < FAQ < Resources；游戏卡不含支持内容；空 Continue/New 不输出；External 标签存在。
6. 运行 `metadata:check`、`games:check`、`player:check`、`routes:check`、`components:check`、任务 ESLint/type-check、全量 lint/build/cf:build，并保留现有 P0 的真实结果。
7. 浏览器检查桌面与 `390 × 844`：模块顺序、真实卡片跳转、分类链接、键盘焦点、单 H1、无横向溢出、点击前无 Ruffle/WASM/SWF。

## 7. 明确不在本任务范围

- 不新增 Recently Played/localStorage、Favorite、搜索或筛选。
- 不伪造发布时间来显示 New Games。
- 不重写 Hero 文案或制作新的首屏素材。
- 不处理 Gallery 的 Community 文案、硬编码点赞或 UGC 状态。
- 不修改 URL、metadata、schema、canonical、robots、sitemap 或分类索引状态。
- 不修复 `app/sitemap.ts`、HTTP→HTTPS、移动 LCP、许可证据或既有关键词审计问题；这些继续作为全局 P0/P1 风险显示。

## 8. 验收与回滚

确认并实施后，`HOME-IA-001` 的验收证据应证明：

- Square 仍占首页上半部分，H1、Preview、Play 和 click-to-load 保持。
- 游戏后立即出现真实发现区；Featured 与 Categories 有数据，Continue 与 New 因无数据不渲染。
- How-to 与 FAQ 位于发现区之后，支持内容不再混入 Games。
- 首页 SEO 冻结项、桌面/移动端、键盘和首载资源检查通过。

回滚只需恢复 `HomePage.tsx` 原模块结构、删除 HOME-IA 专用组件/检查和对应 CSS；Game Data、Player、Routes、Components、Metadata 与此前验收成果不回滚。

## 9. 用户决定

用户已明确确认本方案。开发严格限定为本文件定义的首页模块顺序、真实数据发现区、支持内容分组与验证，不扩展到 Hero 重构、Gallery 信任修复、Recently Played、提交、推送或部署。
