# scripts · 自动检查

## ASSET-001 game-asset boundary

`npm run assets:check` compiles and validates the ASSET-001 game-asset manifest. It maps every current Game Data image
and SWF URL to one manifest record, verifies local files by byte length and SHA-256, and rejects unapproved hosts,
HTTP/r2.dev/query-versioned CDN URLs, mutable caching on content-addressed R2 objects, UNKNOWN or review-required R2
migration, Ruffle takeover, Pixel generator copying, missing references, and conflicting metadata. It is read-only: it
never uploads, deletes, or changes R2, local assets, Game Data, or page URLs. Run
`node scripts/run-game-asset-check.mjs --base http://127.0.0.1:3100` to add loopback status, MIME, cache, byte, SHA-256,
and no-R2-page-reference checks against a running production build.

## RUFFLE-001 runtime governance

`npm run ruffle:check` is the read-only build gate for the self-hosted Ruffle runtime. It verifies the exact `@ruffle-rs/ruffle@0.2.0-nightly.2026.5.12` dependency across `package.json`, lockfile and the installed package, then checks the five allowlisted `public/ruffle/` files against `data/ruffle-runtime-manifest.json` by file set, byte length and SHA-256. It also rejects remote/CDN adapter fallbacks, missing `publicPath`, unsafe service-worker prefetch and a missing build gate. Run `node scripts/check-ruffle-runtime.mjs --base http://127.0.0.1:3100` to verify a running local production server, including five runtime and two SWF responses. `npm run ruffle:sync` is the explicit offline write step: it copies only those five allowlisted runtime files from the already installed package, never downloads files and never touches SWF assets. Upgrade, per-game browser regression and rollback steps are documented in `docs/ops/ruffle-runtime.md`; neither command grants SWF rights, proves production behavior or authorizes release.

## FAV-001 Favorites check

`npm run favorites:check` compiles and runs the confirmed browser-local favorites contract. It covers versioned parsing, malformed data, duplicate/newest-first/50-item limits, storage failures, isolation from Recently Played, published Game Data eligibility including Pixel External, non-nested card controls, unselected SSR, `/games` placement and removal focus target, detail CTA order, Privacy disclosure, 44px controls, and the no-network boundary. It does not prove production behavior, third-party rights, visual quality, or release approval.

## RECENT-001 Recently Played check

`npm run recent:check` compiles and runs the confirmed local-history contract. It covers versioned parsing, malformed data, duplicate/order/8-store/4-display limits, storage failures, isolated Clear behavior, published playable candidate filtering, Pixel External exclusion, real Square/Oval/future Game Data IDs, first-Play-only recording, empty server output, homepage and `/games` placement, focus recovery, and the Privacy disclosure. It performs no network writes and does not prove browser layout, production behavior, rights, or release approval.

## RELATED-001 deterministic recommendation check

`npm run related:check` compiles and runs the server-side Category + Tags selector checks. It verifies the current Oval, Square, and Pixel orders; category/tag/ID precedence; strict limits; immutability; duplicate ID/path exclusion; publication and fake-legacy gates; missing/invalid/empty states; the disabled quality/popularity boundary; and the Oval, homepage, Pixel, and shared detail-component source contracts. Run `node scripts/run-related-games-check.mjs --built` or `--base http://127.0.0.1:3000` to add exact rendered checks for all three current surfaces. It does not grant rights, index eligibility, or production approval.

核心 SEO 检查脚本均为零依赖实现，需 Node 18+。验证 `RULES.md` 中标记 `⚙` 和 `🌐` 的规则。

**存在的意义**：规范里能自动验证的规则，就不要靠 Agent 自述「已检查」。

---

## seo-check.mjs · 构建期检查

对本地开发/预览服务器运行。从 `robots.txt` 找到 sitemap，抓取全部 URL，构建站内链接图，逐项验证。

```bash
node scripts/seo-check.mjs --base http://localhost:3000
```

| 选项 | 说明 |
|---|---|
| `--base <url>` | 站点根地址（必填） |
| `--config <path>` | 配置文件，默认 `seo-check.config.json` |
| `--json` | 输出 JSON 报告 |
| `--max <n>` | 最多检查 n 个 URL（大站调试用） |
| `--concurrency <n>` | 并发数，默认 8 |

