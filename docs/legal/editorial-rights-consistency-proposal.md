# EDITORIAL-001 · 编辑政策来源与权利声明修正方案

状态：`已完成（本地已验收） / 生产未验证 / 未部署`。用户已明确验收；权威 HTML 看板 v1.53 记录第 24 条验收。原实施与验证证据保持，下一项仅为 GALLERY-001 待确认方案。

方案记录时间：`2026-09-02T08:05:39.594Z`（v1.49 历史）。2026-09-02 按确认稿实施；影响 URL：`/editorial-policy`。v1.50 实施/阻塞见第 8 节，v1.51 重试见第 9 节，v1.52 验证见第 10 节，当前验收见第 11 节。

## 1. 本项解决什么

- 方案阶段的 `app/editorial-policy/page.tsx:55` 笼统声称 Gallery 示例和视觉说明均为本站创作或由本站工具生成，当时的本地构建也含旧句；v1.50 已按本方案修正源码与新产物。仓库与现有来源登记不足以支撑原概括，不等于已证明素材侵权。
- 已验收的 About 明确区分站点选编、样式示例、可用时的审核投稿与未核实权限。编辑政策应与该边界一致：把“不复制”写成编辑标准，不把历史行为、来源或授权写成无证据的保证。
- 本项优先修正这段明确的概括及对应摘要；Gallery 的 original/community 表述和 `lib/locales.ts:101` 的 authorized 残留独立保留，不静默批量替换。当前 HomePage 使用自己的 `gameFeatures`，本轮定向检索未发现它读取 `content.features`；这不等于全站或生产文案已清理。

## 2. 单页布局、SEO、交互与冻结边界

| 项目 | 本次方案 |
|---|---|
| 主关键词 / 意图 | `editorial policy`；仍解释内容来源、编辑审核、纠错和社区审核规则，不改搜索意图 |
| 页面与首屏 | 沿用 Header → 返回链接/eyebrow/H1/lead → 4 个现有章节 → Footer；不增删节点、不重排、不改 CSS/卡片/首屏 |
| 精确编辑范围 | 仅 5 处：3 个 description 字符串、1 个 H2、1 段正文 |
| Metadata 例外 | 仅 `description`、`openGraph.description`、`twitter.description`；其它字段保持 |
| 标题 / 索引 | Title 与 H1 `Editorial Policy`、正式自引用 canonical、URL、robots/index、sitemap 均冻结 |
| 内容与 schema | 1 H1 / 4 H2 / 3 H3 / 10 段保持；1 份 WebPage JSON-LD 不变；AI 审核、多语言、质量规则、隐私/审核说明不改 |
| 已验收 KW-02 | 保留原句 `This editorial policy also requires corrections, source notes, and asset claims to remain traceable to the page where they appear.`；主内容精确短语仍为 3 次 |
| 链接与交互 | 仍为 `/#maker`（Back to the generator）与 `/contact`（contact page）；Header/Footer、Tab/Enter/返回行为不变 |
| 不在范围 | About、Terms、Gallery、首页/locale、Registry、SWF、播放器、依赖/lockfile、广告、发布与迁移均不改 |

## 3. 已确认并实施的五处精确文字

### 3.1 Metadata description（原第 10 行）

> Read the My Square Face Icon editorial policy for content sources, asset rights, AI-assisted drafts, moderation, corrections, and page quality standards.

153 字符；不是为长度而改写正文，目的是说明内容来源和权利边界。

### 3.2 Open Graph description（原第 19 行）

> How My Square Face Icon handles content sources, asset rights, AI-assisted drafts, corrections, and community moderation.

### 3.3 Twitter description（原第 26 行）

> Content sources, asset rights, AI-assisted drafts, moderation, and corrections at My Square Face Icon.

### 3.4 第一节 H2（原第 53 行）

> Editorial Policy for Content Sources and Asset Rights

### 3.5 第一节首段（原第 55 行，仍为同一个 p 节点）

