# 2026-09-22 发布记录

用户指令：`提交并部署`。发布候选来自当前 `codex/game-platform-rebuild` 分支，包含此前累计的游戏站改造、已验收首页摘要，以及本轮确认实施的移动端简易编辑器。保留原验收、IMG-001 的历史验收状态与已取消材料任务记录，不虚构 SWF 授权或自动开启下一项任务。

## 发布前结果

- 29 个项目回归全部通过：见 `checks-final.json`。初始 9 项失败完整保留于 `checks-initial.json`。
- 原失败主要是 IMG-001 图片角色迁移和 HOME-MOBILE-001 引入后，旧检查器仍冻结完整源码。新增精确逆向兼容层仅供历史测试使用，复原历史实现再核对原有 hash/SSR；没有替换旧 golden，没有改变应用行为。图片改动来自原实施补丁，移动端改动来自本轮开始前备份。20 个文件精确逆向、40 个无关变更反例通过：`compatibility.json`。
- 首页发现模块改为检查现行 `getGameImage(game, "THUMBNAIL")` 调用。Pixel 历史模型测试使用精确归一后的源码；现行外部工具无 PLAYER_PREVIEW 的行为由 `images:check` 和 `player:check` 覆盖。
- Type/lint、Next 42 静态页面、OpenNext/Cloudflare 平台构建通过：`platform.json`、`lint.json`。Windows 支持提醒保留，不冒充 Linux CI。
- 本地 SEO 20 URL / 0 必须失败 / 11 既有应该提醒，robots 的 6 个禁止和 5 个允许决策通过：`seo.json`、`robots.json`。
- 六宽首页和下载检查使用仓库内可重跑的 `scripts/check-home-maker.cjs`；环境通过 MSFI_PLAYWRIGHT_PATH / MSFI_CHROME_PATH / MSFI_BROWSER_BASE / MSFI_BROWSER_OUTPUT 配置。Browser plugin 不可用，使用已安装 Chrome + Playwright。
- 首次重启预览被 PowerShell/npm 参数转发影响，服务未启动，导致一轮 HTTP/browser 连接失败；保留 `*-server-not-started.json`。改为直接调用 Next CLI，确认 Ready 后复测，无应用修订。
- Wrangler dry-run 通过。仓库未配置 GitHub Actions 工作流；使用现有 Cloudflare Worker、绑定与部署流程，不声称 GitHub CI 通过。

## 范围与边界

发布候选包含累计的数据驱动页面/播放器、目录分类草稿、最近使用/收藏、图片与 Ruffle 治理、SEO/信任文案与本轮首页双模式。新增目录/分类草稿继续 noindex；首页、Oval、Pixel 等已确认 URL 和各自主意图保留。手机 ≤760px 默认 Simple maker，较宽视口默认 Classic game；512/256/128 PNG；切换保留当前访问的设置。没有新增账户、上传、支付或数据迁移。

首次线上只读快照显示 HTTP / www 变体仍返回 200，见 `production-before.json`；候选包含已验证的规范域 middleware，部署后必须核对真正的一跳 308。

本文件在提交前记录本地结果；**不以此声称已经上线**。实际 commit / Worker version / 上传及生产 SEO、浏览器截图、PNG 文件保存在权威看板及以下外部证据目录，避免为记录部署回执重新改变待部署代码版本：

`C:/Users/liu/.codex/visualizations/2026/09/22/01a0c7fc-cf2d-7472-bf03-0a65e4cae11b/release-production/`

已知非阻断边界：11 项 SEO 提醒、未做真实 iOS/Android 或其它引擎验收、CWV/Analytics 后端接收及真实商业权利未验证。保留 UNKNOWN，不重开已取消的材料申请。

## 回滚

部署前生产 Worker version：`4f1b0c0c-d984-45ba-9620-e0add7244331`。若生产核心路由/编辑器/索引检查出现回归，应停止后续操作，用 `npx wrangler rollback 4f1b0c0c-d984-45ba-9620-e0add7244331` 回退并重跑生产检查。无需数据库迁移回滚。源码回退通过反向提交完成，不 reset 用户的累计成果。旧生产版本本身未包含新的规范域修复，因此回滚后应再次明确记录该历史缺陷。
