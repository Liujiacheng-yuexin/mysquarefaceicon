# LAUNCH_CHECKLIST.md · v2.1 证据清单

> 当前 v1.96 · 2026-09-08：`ASSET-001` 已获用户明确本地验收；验收不等于外部 R2、权利、生产或发布通过。下一项 `IMG-001` 只完成图片清单、源码使用点与五项现状回归，并提交[方案待确认](docs/product/game-image-pipeline-proposal.md)。方案通过角色拆分保留 Square/Oval 首屏 Player preview，不把 970×844 / 974×775 强裁成 16:9；新 `LANDSCAPE_COVER` 若存在必须 16:9，Thumbnail 必须 1:1，OG 必须 1200×630，所有 Game Data 图片尺寸必填，非首屏图片明确 lazy。public 29 图 / 448,379 bytes；Square thumbnail 的 512×512 数据缺失是待修正项。`assets:check`、`games:check`、`components:check`、`metadata:check`、`perf-home:check` exit 0；看板本地渲染、详情交互、0 error/warn 与方案按钮禁用通过。未运行应用 type/lint/build/HTTP/SEO/browser/mobile/CWV。未修改应用、图片、依赖、R2 或生产，未提交、推送、部署或运行 `seo:prod`。26/60、37 个源验收键；P0/UNKNOWN、人工事实、广告/CMP 与生产门禁保持。等待 `确认 IMG-001 图片规范与优化管线方案，进行开发`。

> 当前 v1.94 · 2026-09-08：`ASSET-001` 确认方案已完成本地实施，状态 `待验收`。资产清单、类型/结构约束与独立 `assets:check` 已落地；10 个 Game Data 引用、8 个唯一本地响应、20 个 fail-closed 负例通过。清单中 R2 对象为 0；Square/Oval UNKNOWN SWF、Pixel 仅外链、Ruffle 独立运行时与 Square 首屏 LCP cover 本地保留均为硬门禁。Type/lint、相关历史契约、Next/OpenNext、本地 HTTP、SEO/robots 与桌面 Square/Oval 运行态通过；手机 390/360、真实浏览器网络请求面板、错误注入/Retry、全屏、真机/其它浏览器、field/生产 CWV、生产 SEO/部署和权利仍 `未验证`，12 项既有 SEO 应该级提醒与原 P0/人工/广告/CMP 门禁不隐藏。25/60、36 个源验收键不变；未改 R2/CORS/TLS/对象，未提交、推送、部署或运行 `seo:prod`。证据：[ASSET-001 checks](docs/quality/evidence/asset-001/checks.json)。等待 `ASSET-001 验收通过`，不自动开始下一任务。

> 当前 v1.89 · 2026-09-07：`FAV-001` 已按用户确认方案本地实施，当前 `待验收`。本机收藏使用独立 `msfi-favorites-v1`，只存最多 50 个稳定 ID；共享/Recent/legacy Related 卡片及 current/future 详情入口均使用非嵌套按钮，Pixel 保持 External Tool / Save tool，`/games` 条件式 Favorites 位于 Recently Played 后、On-site 前，Privacy 已增量披露。专项、type、0-warning lint、全量相关回归、Next/OpenNext、built/HTTP、20 页 SEO 0 must / 12 个既有 should、robots 和真实浏览器交互通过；1280×900、390×844、360×800 均无横向溢出，按钮高度 44px，同/跨标签同步和删除焦点恢复通过。23/60、34 个唯一源验收键保持；原 P0/UNKNOWN、实际许可、人工事实审核、广告/CMP、真实 CWV 与生产验证仍开放，全站发布 `不通过 / 未部署`。证据：[README](docs/quality/evidence/fav-001/README.md) 与 [checks.json](docs/quality/evidence/fav-001/checks.json)。未提交、推送、部署或运行 `seo:prod`；等待 `FAV-001 验收通过`。

> 当前 v1.88 · 2026-09-07：下一项 `FAV-001` 仅进入[方案待确认](docs/product/favorites-local-storage-proposal.md)，应用未实施。方案拟用独立 `msfi-favorites-v1` 保存最多 50 个稳定 Game Data ID，在所有真实 Game Data 卡片和当前/future 详情入口提供非嵌套 Favorite 按钮，并在 `/games` 条件显示 Favorites；Pixel 始终标 External Tool，不新增 URL/账号/网络同步。components、recent、home、games-index、CATEGORY 两阶段、game-template、Oval、Pixel、RELATED 共 10 项现状回归 exit 0；game-template 的既有 React warning 单列保留。本轮未运行 type/lint/Next/OpenNext/HTTP/SEO/robots/browser/mobile/CWV。23/60、34 个唯一源验收键保持；原 P0/UNKNOWN、精确移动视觉、CLS、人工审核、广告/CMP 与生产门禁不变，全站发布 `不通过 / 未部署`；未提交、推送、部署或运行 `seo:prod`。等待 `确认 FAV-001 方案，进行开发`。

> 当前 v1.87 · 2026-09-07：用户已明确验收 `RECENT-001` 本地成果，[验收记录](docs/quality/evidence/recent-001/acceptance-checks.json) 单独保存，不覆盖 v1.86 的实施 QA、失败或未验证项。本轮仅登记验收，不修改应用/测试/构建产物，不重跑 type/lint/专项/Next/OpenNext/HTTP/SEO/robots/browser/mobile/CWV。看板更新为 23/60、34 个唯一源验收任务键；`FAV-001` 仍未开始，等待下一条明确指令。精确 390/360 移动视觉、seeded-history CLS、Square/Oval 权利 UNKNOWN、其它 P0、人工事实审核、广告/CMP、真实 CWV 与生产验证继续开放；全站发布仍为 `不通过 / 未部署`。未提交、推送、部署或运行 `seo:prod`。

> 当前 v1.86 · 2026-09-07：`RECENT-001` 已按用户确认方案本地实施，当前 `待验收`。真实可玩 Player 的首次 Play 才保存本机稳定游戏 ID/ISO 时间；Reload、Retry、页面访问与 Pixel External 不写入；首页与 `/games` 仅有有效记录时显示，8 存/4 显、同/跨标签同步、Clear 只删除本任务 key 并恢复焦点，Privacy 可见日期/披露已更新。专项与全量相关回归、type、lint、Next/OpenNext、built/HTTP、SEO/robots 和 1280 CSS px 交互通过；精确 390/360 移动视觉与 seeded-history CLS 因本轮内置浏览器 viewport 覆盖未生效而 `未验证`，不能写成通过。22/60、33 个唯一源验收键保持；FAV-001 未开始；原 P0/UNKNOWN、实际许可、人工事实审核、广告/CMP、现场 CWV 与生产验证仍开放，全站发布 `不通过 / 未部署`。证据：[README](docs/quality/evidence/recent-001/README.md) 与 [checks.json](docs/quality/evidence/recent-001/checks.json)。

