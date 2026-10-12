# PAGE_PLAN.md
> 2026-10-12 · QUIZ-001：用户已确认 [Friend Block Test 单页方案](docs/product/friend-block-test-proposal.md)，本地新增 `/games/friend-block-test`（单条 INDEX 白名单、自引用 canonical、sitemap）及 `/category/friend-quizzes`（noindex、无广告、不进 sitemap）。沿用详情模板和现有发现规则，首页首屏与既有 URL/index 状态保持。出题、猜题、成绩回传都在浏览器运行；页面和静态入口隔离第三方脚本。工程/浏览器证据见 [QUIZ-001](docs/quality/evidence/quiz-001/README.md)，当前任务状态以权威 HTML 看板为准；没有发布授权。
> 2026-10-09 当前增量：用户明确要求按附件新建 `/discord-banner-size`，P0 本地代码与验证已交付；[范围、来源与 QA](docs/product/discord-banner-size.md)。仅在现有资源区和三篇 Discord 文章增加关联入口，既有页面意图及核心模块顺序保持。状态以权威 HTML 看板 `DISCORD-BANNER-001` 为准；等待用户验收，不提交或发布。下方旧“当前任务”保留其原日期语境。
> 2026-09-22 当前任务：用户已验收 HOME-CTR-001 首页摘要，并明确确认 [首页移动编辑器方案](docs/seo/home-ctr-2026-09-22.md)。HOME-MOBILE-001 在原首页接入 Classic game / Simple maker 切换，手机默认简版、桌面默认经典；本轮不新增 URL、不改索引或部署。最终状态与证据以权威 HTML 看板为准，原 IMG-001 与所有历史验收保持。


> 当前 v1.96 · 2026-09-08：用户明确回复 `ASSET-001 验收通过`，其本地 manifest/schema/fail-closed checker 标记完成；外部 R2 仍未授权，Square/Oval 权利 `UNKNOWN`、Pixel 仅外链、Ruffle 独立治理及首屏 cover 本地保留不变。路线图下一项为 [IMG-001 图片规范与优化管线方案](docs/product/game-image-pipeline-proposal.md)，当前仅 `设计中 / 方案待确认`：把现有非 16:9 `COVER` 明确定义为 `PLAYER_PREVIEW`，新增可选且严格 16:9 的 `LANDSCAPE_COVER`；Thumbnail 必须 1:1、OG 必须 1200×630、所有 Game Data 图片尺寸必填，非首屏图片明确 lazy。只读盘点确认 public 29 图 / 448,379 bytes、8 个 Game Data 图片记录 / 6 个唯一 URL，Square thumbnail 实际 512×512 但数据尺寸为空；Square/Oval Player preview 为 970×844、974×775；共享 OG SVG 为 1200×630。assets/games/components/metadata/perf-home 五项基线 exit 0；看板本地 HTTP 渲染、0 error/warn、详情交互与方案按钮禁用通过。本轮未改应用、图片、依赖、页面/SEO 或 R2，未跑应用 build/HTTP/browser/CWV；26/60、37 个源验收键，未提交/推送/部署。等待 `确认 IMG-001 图片规范与优化管线方案，进行开发`。

> 当前 v1.94 · 2026-09-08：用户已确认 [ASSET-001 方案](docs/product/game-asset-storage-proposal.md)，本地新增 `data/game-asset-manifest.json`、类型/结构约束与 `npm run assets:check`。现有 10 个 Game Data 资产引用、8 个唯一本地响应、字节/哈希/MIME/缓存与 20 个 fail-closed 负例通过；清单没有声明任何 R2 对象。Square/Oval SWF 继续因权利 `UNKNOWN` 阻止迁移，Pixel 继续仅外链，Ruffle 继续独立治理，Square 首屏 LCP cover 保持本地。Type/lint、既有数据/Player/Ruffle/性能/三页/目录/分类/相关推荐/最近/收藏、Next/OpenNext、本地 HTTP、20 URL SEO（0 必须失败/12 既有应该提醒）、robots 与桌面 Square/Oval 运行态通过；手机 390/360、真实网络请求面板、错误注入/Retry、全屏、真机/其它引擎、生产 CWV/SEO/部署仍未验证。25/60、36 个源验收键不变，状态 `ASSET-001 待验收`；没有修改 R2/CORS/TLS/对象、页面或 SEO，没有提交/推送/部署。证据：[checks.json](docs/quality/evidence/asset-001/checks.json)。

> 当前 v1.89 · 2026-09-07：用户明确确认 `FAV-001` 方案后，已按确认范围完成本地 Favorites 实现并停在 `待验收`。`msfi-favorites-v1` 只存最多 50 个稳定 Game Data ID，最近收藏置前；覆盖共享 GameCard/GameGrid、Recently Played、Oval/Pixel legacy Related、三个当前入口与 future detail，Pixel 始终使用 External Tool / Save tool 语义；`/games` 仅在有有效收藏时于 Recently Played 后、On-site 前显示 Favorites。无账号、网络、云同步、新 URL、统计或热度。专项、TypeScript、零警告 lint、全部相关冻结回归、Next 42 页、OpenNext、本地 production HTTP/SEO/robots、同/跨标签同步与 1280×900、390×844、360×800 浏览器验证通过；精确移动视口无横向溢出，控件 44px，状态切换几何不变。23/60 与 34 个源验收键保持；Square/Oval 权利 UNKNOWN、人工事实审核、真实 CWV、广告/CMP 和生产门禁仍开放。未提交、推送、部署或运行 `seo:prod`。证据：[FAV-001 本地交付](docs/quality/evidence/fav-001/README.md)。等待 `FAV-001 验收通过`。

> 当前 v1.88 · 2026-09-07：用户在 `RECENT-001` 验收后明确要求下一步开发；路线图下一项为 `FAV-001`。由于它会新增跨页面 localStorage、卡片独立按钮、三个当前入口/future detail 操作和 `/games` 条件模块，本轮只提交 [Favorites 本地收藏方案](docs/product/favorites-local-storage-proposal.md)，状态 `设计中 / 方案待确认`，尚未修改应用。推荐 `msfi-favorites-v1` 只存最多 50 个稳定 Game Data ID，覆盖共享卡片、Recently Played、Oval/Pixel legacy Related 与详情入口；Pixel 可保存但始终标 External Tool；Favorites 只在 `/games` 查看，不新增 URL。10 项相关现状回归 exit 0，game-template 保留既有 React `fetchPriority` warning；未运行 type/lint/build/HTTP/SEO/browser。23/60、34 个唯一源验收键保持，原 P0/UNKNOWN/移动与生产门禁不变；未提交、推送或部署。等待 `确认 FAV-001 方案，进行开发`。

> 当前 v1.87 · 2026-09-07：用户明确回复 `RECENT-001 验收通过`，已登记本地成果验收；看板现为 23/60、34 个唯一源验收任务键。[验收记录](docs/quality/evidence/recent-001/acceptance-checks.json) 只确认 v1.86 的版本化本地历史、Square/Oval 首次 Play、首页与 `/games` 条件模块、同步/Clear 和 Privacy 披露，不把精确 390/360 移动视觉、seeded-history CLS、实际权利、生产或发布改写为通过。本轮仅更新治理记录，不修改应用、测试或构建产物，不重跑 type/lint/专项/Next/OpenNext/HTTP/SEO/robots/browser/mobile/CWV；原 v1.86 结果、失败与日期保持。`FAV-001` 未开始，等待用户明确下达下一任务；未提交、推送、部署或运行 `seo:prod`。

> 当前 v1.86 · 2026-09-07：用户已明确确认 `RECENT-001` 方案；已按确认范围完成本地实施并停在 `待验收`。新增版本化 `msfi-recently-played-v1`（只存 `gameId`/`startedAt`，8 存/4 显）、Square/Oval 首次 Play 记录、英文首页 discovery 与 `/games` 条件式 Continue Playing、同标签/跨标签同步、仅本 key 的 Clear 与 Privacy 披露；Reload/Retry/页面访问/Pixel External 均不记录，FAV-001 未开始。专项、全量相关回归、type、0-warning lint、Next/OpenNext、built/loopback、20 页 SEO（0 must / 12 个既有 should）、robots 与桌面真实交互通过；内置浏览器请求 390×844 后实际仍为 1280 CSS px，因此 390/360 精确移动视觉与 seeded-history CLS 保持 `未验证`。22/60 与 33 个唯一源验收键不增加，原 P0/UNKNOWN/人工/广告/CMP/生产门禁不变；未提交、推送、部署或运行 `seo:prod`。证据：[RECENT-001 交付](docs/quality/evidence/recent-001/README.md)。等待 `RECENT-001 验收通过`。

> 当前 v1.85 · 2026-09-07：用户在 RELATED-001 本地整项验收后明确要求下一步开发；路线图下一项为 `RECENT-001`。由于它新增跨页面 localStorage、Player 启动记录点、首页/目录可见模块与隐私披露，本轮只提交 [Recently Played 方案](docs/product/recently-played-proposal.md)，状态 `设计中 / 方案待确认`，尚未修改应用。方案只在可玩 player 首次从 idle 启动时记录真实 Game Data ID 与 ISO 时间；Reload 不重复，Pixel External 不记为玩过；首页和 `/games` 仅有有效本地记录时显示 Continue Playing，并能只清除此 key。player/home/home-discovery/games-index 四项现状回归 exit 0；未运行 type/lint/build/HTTP/SEO/browser。22/60、33 个唯一源验收任务键保持，FAV-001 未开始；原 P0/UNKNOWN、材料任务取消及生产门禁不变，未提交、推送或部署。等待 `确认 RECENT-001 方案，进行开发`。

> 当前 v1.84 · 2026-09-07：用户明确回复 `RELATED-001 剩余入口验收通过`；结合 v1.81 Oval 样例验收，RELATED-001 本地范围整项完成。[验收记录](docs/quality/evidence/related-001/remaining-acceptance-checks.json)。v1.83 的实现、72 项专项、全回归、type/lint、Next/OpenNext、built/HTTP、20 页 SEO、robots、三视口与第三方 Ads 条件项均保持原日期，本轮仅登记验收，不重跑应用 QA、构建或浏览器。当前 22/60 已完成，33 个唯一源验收任务键保持；RECENT/FAV 未开始，URL/SEO/index/Player/CSS 不变。原 P0/UNKNOWN、完整 Oval 延期、人工审核、真机/CWV、生产和材料任务取消状态保持；未提交、推送或部署，等待用户明确下一任务。

> 当前 v1.83 · 2026-09-07：用户明确确认 RELATED-001 剩余入口方案，英文首页 discovery、Pixel 页尾和 future `/games/[slug]` 共享 `RelatedGames` 已迁移到已验收 Category + Tags 选择器，当前顺序保持 Square→Oval/Pixel、Pixel→Square/Oval；Pixel 原指南独立分组，`relatedGameIds` 仅保留兼容字段。72 项专项、全量相关回归、type/lint、Next/OpenNext、built/HTTP、20 页 SEO（0 must / 12 个既有 should）、robots 与 Chrome 1280/390/360px 通过；首轮 Pixel 历史导航后 console 为 1/2/0，诊断复跑定位到第三方 Ads 403 并得到 1/0/0，浏览器项有条件通过。[交付证据](docs/quality/evidence/related-001/remaining-surfaces-README.md)。当前仅本批**待验收**，21/60 与 33 个源验收键不变；Oval 样例、URL/SEO/index/Player/CSS、P0/UNKNOWN、完整 Oval 延期与材料任务取消保持。不启动 RECENT/FAV，不提交、推送或部署；等待 `RELATED-001 剩余入口验收通过`。

