# LOCALE-001 · 本地验收记录（v1.59）

> 2026-09-03（Asia/Shanghai）· 用户本地验收通过；原 SEO 有条件通过；生产未验证 / 未部署。

2026-09-03 用户明确回复 `LOCALE-001 验收通过`，涵盖原四处文案与 v1.58 手机短句修订。看板 v1.59 登记为本地已验收，原 25 条验收不变，现共 26 条；不启动下一任务。

登记时间（UTC）：`2026-09-03T00:14:44Z`。本地成果范围为原四句中的三个遗留数据字段，加七个草稿共用的 Gallery 说明最终短句 `Style examples; approved posts when available.`；没有新增翻译、公开多语言索引或许可授权。

本轮仅验收治理：148 项源码/检查/配置、16 份历史证据、27 张截图和 15 个构建产物保持；未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动或性能检查，未核实预览存活。v1.57 失败及 v1.58 通过（含当时待验收字段）保留原记录。实际许可 UNKNOWN、KW-04/12 should、既有视觉提醒和生产版本/一跳/robots/SEO/CWV 门禁不关闭；未提交、推送、部署、seo:prod 或迁移。

原始证据继续使用 `checks.json`（v1.57 手机裁切失败）和 `mobile-revision-checks.json`（v1.58 限定功能/视觉通过）；其中 `userAcceptanceReceived: false` 和 `待验收` 仅代表原时点。新的 `acceptance-checks.json` 单列当前用户验收与治理核对，不更改原 QA 时间或把旧测量称为本轮重测。看板当前发布预检也已同步本地验收，旧预检文本另存为历史。

验收与只读核对证据：`docs/quality/evidence/locale-001-rights-copy/acceptance-checks.json`。等待用户下一步指示；如需撤销此次治理更新，仅逆向 v1.59 文档/看板增量，不撤销应用实现或覆盖其它工作区改动。

---

以下完整保留 v1.58 实施与 QA 原文，所有“待验收”仅代表当时状态，不覆盖上方 v1.59 验收结论。

# LOCALE-001 · 手机短句修订验收记录（v1.58）

> 2026-09-03（Asia/Shanghai）· 本轮本地功能/视觉通过；SEO 有条件通过；**待用户验收，未部署**。

2026-09-03 v1.58：用户“确认”批准手机单句缩短，并要求“继续实施”。共享 Gallery 说明现为 `Style examples; approved posts when available.`；只改该字段、精确检查期望和检查说明，不改 CSS/布局、其余三句、首页、播放器或已验收页面。7 个草稿继续 noindex/follow、自引用 canonical、无 hreflang、不进入 sitemap。

37 项本地命令通过（22 代码/回归、2 构建、5 built、8 HTTP/SEO）；19 源码 / 116 HTML / 4 sitemap 反例均被拒绝。最终 build `Y8uf2WKGr_E9Pn2mjsax-`，42 路由，14 路 HTTP/产物一致；SEO 20 页、0 must / 12 should。Browser `/es`、`/ar` 的 1280×900、390×844、360×800 全文可见；手机文本高由 53px 降至 35px，与原可见高 35px 一致。14 条交互、7 组空错误/警告日志、9 张新截图；首页桌面 idle→ready 回归通过，不是新 CWV 测量。

本项仅 `待验收`，等待 `LOCALE-001 验收通过`。145 项原源码/配置、15 份历史证据、25 条验收保持，v1.57 裁切失败未改写。原始权限 UNKNOWN、KW-04/12 should、旧间距/窄卡、生产版本/一跳/robots/SEO/CWV 门禁和看板文件视觉限制保留。未提交、推送、部署或开始下一项。证据：`docs/quality/evidence/locale-001-rights-copy/mobile-revision-checks.json`。

## 修订与验证

- 唯一可见改动：`components/HomePage.tsx` 的 `legacyLocaleSidebarItems[4].text`，由 62 字符长句缩为 46 字符；末尾条件 `when available` 完整保留。
- 检查器的 7 份 main 与 7 份隔离 SSR 哈希，只从已验证的 v1.57 输出作一次文字替换推导；其余基线不变。新增旧长句回流反例，未放宽断言；`scripts/README.md` 同步规则。
- Windows / PowerShell，Next 14.2.35，OpenNext Cloudflare 1.3.0；仅 `http://127.0.0.1:3100`。Browser 插件可用，无替代浏览器。分支/HEAD 不变，未向真实社区写入数据。