> 当前 v1.85 · 2026-09-07：下一项 `RECENT-001` 仅进入 [方案待确认](docs/product/recently-played-proposal.md)，应用未实施。拟用版本化 localStorage 保存最多 8 条真实 game ID/启动时间，界面最多显示 4 条；只记录可玩 player 的首次 idle→Play，Reload 不重复，Pixel External 排除；无有效记录时首页和 `/games` 不输出 Continue 模块，并增量披露 Privacy。player/home/home-discovery/games-index 四项现状回归 exit 0；本轮未运行 type/lint/Next/OpenNext/HTTP/SEO/browser/mobile/CWV，不把 v1.83 QA 当成本轮结果。22/60、33 个唯一源验收任务键保持，FAV-001 未开始；URL/metadata/index/sitemap/schema、Game Data、许可、广告/CMP、P0/UNKNOWN 与生产状态不变，未提交、推送、部署或运行 `seo:prod`。全站发布仍不通过。

> 当前 v1.84 · 2026-09-07：RELATED-001 的 Oval 样例与剩余入口已获用户明确本地验收，[验收记录](docs/quality/evidence/related-001/remaining-acceptance-checks.json) 保留 v1.83 原实现 QA、失败与浏览器条件项日期，不把验收登记写成新一轮应用验证。当前 22/60 已完成、33 个唯一源验收任务键；RECENT/FAV 未开始。网站源码、URL/metadata/index/sitemap/robots/Player/CSS 与构建产物未在本轮改变，未重跑 type/lint/test/Next/OpenNext/HTTP/SEO/browser/mobile/CWV。Square/Oval 权利 UNKNOWN、P0、人工审核、广告/CMP、真机/其它浏览器、真实看板视觉和生产门禁仍未验证或不通过；未提交、推送、部署或运行 `seo:prod`，全站发布继续不通过。

> 当前 v1.83 · 2026-09-07：RELATED-001 剩余入口已按确认方案本地实施并**待用户验收**。[交付证据](docs/quality/evidence/related-001/remaining-surfaces-README.md)。首页、Pixel 与 future detail 共享同一 Category + Tags 选择器，现有链接目标/顺序保持，quality/popularity 继续禁用；URL/TDK/H1/canonical/schema/index/sitemap/robots/Player/CSS 不变。type、lint、72 项专项、相关冻结回归、Next/OpenNext、built/HTTP、20 页 SEO（0 must / 12 should）、robots 及 Chrome 三视口通过；首轮 Pixel 历史导航后 console 为 1/2/0，诊断复跑定位到第三方 Ads 403 并得到 1/0/0，因此浏览器结论有条件通过。当前 21/60、33 个源验收键，RECENT/FAV 未开始；Square/Oval 权利 UNKNOWN、P0/人工/真机/CWV/生产/真实看板视觉门禁保持。未提交、推送、部署或运行 `seo:prod`，全站发布仍不通过。

> 当前 v1.82 · 2026-09-07：RELATED-001 进入[剩余入口方案待确认](docs/product/related-games-remaining-surfaces-proposal.md)，仅拟迁移英文首页 discovery、Pixel 页尾推荐和 future `/games/[slug]` 共享组件；应用未实施。方案前 `related:check`、`home-discovery:check`、`game-template:check`、`pixel-page:check` 均 exit 0，game-template 的既有 React `fetchPriority` warning 单独保留；本轮未运行全量 type/lint/regressions、Next/OpenNext、HTTP/SEO 或浏览器。Oval 样例验收、21/60、33 个源验收键不变；URL/索引/metadata/schema/目录分类/locale/Player、P0/UNKNOWN/人工审核/广告/CMP/生产门禁保持。未提交、推送、部署或运行 `seo:prod`，全站发布仍不通过。[方案证据](docs/quality/evidence/related-001/remaining-surfaces-proposal-checks.json)。

> 当前 v1.81 · 2026-09-07：RELATED-001 Oval 单页样例已获用户明确本地验收，[验收记录](docs/quality/evidence/related-001/acceptance-checks.json) 保留 v1.80 原 QA/失败/构建/浏览器日期，不把验收登记写成新一轮应用验证。RELATED 整项与其它入口未完成，21/60 不变，源验收键为 33；未提交、推送、部署或运行 `seo:prod`。Square/Oval 权利 UNKNOWN、KW-04、人类审核、真机/CWV、广告/CMP、真实看板视觉和生产门禁仍未验证或不通过，因此全站发布继续不通过。

> 当前 v1.80 · 2026-09-05：RELATED-001 Oval 单页样例已实施并通过本地限定 QA，**待用户验收**；完整证据见 [README](docs/quality/evidence/related-001/README.md)。本轮只新增服务端确定性选择器和 Oval FAQ 后两组卡片，保持 URL/TDK/H1/canonical/schema/index/sitemap/robots、首屏 Player、广告边界与其它入口。type、零警告 lint、53 项专项、相关冻结回归、Next/OpenNext、本地 20 页 SEO（0 must / 12 既有 should）及 1280/390/360px 浏览器通过。真实看板视觉、真机/其它浏览器、内部游戏、人类事实审核、CWV 与生产仍未验证；Square/Oval 权利 UNKNOWN、其它 P0/CMP/生产门禁不关闭，因此全站发布仍不通过/未部署。验收前不进入下一项，不提交、推送或部署。

> 当前 v1.79 · 2026-09-04：CATEGORY-001 样例及剩余四页本地验收齐全，[新验收记录](docs/quality/evidence/category-001/remaining-acceptance-checks.json) 不覆盖原 v1.78 的 51 工程命令、浏览器或失败日期；五页维持 noindex，人工事实审核/权利/独立搜索价值不因此通过。RELATED-001 仅 [方案待确认](docs/product/related-games-oval-sample-proposal.md)，未改应用或重跑 QA/构建/HTTP/SEO/浏览器；预览存活与真实看板视觉未验证。全站 P0/UNKNOWN/广告/CMP/生产门禁和材料任务取消保持，发布不通过/未部署。