> 当前 v1.82 · 2026-09-07：用户在 RELATED-001 Oval 样例验收后明确要求下一步开发；按页面与核心模块确认门，仅提交[剩余入口方案](docs/product/related-games-remaining-surfaces-proposal.md)，待确认、未实施。拟让英文首页 discovery、Pixel FAQ 后推荐区和未来 `/games/[slug]` 共享组件使用已验收选择器；当前 Square 仍输出 Oval/Pixel，Pixel 仍输出 Square/Oval，现有链接目标与顺序不变。首页只拟改一处 H3/说明，Pixel 拟把原指南独立分组，future template 保持模块位置。Oval 样例、目录/五分类、七个 noindex locale、URL/TDK/H1/canonical/schema/index/sitemap/robots 与 Player 冻结；quality/popularity 继续禁用。4 项当前范围检查通过，game-template 的既有 React warning 保留；未重跑全量 QA/构建/浏览器/生产。21/60、33 个源验收键和原 P0/UNKNOWN 保持；不启动 RECENT/FAV，不提交、推送或部署。[方案证据](docs/quality/evidence/related-001/remaining-surfaces-proposal-checks.json)。等待 `确认 RELATED-001 剩余入口方案，进行开发`。

> 当前 v1.81 · 2026-09-07：用户明确回复 `RELATED-001 Oval 单页样例验收通过`，登记第 33 个源验收任务键；范围仅 v1.80 的选择器与 Oval FAQ 后 2+3 分组，RELATED-001 整项仍未完成、其它入口未开始。[验收记录](docs/quality/evidence/related-001/acceptance-checks.json)。v1.80 的 53 项三模式专项、全局 type/lint、共享回归、Next/OpenNext、HTTP/SEO、三视口与失败记录保留原日期，本轮只做验收治理，不重跑应用 QA、构建或浏览器。21/60 不变；不启动 RECENT/FAV，不提交、推送、部署或开放索引。原 P0/UNKNOWN、完整 Oval 延期、人工/生产门禁和材料任务取消保持。

> 当前 v1.80 · 2026-09-05：RELATED-001 已按确认范围完成可复用 Category/Tags 选择器，并只在 `/oval-face-icon-generator` FAQ 后接入 Square 与明确标识的 Pixel External；原三张 Guide/Gallery 卡原文原序移入独立资源组，首页、Pixel、目录、分类与通用 RelatedGames 未批量改动。53 项专项断言、type/零警告 lint、相关回归、Next/OpenNext、本地 HTTP/SEO、1280/390/360px 浏览器与 9 个往返交互通过；初始失败和修正重跑分列留证。[本地交付](docs/quality/evidence/related-001/README.md)。当前仅 Oval 样例待用户验收；21/60 与 32 个源验收键不变，不提交/推送/部署或进入 RECENT/FAV。五分类 noindex、原 P0/UNKNOWN、完整 Oval 延期、人工/生产门禁和材料任务取消保持。

> 当前 v1.79 · 2026-09-04：用户明确验收 CATEGORY-001 剩余四页；结合已有 Face Makers 样例，CATEGORY 本地整项完成，五分类仍 noindex。[验收记录](docs/quality/evidence/category-001/remaining-acceptance-checks.json)。按下一步指令，仅准备 [RELATED-001 算法与 Oval 单页方案](docs/product/related-games-oval-sample-proposal.md)，待明确确认、未实施；其它入口不批量接入。32 个源验收任务键，原样例及新批次分别存证；原 40 份历史 JSON/QA/失败、UNKNOWN/P0/完整 Oval 延期/材料任务取消保持。本轮只验收/方案治理，不改网站代码，不重跑应用/浏览器/SEO/构建，未提交/推送/部署。下方旧当前状态均保留原时点。

> 当前 v1.78 · 2026-09-04：CATEGORY-001 剩余四页按确认方案实施，**待独立验收**；Face Makers 样例和 32 条源验收保持。[本批交付](docs/quality/evidence/category-001/remaining-README.md)。增加分类说明/互链与 OG/Twitter/集合 schema，五页仍 noindex/follow/self-canonical、不入 sitemap；未启动 RELATED。51 工程命令及最终浏览器批次通过，首次 GA 连接失败与原超时保留。人类事实审核、独立搜索价值、KW-04/CWV/权利/生产未验证，原 P0/UNKNOWN/完整 Oval 延期/材料任务取消保持；未提交、推送或部署。下方旧状态是原时点记录。

> 当前 v1.77 · 2026-09-04：CATEGORY-001 进入[剩余四页批量方案待确认](docs/product/category-remaining-pages-proposal.md)，未实施；Face Makers 样例与全部 32 条源验收保持。拟完善 Avatar Makers / Pixel Avatars / Retro Flash / Character Creators 的说明、分类导航和 metadata/schema，五页仍 noindex，整项未完成。仅方案/看板离线核验，无网站代码/构建/生产变化，不重跑应用 QA；不启动 RELATED。原 QA/失败/UNKNOWN/P0、完整 Oval 延期与材料任务取消保持。[本轮证据](docs/quality/evidence/category-001/remaining-proposal-checks.json)。

> 当前 v1.76 · 2026-09-04：用户明确验收 CATEGORY-001 单页样例，登记第 32 条源验收，范围仅 Face Makers 与已确认共享分类边界；整项仍设计中，剩余四页方案/正文未启动。[验收记录](docs/quality/evidence/category-001/acceptance-checks.json)。本轮无网站代码/URL/索引/构建变化，不重跑应用 QA、不开新任务或部署。原 31 条验收、QA/失败、UNKNOWN/P0、完整 Oval 迁移延期与材料任务取消保持；下方旧状态保留原时点。

> 当前 v1.75 · 2026-09-04：按用户确认完成 CATEGORY-001 Face Makers 样例及共享数据/文档导航/广告隔离，现**样例待验收，整项未完成**。[证据](docs/quality/evidence/category-001/README.md)。其余四页正文/布局/metadata 保持，12 组截图 SHA 相同；五页数量 2/3/1/2/1、URL/noindex/follow/canonical/sitemap 不变。48 工程检查通过，浏览器与原超时分列。31 条源验收/历史证据保持，不自动批量、RELATED、索引或部署。下方旧“当前”是历史；原 P0/UNKNOWN、人工复核、材料任务取消保留。

> 当前 v1.74 · 2026-09-04：用户明确回复 `GAMES-INDEX-001 验收通过` 并要求下一项；登记第 31 条本地源验收，原 30 条和 v1.73 全部 QA/失败日期保留。[验收记录](docs/quality/evidence/games-index-001/acceptance-checks.json)。下一项 CATEGORY-001 只提交 [Face Makers 单页样例方案](docs/product/category-pages-proposal.md)，待明确确认；其它四页先不批量开发，拟议共享分类数据/广告边界单列。五页继续 noindex；本轮网站代码/构建未变，应用 QA 未重跑，未部署。旧版本“待验收/当前”段落均为历史语境；材料任务保持取消，UNKNOWN/原 P0 保留。

> 当前 v1.73 · 2026-09-04：按用户“现在开始进行下一步开发”，继续已确认的 GAMES-INDEX-001。目录/导航/广告隔离已实施并完成本地 QA，仅待验收；HOME-DISC 原验收保留。45 项最终工程检查、三视口与往返/网络证据见 [交付](docs/quality/evidence/games-index-001/README.md)。下方 v1.72 暂停及更早记录均为历史，不覆盖当前状态。未提交、推送或部署，30 条验收及材料任务取消状态保留。

> 当前 v1.72 · 2026-09-04：HOME-DISC-001 已于 9 月 1 日验收，最新同名确认需明确新增修改范围；本轮专项复查通过，不重复开发。GAMES-INDEX-001 方案已确认后部分实施，现暂停且未完成 QA/验收/部署。[记录](docs/quality/evidence/games-index-001/implementation-interruption.md)。下方 v1.71 及更早内容为历史语境，不能覆盖当前暂停状态；30 条源验收和材料任务取消状态保留。

> 当前 v1.71 · 2026-09-03：用户明确验收 CONTENT-QA-001，新增第 30 条源验收；规范与模板通过不等于三页事实复审或发布通过。验收证据：[acceptance-checks.json](docs/quality/evidence/content-qa-001/acceptance-checks.json)。
> 下一项 GAMES-INDEX-001 仅准备 [目录页方案](docs/product/games-index-directory-proposal.md)，待明确确认；沿用现有布局、3 条真实记录和 noindex，提出目录导航/metadata/广告边界改进。尚未修改网站代码或部署；其它任务不启动，LICENSE-GATE 材料任务保持取消，UNKNOWN 与原风险保留。

> v1.70 历史标准交付记录（当时待验收）· 2026-09-03：按用户“继续进行开发”，仅完成 CONTENT-QA-001 游戏内容事实核验标准与单页审核模板，待用户验收。入口：docs/content/game-page-quality-standard.md；证据：docs/quality/evidence/content-qa-001/checks.json。
> 本项不改网站页面/URL/索引/布局、运行代码或数据，不重跑应用 QA，不部署或开始下一项。29 条源验收及原 QA 保留；LICENSE-GATE 继续取消，UNKNOWN 和其它未关闭风险不变。

> v1.69 历史取消记录 · 2026-09-03：用户明确要求“不用提供，取消该项任务计划和相关文件”。LICENSE-GATE 材料补充计划已取消，不再要求材料，也不依据历史记录重建或催办该任务。专属清单和两份预检文件已从活跃目录移至 docs/archive/license-gate-cancelled-2026-09-03，可恢复；旧 JSON 的原路径和待材料措辞仅为历史。
> 29 条验收、原 QA、共享 Registry/UNKNOWN、应用及 SWF 保留；取消不记作许可或发布验证通过。本轮只取消和清理引用，不部署或开始下一项。下文原版本计划保留当时语境，不能覆盖本次取消。

> This file is the project page inventory and internal-link plan. Reusable SEO rules are defined only in `RULES.md`; project-specific decisions are in `SEO_RULES.md`. Page proposals use KW-01 position coverage, KW-04 semantic coverage, LINK-01/02/03, and CT-05—not the retired `3%-5%` density target.

## First Release Pages

