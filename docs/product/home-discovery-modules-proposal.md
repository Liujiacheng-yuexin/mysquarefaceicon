# HOME-DISC-001 · 首页 Featured / New / Categories 发现区方案（已实施并验收）

> 方案状态：用户已确认并验收；本地任务状态为 `已完成`  
> 当前任务：`HOME-DISC-001`  
> 前置状态：用户于 2026-09-01 明确回复 `验收通过，现在进行下一步开发`，`HOME-HERO-001` 已验收  
> 预计影响：仅改造英文根首页 `/` 中 Hero 后、Gallery 前的游戏发现区  
> 发布权限：只完成本地实现、检查、证据与看板回写；未授权提交、推送或部署

## 1. 当前事实与任务冲突处理

- 当前发现区已经由 Game Data 服务端渲染，包含 `Featured Avatar Games` 与 `Browse by Category`；Oval 与 Pixel 来自 Square record 的 `relatedGameIds`，五个分类只在存在已发布记录时显示。
- 当前 3 条游戏记录的 `publication.publishedAt` 都为 `null`，`timestampStatus` 都为 `UNKNOWN`，因此没有任何可被真实判定为“New”的游戏。
- 当前移动端发现区约高 `1441px`：两张纯文字卡片和五个单列分类使浏览路径过长；桌面语义正确，但缺少 Game Data 中已有的真实缩略图，视觉分发能力较弱。
- 看板验收标准要求具备 Featured / New / Categories，同时又要求无内容时不渲染空栏目；已验收的 HOME-IA-001 还明确禁止伪造发布日期。两者按以下方式同时落实：实现可验证的 `New Games` 数据解析与渲染能力，但在当前真实数据下不输出标题、容器或空状态；只有将来出现 `VERIFIED` 且非空的 `publishedAt` 时才显示。
- Pixel 仍是 `EXTERNAL_TOOL`，卡片只进入本站详情页 `/pixel-art-avatar-icon-generator`，不伪装为本站可玩游戏，也不直接把整卡跳往外站。
- Free Avatar Maker、Guide、Gallery、Blog 与 Resources 不进入 Games 列表。

## 2. 视觉方向与概念图

- [桌面发现区概念](./concepts/home-disc-001-desktop-concept.png)
- [390px 移动发现区概念](./concepts/home-disc-001-mobile-concept.png)

概念图只用于确认层级、密度、缩略图位置、外部工具边界和响应式构图，不作为生产图片或逐字文案来源。生产实现只使用 Game Data 中现有的真实 `THUMBNAIL` 资产、现有颜色 token 和下文锁定的真实文案；不把生成概念图发布到网页。

视觉继续使用 cream 背景、dark plum/brown 正文、mint 辅助和 orange 强调。发现区采用开放式分段而不是再包一层大型面板，以便和 Hero、Gallery 清楚分区；卡片保持轻边框、约 `10–12px` 圆角和克制阴影，不新增字体、第三方脚本、装饰插画或动态效果。

## 3. 桌面布局（验收宽度 `1440` 与 `1280`）

```text
Discover More Avatar Games + 现有说明
  ↓
Featured Avatar Games
  ├─ Oval：真实 thumbnail + 类型 + 名称 + Game Data summary + Open game
  └─ Pixel：真实 thumbnail + External tool + 名称 + Game Data summary + View access details
  ↓
New Games（当前真实数据为空，因此整个模块不输出）
  ↓
Browse by Category
  └─ 5 个可抓取分类链接横向五列：图标/名称/真实数量
  ↓
Gallery（保持下一独立区块）
```

- 内容最大宽度继续服从首页现有容器；Featured 使用两列等宽媒体卡，图片使用稳定方形区域，避免加载后位移。
- Oval 使用普通实线边界；Pixel 使用可见的橙色虚线边界与 `External tool` 标签，色彩不是唯一识别手段。
- 分类在 1440px 为五列，在较窄桌面可自然换行；每项显示真实名称与 `N current entry/entries`，不加入未有数据支持的图标含义、热度或排序承诺。
- 发现区不使用 carousel、tabs、filter、横向滚动或客户端首屏数据请求。

## 4. 移动布局（验收宽度 `390`，兼查 `360` / `430`）

- 标题、说明与模块顺序和桌面 DOM 完全一致。
- Featured 改为紧凑横向媒体卡：左侧约 `96px` 方形缩略图，右侧为类型、名称、摘要与操作；必要时在 `360px` 改为更小缩略图，但不隐藏类型边界或操作名称。
- 两张卡片保持纵向排列，整卡为可访问链接；Pixel 的虚线边界与 `External tool` 文本仍清晰可见。
- 分类采用两列网格，第五项可跨两列；每个触控目标至少 `44px` 高，名称和数量不挤出视口。
- 不允许水平滚动；CSS 视觉顺序、DOM 顺序与键盘顺序一致。
- 目标是显著短于当前约 `1441px` 的移动发现区，同时不通过删文案、隐藏分类或缩小触控目标换取高度。

