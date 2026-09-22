# ABOUT-001 · 权利与示例来源文案实施证据

实施证据原记录时间：`2026-09-02T07:00:24Z`；本地验收记录时间：`2026-09-02T07:50:25Z`。权威状态以 Liu-library HTML 看板 v1.48 为准；本文件只归档证据。

当前结论：用户明确回复 `ABOUT-001 验收通过`，任务 `已完成（本地已验收） / 生产未验证 / 未部署`。沿用 v1.47 的实施与必需检查 `通过`、视觉 `有条件通过`（既有桌面窄列使长说明换行较多，无溢出或截断）；本轮没有重测。全局发布仍 `不通过 / 未部署`。

## v1.48 本地验收记录

- 验收来源：用户明确回复 `ABOUT-001 验收通过`；仅验收已确认的七处本地文案与 v1.47 既有 QA，不授予实际许可，也不是部署批准。
- 本轮只同步验收治理；145 项源码/检查/配置哈希与 v1.47 归档相同。应用、检查器、package、Registry、SWF、播放器、构建产物和预览进程均未改动；未启动下一项。
- 25 项原必需命令、原始输出/退出码、浏览器记录与原治理校验保留原日期；没有重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/browser/移动或性能检查。旧预览 PID/链接仅为 v1.47 快照，本轮没有重新确认服务存活。
- 原 22 条验收、Terms/PF-01 证据、CSS 与路线图保留，ABOUT-001 是第 23 条源验收。治理一致性复核单独记录于 `checks.json.acceptanceFollowUp`；看板视觉仍未验证。
- 实际权利 UNKNOWN、其它文案候选、桌面窄列提醒、12 should、KW-04 与生产门禁仍开放。等待用户下一步指示，不自动开展开发、提交、推送或部署。

本轮仅更新以下 9 份治理/证据文件；不是新增页面或应用功能：

- `docs/legal/about-rights-consistency-proposal.md`
- `docs/legal/game-rights.md`
- `docs/quality/evidence/about-001-rights-copy/README.md`
- `docs/quality/evidence/about-001-rights-copy/checks.json`
- `docs/quality/evidence/release-2026-09-02/README.md`
- `LAUNCH_CHECKLIST.md`
- `PAGE_PLAN.md`
- `SEO_LOG.md`
- `F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html`

下方实施范围、自动检查、浏览器和问题修正均为 **v1.47 历史证据**，不能视为 v1.48 新执行的检查。

## v1.47 实施范围（历史证据）

- 用户确认：`确认 ABOUT-001 权利与示例来源声明修正方案`。
- `/about-us` 仅七处文字：metadata.description、Twitter description、两处 H2/H3 和三段示例/权利说明。区分首页选编、Gallery 样式示例与审核投稿；不将选编、审核或文件可运行当作授权。
- Title/H1、URL/canonical/index、OG 全字段、其它 Twitter 字段、两份 JSON-LD、布局/类名/import、8 个主内容 href、KW-02 句与 3 次正文覆盖均保持。
- `site's` 在 JSX 中写为 `site&apos;s` 以满足现有 lint；浏览器与原始 HTML 解码后仍逐字等于确认稿，不是额外文案变更。
- 新增 `scripts/check-about-rights.mjs`、`about:check` 命令与脚本说明。没有新增客户端代码、运行时依赖、图片、路由或日期字段。
- About 源码、检查器、package/脚本说明及本证据、方案、法律后续、PAGE_PLAN、LAUNCH_CHECKLIST、SEO_LOG、发布证据、权威看板共 13 个文件改变。完整清单与 hash 在 [checks.json](checks.json)。v1.46 的 [proposal-checks.json](proposal-checks.json) 保持原样。

## 环境与自动检查