> Editorial standards prohibit copying competitor text, screenshots, user comments, image packs, or downloadable assets. Homepage examples are site-curated; the gallery combines simple style examples with approved community submissions when available. Selection, moderation, or generation by a tool does not establish authorship or grant image-use rights. Claims about sources and permissions require evidence for the specific file or asset. Permissions for the Square and Oval game files and their generated images remain unverified.

原 AI 审核段中的 `originality` 是审核标准，本项保留；不做全文件 `original` 替换，不添加作者、官方、已授权或商业用途承诺。

## 4. v1.49 历史只读预演（不是 v1.50 的执行结果）

- TSX 解析/转译与隔离 React SSR：`通过`。Header/Footer 使用空 stub，仅验证此页主内容，不代表真实浏览器/完整 Next 渲染。
- 五处以外源码掩码完全一致；metadata 除三个 description 外不变；H1、其它 H2/H3、段落数量、两条链接、schema、KW-02 原句与 3 次覆盖均保持。
- 当前源码 SHA-256：`baf2318af979f8561c81d6b5ec08910d29c42034a09da1d59fe7fe98d468b84a`；内存拟稿：`c758e70ce143b58db1453877efcb6d82a9e89fd96d1bc473c73c6dcf4c81a529`；五区外掩码：`5fea48f4190b05b5cfbee10859a8db47e741d8acaac0f09e2f0cd323e99aefa6`。
- 145 项现有源码/检查/配置哈希与 v1.48 基线相同；About 的实现/验收证据及原 23 条验收保留，没有修改应用文件或启动新预览。
- 已有本地构建 `QAzQpeJrYWF2m8Ey8itpk` 的 Editorial 原始 HTML 仍有旧句。这里只读现有产物，不是新构建、HTTP、生产或浏览器验证。
- 原 v1.47 type/lint/回归/Next/OpenNext、20 页 SEO（0 must / 12 should）及浏览器结果保持原日期；本轮未重跑，也未重审 KW-04 或测量性能。

完整机器证据：[proposal-checks.json](../quality/evidence/editorial-001-rights-copy/proposal-checks.json)。

## 5. 实现与验收流程（方案已确认，本地验证已补齐）

适用规则：CT-03/04、TR-07/10、KW-01/02/05/13/16、META-01/02/05/06、IDX-01～07、LINK-08、PF-05、AY-03、OP-05/09/10/12；不以词频代替 KW-04。

1. 只替换上述五处，增加对应 source / built / HTTP 正负向回归；不得顺手改其它文案或扩展 metadata 例外。
2. 跑 type、零警告 lint、既有相关检查、Next 与 Cloudflare/OpenNext 等效构建；检查源码冻结区和所有既有验收证据。
3. 在 local production 核对原始 HTML、metadata/canonical/schema、robots/sitemap 和完整 SEO；实测 1280×900 / 390×844 的可见文案、换行/溢出、控制台、返回/Contact/首页与键盘流程。手机/真实浏览器结果单独记录。
4. 写入精确结果与未覆盖范围，更新同一看板到 `待验收`，再等待用户回复 `EDITORIAL-001 验收通过`。检查通过不代替用户验收。

## 6. v1.49 未解决项与方案回滚边界（本轮实施见第 8 节）

Square/Oval exact-file 来源、权利人及托管/公开运行/再分发/生成图片权限仍 UNKNOWN；本项不增加原始许可材料。Gallery/locale 候选、桌面窄卡提醒、12 should、KW-04、真实设备/现场 CWV/广告与生产门禁保持。看板本地文件的既有浏览器访问限制继续尊重；只做静态/JS/状态校验，桌面/手机看板视觉未验证。

全局发布仍 `不通过 / 未部署`；不提交、推送、运行 seo:prod 或启动 MIG-SQUARE-001。此方案阶段若退回，只更正/撤销本次治理增量，不回滚已验收页面、原证据或无关脏工作区改动；没有线上变更，不需要线上回滚。

