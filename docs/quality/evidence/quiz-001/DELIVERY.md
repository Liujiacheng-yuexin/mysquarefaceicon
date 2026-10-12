# QUIZ-001 · Friend Block Test 本地交付

日期：2026-10-12（Asia/Shanghai）。**本地工程通过，任务待验收；整体有条件通过，发布门禁尚未闭合。**

用户确认：`确认 QUIZ-001 方案，继续本地开发`。本轮在现有 `main` 实现和验证，没有新分支、commit、push、部署、IndexNow 或 GSC 写入。基线与当前 HEAD 均为 `1d275c678a1e15170a8e836b2c540ab3c68ea8f6`；收尾 fetch 后与 origin/main 为 0/0。

- 本地预览：<http://127.0.0.1:3112/games/friend-block-test>
- [确认方案](../../../product/friend-block-test-proposal.md)、[原始规格](../../../product/friend-block-test-goal-spec.md)
- [全部变更文件](changed-files.json)、[实现指纹](implementation-fingerprint.json)、[逐项基线/夹具解释](baseline-changes.md)
- [开工前原始记录](preflight-README.md)、`baseline/` 和 `proposal-checks.json` 保留原时点，不作为当前状态。

## 功能与 URL

| URL / 范围 | 实际结果 |
|---|---|
| `/games/friend-block-test` | 新 INDEX 详情页；自引用 canonical、OG、VideoGame/FAQPage/BreadcrumbList，进入 sitemap |
| `/category/friend-quizzes` | 新分类，noindex、无广告、不进 sitemap |
| `/games/friend-block-test/index.html` | 静态 HTML5 游戏入口，noindex；保持文件路径，不重定向到详情页 |
| `/games`、首页发现区、Pixel 相关推荐及原五分类导航 | 按现有库存/分类/标签规则带出新记录；首页首屏和旧 URL/index 状态保持 |
| `/privacy-policy`、`/terms-of-service` | 增量披露链接内容、本机成绩、清除及无同步范围；旧权利说明保留 |

提供 24 道原创四选一题，每份测验 10 道不重复题；昵称最多 16 字符、6 个项目头像、换题/返回修改、分享、猜题与四档结果、成绩回传/去重、本机列表及明确清除。最长 Unicode 昵称下测验/成绩完整链接分别为 286 / 454 字符，低于 1,800。结果界面可制作自己的测验或返回首页做头像。

数据在 `#` 片段内，带版本与校验码；控制字符、链接、标签被清洗，昵称只作文本显示。校验码不宣称加密、防作弊或身份认证。链接持有人可以读取内容。自动收成绩需要在创建测验的浏览器打开回传链接；其它浏览器仍能查看结果，没有跨设备自动同步。