## 5. 数据与空模块合同

### Featured

1. 从当前 Square record 的 `relatedGameIds` 按原顺序解析。
2. 只保留 `publication.status === "PUBLISHED"` 且能取得公开站内 href 的记录。
3. 排除当前游戏、未知 ID 与重复记录；不得用 Popular、Trending、评分或随机顺序替代。
4. 整个列表为空时，不输出 Featured 标题、面板或空状态。

### New

1. 只接纳 `publication.status === "PUBLISHED"`、`timestampStatus === "VERIFIED"` 且 `publishedAt` 能解析为有效时间的记录。
2. 按已验证发布时间降序稳定排序；同一记录不得在 Featured 与 New 中重复，当前 Square 也排除。
3. 当前 3 条记录不满足条件，因此生产页面当前不显示 `New Games`。
4. 任务级 fixture 必须证明：加入一条 verified timestamp 记录时输出 `New Games`；全部为 unknown/null 时连标题和容器都不存在。

### Categories

1. 只使用已验收的 `data/game-categories.ts` allowlist 与已发布记录。
2. 只渲染真实数量大于 0 的分类，按 allowlist 固定顺序输出；空分类不占位。
3. 当前数量保持 Face Makers `2`、Avatar Makers `3`、Pixel Avatars `1`、Retro Flash `2`、Character Creators `1`。
4. 分类 href 继续是 `/category/[slug]`；当前薄分类仍为 `noindex, follow` 且不进入 sitemap，本任务不改变其索引决策。

若 Featured、New、Categories 三者都为空，则整个 discovery `<section>` 不输出。

## 6. 固定文案与真实资产

- 发现区标题：`Discover More Avatar Games`
- 说明：`Continue with related face, avatar, and pixel creator experiences after playing the Square game.`
- 模块标题：`Featured Avatar Games`、条件满足时的 `New Games`、`Browse by Category`
- Featured 名称、摘要与图片 alt 全部逐值读取 Game Data；当前真实记录为 `Oval Face Icon Generator` 与 `Pixel Art Avatar Icon Generator`。
- Playable 操作保持 `Open game`；External Tool 操作保持 `View access details`。
- Oval 图片使用 `/games/oval-face-icon.png`；Pixel 图片使用 `/game-face-samples/gamer.webp`。两者都通过 `THUMBNAIL` 角色解析，不在组件内复制路径。
- 不添加日期、New badge、Popular/Trending、用户数、评分、点赞、许可、官方/原创、性能或移动支持承诺。

## 7. SEO、内链与可访问性边界

- `/` 的主搜索意图、title、description、唯一 H1、canonical、Open Graph、Twitter、JSON-LD、robots/indexability、language alternates 与 sitemap membership 全部冻结。
- 不新增页面、URL、rewrite、redirect、canonical、schema、FAQ 或导航入口；不调整 Hero、Gallery、长内容与 Resources 顺序。
- 所有卡片和分类使用服务端输出的普通 `<a>` 链接，锚文本包含真实名称；不把内部链接改成 JavaScript 点击或 `nofollow`。
- 缩略图具有来自 Game Data 的真实 alt、显式宽高/稳定比例、懒加载与合适响应式尺寸；它们位于首屏核心游戏之后，不得抢占 Square 的 LCP 优先级。
- 整卡具有清晰 `:focus-visible` 状态；External Tool 同时用文本、边框和类型属性表达，不能只靠颜色。
- Heading 层级保持 discovery `h2`、模块 `h3`，不新增 H1；隐藏模块不得留下不可见标题或空 landmark。

## 8. 确认后的最小实施范围

1. 新增可测试的首页发现解析器，集中处理 Featured、verified New、去重和非空分类；组件不自行猜测发布时间或发布资格。
2. 为共享 `GameCard` / `GameGrid` 增加受控的首页媒体 variant，继续复用统一 href、类型与文案逻辑；不复制一套独立游戏数据或整页卡片实现。
3. 从 Game Data 的 `THUMBNAIL` 角色渲染真实图片，并为缺失 thumbnail 采用不引入虚假图形的文字降级。
4. 更新 `HomeDiscoveryRegion` 的非空渲染和模块顺序，完成桌面两列媒体卡、移动紧凑媒体卡及分类响应式网格。
5. 新增 `home-discovery:check`，覆盖数据来源、New verified/unknown 分支、去重、External 边界、空模块、真实 href/文案/图片、Heading 与 SEO 冻结项。
6. 更新 PAGE_PLAN、SEO_LOG、共享组件说明、证据目录与权威看板；实现结束只进入 `待验收`。