| Page | URL | Type | Primary Keyword | Search Intent | Priority | Status |
|---|---|---|---|---|---|---|
| Discord Banner Size | `/discord-banner-size` | Guide + local static image tool | discord banner size | Identify the right banner surface and crop/fit PNG or JPEG locally | P0 | Local implementation; acceptance follows authoritative board |
| Home EN | `/` | Tool page | square face generator | Play a square face avatar maker and create an icon | P0 | Implemented |
| Home ES | `/es` | Tool page | generador de caras cuadradas | Play the localized generator | P0 | Implemented |
| Home VI | `/vi` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Home JA | `/ja` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Home TH | `/th` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Home AR | `/ar` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Home RU | `/ru` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Home ID | `/id` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| About Us | `/about-us` | Trust page | about My Square Face Icon | Learn who runs the site and how the project handles originality and privacy | P1 | Implemented |
| Contact | `/contact` | Trust page | contact My Square Face Icon | Contact the project about feedback, privacy, corrections, or moderation | P1 | Implemented |
| Editorial Policy | `/editorial-policy` | Trust page | editorial policy | Explain content quality, AI assistance, moderation, and correction standards | P1 | Implemented |
| Free Avatar Maker | `/free-avatar-maker` | Support / guide page | free avatar maker | Create a free avatar with a square face icon workflow | P1 | Implemented |
| Oval Face Icon Generator | `/oval-face-icon-generator` | Tool page | oval face icon generator | Play an oval face avatar maker and create a rounded profile icon | P1 | Implemented |
| Pixel Art Avatar Icon Generator | `/pixel-art-avatar-icon-generator` | External Tool / direct-link page | pixel art avatar icon generator | Open the original icongenerators.net pixel avatar maker with source attribution and clear external boundaries | P1 | Implemented |
| Square Avatar Generator | `/square-avatar-generator` | Support / guide page | square avatar generator | Learn how square source avatars work across profile crops and platforms | P1 | Implemented |
| Square Face Icon Gallery | `/gallery` | Inspiration gallery | square face icon gallery | Browse original square face icon examples and style ideas | P1 | Implemented |
| Square Face Icon Guide | `/square-face-icon-generator` | Support / guide page | square face icon generator | Learn how to create and use square face icons | P1 | Implemented |
| Cute Square Avatar Tips | `/cute-square-avatar-generator` | Support / guide page | cute square avatar generator | Learn style tips for cute square profile avatars | P1 | Implemented |
| Pixel Square Face Maker | `/pixel-square-face-maker` | Support / guide page | pixel square face maker | Create a pixel-inspired square face avatar workflow | P2 | Implemented |
| Blog Index | `/blog` | Blog hub | square face icon guides | Browse practical avatar icon guides | P1 | Implemented |
| Discord Profile Icon Guide | `/blog/how-to-make-a-cute-discord-profile-icon` | Blog guide | how to make a cute Discord profile icon | Make a readable Discord profile avatar | P1 | Implemented |
| Discord Avatar Size Guide | `/blog/discord-avatar-size-guide` | Blog guide | Discord avatar size | Learn avatar source size and crop-safe profile icon rules | P1 | Implemented |
| TikTok Profile Icon Ideas | `/blog/tiktok-profile-icon-ideas` | Blog guide | TikTok profile icon ideas | Find profile icon ideas for TikTok creator accounts | P1 | Implemented |
| Square Avatar vs Round Avatar | `/blog/square-avatar-vs-round-avatar` | Blog comparison | square avatar vs round avatar | Compare avatar source shape and platform display crops | P1 | Implemented |
| Cute Profile Picture Ideas | `/blog/cute-profile-picture-ideas` | Blog guide | cute profile picture ideas | Find cute avatar ideas for social and gaming profiles | P1 | Implemented |
| Best Discord Avatar Style | `/blog/best-discord-avatar-style` | Blog guide | best Discord avatar style | Choose a readable Discord avatar style for servers and circular crops | P1 | Implemented |
| Avatar Maker Without Signup | `/blog/avatar-maker-without-signup` | Blog guide | avatar maker without signup | Create a profile avatar without account creation or design software | P1 | Implemented |
| Privacy Policy | `/privacy-policy` | Legal | privacy policy | Understand data handling | P0 | Implemented |
| Terms of Service | `/terms-of-service` | Legal | terms of service | Understand usage terms | P0 | Implemented |

## ROUTE-001 Noindex Scaffolds

| Route family | Current purpose | Index state | Current boundary | Status |
|---|---|---|---|---|
| `/games` | Minimal data-driven directory for the three published records | `noindex, follow`; self-canonical; excluded from sitemap | Full directory information architecture and index decision remain in `GAMES-INDEX-001` | Implemented · ROUTE-001 accepted 2026-08-31 |
| `/category/[slug]` | Allowlisted category shell for Face Makers, Avatar Makers, Pixel Avatars, Retro Flash, and Character Creators | `noindex, follow`; self-canonical; excluded from sitemap | Only categories with real records resolve; unknown slugs return 404; index decision remains in `CATEGORY-001` | Implemented · ROUTE-001 accepted 2026-08-31 |
| `/games/[slug]` | Future non-legacy published-game route boundary | No current public page; excluded from sitemap | Current legacy slugs and unknown slugs return a visible true 404; a record must pass status, rights, type, path, and publication gates | Implemented · ROUTE-001 accepted 2026-08-31 |

The shared navigation and sitemap are intentionally unchanged in `ROUTE-001`. Existing public game URLs remain the only public hrefs for the current three records.

## COMP-001 Shared Component Foundation

The accepted route scaffolds now use typed `GameBreadcrumb`, `GameGrid`, `GameCard`, and `CategoryChip` components. The existing five-adapter player is available through `components/game/GamePlayer.tsx`, and its control bar is implemented by the reusable `GameControls` component. `GameMeta`, `RelatedGames`, `EmptyState`, and the inert `AdSlotShell` are complete and isolated for later detail-page, recommendation, empty-state, and advertising tasks.

This component refactor does not change the homepage module order, public URLs, metadata, canonical URLs, robots directives, sitemap membership, or indexability. `AdSlotShell` is not mounted on the current noindex route scaffolds or 404 boundary.

## META-001 Game Metadata Foundation

The Square homepage, Oval legacy route, Pixel external-tool route, and future `/games/[slug]` boundary now use the shared `lib/seo/game-metadata.ts` builder. Title, description, canonical, Open Graph, Twitter Card, and the default page H1 resolve from the validated `GameRecord`; the homepage keeps its reviewed English language alternates.

The metadata QA fails closed for missing required SEO fields, incomplete Open Graph images, mismatched legacy canonical paths, and duplicate title/description/canonical values across indexable game records. Existing URLs, title/description strings, H1 text, canonical URLs, robots/indexability, sitemap membership, and search intents remain unchanged. Pixel's Open Graph image alt now says “external tool page” instead of the stale “embedded tool page”; the visible page/template migration remains separately gated under `MIG-PIXEL-001`.

## HOME-IA-001 Primary Homepage Architecture

The English root homepage now renders the Square Face Generator as a centered core game region, followed immediately by a server-rendered discovery region. Featured Avatar Games resolves the Square record's explicit `relatedGameIds` to the published Oval and Pixel records; Pixel remains visibly labeled as an External Tool. Browse by Category lists only allowlisted categories with current published records and keeps the existing category routes `noindex, follow` and outside the sitemap.

Continue Playing and New Games do not render because there is no Recently Played state and all current publication timestamps remain `UNKNOWN`/`null`. Gallery stays after discovery; What Is, Features, How to Play, Tips, and FAQ retain their visible copy and semantic order below it. Free Avatar Maker, Square Face Icon Guide, Gallery, and Blog are now grouped in a post-FAQ Guides & Resources section rather than appearing in the Games list. Draft locale homepages retain their prior structure until separately reviewed.

This information-architecture change preserves the root URL, title, description, H1, canonical, Open Graph, Twitter, schema, robots/indexability, language alternates, sitemap membership, legacy URLs, existing anchors, and click-to-load player boundary.

## HOME-HERO-001 Root Homepage Hero and Core Entry

The confirmed English root homepage Hero now uses a responsive value-and-player composition: desktop places the frozen Square Face Generator H1, exact value copy, and a direct `Play Game` CTA beside the existing real Square cover; mobile returns to DOM-order single-column flow, hides the duplicate Hero CTA, and keeps the cover Play plus the `Fullscreen / Reload Game / Report Issue` controls visible without horizontal overflow. Draft locale homepages retain their previous structure.

Both desktop Play entries control the same `GamePlayer` instance. The initial page still renders only the stable cover and native controls; Ruffle, WASM, and SWF remain click-to-load. The following accepted discovery region is unchanged and remains immediately after the Hero. The root title, description, H1 value, canonical, Open Graph, Twitter, schema, robots/indexability, language alternates, sitemap membership, legacy URLs, and search intent are frozen.

Local implementation and responsive browser evidence were completed on 2026-09-01. The user explicitly accepted HOME-HERO-001 on 2026-09-01 with `验收通过，现在进行下一步开发`; the task is complete and HOME-DISC-001 has moved to its required proposal-confirmation gate. Full lint, framework build, Cloudflare build, and local production SEO verification remain blocked by the preserved malformed `app/sitemap.ts`; no commit, push, or deployment occurred.

## HOME-DISC-001 Featured, New, and Category Discovery

The user explicitly confirmed `docs/product/home-discovery-modules-proposal.md` on 2026-09-01, and the bounded root-homepage discovery change is now implemented locally and awaiting acceptance. A server-side resolver reads the Square record's ordered `relatedGameIds`, excludes current, missing, duplicate, unpublished, or non-public records, and supplies the shared card/grid components with the published Oval and Pixel records. Both cards now use their real Game Data thumbnails; Pixel retains an explicit External Tool label and dashed boundary and still links first to its onsite details page.

The New Games resolver accepts only published records with `publication.timestampStatus = VERIFIED` and a valid non-empty `publishedAt`, orders them newest first, and removes current/Featured duplicates. All three current published records still have `UNKNOWN`/`null` timestamps, so the production root renders no New heading, container, badge, date, or empty state. A task fixture proves the verified-record branch and the unknown/invalid exclusion branches. Categories continue in allowlist order with real published counts and only non-empty groups.

Desktop media cards and the five-column category rail were verified at 1600/1440/1280 widths; the compact horizontal cards and two-column category grid were verified at 430/390/360 widths without horizontal overflow. Oval, Pixel, Face Makers, and Retro Flash navigation were exercised in the in-app browser; both category pages remain `noindex, follow`. The root URL, title, description, H1, canonical, schema, robots/indexability, language alternates, sitemap membership, search intent, Hero, Gallery, long-form content, Resources, and click-to-load player behavior remain frozen. The user explicitly accepted HOME-DISC-001 on 2026-09-01 with `HOME-DISC-001 验收通过`; the task is complete. No commit, push, or deployment occurred. The user's next-step instruction opened HOME-GALLERY-001 at its required proposal-confirmation gate.

## HOME-GALLERY-001 Curated Icon Ideas

The current root-homepage Gallery preview mixes six project-local static examples with an unsupported community claim and hardcoded likes `120 / 98 / 76 / 142 / 110 / 85`. A point-in-time production comments probe returned HTTP 200 with zero approved English comments on 2026-09-01, while the local `/gallery` route truthfully displayed its empty approved-UGC state. The six existing root samples are 512 × 512 WebP files, but repository history alone does not prove authorship or license; the proposed public wording is therefore `site-curated examples`, not community, original, official, or authorized content.

The confirmed implementation replaces the root preview with an open `Curated Icon Ideas` band: a desktop explanation column plus one slightly larger sample and five compact figures, and a mobile 3 × 2 contact sheet. Fixed copy, factual labels, neutral alt text, a normal `/gallery` link, explicit image dimensions, lazy loading, semantic figures, and visible focus treatment are locked in `docs/product/home-curated-icon-ideas-proposal.md`. Hearts, likes, ratings, popularity, author avatars, comments, and social proof are removed.

