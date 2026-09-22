# LOCALE-001 · 草稿语言页与遗留文案一致性修正方案

> 2026-09-03 · 看板 v1.59 · 原四处文案及手机单句修订已获用户本地验收；生产未验证，未部署。
> 下方第 1–7 节保留 v1.56–v1.58 方案、失败及修复记录（含当时待验收状态）；当前验收见第 8 节。
> 本项依据用户“请进行下一步开发”开启；GALLERY-001 和全部 25 条既有验收不变。

## 1. 核实结果与范围

本项只处理两类来源口径不一致：

- 可见：HomePage 的 legacyLocaleSidebarItems 在七个草稿语言页中，把 Gallery 无条件概括为玩家创作；但已验收 Gallery 包含 8 个 CSS 样式示例和“可用时”的审核通过投稿。
- 非当前可见：lib/locales.ts 的 englishFeatures 含 authorized SWF；HomePage 的 relatedCards 含 embedded Pixel / original Gallery。当前 HomePage 使用另一组 gameFeatures，relatedCards 没有渲染引用。它们是遗留数据风险，不冒称现有页面出现三个可见问题。

既有构建 Vyf3tcN5LOfwDiSXRH6xO 的 `/` 和七个 draft HTML 已只读核对：三个遗留句在这些原始 HTML 中均为 0 次；旧 Gallery 侧栏句每个 draft 原始 HTML 有 2 次（含序列化副本），可见部分 1 次，首页 0 次。此结果不是生产探测、客户端全部 JS 包审计或新构建。

## 2. 四处精确替换

### 1. lib/locales.ts · englishFeatures[2].text

- 原文：The main tool keeps the familiar Flash avatar maker interaction by running the authorized SWF through Ruffle.
- 拟改：The main tool runs a project-provided SWF through Ruffle. Source and usage permissions require separate verification.
- 范围：当前未使用的数据字段；不删除数组、类型或其它字段。

### 2. components/HomePage.tsx · legacyLocaleSidebarItems[4].text

- 原文：Explore square face icons created by players.
- 拟改：Browse style examples and approved submissions when available.
- 范围：共用侧栏的一条 small 文本；七个现有 draft URL，不影响首页。

### 3. components/HomePage.tsx · relatedCards[3].text

- 原文：Use an embedded external chibi pixel avatar maker with source credit.
- 拟改：Open the Pixel tool details page for a link to the external provider.
- 范围：当前未使用的数据字段；不删除数组、类型或其它字段。

### 4. components/HomePage.tsx · relatedCards[4].text

- 原文：Browse original square face icon ideas for colors, expressions, and profile crops.
- 拟改：Browse simple square face style illustrations and approved submissions when available.
- 范围：当前未使用的数据字段；不删除数组、类型或其它字段。

## 3. 单页布局、SEO 与交互提案

以 `/es` 为代表页：保留现有 Header → 首屏游戏区和侧栏 → Curated Icon Ideas → 说明/Features/步骤/Tips/FAQ → CTA/Footer。只更换侧栏 Gallery 卡片的说明；标题、图片、alt、href、顺序和 CSS 不动。

共享范围明确包括 `/es`、`/vi`、`/ja`、`/th`、`/ar`、`/ru`、`/id`；这些已有页面使用同一数据行，不复制生成七份页面。先预演 `/es`，再校验其余共享输出；`/ar` 保留 rtl，其余 ltr。没有新增页面、翻译或人工本地化通过声明。

| 项 | 冻结边界 |
|---|---|
| 意图与关键词 | 保持 `/` 的 square face generator 主意图；不补词、不改首页主词覆盖；草稿不发布本地语言关键词/语义覆盖结论 |
| 索引 | 七个 draft 保持 noindex, follow、自引用正式域 canonical、sitemap 排除、无 hreflang；reviewedLocaleCodes 只有 en |
| metadata / schema | 不改 Title/description/H1/OG/Twitter/canonical；三份原有 JSON-LD 完整保持 |
| 布局与内链 | 侧栏 Gallery href 仍为 /gallery；其余链接、图片、类名、模块顺序和可访问名称保持 |
| 播放器与社区 | 不改 FlashGenerator/HomeHero/GamePlayer、Ruffle/WASM/SWF click-to-load、API、评论/点赞/审核或真实社区数据 |
| 已验收页面与权利 | 不改 Gallery/Editorial/About/Terms 页面、Registry、SWF；UNKNOWN 不转为 VERIFIED |

## 4. 质量监管与实施后的检查

