# GALLERY-001 · 六处来源与权利文案实施证据

状态：`已完成（本地已验收） / 生产未验证 / 未部署`。唯一权威状态仍在 Liu-library HTML 看板 v1.55；本目录只存方案、QA 与验收证据，不是第二份任务表。

v1.54 实施记录：`2026-09-02T11:19:47.319Z`，用户此前确认六处方案。用户现已明确回复 `GALLERY-001 验收通过`；本次验收见下节，原实现/QA 日期与结果不改写。

## v1.55 明确验收（仅验收治理）

2026-09-02T12:44:34.299Z，用户明确回复 `GALLERY-001 验收通过`。看板 v1.55 将本项记录为 `已完成（本地已验收） / 生产未验证 / 未部署`，新增第 25 条源验收；原 24 条验收及 v1.54 检查、构建、浏览器、截图和诊断日期均保留。

本轮只做验收治理：147 项源码/检查/配置及现有 Next/OpenNext 产物保持不变；原 checks.json 逐字节保留，SHA-256 `a41646b12dffdc099bc9c1a84cf10667f6efc1753b1db5be2c437e3695bd86af`。其中“待验收”和 userAcceptance=NOT_RECEIVED 仅代表 v1.54 历史时点，不撤销本次明确验收。未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动或性能，不重启预览，也不声称当前服务仍在运行。

v1.54 本地 SEO 20 页、0 must / 12 should 与桌面/手机结果保留原日期；社区空态与内存 fixture 的边界不变。原间距/窄卡提醒、实际许可 UNKNOWN、独立 locale 文字、KW-04/should 与全部生产门禁仍开放；看板文件视觉仍未验证，不绕行。等待用户下一步指示，不启动下一项/MIG-SQUARE-001，不提交、推送、部署或执行 seo:prod。

验收治理证据：[acceptance-checks.json](D:/LYXGIT/mysquarefaceicon/docs/quality/evidence/gallery-001-rights-copy/acceptance-checks.json)。下方实现、检查与截图均为 v1.54 历史记录；不将旧通过冒充本轮复测。原 checks.json 和方案预演 JSON 保持字节不变。

本轮没有应用或线上回滚。如需撤回验收，应新增明确记录，不篡改原 QA 或整仓 reset。

## v1.54 结果与环境（历史 QA）

