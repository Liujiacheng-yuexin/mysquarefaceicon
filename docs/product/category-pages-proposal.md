# CATEGORY-001 · Face Makers 单页样例方案

> v1.77 · 2026-09-04：本样例的 v1.76 明确验收保持。用户要求下一步后另立[剩余四页批量方案](category-remaining-pages-proposal.md)，仅待确认、未实施；不修改本样例已批准范围或原 QA。当前门禁见权威看板，本文件下方原方案/验收记录保留历史语境。

> v1.76 · 2026-09-04：用户明确回复“CATEGORY-001 单页样例验收通过”；样例及已确认共享边界已验收，[验收记录](../quality/evidence/category-001/acceptance-checks.json)。整项仍未完成；剩余四页须另提方案并明确确认，本轮未启动该方案或开发。下方 v1.75/v1.74 保留各自历史状态；原 QA 不重写/重跑，无网站代码或部署变化。

> v1.75 · 2026-09-04：用户明确确认 CATEGORY-001 单页样例方案，已完成样例及确认的共享边界实施/本地验证，现仅待样例验收；整项未完成，剩余四页正文/布局/metadata 未改造。见 [交付与失败边界](../quality/evidence/category-001/README.md)。下文“方案待确认/未实施/未运行”保留 v1.74 原时点，不代表当前；原 proposal-checks.json 不改写。未提交/推送/部署，原 P0/UNKNOWN、取消状态和人类审核门禁保留。

2026-09-04 · **方案待确认，未实施**。GAMES-INDEX-001 已获用户明确验收；本项按 Week 5 下一任务推进。权威状态只在 HTML 看板维护，本文件不是第二个状态表。

## 1. 当前事实与实施范围

现有 [分类模板](../../app/category/[slug]/page.tsx) 已提供五个分类、真实记录、面包屑和返回入口；不是新建五个 URL。当前数量由 [目录解析器](../../lib/games/directory.ts) 只读求值得出：

| 分类路径 | 现有条目 | 本次页面范围 |
|---|---|---|
| `/category/face-makers` | Square、Oval：2 | 首个样例 |
| `/category/avatar-makers` | Square、Oval、Pixel External：3 | 保持正文/布局，样例验收后另提批量方案 |
| `/category/pixel-avatars` | Pixel External：1 | 同上 |
| `/category/retro-flash` | Square、Oval：2 | 同上 |
| `/category/character-creators` | Pixel External：1 | 同上 |

五页现在均为 noindex/follow、自引用 canonical、不进 sitemap。分类解析尚未复用 `/games` 的类型/身份去重防护；分类页没有自己的 OG/Twitter 或 CollectionPage。现有广告守卫只排除 `/games`，源码求值允许分类页加载广告；这是代码事实，不是本轮真实广告填充测量。

先做 **Face Makers 单页样例 + 必要的共享数据/广告边界**。根据 CONTENT-QA-001 的单页先验收要求，剩余四页正文、metadata 和布局不批量实施；CATEGORY-001 整项也不能因样例验收而标完成。

## 2. 单页布局、内容与交互

沿用既有薄荷/奶油/棕色、共享页头页脚及默认文字卡片，不进行品牌重设计，不新增图片、播放器或依赖。顺序为：

`页头 → Home / Games / Face Makers → 原 H1 与简介 → 2 条游戏卡片 → 选择说明 → 其它分类 → 返回入口 → 页脚`

- 保留 `Face Makers` H1 和现有简介。列表 H2 将 `Available Face Makers` 改为 `Face maker entries`，数量仍取实际记录；不宣称已核验全部功能。
- 卡片继续使用现有完整摘要、类型及 `Open game`，依次链接 `/`、`/oval-face-icon-generator`。不复制首页 Hero，不把游戏加载在分类页；360/390px 要核验首张卡片和全文可见，不能只验无横向溢出。
- 卡片之后增加 `Choosing a face maker`，拟稿两段：

  > Square Face Generator focuses on square face icons. Oval Face Icon Generator offers a rounded face style. Both entries open a maker page on this site; choose the shape you want to start with.

  > Each maker loads its player after you select Play. See the maker page for controls, saving guidance, and source or usage limitations.

  第一段是现有 GameRecord 的形状与本站目标页说明；第二段基于既有 click-to-load 实现，只指向使用说明，不承诺保存、真机兼容或许可已经验证。实施时按内容审核模板逐句留证，人类事实复核与最终功能验收分列。