本轮内存 TSX/SSR 使用真实 HomePage、GameSidebar、locale/metadata/game 数据模块及实际 Next Image。FlashGenerator、HomeHero、HomeDiscoveryRegion、HomeResourceLinks、CuratedGalleryPreview、InstallPrompt 是明确隔离桩，其 props 被保留并比对；因此不覆盖客户端交互、水合、CSS 换行或完整页面视觉。

预演结果：en 输出逐字节相同；每个 draft 只变化目标侧栏句，剩余 HTML、三份 schema 和 metadata 逐字节/结构保持；八个 locale 对象除 features[2].text 外不变。147 项源码/检查/配置、13 份旧证据与当前构建/截图没有改动。详见 proposal-checks.json。临时报告脚本曾发生变量名错误，已修正并同命令 exit 0；记录保留，不属于应用错误。

用户确认后，允许的配套工程范围仅为：增加 LOCALE-001 精确文字/冻结区/八语言 SSR、built/HTTP 和反例检查；package.json/scripts README 的对应脚本入口；更新 Gallery 检查器中唯一 expectedLocalesHash 为经验证的新 locale 哈希。它当前锁定旧完整文件，不能直接跳过、删除断言或任意重置基线；其它 Gallery 检查和原 QA 证据不改。

实施后执行：

1. 四区源码/反例检查，保证旧断言不能回流；验证其它 locale 字段、默认 en、RTL 和 draft 索引不变。
2. Gallery、Editorial、About、Terms 与已有 game/player/routes/components/metadata/home/hero/discovery/gallery/performance/template、canonical 回归；完整 type-check、零错误 lint、Next 和 Cloudflare/OpenNext 构建。
3. 新 production preview 上的 raw HTML/metadata/schema/robots/sitemap 与 20 页完整 SEO；显式唯一 `http://127.0.0.1:3100` base，避免 npm 脚本叠加第二个 base。
4. Browser `/es` + `/ar` 在桌面 1280×900/手机 390×844 的换行、无横向溢出、控制台、Gallery/Back/Tab/Enter；首页与播放器 click-to-load 代表回归，按改动风险记录证据。实际 SWF 内容不改写、不反编译。
5. 更新同一权威看板到“待验收”，等待用户明确验收后再讨论下一项。任何失败、跳过或策略限制均单列，不替代为通过。

## 5. 本轮状态、边界与回滚

- 通过：方案精确区域/隔离 SSR/旧构建快照/源码与历史证据保持检查。
- 未验证：本轮 full type/lint/现有回归、Next/OpenNext 新构建、HTTP/SEO、Browser/移动端、实际预览存活；没有新性能结果。
- 发布不通过：原始 Square/Oval 权利 UNKNOWN、生产版本对应、一跳跳转、robots/SEO/CWV 及其它既有门禁未关闭。12 should、KW-04 和原间距/窄卡提醒保留原日期；不是本轮复测。
- 看板文件视觉保留既有访问限制，未绕行；只做静态 JS/数据/导出/验收保真检查。
- 当前只增补方案与治理文档，无应用或线上回滚。若拒绝方案，退回本轮文档/看板增量即可，不覆盖脏工作区或旧证据；未来实现回滚只逆向四句及其配套检查增量，不 reset 已有成果。

确认口令：`确认 LOCALE-001 草稿语言页与遗留文案一致性修正方案`。

方案确认不代表原始许可、法律意见、生产部署批准或本项成果验收。

## 6. v1.57 实施结果与待确认的手机修订

2026-09-02 v1.57：已收到 `确认 LOCALE-001 草稿语言页与遗留文案一致性修正方案`，只实施两文件四处精确文字、一个 LOCALE 检查器、对应 npm/README 入口及 Gallery 检查器唯一 expectedLocalesHash 更新。37 项最终命令通过（22 代码/回归、2 构建、5 built、8 HTTP/SEO）；新 build `ynVDY6J1ddC0YHaNiUTtN` 生成 42 路由，14 路 HTTP 与产物字节一致，完整本地 SEO 20 页、0 must / 12 should，sitemap 20 唯一 URL。首页主体/metadata/schema 与布局、播放器保持；七个草稿仍 noindex/self-canonical/无 hreflang/不进 sitemap，未新增翻译。142 项原文件、14 份历史证据与 25 条验收保持。

Browser 在 1280×900 / 390×844 实测 `/es`、`/ar` 与首页：Gallery 点击/返回/Tab/Enter、首屏播放器 idle→ready（手机另观察到 loading）、无横向溢出及 7 组控制台检查通过；14 张前后/焦点/播放截图留档。但手机 Gallery 说明末尾 available. 被既有两行样式裁切：可见高 35px、内容高 53px，视觉不通过。先前通用 aside 误选隐藏设备提示，已通过精确 More Avatar Games 选择器纠正；真实侧栏在手机首屏下方显示。SSR/HTTP 通过不能替代换行检查；原测量、截图失败/CDP 超时与重试证据全部保留。

