# EDITORIAL-001 · 来源与权利文案实施证据

状态：`已完成（本地已验收） / 生产未验证 / 未部署`。权威看板 v1.53；本文件是证据附件，不是第二份任务状态表。

用户已明确确认方案，并在本地 QA 待验收后回复 `验收通过，请进行下一步开发`。v1.53 记录 EDITORIAL-001 本地验收；机器验证明细 [checks.json](checks.json) 与历史 [proposal-checks.json](proposal-checks.json) 保持原样。

当前验收见第 10 节；第 9 节与 checks.json.runtimeValidationFollowUp 是 v1.52 QA。第 1～7 节保留 v1.50 实施/阻塞，第 8 节保留 v1.51 重试；所有历史状态和日期不改写。

## 1. 实施范围

仅影响 `/editorial-policy`，三处 description、一个 H2 和一段正文与 [确认方案](../../../legal/editorial-rights-consistency-proposal.md) 逐字一致。来源说明区分编辑标准、站点选编、样式示例、可用时投稿与尚未核实的游戏/图片权限，不以审核、选编或工具生成证明作者身份或授权。

Title/H1、正式自引用 canonical、robots/index、sitemap、imports、节点数量/模块顺序、CSS、两条主内容链接、WebPage JSON-LD、其它正文及已验收 KW-02 句/3 次覆盖保持。About、Terms、Gallery、首页/locale、Registry、SWF、GamePlayer、依赖及 lockfile 不变。

| 校验对象 | 本轮结果 |
|---|---|
| 五处确认稿 | 源码与新构建 HTML 通过 |
| 冻结结构 | 1 H1 / 4 H2 / 3 H3 / 10 段；两条主内容链接；1 份 schema |
| 主内容关键词 | `editorial policy` 恰好 3 次，原 KW-02 句恰好 1 次 |
| 新描述长度 | metadata 153 / Open Graph 121 / Twitter 102 字符 |
| 源码反例 | 14 个均被拒绝；原旧源码红灯基线按预期 exit 1 |
| 原始 HTML 反例 | 15 个均被拒绝，包括旧文、授权肯定、标题/链接/schema/canonical、noindex、隐藏正文、额外段落 |
| 基线保护 | 145 项原源码/检查/配置中，仅 Editorial、package、scripts/README 改动；其余 142 项不变，新增检查器单独登记 |
| 历史记录 | 原 23 条用户验收不变；About/Terms/PF-01 与 Editorial 方案共 7 份历史证据哈希保持 |

此检查证明本次受控文字和代码边界，不证明实际许可证、搜索排名、可索引性最终处理或生产安全。

## 2. 类型、lint、回归与构建

25 项已执行的最终检查均设置超时、保留 stdout/stderr 和明确 exit 0；它们不包含尚未执行的 HTTP/浏览器门禁。命令、起止时间和退出码在 checks.json。

| 检查 | 结果 |
|---|---|
| TypeScript `tsc --noEmit` | 通过 |
| 全站 `npm run lint -- --max-warnings 0` | 通过，0 warning/error |
| 新检查器 ESLint | 通过，0 warning/error |
| Editorial source / built | 通过，14 源码 + 15 HTML 负例 |
| About source / built | 通过，14 + 6；不修改已验收页面 |
| Terms source / built | 通过，6 + 2；不修改已验收页面 |
| Canonical source decision matrix | 通过；不是生产重定向矩阵 |
| 既有 11 项任务回归 | 通过 |
| `npm run build` | 通过，42 routes；Editorial 185 B / First Load JS 87.5 kB；middleware 26.8 kB |
| `npm run cf:build` | 通过，OpenNext 1.3.0 Worker 及项目 patch；平台重建 Editorial 186 B / First Load JS 87.5 kB |
| 离线 robots | 通过，11 crawler 分流（6 blocked / 5 public）与私有路径边界 |
| 离线 sitemap / source freeze | 通过，20 unique URL，root/Editorial 在列，0 lastmod/新增游戏分类候选 |

保留的提醒：GAME-TPL SSR 测试的既有 React `fetchPriority` warning；OpenNext 的 Windows compatibility warning。这些没有作为本项文案问题静默修复。

临时产物核验脚本曾错误要求 sitemap 根 URL 带尾斜杠，随后改为核对解析后的正式 origin 和根 pathname；原 sitemap 没改。临时 ESM 辅助脚本曾使用 Windows 路径导入，改为正确 file URL 后通过。两次技术尝试与最终结果分开记录，不隐去失败，也不误报产品回归。

## 3. 构建产物

