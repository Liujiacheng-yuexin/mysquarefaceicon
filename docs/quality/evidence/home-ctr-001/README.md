# HOME-CTR-001 · 本地交付证据

日期：2026-09-22；环境：Windows / Node / Next 14.2.35；分支 `codex/game-platform-rebuild`，HEAD `c6d30087c2c03a7c4eb8d5bfe6e055e9b8d40228`，大量原有未提交成果。本轮不提交、推送或部署。

结论：本轮首页摘要及定向验证 **通过**，任务提交 **待验收**；完整历史回归与整站发布 **不通过**。线上 SEO、CTR 效果、真机移动、CWV **未验证**。本地部分成功不关闭其它发布门禁。

## 修改清单与边界

- `data/games/square-face.ts`：只改变 `seo.title` 与 `seo.description`；对照本轮开始前的完整文件副本，替回这两处后逐字相等。H1、canonical、搜索意图、正文、图片、player、索引与 URL 不变。
- `scripts/check-square-homepage.mjs`：在旧记录 hash 前精确校验本次两条新文案，再还原旧两字段用于历史 oracle；保留原 hash 和所有其它断言，没有放宽 IMG 的旧模型失败。
- `docs/seo/home-ctr-2026-09-22.md`：关键词映射、报告事实核对、完整新旧文案、待确认的首页移动编辑器单页方案。
- `SEO_LOG.md`：追加本地变更及未部署说明。
- 本目录：命令输出与检查记录。
- 外部权威看板 `F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html`：增加当前增量 HOME-CTR-001，待验收，26/61、37 个原验收键。未给本任务增加验收，未覆盖 IMG-001 的原始证据。

受影响 URL 只有 `/` 的搜索/分享摘要；没有完成新页面或移动编辑器。本轮未把用户提供的第三方流量、排名、因果推断和互相冲突的月搜索量当作已独立验证事实。

## 实测结果

| 检查 | 结果与证据 |
| --- | --- |
| TypeScript `--noEmit` | 通过，`type.json` |
| Next lint | 通过，0 error / 0 warning，`lint.json` |
| metadata 专项 | 通过，Game Data / OG / Twitter / H1 / canonical 契约，`metadata.json` |
| Ruffle 专项 | 通过，5 个 runtime 文件及 10 个负例，`ruffle.json` |
| Next build | 通过，42 个静态生成页面，`build.json`；Ruffle 前置检查已单独执行，平台构建又完整执行 npm build |
| `npm run cf:build` | 通过，Worker 生成及补丁成功；保留官方 Windows 兼容性 warning，`platform.json`；没有上传或部署 |
| 本地 production HTTP | 200；六个新 metadata 字段逐一吻合，唯一 H1、原 canonical，`http.json` |
| `seo:check` | 20 页，0 必须级失败、11 应该级提醒，均在其它页；`seo.json` |
| 修改前专项基线 | metadata / images / home-hero 均通过；images 检查 29 图、8 条 Game Data 记录和 18 个负例 |
| `square-home:check` | 修改前后均失败于同一 `lib/games/game-player-model.ts` 冻结 hash；修改后完整输出见 `square.json`。actual `26b6695fba8b6a5956d499ecfa2f61c0747b39cafd2d216ed23ba1879adabe78`，expected `42672e8d0917e9d7d6a1b28137e505ecd4d7b09ba40e3c971751b6d7f3fbe84c` |
| 脚本语法 / diff whitespace | 修改过的 checker `node --check` 通过；`git diff --check` 通过，保留仓库现有 LF/CRLF 提醒 |
| 桌面浏览器 | 本地 1213px 宽，scrollWidth 1198；标题、description、OG/Twitter、canonical 与唯一 H1 吻合，首屏工具可见。工具截图已检查 |
| 移动浏览器 | 390×844，clientWidth = scrollWidth = 375，无横向溢出；播放器预览 top 474.02px，首屏可见。工具截图已检查；这不是实际手机触屏或保存功能验证 |
| 看板 | JavaScript 语法与数据验证通过；26/61、原 37 验收键，焦点 HOME-CTR-001 待验收；浏览器详情按钮打开正确任务，无 warn/error；`board.json` |

适用规则：META-01～04/08、KW-01/05/11/16、CT-03/04、IDX-01～07、OP-05。保留原有页面结构与语义；自动 SEO 检查验证位置覆盖/入链/索引等可自动检查项。KW-04 最新 SERP 十站语义覆盖、CT-06 人工验收本轮未宣称通过。

一次临时 HTTP 断言最初错误地要求 canonical 尾斜杠而失败。原始 HTML 为 `https://mysquarefaceicon.com`，浏览器 URL 属性规范化为带斜杠，两者指向同一根页；断言按现有原始字符串修正后通过，没有修改应用 canonical。

## 未关闭事项与验收

原图片角色改动已存在于当前源码，而看板此前仍显示 IMG-001 方案阶段；本轮未擅自补签或验收该任务。历史冻结回归仍需在原任务范围内对账，不能把当前平台 build 通过当作完整回归通过。既有 Square/Oval 权利 UNKNOWN、人工事实审核与生产门禁保持；已经取消的材料请求不恢复。

请先验收这两条首页文案及本地证据。首屏编辑器方案在上述 SEO 文档中可单独审阅；项目要求明确确认后才能编码。`/square-face-icon-generator` 内容和内链补强未实施，也没有扩展或删除其它页面。

回滚：恢复 SEO 文档中记录的原 title / description，并删除 checker 对这两字段的精确 delta 适配；重新验证 metadata / build / SEO。只回滚本任务的新增文档、SEO_LOG 行和看板增量，不 reset 原有工作树，不覆盖任何历史验收。本轮临时服务结束后关闭。