**退出码**：存在「必须」级失败为 `1`，否则 `0`。

### 覆盖的规则

| 分类 | 规则 |
|---|---|
| 索引控制 | `IDX-01` canonical 存在 · `IDX-02` 自引用 · `IDX-03` sitemap 无 noindex · `IDX-04` 生产域名 · `IDX-05` 不 canonical 到首页 / 无重复目标 · `IDX-06` sitemap URL 可访问 · `IDX-07` robots 声明 sitemap · `IDX-08` sitemap 体积 |
| 元数据 | `META-01/02` TDK 唯一 · `META-03/04` 长度 · `META-05` 单 H1 |
| 关键词 | `KW-01` 位置覆盖 · `KW-02` 出现次数 · `KW-03` 密度报警 |
| 内链 | `LINK-01` 孤岛页面 · `LINK-02` 核心页入链数 · `LINK-03` 出链数 · `LINK-08` 站内死链 |
| 多语言 | `I18-03` 自引用 · `I18-04` x-default · `I18-05` 语言码格式 |
| 性能 | `PF-02` 非客户端渲染 · `PF-03` 图片 alt / 尺寸 |
| 可访问性 | `AY-01` 按钮可访问名称 · `AY-02` 表单 label |
| URL | `IA-04` 格式 · `IA-07` 点击深度 |
| AI 搜索 | `AI-01` 逐 crawler 显式决策、训练/搜索分流与私有路径边界 |

### 配置文件

项目根目录创建 `seo-check.config.json`：

```json
{
  "prodDomain": "https://example.com",
  "corePages": ["/", "/tool", "/guide"],
  "keywords": {
    "/": "ai image generator",
    "/tool": "background remover",
    "/guide": "how to remove background"
  },
  "ignore": ["/admin", "/api"],
  "titleMin": 20, "titleMax": 60,
  "descMin": 110, "descMax": 160
}
```

| 字段 | 作用 |
|---|---|
| `prodDomain` | 生产域名。用于 `IDX-04` 精确比对 canonical。**本地开发时也要填生产域名**——canonical 本来就应该指向生产域 |
| `corePages` | 核心页面路径。用于 `LINK-02`（入链 ≥5）和 `IA-07`（点击深度 ≤3） |
| `keywords` | 路径 → 主关键词。**不配置就跳过全部 KW 检查**，所以这一项要认真填 |
| `ignore` | 跳过的路径前缀 |

### 脚本不检查什么

语义类规则需要人工判断，脚本不会假装检查：

- `KW-04` 语义覆盖率
- `CT-05` 本页独有内容
- `IA-02` 搜索意图是否真的独立
- `TR-03~08` 作者与来源的真实性
- `PF-01` Core Web Vitals 实测值

脚本用正则解析 HTML，不是完整解析器。它可靠地捕捉结构化问题，
但极端畸形的 HTML 可能漏判。

---

## check-ai-crawler-policy.mjs · AI-01 专项检查

对运行中的本地 production `/robots.txt` 验证 `data/ai-crawler-policy.json`：

```bash
npm run robots:check
```

检查 11 个显式 user-agent、6 个全站阻止决定、5 个公开页允许决定，以及通配组和所有允许组的 `/admin/`、`/api/` 阻止边界。缺项、重复、跨组、根路径冲突或私有路径遗漏均以非零退出码失败。

`scripts/robots-policy.mjs` 同时供本专项、`seo-check.mjs` 和 `post-deploy-check.mjs` 使用，避免本地与生产验证口径漂移。

---

## check-terms-rights.mjs · TERMS-001 单页权利文案回归

```bash
npm run terms:check
npm run terms:check -- --built
npm run terms:check -- --base http://127.0.0.1:3100
```

无 `--base` 时验证源码中的确认文案、实际内容更新日期、H1/H2/段落结构、已验收 KW-02 句子与 3 次正文词频、两个原有链接，并用掩码 hash 锁定三个批准文字区域以外的 metadata/import/布局/正文不变。六个内存负例确保回归会失败；后续合法改动这些边界时须同步审阅本测试，不能只刷新 hash 绕过审查。