- Node：`v22.16.0`。
- 最终 build ID：`nEfpi7bM0YNUT_HgxJ895`（OpenNext 重建后的 .next）。
- 已确认页面源码 SHA-256：`c758e70ce143b58db1453877efcb6d82a9e89fd96d1bc473c73c6dcf4c81a529`。
- 五区以外源码掩码 SHA-256：`5fea48f4190b05b5cfbee10859a8db47e741d8acaac0f09e2f0cd323e99aefa6`。
- Editorial HTML：`a585c7a9cbf81d729f82049f03a585ae516ebfab5c22343cfef77774cada04d0`。
- robots：`e114dfaaa714b7b9d2385907a7f1e915e30c606d049f11457f45a9f6549d554f`。
- sitemap：`3f1341c4b3d4e339fc5b231539157032ff42ecfc991e4bc2058903d372bb12a7`。
- 平台入口与 About/Terms 产物哈希另见 checks.json；这是离线等效构建，不是 Cloudflare 部署或线上运行结果。

## 4. v1.50 历史启动阻塞与当时待补 QA

经端口、PID、可执行文件和完整命令核对后，旧任务预览 PID 30888 被停止，以便构建本轮产物。重建后沿用 Start-Process 隐藏窗口启动方式，但工具在执行前返回 `CreateProcess: blocked by policy`。这不是 Next 启动成功，也没有可声称的进程退出码。

只读复查：`2026-09-02T08:37:17.6392001Z`，3100 端口监听数为 0。未通过改换 shell、后台方式、浏览器或本地文件镜像规避拒绝。

Browser 可用，曾准备一个空白 QA 页签和 1280×900 临时视口；未进入实际页面，视口已重置，空白页签已关闭。没有本轮截图或桌面/手机通过结论。

| 必需运行时验证 | 状态 |
|---|---|
| Editorial/About/Terms 原始 HTTP、响应头与构建一致性 | 未验证，启动阻塞 |
| 实际 served robots/sitemap | 未验证；只有离线产物结果 |
| 完整本地 `seo:check` | 未验证；历史 v1.47 的 20 页 0 must / 12 should 不冒充本轮 |
| 1280×900 / 390×844 可见文字、换行/溢出、错误覆盖层 | 未验证 |
| 页面标识、非空内容、水合 metadata/schema、控制台 | 未验证 |
| Contact → Back → 首页、Tab/Enter 焦点与导航 | 未验证 |
| 看板桌面/手机视觉 | 未验证；沿用既有本地文件访问限制，不绕行 |

请在项目 `D:\LYXGIT\mysquarefaceicon` 的终端运行：

```powershell
npm run start -- -H 127.0.0.1 -p 3100
```