| 检查 | 结果 | 证据 |
|---|---|---|
| 类型 / full lint / 检查器 / 既有功能 | 通过 | 22 个最终命令均 exit 0；完整日志保留 |
| Next / OpenNext 构建 | 通过 | 2 个命令 exit 0；Windows 警告不掩盖，未声称生产运行通过 |
| built / HTTP / robots / SEO | 通过或有条件通过 | 5 built + 8 runtime；20 页 0 must / 12 should，20 唯一 sitemap URL |
| 页面身份 / 非空 / 无错误覆盖层 | 通过 | 正确 title/H1、实际截图与 DOM，首页和两个草稿代表页 |
| Gallery 换行 | 通过 | /es、/ar，1280/390/360px；目标文字无裁切或横向溢出 |
| Gallery 点击 / Menu / Back / Tab / Enter | 通过 | 12 条导航往返记录；真实目标 /gallery |
| 首页 click-to-load | 通过（限定） | 桌面 idle 时 Ruffle script=0，Play 后 ready/script=1；未测完整 SWF 内部流程 |
| 控制台 | 通过 | 7 组 error/warn 均为空；测试脚本警告另列 |
| 原验收 / 历史 / 其它源码 | 通过（冻结检查） | 25 条验收、15 历史文件和 145 原源码/配置不变 |
| 看板视觉 / 生产 / CWV | 未验证 | 文件访问限制保留；无部署或新性能结论 |

运行输出、开始/结束时间、产物哈希、DOM、9 张截图和边界见 [mobile-revision-checks.json](mobile-revision-checks.json)。先前中断中的阿拉伯语步骤不计为最终通过；恢复后重跑 37 项并以最终 build 重新截图。一次临时 QA 句柄错误已修正，属于验收脚本而非应用错误，原记录保留。旧版图片尚未绘制的早期截图也不作为最终视觉通过证据。

回滚仅逆向本次短句、相应检查/说明与 v1.58 治理增量；恢复长句会恢复 v1.57 已知手机裁切。不得重置其它脏工作区成果或覆盖旧 QA；没有线上回滚需求。

## 本轮截图

- es-first-viewport-390x844：`C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.58/recheck-2026-09-03/es-first-viewport-390x844.jpg`（SHA-256 `4880e423597db704be049c2794da834beef5975a728230bdc233d332374790db`）
- es-sidebar-complete-390x844：`C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.58/recheck-2026-09-03/es-sidebar-complete-390x844.jpg`（SHA-256 `18682ca000046d95e6804ca3fa6e3ceeb2dc7d863e6879da7c95b51792d7ca71`）
- ar-sidebar-complete-390x844：`C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.58/recheck-2026-09-03/ar-sidebar-complete-390x844.jpg`（SHA-256 `f4f5c181923589b03847196582a71b5fe29c305699989a49e83572567ea217f5`）
- ar-sidebar-complete-360x800：`C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.58/recheck-2026-09-03/ar-sidebar-complete-360x800.jpg`（SHA-256 `7fe3b827cd64c36c2ed96bb34ce226fa0eae2e2d4c6e41dc466a55b1e18e51f4`）
- es-sidebar-complete-360x800：`C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.58/recheck-2026-09-03/es-sidebar-complete-360x800.jpg`（SHA-256 `73e062d71371fcabcb63f327a8163945a536e92a9f436a80314da7f6c3919039`）
- ar-desktop-complete-1280x900：`C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.58/recheck-2026-09-03/ar-desktop-complete-1280x900.jpg`（SHA-256 `e83d7f374e567acb2a555ece0f7f8ac7b95f6efe206b82b9b2b2a634d812b785`）
- es-desktop-complete-1280x900：`C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.58/recheck-2026-09-03/es-desktop-complete-1280x900.jpg`（SHA-256 `e7b3a834846c87196218af8f8fcfb772d4a5634cde1d5e60f0cf92d24e25c40b`）
- root-desktop-idle-1280x900：`C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.58/recheck-2026-09-03/root-desktop-idle-1280x900.jpg`（SHA-256 `f1e5bebca8f011802003bb292d922d6bd6435d35a788ff8f1ae8a81fc32cc9b6`）
- root-desktop-ready-1280x900：`C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.58/recheck-2026-09-03/root-desktop-ready-1280x900.jpg`（SHA-256 `86a40402c8dec310b990ceed8569a4bff60620bf5769f32687e76143c7656947`）

