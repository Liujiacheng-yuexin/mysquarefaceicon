# TERMS-001 · Terms 权利声明一致性修正方案

状态：`本地已验收 / 生产未验证 / 未部署`。2026-09-02，用户明确回复 `TERMS-001 验收通过`，验收记录时间为 `2026-09-02T05:42:21.798Z`。v1.43 的精确文字修正及构建、v1.44 的 HTTP/SEO/桌面与手机验证证据原样保留；本轮仅同步验收记录，详见第 10 节。不自动启动下一项或 MIG-SQUARE-001，不提交、推送或部署。实际授权与生产验证门禁仍独立开放。

这是基于项目证据的文案与实现草案，不是法律意见、确权结论或许可文件。正式法律条款及实际托管权限应由有资质的专业人士结合适用法律和原始授权资料复核。修正文案不等于获得授权，也不解除底层 License Gate。

## 1. 当前事实与范围

目标页面：`/terms-of-service`；文件：`app/terms-of-service/page.tsx`。

| 方案确认前内容 | 证据冲突 | 本次处理范围 |
|---|---|---|
| `Authorized Game File` / `authorized SWF` | Registry 未核实精确 Square/Oval 二进制的来源、权利人及托管/公开运行权限 | 替换该 H2 和紧随的一段正文 |
| Generated Icons 无条件允许个人头像、个人项目用途 | 两条记录的 `permissions.generatedOutputUse` 均为 `UNKNOWN` | 只替换该节的一段正文，不把未知解释成已许可或已证实侵权 |
| `Last updated: May 21, 2026` | 下一次实际修正文案将是实质更新 | 只在实施时按实际实施日更新；不在本方案阶段改页面或伪造部署日期 |

v1.42 方案轮只做方案和 PF-01 验收记录，未改页面或数据。KW-13 要求明显错误的原段落也须先经用户确认后替换；该确认门现已满足，v1.43 的实际实现与验证状态见第 8 节。

## 2. 单页布局 / SEO / 交互约束

- 布局：保留 `legal-page`、返回链接、H1、日期、现有 7 个 H2 与 8 个段落的顺序及标签结构；只改指定文字，不新增模块、按钮、横幅或免责声明弹窗。
- SEO：保持 URL、title、description、H1、canonical、schema、index/noindex、robots、sitemap、搜索意图不变。不借本任务处理原有 META-04 description 提醒。
- KW-02：保留首段已验收的完整增补句；主内容区 `terms of service` 仍为 3 次。先保障事实与可读性，不为词频增加重复免责声明。
- 交互：`Back to Square Face Generator → /`、`contact page → /contact` 保持普通链接、标签和可访问名称不变；Comments and Uploads、No Warranty、Future Changes、Contact and Corrections 均保持。
- 权利：不改 Registry 的 `UNKNOWN`、发布策略、exact-file hash 或 Pixel 的 DIRECT_LINK_ONLY；不引用当前第三方条款为本站精确 SWF 作授权背书。

## 3. 拟替换的精确英文文案

### A. Generated Icons 正文

保留 H2 `Generated Icons`；用下列一个段落替换其正文：

> We have not verified personal or commercial usage permissions for images produced by the Square and Oval Flash games on this site. These terms do not grant a license to third-party game artwork or generated images. Before using an image, check the applicable license or obtain the permission needed for your intended use.

### B. Game File 标题与正文

将 `Authorized Game File` 改为：

> Third-Party Game Files

该 H2 后只保留一个正文段落，替换为：

> The Square and Oval players run third-party Flash (SWF) files through Ruffle. We have not verified the original source, rights holder, or permissions to host, publicly run, or redistribute the exact files used here. Availability on this site must not be treated as proof of authorization or official affiliation. These terms do not grant permission to extract, redistribute, or reuse third-party game files.

### C. 可见更新日期

