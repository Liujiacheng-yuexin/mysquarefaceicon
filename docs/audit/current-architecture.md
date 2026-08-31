# MySquareFaceIcon 当前架构审计（AUDIT-001）

> 状态：用户已于 2026-08-31 验收通过（含质量监管套件）<br>
> 审计日期：2026-08-31<br>
> 审计范围：当前工作区代码、路由、播放器、内容与数据来源、存储、部署配置、环境变量和硬编码边界<br>
> 审计基准：`main` / `a1a2c9d`，与 `origin/main` 对齐；工作区另有一处未提交修改 `app/sitemap.ts`

## 1. 结论摘要

当前项目是一个使用 Next.js 14 App Router、React 18、TypeScript 和单一全局 CSS 文件的 SEO 工具/游戏站，生产目标为 Cloudflare Workers + OpenNext。Square 和 Oval 两个本地 SWF 共用 `FlashGenerator` 与动态加载的 `FlashGeneratorRuntime`，已经具备“点击后才加载 Ruffle/SWF”的外层机制；Pixel 页面则是单独实现的外部工具跳转页。

当前代码还不是数据驱动游戏平台：没有统一的 `GameRecord`、游戏清单、分类数据、Player Adapter 或 Game Detail Template。首页、Oval、Pixel、侧栏、推荐、metadata、FAQ、Gallery Preview 和多数站内链接均分散硬编码在页面或组件中。新增游戏仍需要复制并改写大量页面代码。

审计期间没有修改任何站点功能代码。当前工作区本来就存在的 `app/sitemap.ts` 被整页替换为与本站无关的 `cursive n` 关键词列表，导致 lint 和生产构建失败。该文件属于用户现有未提交改动，本任务没有恢复或覆盖它。

## 2. 当前技术栈

| 层 | 当前实现 | 证据/说明 |
|---|---|---|
| Web 框架 | Next.js `14.2.35`，App Router | `app/` 路由；`next build` |
| UI | React `18.3.1` / React DOM `18.3.1` | `package.json` |
| 语言 | TypeScript `5.5.x`，strict/noEmit | `tsconfig.json` |
| 样式 | 单文件全局 CSS，约 4,292 行 | `app/globals.css`；无 Tailwind/CSS Modules |
| 图标 | `lucide-react` | 页面与共享组件直接导入 |
| Flash 运行层 | 本地 Ruffle Website Package + 外部 CDN 兜底 | `public/ruffle/*`、`FlashGeneratorRuntime.tsx` |
| 游戏资源 | 两个本地 SWF | `public/games/square-face.swf`、`public/games/oval-face.swf` |
| 后端/API | Next Route Handlers | 评论、点赞、审核和图片接口 |
| 生产运行 | Cloudflare Workers via OpenNext | `open-next.config.ts`、`wrangler.toml` |
| 持久化 | Cloudflare KV + R2；本地为进程内存兜底 | `lib/comment-store.ts` |
| PWA/缓存 | Web App Manifest + Service Worker | `app/manifest.ts`、`public/sw.js` |
| 分析/广告 | GA4 初始加载；AdSense 与 Cloudflare Analytics 延迟加载 | `app/layout.tsx`、`DeferredThirdPartyScripts.tsx` |
| 测试 | 无 `test` 脚本、无已发现的测试文件 | `package.json`、仓库文件清单 |

当前本机工具版本：Node `v22.16.0`、npm `10.9.2`、Next.js `14.2.35`、Wrangler `4.90.1`、Ruffle 包 `0.2.0-nightly.2026.5.12`。

## 3. 代码架构图