---

以下完整保留 v1.57 历史说明。其中“修订未确认/待确认”只代表该历史时点，不是 v1.58 当前状态。

# LOCALE-001 · 四处来源文案实施与手机裁切阻断

> 2026-09-02 · 看板 v1.57 · **待验收；本地 QA 不通过（手机文案裁切）**。原方案已确认并实施；新短句修订未确认/未实施。未验收、未部署。

## 结果与需确认事项

已按原确认稿完成 `lib/locales.ts` 一句、`components/HomePage.tsx` 三句；37 项最终本地命令全部 exit 0，但 Browser 发现 `/es`、`/ar` 的 390px Gallery 说明末尾 `available.` 被截掉，不能作为视觉或成果验收通过。

- 当前已实施：`Browse style examples and approved submissions when available.`
- 候选短句（**未实施、未渲染验证**）：`Style examples; approved posts when available.`
- 需要：`确认 LOCALE-001 手机文案缩短修订`。只缩短同一共享字段及精确检查期望，不改 CSS、布局、其它三句或已验收页面；确认后重建和复测完整显示，再请求用户验收。

## 环境与边界

Windows / PowerShell；`D:/LYXGIT/mysquarefaceicon`；分支 `codex/game-platform-rebuild`，HEAD `c6d30087c2c03a7c4eb8d5bfe6e055e9b8d40228`。Next 14.2.35，OpenNext Cloudflare 1.3.0 / AWS 3.6.5。新本地 build `ynVDY6J1ddC0YHaNiUTtN`，42 routes；仅在 `http://127.0.0.1:3100` 运行生产预览。旧的本轮自建 PID 37744 在构建前关闭，新 PID 37632 启动，未终止其它项目进程。

可见文案共享到 `/es`、`/vi`、`/ja`、`/th`、`/ar`、`/ru`、`/id`。其余三个数据句目前不参与 HomePage 渲染，不冒称三个当前可见页面问题。根页主体/metadata/schema、CSS、图片/alt/href、模块顺序、播放器、SWF、API、已验收 Gallery/Editorial/About/Terms 均保持。草稿仍为英语回退、noindex/follow、自引用 canonical、无 hreflang/不进 sitemap；不是翻译上线，也不授予实际权利。

## 自动检查

| 检查 | 结果 | 证据边界 |
|---|---|---|
| 22 项代码/回归 | 通过 | type-check、full lint 0 warnings/errors、检查器 lint/syntax、Locale/Gallery/Editorial/About/Terms、canonical/game/player/routes/components/metadata/home/hero/discovery/gallery/performance/template |
| 2 项框架/平台构建 | 通过 | npm run build 与 npm run cf:build；42 routes，OpenNext Worker bundle 与 1 chdir patch；Windows warning 原样保留，不代表平台运行时或部署 |
| 5 项 built | 通过 | Locale 8 路 HTML + Gallery/Editorial/About/Terms；Locale 109 HTML、4 sitemap 反例均被拒绝 |
| 8 项 runtime | 通过 | 同五项 HTTP、robots、完整 SEO、14 路产物一致性；单一 3100 base，无真实 API 写操作 |
| SEO/index | 有条件通过 | 20 页、0 must / 12 should（KW-03×1、META-03×7、META-04×4）；sitemap 20 唯一 URL、无草稿与虚构 lastmod；KW-04 未认证 |
| Source/SSR | 通过（限定） | 四区/其余区域冻结、8 locale 隔离 SSR、18 源码反例；6 组件为声明的桩，不能证明水合/手机视觉 |