`--built` 只读取既有 `.next/server/app/terms-of-service.html`，核对构建产物中的正文与 metadata，并拒绝两个错误的 HTML 样例；明确不验证 HTTP、响应头或浏览器，不能代替本地服务验收。

`--base` 只接受本地 origin，对运行中的 production build 做 10 秒超时的原始 HTTP 验证：200、HTML 类型、确认正文与源码一致、title/description/canonical 不变、无 noindex，并拒绝两个错误的原始 HTML 样例。它不修改或授予游戏许可，也不替代浏览器、生产性能和授权部署后的检查。

---

## check-about-rights.mjs · ABOUT-001 来源与权利文案回归

```bash
npm run about:check
npm run about:check -- --built
npm run about:check -- --base http://127.0.0.1:3100
```

源码模式锁定用户确认的七处精确文字（两个 description、两个小标题、三段说明），并用掩码 SHA-256 保证其它 metadata/schema、imports、CSS/布局、正文和链接不变。确认稿的 `site's` 在 JSX 中使用 `site&apos;s`，渲染文字仍逐字一致。检查 1 H1 / 5 H2 / 7 H3 / 16 段、已验收 KW-02 句及主内容短语 3 次、全部 8 个主内容链接；14 个内存负例拒绝旧文、权限肯定、关键词、链接、隐藏布局、canonical、OG 或 schema 回归。后续合法修改冻结区必须重新审阅，不可只更新 hash 绕过范围确认。

`--built` 读取现有 `.next/server/app/about-us.html`；`--base` 只接受本地 origin，以 10 秒超时检查实际 HTTP 200、HTML 类型、无响应头 noindex。两种模式均核对全文与源码一致、两项新 description、其它 title/canonical/OG/Twitter 与两份 JSON-LD 不变，并拒绝 6 个错误 HTML 样例。正则检查不替代浏览器可见性、移动端、键盘/链接、真实许可或生产验收；该脚本不授予任何第三方权利，也不会修改页面。

---

## check-editorial-rights.mjs · EDITORIAL-001 编辑政策来源与权利回归

```bash
npm run editorial:check
npm run editorial:check -- --built
npm run editorial:check -- --base http://127.0.0.1:3100
```

源码模式锁定已确认的五处文字（三个 description、一个 H2、一段正文），使用掩码 SHA-256 保证其余源码逐字不变：Title/H1、canonical/index、imports、schema、CSS/布局、两个主内容链接和已验收 KW-02 句。检查 1 H1 / 4 H2 / 3 H3 / 10 段与主内容短语 3 次，并拒绝 14 个旧文、权限肯定、关键词、链接、隐藏布局、标题、canonical 或 schema 负例。后续合法修改冻结区域必须重新审阅，不能只刷新 hash 绕过确认。

`--built` 读取 `.next/server/app/editorial-policy.html`；`--base` 只接受本地 origin，以 10 秒超时核对 HTTP 200、HTML 类型、响应头无 noindex。两种模式验证三项新 description、其它 metadata/JSON-LD、全部主内容文字及节点/属性与源码一致，并拒绝 15 个原始 HTML 反例（包括隐藏正文、错误索引和额外段落）。正则检查不代替真实浏览器可见性、移动/键盘、法律许可或生产验收；不授予第三方权利，不写入页面。

---

## check-gallery-rights.mjs · GALLERY-001 示例来源与权利回归

```bash
npm run gallery:check
npm run gallery:check -- --built
npm run gallery:check -- --base http://127.0.0.1:3100
```

锁定已确认的六处文字（三个 description、CollectionPage.description、eyebrow、lead），以掩码 SHA-256 锁住其余源码、Title/H1、URL/canonical、布局、8 个 CSS 示例、4 条主链接与 KW-02 句/3 次覆盖。共享 CommentSection 和 locale 源码也保留本项基线，不增依赖；仅使用项目已有 TypeScript/React 做隔离 SSR。