Because Oval and Pixel reused the same mandatory-like component and draft locale homepages share the root HomePage data, the implementation also performs a bounded shared truth cleanup on those surfaces without redesigning their first viewport or changing their SEO state. `/gallery`, its approved-comment API, moderation, real like API, and empty state remain unchanged. All affected URLs retain title, description, H1, canonical, schema, robots/indexability, alternates, sitemap membership, player behavior, search intent, and module order.

The user explicitly confirmed the proposal on 2026-09-01, and the bounded local implementation plus responsive browser QA is complete. The user then explicitly replied `确认验收，进行下一步开发` on 2026-09-01, so HOME-GALLERY-001 is accepted and complete; PERF-HOME-001 has opened in read-only research. No commit, push, deployment, or production SEO verification occurred. The global release remains blocked by the preserved sitemap parse error, HTTP canonicalization, mobile LCP, exact Square/Oval license evidence, and existing KW-02 findings.

## PERF-HOME-001 Click-to-load and Stable Reservation

The root Hero keeps its accepted visual composition and shared player. The existing project-CDN cover is now stored byte-identically at `/games/square-face-cover.png`, removing the first-viewport cross-origin dependency while preserving the rendered image. The Game Data record uses the true `970 × 844` intrinsic dimensions, and the player exposes nonvisual `idle / loading / ready` state hooks plus `aria-busy` on the reserved surface.

Ruffle remains a conditional `next/dynamic` adapter rendered only after Play; the service-worker install list does not prefetch Ruffle or SWF. Preview, Loading, and Ruffle mount remain absolute children of the same fixed-aspect-ratio surface. Mobile Lighthouse on the local development server reported zero initial Ruffle/WASM/SWF requests and CLS `0.011`; the same diagnostic improved from score `57` / LCP `14.2 s` with the remote cover to score `75` / LCP `3.5 s` with the local cover. These are local lab numbers, not production proof, and the resulting LCP still exceeds PF-01.

Mobile `390 × 844` and desktop `1440 × 1000` browser checks proved `idle → loading → ready`, stable document geometry, no horizontal overflow, and no console warning/error. Scoped and related checks pass; full type/lint/Next/Cloudflare builds still fail at the restored malformed `app/sitemap.ts`. The user explicitly accepted PERF-HOME-001 on 2026-09-01 with `确认验收，进行下一步开发`; the task is complete and GAME-TPL-001 has opened at its required proposal-confirmation gate. No commit, push, deployment, `seo:check`, or `seo:prod` occurred.

## GAME-TPL-001 Unified Game Detail Template

The confirmed single-column Player-first template is implemented for future eligible `/games/[slug]` records. It composes Breadcrumb, one Game Data-backed H1 and summary, stable Player/Controls/status/device notice, GameMeta, conditional Related, How-to, Description, Features/Tips, native FAQ, factual Source & Rights, More avatar games, and the existing footer. Empty optional modules render nothing; External Tools retain direct-link-only behavior and WebPage-only page schema; UNKNOWN rights remain visibly unknown; `AdSlotShell` stays unmounted.

The route still uses `resolveNewGameSlug`, true 404, and forced noindex metadata. The repository has no eligible non-legacy new-game record, so no public page was added. `/`, Oval, and Pixel remain on their accepted implementations for later migration tasks; all current URL, title, description, H1, canonical, robots/indexability, sitemap membership, search intent, and legacy route behavior remain frozen.

Desktop `1440/1280`, mobile `430/390/360`, playable activation, External boundary, native FAQ, internal links, source/rights, and all four archived concept comparisons passed local browser QA without horizontal overflow. Temporary QA records were removed and their slugs returned HTTP 404/noindex. Dedicated and related checks plus scoped lint pass; the restored malformed `app/sitemap.ts` still blocks full type/lint/Next/Cloudflare builds and therefore blocks `seo:check`. No commit, push, deployment, or `seo:prod` occurred. GAME-TPL-001 is `待验收`; do not begin `MIG-SQUARE-001` before explicit user acceptance.

The user explicitly accepted `GAME-TPL-001` on 2026-09-01 and authorized deployment of the accumulated accepted work before the next task. The task is complete. Release preparation restored the intended 20-URL sitemap source without fabricated `lastmod` values; the separate OP-11 canonical-host behavior remains behind its required proposal-confirmation gate. `MIG-SQUARE-001` must not start until the authorized release is either production-verified or explicitly stopped.

On 2026-09-02, after the user replied `继续任务`, the recommended OP-11 one-hop canonical-host proposal was implemented locally as the only active remediation step. HTTP apex, HTTP www, and HTTPS www now resolve through a fixed-destination `308` guard in source; path/query, proxy authority, POST semantics, canonical pass-through, localhost, and preview pass-through checks succeeded. This is not deployed production evidence. OP-11 is `待验收`; AI-01, the 12 KW-02 must findings, first-Play INP `221 ms`, exact-license UNKNOWN, commit/push/deploy, and `MIG-SQUARE-001` remain unchanged or unopened.

The user explicitly accepted OP-11 on 2026-09-02 and asked to continue to the next release blocker. The local source gate is closed, while the live one-hop redirect matrix remains unverified until an authorized deployment. AI-01 is now the active gate and remains proposal-only: no `app/robots.ts`, indexing, sitemap, metadata, URL, visible content, commit, push, deployment, or `MIG-SQUARE-001` change may occur before the user explicitly chooses the crawler policy.

The user explicitly confirmed the recommended AI-01 split on 2026-09-02. The implementation now generates `/robots.txt` from one 11-crawler policy source: six training/bulk agents are blocked from all paths, five search/user-retrieval agents can access public paths, and the wildcard plus every allowed group blocks `/admin/` and `/api/`. Project decisions, local and post-deploy validators, and rollback evidence were updated. No page UI, URL, metadata, canonical, index state, sitemap membership, schema, content, game behavior, search intent, commit, push, or deployment changed. AI-01 is `待验收`; production remains unverified and `MIG-SQUARE-001` stays unopened.

The user explicitly accepted AI-01 on 2026-09-02 with `AI-01 验收通过，继续下一发布阻断项`. The local source gate is closed; production robots remains unverified until an authorized deployment. A fresh local production `seo:check` still reports the same 12 KW-02 must findings and 17 should reminders, so KW-02 is now the only active pre-deployment remediation gate. Its `/contact` one-page sample remains proposal-only: no visible copy, metadata, URL, layout, interaction, commit, push, deployment, or `MIG-SQUARE-001` change may occur before explicit confirmation.

The user explicitly confirmed the `/contact` KW-02 sample on 2026-09-02. The confirmed visible paragraph was added after the email address, moving the configured main-content phrase from two to three occurrences without changing the page title, H1, URL, canonical, schema, sitemap membership, index state, layout, or interaction. Raw HTML, type, zero-warning lint, canonical and 11 task checks, robots, Next/OpenNext builds, and desktop/390px browser QA passed; full `seo:check` now reports 11 KW-02 must findings and the same 17 should reminders, so its exit remains 1 and the global release remains `不通过`. The sample is `待验收`; all remaining 11 mapped pages, commit, push, deployment, `seo:prod`, and `MIG-SQUARE-001` remain untouched.

The user explicitly accepted the `/contact` sample on 2026-09-02 with `KW-02 单页样例验收通过`. The sample is complete locally and remains undeployed. The next gate is a separately confirmable 11-page batch proposal with one exact visible sentence and insertion boundary per page; no remaining page was edited. The batch proposal also records—but does not silently repair—the production Terms conflict between its `authorized`/generated-output claims and the accepted License Registry `UNKNOWN` evidence. Await `确认 KW-02 剩余 11 页批量方案，进行开发` before any batch content change.

The user explicitly confirmed the remaining-page batch on 2026-09-02 with `确认 KW-02 剩余 11 页批量方案，进行开发`. The 11 confirmed server-rendered sentences are now present at their mapped boundaries across About, Editorial, Gallery, Blog hub, five article pages, Privacy, and Terms. Raw local production HTML proves all 12 mapped pages have one H1, the expected canonical, no `noindex`, exactly three configured main-content phrase occurrences, and exactly one accepted sentence. Local `seo-check` now has `0` mandatory findings and `12` independent should reminders. Type, zero-warning lint, canonical, robots, 11 accepted task checks, the 42-route Next build, Cloudflare/OpenNext build, and representative desktop/390px browser QA passed. The batch is local and `待验收`; no commit, push, deployment, `seo:prod`, PF-01, or `MIG-SQUARE-001` work occurred. The Terms rights conflict remains a separate release blocker.

The user explicitly accepted the remaining batch on 2026-09-02 with `KW-02 剩余 11 页验收通过`. KW-02 is now complete locally and remains undeployed; its 12 should-level reminders and production `seo:prod` verification are not silently closed. PF-01 is the next release-remediation confirmation gate: the recorded mobile production-build trace measured first-Play INP `221 ms`, and `docs/quality/release-performance-remediation-proposal.md` proposes painting the loading response before mounting the dynamic adapter. No PF-01 code may change before `确认 PF-01 激活响应方案`.

The user explicitly confirmed `确认 PF-01 激活响应方案` on 2026-09-02. The bounded shared-player implementation now gives urgent loading a paint opportunity before mounting the dynamic adapter, cancels pending frame callbacks on unmount, and preserves reload and the reserved surface. Three isolated mobile production-build sessions at `127.0.0.1:3100` measured LCP `2234/2023/2028 ms`, first-Play INP `122/43/44 ms`, navigation CLS `0.01`, and Play CLS `0.00`; raw traces confirm painting before the adapter mount, initial runtime requests are absent, and geometry is unchanged. Type, lint, canonical/robots, all 11 regressions, Next/OpenNext, and root desktop/mobile plus shared Oval interaction QA passed; local SEO remains `0` mandatory and `12` should reminders. Evidence: `docs/quality/evidence/pf-01-activation-response/README.md`. PF-01 is `待验收 / 未部署`, not complete. No URL, index, metadata, layout, copy, assets, dependency, commit, push, deployment, `seo:prod`, next blocker, or `MIG-SQUARE-001` change occurred. Global production and license/Terms gates remain open; await `PF-01 验收通过`.

The user explicitly replied `PF-01 验收通过` on 2026-09-02 and asked for the next development step. PF-01 is now `本地已验收 / 生产未验证`; the existing three-session evidence is retained, not remeasured. The only next gate is TERMS-001, a proposal to correct two unverified rights claims on `/terms-of-service`, one corresponding H2, and the actual implementation date. `docs/legal/terms-rights-consistency-proposal.md` contains the exact copy and frozen layout/SEO/interaction boundaries. Terms source, accepted KW-02 copy, Registry, SWFs, and GamePlayer are unchanged; the proposal passed an in-memory bounded JSX preview, not application implementation or browser QA. Await `确认 TERMS-001 权利声明修正方案` before modifying the page. Underlying exact-file rights remain `UNKNOWN`, other public rights-copy candidates require separate review, and global release remains `不通过 / 未部署`. No commit, push, deployment, `seo:prod`, or `MIG-SQUARE-001` work occurred.

