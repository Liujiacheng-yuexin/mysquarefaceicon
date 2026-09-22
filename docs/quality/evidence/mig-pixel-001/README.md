# MIG-PIXEL-001 · External Tool 一致性实施与验收证据

> 当前 v1.69 · 2026-09-03：用户明确要求“不用提供，取消该项任务计划和相关文件”。LICENSE-GATE 材料补充计划已取消，不再要求材料，也不依据历史记录重建或催办该任务。专属清单和两份预检文件已从活跃目录移至 docs/archive/license-gate-cancelled-2026-09-03，可恢复；旧 JSON 的原路径和待材料措辞仅为历史。
> 29 条验收、原 QA、共享 Registry/UNKNOWN、应用及 SWF 保留；取消不记作许可或发布验证通过。本轮只取消和清理引用，不部署或开始下一项。下文原版本计划保留当时语境，不能覆盖本次取消。

> 历史 v1.68 · 2026-09-03 · **MIG-PIXEL-001 本地已验收 / 累计发布已重新授权但许可 P0 阻塞 / 未部署**。
> 用户明确回复“MIG-PIXEL-001 验收通过”，并要求“部署之前所有内容后进行下一步开发”。现 29 条源验收，原 28 条不改写。
> 154 项源码/检查/配置、24 份既有 JSON、18 个构建产物与原证据保持；本轮未重跑应用/浏览器/生产 QA。v1.67 checks.json 原哈希 bb9571f180ccc4dd2d4a7b29e1733582b363eb1c49c637051fcdb0edb984d512 不变。
> Square/Oval 来源、权利人、书面许可和用途仍 UNKNOWN；LICENSE-GATE 已阻塞，先补材料、完整门禁、部署与生产验证，再准备 CONTENT-QA-001。未提交、推送、部署或开始下一项。
> 当前验收/发布预检证据：docs/quality/evidence/mig-pixel-001/acceptance-checks.json；材料清单：docs/archive/license-gate-cancelled-2026-09-03/swf-license-evidence-request.md。下方 v1.67 待验收和暂缓措辞只保留当时语境，不撤销本次验收及新发布顺序。

> 历史 v1.67 · 2026-09-03 · **本地实现与验证通过 / 待人工验收 / 未部署**。
> 用户明确确认：确认 MIG-PIXEL-001 External Tool 一致性方案，进行开发。
> 确认方案不是成果验收；等待 MIG-PIXEL-001 验收通过。现 28 条源验收保持，LICENSE-GATE/P0 与累计发布继续暂缓、不通过。

## 本轮完成范围

- Pixel 继续 EXTERNAL_TOOL / EXTERNAL_LINK / DIRECT_LINK_ONLY；通过服务端核对 Record/Registry 绑定原站、Terms URL 和最小 PlayerModel。3 How-to / 6 Features / 5 Tips / 6 FAQ 使用同一 Record。
- Hero 只保留一个 Open Original Page，并标明新标签页；卡片另保留一个有效原站入口。卡片头为非交互 External tool，原网络提示区域改为批准的来源/条款说明；只有六处指定数据字段改动。
- 仅删除 WebPage 内的 WebApplication；WebPage / FAQPage / BreadcrumbList 保留，FAQ 与可见正文同源，使用既有安全 JSON-LD 序列化。Title/H1/description/URL/canonical/index/两级 breadcrumb、其余正文和模块顺序不改。
- Oval 与 /es /vi /ja /th /ar /ru /id 的旧 Pixel 侧栏增加 External 标签；原 href/标题/说明/图片/顺序不变。首页现有标签、Pixel 自身侧栏、CSS、共享适配器/许可策略不改。

## 修改文件与 URL

| 类型 | 文件 / 影响 |
|---|---|
| 应用 | app/pixel-art-avatar-icon-generator/page.tsx；data/games/pixel-art-avatar.ts；新增 lib/games/pixel-external-page.ts；components/GameSidebar.tsx |
| 回归 | 新增 scripts/check-pixel-external-page.mjs；限定调整 check-square-homepage.mjs、check-oval-legacy-page.mjs、check-locale-rights.mjs；package.json 与 scripts/README.md |
| 治理 | 权威 HTML 看板 v1.67、PAGE_PLAN、LAUNCH_CHECKLIST、SEO_LOG、Pixel 方案、本 README、发布/许可说明及新增 checks.json / screenshots |
| URL | /pixel-art-avatar-icon-generator；Oval 和七草稿仅侧栏标签，无新增 URL、索引或搜索意图变更；/ 为冻结回归 |

## 本轮验证（2026-09-03，本地 production build）

