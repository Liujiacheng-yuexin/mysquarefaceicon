# CATEGORY-001 · 剩余四页批量方案

> v1.79 · 2026-09-04：剩余四页已获用户明确验收，结合原样例完成 CATEGORY-001 本地范围；[验收记录](../quality/evidence/category-001/remaining-acceptance-checks.json) 与 v1.78 原 QA 分开保存。下方历史方案/待验收表述不撤销新验收。下一项仅 [RELATED-001 算法与 Oval 单页方案](related-games-oval-sample-proposal.md) 待确认，网站不变/未部署，五分类 noindex 与原风险保留。

> v1.78 · 2026-09-04：本方案已由用户明确回复“确认 CATEGORY-001 剩余四页批量方案，进行开发”批准，并完成本地实施与 QA，**剩余四页待验收**。[交付与证据](../quality/evidence/category-001/remaining-README.md)。下方 v1.77 文字保留为原方案时点，不表示仍待方案确认。五页 noindex、Face Makers 样例验收、原 P0/UNKNOWN/材料任务取消保持；未部署，不自动下一项。

2026-09-04 · v1.77 · **方案待确认，未实施**。用户已验收 Face Makers 样例，并要求下一步；本方案是同一 CATEGORY-001 的后续阶段，不是 RELATED-001。权威状态只在原 HTML 看板维护。

## 1. 本次改哪些页面

只完善以下四个**既有 noindex 分类页**，不新增 URL、游戏或素材。当前数量/顺序直接读取 [目录分类解析器](../../lib/games/categories.ts)，不是手填库存或用户数据。

| URL | 现有卡片顺序/数量 | 本轮说明重点 | 新列表 H2 |
|---|---|---|---|
| `/category/avatar-makers` | Square、Oval、Pixel External：3 | 区分本站 maker 页面与外部工具说明入口 | Avatar maker entries |
| `/category/pixel-avatars` | Pixel External：1 | 外部工具的访问步骤与非嵌入边界 | Pixel avatar entries |
| `/category/retro-flash` | Square、Oval：2 | Flash-based maker 的按需启动入口 | Retro Flash entries |
| `/category/character-creators` | Pixel External：1 | 当前 character 集合覆盖范围和 face 选项 | Character creator entries |

Face Makers 的已验收正文、顺序、卡片、metadata/schema、交互均冻结；其原有四个分类链接保持。样例验收见 [acceptance-checks.json](../quality/evidence/category-001/acceptance-checks.json)，原 [单页方案](category-pages-proposal.md) 不扩大为四页实施授权。

**价值边界：** Pixel Avatars 与 Character Creators 当前只有同一条 Pixel 记录；Face Makers 与 Retro Flash 也共享两条记录。新增说明只改善现有导航的选择/访问指引，不足以证明独立搜索价值或 CT-02/05 已通过。四页不因完成改造自动 index；未来合并、删除或开放索引须另查实际需求/GSC/内链并获确认。本次不填充虚构条目、FAQ、评分或长文来凑 250 词/8 条参考值。

## 2. 布局与精确拟稿

四页使用相同的既有分类布局：

`页头 → 原面包屑 → 原 H1/简介 → 原卡片与真实计数 → 分类专属说明 → 其它分类 → 原两条返回入口 → 页脚`

保留薄荷/奶油/棕色与现有 CSS；不改首屏组成、卡片摘要/类型/CTA、封面、共享 Header/Footer。列表 H2 只按上表替换 `Available ...`，对应 aria-label 同步。新增模块位于卡片之后，不将播放器放进分类页；360/390px 必须核验首卡入口、全文和焦点，不只检查无溢出。

### Avatar Makers

H2：`Choose where to create`

> Square Face Generator and Oval Face Icon Generator open maker pages on this site. Start with either entry if you want a square or rounded face icon.

> Pixel Art Avatar Icon Generator is an external tool entry. Its card opens our access-details page first, where you can review the source and usage notes before visiting the original website.

### Pixel Avatars

H2：`Before opening the pixel avatar tool`

> The Pixel Art Avatar Icon Generator entry is an external tool. Its card opens the access-details page on this site, not an embedded editor.

> Read the source and usage notes on that page before following the link to the original website. For the site's Square and Oval entries, browse Face Makers.

末句的 `Face Makers` 为 `/category/face-makers` 原生文档导航链接；不直达原站，不添加 iframe。

### Retro Flash

H2：`Opening the Flash-based makers`

> Square Face Generator and Oval Face Icon Generator use Flash-based game files with a browser player. Open a maker page on this site, then select Play to load its player.

> This category does not run a game or download its player on its own. See the maker page for controls, saving guidance, and source or usage limitations.

只描述现有 RUFFLE_SWF 与 click-to-load 路径，不承诺保存成功、所有设备可用或来源许可已经核验。

### Character Creators

H2：`About this collection`

> The current character-creator entry is Pixel Art Avatar Icon Generator. It is listed here as an external tool, so this collection is a starting point for browsing rather than an on-site character editor.

> For a face-based character, browse Face Makers for the Square and Oval entries. Compare their square and rounded face styles before choosing a maker page.

`Face Makers` 链接同上；不对 Pixel 全身角色、动画或导出能力作未经核验的主张，也不将这一段的措辞差异当作独立 SEO 价值。

四页均追加 `Other avatar categories`，按既有 allowlist 顺序显示其它非空分类及实际计数，并复用已验收说明：`Categories overlap: the same entry can appear in more than one group.` 保留原返回 `/games` 与 `/` 的两条链接。无搜索、排序、收藏、最近游玩或推荐算法变化。