主页面有 1 H1 / 4 H2 / 14 H3 / 19 段；加载实际共享组件的初始 SSR 空态另有 1 段。检查节点/属性、SVG/CSS 样例、空态和排序控件与构建/HTTP 一致；18 个源码与 20 个 HTML 反例拒绝旧句、虚构授权、标题、schema、链接、隐藏内容、示例或排序回归。四个只在内存运行的共享组件 SSR 状态覆盖空态、加载失败、有投稿、已点赞；不写 API/数据库/浏览器存储，不能代替真实交互验收。

`--built` 只读 `.next/server/app/gallery.html`。`--base` 只接受单一本地 origin，10 秒超时验证 HTTP 200、HTML 类型、无 noindex、完整 metadata、两份 JSON-LD 及初始 SSR 文本/结构；无参数只测源码/SSR。后续改冻结区需重新审阅确认，不可仅刷新 hash 放宽检查。所有结果均不授予版权、不代表生产通过；浏览器水合、手机、排序/链接/键盘必须另测。

---

## post-deploy-check.mjs · 生产环境回归

部署前先运行主域决策矩阵：

```bash
npm run canonical:check
```

该检查覆盖生产两种主机、HTTP/HTTPS、代理重写后的精确 Host、路径/查询参数、POST `308`，并确认 localhost、预览域和无关域不会被误跳转。

**每次部署后运行**（`OP-02`）。比 `seo-check` 轻量，只做关键断言。

```bash
node scripts/post-deploy-check.mjs --base https://example.com
node scripts/post-deploy-check.mjs --base https://example.com --sample 20
```

### 断言内容

- `IDX-07` robots.txt 可访问、未全站封禁、声明的 sitemap 指向生产域名
- `AI-01` 11 个 AI crawler 的训练/搜索分流与私有路径边界符合确认策略
- `IDX-06` sitemap 可访问且含 URL，URL 均指向生产域名
- `IDX-12` **抽样页面无 noindex**（超过半数带 noindex 时输出「立即回滚」告警）
- `IDX-01/04` canonical 存在且指向生产域名
- `OP-03/OP-11` HTTP apex、HTTP www、HTTPS www 使用一跳 `308` 归一到 HTTPS apex；嵌套路径和查询参数保持，规范根路径直接 `200`
- `META-08` 首页 og:image 可访问

### 为什么它比上线清单更重要

最灾难且最常见的 SEO 事故不是规划失误，而是：

- 某次部署把预发环境的 `noindex` 带上了线
- 环境变量没配好，canonical 全部指向 `xxx.vercel.app`
- 中间件或 CDN 规则误拦了 `/robots.txt`

这类事故的共同点是**静默**——网站看起来完全正常，三周后才在 GSC 发现流量塌了。
人工清单挡不住（谁会在每次部署后手动查一遍 canonical），只有自动断言可以。

---

## 接入 CI

### package.json

```json
{
  "scripts": {
    "canonical:check": "node scripts/run-canonical-host-check.mjs",
    "seo:check": "node scripts/seo-check.mjs --base http://localhost:3000",
    "seo:prod": "node scripts/post-deploy-check.mjs --base https://example.com"
  }
}
```

### GitHub Actions

```yaml
- name: Build
  run: npm run build

- name: Start server
  run: npm start &

- name: Wait for server
  run: npx wait-on http://localhost:3000 -t 60000

- name: SEO check
  run: npm run seo:check
```

部署后：

```yaml
- name: Post-deploy SEO regression
  run: npm run seo:prod
```

### 本地最低要求

不接 CI 也至少要在**交付前**手动跑一次 `seo-check`，
并在交付报告中附上输出。必须级失败未清零就交付 = 未完成。

---

## 常见问题

**sitemap 是动态生成的，本地跑不起来？**
先 `npm run build && npm start`，对生产构建跑，不要对 dev server 跑。

**报了一堆 `PF-02 主内容区仅 N 词`？**
说明页面是客户端渲染的空壳。这是真问题（`PF-02` 是必须级）。
如果是误报——例如内容确实在 `<main>` 外——调整页面语义结构，
脚本按 `<main>` → `<article>` → `<body>` 的顺序取主内容区。