### 单句缩短提案（尚未确认或实施）

- 当前已确认/已实施：`Browse style examples and approved submissions when available.`
- 拟缩短为：`Style examples; approved posts when available.`
- 原因：390px 的真实 Gallery 卡片只显示两行，当前句子需要三行，末尾条件被截断；不是侧栏隐藏，也不是来源权利已得到核实。
- 范围：只更新同一共享可见字段和它的精确检查期望；不改 CSS/布局、标题/链接、其它三句、首页、metadata/index、播放器或已验收 Gallery 页面。
- 短句目前没有真实渲染证据；不能预先承诺适配通过。确认后重新验证 source/built/HTTP、/es 与 /ar 390px 完整显示、桌面与 Gallery/Back/Tab/Enter，再停在待验收。

看板只设 `待验收` 并明确此手机阻断；未收到成果验收。候选 `Style examples; approved posts when available.` 仅是缩短同一句的修订建议，尚未确认、写入应用或验证换行；等待 `确认 LOCALE-001 手机文案缩短修订`，保留 CSS、其余三句及所有冻结边界，确认后重新构建和实测。实际许可 UNKNOWN、KW-04/12 should、旧间距/窄卡、生产版本/一跳/robots/SEO/CWV 门禁与看板文件视觉限制不关闭。未提交、推送、部署、执行 seo:prod 或启动下一项/MIG-SQUARE-001。

本轮完整记录：`docs/quality/evidence/locale-001-rights-copy/README.md`、`checks.json`；v1.56 proposal-checks.json 与已验收页原始证据不改写。回滚只逆向本轮四句、限定检查/npm 入口和治理增量，不覆盖其它脏工作区成果。

## 7. v1.58 · 手机单句修订结果（待用户验收）

2026-09-03 v1.58：用户“确认”批准手机单句缩短，并要求“继续实施”。共享 Gallery 说明现为 `Style examples; approved posts when available.`；只改该字段、精确检查期望和检查说明，不改 CSS/布局、其余三句、首页、播放器或已验收页面。7 个草稿继续 noindex/follow、自引用 canonical、无 hreflang、不进入 sitemap。

37 项本地命令通过（22 代码/回归、2 构建、5 built、8 HTTP/SEO）；19 源码 / 116 HTML / 4 sitemap 反例均被拒绝。最终 build `Y8uf2WKGr_E9Pn2mjsax-`，42 路由，14 路 HTTP/产物一致；SEO 20 页、0 must / 12 should。Browser `/es`、`/ar` 的 1280×900、390×844、360×800 全文可见；手机文本高由 53px 降至 35px，与原可见高 35px 一致。14 条交互、7 组空错误/警告日志、9 张新截图；首页桌面 idle→ready 回归通过，不是新 CWV 测量。

本项仅 `待验收`，等待 `LOCALE-001 验收通过`。145 项原源码/配置、15 份历史证据、25 条验收保持，v1.57 裁切失败未改写。原始权限 UNKNOWN、KW-04/12 should、旧间距/窄卡、生产版本/一跳/robots/SEO/CWV 门禁和看板文件视觉限制保留。未提交、推送、部署或开始下一项。证据：`docs/quality/evidence/locale-001-rights-copy/mobile-revision-checks.json`。

本次“确认”只批准单句缩短，不是 LOCALE-001 成果验收。回滚仅涉及此句、对应精确检查/说明和 v1.58 治理增量；恢复长句会恢复已知裁切，不撤销原四句方案或其它成果。

## 8. v1.59 · 用户本地验收通过

2026-09-03 用户明确回复 `LOCALE-001 验收通过`，涵盖原四处文案与 v1.58 手机短句修订。看板 v1.59 登记为本地已验收，原 25 条验收不变，现共 26 条；不启动下一任务。

本轮仅验收治理：148 项源码/检查/配置、16 份历史证据、27 张截图和 15 个构建产物保持；未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动或性能检查，未核实预览存活。v1.57 失败及 v1.58 通过（含当时待验收字段）保留原记录。实际许可 UNKNOWN、KW-04/12 should、既有视觉提醒和生产版本/一跳/robots/SEO/CWV 门禁不关闭；未提交、推送、部署、seo:prod 或迁移。

验收与只读核对证据：`docs/quality/evidence/locale-001-rights-copy/acceptance-checks.json`。等待用户下一步指示；如需撤销此次治理更新，仅逆向 v1.59 文档/看板增量，不撤销应用实现或覆盖其它工作区改动。