- **通过**：42 项最终命令 = 23 代码 + 2 构建 + 7 built + 10 HTTP/robots/SEO/产物比对；另 4 项适配烟测记录单列，不重复计入最终门禁。均有开始/结束、超时、退出码、stdout/stderr。
- **通过**：type；零警告 lint；四个检查器独立 ESLint；canonical 与 19 个其它任务回归。Next 生成 42 路由，OpenNext 完成 bundle 与既有 Windows patch；最终 build h1IC4O9PXVmRzgZw2n74n。
- **通过**：Pixel 41 内容/链接绑定，37 源码/数据逆向反例、127 Record/Registry fail-closed 反例、11 标签反例、23 HTML 反例（共 198）及 7 非目标侧栏排除。保留原 source/SSR/HTML goldens；只逆向精确批准差异，不重新录制基线，不跳过旧反例。
- **通过**：16 路 HTTP 与当前产物字节一致；旧正文/头部/schema 在精确批准差异外不变。4 个 noindex/404 边界、11 crawler 策略通过；sitemap 20 唯一 URL、无伪造 lastmod。SEO 20 页 / 0 must / 12 既有 should（META-03×7、META-04×4、KW-03×1）。
- **通过（改动范围）**：14 组响应式 DOM/metadata/方向核对；Pixel 1280/390/360 首个 CTA 完整可见，底部分别 471.765625 / 482.359375 / 496.75px；页面无横向溢出。6 组窄屏侧栏实际聚焦后标签与说明完整可见，说明 clientHeight=scrollHeight=35px。
- **通过**：12 条交互，Hero 与适配器 Tab/Enter 分别打开正确原站新标签；Terms 点击到正确条款页；FAQ Enter 展开、Space 关闭；Report/Back、手机 Open 本地锚点、Square/Oval 双向入口及 es/ar 入口正确。raw 与 hydration 的 3 schemas 和 6 FAQ 一致。28 批前后日志与末次日志无 error/warn。
- **通过（限定资源）**：点击前 Pixel 资源清单没有 icongenerators 生成器资源或 Ruffle/WASM/SWF，主内容无 iframe。原有 Google 广告/统计及主区外广告 iframe 仍存在；不声称零第三方加载、广告/CMP 合规或外站生成/保存功能通过。
- **通过（离线治理）**：看板 JS/VM、静态/动态焦点、28 条源验收、5 个旧缓存反例、取消/确认重置、导出及未来明确验收/退回的保存行为。Pixel 不自动完成，Oval 不变为完整模板完成，CONTENT-QA-001 不启动；该 VM 不读取或写入用户真实浏览器 localStorage。

## 证据与复现

完整机器记录：checks.json。45 张本轮截图保存在 screenshots/，含 14 张改前、14 张改后及稳定/聚焦/交互/诊断截图。以下是最终人工审阅的代表，不将早期未落定滚动截图当侧栏可见证明：

- screenshots/after-pixel-1280-stable.jpg
- screenshots/after-pixel-390.jpg
- screenshots/after-pixel-360.jpg
- screenshots/sidebar-oval-360-focused.jpg
- screenshots/sidebar-es-390-focused.jpg
- screenshots/sidebar-ar-360-focused.jpg
- screenshots/pixel-hero-keyboard-focus.jpg
- screenshots/pixel-faq-keyboard-open.jpg

本地预览 http://127.0.0.1:3100/pixel-art-avatar-icon-generator ，新建进程 PID 41332。重建前只停止已核实命令行的旧 PID 46300；重启使用同一 Next start 渠道、隐藏窗口。启动 stdout/stderr 与最终监听/构建匹配证据写入 checks.json。

复现：npm run pixel-page:check；npm run pixel-page:check -- --built；npm run pixel-page:check -- --base http://127.0.0.1:3100。全量 SEO 使用 node scripts/seo-check.mjs --base http://127.0.0.1:3100 --json（仅一个 --base；不把默认 3000 与 3100 混用）。构建需在 QA 日志中核对 npm run build 和 npm run cf:build 的独立 exit 0。

## 保留项、状态与回滚

144 项其它源/检查/配置原字节不变；本次 8 个既有文件修改 + 2 个新增文件后，该清单共 154 项。当前证据目录原有 23 份 JSON、73 张历史截图、28 条源验收、原 v1.65/v1.66 QA 日期均保持；这个计数不改写历史轮次不同统计口径。Registry、Square/Oval SWF 与所有 CSS 不变。