**`KW-*` 全部没有输出？**
`seo-check.config.json` 的 `keywords` 没配。不配就跳过。

**`IDX-04` 报 canonical 域名不匹配？**
本地开发时 canonical 应该已经指向生产域名。如果你的框架在开发环境
输出 `localhost` 的 canonical，那本身就是配置问题——上线后很可能出事。

## check-locale-rights.mjs · LOCALE-001 文案与草稿语言边界

- `npm run locale:check`：四处确认文案及 MIG-SQUARE-001 已确认的数据绑定，其余源码冻结；真实 HomePage/GameSidebar 与明确组件桩的 8 语言隔离 SSR、metadata/direction 和 19 个源码反例。
- `npm run locale:check -- --built`：现有 Next 产物的首页/7 个 draft、主内容、header/footer、metadata、schema、canonical/noindex/hreflang，以及 20 URL sitemap 与反例。
- `npm run locale:check -- --base http://127.0.0.1:3100`：同一检查用于本地 production preview，逐请求 10 秒超时；只允许单一 loopback origin，不访问生产或写 API。

文案只允许已确认的一个共享可见侧栏句与三个遗留数据句变化。MIG-SQUARE-001 先用迁移前源码与真实组件验证 8 页 SSR 逐字节相等，再仅更新 HomePage 的源码冻结值；桩接口适配逐项核验 19 项播放器参数和迁移的 Square 字段，再序列化旧接口形态，保留全部旧 SSR/metadata/main 基线及 19/116/4 个反例，不用当前输出重置预期。检查器的固定预期来自确认时证据，不在运行时从可变看板/日志读期望值。Gallery 检查器的 expectedLocalesHash 保持原值；原 Gallery 检查和旧 QA 证据不删、不跳过。

隔离 SSR 中播放器/Hero/discovery/curated gallery/resources/install 为明确桩，不代表水合/视觉/交互通过。390px 的实际 Gallery 侧栏位于首屏下方，并未隐藏；应同时验证侧栏与手机菜单入口。v1.57 Browser 在 /es、/ar 发现长句的 available. 被既有两行样式裁切（clientHeight 35、scrollHeight 53），失败证据保留在 checks.json。v1.58 用户另行确认仅缩短为 `Style examples; approved posts when available.`，保持 CSS 和其余三句不变；固定 SSR/main 哈希只由已核验的 v1.57 输出作单句替换推导，并增加旧长句回流反例。新 source/built/HTTP/真实手机换行结果单列在 mobile-revision-checks.json，不能用源码/HTTP 通过替代视觉验收。实际权限、生产部署与 CWV 仍须独立验证。

## check-square-homepage.mjs · MIG-SQUARE-001 本地数据绑定

运行 `npm run square-home:check`，无需启动浏览器或访问网络。检查覆盖：

- 从验收过的迁移前源码保存的 8 页真实组件 SSR 固定输出；首页 6 条 Features、3 条 How-to、6 条 FAQ、4 条可见 Tips 与 3 个 JSON-LD。
- 19 项显式播放器入参、56 项根首页/草稿页文案绑定、38 项经 HomeHero/CoreGamePreview/FlashGenerator 传到模型边界的参数变更测试；参数变更测试仅在 GamePlayer 边界使用明确捕获桩。
- 150 个缺失/类型错误/非本地路径/空 SWF/无效尺寸/错误游戏或路由的拒绝用例；其他 GameRecord 仍可不提供 homepage。
- Square 非迁移字段、11 个运行时/样式/路由/其他游戏文件的原始契约、两个 SWF 文件哈希保持。MIG-OVAL-001 仅允许 Oval 新增 legacyPage 和 COVER 974×775：AST 精确移除新增块并还原 972×774 两个标量后，仍须匹配原文件哈希。MIG-PIXEL-001 另只允许下述六项 Pixel 数据值与侧栏类型标签，精确逆向还原后继续匹配旧哈希；其余 9 个文件完整冻结，不刷新原 SSR 或其它基线。通用模型仍拒绝 UNKNOWN/allowedDeliveryTypes=[]，不会凭本地兼容入口放行发布。