```mermaid
flowchart TD
  Browser[Browser]
  Root[app/layout.tsx\nRootLayout + GA4 + deferred scripts]
  HomeRoute[app/page.tsx + app/[locale]/page.tsx]
  Home[components/HomePage.tsx]
  Oval[app/oval-face-icon-generator/page.tsx]
  Pixel[app/pixel-art-avatar-icon-generator/page.tsx]
  Content[Trust / Guide / Blog / Legal pages]
  Gallery[app/gallery/page.tsx]
  Admin[app/admin/comments/page.tsx]
  FlashShell[FlashGenerator\nclick-to-load preview]
  FlashRuntime[FlashGeneratorRuntime\ndynamic client component]
  Ruffle[public/ruffle/ruffle.js\nCDN fallbacks]
  SWF[public/games/*.swf]
  External[icongenerators.net\nexternal page]
  Comments[CommentSection / AdminComments]
  API[Next Route Handlers]
  Store[lib/comment-store.ts]
  KV[Cloudflare COMMENTS_KV]
  R2[Cloudflare COMMENT_IMAGES_R2]
  Memory[globalThis in-memory fallback]
  Metadata[metadata helpers + robots + sitemap + manifest]
  Worker[OpenNext Worker + static ASSETS]

  Browser --> Root
  Root --> HomeRoute --> Home
  Root --> Oval
  Root --> Pixel
  Root --> Content
  Root --> Gallery
  Root --> Admin
  Home --> FlashShell
  Oval --> FlashShell
  FlashShell -->|user clicks Play| FlashRuntime
  FlashRuntime --> Ruffle --> SWF
  Pixel --> External
  Gallery --> Comments
  Admin --> Comments
  Comments --> API --> Store
  Store -->|production bindings| KV
  Store -->|production images| R2
  Store -->|bindings unavailable| Memory
  Root --> Metadata
  Root --> Worker
```

关键边界：

- `HomePage`、Oval 和 Pixel 是三个独立页面实现，不是由统一游戏数据渲染。
- Square/Oval 只共享 Flash 播放器外壳；metadata、内容、侧栏、图片、FAQ 和相关链接仍各自维护。
- Pixel 没有共用播放器抽象，而是在页面内直接渲染外部跳转状态。
- 评论是当前唯一具备明确服务端数据层的产品模块。

## 4. 路由清单

仓库有 24 个 `page.tsx` 文件；`app/[locale]/page.tsx` 展开 7 个非英语路径后，共 30 个页面路由。其中 20 个原计划可索引，10 个为 noindex/管理页。当前 `sitemap.ts` 无法编译，因此“原计划可索引”不等于当前工作区能正常输出 sitemap。

### 4.1 页面路由

| URL | 当前类型 | 索引状态 | 主要实现/数据来源 |
|---|---|---|---|
| `/` | 核心 Game / 首页 | index | `HomePage`；Square 参数与全部首页内容硬编码 |
| `/es` | Draft locale Game | noindex, follow | `lib/locales.ts` 中的草稿 metadata；主体复用英文内容 |
| `/vi` | Draft locale Game | noindex, follow | 同上 |
| `/ja` | Draft locale Game | noindex, follow | 同上 |
| `/th` | Draft locale Game | noindex, follow | 同上 |
| `/ar` | Draft locale Game | noindex, follow | 同上，`dir=rtl` |
| `/ru` | Draft locale Game | noindex, follow | 同上 |
| `/id` | Draft locale Game | noindex, follow | 同上 |
| `/oval-face-icon-generator` | 本地 Ruffle Game | index | 独立页面；Oval SWF、metadata、内容、侧栏均硬编码 |
| `/pixel-art-avatar-icon-generator` | External Tool | index | 独立页面；直接跳转 icongenerators.net |
| `/free-avatar-maker` | Guide / Support | index | 页面内硬编码内容与 FAQ |
| `/square-avatar-generator` | Guide / Support | index | 页面内硬编码内容与 FAQ |
| `/square-face-icon-generator` | Guide / Hub | index | 页面内硬编码内容与 FAQ |
| `/cute-square-avatar-generator` | Draft Guide | noindex, follow | 页面内硬编码内容 |
| `/pixel-square-face-maker` | Draft Guide | noindex, follow | 页面内硬编码内容与 FAQ |
| `/gallery` | Gallery + UGC | index | CSS 生成的 curated examples + approved comments API |
| `/blog` | Blog Hub | index | 页面内硬编码文章入口 |
| `/blog/avatar-maker-without-signup` | Blog Guide | index | 页面内硬编码内容与 FAQ |
| `/blog/best-discord-avatar-style` | Blog Guide | index | 页面内硬编码内容与 FAQ |
| `/blog/cute-profile-picture-ideas` | Blog Guide | index | 页面内硬编码内容与 FAQ |
| `/blog/discord-avatar-size-guide` | Blog Guide | index | 页面内硬编码内容与 FAQ |
| `/blog/how-to-make-a-cute-discord-profile-icon` | Blog Guide | index | 页面内硬编码内容与 FAQ |
| `/blog/square-avatar-vs-round-avatar` | Blog Guide | index | 页面内硬编码内容与 FAQ |
| `/blog/tiktok-profile-icon-ideas` | Blog Guide | index | 页面内硬编码 ideas、内容与 FAQ |
| `/about-us` | Trust | index | 页面内硬编码内容/schema |
| `/contact` | Trust | index | 页面内硬编码内容/schema |
| `/editorial-policy` | Trust / Policy | index | 页面内硬编码内容/schema |
| `/privacy-policy` | Legal | index | 独立硬编码页面 |
| `/terms-of-service` | Legal | index | 独立硬编码页面 |
| `/admin/comments` | Admin | noindex, nofollow | `AdminComments`；robots 同时禁止 `/admin/` |

