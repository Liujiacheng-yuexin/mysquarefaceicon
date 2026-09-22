# RUFFLE-001 · Ruffle 自托管、版本固定与按需加载方案

> 2026-09-08 · 看板 v1.91 · **方案已确认，本地实施与核心 QA 完成，待用户验收**  
> 当前任务：`RUFFLE-001`  
> 依赖：`PLAYER-001` 已本地验收  
> 确认口令：`确认 RUFFLE-001 方案，进行开发`

## 1. 当前事实

- 项目已安装 `@ruffle-rs/ruffle@0.2.0-nightly.2026.5.12`，lockfile 与本机安装版本一致；但 `package.json` 使用 `^0.2.0-nightly.2026.5.12`，声明本身仍允许 npm 解析到同一 semver 范围内的其它版本。
- `public/ruffle/` 有 `ruffle.js`、两个 core JavaScript 与两个 WASM，共 5 个文件、27,512,697 bytes；本轮 SHA-256 核对表明它们与当前 `node_modules/@ruffle-rs/ruffle` 逐文件一致。
- 仓库没有把 npm 包同步到 `public/ruffle/` 的脚本，也没有声明版本、允许文件集合、字节数与 SHA-256 的运行时 manifest；依赖升级后可能出现“lockfile 已更新、公开资源仍是旧副本”。
- `RuffleAdapter` 首选 `/ruffle/ruffle.js`，失败后会回退到无精确版本的 `unpkg.com/@ruffle-rs/ruffle` 与 `cdn.jsdelivr.net/...@latest/ruffle.js`。这会使实际运行版本、缓存、隐私边界和回滚版本失去单一事实源。
- 当前 `GamePlayer` 只在用户 Play 后、可见 loading 已获得绘制机会后动态挂载 `RuffleAdapter`；首次 HTML 与 service worker 安装清单不包含 Ruffle/WASM/SWF。`public/sw.js` 只在实际请求成功后缓存 `/ruffle/` 与 `/games/` 资源。
- 本轮仅运行现状回归；没有启动服务器，因此当前 HTTP `Content-Type`、`Cache-Control`、真实 Square/Oval 加载和生产行为均未重新验证。
- Square/Oval SWF 的实际来源与权限仍为 `UNKNOWN`。本任务只治理 Ruffle 运行层，不修改、反编译、迁移或重新授权任何 SWF。