The user explicitly confirmed `确认 TERMS-001 权利声明修正方案` on 2026-09-02. Only the two approved Terms paragraphs, one H2 and the content-update date (September 2, 2026) were changed; metadata, URL/index, layout, links, accepted KW-02 text, Registry, SWFs and player remain frozen. The source and offline build checker, six source/two HTML negative fixtures, type, zero-warning lint, canonical, 11 existing regressions, Next and OpenNext passed. However, the background local-preview startup command was rejected before execution with `CreateProcess: blocked by policy`; port 3100 was not listening at the read-only follow-up. Browser is available but Terms HTTP/served robots/full SEO/desktop/390px interaction QA remain `未验证`. No alternate startup or browser transport was used to bypass the rejection. The task is `实施完成 / 验证阻塞 / 未验收`, not complete or ready for acceptance. Evidence: `docs/quality/evidence/terms-001-rights-copy/README.md`. Await a user-started local preview, finish required QA, then request `TERMS-001 验收通过`; do not deploy or open `MIG-SQUARE-001`.

On 2026-09-02 the user requested `请帮我启动并且进行验证`. The same local startup channel now succeeded; `127.0.0.1:3100` serves the unchanged v1.43 production build. Terms, robots and sitemap HTTP responses are byte-identical to the build artifacts; exact-copy/metadata/keyword and 6+2 negative checks pass. A fresh full local SEO run checks 20 pages with 0 mandatory and the same 12 should reminders. Type, zero-warning lint, checker lint, canonical and all 11 task regressions pass again. Browser 1280×900 / 390×844 identity, visible copy, no overlay/overflow, clean console, Contact/browser Back/homepage and Tab/Enter flows pass, with inspected screenshots. No application source changed and Next/OpenNext were not rebuilt in this follow-up. TERMS-001 is now `待验收 / 本地验证通过`, not accepted; await `TERMS-001 验收通过`. The server remains available for acceptance. Exact rights UNKNOWN, other rights-copy candidates, semantic/production/performance gates and the earlier board-file visual restriction remain independent; no commit, push, deployment, `seo:prod` or migration work occurred.

On 2026-09-02 the user explicitly replied `TERMS-001 验收通过`. Board v1.45 records TERMS-001 as `已完成（本地已验收） / 生产未验证 / 未部署`, covering only the confirmed local copy/date changes and existing v1.43/v1.44 QA. The acceptance-only update preserves application hashes and original test dates; it does not rerun type/lint/regressions/Next/OpenNext/HTTP/SEO/browser/mobile/performance checks or change pages, URLs, index state, metadata, layout, links, Registry, SWFs or player. Exact rights remain UNKNOWN; other rights-copy candidates, 12 should reminders and production gates remain open. Wait for the user's next instruction; no next blocker or `MIG-SQUARE-001`, commit, push, deployment, production `seo:prod` or online rollback was started.

The user then requested `现在进行下一步开发` on 2026-09-02. Board v1.46 opens only `ABOUT-001`, a seven-region `/about-us` rights/example-provenance copy proposal. Exact replacements are in `docs/legal/about-rights-consistency-proposal.md`; two description fields are the only metadata exceptions, while URL, Title/H1, index, canonical, schema, CSS/layout, all eight main hrefs, accepted KW-02 text/count and every other source region remain frozen. The source/isolated-SSR preview passes with Header/Footer stubs, not real browser or implementation proof. No page or application code is written; full type/lint/tests/builds/HTTP/SEO/browser/mobile/performance are not rerun. Existing Terms acceptance and prior QA dates remain intact. Await `确认 ABOUT-001 权利与示例来源声明修正方案`; actual license UNKNOWN and production gates stay open, with no commit/push/deployment or MIG-SQUARE-001.

The user explicitly confirmed `确认 ABOUT-001 权利与示例来源声明修正方案` on 2026-09-02. Board v1.47 records the seven confirmed About replacements as locally implemented and `待验收`; only metadata.description and Twitter description change metadata. The JSX apostrophe is entity-escaped without changing visible copy. Remaining source, Title/H1, canonical/index, all eight main hrefs, accepted KW-02 sentence/count, both schemas, Terms, Registry, SWFs and player remain frozen. New source/build/HTTP checks reject 14+6 negative fixtures; Terms 6+2, type/zero-warning lint, canonical/11 regressions, Next/OpenNext, robots and full 20-page SEO (0 must / 12 should) pass. Browser 1280×900/390×844 exact copy, no overflow/overlay, clean console, Terms/Gallery/Back/home links and Tab/Enter pass; the existing narrow desktop feature-card columns remain a non-blocking visual advisory, with CSS unchanged. Evidence: `docs/quality/evidence/about-001-rights-copy/README.md`. The historical proposal evidence and all 22 prior user acceptances are preserved. Await `ABOUT-001 验收通过`; exact licensing remains UNKNOWN, production is unverified, no commit/push/deployment/seo:prod or MIG-SQUARE-001 occurs.

On 2026-09-02 the user explicitly replied `ABOUT-001 验收通过`. Board v1.48 records `已完成（本地已验收） / 生产未验证 / 未部署`, limited to the seven approved local text regions and original v1.47 QA. This acceptance-only turn preserves all 145 source/check/config hashes, original command/browser records and test dates, the 22 previous acceptances and Terms/PF-01 evidence; ABOUT-001 adds the 23rd acceptance. No application, checker, package, build artifact or preview process changes, and no type/lint/tests/Next/OpenNext/HTTP/SEO/browser/mobile/performance reruns occurred. Narrow desktop-card wrapping remains advisory; actual rights UNKNOWN, other wording candidates, 12 should/KW-04 and production gates remain open. Wait for the user's next instruction; no next blocker, MIG-SQUARE-001, commit, push, deployment, seo:prod or online rollback starts from this acceptance.

After ABOUT-001 acceptance, the user requested `进行下一项开发` on 2026-09-02. Board v1.49 opens only EDITORIAL-001, a five-region `/editorial-policy` source/asset-rights wording proposal. The current first section contains a blanket site-created/tool-generated example claim; the proposed copy distinguishes editorial standards from verified provenance and permissions. Three description fields, one H2 and one paragraph are the only proposed changes; Title/H1, canonical/index, layout, two main hrefs, one WebPage schema and the accepted KW-02 sentence/count stay frozen. TSX/isolated SSR with Header/Footer stubs passes at 1 H1/4 H2/3 H3/10 paragraphs and three phrase occurrences; 145 source/check/config hashes and About evidence are unchanged. This is not implementation or real page QA; full code/build/HTTP/SEO/browser/mobile/performance checks were not rerun. Await `确认 EDITORIAL-001 编辑政策来源与权利声明修正方案`. All 23 acceptances, original QA dates, actual rights UNKNOWN, Gallery/locale candidates and production gates remain intact; no commit/push/deploy/seo:prod or MIG-SQUARE-001.

The user explicitly confirmed `确认 EDITORIAL-001 编辑政策来源与权利声明修正方案` on 2026-09-02. Board v1.50 records the five exact text replacements as implemented but `实施完成 / 验证阻塞 / 未验收`. Three descriptions are the only metadata exceptions; all other source, Title/H1, canonical/index, layout, two main links, one WebPage schema and accepted KW-02 sentence/count 3 stay frozen. The new source/build/HTTP checker rejects 14 source and 15 raw HTML negative fixtures. Type/zero-warning lint, canonical/11 regressions, Editorial/About/Terms source/built, Next 42 routes, OpenNext and offline robots/sitemap/source hashes pass in 25 final bounded commands. Original 23 acceptances, seven historical evidence files and 142 unchanged baseline files are preserved. However, after the verified old preview was stopped for rebuilding, restart was rejected before execution by tool policy and 3100 had no listener. Browser is available but raw HTTP, full SEO, desktop 1280×900/mobile 390×844 visual/console/navigation/keyboard QA remain unverified; no alternative startup/browser transport was used. Start the documented local server, complete QA and only then move to pending acceptance. Evidence: `docs/quality/evidence/editorial-001-rights-copy/README.md`. Actual rights UNKNOWN, historical 12 should/KW-04, other wording and production gates remain open; no commit/push/deploy/seo:prod or MIG-SQUARE-001.

On 2026-09-02 the user asked to start and verify EDITORIAL-001. The same local startup channel was retried but again rejected before execution by policy; port 3100 had no listener and no startup logs existed. The 146 source/check/config hashes and existing v1.50 build artifacts are unchanged; no application edits, type/lint/regression reruns or rebuilds occurred. HTTP/full SEO/real desktop/mobile/interaction checks remain unverified. Board v1.51 therefore keeps EDITORIAL-001 validation-blocked, not awaiting acceptance; original 23 acceptances and QA history are retained, with no alternate startup/browser bypass, deployment or migration.

On 2026-09-02 the user reported `已启动`. Board v1.52 completes EDITORIAL-001 runtime QA on the unchanged v1.50 production build: 146 source/check/config hashes match, five raw HTTP routes are byte-identical to artifacts, 18 code checks and five target HTTP/SEO checks pass, and full local SEO is 20 pages / 0 must / 12 should. Browser 1280×900/390×844 exact copy/metadata/schema, nonblank/no overlay/no overflow, clean console, Contact/Back/home and Tab/Enter pass with six inspected screenshots. The initial robots duplicate-base failure is retained and its single-base 3100 rerun passes without code changes. Existing narrow desktop cards remain a non-blocking visual advisory. No app edits or Next/OpenNext rebuild; original 23 acceptances and historical evidence/dates remain intact. EDITORIAL-001 is `待验收 / 未部署`; wait for explicit acceptance. Actual rights UNKNOWN, other copy/KW-04/production gates remain open; no commit/push/deploy/seo:prod/MIG-SQUARE-001.

On 2026-09-02 the user explicitly replied `验收通过，请进行下一步开发` after the v1.52 pending-acceptance handoff. Board v1.53 records EDITORIAL-001 as locally accepted, adding the 24th source acceptance and preserving the original 23, all v1.50/v1.51/v1.52 QA/failure/build dates, unchanged checks.json and 146 source/check/config hashes. No application checks, runtime-liveness verification or builds were rerun. The next task is GALLERY-001 proposal-only: three descriptions, CollectionPage.description, eyebrow and lead distinguish eight CSS style illustrations from approved community submissions when available, without asserting authorship or permissions. Isolated TSX/SSR preserves 1 H1/4 H2/14 H3/19 paragraphs, 4 main links, 8 samples, CommentSection props and KW-02 sentence/count 3; counts exclude the shared community UI. Title/H1, URL/index/canonical/sitemap, remaining schema, layout, samples, API/moderation/rating/like/sort and all other source remain frozen. Await `确认 GALLERY-001 示例来源与权利声明修正方案` before editing app/gallery/page.tsx. Source and the existing build still contain old wording; this is not fresh page/browser/production QA or a search-intent change. Actual rights UNKNOWN, locale wording, 12 should/KW-04 and production gates remain open; no commit/push/deploy/seo:prod/MIG-SQUARE-001.