完整开始/结束时间、超时边界、命令 stdout/stderr、旧源码的预期红灯和所有失败/重试见 [checks.json](checks.json)。初始旧源码检查 exit 1 为预期断言；后续应用断言均 exit 0。既有 GAME-TPL 隔离 SSR 的 fetchPriority warning 与 OpenNext Windows warning 保留，未改写为浏览器故障。

## Browser 与手机实测

Codex 内置浏览器；CSS 视口 1280×900 / 390×844。14 张截图已检查，18 条交互记录；没有大面积错误覆盖层，7 组 error/warn 日志为空。截图栅格尺寸与 CSS 视口可能因滚动条/捕获机制不同，不据此虚构溢出。

| 范围 | 结果 | 实测 |
|---|---|---|
| `/es`、`/ar` 桌面 | 通过 | 新句全文可见；Gallery 点击→返回、Guide 后 Tab 聚焦 Gallery、Enter→返回，焦点轮廓可见 |
| `/es`、`/ar` 手机入口 | 通过 | Menu→Gallery→返回；首屏下方真实侧栏 Tab/Enter→Gallery→返回 |
| 手机 Gallery 完整文案 | **不通过 / P1** | small 宽 204px、clientHeight 35px、scrollHeight 53px；三行句子被既有两行样式裁切，末尾条件不可完整读出 |
| URL/方向/无横溢 | 通过 | 两个草稿保留 noindex/self canonical、ar rtl / es ltr；文档宽 1265≤1280、375≤390 |
| 首页播放器代表回归 | 通过（限定） | 桌面 click：idle→ready；手机 Enter：idle→loading→ready；预留宽高不变。键盘操作会滚动视口，不据此推导 CLS；未测试真实全屏/保存/全部 SWF 内部功能 |
| 看板文件视觉、多浏览器、CWV | 未验证 | 仅静态看板检查，保留原文件访问限制不绕行；没有新的真实设备/多引擎/CWV 报告 |

纠正记录：此前通用 `querySelector('aside')` 选到隐藏的 `game-device-notice`，不是侧栏；本轮改为 `aside[aria-label="More Avatar Games"]`，确认手机侧栏位于首屏下方并显示。原错误测量保留为失效的侧栏几何证据，不据此声称“手机隐藏侧栏”或通过换行。README 与用户说明已更正。一次 RTL 截图失败经原浏览器重试成功；一次播放后全量 DOM 快照 CDP 超时，限定 DOM/截图随后成功；原记录不删除。

首个首页 idle 截图仅捕获橙色封面底色；后续同一浏览器重新导航读取到封面图 complete=true、970×844，并保存正常封面截图。保留两次捕获，不称初次绘制/冷启动性能已通过。

## 文件、原证据与回滚

- `lib/locales.ts`
- `components/HomePage.tsx`
- `scripts/check-gallery-rights.mjs`
- `package.json`
- `scripts/README.md`
- `scripts/check-locale-rights.mjs`
- `F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html`
- `PAGE_PLAN.md`
- `LAUNCH_CHECKLIST.md`
- `SEO_LOG.md`
- `docs/legal/game-rights.md`
- `docs/quality/evidence/release-2026-09-02/README.md`
- `docs/legal/locale-rights-consistency-proposal.md`
- `docs/quality/evidence/locale-001-rights-copy/README.md`
- `docs/quality/evidence/locale-001-rights-copy/checks.json`

原 147 项应用/检查/配置中仅 5 个既有文件有本轮限定改动，新增 1 个 Locale 检查器，共 148 项；其它 142 项逐字节保持。14 份历史证据（包括 v1.56 proposal-checks.json）和 25 条原验收保持，不新增 LOCALE-001 验收；已验收 Gallery QA 对象不改写。脚本 README 最后的纠错文字属于本轮同一新增节，不影响已构建应用。最终保真结果写入 checks.json 的 governanceValidation。

