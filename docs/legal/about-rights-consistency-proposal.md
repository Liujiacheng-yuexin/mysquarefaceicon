# ABOUT-001 · About 权利与示例来源声明修正方案

状态：`已完成（本地已验收） / 生产未验证 / 未部署`。用户在确认方案、完成 v1.47 实施与验证后，明确回复 `ABOUT-001 验收通过`。验收仅覆盖七处本地文案修正与既有 QA，不代表实际授权或生产通过。

方案原记录时间：`2026-09-02T06:16:20.455Z`；实现与验证原归档：`2026-09-02T07:00:24Z`；验收记录：`2026-09-02T07:50:25Z`。v1.46 预演和 v1.47 实施/QA 均保留原日期；[实现与验收证据](../quality/evidence/about-001-rights-copy/README.md) 区分历史验证与本轮验收治理。权威状态以 Liu-library HTML 看板 v1.48 为准，本文件不是第二份任务状态表。

## 当前本地验收 · v1.48

本轮只记录用户明确验收，未修改应用、检查器、package、构建产物或预览进程，未重跑 type/lint/回归/Next/OpenNext/HTTP/SEO/browser/移动/性能检查。145 项源码/检查/配置哈希保持；原 22 条验收与 Terms/PF-01 历史证据保留，ABOUT-001 新增为第 23 条验收。既有桌面窄列换行仍为非阻断视觉提醒，实际许可 UNKNOWN 与生产门禁未关闭。等待用户下一步指示，不启动下一项、迁移或部署。

## 已实施与验证 · 历史 v1.47

七处确认文字已写入；`site's` 在 JSX 中使用 `site&apos;s`，渲染后逐字不变。除两个已确认 description 外，Title/H1、canonical/index、OG、其它 Twitter、两份 schema、布局/类名、8 个 href、KW-02 句与 3 次覆盖全部保持。Terms、Registry、SWF 和播放器没有修改。

源码/构建/HTTP 的 About 14+6 负例、Terms 6+2 回归、type、零警告 lint、canonical、11 组既有检查、Next 42 routes 与 Cloudflare/OpenNext 均通过。20 页本地 SEO 仍为 0 must / 12 should，robots/sitemap 与产物相同。Browser 1280×900 / 390×844 正文、metadata/schema、无溢出/错误、Terms/Gallery/返回/首页及 Tab/Enter 通过；8 张截图已检查。

视觉为 `有条件通过`：原有桌面卡片列宽偏窄，较长说明换行较多；没有文字裁切，CSS/布局按方案冻结，列为非阻断优化提醒。首轮撇号 lint 和检查器误选 Header 链接的负例问题均已修正，失败及复测记录留在 `checks.json`。v1.46 `proposal-checks.json` 未改写。