On 2026-09-02 the user explicitly confirmed `确认 GALLERY-001 示例来源与权利声明修正方案`. Board v1.54 implements exactly six Gallery text regions and leaves the rest of the page, real community functions, eight CSS illustrations, Title/H1, URL/index/canonical/sitemap and accepted KW-02 unchanged. All 20 code checks, Next 42-route and OpenNext builds, four built-page checks and six HTTP/robots/SEO checks pass; Gallery rejects 18 source / 20 HTML negative fixtures and passes four in-memory shared-component SSR states. Fresh local SEO is 20 pages / 0 must / 12 existing should; six raw routes match new artifacts. Browser 1280×900/390×844 exact copy/schema, 19 page paragraphs plus one initial community paragraph, no overflow/overlay, clean console, all four main links/Back/sorts and Tab/Enter pass with 44 assertions and eight inspected screenshots. Real local latest/liked GETs return 200 with zero comments; populated/error/already-liked states remain in-memory-only, with no submission or like writes. Of 146 prior source/check/config files, only Gallery/package/scripts README change; the other 143 and nine historical evidence files are byte-identical, and one new checker brings the current set to 147. All 24 acceptances are preserved; GALLERY-001 is `待验收 / 未部署`, awaiting `GALLERY-001 验收通过`. Existing Gallery heading/subtitle spacing and About/Editorial narrow-card advisories, actual rights UNKNOWN, locale wording, 12 should/KW-04, board-file visual and all production gates remain open. No next task, migration, commit/push/deploy/seo:prod; rollback is limited to this task's six text regions/checker increments. Evidence: `docs/quality/evidence/gallery-001-rights-copy/README.md` and `checks.json`.

On 2026-09-02 the user explicitly replied `GALLERY-001 验收通过`. Board v1.55 records `已完成（本地已验收） / 生产未验证 / 未部署`, adding the 25th source acceptance and preserving all prior 24. The confirmed six-region implementation and v1.54 32-command code/build/HTTP-SEO, 18/20 negative-fixture, four in-memory community-state, 20-page SEO 0 must / 12 should and desktop/mobile 44-assertion/eight-screenshot records retain their original dates. All 147 source/check/config hashes and current Next/OpenNext artifacts are unchanged; original checks.json stays byte-identical at SHA-256 `a41646b12dffdc099bc9c1a84cf10667f6efc1753b1db5be2c437e3695bd86af`, and its pending status denotes the earlier QA snapshot only. No application edits, type/lint/test/build/HTTP/SEO/browser/mobile/performance rerun, preview restart or runtime-liveness claim occurs. Exact rights UNKNOWN, original spacing/narrow-card advisories, locale wording, KW-04/12 should, board-file visual and all production gates remain open. Wait for the user's next instruction; no next task, MIG-SQUARE-001, commit/push/deploy/seo:prod or online rollback. Current acceptance evidence: `docs/quality/evidence/gallery-001-rights-copy/acceptance-checks.json`.

On 2026-09-02 the user requested `请进行下一步开发` after GALLERY-001 acceptance. Board v1.56 opens LOCALE-001 at the explicit confirmation gate: four exact source-text regions in two files, with one visible Gallery sidebar description shared by the seven existing noindex drafts and three dormant data strings. Current HomePage does not render englishFeatures or relatedCards; existing root/draft HTML snapshots contain none of those three legacy sentences, so this is not a claim of three live visible defects. In-memory TSX/SSR using real HomePage/GameSidebar with six declared component stubs leaves root markup, all metadata, three schemas and all other draft markup unchanged; each draft changes only one sidebar sentence, preserving Arabic rtl. Current build snapshots confirm draft noindex/self-canonical/no hreflang/sitemap exclusion. All 147 source/check/config files, 13 historical records, original artifacts/screenshots and 25 acceptances are preserved. No application write, full type/lint/regression/build/HTTP/SEO/browser/mobile/performance rerun or preview-liveness claim. Await `确认 LOCALE-001 草稿语言页与遗留文案一致性修正方案` before the four strings and a narrowly verified Gallery expectedLocalesHash update; the accepted Gallery page and original evidence remain frozen. Actual rights UNKNOWN, 12 should/KW-04, visual and production gates remain open; no commit/push/deploy/seo:prod/MIG-SQUARE-001. Evidence: `docs/legal/locale-rights-consistency-proposal.md` and `docs/quality/evidence/locale-001-rights-copy/proposal-checks.json`.

2026-09-02 v1.57：已收到 `确认 LOCALE-001 草稿语言页与遗留文案一致性修正方案`，只实施两文件四处精确文字、一个 LOCALE 检查器、对应 npm/README 入口及 Gallery 检查器唯一 expectedLocalesHash 更新。37 项最终命令通过（22 代码/回归、2 构建、5 built、8 HTTP/SEO）；新 build `ynVDY6J1ddC0YHaNiUTtN` 生成 42 路由，14 路 HTTP 与产物字节一致，完整本地 SEO 20 页、0 must / 12 should，sitemap 20 唯一 URL。首页主体/metadata/schema 与布局、播放器保持；七个草稿仍 noindex/self-canonical/无 hreflang/不进 sitemap，未新增翻译。142 项原文件、14 份历史证据与 25 条验收保持。

Browser 在 1280×900 / 390×844 实测 `/es`、`/ar` 与首页：Gallery 点击/返回/Tab/Enter、首屏播放器 idle→ready（手机另观察到 loading）、无横向溢出及 7 组控制台检查通过；14 张前后/焦点/播放截图留档。但手机 Gallery 说明末尾 available. 被既有两行样式裁切：可见高 35px、内容高 53px，视觉不通过。先前通用 aside 误选隐藏设备提示，已通过精确 More Avatar Games 选择器纠正；真实侧栏在手机首屏下方显示。SSR/HTTP 通过不能替代换行检查；原测量、截图失败/CDP 超时与重试证据全部保留。

看板只设 `待验收` 并明确此手机阻断；未收到成果验收。候选 `Style examples; approved posts when available.` 仅是缩短同一句的修订建议，尚未确认、写入应用或验证换行；等待 `确认 LOCALE-001 手机文案缩短修订`，保留 CSS、其余三句及所有冻结边界，确认后重新构建和实测。实际许可 UNKNOWN、KW-04/12 should、旧间距/窄卡、生产版本/一跳/robots/SEO/CWV 门禁与看板文件视觉限制不关闭。未提交、推送、部署、执行 seo:prod 或启动下一项/MIG-SQUARE-001。

本轮完整记录：`docs/quality/evidence/locale-001-rights-copy/README.md`、`checks.json`；v1.56 proposal-checks.json 与已验收页原始证据不改写。回滚只逆向本轮四句、限定检查/npm 入口和治理增量，不覆盖其它脏工作区成果。

### LOCALE-001 · v1.58 手机单句修订（历史，当时待验收）

2026-09-03 v1.58：用户“确认”批准手机单句缩短，并要求“继续实施”。共享 Gallery 说明现为 `Style examples; approved posts when available.`；只改该字段、精确检查期望和检查说明，不改 CSS/布局、其余三句、首页、播放器或已验收页面。7 个草稿继续 noindex/follow、自引用 canonical、无 hreflang、不进入 sitemap。

37 项本地命令通过（22 代码/回归、2 构建、5 built、8 HTTP/SEO）；19 源码 / 116 HTML / 4 sitemap 反例均被拒绝。最终 build `Y8uf2WKGr_E9Pn2mjsax-`，42 路由，14 路 HTTP/产物一致；SEO 20 页、0 must / 12 should。Browser `/es`、`/ar` 的 1280×900、390×844、360×800 全文可见；手机文本高由 53px 降至 35px，与原可见高 35px 一致。14 条交互、7 组空错误/警告日志、9 张新截图；首页桌面 idle→ready 回归通过，不是新 CWV 测量。

本项仅 `待验收`，等待 `LOCALE-001 验收通过`。145 项原源码/配置、15 份历史证据、25 条验收保持，v1.57 裁切失败未改写。原始权限 UNKNOWN、KW-04/12 should、旧间距/窄卡、生产版本/一跳/robots/SEO/CWV 门禁和看板文件视觉限制保留。未提交、推送、部署或开始下一项。证据：`docs/quality/evidence/locale-001-rights-copy/mobile-revision-checks.json`。

### LOCALE-001 · v1.59 本地验收通过（验收记录保持）

2026-09-03 用户明确回复 `LOCALE-001 验收通过`，涵盖原四处文案与 v1.58 手机短句修订。看板 v1.59 登记为本地已验收，原 25 条验收不变，现共 26 条；不启动下一任务。

本轮仅验收治理：148 项源码/检查/配置、16 份历史证据、27 张截图和 15 个构建产物保持；未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动或性能检查，未核实预览存活。v1.57 失败及 v1.58 通过（含当时待验收字段）保留原记录。实际许可 UNKNOWN、KW-04/12 should、既有视觉提醒和生产版本/一跳/robots/SEO/CWV 门禁不关闭；未提交、推送、部署、seo:prod 或迁移。

验收与只读核对证据：`docs/quality/evidence/locale-001-rights-copy/acceptance-checks.json`。等待用户下一步指示；如需撤销此次治理更新，仅逆向 v1.59 文档/看板增量，不撤销应用实现或覆盖其它工作区改动。

### 历史 v1.60 · LICENSE-GATE 材料与开发顺序当时待决定

2026-09-03 用户要求在 LOCALE-001 验收后继续下一步。原 v1.59 验收及全部 26 条 SOURCE_ACCEPTANCE 保持，不重复新增。路线图下一项为 MIG-SQUARE-001，但此前“先部署累计成果，再继续迁移”的顺序尚未生产验收或被明确暂停；本轮只核对下一步的前置条件，未开启迁移方案或改应用。

两份本地 SWF 的 SHA-256 均与 Registry 相符；各自原始来源、权利人、许可文件和用途权限仍 UNKNOWN。仓库 261 个文件及指定项目知识库目录 2 个文件的限定文件名检索只命中现有 Registry，未发现新增候选许可材料；这不证明其它位置不存在授权。未反编译、提取、修改或分发 SWF。

质量监管 skill 保持 LICENSE-GATE 为 `已阻塞`、发布为 `不通过 / 未部署`。需要原始许可材料，或由用户明确暂停此次发布以先准备 MIG-SQUARE-001 本地方案；后者只改变工作顺序，不解除许可、KW-04/12 should、既有视觉或生产门禁。源码/检查/配置 148 项、历史证据 17 份、截图 27 张及 15 个产物保持。未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动/性能，未核实预览存活，未提交、推送、部署或迁移。

材料清单：`docs/archive/license-gate-cancelled-2026-09-03/swf-license-evidence-request.md`；本轮只读证据：`docs/archive/license-gate-cancelled-2026-09-03/checks.json`。仅有治理文档/看板增量可回滚，无线上回滚事项。

### 历史 v1.61 · 当时先发布顺序已确认，等待许可材料

2026-09-03 用户明确要求 `先发布，然后再准备MIG-SQUARE-001 的本地开发方案`。已记录发布优先指令；先发布、生产验证后才准备本地迁移方案，顺序不再待决定，不再主动建议跳过本次发布。该指令不是两份 SWF 的原始授权材料或许可门禁豁免。

复核后 Square/Oval 的 sourceUrl、rightsHolder、license 和 writtenPermissionPath 仍 UNKNOWN；26 条验收、148 项源码/检查/配置、18 份历史证据及既有截图/构建产物保持。质量监管 skill 将当前 LICENSE-GATE 保持 `已阻塞（等待许可材料）`，发布仍 `不通过 / 未部署`。本轮只做前置条件和记录一致性检查，未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动/性能，未执行发布流水线、提交、推送或部署；MIG-SQUARE-001 方案与实现均未开始。

请提供两份文件各自的原始来源与书面授权路径或链接，核验范围后再进行完整发布门禁。材料清单见 `docs/archive/license-gate-cancelled-2026-09-03/swf-license-evidence-request.md`；本轮证据见 `docs/archive/license-gate-cancelled-2026-09-03/release-order-confirmation.json`。许可/SEO/生产门禁不关闭；仅治理增量可回滚，无线上回滚事项。