v1.49 方案阶段仅新增/更新以下 8 份治理/方案文件；v1.50 的 13 份实现/治理文件另列于执行证据：

- `docs/legal/editorial-rights-consistency-proposal.md`
- `docs/quality/evidence/editorial-001-rights-copy/proposal-checks.json`
- `docs/legal/game-rights.md`
- `docs/quality/evidence/release-2026-09-02/README.md`
- `LAUNCH_CHECKLIST.md`
- `PAGE_PLAN.md`
- `SEO_LOG.md`
- `F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html`

方案与本地验收均已收到；v1.52 必需 QA 和 v1.53 验收分开保留。用户同时要求下一步，故仅开启 GALLERY-001 待确认方案，不直接改页或部署。

## 7. v1.49 历史方案治理校验

治理校验于 `2026-09-02T08:14:10.987Z` 通过：看板完整 JavaScript、静态/数据焦点、导出 1.49、精确拟稿/JSON、文档历史保留、空白及两仓库 `git diff --check` 均通过（exit 0）。23 条源验收、About/Terms/PF-01 六份证据、145 项源码/检查/配置、现有构建、CSS 与路线图保持；只追加 EDITORIAL 方案记录。Git 既有 LF→CRLF 提醒保留。真实页面/手机视觉、完整 type/lint/回归/Next/OpenNext/HTTP/SEO 本轮未执行；全局发布仍不通过，未部署。

v1.49 按 `website-quality-supervisor` 与 KW-13 的确认门禁停在方案阶段；本轮已收到该明确确认，执行情况如下。

## 8. v1.50 实施结果与验证阻塞

五处文字已逐字实施；源码 SHA-256 与预演稿一致（`c758e70ce143b58db1453877efcb6d82a9e89fd96d1bc473c73c6dcf4c81a529`）。新增 `scripts/check-editorial-rights.mjs` / `npm run editorial:check`，锁住五区以外源码与原始 HTML 的文字、节点/属性、Title/H1、两条链接、WebPage schema 和已验收 KW-02 句/3 次覆盖。14 个源码、15 个 HTML 反例被拒绝，旧源码红灯基线按预期 exit 1。

25 项最终源码/离线产物/构建命令均 exit 0，包括 type、全站和检查器零警告 lint、Editorial/About/Terms source/built、canonical、11 项既有回归、Next 42 routes、OpenNext Worker 与 patch、离线 sitemap/robots/哈希。新 build ID 为 `nEfpi7bM0YNUT_HgxJ895`。既有 GAME-TPL fetchPriority 与 OpenNext Windows 提醒保留。145 项基线中仅 Editorial、package、scripts/README 改动，其余 142 项不变；新增检查器另登记。23 条原验收及 7 份历史证据（含本方案 proposal-checks.json）保持原样。

本地旧预览 PID 30888 经端口和完整命令核对后停止用于重建；重建后相同 Start-Process 启动渠道被 `CreateProcess: blocked by policy` 拒绝，未执行。2026-09-02T08:37:17.6392001Z 只读复查 3100 无监听。未改换启动/浏览器渠道规避；Browser 可用但真实页面、1280×900/390×844、链接/Back/Tab/Enter、控制台、原始 HTTP 和完整 SEO 均未验证。临时视口已重置、空白 QA 页签已关闭；无本轮截图。此前 0 must / 12 should 是 v1.47 历史，不是本轮 SEO 结果。

请在项目终端运行 `npm run start -- -H 127.0.0.1 -p 3100`，启动后继续本地 HTTP、robots/sitemap、完整 SEO 与真实浏览器 QA。补齐通过后才更新为待验收，再请求用户验收；当前不是已完成或待验收。证据：[README](../quality/evidence/editorial-001-rights-copy/README.md)、[checks.json](../quality/evidence/editorial-001-rights-copy/checks.json)。许可 UNKNOWN、其它文案候选、KW-04、生产/CWV/广告等门禁保持；不提交、推送、部署或启动下一项/MIG-SQUARE-001。