- 本地 production：[About](http://127.0.0.1:3100/about-us)，Next.js 14.2.35、Node v22.16.0。
- 新 preview PID `30888`，仅监听 `127.0.0.1:3100`；先核对并停止此前属于本任务的 PID `17016`，未触碰其它 Node 进程。
- Build ID：`QAzQpeJrYWF2m8Ey8itpk`。这不是生产部署版本。

| 检查 | 结果 / 证据 |
|---|---|
| TypeScript `--noEmit` | 通过，exit 0 |
| `npm run lint -- --max-warnings 0` / 检查器 ESLint | 通过，0 warning/error |
| `about:check` 源码 / `--built` / `--base` | 通过；14 源码负例与 6 原始 HTML 负例全部拒绝 |
| `terms:check` 源码 / 构建 / HTTP | 通过；既有 6+2 负例通过，Terms 源码不变 |
| `canonical:check` / 11 组既有功能回归 | 通过；GAME-TPL 既有 React `fetchPriority` warning 保留 |
| Next.js build | 通过，42 routes；About 185 B / First Load JS 87.5 kB；middleware 26.8 kB |
| Cloudflare/OpenNext build | 通过；Worker bundle 与项目 patch 完成，Windows compatibility warning 保留 |
| 原始 HTTP / 构建一致性 | About、Terms、robots、sitemap 均 200，响应 bytes hash 与对应构建产物相同 |
| robots / sitemap | 11 crawler（6 block / 5 allow）；20 唯一 URL，包含根页，无 lastmod 或 noindex scaffold |
| 完整本地 SEO | 20 页，0 must / 12 should，exit 0；无新增提醒 |
| 超时与退出码 | 每项命令有 30–360 秒上限、开始/结束时间、输出日志和明确退出码；详见 checks.json |

12 条 should 仍为 META-03 ×7、META-04 ×4、KW-03 ×1，不因本项通过而关闭。About 两个 description 当前为 153/134 字符；KW-04 语义/SERP 覆盖未复审，不用词频替代。

可复跑的关键命令：

```powershell
npm run about:check
npm run about:check -- --built
npm run about:check -- --base http://127.0.0.1:3100
npm run terms:check -- --base http://127.0.0.1:3100
node scripts/check-ai-crawler-policy.mjs --base http://127.0.0.1:3100
npm run seo:check -- --base http://127.0.0.1:3100 --json
```

`robots:check` 的默认命令固定 3000 且取第一个 --base，所以此处调用同一个检查器并显式传 3100；没有修改端口规则或静默测试错误实例。最终 type/lint/11 回归于 06:55–06:56 UTC 重跑完毕；两种构建于 06:45–06:47 UTC 完成，之后只修正测试夹具和治理记录，应用源码与构建验证边界一致。

## 浏览器与交互

Browser 可用，全程复用本任务的 in-app Browser 连接，无 Playwright/Chrome/其它通道回退。检查流：About → Terms / Gallery → 浏览器返回 → 首页；原生 Tab 焦点与 Enter 激活。

| 必需检查 | 1280×900 | 390×844 |
|---|---|---|
| URL / title 身份、非空正文 | 通过 | 通过 |
| 单一 H1、5 H2 / 7 H3 / 16 段、确认文字可见 | 通过 | 通过 |
| canonical、description、OG/Twitter、两份 JSON-LD | 通过 | 通过 |
| 无 framework overlay、无相关控制台 warning/error | 通过 | 通过 |
| 无横向溢出 / 隐藏正文 | 通过 | 通过 |
| Terms、Gallery、首页与浏览器 Back | 通过 | 通过 |
| Tab / Enter 与可见焦点 | 返回首页通过 | Terms / Gallery 通过 |

16 个跳转/返回状态、26 个逐步 Tab 焦点记录保存在 checks.json。Gallery 当前显示没有已审核评论；本项使用 `when available`，未捏造已有投稿。视口检查完成后已恢复默认视口，预览留在 About。

已查看首屏、全页、重点权利段与手机焦点共 8 张截图。截图位于仓库外：

`C:/Users/liu/.codex/visualizations/2026/08/31/01a05526-6633-7392-a18d-c5feb0af9cc1/about-001/`

每张文件路径/大小/SHA-256 见 checks.json。已有桌面 feature-grid 的窄列仍然存在；新说明较长，卡片纵向更高。文字没有裁切，本次明确冻结 CSS/布局，因此仅作为非阻断视觉提醒，不擅自改版。

## 本轮发现并修正的问题

1. 原始页面的 red test 预期 exit 1，证明旧文案不能通过新规则。
2. 首轮 lint 拦截确认稿中的 JSX 撇号；使用 `&apos;` 后页面可见文字不变，最终 lint/type/构建通过。
3. 首轮 HTML 负例误改 Header 的 Gallery 链接，未触及所测 main，导致“应抛错却未抛错”。已限定到 main 内唯一的 Gallery 卡片，6 个原始 HTML 负例重新通过；页面本身未为此改变。

完整失败输出与后续通过输出都保留在 checks.json，不隐藏先前失败。Git 原有 LF→CRLF 提醒同样保留。

## 冻结边界与未关闭事项

- About 当前 SHA-256：`bd812baed9b69e531d369be6e0be168dc5232d3729def0d7f5a747fbccbf1779`。
- 七区外掩码 SHA-256：`1fa66ad37bc918b8f99b2fd907e8b2c0e32db8435d71a6c1badca8c3cf689e27`。
- 去掉仅用于 JSX 的实体转义后，源码 SHA 与已确认内存拟稿一致。107 个 TERMS 基线文件中仅 About/package 改变，其余 105 个保持；本轮扩展检查的 144 个既有文件中仅 About/package/脚本说明改变，141 个保持。
- Registry、Square/Oval SWF、播放器、已验收 Terms、其它页面、lockfile 均未改；没有提取、反编译或新增许可材料。
- Square/Oval 实际来源、权利人、托管/公开运行/再分发及生成图片权限仍 UNKNOWN。文字变得审慎不等于获得授权。
- `lib/locales.ts` 的旧字段及其它公开来源声明仍为独立后续；不声称全站已清理。KW-04、真实设备/跨浏览器/完整 SWF 交互、现场 CWV、完整可访问性及广告/CMP 本次未验证。
- 生产 OP-11、AI-01、PF-01、Terms/About、版本关联与 seo:prod 未验证。原 PF-01 数字未重测、不改写。
- 看板本地文件此前的 Browser 策略限制继续尊重；只做 JS/静态/导出与状态一致性校验，看板桌面/手机视觉仍未验证。

## 看板、部署与回滚

历史 v1.47 只记录 `ABOUT-001 待验收`，未推定用户验收。用户随后明确验收，本轮 v1.48 新增 ABOUT-001 源验收记录，任务为 `已完成（本地已验收）`；原 22 条验收保持，生产未验证，未启动下一项或 MIG-SQUARE-001。

没有 commit、push、部署或 seo:prod；没有新的生产 SHA/Worker 版本，无需线上回滚。若用户退回，只修正本项；如要求回滚，仅回退七处文字及检查器/package/治理增量，保留先前验收与无关工作区改动。恢复无证据的旧措辞会重新打开内容门禁，禁止用 reset 清理脏工作区。

历史 v1.47 治理复核于 `2026-09-02T07:09:01.429Z` 通过：看板完整 JS、静态/数据焦点、v1.47 导出、文档/JSON/空白和两个仓库 diff check 均通过；145 个当前源码/检查/配置与 8 张截图 hash 对得上，历史方案证据不变。22 条既有验收、Terms/PF 证据、CSS/路线图保留，仅追加本项实施记录，没有 ABOUT 用户验收记录。

v1.48 验收已记录，等待用户下一步指示。本轮仅更新验收治理，无线上变更或回滚；如需更正验收记录，只回退本次治理增量，不重置应用或抹除原证据。

v1.48 验收治理复核于 `2026-09-02T07:56:56.917Z` 通过：看板 JavaScript、静态/数据焦点、导出 1.48、JSON/文档一致性/空白及两个仓库 `git diff --check` 均通过（exit 0）。23 条验收含本次明确来源，原 22 条验收、25 项命令及日期、浏览器与原治理记录、Terms/PF-01、CSS/路线图和 145 项源码/检查/配置哈希均保持。原 Git LF→CRLF 提醒保留；本轮没有应用重测、预览存活复核、下一项或部署，看板视觉仍未验证。详见 `checks.json.acceptanceFollowUp.governanceValidation`。