### 历史 v1.62 · 暂缓许可核验与发布，开启 Square 本地绑定方案

用户明确要求 `暂时跳过该项任务吧，进行后续开发`，因此此前先发布后方案的顺序暂停。LICENSE-GATE 为 `已延期 / P0 未关闭`，本次发布 `不通过 / 暂缓 / 未部署`；不再把这次本地方案卡在补充许可材料上，也不改变 UNKNOWN 或授予发布权限。

当前只开启 MIG-SQUARE-001，状态 `设计中 / 方案待确认`。现码的 metadata/H1/推荐已绑定，剩余为 6 Features、6 FAQ、5 Tips 重复数据、2 处 How-to 差异、19 项播放器入参中的 7 项默认依赖，以及首页专属呈现文字。方案保留现有 FlashGenerator 兼容路径并统一全部页面级输入；不直接调用会拒绝 UNKNOWN 的通用模型，不放宽其权限校验。详见 `docs/product/square-home-data-binding-proposal.md`。

本轮仅代码核对及方案/治理更新；148 项源码、19 份历史证据、26 条验收保持，未改应用、重跑完整检查或部署。首页及七草稿的布局/文案/SEO/交互冻结；实施后须完成相关测试、构建、HTTP/SEO 与桌面/手机检查，再置待验收。原 QA、许可/生产/视觉/KW-04/12 should 状态不改写。证据：`docs/quality/evidence/mig-square-001/proposal-checks.json`。等待 `确认 MIG-SQUARE-001 方案，进行开发`；不启动 MIG-OVAL-001。

### 历史 v1.63 · Square 本地数据绑定已实施，当时待验收

已收到 `确认 MIG-SQUARE-001 方案，进行开发`。本轮只完成该确认范围，任务为 `待验收`，尚未收到 `MIG-SQUARE-001 验收通过`；不启动 MIG-OVAL-001。

- 19 项页面级播放器入参、6 Features、6 FAQ、5 Tips（仍显示前 4 条）、3 How-to 和首页专属文案统一来自 Square Record；客户端仅接收必要字段。两句 How-to 对齐此前已验收页面，不改可见内容。
- 继续使用 `FlashGenerator → GamePlayer` 既有兼容入口；通用模型仍拒绝 UNKNOWN，不改 SWF、权限/索引/路由/样式/操作机制。并未完成受许可门约束的完整通用模型迁移。
- 37 项最终命令均 exit 0：type、lint、范围及回归测试、Next 与 OpenNext 构建通过（42 静态页）；8 语言真实 SSR 和旧 SEO/正文/schema 契约不变；14 个本地 HTTP 路径一致。SEO 20 页 / 0 must / 12 should；KW-04 仍未验证。
- `/`、`/es`、`/ar` × 1280/390/360 共 9 组布局/文字/元数据无变化且无横向溢出；8/9 截图字节相同，es 桌面不同字节但已复核无可见差异。点击/Enter/Space 播放、重载、FAQ、反馈与 Gallery 导航通过；资源清单显示激活后 Ruffle/WASM/SWF，容器三个状态尺寸一致，不据此声称 CWV 或加载时长。
- 保留 26 条验收、20 份历史 JSON 证据、27 张旧截图与既有失败记录；新增 25 张本轮截图。看板文件视觉仍受既有访问限制，未绕行；只核验 JS/状态/静动态一致性。

`LICENSE-GATE` 仍 `已延期 / P0 未关闭`，许可 UNKNOWN；发布 `不通过 / 用户暂缓 / 未部署`。未提交、推送或执行部署流水线，未重测生产一跳/robots/SEO/CWV；真实全屏、所有 SWF 内部控件、其他引擎及旧视觉建议仍未关闭。

当前本地预览 `http://127.0.0.1:3100/`，构建 ID `XnkRSno-fdK5b9heMuS6L`。范围、命令原始输出、等价性说明、截图和回滚见 `docs/quality/evidence/mig-square-001/README.md` 与 `docs/quality/evidence/mig-square-001/checks.json`；原 `proposal-checks.json` 保留原样。

### 历史 v1.64 · Square 已验收；Oval 本地阶段方案待确认

2026-09-03 用户明确回复 `MIG-SQUARE-001 验收通过`，并要求现在进行下一步开发。看板新增第 27 条本地源验收；原 26 条、v1.63 原始 checks.json、检查/构建/浏览器日期与全部失败记录保持。验收仅覆盖已确认的 Square 本地数据绑定，不授予许可或发布通过。

只读复核：150 项源码/检查/配置、21 份既有 JSON、52 张截图、15 个既有构建产物不变，当前文件 build ID 仍为 `XnkRSno-fdK5b9heMuS6L`。本轮没有重新执行完整 type/lint/回归/Next/OpenNext/HTTP/SEO/Browser/移动/CWV，也未核实本地预览存活。旧 SEO 20 页 / 0 must / 12 should 保留原 v1.63 日期，不冒充新测试。

下一项原目标为 MIG-OVAL-001 统一模板迁移。本轮仅提出**保留原页面的本地数据绑定阶段**：3 How-to、6 Features、5 Tips、5 FAQ 完全重复，19 输入有 5 个默认依赖；拟绑定 Record 的正文/播放器/已有游戏链接。另发现封面真实 974×775 与记录 972×774 不符，拟只修正 COVER/派生 img 尺寸，保留播放器比例 972 / 774、最大宽度 972px 和页面结构，并在实施后验证。

该阶段与原完整模板目标不同，必须用户明确确认；`GameDetailTemplate` 与通用 model 的 policy/id/type 校验不放宽，UNKNOWN 仍拒绝。完整模板迁移 `未实施`，不通过新的豁免或伪造允许列表推进。方案：docs/product/oval-local-data-binding-proposal.md；只读证据：docs/quality/evidence/mig-oval-001/proposal-checks.json。等待 `确认 MIG-OVAL-001 本地数据绑定方案，进行开发`；当前 `设计中 / 方案待确认`，没有修改 Oval 应用或启动 Pixel。

质量监管保持 `LICENSE-GATE 已延期 / P0 未关闭`，累计发布 `不通过 / 用户暂缓 / 未部署`。真实权利、KW-04/12 should、既有视觉建议、生产版本/一跳/robots/SEO/CWV 与看板文件视觉限制保留，不绕行。未提交、推送或部署。当前 Square 验收证据：docs/quality/evidence/mig-square-001/acceptance-checks.json。仅本轮治理/方案增量可回滚，无应用或线上回滚事项。

### 历史 v1.65 · Oval 本地数据绑定已实施，待验收

已收到 `确认 MIG-OVAL-001 本地数据绑定方案，进行开发`。本轮只实施保留原页面的本地阶段：19 项播放器输入、3 How-to / 6 Features / 5 Tips / 5 FAQ、既有呈现文字和相关游戏链接来自 Oval Record；保留 `FlashGenerator → GamePlayer` 兼容路径。原 URL、Title/H1、canonical/index、三份 schema、正文和样式不变，仅 COVER 与派生 img 的宽高从 972×774 修正为 PNG 的真实 974×775；图片文件、容器 972 / 774 比例和 972px 上限未改。

- 39 项最终命令均 exit 0（22 代码、2 构建、15 built/HTTP）：type/lint、现有回归、Next 与 OpenNext 构建通过，42 个静态路由；16 路 HTTP 与当前产物一致，4 路 index/404 边界及 11 项 robots 决策通过。SEO 20 页 / 0 must / 12 既有 should；KW-04 未验证。
- 新检查覆盖 19 项端到端转发、75 文字绑定、2 图片/3 href 绑定、250 非法记录、26 关系排除及 14 HTML 反例。Square 原 8 语言真实 SSR/56 绑定/38 转发/150 反例保留；Locale 仅精确归一新增 legacyPage/两个尺寸并新增 7 防绕过反例，旧快照未刷新。3 次初始失败和修正记录保留。
- Oval 1280×900 / 390×844 / 360×800、Square 1280×900 / 390×844、es/ar 390×844 共 7 组前后可见内容与几何一致；6/7 截图字节相同，桌面一组经目视复核未见布局/文字变化，差异未归因。24 条交互观察覆盖点击/Enter/Space、loading→ready、重载、FAQ/排错、Help/Gallery/Pixel/Back 和 Square 双向链接；20 批控制台 error/warn 为空，21 张本轮截图。
- **视觉有条件通过**：既有 Oval 窄屏首屏入口偏低（360×800 的播放器起点 805.828125px；390×844 为 816.9375px），启动控件需滚动。改前改后相同，本次冻结布局未修复，不声称首屏达标。资源清单和三状态几何不是 CWV/时长测量。
- 143 项其余旧源码、23 份历史 JSON、52 张旧截图和原 27 条源验收未变；本轮 7 个既有源码/检查文件改动，新增 2 个，当前检查清单 152 项。原方案、Square 验收及其旧 QA 保留日期。

仅设 `待验收`，等待 **`MIG-OVAL-001 本地数据绑定验收通过`**；`templateMigrationCompleted=false`。看板的本地阶段验收不能将原“完整统一模板迁移”标为已完成，也不自动启动 Pixel。当前生产预览构建 `U_kmLWP9KIdfcJUsHvBgL`，地址 `http://127.0.0.1:3100/oval-face-icon-generator`。

`LICENSE-GATE` 仍暂缓 / P0 未关闭、真实权利 UNKNOWN；发布 `不通过 / 用户暂缓 / 未部署`。未提交、推送、部署或运行 seo:prod；生产版本/一跳/robots/CWV/SEO、真实全屏/全部 SWF 内部控件、其他引擎、KW-04、旧视觉提醒及看板文件视觉仍未验证。只逆向本轮精确补丁回滚，保留用户其他未提交改动。证据：`docs/quality/evidence/mig-oval-001/README.md` 与 `docs/quality/evidence/mig-oval-001/checks.json`。

### 历史 v1.68 · Pixel 本地已验收；累计发布等待许可材料

2026-09-03 用户明确回复“MIG-PIXEL-001 验收通过”，并要求“部署之前所有内容后进行下一步开发”。登记第 29 条本地源验收，scope=EXTERNAL_TOOL_CONSISTENCY；原 28 条及 v1.67 的原始实现、检查/构建/浏览器日期和失败记录保持。验收不代表原站功能、真实许可或生产验收通过。

本次指令重新开启累计发布，取代 v1.62 的暂缓顺序：先关闭 P0、完整发布检查、部署和生产验证，再准备 CONTENT-QA-001。不是仍在等待是否部署的选择，也不能先开始下一项。完整 Oval 统一模板迁移仍未完成/延期，不因 Pixel 验收关闭。

本轮只读复核通过：154 项源码/检查/配置与 v1.67 一致；24 份既有 JSON、18 个当前构建产物和既有截图保持，build ID 仍 h1IC4O9PXVmRzgZw2n74n。Square/Oval 文件哈希匹配 Registry，但原始来源、权利人、许可证/书面授权及用途范围仍 UNKNOWN。限定文件名检索覆盖仓库 271 文件和指定知识库项目目录 2 文件，仅命中现有 Registry 与材料清单，未发现新增候选许可材料；未检查邮箱或其它目录，不推断其不存在。