启动成功后访问 [本地 Editorial 验证地址](http://127.0.0.1:3100/editorial-policy)，再继续：

```powershell
npm run editorial:check -- --base http://127.0.0.1:3100
npm run about:check -- --base http://127.0.0.1:3100
npm run terms:check -- --base http://127.0.0.1:3100
npm run robots:check -- --base http://127.0.0.1:3100
npm run seo:check -- --base http://127.0.0.1:3100 --json
```

随后完成真实 Browser 的桌面/手机、Contact/Back/首页和键盘检查。只有本项必需 QA 全部补齐，才把看板改为 `待验收` 并请用户回复 `EDITORIAL-001 验收通过`；不能跳过验证直接验收或进入下一项。

## 5. 规则与未覆盖范围

本轮检查 CT-03/04、TR-07/10 的确认文案与证据边界；KW-01/02/05/13/16 的受控编辑与已验收句子；META-01/02/05/06/09 的源码/原始构建 metadata/schema；IDX-01/02/04 和离线 robots/sitemap；OP-05/09/10 的记录/代码/构建/超时门禁。

META-09 水合浏览器、PF-05 手机溢出、AY-03 键盘、LINK-08 实际 HTTP 目标及完整 SEO 尚未验证。KW-04、完整无障碍、真实设备/跨浏览器、SWF 内部操作、生产/现场 CWV、广告真实填充和 CMP 也不在本次已测结果内。既有 About 窄卡视觉提醒保持，未重新测量。

实际 Square/Oval 来源、权利人、托管/公开运行/再分发/生成图片权限仍 UNKNOWN；Gallery/locale 文字候选未做扩展修正。文案完成不是许可证、继续托管批准、生产验收或部署授权。

## 6. 本轮文件与看板

共 13 份实现/治理文件，原 v1.49 proposal-checks.json 未更改：

- `app/editorial-policy/page.tsx`
- `scripts/check-editorial-rights.mjs`
- `package.json`
- `scripts/README.md`
- `docs/legal/editorial-rights-consistency-proposal.md`
- `docs/quality/evidence/editorial-001-rights-copy/checks.json`
- `docs/quality/evidence/editorial-001-rights-copy/README.md`
- `docs/legal/game-rights.md`
- `docs/quality/evidence/release-2026-09-02/README.md`
- `LAUNCH_CHECKLIST.md`
- `PAGE_PLAN.md`
- `SEO_LOG.md`
- `F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html`

历史 v1.50 实施后焦点为 EDITORIAL-001，状态 `验证阻塞`。原 23 条验收与全部路线图任务保持，不新增 Editorial 验收。治理校验于 `2026-09-02T08:51:03.934Z` 通过：完整 JavaScript、静态/数据焦点、导出 1.50、JSON、文档历史、源码/产物哈希、package 单行/脚本说明单节范围、空白及两仓库 git diff --check 均通过（exit 0）。142 项原文件、7 份历史证据、CSS 与路线图不变；Git 既有 34 条 LF→CRLF 提醒保留。此治理通过不解除 HTTP/SEO/浏览器阻塞或实际许可/生产门禁。

## 7. 发布与回滚

发布状态仍 `不通过 / 未部署`。本轮已核对 HEAD 仍为 `c6d30087c2c03a7c4eb8d5bfe6e055e9b8d40228`，分支 `codex/game-platform-rebuild`；本轮未 commit、push、deploy、运行 seo:prod、在线回滚或启动 MIG-SQUARE-001。既有生产回滚候选属于原发布预检历史，本轮未重新核实，不称其为当前线上版本。

如用户要求回退，只用窄范围 patch 撤销本项五处文字、新检查器/npm 命令/脚本说明和相应治理增量；保留所有旧验收、历史证据和无关脏工作区。恢复的旧来源/许可表述不得作为可发布版本。没有线上变更，不需要在线回滚。临时检查脚本与日志位于 `C:/Users/liu/AppData/Local/Temp/mysquarefaceicon-editorial-001-impl-74eb09e3ed66458ab3bc69e2b75a8734`。

## 8. v1.51 启动重试仍受阻

用户明确要求“请帮我启动，你帮我验证”后，沿用同一隐藏窗口 Start-Process 渠道重试；工具仍在执行前返回 `CreateProcess: blocked by policy`。没有创建预览进程或 stdout/stderr 日志；2026-09-02T09:07:33.8207354Z 复查端口 3100 的监听数为 0。未更换启动方式或浏览器渠道规避拒绝。

本轮重新核对 146 项源码/检查/配置及现有 build `nEfpi7bM0YNUT_HgxJ895` 产物，与 v1.50 一致；未改应用、检查器、package 或构建，没有重跑 type/lint/回归。HTTP、完整 SEO、真实桌面/手机/链接/键盘仍未执行，不能宣称运行正常。v1.50 的 25 项通过记录及原失败尝试保留。

看板 v1.51 保持 `验证阻塞`；原 23 条验收、原始 proposal-checks.json、About/Terms/PF-01 证据不变。当前工具不能解除此启动限制，需要用户在项目终端执行上述 npm start 命令后再补齐 QA；不是方案未确认，也不是用户验收。此次仅更新 9 份看板/文档/证据记录，未部署、无线上回滚，不启动下一项。结构化明细见 checks.json 的 `runtimeRetryFollowUp`。

## 9. v1.52 用户启动后完成本地验证

用户回复“已启动”后，本轮核实 PID 34860 的 `127.0.0.1:3100` Next 生产预览；build `nEfpi7bM0YNUT_HgxJ895` 与 146 项源码/检查/配置、现有产物保持 v1.50 不变。Editorial/About/Terms/robots/sitemap 五路 HTTP 200 与构建字节一致；18 项代码检查及 5 项目标运行时检查最终通过，完整本地 SEO 20 页、0 must / 12 should。Browser 1280×900 / 390×844 的精确文案、metadata/schema、非空/无覆盖层/无横向溢出、控制台、Contact/Back/首页和 Tab/Enter 均通过，6 张截图已审阅。

| 验证范围 | 当前结果 |
|---|---|
| 页面标识、可见内容、框架覆盖层 | 通过；两视口均为 Editorial Policy，内容非空，无错误覆盖层 |
| 文字与 SEO 冻结 | 通过；五处与确认稿一致，1 H1 / 4 H2 / 3 H3 / 10 段、两条主链接、WebPage schema、KW-02 原句/3 次保持 |
| 控制台与响应式 | 通过；desktop/mobile 导航日志均无 warning/error，scrollWidth = clientWidth，无正文越界 |
| 实际交互 | 通过；桌面 Contact → Back → Tab/Enter 返回首页；手机 Tab/Enter Contact → Back → 点击返回首页，15 次焦点均可见 |
| 截图 | 6 张已审阅：桌面/手机首屏与全页、桌面返回焦点、手机 Contact 焦点；绝对路径与时间见 JSON |
| Type / lint / 既有回归 | 18 项 exit 0；GAME-TPL 原 fetchPriority warning 保留 |
| HTTP / robots / SEO | 5 项最终目标检查 exit 0；20 unique sitemap URL，无新增 lastmod；11 crawler 分流符合确认策略 |
| Next / Cloudflare/OpenNext | 未重建；沿用 v1.50 已通过构建，当前产物哈希相同；原 OpenNext Windows warning 保留 |

本次初始 HTTP 检查组有一项 exit 2：npm 的 robots:check 自带 localhost:3000，再追加 3100 后，脚本 indexOf 读取了第一个 --base。它不是 3100 页面失败。保留原失败日志，并以单一明确目标重跑通过，未修改检查器来放宽断言：

```powershell
node scripts/check-ai-crawler-policy.mjs --base http://127.0.0.1:3100
```

此前用户启动排障还区分了错误目录与 Windows PowerShell 参数传递问题；`npm.cmd run start -- -H 127.0.0.1 -p 3100` 的帮助模式已证明能正确传参。用户随后报告已启动，本轮独立核实端口、完整进程命令和构建/HTTP 一致性。没有将过去的策略拒绝改写为成功启动，也没有再代为启动或重启服务。

本地页面必需项为“通过”；视觉为“有条件通过”，仅保留既有桌面 Page Quality Rules 卡片偏窄、换行频繁的提醒，未改冻结 CSS。META-03 ×7、META-04 ×4、KW-03 ×1 共 12 条应该级提醒保持，不跨任务改写。KW-04 新 SERP、真实手机/跨浏览器/读屏、SWF 内部、生产与现场 CWV、广告/CMP、实际许可和看板文件视觉不在本轮通过范围内。

未改应用或重新运行 Next/OpenNext 构建；原 v1.50 构建/失败记录、v1.51 重试、7 份历史证据及 23 条验收保持。既有桌面窄卡为非阻断视觉提醒，实际许可 UNKNOWN、其它文案候选、12 should/KW-04 与生产门禁仍开放。看板 v1.52 仅推进到 `待验收`，等待 `EDITORIAL-001 验收通过`；未提交、推送、部署、运行 seo:prod 或启动下一项/MIG-SQUARE-001。

本轮仅修改 9 份治理/证据文件：本目录 README/checks.json、Editorial 方案、game-rights、release-2026-09-02 README、LAUNCH_CHECKLIST、PAGE_PLAN、SEO_LOG 与权威 HTML 看板。截图在仓库外的 `C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/editorial-001-v1.52/`。没有线上变更；回退只撤销本轮治理增量，保留已有应用改动与验收历史。

v1.52 治理校验：通过；看板 JavaScript、静态/数据焦点、导出 1.52、JSON、文档历史、146 项源码/产物哈希、6 张截图文件和两仓库 git diff --check 均通过。原 23 条验收、v1.50/v1.51 原始证据与 7 份历史文件保持；看板文件视觉仍未验证。精确起止时间、退出码和 Git 提醒见 runtimeValidationFollowUp.governanceValidation。

## 10. v1.53 用户验收记录

2026-09-02（记录时间 `2026-09-02T10:24:29.697Z`），用户明确回复 `验收通过，请进行下一步开发`。v1.53 将 EDITORIAL-001 记录为 `已完成（本地已验收） / 生产未验证 / 未部署`，新增第 24 条源验收；原 23 条验收及 v1.50/v1.51/v1.52 的检查、失败、构建和截图日期保持。原 checks.json 逐字节保留，SHA-256 `72f7ff3be63a9e3b14a41a3f651a336c57f7d74d59785fb9173cd2af36117d52`；其 runtimeValidationFollowUp 的“待验收”仅代表 v1.52 历史时点，不撤销本次验收。

本轮仅记录验收并开启下一项方案；146 项应用/检查/配置与现有 Next/OpenNext 产物不变，没有重新执行 type/lint/测试/构建/HTTP/SEO/Browser/移动或性能检查，也不声称预览当前仍在运行。v1.52 的 20 页 0 must / 12 should 与本地浏览器结果保留原日期。实际许可 UNKNOWN、既有桌面窄卡提醒、12 should/KW-04 与生产门禁仍开放；没有提交、推送、部署、seo:prod 或 MIG-SQUARE-001。

按同一句下一步指令，仅开启 GALLERY-001 六处来源/权利文字方案，见 `docs/legal/gallery-rights-consistency-proposal.md` 与 `docs/quality/evidence/gallery-001-rights-copy/proposal-checks.json`。质量监管 skill 与 KW-13 要求先确认段落替换；等待 `确认 GALLERY-001 示例来源与权利声明修正方案`，不能把本次 Editorial 验收视为 Gallery 文案批准。
