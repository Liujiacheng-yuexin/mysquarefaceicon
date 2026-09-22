# HOME-MOBILE-001 · 首页移动端简易编辑器

日期：2026-09-22。授权原文：**“首页摘要验收通过，并确认移动端编辑器方案”**。这同时验收 HOME-CTR-001 本地成果，并批准 `docs/seo/home-ctr-2026-09-22.md` 中的移动编辑器方案；不等于本项成果验收或发布批准。

本项本地功能与定向验证 **通过，待用户验收**。整站发布仍 **不通过**：原 Square 首页冻结回归因既有 GamePlayer 模型 hash 不匹配失败，未静默改写历史 oracle。生产部署、真实 iOS/Android 设备与 CWV **未验证**。

## 实现与范围

只在 `/` 的原核心工具位置增加两种模式：手机 ≤760px 默认 Simple maker，桌面/平板宽度 >760px 默认 Classic game。首次 HTML 用 CSS 给出同样默认布局，避免手机先闪出经典游戏；水合后用 `useSyncExternalStore` 跟踪视口。用户明确选择后，改变视口不覆盖选择。

Simple maker 复用现有 `AvatarGenerator` 几何 Canvas 绘制函数，提供 Face/Hair/Eyes、Skin/Hair/Background/Accent 配色，以及 512/256/128px PNG。两个模式保持挂载，当前页面内切换保留 Canvas 设置；刷新恢复默认。没有新增账号、localStorage、上传或云同步。经典游戏仍只在点击 Play 后加载 Ruffle/WASM/SWF。两种画风明确区分，不声称重制 SWF，也不新增许可或作者声明。

导出捕获空 Canvas/context、非法 PNG 结果和抛出的异常；失败保留设置并给重试/截图提示，成功只报告下载请求已触发。没有伪造“已保存到设备”的确认。表单显式关联 label，模式和尺寸按钮使用 aria-pressed，状态使用 role=status，相关控件高度 ≥44px，键盘焦点可见。禁用 JavaScript 时有说明，导出按钮禁用。

## 本轮修改文件

- `components/home/HomeHero.tsx`：模式选择、响应式默认值、两种说明与既有播放器绑定。
- `components/AvatarGenerator.tsx`：compact UI、导出错误处理、Canvas 就绪状态和可访问属性；保留原完整模式与绘制代码。
- `app/globals.css`：独立追加 homepage maker / simple maker 样式。
- `PROJECT_BRIEF.md`、`STYLE_GUIDE.md`、`PAGE_PLAN.md`：登记用户确认的新默认交互；Square 首页意图与垂直范围保持。
- `docs/seo/home-ctr-2026-09-22.md`：记录明确确认。
- `SEO_LOG.md` 与本目录 JSON：验证证据。
- 外部权威 `mysquarefaceicon_rebuild_dashboard.html`：HOME-CTR-001 已完成、本项待验收；原验收保留，合计 38 个源验收键、27/62 完成。

没有新 URL；Title、Description、H1、canonical、robots/index/sitemap 和既有内容顺序不变。非英文草稿页保持原入口与 noindex。首页 First Load JS 从上轮约 113kB 到约 118kB；这是构建输出，不是实际 CWV 或流量收益。

## 本地验证

环境：Windows，Next 14.2.35，`http://127.0.0.1:3000/` production server；Browser 插件/skill 未提供，按前端测试 skill 使用已安装 Chrome 与 bundled Playwright，无新增依赖。浏览器脚本放在 `%TEMP%/msfi-home-mobile-20260922/qa.cjs`；截图和下载文件在 `C:/Users/liu/.codex/visualizations/2026/09/22/01a0c7fc-cf2d-7472-bf03-0a65e4cae11b/home-mobile/`。

