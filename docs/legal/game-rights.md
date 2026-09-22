# LEGAL-001 · Game Rights and License Registry

> 当前 v1.69 · 2026-09-03：用户明确要求“不用提供，取消该项任务计划和相关文件”。LICENSE-GATE 材料补充计划已取消，不再要求材料，也不依据历史记录重建或催办该任务。专属清单和两份预检文件已从活跃目录移至 docs/archive/license-gate-cancelled-2026-09-03，可恢复；旧 JSON 的原路径和待材料措辞仅为历史。
> 29 条验收、原 QA、共享 Registry/UNKNOWN、应用及 SWF 保留；取消不记作许可或发布验证通过。本轮只取消和清理引用，不部署或开始下一项。下文原版本计划保留当时语境，不能覆盖本次取消。

> 审查日期：2026-08-31（Asia/Shanghai）<br>
> 适用范围：当前 Square、Oval、Pixel external 三类内容<br>
> 结构化事实源：data/game-license-registry.json<br>
> 边界：这是项目证据登记和发布门禁，不构成法律意见；没有证据的权限统一写 UNKNOWN。

## 1. 结论

| 对象 | 当前交付方式 | 来源/作者 | 许可状态 | 当前门禁 |
|---|---|---|---|---|
| Square Face Generator | 本地 SWF + Ruffle | 精确二进制来源、作者和权利人均未被证据绑定 | UNKNOWN | 现状待复核；禁止扩展复制、迁移托管、商业授权声明 |
| Oval Face Icon Generator | 本地 SWF + Ruffle | 只有仓库文件、git 记录和历史 SEO 日志中的“authorized”说法 | UNKNOWN | 现状待复核；禁止扩展复制、迁移托管、商业授权声明 |
| Pixel Art Avatar Icon Generator | 只链接到官方外部页面 | IconGenerators / Eichi Zerona，官方页面可核验 | RESTRICTED | 只允许直接链接；禁止 iframe、镜像、代理、热链或复制资源 |

UNKNOWN 不等于允许。现有 Square/Oval 页面已经在线，但 LEGAL-001 没有取得能证明继续托管、公开运行、广告场景使用或再分发的书面文件，因此不能把“项目文档写过 authorized”升级为已验证授权。

## 2. 审查方法

- 对两个本地 SWF 仅核对路径、大小、SHA-256、git 引入记录，以及当前或历史项目文案中的权利说法。
- 没有反编译、反汇编、提取资源、修改或重新打包 SWF。
- 搜索项目仓库和 Liu-library 的相关工作跟进/模板目录，没有找到可绑定到确切 SWF 哈希的许可文件、邮件、合同、原始下载页或授权截图。
- 对 Pixel external 只读取官方公开页面、官方条款和响应头，没有复制其生成器或资源。
- 第三方 preservation 站、竞争站自称 original/authorized、文件能下载或网页能打开，都不作为授权证据。

## 3. Square Face Generator

### 已确认事实

- 本地文件：public/games/square-face.swf
- SHA-256：B1D074C95F15B7DCECDBC2405ABF820EAD985669BB12CD47247FC8EA7537BC1E
- git 首次引入：64b10474a21051b9e4e55eb31c3530567d639d43，2026-05-13，提交说明 Initial mysquarefaceicon site
- 当前公开 URL：https://mysquarefaceicon.com/
- 当前 Terms、About 和 locale 文案仍使用“provided/authorized”表述；历史 SEO_LOG 也有同类记录，但仓库内没有对应原始授权材料。PROJECT_BRIEF.md 与 public/games/README.md 已迁移为 UNKNOWN 口径。

### 作者候选不等于确权