v1.47 本地预览：[About](http://127.0.0.1:3100/about-us)（本轮未重新确认存活）。当时等待验收，现已在 v1.48 记录用户明确的 `ABOUT-001 验收通过`。实际许可 UNKNOWN、其它声明候选、12 should 与生产门禁仍开放，发布 `不通过 / 未部署`，不启动迁移。看板仅做静态/JS/状态校验，既有浏览器文件限制下的看板视觉仍未验证。

## 1. 为什么选择这一项

- TERMS-001 已本地验收，不能重复打开其验收门，也不能把文字修复当成实际许可证据。
- About 的现有第三张卡片称示例为本站创作且未复制，`Originality and Rights` 段落使用 `provided for this project`。现有仓库记录不能支撑覆盖这些素材的来源/原创性保证；这不等于已证明存在抄袭，而是应将公开表述收窄到可核验事实。
- About 的 description、Twitter description 和 Gallery 入口还保留宽泛的 `original` 表述。本项一次对齐同一页面上的七处文字，避免正文已收窄而摘要或卡片仍作来源暗示。
- 当前首页使用 `data/curated-icon-ideas.ts` 的站点选编静态示例；`app/gallery/page.tsx` 同时包含简单样式示例和已审核投稿区域。因此不能把首页选编图、Gallery 内置样式图、审核后的用户投稿混为同一种来源。
- `lib/locales.ts:101` 仍有 `authorized SWF` 数据文字；本轮字段引用查找未发现页面组件消费该 `features` 字段。它保留为独立源码风险，不凭这一查找断言生产渲染已无该词，也不扩大为多语言批量改写。

依据：`SEO_RULES.md` 第 6 节、`data/game-license-registry.json`、`docs/legal/game-rights.md`、已验收的 Terms 实现及上述当前页面/组件源码。没有取得新的外部许可材料；不提供法律结论。

## 2. 页面、布局、SEO 与交互边界

| 项目 | 本次边界 |
|---|---|
| URL / 搜索意图 | `/about-us`；了解站点、所提供的工具/内容、隐私与权利边界，不改变信任页意图 |
| 主关键词 | `about My Square Face Icon`；保留已验收 KW-02 句，隔离主内容计数保持 3 |
| Title / H1 | 均保持 `About My Square Face Icon` |
| 首屏和布局 | 保留 SiteHeader、返回链接、eyebrow、H1、lead、现有 CSS 类与模块顺序；不添加模块、图片或按钮 |
| 模块顺序 | Why This Site Exists → What We Provide → 权利说明 → Privacy and Community → Next Product Direction；仅两处 H2/H3 文本变化 |
| Metadata | 仅 description 和 Twitter description 改为下方精确文字；Open Graph 全部字段、Twitter 其它字段、title、canonical 均不变 |
| 索引与 schema | 不改 index/noindex、robots、sitemap、URL 或重定向；原有 AboutPage 与 BreadcrumbList JSON 保持 |
| 交互 | 保留主内容全部 8 个 href 及顺序：`/#maker`、`/privacy-policy`、`/terms-of-service`、`/editorial-policy`、`/#maker`、`/free-avatar-maker`、`/gallery`、`/contact`；保留原生链接/焦点 |
| 日期 | About 当前没有独立内容更新日期字段，本项不新增或刷新日期/schema 日期 |

## 3. 已确认的精确文案

以下七处确认文字现已写入 `app/about-us/page.tsx`；权利段的撇号仅作 JSX 实体转义。其余源码保持。

### 3.1 Metadata description（原第 10 行）

> Learn about My Square Face Icon, its browser-based avatar tools, curated examples, community gallery, privacy practices, and unverified game-file rights.

当前为 146 字符，拟稿为 153 字符；这是文案预演，不据此关闭现有 SEO should 提醒。

### 3.2 Twitter description（原第 26 行）

> Learn how My Square Face Icon handles avatar tools, curated examples, community submissions, privacy, and unverified game-file rights.

### 3.3 What We Provide 第三张卡片（原第 104–105 行）

H3：`Avatar inspiration`

> The homepage shows site-curated icon examples. The gallery includes simple style examples and approved community submissions when available. Selection or moderation does not establish authorship or grant image-use permissions.

### 3.4 权利说明小节（原第 111、113 行）

H2：`Game Files and Image Rights`

> Square and Oval run third-party Flash (SWF) files through Ruffle. We have not verified the original source, rights holder, or permissions for the exact files used here, including hosting, public use, redistribution, and use of generated images. The site's availability and examples do not establish authorization or grant third-party rights.

该段只陈述“尚未核实”，不宣布违法或已获许可；不借 Terms 验收、文件可运行、选编或投稿审核作授权背书。

### 3.5 Next Product Direction 的 Gallery 入口说明（原第 144 行）

> Browse style ideas and approved community submissions when available.

保留入口标题 `Browse the gallery` 和 `/gallery` 链接。`when available` 不虚构当前已有用户投稿或数量。

## 4. v1.46 历史源码预演（非本轮实现结果）

| 检查 | 结果及范围 |
|---|---|
| 七处旧文字定位与拟替换 | 通过；每处旧文字唯一出现，只在内存中替换 |
| TSX 语法与隔离 SSR | 通过；使用当前 TypeScript/React，Header/Footer 以空组件替身隔离；不是整项目 type-check、真实页面或浏览器验证 |
| 结构与关键词 | 原/拟稿均为 1 H1、5 H2、7 H3、16 段正文、主内容关键短语 3 次；已验收 KW-02 句保持 |
| Metadata、schema、链接 | 除明确的两个 description 外 metadata 不变；两份 JSON-LD 和全部 8 个 href 顺序保持 |
| 七区之外的源码 | 掩码 hash 一致：`1fa66ad37bc918b8f99b2fd907e8b2c0e32db8435d71a6c1badca8c3cf689e27` |
| 当前应用边界 | 107 个源码/检查/配置路径与 v1.44 证据 hash 一致；本轮未写入应用代码 |

v1.46 原 About SHA-256：`7306e479af68c8035283da556f9cec215028d9afcd2b066141663829dede7198`；内存拟稿 SHA-256：`aa3d12179b517b6ca01fe7147fc5e5dafe11ba316cca981811f6b2600c07bedb`。本轮已实现源码因 JSX 转义的 SHA-256 为 `bd812baed9b69e531d369be6e0be168dc5232d3729def0d7f5a747fbccbf1779`；七区外掩码仍相同。原/拟文历史、metadata、结构、href 与基线见未改写的 `docs/quality/evidence/about-001-rights-copy/proposal-checks.json`，当前实现与复测见同目录 `checks.json`。

本轮没有运行整项目 type/lint/回归、Next/OpenNext 构建、HTTP/robots/SEO、桌面/手机浏览器或性能测量。此前 TERMS-001 的结果仍属原日期证据，不冒充 ABOUT-001 实现验证。看板本地文件的既有浏览器策略限制继续尊重，桌面/手机看板视觉仍为未验证。

## 5. 已确认的实现与验收流程（历史）

适用规则：CT-03/04、TR-07/10、KW-01/02/13/16、META-01/02/05/06、IDX-01～07、LINK-08、PF-05、AY-03、OP-05/09/10/12。KW-04 语义/SERP 覆盖未在此次文字一致性拟稿中重审，不用短语计数替代。

1. 只替换第 3 节七处文本。保留 import、组件、CSS、其它正文、KW-02 句、隐私承诺与交互；不修改已经验收的 Terms。
2. 增加局部回归检查器（拟为 `scripts/check-about-rights.mjs`、package 命令及脚本说明），验证精确文字、冻结区、metadata 两个例外、schema/链接与错误旧文案负例；不自动插入关键词。
3. 运行有超时和退出码的 type、零警告 lint、相关回归、Terms 回归、Next 与 Cloudflare/OpenNext 等效构建。
4. 在本地 production 验证 About HTTP/metadata/schema/canonical、20 页完整 SEO 与 robots；检查 1280×900 和 390×844 的换行/溢出/控制台、Terms/Gallery/返回/首页跳转及键盘焦点。移动与真实 browser 结果单独记录。
5. 同步本方案、证据、PAGE_PLAN、LAUNCH_CHECKLIST、SEO_LOG、法律后续与权威 HTML 看板；实现验证全部具备后只进入 `待验收`，等待 `ABOUT-001 验收通过`。

## 6. 未解决项、部署与回滚

- Square/Oval 的确切来源、权利人、托管/公开运行/再分发/生成图片权限仍为 UNKNOWN；需要能对应具体文件的原始来源、许可证或书面授权材料。本次不改 Registry，也不提取、修改或重新分发 SWF。
- `lib/locales.ts` 的遗留字段、其它页面的来源/原创表述、实际素材许可、12 should、KW-04、真实设备/现场 CWV 与生产发布门禁均独立保留；不宣称全站清理完成。
- 不启动 MIG-SQUARE-001。用户先前要求的累计部署仍被 P0 门禁阻断；本轮不 commit、push、部署或执行 `seo:prod`，没有新的生产 SHA/版本，也无需线上回滚。
- 若用户要求回退，仅撤销本轮七处页面文字、about 检查器/package 命令和相关治理增量；不动 TERMS-001 与其它既有验收或无关工作区改动。恢复无证据措辞会重新打开内容阻断，禁止重置脏工作区。

## 7. v1.46 历史治理校验与交付

治理校验于 `2026-09-02T06:24:24.139Z` 通过：看板完整 JavaScript、静态/数据焦点、导出版本 1.46、精确拟稿/JSON、空白与两个仓库 `git diff --check` 均 exit 0；22 条既有验收（含 TERMS-001）、PF-01 证据、CSS/路线图数据保持，107 个源码/检查/配置路径不变，ABOUT 尚未被确认、实现或验收。Git 原有 LF→CRLF 警告保留，不作为失败或悄悄隐藏。

本轮变更仅 8 份治理/方案文件：本方案、`docs/quality/evidence/about-001-rights-copy/proposal-checks.json`、`docs/legal/game-rights.md`、`docs/quality/evidence/release-2026-09-02/README.md`、`LAUNCH_CHECKLIST.md`、`PAGE_PLAN.md`、`SEO_LOG.md` 和权威 `mysquarefaceicon_rebuild_dashboard.html`。应用/测试实现与生产未变。

结论：方案源码与治理校验 `通过`；ABOUT-001 实现、真实桌面/移动视觉、完整 type/lint/测试/Next/Cloudflare 构建、SEO/性能为 `未验证（未实施或未复跑）`；全局发布仍 `不通过 / 未部署`。

v1.48 更新：用户已明确回复 `ABOUT-001 验收通过`，本地验收已记录；本轮仅同步治理，不把原 v1.47 QA 改写为新测试。完成范围见本文顶部与证据，等待用户下一步指示；未部署或进入下一项。