| 项目 | 结果 / 证据 |
| --- | --- |
| Type / lint | 通过；独立 type、0-warning lint，最终 Next 构建再次进行 lint/type；`type.json`、`lint.json`、`platform.json` |
| Next / Cloudflare | 通过；最终 `npm run cf:build` 包含 Ruffle check、Next 42 页构建、Worker 生成与补丁；官方 Windows 兼容提醒保留；`platform.json` |
| Hero / IA / click-to-load / metadata / images | 通过；`hero.json`、`architecture.json`、`performance.json`、`metadata.json`、`images.json` |
| 本地 SEO | 20 URL，0 必须失败、11 既有其它页应该提醒；`seo.json`。KW-04 SERP 语义比例与人工 CT-06 不在自动通过结论内 |
| 页面身份 / 非空 / H1 / canonical / 框架错误 | 六宽均通过；唯一既有 H1、首页 Title/canonical 正确；无空白页、错误遮罩或 pageerror；`browser.json` |
| 360×800、390×844、430×932 | 默认 Simple maker；预览完整位于首屏，无横向溢出；触控目标高度 ≥44px；`browser.json` 与三个 viewport 截图 |
| 768×1024、1024×900、1440×1000 | 默认 Classic game；无横向溢出，工具可见；对应 viewport 截图 |
| 选项 / 配色 / 状态 | 修改 Face/Hair/Eyes、Skin/Background 后 Canvas 像素改变；手机触屏点选色板；两模式来回切换、跨断点调整窗口后值与像素保持；Reset 恢复初始像素 |
| 实际 PNG 下载 | 512/256/128 文件名称、PNG 签名、宽高及浏览器解码通过，包含 749/369/155 种像素颜色；下载失败事件为 null；`browser.json` 含哈希/字节数 |
| 导出负例与恢复 | 隔离测试页注入 toDataURL 异常，错误提示出现、选项保留；恢复方法后重新下载成功且文件 hash 与先前相同 |
| 键盘 | Enter 切到 Simple maker；Tab 到 512/256 尺寸；Enter 选中 256；focus-visible outline 存在 |
| Ruffle 网络 / 实际运行 | 六宽首次请求中 Ruffle/WASM/SWF 为 0；切到 Classic 不加载；点击 Play 后发出 4 个 runtime 请求，真实本地游戏进入 ready |
| 禁用 JS | 手机初始 CSS 显示 Simple maker，隐藏 Classic；noscript 提示可见；不加载 runtime |
| 正常 Service Worker | 允许注册并等 ready，刷新后受 SW 控制；默认 Simple maker、runtime 请求 0，触屏下载 512 PNG 成功；无 console/pageerror；`service-worker-smoke.json` |
| 控制台 | 主交互矩阵 pageerror=0；8 条 SW blocked 是隔离测试设置产生，另有 1 条 768px 下 Google Analytics 域的 ERR_CONNECTION_CLOSED。保留记录，不称全控制台零错误；正常 SW 补测日志为空 |
| 历史 Square 冻结回归 | 不通过，仍为上轮已记录的 game-player-model.ts hash 差异；`square.json`。本轮没有放宽或重写这个 oracle |

适用规则：IA-02/03、IDX-01～07、KW-01/05/16、META-01/02/05/06/08、CT-03/04、AY-01/02、PF click-to-load、OP-05/09。当前自动规则检查与产品流程通过，不等于整站必需回归或发布通过。

## 初次失败及处置

1. SEO checker 未识别嵌套 label，报告三个 AY-02；补齐显式 for/id 后最终检查 0 必须失败，旧结果保存在 `seo-before-explicit-labels.json`。
2. 首次浏览器矩阵功能已通过，但 `getByText` 查询 noscript 文本返回不可见。原始 DOM 和禁用 JS 截图确认文字确实显示；改用 `.simple-maker noscript p` 后整组通过。旧结果在 `browser-first-pass.json`；没有删除或绕过 noscript 检查。
3. 添加 noscript 与显式 label 后分别重建；早期平台结果保留在两个 `platform-before-*.json`，最终构建以 `platform.json` 为准。

## 手动验收与回滚

打开本地首页，在桌面点击 Simple maker；选择发型与眼睛、点选配色，下载 PNG 并查看文件。切到 Classic 再切回来，设置应保持；Classic 仍需点击 Play 才开始。手机宽度直接进入简版。只验证当前访问期间的保留，不承诺跨刷新保存。

回滚只恢复本轮开始前 HomeHero、AvatarGenerator 和追加 CSS 的对应增量，并回退本轮文档/看板记录；不要 reset 累计工作树。临时备份位于 `%TEMP%/msfi-home-mobile-20260922/`。已经验收的 HOME-CTR-001 标题摘要保留。无数据库、存储或线上版本需要回滚。

未提交、推送或部署；旧 IMG-001 未补签验收，已取消的 LICENSE-GATE 材料任务不恢复。真实 iOS/Android 下载行为、其它引擎、离线编辑/CWV、生产分析接收与上线效果未验证。