真实组件 SSR 仅容许既有 React 18 `fetchPriority` 警告；浏览器水合、点击、移动布局、当前 CWV、精确许可与部署证据均须另验。`locale:check -- --built` 和本地 `--base` 检查继续约束构建与 HTTP 的 SEO/语言/主内容输出。

MIG-OVAL-001 对 LOCALE 隔离检查的唯一追加适配在 discovery 测试占位数据边界：先精确核验新增 Oval legacyPage 和 974×775，再移除新块、还原 972×774，并匹配原完整 Oval 数据哈希。原 8 页 SSR、metadata、19/116/4 反例及原 Square 适配不改；新增 7 个反例防止该归一化掩盖许可、内容、关系或尺寸漂移。真实首页由 square-home:check 的 8 个完整 SSR 契约和本轮构建/浏览器另行证明。

## check-oval-legacy-page.mjs · MIG-OVAL-001 本地数据绑定阶段

- `npm run oval-page:check`：19 项显式播放器入参及真实 FlashGenerator 逐字段转发、75 项文字绑定、2 项侧栏图片和 3 项数据派生游戏链接检查。完整真实组件 SSR、metadata 与三个 JSON-LD 保留迁移前固定基线；允许的输出例外为封面 img 的 width/height 从 972×774 修正为 PNG 实际 974×775，以及 MIG-PIXEL-001 已确认的侧栏 External tool 标签/类型。两项均精确还原后比较旧黄金值，播放器容器比例不变。
- 250 个缺失、类型、路径、尺寸、游戏身份等反例必须被拒绝，26 项自身/重复/未知/未公开/非本地关系与空列表排除检查保持。legacyPage 对其他记录可选；原 Oval 字段、22 个相关源码与两个 SWF/一个封面文件保持，通用 UNKNOWN 模型仍拒绝，新游戏路由仍为空。
- `npm run oval-page:check -- --built`：核对当前 Next 产物的正文、全部 head metadata/canonical/index、原三份 schema，并拒绝 14 个原始 HTML 反例。
- `npm run oval-page:check -- --base http://127.0.0.1:3100`：同一契约用于本地生产预览；只允许单一 loopback origin、逐请求 10 秒超时，不访问生产或写 API。

完整 SSR 使用真实页面和共享组件；只有参数转发测试在 GamePlayer 模型边界使用明确捕获桩，数据变更测试使用内存记录。固定期望来自实施前 v1.64，不从可变看板、证据或当前 Record 反向生成。原始源码检查失败和检查器把导航 details 算入正文的初次诊断均保留在任务证据；后者以限定 main 范围修正，未刷新黄金输出。

浏览器仍须另验 1280/390/360 宽度、封面显示几何、点击/Enter/Space、loading→ready、重载、FAQ/排错及内链。已知旧手机首屏播放器靠下需单列，不据本地绑定宣称重设计完成、当前 CWV 达标或完整统一模板迁移完成；用户成果验收、精确许可与部署保持独立门禁。

## check-pixel-external-page.mjs · MIG-PIXEL-001 External Tool 一致性

```bash
npm run pixel-page:check
npm run pixel-page:check -- --built
npm run pixel-page:check -- --base http://127.0.0.1:3100
```

只允许已确认的 Pixel 文案/CTA/Header 参数、3/6/5/6 数据绑定、条款链接、WebPage/FAQ schema 变化及旧侧栏 External 标签。16 个源码区域、6 个 Record 值与 14 个 SSR 区域按精确值逆向还原后仍匹配 v1.66 前基线，不整批刷新旧黄金值；Pixel-only HTML 比较对称忽略 React 的空文本分隔注释，不能忽略可见文字。144 个其它源码/检查/配置文件保持原始哈希，游戏/许可/索引/布局与 SWF 不因此放宽。

源码模式包含真实页面/共享组件 SSR、41 个内容和链接绑定、原 PlayerModel 逐值比较、JSON-LD 转义反例、127 个缺失/矛盾记录或 Registry/HTTPS 反例、37 个差异还原反例、11 个标签/链接/额外内容反例及 7 个非公开/非 External 排除用例。数据变更是内存 fixture；只有检查客户端入参时在 GamePlayer 边界使用捕获桩。