- 确认范围内实现和必需本地检查：**通过**。整体验收材料为**有条件通过**，保留 12 条既有 SEO should 和原有视觉提醒。
- 全局发布：**不通过 / 未部署**。实际授权 UNKNOWN、生产版本链、canonical/robots/CWV/seo:prod/生产浏览器等门禁未关闭。
- 环境：Windows / PowerShell，Node `v22.16.0`，Next `14.2.35`，OpenNext Cloudflare `1.3.0`；分支 `codex/game-platform-rebuild`，HEAD `c6d30087c2c03a7c4eb8d5bfe6e055e9b8d40228`，保留原有脏工作区。
- 新 build：`Vyf3tcN5LOfwDiSXRH6xO`；本地生产预览 [Gallery](http://127.0.0.1:3100/gallery)，PID `8064`，`2026-09-02T11:03:15.7864105Z` 启动成功并保留供验收。该时间只表示本轮记录，不保证未来持续在线。
- 机器记录：[checks.json](D:/LYXGIT/mysquarefaceicon/docs/quality/evidence/gallery-001-rights-copy/checks.json)。原 v1.53 [proposal-checks.json](D:/LYXGIT/mysquarefaceicon/docs/quality/evidence/gallery-001-rights-copy/proposal-checks.json) 字节未变；其中“未实施/待确认”是历史时点。

## 修改与冻结边界

仅实施三个 description、CollectionPage.description、eyebrow 与 lead 六处逐字替换；页面其他源码、真实社区功能、8 个 CSS 示例、Title/H1、URL/canonical/index、KW-02 原句和主词 3 次冻结。

应用增量仅四个文件：

- `app/gallery/page.tsx`：六处确认文案，不新加客户端组件或依赖。
- `scripts/check-gallery-rights.mjs`：独立冻结常量、源码/真实共享组件 SSR/构建/HTTP 检查与反例；不以可修改的看板或证据 JSON 作为检查真值。
- `package.json`：新增 `gallery:check` 脚本；依赖和 lockfile 不变。
- `scripts/README.md`：记录用法、边界、反例与社区状态区分。

另同步方案附件、game-rights、发布证据 README、PAGE_PLAN、LAUNCH_CHECKLIST、SEO_LOG、原 HTML 看板；本目录新增 README 与 checks.json。没有改其它页面、CSS、样例、API、审核、点赞、表单、SWF、Registry 或路由/索引。

确认稿与实际源码 SHA-256：`d051f12b8e4c71a9b15a75efb59c3ffbb1f9904ec5d69577f9640ff47d479901`。原稿：`352e649d9ff6592e62f74aa91f7f3cf3cb0e7b48d4671d553d4eb0106c6dd12e`。六区外冻结哈希：`0e6e6fb2063f544bd0f6d3757888a8b33d22ed79e8396764866b97ce9380bb39`。

146 项原源码/检查/配置中只有 Gallery/package/scripts README 三项批准增量，143 项未变，加本项检查器共 147 项。9 份旧 QA 证据、24 条既有验收保持；本轮不新增 GALLERY 源验收。

## 代码、构建和 HTTP

全部 32 项最终命令都有超时、原始 stdout/stderr、日期及 exit 0，分为 20 项代码、6 项构建/产物、6 项 HTTP/robots/SEO；完整参数见 checks.json。预期红灯单独保存：新增检查器在旧文案上 exit 1，实施后通过；不把它计入最终失败或抹除记录。

| 代码检查 | 结果 | 退出码 |
|---|---|---|
| type-check | 通过 | 0 |
| lint | 通过 | 0 |
| gallery-checker-lint | 通过 | 0 |
| gallery:check | 通过 | 0 |
| editorial-checker-lint | 通过 | 0 |
| editorial:check | 通过 | 0 |
| about:check | 通过 | 0 |
| terms:check | 通过 | 0 |
| canonical:check | 通过 | 0 |
| games:check | 通过 | 0 |
| player:check | 通过 | 0 |
| routes:check | 通过 | 0 |
| components:check | 通过 | 0 |
| metadata:check | 通过 | 0 |
| home:check | 通过 | 0 |
| home-hero:check | 通过 | 0 |
| home-discovery:check | 通过 | 0 |
| home-gallery:check | 通过 | 0 |
| perf-home:check | 通过 | 0 |
| game-template:check | 通过 | 0 |

- Next 构建：`2026-09-02T11:00:18.106Z → 11:01:06.171Z`，42 路由，Gallery 4.26 kB / First Load JS 96.7 kB，middleware 26.8 kB。
- OpenNext 等效构建：`11:01:06.173Z → 11:02:24.477Z`，Worker bundle 与 patch 完成，exit 0；保留 Windows 兼容提醒。不是部署证据。
- Gallery / Editorial / About / Terms 的四项 built 检查分别通过。Gallery 为 18 个源码、20 个原始 HTML 反例全部被拒绝；共享社区 4 个内存 SSR 正例通过。
- 本地 HTTP：Gallery / Editorial / About / Terms 四检查，robots 和完整 SEO 六检查均 exit 0；另六路 Gallery/Editorial/About/Terms/robots/sitemap 均 200、逐字节匹配新产物。
- robots：同一显式 3100 base，6 个受限爬虫与 5 个公开爬虫策略/私有路径检查通过。sitemap 20 个唯一地址、0 lastmod，不新增 games/category 索引。
- 完整本地 SEO：20 页，0 must / 12 should（META-03 ×7、META-04 ×4、KW-03 ×1），与历史基线相同；Gallery 原标题 68 字符提醒保留。KW-04、新 SERP 和生产 SEO 未验证。

可复核的关键命令（必须在本项目根目录，且先启动对应生产构建；不要重复传两个 base）：

```powershell
npm run gallery:check
npm run gallery:check -- --built
npm run gallery:check -- --base http://127.0.0.1:3100
node scripts/check-ai-crawler-policy.mjs --base http://127.0.0.1:3100
node scripts/seo-check.mjs --base http://127.0.0.1:3100 --json
```

## 真实浏览器与社区状态边界

Browser 1280×900 / 390×844、`http://127.0.0.1:3100/gallery`；应用页面检查完成于 `2026-09-02T11:15:06.704Z`。身份/title、非空、无运行时覆盖层、精确正文/metadata/两份 schema、1 H1/4 H2/14 H3、8 样例和 4 链接通过。19 页属段落之外，真实初始共享社区空态另有 1 段；不是把组件桩的 19 段误当完整渲染。

- 12 条点击/导航/Back 记录、4 条键盘记录，44 项浏览器断言通过；两个视口均无横向溢出，warn/error 日志为空。
- 桌面：Latest → Most Liked → Latest；Tab 聚焦 Most Liked 有可见轮廓、Enter 激活；Make your own icon / free avatar workflow / cute avatar tips 均跳转正确并 Back 返回 Gallery。Cute 路由仍是 noindex, follow。
- 手机：两种排序切换与 Tab/Enter 正常；Open the generator 到 `/#maker` 并 Back；未激活游戏、评论提交或真实点赞。
- 真实页面只有空态。额外只读 `GET /api/comments?locale=en&sort=latest|liked&limit=500` 在记录时均 HTTP 200、0 条；不采集 UGC 身份或正文。
- `empty / load-error / populated-liked / already-liked` 四状态是实际共享组件的内存 SSR fixture。非空、出错、评分、点赞样式并未通过制造真实投稿来测试，不能声称覆盖了生产写链路。
- 眉题 source 为 `Avatar style ideas`，冻结 CSS `text-transform: uppercase` 使可见文本大写。首次可见文本对源码的机械比较误报此项，核实 rawText 与 CSS 后校正断言；无应用改动。
- 前后桌面/手机、全页与键盘焦点 8 张截图均审阅。原有社区标题/副标题视觉相接、About/Editorial 旧窄卡换行为非阻断提醒；本次未获 CSS 改动授权。
- 视口标签是实际 CSS 视口，不等同于截图栅格：多数桌面视口图为 1265×889、手机视口图为 375×812，手机焦点图为 390×844；两张全页图为 1265×2765 / 375×6561。初次证据校验误把截图高度当成 CSS 视口高度，已依据实际 JPEG 尺寸、保持比例与独立 DOM 视口记录修正，原失败日志在 checks.json 保留；没有修改或重采样截图。
- 看板文件视觉：**未验证**。保留此前本地文件访问限制，没有 localhost 镜像、替代浏览器或其它绕行；只做看板 JS/数据/导出/历史保真检查。

## 未关闭项、验收和回退

原有社区标题/副标题间距偏紧及 About/Editorial 窄卡提醒保留；12 should、KW-04、实际许可 UNKNOWN、独立 locale 文字及全部生产门禁仍开放。看板文件视觉未验证，保留既有访问限制且不绕行；未重测生产性能，未提交、推送、部署、seo:prod 或启动下一项/MIG-SQUARE-001。

质量监管 skill 将六处确认稿、SEO/共享社区回归与同一个看板验收门连接起来；前端测试流程补充了前后截图、真实链接/键盘与内存状态边界。所有已验收历史证据原日期保留，没有把本轮通过写成上线或授权证明。

v1.54 交付时的验收说明（当前已按用户明确回复验收）：用户验收重点：新声明清楚区分样例插画和可用时的审核投稿，说明审核不核实作者/授予使用权；8 个示例、排序、四条入口仍正常。认可后回复 `GALLERY-001 验收通过`，本轮不自动开始下一项。

回退仅撤销六处文字及本项检查器/package/scripts README 增量，并同步同一个看板；旧/新精确片段在 checks.json。保留历史证据、24 条验收和用户无关改动，不做整仓 reset；未部署，所以无线上回滚。

## 截图索引

| 画面 | 文件 | SHA-256 |
|---|---|---|
| before-desktop-1280x900 | [查看](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/gallery-001-v1.54/before-desktop-1280x900.jpg) | `d3db54431fabbacae5b353fe6a11cd02d5da967318a1f38538401c728531cf62` |
| before-mobile-390x844 | [查看](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/gallery-001-v1.54/before-mobile-390x844.jpg) | `11e4d6b80f6c1420c569f02e6bacdc393f7518d44350f871c9c8d94e8be53568` |
| after-desktop-1280x900 | [查看](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/gallery-001-v1.54/after-desktop-1280x900.jpg) | `94b9bb64148056968e0253b7b96f0470d4bac8f4a489359accd901139216c152` |
| after-desktop-full | [查看](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/gallery-001-v1.54/after-desktop-full.jpg) | `80d47ebb296b00cd843e366a9f5a7cc5a67df5da20022a63f8f86e6e3ad49aca` |
| after-desktop-sort-focus | [查看](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/gallery-001-v1.54/after-desktop-sort-focus.jpg) | `75c3484309a560d6290fb79340f6cecf74f39660a26ba69555aeedb5fd05f6ea` |
| after-mobile-390x844 | [查看](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/gallery-001-v1.54/after-mobile-390x844.jpg) | `abc152d525361a9e80da3b4c2ec2f560b9028fffe9ba67762e492a9c3eb20928` |
| after-mobile-full | [查看](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/gallery-001-v1.54/after-mobile-full.jpg) | `48f5119a0a13e6da49a3199b9c8606ccb39e97ade533e97e216b54089cc279f8` |
| after-mobile-sort-focus | [查看](C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/gallery-001-v1.54/after-mobile-sort-focus.jpg) | `fd577ffd169f516d82d6aeb8b4a249c4efe3bb91b1e5b93a692e8d6537e16c60` |