## 9. v1.51 启动重试记录

用户要求代为启动并验证后，同一启动渠道仍在执行前被策略拒绝；2026-09-02T09:07:33.8207354Z，3100 无监听且无启动日志。146 项应用/检查/配置与 v1.50 build 产物保持，未修改代码或重建。HTTP/SEO/桌面手机验证依旧未执行；当前仍为验证阻塞而非待验收。详见执行证据的 runtimeRetryFollowUp；等待可用本地预览，不部署或进入下一项。

## 10. v1.52 运行时验证完成，等待验收

用户回复“已启动”后，本轮核实 PID 34860 的 `127.0.0.1:3100` Next 生产预览；build `nEfpi7bM0YNUT_HgxJ895` 与 146 项源码/检查/配置、现有产物保持 v1.50 不变。Editorial/About/Terms/robots/sitemap 五路 HTTP 200 与构建字节一致；18 项代码检查及 5 项目标运行时检查最终通过，完整本地 SEO 20 页、0 must / 12 should。Browser 1280×900 / 390×844 的精确文案、metadata/schema、非空/无覆盖层/无横向溢出、控制台、Contact/Back/首页和 Tab/Enter 均通过，6 张截图已审阅。

初始 robots 检查的重复 --base 参数导致抓取 3000 失败，原 exit 2 留档；改用 `node scripts/check-ai-crawler-policy.mjs --base http://127.0.0.1:3100` 后通过。没有修改应用或放宽检查。当前证据：[README](../quality/evidence/editorial-001-rights-copy/README.md) 与 [checks.json](../quality/evidence/editorial-001-rights-copy/checks.json) 的 runtimeValidationFollowUp。

未改应用或重新运行 Next/OpenNext 构建；原 v1.50 构建/失败记录、v1.51 重试、7 份历史证据及 23 条验收保持。既有桌面窄卡为非阻断视觉提醒，实际许可 UNKNOWN、其它文案候选、12 should/KW-04 与生产门禁仍开放。看板 v1.52 仅推进到 `待验收`，等待 `EDITORIAL-001 验收通过`；未提交、推送、部署、运行 seo:prod 或启动下一项/MIG-SQUARE-001。

## 11. v1.53 用户明确验收与下一项边界

2026-09-02（记录时间 `2026-09-02T10:24:29.697Z`），用户明确回复 `验收通过，请进行下一步开发`。v1.53 将 EDITORIAL-001 记录为 `已完成（本地已验收） / 生产未验证 / 未部署`，新增第 24 条源验收；原 23 条验收及 v1.50/v1.51/v1.52 的检查、失败、构建和截图日期保持。原 checks.json 逐字节保留，SHA-256 `72f7ff3be63a9e3b14a41a3f651a336c57f7d74d59785fb9173cd2af36117d52`；其 runtimeValidationFollowUp 的“待验收”仅代表 v1.52 历史时点，不撤销本次验收。

本轮仅记录验收并开启下一项方案；146 项应用/检查/配置与现有 Next/OpenNext 产物不变，没有重新执行 type/lint/测试/构建/HTTP/SEO/Browser/移动或性能检查，也不声称预览当前仍在运行。v1.52 的 20 页 0 must / 12 should 与本地浏览器结果保留原日期。实际许可 UNKNOWN、既有桌面窄卡提醒、12 should/KW-04 与生产门禁仍开放；没有提交、推送、部署、seo:prod 或 MIG-SQUARE-001。

按同一句下一步指令，仅开启 GALLERY-001 六处来源/权利文字方案，见 `docs/legal/gallery-rights-consistency-proposal.md` 与 `docs/quality/evidence/gallery-001-rights-copy/proposal-checks.json`。质量监管 skill 与 KW-13 要求先确认段落替换；等待 `确认 GALLERY-001 示例来源与权利声明修正方案`，不能把本次 Editorial 验收视为 Gallery 文案批准。