本次可见范围通过；整站已有视觉提醒为**有条件通过**且未修复（Oval 窄屏首屏入口偏低、About/Editorial 窄卡、Gallery 间距）。React 18 fetchPriority SSR 和 OpenNext Windows 兼容提醒原样保留，不是新测试失败。真实看板视觉因原文件访问限制仍**未验证**，不通过镜像或其他传输绕行。外站生成/保存/移动、KW-04、CWV/真机/其它引擎、真实全屏/全部 SWF 内部控件及生产版本/一跳/robots/SEO/广告/CMP 未验证。发布因 UNKNOWN/LICENSE-GATE/P0 保持**不通过 / 用户暂缓 / 未部署**。

质量监管 skill 决定本轮停在待验收并保留 P0；React 规则落实服务端解析与最小序列化；浏览器验证 skill 以实际 DOM、焦点、导航与审阅截图补充静态测试。没有提交、推送、部署或 seo:prod；CONTENT-QA-001 未开始。

回滚仅使用 checks.json 中的本轮应用/治理精确增量，先核对当前 after SHA，再逆向；新增 resolver/checker/证据/截图仅在确认无人续改后按明确路径移除。源码前副本保存在本轮临时目录，不是长期 Git 回滚点；不要全仓 reset、不要覆盖其它未提交工作。当前分支 codex/game-platform-rebuild，HEAD c6d30087c2c03a7c4eb8d5bfe6e055e9b8d40228 不变；无线上变化与线上回滚。

临时复现目录：C:/Users/liu/AppData/Local/Temp/mysquarefaceicon-mig-pixel-v167-46461723270740c4a1bd09953f8177c7。临时 HTTP helper 初版将 body 级 schema 当作 main 内容，已保持 schema 独立精确断言后修正；首张 desktop 缩放截图及未落定滚动截图保留并补拍；es 链接名称不匹配后按真实 DOM 修正选择器。这些诊断不通过改应用或旧 golden 消除。

## 历史 v1.66 · 原方案核对与治理证据


> 2026-09-03 · 看板 v1.66 · 设计中 / **方案待确认，尚未实施**。
>
> 用户本轮指令：“确认验收，现在进行下一步开发”。
> 该指令登记 MIG-OVAL-001 本地阶段验收，并开启 Pixel 方案；不是 Pixel 新入口/schema/侧栏变更的预先确认。

## 结果

- MIG-OVAL-001 新增第 28 条源验收，范围 LOCAL_DATA_BINDING；原 27 条不变。完整统一模板迁移未完成、保持已延期。
- 当前仅准备 docs/product/pixel-external-tool-consistency-proposal.md。确认口令：确认 MIG-PIXEL-001 External Tool 一致性方案，进行开发。
- 网站应用源码、检查脚本、package、构建、SWF、Registry 没有改动。没有提交、推送、部署、seo:prod 或 CONTENT-QA-001。
- 本轮只读文件与看板 JS/离线 VM 校验：通过。真实看板视觉未验证，既有文件访问限制不绕行。
- type/lint/完整回归/Next/OpenNext/本地 HTTP/SEO/Browser/移动/CWV：本轮未执行；没有把历史 QA 改成当前通过，也没有核实本地预览存活。
- 质量监管 skill 保留方案确认与人工验收边界；React 规则用于方案中的服务端数据解析、最小 PlayerModel 和不加载外站资源，不代表本轮已实施这些改动。

## 本轮修改文件（治理和方案）

| 文件 | 内容 |
|---|---|
| F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html | v1.66，Oval 带范围验收、Pixel 方案焦点、未确认方案不能提交验收、导出/重置/旧缓存保护 |
| docs/product/pixel-external-tool-consistency-proposal.md（新增） | 单页布局/文案/SEO/交互、跨页小范围标签例外、拟应用文件与 QA 清单 |
| PAGE_PLAN.md、LAUNCH_CHECKLIST.md、SEO_LOG.md | 当前验收和下一项方案状态，不改历史应用 QA |
| docs/product/oval-local-data-binding-proposal.md | 当前本地验收说明，旧方案保留为历史 |
| docs/quality/evidence/mig-oval-001/README.md | 追加验收说明，v1.65 原文保留 |
| docs/quality/evidence/mig-oval-001/acceptance-checks.json（新增） | 用户明确验收、原 QA 哈希及本轮只读/治理证据 |
| docs/quality/evidence/release-2026-09-02/README.md、docs/archive/license-gate-cancelled-2026-09-03/swf-license-evidence-request.md | 发布和许可仍暂缓、不通过；不是材料补充或权限变更 |
| 本目录 README.md、proposal-checks.json（新增） | 方案事实核对、哈希、验证边界、恢复方式 |