采用实际实施日的英文日期；若于 2026-09-02 实施，则为 `Last updated: September 2, 2026`。这是内容更新日，不表示已上线或已完成法律审核。

## 4. 验证与验收标准

确认后只按上面的三处边界实施，并添加/扩展针对性回归，不重写整页。

1. 原始 HTML 和源码均不存在旧的 `Authorized Game File`、`authorized SWF` 或无条件个人用途授权句；两个确认段落各出现一次。
2. 保留一个 H1、7 个 H2、8 个段落、现有 class/import、两个 href、首段完整 KW 增补句；metadata 与当前冻结值相同；`terms of service` 正文命中保持 3 次。
3. Registry 及 Square/Oval SWF hash 不变，PF-01 播放器代码不变；不新增游戏、资源复制或许可结论。
4. `npx tsc --noEmit`、`npm run lint`、相关页面/metadata/player/route 回归、`npm run build`、`npm run cf:build`；每项记录退出码，失败不隐藏。
5. 对运行中的本地 production build 执行 robots/SEO 检查，必须级保持 0；现有 12 条 should 单独报告。默认 3000 若被其它项目占用，使用已验证的空闲端口并显式传 `--base`，不停止无关服务。
6. Browser 验证 `/terms-of-service` 的桌面与 390px 页面身份、可见文字、无错误遮罩/横向溢出、控制台、返回首页与 Contact/Back；确认无意外的新 JavaScript 或布局变化。
7. 更新本方案、证据、PAGE_PLAN、LAUNCH_CHECKLIST、SEO_LOG 和权威 HTML 看板；状态仅为 `待验收`，等待用户回复 `TERMS-001 验收通过`。

## 5. 明确保留的阻断与未覆盖范围

- 文案修复后，Square/Oval 的 exact source、rights holder、host/public-run/redistribution/generated-output 权限仍为 `UNKNOWN`；不能将同意本方案解释为同意再发布这些 SWF、允许商业化或确认托管合法。
- 需要分别补齐两款游戏的精确文件来源/交付记录、权利人或有权许可方、涵盖实际托管及使用方式的许可、生成图片权限。没有材料时维持现有 License Gate，不自行下架、迁移或替换游戏。
- `lib/locales.ts:101` 仍存在 `authorized SWF` 源字符串；`app/about-us/page.tsx:113` 的 `provided for this project` 不能作为授权证明。它们不在本单页补丁范围，后续应分别核对实际渲染和含义；本任务不宣称全站公开权利文案已清零。
- OP-11/AI-01/PF-01 的生产复测、12 条 SEO should、commit/push/deployment 版本链路及 `seo:prod` 仍独立存在；全局发布继续 `不通过 / 未部署`。
- 本方案不是暂停现有生产服务的指令，也不是继续托管的授权；本轮不联系权利人、不接受任何第三方协议、不修改 Cloudflare/DNS、不提交或部署。

## 6. 依据与证据边界

项目事实来源：`data/game-license-registry.json`、`docs/legal/game-rights.md`、`SEO_RULES.md` 第 6 节、`RULES.md` CT-03/CT-04/TR-07/TR-08/TR-10/KW-13。两款 SWF 在本轮仅做 hash 读取，没有反编译、修改或复制。

2026-09-02 的一手资料复核：

