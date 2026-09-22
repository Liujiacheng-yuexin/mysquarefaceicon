# MIG-SQUARE-001 · Square 首页本地数据绑定验收证据

> 当前 v1.69 · 2026-09-03：用户明确要求“不用提供，取消该项任务计划和相关文件”。LICENSE-GATE 材料补充计划已取消，不再要求材料，也不依据历史记录重建或催办该任务。专属清单和两份预检文件已从活跃目录移至 docs/archive/license-gate-cancelled-2026-09-03，可恢复；旧 JSON 的原路径和待材料措辞仅为历史。
> 29 条验收、原 QA、共享 Registry/UNKNOWN、应用及 SWF 保留；取消不记作许可或发布验证通过。本轮只取消和清理引用，不部署或开始下一项。下文原版本计划保留当时语境，不能覆盖本次取消。

> 历史 v1.64 · 2026-09-03：用户已明确回复 `MIG-SQUARE-001 验收通过`，本地绑定已验收，新增第 27 条源验收。原 26 条及 v1.63 QA/checks.json 保持；未重跑完整应用检查或部署。验收范围和只读复核见 [acceptance-checks.json](acceptance-checks.json)。
>
> 用户同时要求下一步；目前仅准备 [Oval 本地阶段方案](../../../product/oval-local-data-binding-proposal.md)，尚未确认/实施，不代表完整统一模板迁移。许可 UNKNOWN 与累计发布暂缓保持。**以下为原 v1.63 实施/QA 快照，其中待验收、预览 PID 和测试结果保留其原时间，不撤销此次验收或表示当前服务已核实。**

> 2026-09-03（Asia/Shanghai）· 看板 v1.63 · 本地实现及范围 QA 已完成，**待用户验收**。
>
> 本地结论：**有条件通过**，已执行检查通过，保留既有 SEO/视觉建议及未测边界；不是生产发布结论。发布结论：**不通过 / 用户暂缓 / 未部署**。LICENSE-GATE 的 UNKNOWN 与 P0 未关闭。

## 1. 授权、范围与当前状态

用户已明确确认：`确认 MIG-SQUARE-001 方案，进行开发`。只实施已确认的 [本地方案](../../../product/square-home-data-binding-proposal.md)，不把方案确认视作实现验收。此前 `暂时跳过该项任务吧，进行后续开发` 仅暂缓许可核验与累计发布，未豁免许可或授权新部署。

- 完成 19 项页面级播放器输入、6 Features、6 FAQ、5 Tips（仍只展示 4）、3 How-to 和首页专属文案的单一 Square Record 绑定。两句 How-to 以已验收页面为准，可见文案不变。
- 保留 `FlashGenerator → GamePlayer` 既有兼容路径。通用 `createGamePlayerModel(squareFaceGame)` 仍因 UNKNOWN/空授权交付集合拒绝；不宣称已完成受许可门约束的完整通用模型迁移。
- 本轮未新增页面、发布语言、改 URL/索引/metadata/可见 H1/schema、修改 SWF/授权注册表/运行适配器/操作机制或重排模块。另有 dormant 文案/数组不属于本次绑定，未清理无关代码。
- 影响渲染输入的 URL：`/`、`/es`、`/vi`、`/ja`、`/th`、`/ar`、`/ru`、`/id`。七个草稿仍 noindex/follow、自 canonical、无 hreflang、不进入 sitemap；ar 保留 RTL，LOCALE-001 Gallery 短句不变。
- 26 条既有验收保持；本项尚未验收，MIG-OVAL-001 未开始。没有 commit、push、部署或生产变更。