> 当前 v1.78 · 2026-09-04：CATEGORY-001 剩余四页已实施、待验收，[证据](docs/quality/evidence/category-001/remaining-checks.json)。26 code + 3 build + 10 built + 12 HTTP/robots/SEO 共 51 命令通过；21 组页面、177 场景、最终 9 路长等待及 4 路真实广告来源隔离通过。首次 GA 外部连接关闭 FAIL 与原历史失败保留，不以最终通过抹除。SEO 0 must / 12 should，五分类 noindex；全站 P0/UNKNOWN/人工事实审核/广告/CMP/生产门禁不关闭，**发布不通过/未部署**。32 条源验收与材料任务取消保持。

> 当前 v1.77 · 2026-09-04：CATEGORY-001 [剩余四页方案待确认](docs/product/category-remaining-pages-proposal.md)，尚未实施/验收，不开放索引或发布；样例已验收和原 32 条源验收不变。本轮仅方案/文件指纹/离线看板核验，应用 type/lint/tests/Next/OpenNext/HTTP/SEO/浏览器/移动/CWV 未重跑，预览与生产未验证。[证据](docs/quality/evidence/category-001/remaining-proposal-checks.json)。旧 QA/整体超时、UNKNOWN/P0/人工事实审核/广告/CMP/生产门禁保留，发布不通过/未部署，材料任务继续取消。

> 当前 v1.76 · 2026-09-04：CATEGORY-001 单页样例已获用户明确验收，共 32 条源验收；整项未完成，剩余四页仍需独立方案确认。[验收记录](docs/quality/evidence/category-001/acceptance-checks.json)。本轮仅验收登记/文件指纹/离线看板核验，未重跑 type/lint/tests/Next/OpenNext/HTTP/SEO/浏览器/移动检查，未核实预览存活或生产。原 QA/超时保持；全站发布不通过，UNKNOWN/P0/人工事实审核/广告/CMP/生产门禁不关闭，材料任务继续取消。未提交/推送/部署。

> 当前 v1.75 · 2026-09-04：CATEGORY-001 Face Makers 样例及已确认共享边界本地完成，**待样例验收，整项未完成**。[证据](docs/quality/evidence/category-001/README.md)。25 代码 + Next/OpenNext/patch + 9 built + 11 HTTP/SEO 共 48 项通过；15 组页面/45 操作/12 补充通过；已有广告源页真实 200/load/global → 分类新文档无广告通过。9 路长停留正例跨两次整体超时运行，原 FAIL 保留，不称单批稳定。全站广告/CMP、KW-04、人类审核、CWV/真机/生产未通过或未验证，发布不通过/未部署。31 验收、UNKNOWN、Oval 完整迁移延期、材料任务取消保留；其余四页内容/RELATED 不启动。

> 当前 v1.74 · 2026-09-04：GAMES-INDEX-001 已明确本地验收，31 条源验收及原 QA 保留。[记录](docs/quality/evidence/games-index-001/acceptance-checks.json)。CATEGORY-001 仅 [单页样例方案待确认](docs/product/category-pages-proposal.md)，未实施；分类族广告仍是源码已发现、尚未修复的范围，不能记为 AD-02 通过。本轮只做文件/证据保全和离线看板核验，不重跑应用 type/lint/测试/Next/OpenNext/HTTP/SEO/浏览器/移动/CWV，不核实预览存活。生产未验证/未部署，原 P0/UNKNOWN/广告/CMP/语义门禁不关闭，材料任务继续取消。下方原结果保留历史日期。

> 当前 v1.73 · 2026-09-04：GAMES-INDEX-001 已恢复并完成本地目录、导航及广告隔离，待用户验收。24 项最终代码检查、Next/OpenNext/patch、8 built、10 HTTP/SEO 均通过；SEO 20 页 0 must / 12 should。3 视口主流程、广告文档隔离和 404 返回复核见 [证据](docs/quality/evidence/games-index-001/README.md)，初始失败保持。UNKNOWN、KW-04、全站广告/CMP 与生产门禁未关闭，发布不通过/未部署。旧版本段落只表述当时结果，LICENSE-GATE 材料任务继续取消。

> 当前 v1.72 · 2026-09-04：GAMES-INDEX-001 已获方案确认并有部分本地代码，因最新 HOME-DISC-001 重复确认而暂停；未完成专用测试、构建、当前版本浏览器或 SEO，不得提交验收或发布。HOME-DISC 原验收保留，当前专项复查退出 0，新范围待用户说明。[记录](docs/quality/evidence/games-index-001/implementation-interruption.md)。下方旧“当前”段落保留历史语境；UNKNOWN/原 P0 及材料任务取消状态不变，未部署。

> 当前 v1.71 · 2026-09-03：用户明确验收 CONTENT-QA-001，新增第 30 条源验收；规范与模板通过不等于三页事实复审或发布通过。验收证据：[acceptance-checks.json](docs/quality/evidence/content-qa-001/acceptance-checks.json)。
> 下一项 GAMES-INDEX-001 仅准备 [目录页方案](docs/product/games-index-directory-proposal.md)，待明确确认；沿用现有布局、3 条真实记录和 noindex，提出目录导航/metadata/广告边界改进。尚未修改网站代码或部署；其它任务不启动，LICENSE-GATE 材料任务保持取消，UNKNOWN 与原风险保留。

> v1.70 历史标准交付记录（当时待验收）· 2026-09-03：按用户“继续进行开发”，仅完成 CONTENT-QA-001 游戏内容事实核验标准与单页审核模板，待用户验收。入口：docs/content/game-page-quality-standard.md；证据：docs/quality/evidence/content-qa-001/checks.json。
> 本项不改网站页面/URL/索引/布局、运行代码或数据，不重跑应用 QA，不部署或开始下一项。29 条源验收及原 QA 保留；LICENSE-GATE 继续取消，UNKNOWN 和其它未关闭风险不变。

> v1.69 历史取消记录 · 2026-09-03：用户明确要求“不用提供，取消该项任务计划和相关文件”。LICENSE-GATE 材料补充计划已取消，不再要求材料，也不依据历史记录重建或催办该任务。专属清单和两份预检文件已从活跃目录移至 docs/archive/license-gate-cancelled-2026-09-03，可恢复；旧 JSON 的原路径和待材料措辞仅为历史。
> 29 条验收、原 QA、共享 Registry/UNKNOWN、应用及 SWF 保留；取消不记作许可或发布验证通过。本轮只取消和清理引用，不部署或开始下一项。下文原版本计划保留当时语境，不能覆盖本次取消。