质量监管 skill 将 LICENSE-GATE 恢复为已阻塞（等待许可材料），累计发布为不通过 / 未部署。请提供两份 SWF 分别对应的原始来源及许可证或书面授权路径/链接，能够证明本站托管、公开运行和广告/商业等实际用途范围；核验后才继续完整发布门禁。

本轮未改应用、Registry、SWF 或部署配置；没有重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动/CWV，也未核实预览存活。原 v1.67 42 项最终命令、SEO 20 页 / 0 must / 12 should、14 组响应式与 12 条交互保留原日期，不冒充本轮或线上通过。KW-04、旧视觉提醒、看板文件视觉限制和生产版本/一跳/robots/SEO/广告/CMP/CWV 门禁保持。

未提交、推送、部署、运行 seo:prod 或开始 CONTENT-QA-001。当前证据：docs/quality/evidence/mig-pixel-001/acceptance-checks.json；材料清单：docs/archive/license-gate-cancelled-2026-09-03/swf-license-evidence-request.md。仅本轮治理增量可回滚，保留已验收应用、历史证据及其它工作区改动；没有线上回滚事项。

### 历史 v1.67 · Pixel External Tool 一致性已实施，当时待验收

2026-09-03 已收到明确确认“确认 MIG-PIXEL-001 External Tool 一致性方案，进行开发”。只实施该方案：Pixel 的 3/6/5/6 数组读取 Record，服务端核对 Registry 后复用原 EXTERNAL_LINK PlayerModel；合并 Hero 重复入口，统一 External tool、来源/条款与 FAQ，移除嵌套 WebApplication。Oval 及七草稿只为 Pixel 侧栏加类型标签，其余链接/图片/文案/顺序、URL/metadata/index、CSS 与播放器冻结。

- 通过：23 项最终代码检查（含 type、零警告 lint、检查器 lint、20 项任务回归），Next 42 路由与 OpenNext，7 项 built、10 项 HTTP/robots/SEO/产物比对，共 42 项最终命令 exit 0。Pixel 41 个内容/链接绑定、198 个反例与 7 个非目标侧栏排除通过；旧 golden 和历史反例不刷新或跳过。
- 通过：最终 build h1IC4O9PXVmRzgZw2n74n；16 路 HTTP 与当前产物逐字节一致，4 个索引/404 边界保持，11 crawler 决策通过，sitemap 20 个唯一 URL / 0 lastmod。全量本地 SEO 20 页、0 must / 12 既有 should。
- 通过（本次可见范围）：Pixel/Oval/es/ar 的 1280×900、390×844、360×800，加首页桌面/390，共 14 组；Pixel 首个出站 CTA 全部可见，无横向溢出。6 组窄屏侧栏键盘聚焦、12 条原站新标签/条款/FAQ/Report/锚点/站内往返通过，raw 与 hydrated schema 一致。保存 45 张前后及交互/诊断截图；首次缩放截图和未落定滚动截图不冒充最终证据，稳定/聚焦重拍已审阅。
- 保留：144 项其它源码、23 份旧 JSON、73 张旧截图、28 条源验收及原始 QA 日期；Registry/SWF/CSS 不改。已核实本地 Next 预览 PID 41332，127.0.0.1:3100。旧 React fetchPriority 与 OpenNext Windows 提醒仍记录。

本项只设待验收，等待“MIG-PIXEL-001 验收通过”。质量监管 skill 保留用户成果验收、旧缓存时间边界与 P0；React 规则落实服务端解析和最小 PlayerModel；浏览器 skill 以真实渲染/键盘/导航补充源码检查。看板 JS/离线 VM、静态/动态焦点、重置/导出与过期验收保护通过；真实看板视觉仍未验证且不绕行既有访问限制。

有条件通过仅指既有整站视觉提醒：Oval 窄屏首屏入口偏低、About/Editorial 窄卡、Gallery 间距未在本项修复。本次 Pixel 和新标签可见范围通过；不能据此说完整模板迁移或整站发布通过。外站实际生成/保存/手机、KW-04、CWV、真机/其它引擎、生产版本/一跳/robots/SEO/广告/CMP 仍未验证。现有广告/统计脚本未改，Pixel 无原站生成器 iframe/Ruffle/WASM/SWF 请求，不等于零第三方请求。

LICENSE-GATE/P0 与累计发布继续不通过 / 用户暂缓 / 未部署。未提交、推送、部署、seo:prod 或开始 CONTENT-QA-001。证据：docs/quality/evidence/mig-pixel-001/README.md、checks.json；回滚仅逆向本轮限定补丁并核对新增文件哈希，不覆盖用户其它改动，无线上回滚。

### 历史 v1.66 · Oval 本地阶段已验收；Pixel 一致性方案待确认

2026-09-03 用户明确回复“确认验收，现在进行下一步开发”。新增第 28 条源验收，scope=LOCAL_DATA_BINDING；原 27 条及 v1.65 原始 checks.json、失败记录、构建和浏览器日期不改写。Oval 完整统一模板迁移仍未完成，原任务保留已延期；本地验收不关闭既有窄屏入口偏低、真实权利或发布门禁。

下一项 MIG-PIXEL-001 仅进入设计中 / 方案待确认。现码已是 External Tool 且无 iframe，但原页面有 4 处 Embedded 旧文案、5 个原站链接及嵌套 WebApplication；旧侧栏 Pixel 缺少明确类型标签。拟统一 Open Original Page、来源条款、FAQ/schema 与 3/6/5/6 数据数组；保留原 URL/Title/H1/description/canonical/index、布局和 DIRECT_LINK_ONLY。跨页仅拟为 Oval/七草稿的 Pixel 侧栏加 External 标签，不改其玩家、元数据、主文案或 CSS；英文首页不变。

方案：docs/product/pixel-external-tool-consistency-proposal.md；等待“确认 MIG-PIXEL-001 External Tool 一致性方案，进行开发”后才能改应用。此次原站文本/条款和 HEAD 只读复核不代表外站游戏/手机功能或商业许可通过，Registry 历史日期不修改。

本轮只做验收/方案治理与只读核对：152 项源码/检查/配置、当前 docs/quality/evidence 目录 21 份旧 JSON、73 张截图、18 个既有构建产物保持；该 JSON 数是本轮目录口径，不改写旧证据的历史计数。build ID 仍 U_kmLWP9KIdfcJUsHvBgL。未重跑 type/lint/完整回归/Next/OpenNext/本地 HTTP/SEO/Browser/移动/CWV，未核实预览存活。v1.65 的 39 项命令及 SEO 20 页 / 0 must / 12 should 仅保留原日期。

LICENSE-GATE 与累计发布继续暂缓 / P0 未关闭，Square/Oval 权利 UNKNOWN；发布不通过 / 未部署。KW-04/12 should、原视觉提醒、看板文件视觉限制与所有生产验证仍开放，不绕行。未提交、推送、部署、seo:prod 或开始 CONTENT-QA-001。证据：docs/quality/evidence/mig-oval-001/acceptance-checks.json；docs/quality/evidence/mig-pixel-001/proposal-checks.json。回滚只逆向本轮治理/方案增量，不撤销已验收应用成果，无线上回滚。

## Homepage Modules

- Navigation
- Hero section with classic Flash avatar maker positioning, square face example collage, and generator-focused CTAs
- Trust badges: Original Flash Style, No Flash Plugin, 100% Free, No Signup, Runs in Browser
- Game player section with click-to-load self-hosted Ruffle/SWF player
- Game control bar with Fullscreen, Reload Game, and Report Issue
- Desktop/mobile experience notice
- Anchor compatibility for `#maker`, `#what-is`, `#features`, `#how-to-use`, and `#faq`
- How to save your square face icon
- Truth-labeled Curated Icon Ideas preview using static site-curated examples when approved community examples are unavailable
- Profile use cases for Discord PFP, GitHub avatar, Notion icon, favicon, gaming, and social media
- What is Square Face Generator
- How to play
- Game features
- Tips for best experience
- Troubleshooting
- Related avatar games and tools
- FAQ
- Grouped footer links

## Admin and API Routes

| Route | Purpose | Indexable |
|---|---|---|
| `/admin/comments` | Moderate pending, approved, rejected, and deleted comments | No |
| `/api/comments` | Public comments and new submissions | No |
| `/api/comments/*/like` | Lightweight public like actions for approved comments | No |
| `/api/admin/comments` | Admin comment listing | No |
| `/api/comment-images/*` | Serves approved or stored comment image files | No |

## Temporary Noindex Controls

- Locale pages other than `/` are draft pages until native-language review is complete. They should remain noindex, hidden from sitemap, and excluded from hreflang.
- `/cute-square-avatar-generator` and `/pixel-square-face-maker` are useful support resources, but they should remain noindex until they contain stronger standalone product value.

## Internal Links

| Source Page | Target Page | Anchor |
|---|---|---|
| Home | `/privacy-policy` | Privacy Policy |
| Home | `/terms-of-service` | Terms of Service |
| Home | `/free-avatar-maker` | Free Avatar Maker |
| Home | `/oval-face-icon-generator` | Oval Face Icon Generator |
| Home | `/pixel-art-avatar-icon-generator` | Pixel Art Avatar Icon Generator |
| Home | `/square-avatar-generator` | Square Avatar Generator |
| Home | `/gallery` | Gallery |
| Home | `/about-us` | About Us |
| Home | `/square-face-icon-generator` | Icon Guide |
| Home | `/cute-square-avatar-generator` | Cute Square Avatars |
| Home | `/pixel-square-face-maker` | Pixel Square Face Maker |
| Home | `/blog` | Blog |
| Blog | `/blog/how-to-make-a-cute-discord-profile-icon` | How to Make a Cute Discord Profile Icon |
| Blog | `/blog/discord-avatar-size-guide` | Discord Avatar Size Guide |
| Blog | `/blog/tiktok-profile-icon-ideas` | TikTok Profile Icon Ideas |
| Blog | `/blog/square-avatar-vs-round-avatar` | Square Avatar vs Round Avatar |
| Blog | `/blog/cute-profile-picture-ideas` | Cute Profile Picture Ideas |
| Blog | `/blog/best-discord-avatar-style` | Best Discord Avatar Style |
| Blog | `/blog/avatar-maker-without-signup` | Avatar Maker Without Signup |
| Blog guide | `/` | Square Face Generator |
| Blog guide | `/square-face-icon-generator` | Square Face Icon Generator Guide |
| About Us | `/` | Square Face Generator |
| Free Avatar Maker | `/` | Square Face Generator |
| Oval Face Icon Generator | `/` | Square Face Generator |
| Oval Face Icon Generator | `/square-face-icon-generator` | Square Face Icon Guide |
| Pixel Art Avatar Icon Generator | `https://www.icongenerators.net/pixelavatar.html` | Original Pixel Art Avatar Icon Generator |
| Pixel Art Avatar Icon Generator | `/` | Square Face Generator |
| Pixel Art Avatar Icon Generator | `/oval-face-icon-generator` | Oval Face Icon Generator |
| Pixel Art Avatar Icon Generator | `/pixel-square-face-maker` | Pixel Square Face Maker Guide |
| Gallery | `/` | Square Face Generator |
| Support pages | `/blog` | Square Face Icon Guides |
| Legal pages | `/` | Square Face Generator |