- 增加 `Other avatar categories`：按原 allowlist 顺序列其余四个非空分类及真实计数，并说明 `Categories overlap: the same entry can appear in more than one group.` 不新增分类或游戏；保留原两条返回入口。
- 保留原 URL、共享导航文案、键盘原生链接行为；不新增搜索、排序、收藏、Recently Played、推荐算法、FAQ 或虚假热度。

## 3. SEO、数据及广告门禁

- **本轮五页全部保持 noindex**，不改 robots.txt、sitemap 或已有游戏 URL/TDK/搜索意图。样例保留原 Title `Face Makers | My Square Face Icon`、description 与 canonical，补齐本页 OG/Twitter（使用现有品牌 `/og-image.svg`，不声称游戏输出）及服务端 CollectionPage/ItemList + BreadcrumbList；两条 ItemList 必须与可见卡片一致，不加 Game、评分、评论或日期。
- 分类是导航集合，不与 `/` 的 Square 核心意图争同一关键词。不凑 250 词或 8 个条目。现有 RULES 附录 B 的聚合页 250 词/8 个有效条目为应该级参考，不单凭数量自动 index；未来还须真实独立价值、人工复核、KW-04、现有评分规则及单独索引确认。CAT-PUBLISH-001 未启动，本项不编造质量分。
- 公共分类读取 `/games` 已审阅的过滤结果，再按现有分类关系解析。当前五页计数和顺序应完全不变；负例排除 draft/broken、Guide/Blog、伪造 legacy 身份、重复 ID/路径、不允许的新发布。保持原游戏路由/许可校验，不向 UNKNOWN 发放新许可。未知或空分类继续真实 404，不创建软 404。
- **共享范围例外，须随本方案明确确认：** `/category` 与 `/category/...` 全族（含未知 slug 错误请求）设 `adEligible: false`；保留 `/games` 已验收隔离与 Analytics 原行为。其它四页本轮只有必要的数据防护、导航文档边界和广告行为受影响，正文/布局/metadata 不变；不是四页内容已实施或验收。
- 进入分类的既有 GameLink/CategoryChip 及分类退出链接采用整页导航，加载器同时检查原文档与当前地址，并处理意外客户端跳转；防止从已有广告的来源页带入执行过的广告脚本。拒绝规则按路径段匹配，不能误封 `/categoryish`、游戏资源或 `/games/[slug]`。不通过删除已执行 script 标签假装撤销广告。此局部治理不等于全站广告/CMP 通过。

## 4. 预期文件、检查与回滚

确认后预计涉及 `app/category/[slug]/page.tsx`、分类专属内容/metadata/policy 辅助文件、必要的 `GameLink`/`DeferredThirdPartyScripts` 接线、专用检查器及 npm/README 入口。优先不改共享 `data/game-categories.ts` 简介，避免改变首页已验收内容；保留 CSS，如确有样例裁切问题仅加分类作用域最小修正并留前后证据。

实施验收须包含：数据/去重/错误态负例；原始 HTML 与水合 metadata/schema；五页索引/计数及其余四页冻结对照；`/games`、首页/游戏/分类往返、键盘、后退/前进；1280×900、390×844、360×800 文本/入口/焦点截图；直接访问/交互/超过 12 秒/已有广告来源页的**按文档 URL 归属**网络证据；未知分类 HTTP 与水合 404。

执行 type、lint、相关全套回归、Next 与 Cloudflare/OpenNext 等效构建、本地 production SEO。旧 golden 和反例不能盲目刷新；新增变化须有精确可逆兼容契约与额外改动拒绝反例，原始失败日志保留。自动 SEO 0 must 不代替 KW-04/人类复核/CWV/真机或生产。

本轮只读证据：[proposal-checks.json](../quality/evidence/category-001/proposal-checks.json)。网站代码、原 QA、Registry/UNKNOWN、SWF 和构建保持不变；LICENSE-GATE 材料任务继续取消，不要求材料。未运行应用 QA/浏览器/移动/构建/生产检查，未部署；全站 P0 仍使发布为不通过。

回滚本次方案只需逆向 v1.74 的治理增量，不撤回 GAMES 实现与用户验收；未来实施按精确补丁回滚，不覆盖其它脏工作区成果。确认语：**`确认 CATEGORY-001 单页样例方案，进行开发`**。完成样例后停在待验收，不能自动扩展剩余四页、启动 RELATED-001 或部署。