> 每一项都要填写证据，不是只打勾。通用规则以 [RULES.md](RULES.md) 为唯一来源，P0 状态按 [QUALITY_STANDARD.md](QUALITY_STANDARD.md) 判定。
>
> 项目：`mysquarefaceicon.com`
>
> 规范版本：`2026-08-31 / v2.1`

## 0. 当前已知发布阻断

| 状态 | 规则 | 当前证据 |
|---|---|---|
| 本地已验收 / 生产未验证 | OP-11 | 用户已验收本地主域实现；当前部署仍以预检时四入口 `200` 为准，生产一跳矩阵仍是发布证据门，见 `docs/quality/evidence/op-11-canonical-host/README.md` |
| 本地已验收 / 生产未验证 | AI-01 | 用户已验收 11 项训练/搜索分流的本地源实现；生产未部署，见 `docs/quality/evidence/ai-01-crawler-policy/README.md` |
| 本地已验收 / 生产未验证 | KW-02 | `/contact` 样例与剩余 11 页均已验收；本地 `seo-check` 必须级 `11 → 0`，生产未部署，12 条应该提醒独立保留 |
| 本地已验收 / 生产未验证 | PF-01 | 用户于 2026-09-02 明确回复 `PF-01 验收通过`；沿用上轮三组移动 local production 的 LCP `2234/2023/2028 ms`、首次 Play INP `122/43/44 ms`、导航 CLS `0.01`、Play CLS `0.00` 证据。本轮未重测；见 `docs/quality/evidence/pf-01-activation-response/README.md` |
| 本地已验收 / 生产未验证 | TERMS-001、CT-03、TR-07 | 用户明确回复 `TERMS-001 验收通过`，看板 v1.45 记录本地验收。v1.43 精确文字/构建与 v1.44 HTTP/robots/sitemap、20 页 SEO、1280×900/390×844 视觉/链接/键盘/控制台、type/lint/回归证据保留；本轮未重跑。见 `docs/quality/evidence/terms-001-rights-copy/README.md`。生产修正未部署，文案验收不等于实际授权或发布通过 |
| 本地已验收 / 生产未验证 | ABOUT-001、CT-03、TR-07 | 用户明确回复 `ABOUT-001 验收通过`，看板 v1.48 记录本地验收。v1.47 源码/构建/HTTP、14+6 负例、type/lint/canonical/11 回归、Next/OpenNext、20 页 SEO（0 must / 12 should）、robots 与桌面/手机链接/键盘原证据保留，本轮未重跑。既有桌面窄列仍为非阻断视觉提醒。见 `docs/quality/evidence/about-001-rights-copy/README.md`；未部署，不等于许可或发布通过 |
| 本地已验收 / 生产未验证 / 未部署 | EDITORIAL-001、CT-03、TR-07/10、OP-09 | 用户在 v1.52 待验收后明确回复 `验收通过，请进行下一步开发`；v1.53 记录第 24 条本地验收。v1.50 构建、v1.52 HTTP/SEO/桌面手机及窄卡提醒保留；v1.53 验收回写时未重跑，v1.54 Gallery 回归另有 source/built/HTTP 通过。原 checks.json 不变；实际许可与生产门禁不关闭 |
| 本地已验收 / 生产未验证 / 未部署 | GALLERY-001、CT-03、META-06、KW-13 | 用户明确回复 `GALLERY-001 验收通过`，v1.55 新增第 25 条源验收。原 v1.54 六处实现、32 命令、18/20 反例、4 社区内存状态、20 页 0 must / 12 should 与桌面/手机 44 断言/8 截图保留，本轮未重跑应用 QA。原 checks.json 不变；实际许可/生产门禁和旧视觉提醒保持 |
| 本地已验收 / 生产未验证 | LOCALE-001、CT-03、KW-13/14、I18-08 | v1.59 用户明确验收原四处文案及手机修订；原 v1.57 失败与 v1.58 功能/视觉通过证据不改写。现 26 条验收；本轮未重跑应用检查，实际许可 UNKNOWN 与生产门禁保留，未部署 |
| 本地已验收 / 生产未验证 / 未部署 | MIG-PIXEL-001 | v1.68 用户明确验收 External Tool 一致性，新增第 29 条源验收；v1.67 42 项命令及桌面/手机原始证据保留，本轮未重跑应用 QA。见 docs/quality/evidence/mig-pixel-001/acceptance-checks.json |
| 原 P0 风险未核验（补材料任务已取消） | CT-03 / TR-07 | v1.69 用户取消 LICENSE-GATE 计划及专属文件；不再催交材料或自动重建待办。Registry 仍 UNKNOWN，未伪造通过；本轮未执行发布检查、部署或下一项开发 |

这些阻断关闭并完整重跑前，发布状态必须保持“不通过”。历史 v1.43 的 TERMS-001 实现与构建通过，v1.44 同渠道启动成功后补齐本地 HTTP/SEO/浏览器与 type/lint/回归；v1.45 只记录用户明确的 `TERMS-001 验收通过`，当时未改应用或重跑检查。上述历史日期和 PF-01 数值保持，不冒充当前 About 复测或生产结果；v1.47 的重新验证见下文，v1.48 只记录验收。

历史 v1.46 仅新增 ABOUT-001 方案；v1.47 在用户确认后实现七处文字并执行代码/构建/HTTP/SEO/Browser 验证，0 must / 12 should，随后等待验收。用户现明确回复 `ABOUT-001 验收通过`，v1.48 只记录 `已完成（本地已验收） / 生产未验证 / 未部署`；145 项源码/检查/配置哈希与 v1.47 相同，未重跑应用检查、重建或重启预览。原 v1.43/v1.44/v1.45 Terms 证据、PF-01 数值、v1.47 QA 日期及 22 条验收均保留，新增第 23 条 ABOUT 验收。实际许可 UNKNOWN、视觉提醒与生产门禁仍未关闭；等待用户下一步指示，不提交、推送、部署或启动下一项/MIG-SQUARE-001。