既有 8 份文档/看板使用 36 个限定补丁；校验逆向补丁后能重建修改前全文哈希。原 README 的一个末尾空行被补丁工具归一时发现，已经恢复，不能借此放宽历史内容检查。

## 现码与来源

源码和现有构建确认 Pixel 已用 EXTERNAL_LINK，没有 iframe；剩余 4 处 Embedded 旧文案、5 个重复原站链接、嵌套且指向原站的 WebApplication，以及旧 Pixel 侧栏缺少 External 类型标签。三组数组 3/6/5 完全重复；六条 FAQ 中只有第 4 条与 Record 不同。这里不是对当前外站功能、生产页面或搜索排名的判断。

本轮读取[原站生成器页](https://www.icongenerators.net/pixelavatar.html)与[原站条款](https://www.icongenerators.net/terms.html)。公开条款仍支持页面链接，并限制未经许可的嵌入/复制；不根据这次读取扩大既有 DIRECT_LINK_ONLY 权限，不复制原站资源或改写 Registry 日期。

单次只读命令：
curl.exe --head --max-time 15 https://www.icongenerators.net/pixelavatar.html

返回 exit 0，HTTP 200，响应 Date 为 Thu, 03 Sep 2026 05:07:28 GMT；X-Frame-Options: SAMEORIGIN；Content-Security-Policy: frame-ancestors 'self'。文本页面工具可能使用缓存；HEAD 不能证明游戏启动、生成、保存或移动体验。未绕过嵌入限制。

## 保持项与验证

- 152 项应用/检查/配置的原 SHA-256 不变。
- 当前 docs/quality/evidence 目录中原有 21 份 JSON 逐字节不变；这是本轮目录口径，原 v1.65 等记录中的历史计数保留原文，不重新解释成当前统计。
- 73 张已记录截图、18 份当前构建产物与两份 SWF 哈希不变。
- 原 Oval checks.json 不改写，SHA-256：47bfac00708ee560e90b915bbc7fd6c57e4fc9a7def201fa3a4c9ea8a2fd3231。
- 文件 build ID：U_kmLWP9KIdfcJUsHvBgL；分支 codex/game-platform-rebuild，HEAD c6d30087c2c03a7c4eb8d5bfe6e055e9b8d40228 不变。未核实预览进程是否仍在运行。
- 看板 JS 可解析；静态/动态焦点一致；28 条验收、原历史 QA、WEEKS 和 CSS 不变。Pixel 未确认方案不能经勾选、状态菜单、验收按钮或过期缓存提前变成实施/完成；Oval 不能被标为完整模板已完成。
- VM 验证取消/确认重置、导出 v1.66、源验收优先级、无效缓存、确认提示词和详情、未来“已确认且已实施”的模拟验收仍可用且不自动启动 CONTENT-QA-001。所有模拟只使用内存节点/存储，不操作用户浏览器。
- 项目和权威看板 git diff --check 通过；git 只读核对有 15 秒超时、开始/结束时间、stdout/stderr 和 exit 0。

原 v1.65 的 39 项最终命令、20 页 SEO / 0 must / 12 should、7 组响应式及交互结果保持原日期。Oval 窄屏首屏入口偏低和视觉有条件通过不因验收被关闭；KW-04、should 提醒、真实全屏/全部 SWF 内部控件、其它引擎/真机、生产版本/一跳/robots/SEO/CWV/广告与 CMP 仍独立未验证或未关闭。

## 诊断与回滚

留存两个准备阶段问题（模板字符串转义、校验脚本 for-of 拼写）以及末尾空行保留检查的失败与修复；它们是治理工具诊断，不是应用测试结果，没有调整原应用黄金值、历史 JSON 或构建来使其通过。

本轮只逆向这 36 个治理补丁并删除本轮明确新增的方案/证据文件即可撤回，不撤销已验收应用、不覆盖其它未提交改动，不使用全仓 reset。完整补丁与前后哈希在 proposal-checks.json 中。临时复现目录：C:/Users/liu/AppData/Local/Temp/mysquarefaceicon-mig-pixel-proposal-v166-0f2c1fab028e40119c204cc71fc4b5fe；验证脚本 verify-governance.cjs 的 final / proof 模式不启动服务器或部署。临时文件不是长期 Git 回滚点。没有线上变更或线上回滚事项。

## 等待确认

确认 MIG-PIXEL-001 External Tool 一致性方案，进行开发

确认后只实施方案列出的 Pixel 和旧侧栏标签范围，完成适用代码/构建/HTTP/SEO/桌面手机检查后再设待验收，等待用户接受。LICENSE-GATE 与累计发布仍暂缓 / P0 未关闭；此次方案不恢复部署权限。