### 4.2 API 路由

| URL | 方法 | 作用 | 数据去向 |
|---|---|---|---|
| `/api/comments` | GET | 按 locale、limit、latest/liked 读取 approved 评论 | KV 或进程内存 |
| `/api/comments` | POST | 创建 pending 评论，可带图片 | KV + R2；本地为内存 |
| `/api/comments/[id]/like` | POST | 基于浏览器 visitor ID 哈希做一次性点赞 | KV 或内存 Set |
| `/api/comment-images/[...key]` | GET | 只返回 approved 评论图片 | R2 或内存；long cache |
| `/api/admin/comments` | GET | 读取全部审核记录 | `x-admin-password` 校验 |
| `/api/admin/comments/[id]` | PATCH | approve/reject | KV 或内存 |
| `/api/admin/comments/[id]` | DELETE | 删除评论及其图片 | KV/R2 或内存 |
| `/api/admin/comment-images/[...key]` | GET | 审核员查看未公开图片 | `x-admin-password`；no-store |

### 4.3 生成路由与静态入口

| URL/入口 | 当前实现 |
|---|---|
| `/robots.txt` | 允许公开站点，禁止 `/admin/`、`/api/`，声明正式 sitemap |
| `/sitemap.xml` | 源文件当前语法损坏，无法构建；HEAD 原设计输出 20 个 index URL |
| `/manifest.webmanifest` | Standalone PWA，192/512 图标 |
| `/sw.js` | 安装时只预缓存小型核心图片；`/games/` 与 `/ruffle/` 首次请求后缓存 |
| `/games/square-face.swf` | 本地 Square SWF，542,798 bytes |
| `/games/oval-face.swf` | 本地 Oval SWF，860,395 bytes |
| `/ruffle/*` | 本地 Ruffle JS/WASM，两个 WASM 合计约 26.8 MB |

项目未提供自定义 `not-found.tsx`，404 使用 Next.js 默认实现。

## 5. 播放器实现

### 5.1 当前点击后加载流程

1. `FlashGenerator` 首次渲染固定 `aspect-ratio` 预览和 Play 控件，不导入 Ruffle runtime。
2. 用户点击后，React 将 `activated` 设为 true，动态导入 `FlashGeneratorRuntime`，且 `ssr: false`。
3. Runtime 首先尝试 `/ruffle/ruffle.js`，失败后依次尝试 unpkg 的未固定 URL和 jsDelivr 的 `@latest` URL。
4. Ruffle 创建 player 后，以本地 SWF URL 调用 `player.load()`；脚本超时 8 秒，SWF 加载超时 15 秒。
5. Runtime 管理 loading/ready/error、Reload 和 Fullscreen；页面外层提供 Report/Game Help 链接。
6. Service Worker 不在 install 阶段预缓存 Ruffle/SWF，但会在用户实际请求后缓存同源 `/games/` 和 `/ruffle/` 资源。

### 5.2 当前游戏绑定