历史 v1.49：用户在 ABOUT-001 验收后要求下一项开发，只开启 EDITORIAL-001 单页五处来源/权利文案方案。拟稿 1 H1/4 H2/3 H3/10 段、2 链接、1 schema 和关键词 3 次保持，145 项源码/检查/配置与 About 原证据未变。方案尚未确认或实施，完整 type/lint/测试/Next/OpenNext/HTTP/SEO/browser/移动/性能本轮未重跑，下表仍为原日期结果。等待 `确认 EDITORIAL-001 编辑政策来源与权利声明修正方案`；不把预演当作实现、验收或发布通过。

历史 v1.50：已收到 EDITORIAL-001 明确方案确认并实施五处文字。25 项最终代码/离线/构建命令 exit 0；旧源码红灯和临时产物检查器修正尝试单独保留。原 23 条验收、7 份历史证据、冻结区及其余 142 项基线文件不变。新预览启动在执行前被策略拦截，3100 无监听，未绕行；HTTP/SEO/browser/移动/链接/键盘与生产仍未验证，原历史 SEO 和 PF-01 数值不冒充本轮结果。先启动本地预览补齐 QA，再请求用户验收；不提交、推送、部署或进行下一项。

历史 v1.51：用户要求代为启动和验证，沿用同一启动渠道重试仍在执行前被策略拒绝；2026-09-02T09:07:33.8207354Z，3100 无监听、无启动日志。146 项源码/检查/配置和既有构建产物保持，未重跑代码测试或构建。HTTP/SEO/真实桌面手机验证仍未执行，不把 v1.50 历史通过当作本轮运行时通过。维持验证阻塞、未验收、未部署；需要用户启动可用本地预览后补齐 QA。

历史 v1.52：用户回复“已启动”后，本轮核实 PID 34860 的 `127.0.0.1:3100` Next 生产预览；build `nEfpi7bM0YNUT_HgxJ895` 与 146 项源码/检查/配置、现有产物保持 v1.50 不变。Editorial/About/Terms/robots/sitemap 五路 HTTP 200 与构建字节一致；18 项代码检查及 5 项目标运行时检查最终通过，完整本地 SEO 20 页、0 must / 12 should。Browser 1280×900 / 390×844 的精确文案、metadata/schema、非空/无覆盖层/无横向溢出、控制台、Contact/Back/首页和 Tab/Enter 均通过，6 张截图已审阅。 未改应用或重新运行 Next/OpenNext 构建；原 v1.50 构建/失败记录、v1.51 重试、7 份历史证据及 23 条验收保持。既有桌面窄卡为非阻断视觉提醒，实际许可 UNKNOWN、其它文案候选、12 should/KW-04 与生产门禁仍开放。看板 v1.52 仅推进到 `待验收`，等待 `EDITORIAL-001 验收通过`；未提交、推送、部署、运行 seo:prod 或启动下一项/MIG-SQUARE-001。

历史 v1.53：2026-09-02（记录时间 `2026-09-02T10:24:29.697Z`），用户明确回复 `验收通过，请进行下一步开发`。v1.53 将 EDITORIAL-001 记录为 `已完成（本地已验收） / 生产未验证 / 未部署`，新增第 24 条源验收；原 23 条验收及 v1.50/v1.51/v1.52 的检查、失败、构建和截图日期保持。原 checks.json 逐字节保留，SHA-256 `72f7ff3be63a9e3b14a41a3f651a336c57f7d74d59785fb9173cd2af36117d52`；其 runtimeValidationFollowUp 的“待验收”仅代表 v1.52 历史时点，不撤销本次验收。

v1.53 历史验收回写：本轮仅记录验收并开启下一项方案；146 项应用/检查/配置与现有 Next/OpenNext 产物不变，没有重新执行 type/lint/测试/构建/HTTP/SEO/Browser/移动或性能检查，也不声称预览当前仍在运行。v1.52 的 20 页 0 must / 12 should 与本地浏览器结果保留原日期。实际许可 UNKNOWN、既有桌面窄卡提醒、12 should/KW-04 与生产门禁仍开放；没有提交、推送、部署、seo:prod 或 MIG-SQUARE-001。

v1.53 历史方案：按同一句下一步指令，仅开启 GALLERY-001 六处来源/权利文字方案，见 `docs/legal/gallery-rights-consistency-proposal.md` 与 `docs/quality/evidence/gallery-001-rights-copy/proposal-checks.json`。质量监管 skill 与 KW-13 要求先确认段落替换；等待 `确认 GALLERY-001 示例来源与权利声明修正方案`，不能把本次 Editorial 验收视为 Gallery 文案批准。

历史 v1.54（记录 `2026-09-02T11:19:47.319Z`）：用户明确回复 `确认 GALLERY-001 示例来源与权利声明修正方案`，已按确认稿实施六处替换。20 项代码/回归、Next 42 路由及 OpenNext、4 页 built 检查、6 项 HTTP/robots/SEO 检查通过；6 路 HTTP 与产物一致，sitemap 20 唯一 URL、0 lastmod。完整本地 SEO 20 页、0 must / 12 should；Gallery 18 个源码与 20 个 HTML 反例被拒绝，4 种共享社区内存 SSR 状态通过。

Browser 1280×900 / 390×844：1 H1/4 H2/14 H3、19 页属段落 + 1 条真实初始社区空态段落、8 个 CSS 样例、4 条主链接和两份 schema 核对；12 条点击/跳转/Back 与 4 条 Tab/Enter 记录、44 项断言通过，8 张前后/全页/焦点截图已审阅。真实 latest/liked GET 均为 200、0 条；仅测试真实空态，其余状态为内存 SSR，无评论或点赞写入。

143 项原文件和 9 份旧 QA 证据未变，加本项检查器共 147 项源码/检查/配置；24 条既有验收保持，本轮不新增 GALLERY-001 成果验收。原有社区标题/副标题间距偏紧及 About/Editorial 窄卡提醒保留；12 should、KW-04、实际许可 UNKNOWN、独立 locale 文字及全部生产门禁仍开放。看板文件视觉未验证，保留既有访问限制且不绕行；未重测生产性能，未提交、推送、部署、seo:prod 或启动下一项/MIG-SQUARE-001。本项仅为 `待验收`，完整记录见 `docs/quality/evidence/gallery-001-rights-copy/README.md` 与 `checks.json`，等待 `GALLERY-001 验收通过`。

历史 v1.55 明确验收：2026-09-02T12:44:34.299Z，用户明确回复 `GALLERY-001 验收通过`。看板 v1.55 将本项记录为 `已完成（本地已验收） / 生产未验证 / 未部署`，新增第 25 条源验收；原 24 条验收及 v1.54 检查、构建、浏览器、截图和诊断日期均保留。