## 9. 确认后的验证计划

- 运行 `home-discovery:check`、`home-hero:check`、`home:check`、`metadata:check`、`games:check`、`player:check`、`routes:check`、`components:check`，以及任务范围 TypeScript、ESLint 和 `git diff --check`。
- 运行完整 `lint`、Next build、`cf:build`；若仍被既有 `app/sitemap.ts` P0 阻塞，按失败记录，不能宣称通过或跳过不报。
- 在可用的本地 production build 上运行 `seo:check`；没有 production build 时标记 `未验证`。没有部署授权，不运行或宣称 `seo:prod` 通过。
- 浏览器检查 `1440 × 900`、`1280 × 900`、`390 × 1000`，补查 `360` / `430`：模块顺序、真实卡片、内部链接、External 边界、键盘/focus、hover、图片加载稳定性、无空 New、无水平溢出。
- 点击 Oval、Pixel 与至少两个分类，核对固定 legacy URL、站内详情边界、分类 `noindex, follow` 与回退导航。
- 比对本方案概念图；若概念图文字与 Game Data 不同，以本文件固定文案和真实记录为准。

## 10. 明确不在本任务范围

- 不为现有记录补造发布日期，也不改变 Game Data 的 `UNKNOWN` 权利、作者、发布时间或许可字段。
- 不实现 Recently Played、Favorites、Popular、Trending、个性化或 analytics 排序。
- 不改造 Gallery/Community 内容；留给 `HOME-GALLERY-001`。
- 不处理首页性能预算或宣布 LCP/CLS 达标；留给 `PERF-HOME-001` / `CWV-001`。
- 不修复既有 `app/sitemap.ts`、HTTP→HTTPS、移动 LCP 4.6s、Square/Oval 许可 UNKNOWN 或 3 项 KW-02 mandatory findings。
- 不提交、不推送、不部署。

## 11. 用户确认记录

- 确认时间：`2026-09-01T08:50:25.3562754+08:00`
- 确认原文：`确认 HOME-DISC-001 方案，进行开发`
- 确认范围：允许按本文件实施 Featured、verified New 与 Categories；不包含 `HOME-GALLERY-001`、提交、推送或部署。

## 12. 本地实施与验收状态

- 新增 `lib/games/home-discovery.ts`，集中解析 Square 的已发布 Featured 关系、仅接受 `VERIFIED` 有效时间的 New，以及非空 allowlist 分类；当前真实数据仍完全不渲染 New 模块。
- 为共享 `GameCard`、`GameGrid` 与 `CategoryChip` 增加受控首页 variant；默认目录/分类 UI 分支保持不变。首页卡片使用 Game Data 的真实 thumbnail、普通站内 `<a>`、显式图片尺寸与 lazy loading；Pixel 继续先进入本站详情并使用橙色虚线与 `External tool` 文本双重边界。
- 桌面完成两列媒体卡与五列分类；移动完成横向媒体卡、两列分类及第五项跨列。浏览器在 `1600/1440/1280` 与 `430/390/360` 宽度均无横向溢出；390px 发现区从约 `1441px` 降至约 `1235px`，未删除真实摘要、分类或触控目标。
- `home-discovery:check` 及所有相关任务级检查、范围 ESLint、脚本语法和 `git diff --check` 通过。完整 lint、Next build 与 `cf:build` 仍只在既有 `app/sitemap.ts` 首行 `cursive n` 处失败；没有 production build，因此 `seo:check` 未验证；未部署，因此未运行 `seo:prod`。
- 持久化证据位于 `docs/quality/evidence/home-disc-001/README.md` 与同目录桌面/移动截图。任务结论为有条件通过（端到端 Tab 焦点外观未验证）；全局发布结论仍为不通过。
- 回滚只需移除首页 discovery resolver/variant/check，并恢复本任务涉及的 discovery 样式与文档；Game Data、既有 URL、metadata、Hero、Gallery、player、SWF 与索引状态无需数据回滚。

## 13. 用户验收记录

- 验收时间：`2026-09-01T09:17:19.3773648+08:00`
- 验收原文：`HOME-DISC-001 验收通过`
- 验收结果：`通过`；权威看板中的任务状态更新为 `已完成`。
- 此次验收不改变技术证据边界：端到端 Tab 焦点外观仍为 `未验证`，全局发布仍为 `不通过`，且没有提交、推送或部署。
- `HOME-GALLERY-001` 仍为 `未开始`；等待用户明确下达下一步后再进入其方案或开发流程。