| 游戏 | Player type | 运行资源 | 预览资源 | 参数来源 |
|---|---|---|---|---|
| Square Face Generator | Ruffle SWF | `/games/square-face.swf` | `https://static.mysquarefaceicon.com/squarefacegenerator/square-face-cover.png` | `FlashGenerator` 默认值 + `HomePage` |
| Oval Face Icon Generator | Ruffle SWF | `/games/oval-face.swf` | `/games/oval-face-cover.png` | Oval 页面直接传 props |
| Pixel Art Avatar Icon Generator | External link | `https://www.icongenerators.net/pixelavatar.html` | 站内示例图 | Pixel 页面直接硬编码 |

SWF SHA-256：

- Square：`B1D074C95F15B7DCECDBC2405ABF820EAD985669BB12CD47247FC8EA7537BC1E`
- Oval：`80E974D8EF4AD5E849E93464EAEA1833620C269BAC30601D960F5438C285E09B`

### 5.3 已有能力与缺口

已有：

- Square/Oval 复用一个 Flash 播放组件。
- 外层 Preview 与 Player 使用稳定尺寸，具备 click-to-load 基础。
- 有本地 Ruffle、自托管 SWF、超时、重试、Fullscreen、Reload 和错误文案。
- Pixel 已诚实说明 iframe 被原站安全头阻止，并跳转原站。

缺口：

- 没有 `GamePlayer` + `Ruffle/HTML5/Iframe/External` Adapter 层。
- 没有统一 idle/loading/loaded/error/fullscreen/reloading 事件对外契约。
- 没有 `game_view/start/loaded/error` 分析事件。
- 外部 CDN 兜底包含漂移的 `@latest`，与“版本固定”目标不一致。
- Square 预览图来自额外域名，而不是当前仓库/R2 数据记录。
- `@ruffle-rs/ruffle` 虽在依赖和 lockfile 中固定，但运行代码实际加载的是 `public/ruffle` 副本或外部 CDN，没有自动同步脚本。

## 6. 游戏、内容与状态的数据来源

### 6.1 游戏来源与权利记录

| 对象 | 当前来源证据 | 当前许可事实边界 |
|---|---|---|
| Square SWF | 本地 `public/games/square-face.swf`；项目文档称为用户提供/authorized | 没有逐游戏 License Registry、原始许可 URL、商业使用/再托管/修改字段；代码事实只能确认文件存在 |
| Oval SWF | 本地 `public/games/oval-face.swf`；项目文档称为 authorized | 同样没有可验证 Registry；`UNKNOWN` 不能推导为允许 |
| Pixel external | 页面明确指向 icongenerators.net，并声明不复制其文件/素材 | 已有来源与出站说明，但没有结构化许可记录 |

本审计没有反编译或修改任何 SWF。

### 6.2 内容来源

- 首页、Oval、Pixel 的 metadata、H1、FAQ、features、tips、how-to、侧栏和 related links 都在相应 `.tsx` 文件中。
- `lib/locales.ts` 是首页多语言内容的集中数据文件；只有 `en` 进入 reviewed 列表，另外 7 种语言复用英文主体并保持 noindex。
- Blog、Guide、Trust、Legal 页面均为独立 `.tsx`，没有 MDX/CMS/结构化内容集合。
- `app/gallery/page.tsx` 有 8 个代码绘制的 curated examples；用户提交来自评论 API。
- 首页/Oval/Pixel 的 `GalleryPreview` 使用本地 WebP 示例图，但点赞数是代码内固定数字，不来自评论或分析数据。
- `SiteHeader`、`SiteFooter` 和 `HomePage` 各自维护链接；首页还有自己的 header/footer 版本，存在内容漂移。
- 仓库没有 `data/games/*`、Game Manifest、Category 数据、Related 算法或 License Registry。

### 6.3 运行状态与存储

| 状态 | 存储方式 | 持久性/说明 |
|---|---|---|
| 评论索引与记录 | `COMMENTS_KV` | 生产持久化；最多保留 500 个索引 ID |
| 评论图片 | `COMMENT_IMAGES_R2` | 生产持久化；只公开 approved 图片 |
| 本地评论/图片 | `globalThis.__MSFI_COMMENTS__` | 仅开发兜底，进程重启即丢失 |
| 评论访客 ID/已点赞 ID | 浏览器 localStorage | `msfi-comment-visitor-id`、`msfi-liked-comments` |
| PWA 安装提示 | 浏览器 localStorage | `msfi-install-dismissed` |
| Recently Played / Favorites | 未实现 | 看板 Week 5 任务 |
| 游戏清单/生命周期 | 未实现 | 当前无统一状态数据 |