本轮只做验收治理：147 项源码/检查/配置及现有 Next/OpenNext 产物保持不变；原 checks.json 逐字节保留，SHA-256 `a41646b12dffdc099bc9c1a84cf10667f6efc1753b1db5be2c437e3695bd86af`。其中“待验收”和 userAcceptance=NOT_RECEIVED 仅代表 v1.54 历史时点，不撤销本次明确验收。未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动或性能，不重启预览，也不声称当前服务仍在运行。

v1.54 本地 SEO 20 页、0 must / 12 should 与桌面/手机结果保留原日期；社区空态与内存 fixture 的边界不变。原间距/窄卡提醒、实际许可 UNKNOWN、独立 locale 文字、KW-04/should 与全部生产门禁仍开放；看板文件视觉仍未验证，不绕行。等待用户下一步指示，不启动下一项/MIG-SQUARE-001，不提交、推送、部署或执行 seo:prod。

历史 v1.56（2026-09-02T14:20:56.172Z）：用户要求下一步，仅开启 LOCALE-001 方案待确认。四处精确文字位于两文件；七个既有 noindex 草稿共用的一处 Gallery 侧栏文字可见，另三处 authorized/embedded/original 数据未参与当前 HomePage 渲染。旧构建快照与隔离 SSR（真实 HomePage/GameSidebar、六个组件桩）通过，不等于新应用或浏览器 QA。147 源文件、13 份历史证据、25 条验收及旧产物/截图保持；未重跑 type/lint/全量回归/Next/OpenNext/HTTP/SEO/Browser/移动/性能或核实预览存活。确认 LOCALE-001 草稿语言页与遗留文案一致性修正方案 前不改应用；拟稿与配套 Gallery 单项哈希基线更新边界见 `docs/legal/locale-rights-consistency-proposal.md`。实际许可 UNKNOWN、should/KW-04、视觉与生产门禁仍开放，不提交、推送、部署或开始 MIG-SQUARE-001。

2026-09-02 v1.57：已收到 `确认 LOCALE-001 草稿语言页与遗留文案一致性修正方案`，只实施两文件四处精确文字、一个 LOCALE 检查器、对应 npm/README 入口及 Gallery 检查器唯一 expectedLocalesHash 更新。37 项最终命令通过（22 代码/回归、2 构建、5 built、8 HTTP/SEO）；新 build `ynVDY6J1ddC0YHaNiUTtN` 生成 42 路由，14 路 HTTP 与产物字节一致，完整本地 SEO 20 页、0 must / 12 should，sitemap 20 唯一 URL。首页主体/metadata/schema 与布局、播放器保持；七个草稿仍 noindex/self-canonical/无 hreflang/不进 sitemap，未新增翻译。142 项原文件、14 份历史证据与 25 条验收保持。

Browser 在 1280×900 / 390×844 实测 `/es`、`/ar` 与首页：Gallery 点击/返回/Tab/Enter、首屏播放器 idle→ready（手机另观察到 loading）、无横向溢出及 7 组控制台检查通过；14 张前后/焦点/播放截图留档。但手机 Gallery 说明末尾 available. 被既有两行样式裁切：可见高 35px、内容高 53px，视觉不通过。先前通用 aside 误选隐藏设备提示，已通过精确 More Avatar Games 选择器纠正；真实侧栏在手机首屏下方显示。SSR/HTTP 通过不能替代换行检查；原测量、截图失败/CDP 超时与重试证据全部保留。

看板只设 `待验收` 并明确此手机阻断；未收到成果验收。候选 `Style examples; approved posts when available.` 仅是缩短同一句的修订建议，尚未确认、写入应用或验证换行；等待 `确认 LOCALE-001 手机文案缩短修订`，保留 CSS、其余三句及所有冻结边界，确认后重新构建和实测。实际许可 UNKNOWN、KW-04/12 should、旧间距/窄卡、生产版本/一跳/robots/SEO/CWV 门禁与看板文件视觉限制不关闭。未提交、推送、部署、执行 seo:prod 或启动下一项/MIG-SQUARE-001。

本轮完整记录：`docs/quality/evidence/locale-001-rights-copy/README.md`、`checks.json`；v1.56 proposal-checks.json 与已验收页原始证据不改写。回滚只逆向本轮四句、限定检查/npm 入口和治理增量，不覆盖其它脏工作区成果。

### 历史 v1.58 · 手机短句修订当时待验收

2026-09-03 v1.58：用户“确认”批准手机单句缩短，并要求“继续实施”。共享 Gallery 说明现为 `Style examples; approved posts when available.`；只改该字段、精确检查期望和检查说明，不改 CSS/布局、其余三句、首页、播放器或已验收页面。7 个草稿继续 noindex/follow、自引用 canonical、无 hreflang、不进入 sitemap。

37 项本地命令通过（22 代码/回归、2 构建、5 built、8 HTTP/SEO）；19 源码 / 116 HTML / 4 sitemap 反例均被拒绝。最终 build `Y8uf2WKGr_E9Pn2mjsax-`，42 路由，14 路 HTTP/产物一致；SEO 20 页、0 must / 12 should。Browser `/es`、`/ar` 的 1280×900、390×844、360×800 全文可见；手机文本高由 53px 降至 35px，与原可见高 35px 一致。14 条交互、7 组空错误/警告日志、9 张新截图；首页桌面 idle→ready 回归通过，不是新 CWV 测量。

本项仅 `待验收`，等待 `LOCALE-001 验收通过`。145 项原源码/配置、15 份历史证据、25 条验收保持，v1.57 裁切失败未改写。原始权限 UNKNOWN、KW-04/12 should、旧间距/窄卡、生产版本/一跳/robots/SEO/CWV 门禁和看板文件视觉限制保留。未提交、推送、部署或开始下一项。证据：`docs/quality/evidence/locale-001-rights-copy/mobile-revision-checks.json`。

### 历史 v1.59 · LOCALE-001 本地验收通过（验收保持）

2026-09-03 用户明确回复 `LOCALE-001 验收通过`，涵盖原四处文案与 v1.58 手机短句修订。看板 v1.59 登记为本地已验收，原 25 条验收不变，现共 26 条；不启动下一任务。