## 3. SEO、事实与交互边界

- 五个分类继续 **noindex/follow、自引用 canonical、不进 sitemap**。不改 robots.txt、路由、索引配置、共享分类定义、首页/游戏主词或旧页面 TDK。
- 四页原 H1、Title（`分类名 | My Square Face Icon`）及 description 沿用 [game-categories.ts](../../data/game-categories.ts) 原值。只补各自 OG/Twitter：原 Title/description、自身 URL、现有品牌 `/og-image.svg`；不声称图片是游戏输出。
- 四页补服务端 CollectionPage/ItemList + BreadcrumbList；ItemList 名称、数量、顺序、站内详情 URL 与实际可见卡片逐项一致。无 VideoGame/WebApplication、评分、评论或虚构日期；原始 HTML 与水合分别检查。Face Makers 的既有 metadata/schema 保持逐字段等价。
- 继续使用 `/games` 已审阅的数据过滤/身份与去重规则；未知/空分类真实 404/noindex。保留 `/category` 全族无广告、进入/离开分类的整页导航、原文档与当前路径守卫及 Analytics 原行为。此次不修改共享广告加载器、GameLink 或权限逻辑。
- 新说明必须引用当前过滤后记录的准确身份、类型和站内路径。未来若缺记录或交付类型改变，对应说明/链接不得继续盲目显示；实施时以显式依赖校验省略不成立的说明，记录缺口，不阻断其余真实卡片或伪造新记录。当前三个依赖均存在，按上文完整渲染；负例检查缺失/伪造/类型变化/空分类。
- 人类逐项事实复核 `humanReview` 仍未完成；用户样例验收不自动变为四页人类审核。未测的真机、全部 SWF 内部操作/保存/全屏、外站生成能力、权利、KW-04 与质量分保持未验证/UNKNOWN。LICENSE-GATE 材料任务继续取消，不重新索取材料。

拟稿证据归属：卡片集合/路径/类型来自当前 `lib/games/categories.ts`、三个 GameRecord；访问详情与外链边界来自 `app/pixel-art-avatar-icon-generator/page.tsx` 和既有 MIG-PIXEL QA；Flash/Play 依据现有 Player 与 v1.75 样例 QA。以上是源码和有日期的历史依据，不是本轮重新操作外站/游戏或审核原始授权。实施后按 [内容审核模板](../content/game-page-review-template.md) 对四页分别记录新主张、限定证据、反例与人工未覆盖项。

## 4. 确认后实施与验收

预计网站改动限 `app/category/[slug]/page.tsx`、`lib/games/category-content.ts` 和必要的分类专属内容辅助文件；复用 `lib/seo/category-sample.ts` 现有构造函数，优先不改其实现。公共分类定义、catalog、Registry、SWF、播放器、广告/导航策略、CSS、依赖及其它页冻结。若遇到必须改变冻结区的问题，先记录并请求修订范围，不顺手改造。

测试改动限新批量专项检查、npm/scripts README 入口和**精确、可逆的兼容契约**。原 category-sample 的“四页冻结”正是本次拟批准的例外，不能直接刷新旧 golden 或删除断言：保留旧基线，以受批准的源/渲染增量逆向验证旧契约，新检查同时验证真实新增结果；任意额外改动应使负例失败。Face Makers、首页、GAMES 和旧 Square/Oval/Pixel/Locale 快照保持。

确认后的验证要求：

1. 四页逐项事实记录；真实 TS/SSR 数据、卡片/文案/链接/metadata/schema 与空态/身份/依赖负例；五页总数仍为 2/3/1/2/1，不增加路由。
2. type、lint、所有相关已验收回归、新批量专项；Next 与 Cloudflare/OpenNext 分别构建，子进程有超时/日志/明确退出码。
3. 本地 production 原始 HTTP/产物/水合、五页 noindex/canonical、sitemap/robots/真 404；本地 `seo:check` 与专项分开，不把通用 0 must 当作 KW-04 或分类质量认证。
4. 五页 × 1280×900、390×844、360×800；检查全文/首卡/焦点/无覆盖层或横向溢出。Face Makers 与未授权其它页做前后冻结对照；四页新增模块明确记录差异。
5. 首页/目录/分类/游戏往返、所有新增链接、Tab/Enter、前进/后退及 404 返回。直接进入、交互、超过 12 秒等待、已有真实执行广告的来源页进入分类分别归属到文档；保留原 v1.75 两次整体 load 超时失败，本轮复测不得仅拼接正例宣称单批通过。

完成上述范围后只设 **剩余四页待验收**，等用户明确验收才判断 CATEGORY-001 本地整项完成；不自动开始 RELATED、开放索引或部署。原全站 P0/广告/CMP/生产门禁不关闭。

## 5. 本轮交付与回滚

本轮只有此方案、看板 v1.77 门禁与治理引用增量；网站代码/URL/构建/原 QA 不变。只执行当前数据只读求值、文件指纹、文档链接和看板离线 JS/状态验证，证据：[remaining-proposal-checks.json](../quality/evidence/category-001/remaining-proposal-checks.json)。未重跑应用 type/lint/tests/Next/OpenNext/HTTP/SEO/浏览器/移动/CWV，未核实预览存活；真实看板视觉仍未验证，不绕过已有访问限制。

本轮发布结论仍 **不通过 / 未部署**。回滚只逆向 v1.77 方案/治理增量，保留 v1.76 样例验收、v1.75 实现与历史失败，不能覆盖其它未提交成果；没有线上回滚事项。

确认语：**`确认 CATEGORY-001 剩余四页批量方案，进行开发`**。