## 7. 部署、资源与环境变量

### 7.1 构建与发布命令

| 命令 | 作用 | 当前结果/说明 |
|---|---|---|
| `npm run dev` | Next 开发服务器 | 已配置，未在本审计长期启动 |
| `npm run lint` | `next lint` | 失败：`app/sitemap.ts` 第 1 行解析错误 |
| `npm run build` | Next 生产构建 | 失败：同一 sitemap 语法错误 |
| `npm run start` | 运行 Next 生产输出 | 需要成功 build |
| `npm run cf:build` | OpenNext 构建 + worker patch | 当前未执行；前置 Next build 已失败；旧文档另记录 Windows `EPERM` 风险 |
| `npm run cf:preview` | Wrangler/OpenNext 预览 | 需要 `.open-next` 与 bindings |
| `npm run cf:deploy` | 构建、patch、部署 Worker | 未执行；本任务不含部署授权 |
| `npm run indexnow` | 提交 URL 到 IndexNow | 脚本存在，但当前 key 文件不匹配，见风险项 |

### 7.2 Cloudflare 绑定与配置

| 名称 | 类型 | 当前用途 |
|---|---|---|
| `ASSETS` | Workers Assets binding | `.open-next/assets` 静态资源 |
| `WORKER_SELF_REFERENCE` | Service binding | 指向 `mysquarefaceicon` Worker |
| `COMMENTS_KV` | KV namespace | 评论、索引、点赞去重键 |
| `COMMENT_IMAGES_R2` | R2 bucket | 评论图片 |
| `MSFI_USE_CLOUDFLARE_BINDINGS` | Wrangler var | `true` 时尝试 OpenNext Cloudflare context |
| `ADMIN_PASSWORD` | Wrangler secret / process env | 管理 API 的 header 密码 |
| `CLOUDFLARE_WEB_ANALYTICS_TOKEN` | Wrangler var / process env | 可选 Cloudflare Web Analytics |
| `SESSION_SECRET` | 文档要求的 Wrangler secret | 当前源码没有引用，尚未形成 session 机制 |
| `SITE_URL` | 可选 process env | IndexNow 脚本的站点地址覆盖 |

GA4 ID `G-VPL9X65STX` 与 AdSense client `ca-pub-9616934112105331` 当前直接写在 `app/layout.tsx`，不属于环境变量。

### 7.3 部署路径

```text
Next.js App Router
  -> next build
  -> @opennextjs/cloudflare build
  -> scripts/patch-opennext-worker.mjs
  -> .open-next/worker.js + .open-next/assets
  -> Wrangler deploy
  -> Cloudflare Worker + KV + R2 + static assets
```

`scripts/patch-opennext-worker.mjs` 只修补 OpenNext 产物中的 `process.chdir` 调用，不修改站点源码。

## 8. 硬编码清单

### P0：阻碍数据驱动扩展

- `components/HomePage.tsx`：Square 游戏身份、首页 IA、侧栏、FAQ、schema、Gallery Preview 和站内链接。
- `app/oval-face-icon-generator/page.tsx`：Oval 游戏记录的全部字段、播放器 props、metadata、内容和推荐。
- `app/pixel-art-avatar-icon-generator/page.tsx`：External URL、来源文案、metadata、内容和推荐。
- `components/GameSidebar.tsx` 只接受页面传入数组；数组分别散落在三个页面中。
- 没有可复用的 `GameRecord`、Game type、status、license、SEO、category、tags 或 images 数据源。

### P1：页面与 SEO 维护成本

- 每个 Blog/Guide/Trust/Legal 页面各自硬编码 metadata、schema、正文和内链。
- `SiteHeader`、`SiteFooter`、`HomePage` 与 Oval 自定义 footer 重复维护导航。
- HEAD 版本 sitemap 使用静态 `contentPaths`；当前工作区版本已完全损坏。
- `app/globals.css` 是约 4,292 行的单一全局文件，包含旧组件与多轮样式覆盖。
- `public/sw.js` 的预缓存白名单与 cache version 手工维护。
- GA4、AdSense、Square 默认 SWF/预览 URL 和 Ruffle CDN fallback 写在源码中。