游戏不调用 API、不加载第三方资源，不增加后端或 Cloudflare binding。页面与静态入口隔离 GA/Ads/统计，跨边界使用完整文档导航。CSP 限制游戏连接，Worker/静态资源的 `no-transform` 防止自动改写。参考 [Cloudflare Analytics 文档](https://developers.cloudflare.com/web-analytics/get-started/)；实际证据如下。

## 最终验证

| 检查 | 结论 | 证据和范围 |
|---|---|---|
| 独立 TypeScript / lint | 通过 | `final/typecheck.log`、`final/lint.log`；0 error / warning |
| 全部 31 项离线 `*:check`，含新增 quiz | 通过 | [逐项退出码](final/check-results.json)；现有检查没有删除或跳过 |
| Q1–Q7、计分、昵称、存储与链接 | 通过 | `final/quiz-check.log`：9 组协议/状态检查，加真实接入和隔离检查 |
| 索引白名单与未知记录保护 | 通过 | metadata/routes/quiz 正反例；一个新记录 INDEX，未批准的新记录仍 noindex |
| Next / Cloudflare build | 通过 | [最终退出码](final/build-final-results.json)；`build-final-mobile-link.log`、`cf-build-final-mobile-link.log` |
| 本地生产 SEO，Next 与 Worker | 有条件通过 | `final/seo-check.log`、`final/seo-platform.log`；22 URL，0 必须失败 / 12 既有提醒；不替代人工 KW-04 |
| robots | 通过 | `final/robots-check.log`；使用同一检查脚本指定本任务端口，3000 上的其它项目未动 |
| HTTP/canonical/index/schema/sitemap | 通过 | [HTTP 矩阵](final/http-results.json)：两种运行时各查 22 index 页、16 noindex 页、3 个真实 404、编码路径和独立 HTML 入口 |
| 实际资产交付 | 通过 | `final/assets-http.log`：20 个唯一响应的 HTTP、MIME、缓存、字节和 SHA-256 |
| 320/390/768/1440 三流程与全新环境 | 通过 | [最终 Worker 四宽矩阵](browser/platform-final-mobile/results.json)：同题序、70/100、保存一次、真实 CSS 宽度、无横溢/应用错误/第三方请求；手机页头 Play 保留片段 |
| 390 触屏模拟 | 通过 | [触屏结果](browser/touch/results.json)：isMobile、hasTouch、2x DPR，tap 完成出题/猜题/50 分回传；答案触控区 ≥44px；不是物理手机 |
| 键盘、焦点、全屏、错误/空态 | 通过 | [补充矩阵](browser/final-edge-cases/results.json)：十题键盘、坏/截断/未知版本、剪贴板降级、存储拒绝、清除仅本 key、修改前旧链接仍可收成绩、全屏进入/退出 |
| 视觉 | 通过（测试范围） | 已查看四宽截图以及最终 390 问答、1440 结果和 390 收成绩；无覆盖/裁切控件或横溢。主要按钮白字对比度：橙 5.51:1，绿 5.38:1 |
| 用户验收、真机/Safari、读屏、field CWV、生产/GSC | 未验证 | 未用模拟视口、DOM、构建或 HTTP 代替这些结果 |

本轮没有 Browser skill，使用已安装 Playwright 和系统 Chrome，未增加依赖。可复查 `scripts/qa-friend-quiz.mjs`、`scripts/qa-friend-quiz-edge-cases.mjs`、`scripts/qa-friend-quiz-http.mjs` 及本目录 `touch-qa.mjs`。运行时由 `QUIZ_PLAYWRIGHT` 指向已有包，不自动下载浏览器；需要应用内的同类验证时可考虑 Browser 插件。

## 修复和失败保留

1. **原有 Oval 哈希失败**：兼容链恢复 CRLF 尾部，旧 golden 按 LF 记录。现在在整条逆向链完成后统一换行，旧 hash/golden 不变。原失败在 `baseline/oval-page-check.log`。
2. **Cloudflare HTML 入口冲突**：默认静态 HTML 规范化让详情页和游戏文件都 307 到同一目录。本游戏是唯一静态 HTML 文件，现用 `html_handling = "none"` 保持两入口各自 200。原响应在 `final/http-headers-initial.json`；参考 [HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)，并已实际验证。
3. **手机 Play 丢失片段**：原锚点把分享数据改成 `#game-player`，实测误入新建流程。本页改为启动按钮，启动/滚动不改网址，也不重启已激活的游戏。原复现 `final/mobile-play-initial.json`；最终手机矩阵与 tap 链路覆盖修复。
4. **资产缓存一致性**：增加明确的 `appStaticNoTransform`；仅接受 Workers 对 max-age=0 加上的 must-revalidate，仍拒绝 TTL 改变、缺失 no-transform 或其它多余缓存指令。20 项原资产反例保留，另增缓存正反例。原失败见 `final/assets-http-initial.log`。
5. **Windows 构建锁**：Wrangler 预览锁住 `.open-next/assets`，曾报 EBUSY。关闭本任务已确认的进程树后重建通过；失败 `final/cf-build-fixed.log` 与复测均保留。OpenNext 的 Windows 平台提醒没有隐藏。
6. QA 初期的 17 字符昵称预期、把同文档 hash 导航误当冷启动、剪贴板异步完成竞态已修正测试步骤；原结果目录保留。最终复制测试等待 UI 确认后再读取剪贴板。

## 内容与发布边界

Google 返回验证拦截，两个搜索工具连接失败，备用结果未提供相关可靠的 SERP。因此没有将附件的热度、难度、排名和“2026 年 10 月流行”自述写成事实；正文只说明本项目在 2026 年 10 月创建了独立实现。`semanticCoverage.score/reviewedAt` 保持 null，不编造 KW-04 通过率。CT-06 人类内容审核仍待验收。

本地玩法和工程验证已完成。**KW-04、CT-06、真机/读屏和生产相关门禁未验证，不宣称整站可以直接发布。** Square/Oval 权利 UNKNOWN、原验收和已取消的材料申请任务保持；没有要求补材料或把未知改成许可。

## 看板、验收与回滚

唯一状态权威：`F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html`。QUIZ-001 置 `待验收`，不记 `已完成`；保留原 40 项源验收。用户体验后决定是否验收，提交/发布另行授权；部署后再考虑 GSC 请求收录。

本次无线上变更。若退回：先审阅当前 diff，仅逆向 QUIZ-001 的代码/配置/文档增量，删除本任务新增且未被后续修改的文件；保留其它工作、旧记录/资产/golden/历史 QA。回滚须同步恢复 HTML 路由设置、脚本隔离、索引白名单和 sitemap，不能只删除游戏文件而留下目录记录。