本轮仅验收治理：148 项源码/检查/配置、16 份历史证据、27 张截图和 15 个构建产物保持；未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动或性能检查，未核实预览存活。v1.57 失败及 v1.58 通过（含当时待验收字段）保留原记录。实际许可 UNKNOWN、KW-04/12 should、既有视觉提醒和生产版本/一跳/robots/SEO/CWV 门禁不关闭；未提交、推送、部署、seo:prod 或迁移。

验收与只读核对证据：`docs/quality/evidence/locale-001-rights-copy/acceptance-checks.json`。等待用户下一步指示；如需撤销此次治理更新，仅逆向 v1.59 文档/看板增量，不撤销应用实现或覆盖其它工作区改动。

### 历史 v1.60 · LICENSE-GATE 已阻塞

2026-09-03 用户要求在 LOCALE-001 验收后继续下一步。原 v1.59 验收及全部 26 条 SOURCE_ACCEPTANCE 保持，不重复新增。路线图下一项为 MIG-SQUARE-001，但此前“先部署累计成果，再继续迁移”的顺序尚未生产验收或被明确暂停；本轮只核对下一步的前置条件，未开启迁移方案或改应用。

两份本地 SWF 的 SHA-256 均与 Registry 相符；各自原始来源、权利人、许可文件和用途权限仍 UNKNOWN。仓库 261 个文件及指定项目知识库目录 2 个文件的限定文件名检索只命中现有 Registry，未发现新增候选许可材料；这不证明其它位置不存在授权。未反编译、提取、修改或分发 SWF。

质量监管 skill 保持 LICENSE-GATE 为 `已阻塞`、发布为 `不通过 / 未部署`。需要原始许可材料，或由用户明确暂停此次发布以先准备 MIG-SQUARE-001 本地方案；后者只改变工作顺序，不解除许可、KW-04/12 should、既有视觉或生产门禁。源码/检查/配置 148 项、历史证据 17 份、截图 27 张及 15 个产物保持。未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动/性能，未核实预览存活，未提交、推送、部署或迁移。

材料清单：`docs/archive/license-gate-cancelled-2026-09-03/swf-license-evidence-request.md`；本轮只读证据：`docs/archive/license-gate-cancelled-2026-09-03/checks.json`。仅有治理文档/看板增量可回滚，无线上回滚事项。

### 历史 v1.61 · 当时发布顺序已确认，许可材料仍缺

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

## 1. 自动检查

以下原应用检查表保留 v1.54 日期与原结果。v1.57 的 37 项及手机失败保留在 checks.json；v1.58 的新 37 项、手机修复和桌面回归单列 mobile-revision-checks.json，不改写旧测量，也不作为生产通过。

```powershell
npm run lint
npm run canonical:check
npm run robots:check
npm run build
npm run cf:build
# 有可运行的本地 production build 后：
npm run seo:check
```

| 项 | 规则 | 结果/证据 |
|---|---|---|
| `seo-check` 必须级失败数为 0 | — | `通过（GALLERY-001 v1.54 本地）`：明确单一 3100 base，20 页、0 must / 12 should，exit 0；不是生产 SEO |
| `seo-check` 应该级提醒逐项处置 | — | `未关闭 / v1.54 重新核实`：12 条（KW-03 ×1、META-03 ×7、META-04 ×4）与原基线相同，保留为独立提醒，不越过六处文案范围改写 |
| type-check 通过 | OP-09 | `通过（GALLERY-001 v1.54）`：2026-09-02 `tsc --noEmit`，exit 0 |
| lint 0 error；warning 有基线 | OP-09 | `通过（GALLERY-001 v1.54）`：全站、Gallery/Editorial 检查器均 0 warning/error；GAME-TPL SSR 原 fetchPriority warning 独立保留 |
| 必需单元/集成/浏览器测试通过 | OP-09 | `通过（本地 v1.54）`：20 代码检查；Gallery 18 源码/20 HTML 反例、4 社区内存 SSR；Editor/About/Terms、robots、SEO 与桌面/手机 44 断言。真实社区仅空态，未测真实投稿/点赞写链路；原间距/窄卡为视觉提醒 |
| Next.js build 通过 | OP-09 | `通过（GALLERY-001 v1.54 新构建）`：42 routes；Gallery 4.26 kB / First Load JS 96.7 kB；middleware 26.8 kB；build `Vyf3tcN5LOfwDiSXRH6xO` |
| Cloudflare/OpenNext 等效 build 通过 | OP-09 | `通过（GALLERY-001 v1.54）`：OpenNext 1.3.0 Worker bundle/patch 完成，exit 0；Windows warning 保留；不是部署 |
| 所有子进程有超时、日志和明确退出码 | OP-10 | `通过（v1.54 最终检查）`：20 代码 + 2 构建 + 4 built + 6 HTTP/robots/SEO 均 exit 0；旧源码上的预期红灯 exit 1 单独保存。Gallery HTTP 超时 10s；全部命令完整参数/日期/stdout/stderr 见本项 checks.json；旧任务失败不改写 |

应该级提醒：

| 规则 ID | URL | 提醒 | 处置/不处理理由 |
|---|---|---|---|
| | | | |

## 2. 页面与内容人工验证

| 项 | 规则 | 证据 |
|---|---|---|
| 每个 index 页面有独立搜索意图 | IA-02、CT-01 | |
| 每页至少一项独有内容 | CT-05 | |
| 不存在 thin、near-duplicate、doorway | CT-02 | |
| KW-01 五个位置覆盖 | KW-01 | |
| 主词或变体正文至少出现 3 次 | KW-02 | `本地已验收 / 生产未验证`：12 个映射页 raw main 均精确命中 3 次；必须级失败为 0 |
| KW-03 无高密度报警，或已人工复核 | KW-03、KW-05 | 无高密度报警；`/blog/how-to-make-a-cute-discord-profile-icon` 有 0.49% 低密度应该级观察，命中 3 次 |
| 语义覆盖率至少 70% | KW-04 | |
| 新增关键词文案为增量补强 | KW-10～KW-16 | `通过（本地已验收）`：每页只新增确认过的一句可见说明，未替换现有段落、结构或交互 |
| 无编造来源、许可、数据或热度 | CT-03、TR-07 | |
| AI 内容已人工检查 | CT-06 | |

旧 `3%-5%` 密度目标和 CSS `content` 调词方案已废除，不得作为证据。

## 3. 索引、Metadata 与内链