IconGenerators 当前官方 [Square Face Icon Generator](https://www.icongenerators.net/square.html) 页面将作者标为 Eichi Zerona / えいちぜろな（@h071019）。但当前仓库没有证据证明本地 SWF 哈希就是该页面的特定历史文件，也没有证明作者或权利人允许本站托管和公开运行该二进制。因此：

- exact binary source：UNKNOWN
- author / rights holder for exact binary：UNKNOWN
- license：UNKNOWN
- commercial use：UNKNOWN
- public embed/performance：UNKNOWN
- attribution：UNKNOWN
- modification：UNKNOWN
- redistribution：UNKNOWN

IconGenerators 当前[官方条款](https://www.icongenerators.net/terms.html)还明确禁止未经书面许可复制、再发布、嵌入、frame、镜像、代理和热链站点资源。这只是风险信号，不能反向证明本地 SWF 的来源或历史许可。

### 需要补充的证据

1. 该 SHA-256 文件的原始来源 URL 或交付记录。
2. 权利人/有权许可方姓名与联系方式。
3. 书面授权、许可证或可存档官方条款。
4. 授权是否覆盖本站托管、Ruffle 公开运行、广告/商业场景、备份/CDN/R2、修改、署名和再分发。
5. 游戏生成图片的个人/商业用途范围。

## 4. Oval Face Icon Generator

### 已确认事实

- 本地文件：public/games/oval-face.swf
- SHA-256：80E974D8EF4AD5E849E93464EAEA1833620C269BAC30601D960F5438C285E09B
- git 首次引入：daeb291088cb65bf6860fdc24766919563fb7217，2026-05-26，提交说明 oval face 更新
- 当前公开 URL：https://mysquarefaceicon.com/oval-face-icon-generator
- 历史 SEO_LOG 曾称其为 authorized；当前 SEO_PLAN 与 public/games/README.md 已迁移为 UNKNOWN。没有原始来源 URL、作者、权利人、许可名称或书面证据。

当前所有权利字段保持：

- source URL：UNKNOWN
- author / developer：UNKNOWN
- rights holder：UNKNOWN
- license：UNKNOWN
- commercial use：UNKNOWN
- public embed/performance：UNKNOWN
- attribution：UNKNOWN
- modification：UNKNOWN
- redistribution：UNKNOWN

Oval 没有从 Square 的作者候选或当前官方条款继承任何许可结论。两个文件必须分别提供证据。

## 5. Pixel Art Avatar Icon Generator

### 可核验证据

- 官方工具：[Pixel Art Avatar Icon Generator](https://www.icongenerators.net/pixelavatar.html)
- 官方条款：[IconGenerators Terms of Use](https://www.icongenerators.net/terms.html)
- 官方页面标注作者：Eichi Zerona / えいちぜろな（@h071019）。
- 官方条款明确允许链接到单个生成器页面。
- 2026-08-31 的 HEAD 检查：页面返回 200，同时发送 X-Frame-Options: SAMEORIGIN 与 Content-Security-Policy: frame-ancestors 'self'。

### 权限结论

| 字段 | 结论 | 说明 |
|---|---|---|
| source | VERIFIED | 官方 URL 可访问 |
| author | VERIFIED | 官方页面署名 |
| license | RESTRICTED | 自定义条款，不是 MIT/CC 等开放许可证 |
| commercial use | RESTRICTED | 生成图片可用于个人线上活动；企业/营利组织制作品及通过图片获利被禁止 |
| embed | NO | 条款禁止，响应头也阻止第三方 frame |
| direct link | YES | 条款明确允许链接到单个生成器页面 |
| attribution | CONDITIONAL | 普通个人线上使用为鼓励；条款所列个人非商业印刷/视频/游戏用途要求注明来源并链接 |
| modification | YES_GENERATED_IMAGES_ONLY | 可修改生成图片，不代表可修改生成器、脚本、数据或素材 |
| redistribution | NO | 未经书面许可不得复制、再发布、热链或系统下载站点资源 |

当前项目页面只做来源清晰的直接出站链接，符合本次读取到的 direct-link 边界。后续不得重新加入 iframe、代理或本地复制，也不得把 Pixel 生成图片描述为商业可用。

## 6. LEGAL-001 审查时的公开文案风险（2026-08-31）

以下用户可见代码在 LEGAL-001 审查时含有未由 Registry 证实的 authorized 或相近权利表述；后续 Terms 局部修正状态见第 10 节：

- app/terms-of-service/page.tsx
- lib/locales.ts
- app/about-us/page.tsx 中的 provided for this project 表述
- 部分页面中的 original 表述；其中一些只是描述原有交互，仍需逐条区分是否暗示权利或来源

LEGAL-001 已同步修正 PROJECT_BRIEF、SEO_PLAN 和 public/games/README 的内部授权口径，但没有改动生产页面、Terms、播放器或 SWF。原因是移除/改写公开权利声明会影响用户可见内容，应作为明确的内容修复任务接受验收，不能在 Registry 任务中悄悄扩大范围。

在修复前，团队不得在新页面、schema、广告申请、合作材料或发布说明中继续复制这些未证实措辞。

## 7. 发布与扩展门禁

### 本地二进制

只有同时满足以下条件，才能把游戏状态从 UNKNOWN 改成 VERIFIED：

1. 证据能识别 exact file/hash 或明确覆盖该版本。
2. 提供方是权利人或有权许可方。
3. 授权覆盖实际交付方式：本站托管 + 浏览器公开运行。
4. 单独记录商业/广告、嵌入、署名、修改、CDN/备份和再分发范围。
5. 证据 URL、文件/截图路径、审查日期可复核。

### External Tool

- 默认 DIRECT_LINK_ONLY。
- 只有官方条款明确允许且浏览器安全头允许时，才考虑 iframe。
- “能 iframe”仍不等于有许可；条款与技术条件必须同时满足。
- 禁止绕过 X-Frame-Options、CSP、登录、地域或访问控制。

### 默认自动门禁

    license.status == UNKNOWN      -> 新游戏不得 publish
    commercialUse == UNKNOWN       -> 不得声明商业可用或进入商业扩展
    assetRedistribution == UNKNOWN -> 不得复制、迁移或打包资源
    external embedAllowed != YES   -> 只能 direct link

## 8. LEGAL-001 验收映射

- [x] Square 来源、作者/权利人、许可、商业、嵌入、署名、修改和证据状态已登记。
- [x] Oval 同字段已登记，未从 Square 推断。
- [x] Pixel external 的官方来源、作者、限制、direct-link 和 no-embed 边界已登记。
- [x] 无法确认的字段全部保持 UNKNOWN。
- [x] Registry 明确 UNKNOWN != allowed。
- [x] 两个 SWF 未被反编译、修改或重新分发。
- [x] 没有改生产页面、URL、index 状态或部署配置。

## 9. 回滚

本任务只新增 data/game-license-registry.json 与本文件，并更新治理日志/看板。退回时可以删除这两个新增文件并撤销相应日志与看板记录；不得因此恢复旧版 3%-5% SEO 口径，也不得删除已经通过用户验收的 AUDIT/BASE 证据。

## 10. TERMS-001 后续记录（2026-09-02，本地已验收 / 生产未验证）

用户已确认 TERMS-001 精确单页方案；本地 Terms 的 `Authorized Game File / authorized SWF` 和无条件个人用途授权句已按确认文案替换为“尚未核实权限、不授予第三方许可”的事实边界，并更新实际内容日期。仅两段正文、一个标题及日期改变；其它页面、Registry 与 SWF 均未更改，原始许可证据并未增加。

v1.43 的源码、构建 HTML 与代码/框架/平台构建检查通过，曾遇到的启动拦截记录保留。v1.44 在相同渠道启动成功后补齐原始 HTTP、20 页 SEO（0 must / 12 should）、桌面/手机视觉与链接/键盘检查。用户现已明确回复 `TERMS-001 验收通过`，任务为 `本地已验收 / 生产未验证 / 未部署`。本轮仅同步验收记录，未增加许可材料或重跑应用测试；原验证日期与证据保持。详见 `docs/quality/evidence/terms-001-rights-copy/README.md`。此验收不是法律意见、许可文件、继续托管或部署的批准。

Square/Oval 的 exact source、rights holder、hosting/public-run/redistribution/generated-output 权限仍为 UNKNOWN。`lib/locales.ts`、About 等文案候选需另行核对；生产 Terms 尚未部署修复，不宣称全站声明或实际许可问题已经解决。

## 11. ABOUT-001 已完成（2026-09-02，本地已验收 / 生产未验证）

TERMS-001 验收保持不变。用户明确确认 About 精确方案后，七处文字（两个 description、两个小标题、三段说明）已按 `docs/legal/about-rights-consistency-proposal.md` 写入；来源表述收窄到站点选编、样式示例、可用时的已审核投稿与尚未核实的文件/图片权利。没有认定素材抄袭，也不以选编、审核、文件可运行或文字验收证明授权。

历史 v1.47 源码/构建/HTTP、type/lint、canonical/11 回归、Next/OpenNext、20 页 SEO（0 must / 12 should）、robots 和 1280×900/390×844 Browser 的文字/链接/键盘/控制台检查通过；v1.48 验收治理未重跑这些检查。原 About 关键词 3 次、1 H1/5 H2/7 H3/16 段、8 个 href、两份 schema 与冻结源码保持；既有桌面卡片窄列列为非阻断视觉提醒。v1.46 预演证据保留原样，当前证据见 `docs/quality/evidence/about-001-rights-copy/README.md`。`lib/locales.ts` 的 authorized 字段仍为独立源码候选，不据此宣称生产文案已清理。

用户明确回复 `ABOUT-001 验收通过`，v1.48 记录 `已完成（本地已验收） / 生产未验证 / 未部署`。本轮仅同步验收，145 项当前源码/检查/配置哈希与 v1.47 一致，原验证日期、Registry、SWF 和 Terms/PF-01 验收证据保持；未重跑应用检查。没有新增许可材料，Square/Oval 实际授权仍 UNKNOWN。文本修正及验收不是法律意见、许可证或继续托管/部署的批准；等待用户下一步指示，不自动启动下一项或 MIG-SQUARE-001。

## 12. EDITORIAL-001（2026-09-02，本地已验收 / 生产未验证 / 未部署）

v1.49 历史：用户在 ABOUT-001 本地验收后要求下一项开发。当时 Editorial 第 55 行及旧构建含笼统创作/生成概括，仓库不能提供覆盖全部示例的来源证据；不等于已证明侵权。提出只修正三个 description、一个 H2 和一段正文，区分编辑标准、站点选编、样式示例、可用时投稿与尚未核实的权限。

v1.49 只有拟稿、只读 TSX/隔离 SSR 和治理记录，未修改应用、检查器或 package。预演与 145 项原哈希、About 验收证据见 docs/quality/evidence/editorial-001-rights-copy/proposal-checks.json；该历史证据保持原样，不作为本轮浏览器结果。

v1.50：用户明确确认方案，五处文字已按稿实施；1 H1/4 H2/3 H3/10 段、2 链接、1 schema 与 KW-02 句/3 次覆盖保持。源码/产物 14+15 负例、type/lint、canonical/11 回归、Next/OpenNext 与离线 robots/sitemap 通过。原 23 条验收、About/Terms/PF-01 和 proposal 原证据不变；未新增许可材料。

v1.50 历史记录：重建后的本地预览启动被运行策略拦截（执行前拒绝，3100 无监听），故 HTTP/完整 SEO/真实桌面手机/交互仍未验证。本项为 `实施完成 / 验证阻塞 / 未验收`；先由用户启动预览并补齐 QA，再请求 EDITORIAL-001 验收。执行证据见 docs/quality/evidence/editorial-001-rights-copy/README.md。Square/Oval 实际许可仍 UNKNOWN，Gallery/locale 候选独立保留；文字修正不授予许可或部署权限，不提交、推送、部署或启动下一项/MIG-SQUARE-001。

v1.51 启动重试：用户要求代为启动和验证，但同一渠道仍被策略在执行前拒绝，3100 无监听。应用/构建保持 v1.50，未新增许可材料，HTTP/SEO/浏览器仍未验证；EDITORIAL-001 继续验证阻塞、未验收，原 About/Terms/PF-01 验收不变。

v1.52：用户回复“已启动”后，本轮核实 PID 34860 的 `127.0.0.1:3100` Next 生产预览；build `nEfpi7bM0YNUT_HgxJ895` 与 146 项源码/检查/配置、现有产物保持 v1.50 不变。Editorial/About/Terms/robots/sitemap 五路 HTTP 200 与构建字节一致；18 项代码检查及 5 项目标运行时检查最终通过，完整本地 SEO 20 页、0 must / 12 should。Browser 1280×900 / 390×844 的精确文案、metadata/schema、非空/无覆盖层/无横向溢出、控制台、Contact/Back/首页和 Tab/Enter 均通过，6 张截图已审阅。

未改应用或重新运行 Next/OpenNext 构建；原 v1.50 构建/失败记录、v1.51 重试、7 份历史证据及 23 条验收保持。既有桌面窄卡为非阻断视觉提醒，实际许可 UNKNOWN、其它文案候选、12 should/KW-04 与生产门禁仍开放。看板 v1.52 仅推进到 `待验收`，等待 `EDITORIAL-001 验收通过`；未提交、推送、部署、运行 seo:prod 或启动下一项/MIG-SQUARE-001。 来源文字修正和页面验证均不等于原始授权材料、法律意见或继续托管批准；没有更新 Registry 的 UNKNOWN。证据见 `docs/quality/evidence/editorial-001-rights-copy/checks.json.runtimeValidationFollowUp`。

### v1.53 明确验收

2026-09-02（记录时间 `2026-09-02T10:24:29.697Z`），用户明确回复 `验收通过，请进行下一步开发`。v1.53 将 EDITORIAL-001 记录为 `已完成（本地已验收） / 生产未验证 / 未部署`，新增第 24 条源验收；原 23 条验收及 v1.50/v1.51/v1.52 的检查、失败、构建和截图日期保持。原 checks.json 逐字节保留，SHA-256 `72f7ff3be63a9e3b14a41a3f651a336c57f7d74d59785fb9173cd2af36117d52`；其 runtimeValidationFollowUp 的“待验收”仅代表 v1.52 历史时点，不撤销本次验收。

本轮仅记录验收并开启下一项方案；146 项应用/检查/配置与现有 Next/OpenNext 产物不变，没有重新执行 type/lint/测试/构建/HTTP/SEO/Browser/移动或性能检查，也不声称预览当前仍在运行。v1.52 的 20 页 0 must / 12 should 与本地浏览器结果保留原日期。实际许可 UNKNOWN、既有桌面窄卡提醒、12 should/KW-04 与生产门禁仍开放；没有提交、推送、部署、seo:prod 或 MIG-SQUARE-001。

## 13. GALLERY-001（2026-09-02，已完成 / 本地已验收 / 生产未验证）

v1.53 历史方案：按同一句下一步指令，仅开启 GALLERY-001 六处来源/权利文字方案，见 `docs/legal/gallery-rights-consistency-proposal.md` 与 `docs/quality/evidence/gallery-001-rights-copy/proposal-checks.json`。质量监管 skill 与 KW-13 要求先确认段落替换；等待 `确认 GALLERY-001 示例来源与权利声明修正方案`，不能把本次 Editorial 验收视为 Gallery 文案批准。

v1.53 历史只读结果：源码显示 /gallery 的 8 个样例由 CSS 节点绘制，社区部分独立读取 approved 投稿；rating/likes/sort 是真实功能，不按首页历史假热度问题删除。当前 metadata、CollectionPage 描述、eyebrow/lead 仍含 original 或无条件社区概括；六区拟稿区分样式插画与可用时的投稿，不把展示/审核视为作者或使用权证明。TSX/隔离 SSR 只验证候选结构，未修改应用，也未核实当前公开投稿数量或取得新许可材料。Registry 与 SWF 不变，lib/locales.ts authorized 保留独立后续。

历史 v1.54（记录 `2026-09-02T11:19:47.319Z`）：用户明确回复 `确认 GALLERY-001 示例来源与权利声明修正方案`，已按确认稿实施六处替换。20 项代码/回归、Next 42 路由及 OpenNext、4 页 built 检查、6 项 HTTP/robots/SEO 检查通过；6 路 HTTP 与产物一致，sitemap 20 唯一 URL、0 lastmod。完整本地 SEO 20 页、0 must / 12 should；Gallery 18 个源码与 20 个 HTML 反例被拒绝，4 种共享社区内存 SSR 状态通过。

Browser 1280×900 / 390×844：1 H1/4 H2/14 H3、19 页属段落 + 1 条真实初始社区空态段落、8 个 CSS 样例、4 条主链接和两份 schema 核对；12 条点击/跳转/Back 与 4 条 Tab/Enter 记录、44 项断言通过，8 张前后/全页/焦点截图已审阅。真实 latest/liked GET 均为 200、0 条；仅测试真实空态，其余状态为内存 SSR，无评论或点赞写入。

143 项原文件和 9 份旧 QA 证据未变，加本项检查器共 147 项源码/检查/配置；24 条既有验收保持，本轮不新增 GALLERY-001 成果验收。原有社区标题/副标题间距偏紧及 About/Editorial 窄卡提醒保留；12 should、KW-04、实际许可 UNKNOWN、独立 locale 文字及全部生产门禁仍开放。看板文件视觉未验证，保留既有访问限制且不绕行；未重测生产性能，未提交、推送、部署、seo:prod 或启动下一项/MIG-SQUARE-001。本项仅为 `待验收`，完整记录见 `docs/quality/evidence/gallery-001-rights-copy/README.md` 与 `checks.json`，等待 `GALLERY-001 验收通过`。

本次仅修正文案，没有取得原始许可材料；Registry 与 SWF 保持，Square/Oval 精确权限仍 UNKNOWN。该实现、验证或未来用户验收均不代表法律意见、版权转让或新的托管/运行/部署许可。

### v1.55 明确验收

2026-09-02T12:44:34.299Z，用户明确回复 `GALLERY-001 验收通过`。看板 v1.55 将本项记录为 `已完成（本地已验收） / 生产未验证 / 未部署`，新增第 25 条源验收；原 24 条验收及 v1.54 检查、构建、浏览器、截图和诊断日期均保留。

本轮只做验收治理：147 项源码/检查/配置及现有 Next/OpenNext 产物保持不变；原 checks.json 逐字节保留，SHA-256 `a41646b12dffdc099bc9c1a84cf10667f6efc1753b1db5be2c437e3695bd86af`。其中“待验收”和 userAcceptance=NOT_RECEIVED 仅代表 v1.54 历史时点，不撤销本次明确验收。未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动或性能，不重启预览，也不声称当前服务仍在运行。

v1.54 本地 SEO 20 页、0 must / 12 should 与桌面/手机结果保留原日期；社区空态与内存 fixture 的边界不变。原间距/窄卡提醒、实际许可 UNKNOWN、独立 locale 文字、KW-04/should 与全部生产门禁仍开放；看板文件视觉仍未验证，不绕行。等待用户下一步指示，不启动下一项/MIG-SQUARE-001，不提交、推送、部署或执行 seo:prod。

没有新增许可材料，也没有修改 Registry 或 SWF；本地文案验收不关闭 Square/Oval 精确来源及实际权限 UNKNOWN。

## 14. LOCALE-001（2026-09-02，方案待确认 / 未实施）

用户在 GALLERY-001 验收后要求下一步，v1.56 仅提出四处来源文案一致性方案。七个 noindex draft 侧栏仍把 Gallery 笼统写作玩家创作；另有未参与当前 HomePage 渲染的 authorized SWF、embedded Pixel、original Gallery 数据。旧构建根页/七语言 raw HTML 中三个遗留句均不存在，不把源码遗留当成当前可见声明，也不做全站无问题保证。

拟只改 lib/locales.ts 一句、components/HomePage.tsx 三句；精确原文/拟稿、共享范围及配套检查边界见 `docs/legal/locale-rights-consistency-proposal.md`。不改已验收 Gallery/Editorial/About/Terms 页面、Registry、SWF 或外部工具策略；不新增翻译、索引或 hreflang。

隔离 TSX/SSR 与旧构建快照通过，147 源文件和 13 历史证据、25 条验收保持；完整应用/新构建/HTTP/SEO/Browser/移动/性能本轮未重跑。等待 `确认 LOCALE-001 草稿语言页与遗留文案一致性修正方案`，不把预演当作已实施或已验收。

没有新增许可证据；Square/Oval 的精确来源、权利人、托管/公开运行/再分发/生成图片用途仍 UNKNOWN。拟稿、实现或用户本地验收不构成法律意见或授权。生产门禁保持不通过/未部署；不提交、推送、部署或启动 MIG-SQUARE-001。

## 15. LOCALE-001 实施与手机阻断（2026-09-02，v1.57）

2026-09-02 v1.57：已收到 `确认 LOCALE-001 草稿语言页与遗留文案一致性修正方案`，只实施两文件四处精确文字、一个 LOCALE 检查器、对应 npm/README 入口及 Gallery 检查器唯一 expectedLocalesHash 更新。37 项最终命令通过（22 代码/回归、2 构建、5 built、8 HTTP/SEO）；新 build `ynVDY6J1ddC0YHaNiUTtN` 生成 42 路由，14 路 HTTP 与产物字节一致，完整本地 SEO 20 页、0 must / 12 should，sitemap 20 唯一 URL。首页主体/metadata/schema 与布局、播放器保持；七个草稿仍 noindex/self-canonical/无 hreflang/不进 sitemap，未新增翻译。142 项原文件、14 份历史证据与 25 条验收保持。

Browser 在 1280×900 / 390×844 实测 `/es`、`/ar` 与首页：Gallery 点击/返回/Tab/Enter、首屏播放器 idle→ready（手机另观察到 loading）、无横向溢出及 7 组控制台检查通过；14 张前后/焦点/播放截图留档。但手机 Gallery 说明末尾 available. 被既有两行样式裁切：可见高 35px、内容高 53px，视觉不通过。先前通用 aside 误选隐藏设备提示，已通过精确 More Avatar Games 选择器纠正；真实侧栏在手机首屏下方显示。SSR/HTTP 通过不能替代换行检查；原测量、截图失败/CDP 超时与重试证据全部保留。

看板只设 `待验收` 并明确此手机阻断；未收到成果验收。候选 `Style examples; approved posts when available.` 仅是缩短同一句的修订建议，尚未确认、写入应用或验证换行；等待 `确认 LOCALE-001 手机文案缩短修订`，保留 CSS、其余三句及所有冻结边界，确认后重新构建和实测。实际许可 UNKNOWN、KW-04/12 should、旧间距/窄卡、生产版本/一跳/robots/SEO/CWV 门禁与看板文件视觉限制不关闭。未提交、推送、部署、执行 seo:prod 或启动下一项/MIG-SQUARE-001。

本轮完整记录：`docs/quality/evidence/locale-001-rights-copy/README.md`、`checks.json`；v1.56 proposal-checks.json 与已验收页原始证据不改写。回滚只逆向本轮四句、限定检查/npm 入口和治理增量，不覆盖其它脏工作区成果。

## 16. LOCALE-001 手机单句修订（2026-09-03，v1.58）

用户确认并要求继续实施后，仅将共享 Gallery 侧栏句缩短为 `Style examples; approved posts when available.`。样式示例与可用时的审核投稿边界保持；未改 Registry、SWF、其余三句或已验收 Gallery 页面。37 项命令与两个草稿的 1280/390/360px 完整显示通过，详情见 `docs/quality/evidence/locale-001-rights-copy/mobile-revision-checks.json`。v1.57 手机裁切失败与 15 份历史证据保持。

本项仍待用户验收；全部 25 条旧验收不变。没有新增任何许可材料，Square/Oval 精确来源、权利人及托管/公开运行/再分发/输出用途仍 UNKNOWN。本地修订和验收不构成法律意见或授权；未部署，全部生产门禁保留。

## 17. LOCALE-001 本地用户验收（2026-09-03，v1.59）

2026-09-03 用户明确回复 `LOCALE-001 验收通过`，涵盖原四处文案与 v1.58 手机短句修订。看板 v1.59 登记为本地已验收，原 25 条验收不变，现共 26 条；不启动下一任务。

本次仅确认本地文案成果，不增补、推定或授予任何许可；Registry 与 SWF 不变，Square/Oval 原始来源、权利人及各项用途权限仍 UNKNOWN。第 16 节待验收为原时点记录，v1.57/v1.58 原始 QA 不改写；发布继续不通过 / 未部署。证据：`docs/quality/evidence/locale-001-rights-copy/acceptance-checks.json`。

## 18. LICENSE-GATE 材料核对（2026-09-03，v1.60）

2026-09-03 用户要求在 LOCALE-001 验收后继续下一步。原 v1.59 验收及全部 26 条 SOURCE_ACCEPTANCE 保持，不重复新增。路线图下一项为 MIG-SQUARE-001，但此前“先部署累计成果，再继续迁移”的顺序尚未生产验收或被明确暂停；本轮只核对下一步的前置条件，未开启迁移方案或改应用。

两份本地 SWF 的 SHA-256 均与 Registry 相符；各自原始来源、权利人、许可文件和用途权限仍 UNKNOWN。仓库 261 个文件及指定项目知识库目录 2 个文件的限定文件名检索只命中现有 Registry，未发现新增候选许可材料；这不证明其它位置不存在授权。未反编译、提取、修改或分发 SWF。

质量监管 skill 保持 LICENSE-GATE 为 `已阻塞`、发布为 `不通过 / 未部署`。需要原始许可材料，或由用户明确暂停此次发布以先准备 MIG-SQUARE-001 本地方案；后者只改变工作顺序，不解除许可、KW-04/12 should、既有视觉或生产门禁。源码/检查/配置 148 项、历史证据 17 份、截图 27 张及 15 个产物保持。未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动/性能，未核实预览存活，未提交、推送、部署或迁移。

材料清单：`docs/archive/license-gate-cancelled-2026-09-03/swf-license-evidence-request.md`；本轮只读证据：`docs/archive/license-gate-cancelled-2026-09-03/checks.json`。仅有治理文档/看板增量可回滚，无线上回滚事项。