[Ruffle 官方 Web core 说明](https://github.com/ruffle-rs/ruffle/blob/master/web/packages/core/README.md)指出 Web 版本由 JavaScript 与 WebAssembly 组成，可通过 npm/构建流程或 self-hosted 包部署，并特别提示 `.wasm` 必须由服务器正确提供；[官方发布流程](https://github.com/ruffle-rs/ruffle/blob/master/.github/workflows/release.yml)也会生成 selfhosted 包并发布 npm 包。当前项目采用已安装 npm 包生成受控的同源静态副本，与该边界一致。

## 2. 确认后的实现决策

### 2.1 单一版本与资源清单

- 将生产依赖写成精确版本 `@ruffle-rs/ruffle: "0.2.0-nightly.2026.5.12"`，同时要求 `package-lock.json` 与已安装包版本完全一致；本任务不顺带升级到新的 nightly。
- 新增机器可读 manifest，记录 package name、精确版本、公共基路径、5 个允许文件、字节数和 SHA-256。manifest 不包含 Square/Oval SWF，也不把其权利状态写成允许。
- 新增 `npm run ruffle:sync`：只从当前已安装的精确包复制 allowlist 文件到 `public/ruffle/`，复制后重新核对字节数与哈希；不从网络下载、不接受额外文件、不改 SWF。
- 新增只读 `npm run ruffle:check`：核对 `package.json`、lockfile、installed package、manifest 和公开副本五方一致；缺失、额外、版本漂移或哈希不一致均以非零退出。
- 在 `build` 与 `cf:build` 前执行只读检查。普通构建不得自动修改资源；开发者必须显式运行 sync，审阅差异后再构建。

### 2.2 同源加载、MIME 与缓存

- `RuffleAdapter` 只允许加载同源 `/ruffle/ruffle.js`，并将 Ruffle `publicPath` 固定为 `/ruffle/`；移除 unpkg、jsDelivr 和 `@latest` 回退。
- 同源资源失败时进入现有可恢复 error/Retry 流程，不静默切换第三方版本；错误文案、控件顺序和 Player 尺寸不变。
- 为 Ruffle WASM 明确配置并验证 `Content-Type: application/wasm`。入口 `ruffle.js` 使用可重新验证缓存策略；内容哈希命名的 core/WASM 可使用长缓存。最终以 Next 本地 production 与 OpenNext 等效产物的真实响应头为证据。
- service worker 安装阶段继续不预取 Ruffle 或 SWF。若运行时缓存策略或版本标识需要调整，只做与本次固定版本相对应的精确变更，并验证旧缓存不会让回滚继续执行新版本。

### 2.3 升级与回滚约定

- 未来升级单独修改一个精确版本，运行 `npm install`、`ruffle:sync`，审阅 manifest/公开文件差异，再执行本方案的全部回归；不得只改 CDN URL 或只替换一个 WASM。
- 每次升级必须分别验证 Square 与 Oval；一个 SWF 通过不能代替另一个。遇到兼容性退化时恢复前一精确依赖、lockfile、manifest、公开副本和相关缓存版本。
- 版本、5 个资源哈希、检查命令、逐游戏兼容步骤和回滚步骤写入 `docs/ops/ruffle-runtime.md`。

## 3. 布局、SEO 与交互冻结

- 不新增或迁移 URL，不改 Title、description、H1、canonical、OG/Twitter、schema、robots/index、sitemap、关键词、站内链接或页面搜索意图。
- 不改变首页/Oval 的 Hero、Player 比例、模块顺序、可见文案、Play/Reload/Fullscreen/Report 控件或移动提示。
- 初始页面仍只显示 cover 与原生控件；Ruffle JavaScript、core、WASM 与 SWF 只有用户启动游戏后才能请求。
- 唯一允许的用户可观察差异：同源 Ruffle 资源不可用时直接显示现有错误/Retry，不再访问第三方 CDN。
- Pixel 继续是 External Tool，不加载 Ruffle；七个 draft locale 的 noindex 与现有共享 Player 行为不变。

## 4. 预计修改范围

- `package.json`、`package-lock.json`
- `components/game-player/adapters/RuffleAdapter.tsx`
- `public/ruffle/*`（内容应与当前精确包一致；若 sync 证明一致，不制造无意义二进制改写）
- `public/sw.js`（仅在缓存版本治理确有必要时）
- `next.config.mjs`（Ruffle 响应头）
- `data/ruffle-runtime-manifest.json`
- `scripts/sync-ruffle-runtime.mjs`
- `scripts/check-ruffle-runtime.mjs`
- `scripts/README.md`
- `docs/ops/ruffle-runtime.md`
- 本任务测试、证据、`PAGE_PLAN.md`、`LAUNCH_CHECKLIST.md`、`SEO_LOG.md` 与权威看板

若实施中必须改页面布局、公开文案、SWF、Game Data 权利字段、URL/索引或其它路线图任务，先停下并重新请求范围确认。

## 5. 实施后验证矩阵

1. `ruffle:check` 正例，以及版本范围、lockfile 漂移、缺失/额外文件、内容篡改、远程 URL 等负例均 fail closed。
2. `player:check`、`perf-home:check`、`square-home:check`、`oval-page:check` 和相关冻结回归通过；初始 HTML/service-worker install 仍无 Ruffle/WASM/SWF。
3. TypeScript、零错误/零新增 warning lint、Next build、OpenNext/Cloudflare 等效 build 通过。
4. 本地 production 对 `ruffle.js`、两个 core JS、两个 WASM 和两份 SWF 逐项核对 200、同源、body hash、MIME 与缓存头；WASM 必须为 `application/wasm`。
5. 浏览器分别验证 Square 与 Oval：Play 前 0 个 runtime/SWF 请求；Play 后只访问本站 Ruffle 与对应 SWF；idle → loading → ready、Reload、错误/Retry、页面往返与 console/page error。
6. 至少检查 1280×900、390×844、360×800，无横向溢出且 Player 保留稳定尺寸。测试真实全屏、SWF 内部主要操作与保存能力；不能完成的项目明确写 `未验证`。
7. 本地 `seo:check` 与 robots 回归，确认 20 个现有索引 URL、0 mandatory 基线和既有 should 提醒未因运行层治理变化。
8. 记录本次版本、构建 ID、命令退出码、首次失败/修正、截图/网络证据与精确回滚；部署和 `seo:prod` 仍需另行授权。

## 6. 不在本任务范围

- 升级到另一 Ruffle nightly、迁移 SWF/图片到 R2/CDN、执行 `ASSET-001`、`IMG-001`、`CWV-001` 或 `MOBILE-001`。
- 修改/反编译 Square/Oval SWF、补写授权、清除 `UNKNOWN`、新增游戏或声称完整兼容。
- 修改 Pixel 外站边界、账号/收藏/最近历史、广告/CMP、Analytics 或可见内容。
- commit、push、deploy、生产 `seo:prod`、GSC/Bing 提交或生产验收。

## 7. 当前停止点

用户已于 2026-09-08 回复 `确认 RUFFLE-001 方案，进行开发`。实施严格沿用本方案，核心结果与边界见 [RUFFLE-001 evidence](../quality/evidence/ruffle-001/checks.json)。当前只更新为 `待验收`；真实错误注入/Retry、全屏、SWF 内部保存、真机/其它引擎和生产仍明确未验证，不会自动开始 `ASSET-001`、提交、推送或部署。下一步仅等待用户回复 `RUFFLE-001 验收通过`。