| 项 | 规则 | 证据 |
|---|---|---|
| index 页 canonical 正确且自引用 | IDX-01、IDX-02 | |
| canonical 使用正式域名 | IDX-04 | |
| sitemap 只含唯一、200、index、规范 URL | IDX-03、IDX-06 | |
| robots 声明 sitemap 且未封核心资源 | IDX-07 | |
| title/description 唯一 | META-01、META-02 | |
| 单一 H1 | META-05 | |
| schema 与可见内容一致 | META-06 | |
| schema 已检查原始 HTML 与水合浏览器 | META-09 | |
| 每个 index 页至少 1 条站内入链 | LINK-01 | |
| 核心页至少 5 条相关入链，或说明差距 | LINK-02 | |
| 内容页至少 2 条相关出链 | LINK-03 | |
| 首页到核心页点击深度不超过 3 | IA-07 | |

## 4. 游戏、来源与权利

| 项 | 规则/门禁 | 证据 |
|---|---|---|
| 所有公开游戏进入 License Registry | 项目 P0 | |
| 来源、作者/权利人、许可状态和证据 URL 已记录 | CT-03、TR-07 | |
| `UNKNOWN` 未被当成 Allowed | 项目 P0 | |
| External Tool 明确标记外部来源 | 项目决策 | |
| 未代理、镜像、iframe 或直链原站受限资源 | 项目决策 | |
| 未反编译或修改 Square/Oval SWF | 项目不变量 | |
| 首载没有 Ruffle/WASM/SWF | PF-06、项目不变量 | `通过（本地）`：三组独立移动会话 Play 前 runtime 请求均为 0；加载帧可见且适配器仍未挂载 |

## 5. 性能、移动端与可访问性

| 指标 | 阈值 | 实测值 | URL/证据 |
|---|---:|---:|---|
| LCP | ≤2.5s | 2234 / 2023 / 2028 ms | `/` 本地 production，390×844@3x、4x CPU、Slow 4G，3 个独立会话；生产未验证 |
| INP | ≤200ms | 122 / 43 / 44 ms | 同配置首次 cover Play；`docs/quality/evidence/pf-01-activation-response/README.md` |
| CLS | ≤0.1 | 导航 0.01；Play 0.00 | 3 组一致；不是现场 CWV 或已部署结果 |

| 项 | 规则 | 证据 |
|---|---|---|
| 嵌入、播放器和广告位预留稳定尺寸 | PF-04 | 本次播放器通过：root 手机 surface 330×286.953125、documentTop 365.015625 在 idle/loading/mount/ready 不变；不覆盖广告真实填充 |
| 移动端无横向滚动 | PF-05 | root/Oval 390px 通过；不代表全站所有设备 |
| 至少检查 390px 与桌面视口 | — | `通过（GALLERY-001 v1.54）`：1280×900 / 390×844 身份/非空/文案/metadata/schema/无横向溢出/控制台、4 链接/Back/排序/Tab/Enter；8 张前后/全页/焦点截图已审阅。原社区文字间距提醒保留，不代表全站全设备；看板文件视觉仍未验证 |
| 所有控件有可访问名称 | AY-01 | |
| 表单有 label | AY-02 | |
| 键盘可完成核心流程 | AY-03 | root cover Enter 激活至 ready 通过；完整 Tab 顺序、读屏、SWF 内部控件和真实 fullscreen 未在本任务验证 |
| 正文对比度符合目标 | AY-04 | |
| FAQ 可见且存在于 DOM | AY-06 | |

## 6. 多语言

| 项 | 规则 | 证据 |
|---|---|---|
| 各语言独立关键词调研，非直译 | I18-07 | |
| 各语言分别执行 KW-04 | KW-04 | |
| 未人工编辑页面保持 noindex | I18-08 | |
| hreflang 双向、自引用并有唯一 x-default | I18-02～I18-04 | |
| 页面语言、canonical、schema、OG 一致 | I18-01、I18-10 | |

## 7. 信任、隐私、广告与 AI 搜索

| 项 | 规则 | 证据 |
|---|---|---|
| About、Contact、Privacy、Editorial/Disclaimer 完整 | TR-01、TR-02 | |
| 公开数据、广告与隐私承诺符合真实行为 | TR-10 | |
| 引用外部数据与许可有可访问来源 | TR-07 | |
| AdSense Ready 未被当作全站质量认证 | AD-06 | |
| `/ads.txt` 可达且 publisher ID 可核对 | AD-01 | |
| 广告仅加载在允许的完整公开页 | AD-02 | |
| 广告位预留尺寸并在真实填充下测 CWV | AD-03、PF-01、PF-04 | |
| 所需地区 CMP 已验证接受/拒绝/撤回 | AD-05 | |
| AI crawler 已逐项显式决定并写入 PROJECT_BRIEF | AI-01 | `本地已验收 / 生产未验证`：11 项分流与私有路径边界通过，见 AI-01 evidence |

## 8. 规范域与发布证据链

| 项 | 规则 | 证据 |
|---|---|---|
| HTTP/HTTPS、www/非 www、旧域一跳归一 | OP-11 | 本地实现 `已验收`；生产 `未验证`，见 `docs/quality/evidence/op-11-canonical-host/README.md` |
| Change Log 已更新 | OP-05 | |
| commit、push、部署版本可对应 | OP-12 | |
| 回滚条件与步骤可执行 | OP-12 | |
| P0 阻断为 0 | QUALITY_STANDARD | |

授权部署后执行：

```powershell
npm run seo:prod
```

生产验收必须记录 robots、sitemap、canonical、核心 URL/404、游戏启动、移动视口、广告/隐私边界和部署版本。没有部署授权时写“未部署”，不得运行写入型外部操作。

## 9. 上线当天

| 项 | 规则 | 时间/证据 |
|---|---|---|
| 使用正确域名属性验证 GSC | OP-01 | |
| 提交 sitemap | OP-01 | |
| 请求索引首页与核心页 | OP-01 | |
| 提交 Bing Webmaster Tools | OP-06 | |
| 运行生产 `post-deploy-check` | OP-02 | |
| 更新 `SEO_LOG.md` | OP-05 | |

## 10. 上线后一周

| 项 | 规则 | 结果 |
|---|---|---|
| GSC 是否发现 sitemap | OP-07 | |
| 首页与核心页是否被发现/索引 | OP-07 | |
| 404/5xx、robots、canonical 报错 | OP-07 | |
| 已抓取尚未编入索引的 URL | OP-07 | |
| 游戏加载错误与外部链接状态 | 项目监控 | |
| 根据真实数据更新 `SEO_LOG.md` | OP-05 | |