- [IconGenerators 官方条款](https://www.icongenerators.net/terms.html)区分生成图片使用与生成器/站点资源的复制、嵌入和再分发限制。它是既有来源风险参考；项目没有证据把当前条款或该站历史版本绑定到本站两个精确 SWF，不能外推授权。
- [美国版权局：使用他人作品与许可 FAQ](https://www.copyright.gov/help/faq/faq-fairuse.html)说明权利人识别、许可与具体使用情形的重要性，也提到法定例外。此为一般背景，不用于认定本项目适用法、侵权与否或全球合规。

方案前冻结 SHA-256：

| 文件 | SHA-256 |
|---|---|
| app/terms-of-service/page.tsx | 5E64E81F600C958B869491C6B801BD94CA71742561CCD9E9BDC09FF6BE8591A4 |
| data/game-license-registry.json | FB0B94F56FFA3C7FECA89EE136C73795A95D993DE0EBE16D81CA8041DA4A8924 |
| public/games/square-face.swf | B1D074C95F15B7DCECDBC2405ABF820EAD985669BB12CD47247FC8EA7537BC1E |
| public/games/oval-face.swf | 80E974D8EF4AD5E849E93464EAEA1833620C269BAC30601D960F5438C285E09B |
| components/game-player/GamePlayer.tsx | 142CF22AC3A485C78285D920BBE84114F3931A38F0E9AEC067BBF8CA2E562D5C |

## 7. v1.42 方案轮交付、回滚与确认（历史记录）

本轮方案检查：在内存中按上述三处边界预演替换，TypeScript JSX 语法检查通过；H1=1、H2=7、正文段落=8、主词命中=3，metadata 与其它源区域完全不变；未写入应用文件，Terms 的 SHA-256 仍为上表值。这不是整项目 type-check、框架构建、浏览器/移动端或线上验证；这些检查须在确认后的真实实现上执行。

看板 v1.42 检查 `exit 0`：完整脚本语法、静态/数据焦点、PF-01 验收记录、既有验收与三组性能数组不变、TERMS-001 尚未验收、MIG-SQUARE-001 尚未启动、导出版本、底层许可阻断均通过；CSS 与原始路线图数据 hash 不变。上表五个文件 hash 全部不变，项目及权威看板的 `git diff --check` 通过。看板桌面/移动视觉未复跑：上一轮浏览器安全策略拒绝本地文件 URL，此轮未绕过或改走其它浏览器通道。

本轮仅修改以下治理文件，不修改任何公开页面或资源：

- `docs/legal/terms-rights-consistency-proposal.md`：新增本方案、精确文案、验证范围及本轮检查记录。
- `docs/quality/release-performance-remediation-proposal.md`、`docs/quality/evidence/pf-01-activation-response/README.md`：记录用户的 PF-01 本地验收，保留原始测试时间与证据边界。
- `docs/quality/evidence/release-2026-09-02/README.md`、`LAUNCH_CHECKLIST.md`：把 Terms 文案阻断与实际许可阻断分开，保留未部署及生产未验证。
- `PAGE_PLAN.md`、`SEO_LOG.md`：追加验收与下一单页方案历史，不把治理更新当作生产 SEO 变更。
- 权威看板 `F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html`：v1.42，PF-01 本地已验收，当前焦点 TERMS-001 方案待确认。

本轮结论：方案/治理源码检查 `通过`；TERMS-001 实现、页面桌面/移动视觉、整项目 type/lint/test/Next/Cloudflare build、SEO/性能复测 `未验证（未实施或未复跑）`；全局发布 `不通过 / 未部署`。没有新增生产版本、远端 SHA 或线上回滚操作，旧生产回滚候选仅保留在发布证据中，真正发布前需重新核实。

方案阶段只更新治理记录，没有页面/数据/部署回滚。未来实现若需回滚，仅撤销本次三处文字改动和对应测试，不重置累计工作树；恢复旧文案会重新引入权利声明阻断，不能回滚后宣称已解决。

当时的确认门为 `确认 TERMS-001 权利声明修正方案`，用户现已明确确认。完成实现与必需验证后仍需另一次 `TERMS-001 验收通过`，不会自动部署或进入下一任务。

## 8. v1.43 确认后实施与验证阻塞（历史记录）

仅第 3 节的两段正文、一个 H2 和实际内容更新日期（September 2, 2026）已写入 Terms。新增 `npm run terms:check`，支持源码、`--built` 离线构建产物与 `--base` 本地 HTTP 检查。确认文案逐字匹配；剩余源码掩码 hash 不变；H1=1、H2=7、p=8、主词=3、两条链接保持。

源码/构建范围 `通过`：先用旧页获得预期失败，再通过六个源码负例、两个 HTML 负例、类型、零警告 lint、新脚本 lint、canonical、11 项既有回归、Next 42 routes 与 Cloudflare/OpenNext build。105 个既有受保护文件中仅 Terms 与 package 的新增测试命令发生变化；Registry、两份 SWF、GamePlayer、其它页面、依赖均不变。离线产物保留 20 个唯一 sitemap URL、11 crawler 策略、原有脚本清单和 schema 数量。

后台预览启动组合命令被工具在执行前以 `CreateProcess: blocked by policy` 拒绝；后续只读查询显示 3100 无监听。没有换服务、浏览器或通道绕过。Browser 可用，但页面身份、控制台、截图、桌面/390px 交互、原始 HTTP/响应头及完整 `seo:check` 均 `未验证`；此前 0 must / 12 should 只是历史记录，不冒充本轮结果。

证据及变更/回滚清单：`docs/quality/evidence/terms-001-rights-copy/README.md`、`checks.json`。当时权威看板 v1.43 的状态为 `已阻塞`；本轮继续验证的结果见下节，原始拦截记录保留，不追认当时尚未执行的检查。

## 9. v1.44 启动与运行验证（2026-09-02，历史记录）

用户要求 `请帮我启动并且进行验证` 后，同一终端/启动方式本次正常执行，未更换工具、shell、host 或浏览器绕过原拦截。本地 production 预览运行在 `http://127.0.0.1:3100/terms-of-service`，PID 17016，并保留供用户验收。

原始 Terms、robots、sitemap 均 200 且与上轮构建产物 hash 一致；Terms 精确文案、日期、metadata、主词 3 次、两条链接、6+2 负例通过。完整本地 SEO 检查 20 页，0 必须项 / 12 原有应该提醒；11 crawler 分流通过。类型、零警告 lint、新检查器 lint、canonical 和 11 项回归本轮重新执行全部 exit 0。Next/OpenNext 沿用 v1.43 的 exit-0 构建，未边运行边重建；当前应用源码未改动。

Browser 的 1280×900 与 390×844 页面身份、非空、无错误遮罩、无横向溢出、截图、控制台、Contact/Back/首页跳转及两条链接的 Tab/Enter 验证通过。保留 1 H1、7 H2、8 段正文、原 schema/脚本边界；视口已恢复默认。截图、DOM、日志与 hash 见证据文件。

v1.44 当时仅进入 `待验收`，等待 `TERMS-001 验收通过`。文案一致性不等于许可，UNKNOWN 和其它权利文案候选保持独立；全局发布仍 `不通过 / 未部署`。KW-04、现场/生产 CWV、生产 SEO/跳转及看板浏览器视觉未在该轮验证。无应用代码、生产配置、commit、push、部署或 MIG-SQUARE-001 变更；无需线上回滚。

## 10. v1.45 用户验收记录（2026-09-02）

用户明确回复 `TERMS-001 验收通过`，本项改为 `已完成（本地已验收） / 生产未验证 / 未部署`，同步权威看板与验收证据。该验收只覆盖已确认的两段正文、一个 H2、实际日期及既有本地验证，不授予第三方许可，不等于生产发布通过。

本轮仅更新治理记录；受保护应用文件 hash 与 v1.44 一致，type/lint/回归/Next/OpenNext/HTTP/SEO/浏览器/性能均未重跑，原证据及日期保持。实际许可 UNKNOWN、其它权利文案候选、12 should 与生产门禁继续开放。等待用户下一步指示，不自动开启下一发布阻断项或 MIG-SQUARE-001，不提交、推送、部署或执行线上回滚。治理校验见 `docs/quality/evidence/terms-001-rights-copy/checks.json` 的 `acceptanceFollowUp`。