本地预览：[Square 首页](http://127.0.0.1:3100/)，本轮启动的生产预览 PID `38552`；构建 ID `XnkRSno-fdK5b9heMuS6L`。后续服务可能被用户停止，该 PID/时间是本轮观测，不是常驻保证。

权威进度：[原 HTML 看板](F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html)。完整机器证据：[checks.json](checks.json)。原 [v1.62 方案核对证据](proposal-checks.json) 原样保留。

## 2. 变更文件（相对本轮前快照，不是整个脏工作树 diff）

| 文件 | 动作 | 内容 |
|---|---|---|
| `lib/games/game-schema.ts` | 修改 | 增加可选、类型化 homepage 文案/播放器呈现字段与运行时校验；不放宽许可门 |
| `data/games/square-face.ts` | 修改 | 保存原页面文案与 19 项输入来源；仅两句 How-to 对齐已验收原页面 |
| `lib/games/square-homepage.ts` | 新增 | Square 首页专用 resolver；派生 H1、精简 Hero 与显式播放器输入，不创建通用授权模型 |
| `components/HomePage.tsx` | 修改 | 四组正文数组与首页文案改读 Record；root 与七个草稿共用 |
| `components/home/HomeHero.tsx` | 修改 | 只接收必要文案/播放器字段；保留首屏结构、激活与控制行为 |
| `scripts/check-square-homepage.mjs` | 新增 | 8 个真实 SSR 基线、绑定/转发/反例与权限/SWF/运行代码保护 |
| `scripts/check-locale-rights.mjs` | 修改 | 严格校验新 props 后序列化旧隔离桩；保留原输出 hash 和全部反例 |
| `scripts/validate-game-metadata.ts` | 修改 | 把旧源码字面位置断言改为实际 resolver → H1 绑定链断言 |
| `scripts/validate-home-hero.tsx` | 修改 | 使用新 Hero 输入契约；保留原结构/行为断言 |
| `scripts/validate-home-performance.tsx` | 修改 | 使用新 Hero 输入契约；保留原懒加载/边界断言 |
| `package.json` | 修改 | 注册 npm run square-home:check；无依赖升级 |
| `scripts/README.md` | 修改 | 说明新增命令与 LOCALE 等价适配边界 |
| `F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html` | 修改 | 仅追加当前进度/验收与发布边界；保留历史内容 |
| `PAGE_PLAN.md` | 修改 | 仅追加当前进度/验收与发布边界；保留历史内容 |
| `LAUNCH_CHECKLIST.md` | 修改 | 仅追加当前进度/验收与发布边界；保留历史内容 |
| `SEO_LOG.md` | 修改 | 仅追加当前进度/验收与发布边界；保留历史内容 |
| `docs/product/square-home-data-binding-proposal.md` | 修改 | 仅追加当前进度/验收与发布边界；保留历史内容 |
| `docs/quality/evidence/release-2026-09-02/README.md` | 修改 | 仅追加当前进度/验收与发布边界；保留历史内容 |
| `docs/archive/license-gate-cancelled-2026-09-03/swf-license-evidence-request.md` | 修改 | 仅追加当前进度/验收与发布边界；保留历史内容 |
| `docs/quality/evidence/mig-square-001/README.md` | 新增 | 本轮交付说明与人工验收入口 |
| `docs/quality/evidence/mig-square-001/checks.json` | 新增 | 原始命令、浏览器记录、hash 清单与治理核验 |

源文件清单由本轮前的 148 项增至 150 项：修改 10 个既有文件（含脚本、npm 与脚本说明），新增 2 个；其余 138 项字节相同。应用实现只涉及前 5 个文件。20 份历史 JSON、27 张旧截图、全部既有验收及历史 QA 日期/失败保留。新产出的 25 张截图和 15 个构建产物均有 SHA-256 清单。

## 3. 等价性和防止假通过

- `square-home:check`：19 项显式值、8 个 locale 的真实组件完整 SSR 与迁移前 hash 相同；56 个内容绑定变体、38 个端到端播放器入参转发变体、150 个异常记录反例通过。转发变体在 GamePlayer 边界使用捕获桩，专门证明传递链；并非浏览器交互证据。
- 比较脚本同时重放迁移前源码，8 个真实 SSR 和 8 个隔离 SSR 均相等。不是把新输出直接覆盖为基线。真实 SSR 不执行客户端 effect，激活另有浏览器证据。
- `locale:check` 仅更新源码掩码 hash。原 8 语言 SSR、metadata、main HTML、header/footer、JSON-LD 等输出 hash 全部保留。新的 Hero/19 props 先逐项验证，再序列化为旧桩形状。
- HomeDiscovery 的隔离桩原先序列化整个记录：适配器先核对新增 homepage 的完整 hash 和两句 How-to，再只删该新增块、还原这两句供旧快照比较。其他 Record 字段必须仍通过旧 hash；没有宽泛忽略对象。
- LOCALE 原 19 个源码、116 个 HTML、4 个 sitemap 负例仍全部拒绝；Square 的 11 个冻结运行/样式/路由/其他数据源及两份 SWF 原 hash 保留。homepage 对其他游戏是可选字段。
- 14 条 HTTP 路径均 200，响应与当前构建文件字节相同；8 个共享首页及回归页面的已验收正文与旧构建相同。新客户端 props 和 build chunks 会改变 RSC/整份 HTML 字节，不声称完整线上 HTML 与旧版本逐字节相同。
- FAQ 可见内容与 FAQPage 共用 Record，三个 JSON-LD 对象、SEO 元数据与草稿索引边界通过原契约。sitemap 20 个唯一 URL、0 草稿、0 伪造 lastmod。

## 4. 命令与构建

以下为 37 个不同最终命令，均拿到 exit 0（完整 stdout/stderr、起止时间保存在 checks.json）。共保存 39 次执行；早期 metadata 源码位置断言失败和完整 type 重跑不会被删除。最后仅治理文档写回，另做源码/产物不漂移及看板核验。

| 标签 | 命令 | 最终退出码 |
|---|---|---|
| `games` | `npm run games:check` | 0 |
| `type-final` | `node node_modules/typescript/bin/tsc --noEmit --incremental false` | 0 |
| `square-home` | `npm run square-home:check` | 0 |
| `lint` | `npm run lint -- --max-warnings 0` | 0 |
| `player` | `npm run player:check` | 0 |
| `routes` | `npm run routes:check` | 0 |
| `components` | `npm run components:check` | 0 |
| `metadata` | `npm run metadata:check` | 0 |
| `home` | `npm run home:check` | 0 |
| `home-hero` | `npm run home-hero:check` | 0 |
| `canonical` | `npm run canonical:check` | 0 |
| `perf-home` | `npm run perf-home:check` | 0 |
| `game-template` | `npm run game-template:check` | 0 |
| `home-discovery` | `npm run home-discovery:check` | 0 |
| `about` | `npm run about:check` | 0 |
| `terms` | `npm run terms:check` | 0 |
| `editorial` | `npm run editorial:check` | 0 |
| `locale` | `npm run locale:check` | 0 |
| `gallery` | `npm run gallery:check` | 0 |
| `home-gallery` | `npm run home-gallery:check` | 0 |
| `next-build` | `node C:/nvm4w/nodejs/node_modules/npm/bin/npm-cli.js run build` | 0 |
| `scoped-lint` | `node node_modules/eslint/bin/eslint.js lib/games/game-schema.ts lib/games/square-homepage.ts data/games/square-face.ts components/HomePage.tsx components/home/HomeHero.tsx scripts/validate-game-metadata.ts scripts/validate-home-hero.tsx scripts/validate-home-performance.tsx scripts/check-locale-rights.mjs scripts/check-square-homepage.mjs --max-warnings 0` | 0 |
| `cf-build` | `node C:/nvm4w/nodejs/node_modules/npm/bin/npm-cli.js run cf:build` | 0 |
| `terms-built` | `npm run terms:check -- --built` | 0 |
| `about-built` | `npm run about:check -- --built` | 0 |
| `editorial-built` | `npm run editorial:check -- --built` | 0 |
| `gallery-built` | `npm run gallery:check -- --built` | 0 |
| `locale-built` | `npm run locale:check -- --built` | 0 |
| `http-parity` | `node C:/Users/liu/AppData/Local/Temp/mysquarefaceicon-mig-square-v163-9a0354bbc0c341f18e53560bedfe73eb/compare-http.cjs` | 0 |
| `robots` | `node scripts/check-ai-crawler-policy.mjs --base http://127.0.0.1:3100` | 0 |
| `seo` | `node scripts/seo-check.mjs --base http://127.0.0.1:3100 --json` | 0 |
| `terms-http` | `npm run terms:check -- --base http://127.0.0.1:3100` | 0 |
| `about-http` | `npm run about:check -- --base http://127.0.0.1:3100` | 0 |
| `editorial-http` | `npm run editorial:check -- --base http://127.0.0.1:3100` | 0 |
| `gallery-http` | `npm run gallery:check -- --base http://127.0.0.1:3100` | 0 |
| `locale-http` | `npm run locale:check -- --base http://127.0.0.1:3100` | 0 |
| `git-diff` | `git diff --check` | 0 |

Next 和 Cloudflare/OpenNext 平台构建均完成，输出 42 个静态页面，`.open-next/worker.js` 生成并完成项目既有补丁。当前生产预览从该最终构建启动，而非沿用旧服务。

### 诊断与仍保留的警告

- 首次 `metadata:check` 因旧“HomePage 源码直接出现 getGamePageH1”断言失败；代码现经 resolver 正确绑定。改为校验 resolver 调用链和根页/草稿 H1 后通过；未更改 metadata 或 H1 值，原失败记录保留。
- home-gallery 首次后台进程结果捕获丢失 stdout：未据此宣称通过，已重新执行并取得完整成功结果。
- React 18 的既有 fetchPriority SSR 警告、OpenNext 的 Windows 兼容提示和 Git LF→CRLF 提示保留。没有隐藏非零退出码；本轮浏览器控制台未见错误/警告。
- 浏览器读取 Performance API 的首次尝试不可用；改用该浏览器支持的页面资源清单观察资源来源。没有切换自动化环境、私自接入 CDP 或绕开访问限制。

## 5. 本地浏览器 / 移动 / 交互

同一浏览器对比旧构建与当前构建：`/`、`/es`、`/ar` 各 1280×900、390×844、360×844，合计 9 对。

| 检查 | 本轮结果 |
|---|---|
| DOM、可见正文、元数据、关键几何 | 9/9 与迁移前一致；无横向溢出；每页 1 H1、6 Features、3 How-to、4 Tips、6 FAQ、3 JSON-LD |
| 截图 | 8/9 对文件字节相同；es 1280 字节不同，两张均复核，未见布局/文案差异；不声称 9 对全部像素相等 |
| 初始播放器 | 1 个 idle 容器、0 Ruffle；根页移动端重复 CTA 仍隐藏 |
| 激活与重载 | 桌面 Hero 点击、移动封面 Enter、Space；观察 loading-visible 到 ready，单实例；Reload 后仍单实例 |
| 反馈 / FAQ | Report Issue 到 Contact 后 Back；FAQ Enter 展开/收起，显示答案与 FAQ schema 对应 |
| Gallery 侧栏 | es/ar 各 1280、390 点击及 360 Enter 到 Gallery/Back；390 菜单 Gallery/Back；短句无裁切，RTL 保留 |
| 控制台 | 19 批交互/视口记录及 1 批资源激活记录均无 error/warn |

资源专项使用 `pageAssets` 支持的可见资源清单：idle 与 loading-visible 阶段没有 Ruffle/WASM/SWF 条目；ready 阶段出现 `/ruffle/ruffle.js`、core JS、WASM、`/games/square-face.swf`，来源标记为 resource。三个观测时刻容器均为 330×286.953125，documentTop 365.015625。该证据是资源出现顺序和容器稳定性，不是完整 HAR、精确下载时长或 CWV 测量。

主要复核截图（本地绝对路径；全部 25 张清单在 checks.json）：

- [首页桌面](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-square-001-v1.63/after-home-1280.jpg)、[首页移动](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-square-001-v1.63/after-home-390.jpg)、[ar 360](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-square-001-v1.63/after-ar-360.jpg)。
- [移动键盘激活 ready](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-square-001-v1.63/home-mobile-keyboard-ready.jpg)、[FAQ 展开](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-square-001-v1.63/home-mobile-faq-open.jpg)。
- [es 390 Gallery 侧栏](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-square-001-v1.63/es-gallery-sidebar-390.jpg)、[ar 360 Gallery 侧栏](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/mig-square-001-v1.63/ar-gallery-sidebar-360.jpg)。

浏览器只打开本轮所需本地页面；额外旧基线/资源专项标签已关闭，视口恢复默认，最终预览标签停在根页。看板 HTML 的既有文件访问限制继续保留，**看板视觉未验证**，没有改用镜像服务或另一种查看路径绕过。

## 6. SEO、质量与发布边界

本地 SEO：20 页、0 must、12 should，沿用 SEO v2.1 口径。12 条仍为 META-03×7、META-04×4、KW-03×1（3/609，0.49%）；不在此次数据绑定中顺便改标题、描述或关键词。KW-04 语义评估未验证。robots 的 6 个受限 + 5 个公共爬虫决策及私有路径规则通过。

| 状态 | 范围 |
|---|---|
| 通过 | 类型、lint、上述源码/负例/SSR/HTTP/robots 检查、Next/OpenNext 构建，以及本轮已执行浏览器项目 |
| 有条件通过 / 待验收 | 此次本地绑定；已知建议和未验证边界保留，不自行视为人工验收 |
| 不通过 / 用户暂缓 | 发布：Square/Oval 真实来源和书面许可仍 UNKNOWN，P0 未关闭；无发布授权转换或豁免 |
| 未验证 | 生产版本关联/一跳 host/robots/seo:prod、新 CWV/加载时长、真实全屏、全部 SWF 内部控件、其他引擎/物理设备、KW-04、看板文件视觉 |

既有 Gallery 标题/副标题间距及 About/Editorial 窄卡片建议仍开放；本轮没有证据将其关闭。LOCALE 和其他既有验收没有重开，其原始日期与失败仍作为历史保存。

质量监管 skill 使此次交付严格停在单任务本地验收门，保留许可 P0、历史证据和真实输出等价要求；React best-practices 使客户端只接收 Hero/播放器所需字段，避免整份 Record 作为新增 client prop。

## 7. 人工验收与回滚

请在本地预览复核首屏、播放/重载、FAQ、Gallery 和移动布局。若通过，回复 `MIG-SQUARE-001 验收通过`；此前不标已完成，不进入下一任务或发布。

本轮工作树原本已有大量未提交修改。回滚仅可逆向本轮上述源码/脚本和治理补丁，不得 git reset/checkout 整个工作树；`C:/Users/liu/AppData/Local/Temp/mysquarefaceicon-mig-square-v163-9a0354bbc0c341f18e53560bedfe73eb/before-source` 保存 10 个旧文件快照，`before-governance` 保存写回前文档，checks.json 记录前后 hash。两个新增源文件仅在确认未含后续用户修改时移除。临时目录可能被系统清理，原始历史证据与变更范围已另外记录在仓库证据中。

未实施回滚或生产回滚；没有新部署可回退。如需要回退本地预览，应先按本轮范围恢复源码，再重新构建/启动，不继续运行与源码不一致的旧产物。保留证据与验收历史，不将待验收记录改造成已通过。