### 当前未被页面引用的实现

- `components/AvatarGenerator.tsx`
- `components/CloudflareAnalytics.tsx`
- `components/ShareButtons.tsx`
- `HomePage.tsx` 中的 `trustBadges`、`saveSteps`、`profileUseCases`、`troubleshooting`、`relatedCards`

这些不是本任务要删除的内容，只是当前依赖图中的未使用代码。

## 9. 审计发现的风险与不一致

| 级别 | 发现 | 证据与影响 | 本任务处理 |
|---|---|---|---|
| P0 | 工作区 `app/sitemap.ts` 被无关关键词列表覆盖 | lint/build 均失败，`/sitemap.xml` 当前无法生成 | 保留用户改动，只记录；需单独确认修复 |
| P0 | 没有统一 Game Data / Player Adapter | 新增游戏仍需复制页面，无法系统化 QA/SEO/推荐 | 记录为 Week 2 前置事实 |
| P0 | 许可陈述没有逐游戏证据 Registry | 页面/文档使用 `authorized`、`original` 等措辞，但源码中没有可验证许可字段 | 不改文案；交给 `LEGAL-001` |
| P0 | Gallery Preview 点赞数为固定数组 | 首页/Oval/Pixel 看起来像社区热度，但并非真实 UGC 数据 | 不改 UI；交给后续首页/Gallery任务 |
| P1 | Ruffle CDN fallback 未固定版本 | 本地失败时 unpkg 无版本、jsDelivr `@latest` 会漂移 | 不改播放器；交给 `RUFFLE-001` |
| P1 | IndexNow key 文件不匹配 | 脚本/文档要求 `b625...txt`，`public/` 实际只有 `07647...txt` | 不提交外部服务；列为运维修复项 |
| P1 | 文档与资源状态有漂移 | `DEPLOYMENT_TODO.md` 提及不存在的 `square-face-cover.svg`，且部分导航描述已过时 | 不改旧文档；列为同步项 |
| P1 | 管理端没有 session | `SESSION_SECRET` 未使用；密码每次作为 `x-admin-password` 传输 | 不改认证；列为安全/运维边界 |
| P1 | 没有自动测试 | 只有 lint/build；播放器、API、路由与 SEO 没有测试套件 | 后续 QA 任务处理 |
| P2 | 重复 header/footer 与未使用代码 | 首页 footer 仍为 ©2025，共享 footer 为 ©2026；多个组件/数组未引用 | 不做清理，避免扩大 AUDIT-001 |

## 10. 验证记录

### `npm run lint`

结果：失败。

```text
./app/sitemap.ts
Error: Parsing error: Unexpected keyword or identifier.
```

### `npm run build`

结果：失败。

```text
./app/sitemap.ts:1:1
Expected ';', '}' or <eof>
1 | cursive n
```

### 测试

`package.json` 没有 `test` 脚本，仓库未发现自动测试文件，因此没有可运行的项目测试套件。

## 11. AUDIT-001 验收映射

- [x] 代码架构图：见第 3 节。
- [x] 路由清单：见第 4 节，含 30 个页面路由、6 个 API route 文件及生成路由。
- [x] 播放器实现说明：见第 5 节，含 click-to-load、Ruffle/SWF、External 边界与缺口。
- [x] 游戏/内容数据来源：见第 6 节，明确本地 SWF、外部工具、硬编码内容、KV/R2 和未知许可边界。
- [x] 部署与环境变量清单：见第 7 节。
- [x] 明确硬编码页面：见第 8 节。
- [x] 只读审计：未修改页面、组件、播放器、SWF、路由或生产配置。

## 12. 验收记录与后续边界

用户已明确验收 `AUDIT-001（含质量监管套件）`；随后 `BASE-001` 也已完成并通过验收。`app/sitemap.ts` 仍是用户现有未提交改动，未被本审计或后续基线任务擅自恢复；它继续作为独立 P0 阻断显示在质量证据中。