权威状态只在 Liu-library 的原 HTML 看板；其它文档只是同一任务的证据。看板 v1.57 为 `待验收`，显式保留手机裁切失败与修订确认门。Square/Oval 权利 UNKNOWN、12 should/KW-04、原 Gallery 间距/About-Editorial 窄卡、生产版本/一跳/robots/SEO/CWV 均未关闭。未提交、推送、部署、运行 seo:prod 或启动下一项/MIG-SQUARE-001；没有线上回滚操作。回退只逆向本轮四句和限定检查/npm/文档增量，保留其它脏工作区成果与历史证据。

## 截图清单

| 名称 | 捕获 UTC | SHA-256 | 本地路径 |
|---|---|---|---|
| before-es-desktop-1280x900 | 2026-09-02T14:31:31.214Z | 6644d2ae869baf681b378ceed25c8eea3e34a526fc0478d29617c627e690418c | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/before-es-desktop-1280x900.jpg` |
| before-ar-mobile-390x844 | 2026-09-02T14:31:55.220Z | 3e72e3c0b2b23ba1694dd6bff876c0dacb790ee65552f19c8d16e2f4e80a519c | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/before-ar-mobile-390x844.jpg` |
| before-ar-desktop-1280x900 | 2026-09-02T14:33:52.083Z | 8b1933e675cb6813115127bdab1766c3d44426b694a931bccb3215b13f6b14c3 | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/before-ar-desktop-1280x900.jpg` |
| after-ar-desktop-1280x900 | 2026-09-02T14:51:50.771Z | 9a3eae7c7d663e836d5469b33b73b4f6827ac463d7705a3b9836efb07c169208 | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-ar-desktop-1280x900.jpg` |
| after-es-desktop-1280x900 | 2026-09-02T14:54:03.835Z | 1cbc83a3f454f93554c10f35403a46ff0f45439dabc3667b4aba7ce2c2db4d07 | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-es-desktop-1280x900.jpg` |
| after-es-mobile-390x844 | 2026-09-02T14:54:35.006Z | 4880e423597db704be049c2794da834beef5975a728230bdc233d332374790db | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-es-mobile-390x844.jpg` |
| after-es-mobile-sidebar-clipping-390x844 | 2026-09-02T14:55:31.612Z | 96dda5ae0c25dac12938dd24c43e6e249fd869b9e589a1d878166656e870a258 | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-es-mobile-sidebar-clipping-390x844.jpg` |
| after-ar-mobile-390x844 | 2026-09-02T14:57:06.327Z | 7bf8e7ee3875600e916c7a22e3c2c7e647206da8ff66c89b435a2e059b99b716 | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-ar-mobile-390x844.jpg` |
| after-ar-mobile-sidebar-clipping-retry-390x844 | 2026-09-02T14:57:39.352Z | 5e4b677c16c5bed13ca08b88a6e4782cb92b8b11273403b64a51d49c6108cf3b | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-ar-mobile-sidebar-clipping-retry-390x844.jpg` |
| after-root-desktop-idle-1280x900 | 2026-09-02T14:58:41.271Z | ec18b1021bdcd98b8106b5dc81e6238d991ce79001d0e2ed612b31d3dc373b71 | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-root-desktop-idle-1280x900.jpg` |
| after-root-desktop-ready-1280x900 | 2026-09-02T14:59:47.267Z | e25123b553fe99227796f5ef214768f5813adfa924cd0a34cc14bccdf3a7a217 | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-root-desktop-ready-1280x900.jpg` |
| after-root-mobile-idle-390x844 | 2026-09-02T15:00:23.935Z | 0e8a5d2c0125af35aad9fec3b2389b7cee40365bd63fc999ed466743bf4efbbf | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-root-mobile-idle-390x844.jpg` |
| after-root-mobile-ready-390x844 | 2026-09-02T15:01:19.937Z | e83cf31569ea5c319c356a53732026fd8614b1e718698328f30b54d1f3b92995 | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-root-mobile-ready-390x844.jpg` |
| after-root-desktop-idle-cover-recheck-1280x900 | 2026-09-02T15:04:25.956Z | f1e5bebca8f011802003bb292d922d6bd6435d35a788ff8f1ae8a81fc32cc9b6 | `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/locale-001-v1.57/after-root-desktop-idle-cover-recheck-1280x900.jpg` |