Square/Oval/Locale 检查仅导入本脚本的精确还原函数，不跳过原测试：Pixel 源码复原后必须匹配旧哈希；仅在原 Pixel 侧栏 anchor 中移除已验证位置的 `External tool` 标签与 `data-game-page-type`，原标题/文字/链接/图片和其它卡片仍由原 SSR/HTML 校验。Locale 的 discovery 占位数据必须先校验六项新值及完整旧 Record 哈希；另有 8 个内存反例证明其不能掩盖额外文案、链接、schema 或权限变更。原 Oval 7 个、Locale 19/116/4 个及其它旧反例保留。

`--built` 和单一 loopback `--base` 检查 Pixel 原始 HTML、全部冻结 head/header/footer/正文、可见 FAQ 与三份 schema、2 个原站 CTA + 1 个条款链接，并拒绝 23 个 HTML 反例；另核对 Oval/七草稿的侧栏标签及英文首页原有标签。HTTP 每请求 10 秒超时，不访问生产或写 API。其它页面完整契约继续由 Square/Oval/Locale 与权利页回归验证。

浏览器须另验 Pixel / Oval / es / ar 三种宽度及英文首页桌面/手机、Tab/Enter/新标签页/FAQ/Report/Back/内链与首次资源边界。原站内部功能、真机、其它引擎、KW-04、CWV、真实许可与生产部署均不由此脚本宣称通过。
# GAMES-INDEX-001 follow-on check

`npm run games-index:check` validates real directory data/SSR, negative fixtures, JSON-LD escaping, and the actual deferred loader using explicit event/timer fixtures. `-- --built` checks the current Next output; `-- --base http://127.0.0.1:3100` checks one loopback production preview and artifact identity. Real navigation, advertising network and responsive QA remain separate.

The legacy Square/Oval/Pixel goldens are retained. `games-index-compat.mjs` reverses only exact approved source fragments and the three new shared navigation anchors before those old comparisons; the new directory check owns current behavior. Its source-delta fixture is a reviewable compatibility contract, not a replacement for historical evidence. Unrelated source, card text, metadata, SWF and Registry changes still fail.
# CATEGORY-001 单页样例回归

`npm run category-sample:check` 核对 Face Makers 样例、五分类真实数据/导航/广告边界和其余四页冻结契约；`-- --built` / `-- --base http://127.0.0.1:3100` 另验构建/当前 HTTP。真实浏览器及网络归属单独记录，不由源码守卫推断。

`category-sample-compat.mjs` 仅逆向已确认的精确源码增量和首页五个分类链接新增的文档导航属性，再交给原 `games-index-compat.mjs` / 迁移 golden。旧 golden 未刷新，UNKNOWN/许可未放宽；缺失片段、额外修改或非预期链接必须失败。此兼容结果不是“源码完全未改”的声明。

## CATEGORY-001 已确认剩余四页批量回归

`npm run category-remaining:check` 检查四页精确拟稿、真实记录依赖/缺失省略、卡片/分类导航、metadata/schema 和 Face Makers 完整 SSR/metadata 冻结；`-- --built` 与 `-- --base http://127.0.0.1:3100` 分别核对原始构建和单一 loopback HTTP。浏览器、水合、按文档归属的真实广告网络与桌面/手机另行验证。

原 sample 检查仍保留四页改造前的黄金值和全部反例；仅经 `category-remaining-compat.mjs` 验证并逆向本批已确认的精确说明/分类区块、schema 和 H2/aria-label 后比较旧 SSR，OG/Twitter 单独精确验证后还原旧 metadata。原源码兼容链前置批次增量逆向，未改动的源码不接受任意归一化；新增批次检查同时验证真实输出，不能以“还原旧值”代替测试新功能。

五页仍 noindex/follow、不进 sitemap、分类无广告，不更改 Registry/UNKNOWN 或既有权限判定。Pixel/Character 同一条记录的独立 SEO 价值、人类审核、CWV/真机、外站内部功能与发布状态不由这些测试宣称通过。
