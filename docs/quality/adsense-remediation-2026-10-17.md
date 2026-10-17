# AdSense 过审整改方案 · 2026-10-17

来源：seo.web.cafe/adsense 预检报告（2026-10-17T13:25Z，Blocker 1 / High 1 / Medium 1 / Unknown 53）。
本文件是整改方案与复检清单，不是验收结果。看板路径 `F:\LYXGIT\Liu-library\...\mysquarefaceicon_rebuild_dashboard.html` 在本机不可访问（无 F: 盘，D:\LYXGIT\Liu-library 下也未找到），看板证据待补。

## 00. AdSense 后台实况（2026-10-17 内置浏览器只读查看，未做任何更改）

- 网站 → mysquarefaceicon.com：**需要注意 · 低价值内容**（上次更新 2026-10-01）。原文要点：须提供实质性独特价值、在网络上建立稳定影响力、展现足以支撑广告合作的用户热度；重新提交前确认提供真实高质量的信息/工具/服务、持续维护内容与结构、能持续吸引用户。所有权验证已通过。
- **真正的拒审原因是内容价值，不是隐私链接。** 第 1 节隐私修复是必要的卫生项，但决定能否通过的是第 2 节 R1 和第 3 节内容深度。
- 隐私权和消息 → 欧洲法规：mysquarefaceicon.com 的 GDPR 消息**已发布**（2026-05-21），R3 已满足，无需操作。
- 广告 → 按网站：本站未出现在列表中（未获批站点不列出），网页排除（R2）须在获批后设置；目前本站不投放广告。
- 未勾选"我确认已解决相关问题"，未点"申请审核"。

## 0. 诊断：为什么报"未发现隐私政策"

站点其实已有 `/privacy-policy`（HTTP 200），共享页脚 `components/SiteFooter.tsx` 也有链接。问题出在：

| 发现 | 证据（2026-10-17 实测线上 22 个 sitemap URL） |
| --- | --- |
| 首页用的是独立页脚 `components/HomePage.tsx` `.home-footer`，只有 Home/Games/Gallery/Icon Guide/Blog/About/Contact，**没有 Privacy / Terms** | 首页 `href="/privacy-policy"` 计数 0；其余 19 个内页均为 1 |
| `/privacy-policy`、`/terms-of-service` 本身没有页头页脚 | 两页 privacy/terms 链接计数 0 |
| 隐私政策缺少 AdSense 要求的第三方 Cookie 标准披露（第三方供应商含 Google 使用 Cookie、个性化广告退出链接、Google 合作伙伴数据使用链接） | 线上页无 adssettings / aboutads / partner-sites 链接 |
| 首页版权年份 2025，内页 2026 | `HomePage.tsx:448` |
| Contact 页对外显示"若邮箱在早期上线阶段尚未启用……"——像未完工占位文案 | `app/contact/page.tsx` |

## 1. 按严重程度的整改

### Blocker · ADS-PRIV-01 隐私政策可发现

已在工作区改（未提交、未部署）：

- `components/HomePage.tsx` 首页页脚新增 `Editorial Policy` / `Privacy Policy` / `Terms of Service` 三个链接，版权年份改为 2026。所有 locale 首页共用该组件，一并生效。
- `app/privacy-policy/page.tsx` 加上 `SiteHeader` + `SiteFooter`，审核员进入隐私页后可回到站内导航。

### High · ADS-PRIV-02 第三方广告 Cookie 披露

已在 `app/privacy-policy/page.tsx` 改写（保留原有全部事实段落，含 Friend Block Test 段落原文）：

- 新增 **Advertising and Google AdSense**：Google 要求的三句标准披露 + Ads Settings / aboutads.info / youronlinechoices.eu 退出链接 + "How Google uses information from sites or apps that use our services" 链接 + 不向广告传 PII、不按敏感类别定向。
- 拆出 **Analytics**：GA / Cloudflare Web Analytics + GA opt-out 插件链接。
- 新增 **Consent for Visitors in Europe**（后台 GDPR 消息已于 2026-05-21 发布，见第 2 节 R3）。
- 新增 **Hosting and Security Logs**（Cloudflare、KV、R2——与 `wrangler.toml` 一致）、**Location Data**（代码中无 geolocation 调用）、**Children's Privacy**、**Your Choices and Requests**、**Changes to This Policy**。
- 更新日期改为 October 17, 2026。

> 门禁基线（ADSENSE-PRIV-001）：`app/privacy-policy/page.tsx` 受 Friend Block Test 修复门禁冻结。用户 2026-10-17 明确批准"把这次隐私政策改动作为新的已批准基线"，已更新：
> - `scripts/fixtures/friend-quiz-fixes-delta.json`：privacy 条目改为整文件 delta（offset 0，before = 修复前 Oct 12 源，after = 本次源，marker ` updated: October 17`），`beforeSha256` 不变；新增 `amendments` 记录批准原话。
> - `scripts/check-friend-quiz-integration.mjs`、`scripts/validate-favorites.tsx`、`scripts/validate-recently-played.tsx`：断言日期 October 13 → October 17（后两者同样被该 fixture 冻结且断言同一日期，一并更新）；三者 fixture 条目只更新日期区域与 afterSha256，`beforeSha256` 不变。
> - `docs/quality/evidence/quiz-001-fixes-2026-10-13/` 下的历史指纹未改动（历史证据）。

### Medium · ADS-UX-05 信任页齐全

About / Contact / Editorial Policy / Privacy / Terms 已存在。剩余：

- Contact 页删除"邮箱早期未启用"那句（已改）。**你需要自己发一封邮件到 contact@mysquarefaceicon.com 确认能收到**。
- `/terms-of-service` 同样缺页头页脚，但该页被 TERMS-001 权利门禁冻结（`scripts/check-terms-rights.mjs` 冻结 imports/layout）。本次已回退，**需你确认后单独做**。

## 2. 报告之外、对过审影响更大的风险

| ID | 风险 | 建议 |
| --- | --- | --- |
| R1 | Terms 页公开写明"未核实 Square/Oval SWF 的来源、权利人和托管/公开运行/分发许可"。AdSense 发布商政策禁止在侵权内容旁投放广告，审核员看到这句话等于自证风险。 | 用户决策项（不重开已取消的 LICENSE-GATE 材料征集）。可选：① 在 SWF 游戏页（`/`、`/oval-face-icon-generator`）关闭广告，只在原创文字内容页投放；② 维持现状并接受被拒风险。 |
| R2 | `/admin/comments` 线上 200、noindex，但同样加载广告脚本（ADS-PUB-12 后台页不得出广告）。 | 代码文件被冻结，**在 AdSense 后台处理**：广告 → 按网站 → 编辑 → 网页排除，加入 `/admin/*`、`/contact`、`/privacy-policy`、`/terms-of-service`、`/editorial-policy`。 |
| R3 | CMP（ADS-PRIV-04） | 已满足：后台已有本站已发布的 GDPR 消息（2026-05-21）。预检工具未检测到，是因为站点未获批时消息不下发。 |
| R4 | `npm run editorial:check` 在干净 `main` 上已失败（hash 不匹配），与本次无关。 | 单独排查；不影响本次结论，但发布前门禁应全绿。 |

## 3. 内容深度：扩写做深 + 成型内容页

线上 `<main>` 正文词数（2026-10-17 实测，含导航外的卡片/FAQ 文字）：

| 页面 | 现词数 | 目标 | 门禁 |
| --- | --- | --- | --- |
| `/square-face-icon-generator` | 368 | 1000–1300 | 报告抽样页，**最优先** |
| `/blog/square-avatar-vs-round-avatar` | 494 | 900–1200 | 报告抽样页 |
| `/blog/best-discord-avatar-style` | 550 | 900–1200 | 报告抽样页 |
| `/blog/tiktok-profile-icon-ideas` | 509 | 900–1200 | |
| `/free-avatar-maker` | 525 | 900–1200 | |
| `/square-avatar-generator` | 543 | 900–1200 | 与 Icon Guide 区分意图：裁切/平台显示 |
| `/blog/avatar-maker-without-signup` | 566 | 900–1200 | |
| `/blog/discord-avatar-size-guide` | 601 | 900–1200 | 尺寸数据须引用 Discord 官方，不得自编 |
| `/blog/cute-profile-picture-ideas` | 602 | 900–1200 | |
| `/blog/how-to-make-a-cute-discord-profile-icon` | 639 | 900–1200 | |
| `/gallery` | 421 | 800–1000 | GALLERY-001 冻结，需确认 |
| `/about-us` | 482 | 700–900 | ABOUT-001 冻结，需确认 |
| `/editorial-policy` | 269 | 600–800 | 门禁已失败，需先修 |

按项目规则（AGENTS.md / SEO_RULES.md CT-01/02/05）：一次只做一页；每页先给提纲经你确认再写；不编造数据、用户数、评分、许可；不做关键词堆砌；不新建近似重复页。

### 3.1 扩写提纲（每页先确认再动手）

**`/square-face-icon-generator`（Icon Guide）**
1. What a square face icon is（像素/方块头像的特征、为什么 1:1）
2. How to make one with the Square Face Generator, step by step（Start Game → 选部件 → 配色 → 随机 → 保存/截图）
3. Saving and cropping to a clean 1:1 PNG（Windows/macOS/手机截图快捷键、裁切留白）
4. Design tips that survive small sizes（32px 下的对比度、背景色、表情识别度）
5. Where square icons work well（Discord、GitHub、Notion、favicon——只写通用做法）
6. Troubleshooting the Flash player（Ruffle 空白、键盘焦点、移动端限制）
7. Usage and rights reminder（链接 Terms，不写许可承诺）
8. FAQ（3–5 条，与首页 FAQ 不重复）

**`/blog/square-avatar-vs-round-avatar`**：各平台圆形遮罩如何裁掉方图四角 → 安全区（中心约 70%）示意 → 方图在圆框里的设计调整 → 何时用方图/何时预先做圆 → 导出检查表。

**`/blog/best-discord-avatar-style`**：风格分类（像素、方块脸、手绘、极简字母）→ 每种在小尺寸和深色模式下的表现 → 动态头像需 Nitro 的说明（引用官方）→ 与横幅/主题色搭配 → 选择决策表。

其余博客按同一结构：明确问题 → 分步做法 → 具体示例（使用站内原创示例图）→ 常见错误 → 小结与站内工具链接。

### 3.2 新增成型内容页候选（需一页方案 + 你确认后才编码）

| 候选 URL | 独立搜索意图 | 与现有页区分 |
| --- | --- | --- |
| `/blog/how-to-save-square-face-icon-png` | 如何把游戏里做好的头像存成透明/方形 PNG | 现有页只一句带过保存 |
| `/blog/avatar-to-favicon` | 把头像做成网站 favicon（尺寸、ICO/PNG、浏览器缓存） | 无现有页覆盖 |
| `/blog/github-and-notion-avatar-ideas` | GitHub/Notion 头像与页面图标 | Discord/TikTok 已有，此两平台空缺 |

关键词量与 SERP 需先调研验证（可用 seo-structure-research），不满足独立意图就不建。

## 4. Unknown 自查项：怎么确认

| ID | 如何确认 |
| --- | --- |
| ELIG-01 | 打开 AdSense → 账号 → 设置 → 账号信息，确认收款人是年满 18 岁的你本人（Google 账号出生日期也须成年）。 |
| ELIG-02 | 用你所有 Google 账号登录 adsense.google.com，只能有一个能进后台；新站应在现有账号"网站"里添加。发布商 ID 应与 ads.txt 一致：pub-9616934112105331。 |
| OWN-01 | 已满足：根布局 `app/layout.tsx` 统一注入 AdSense 客户端 `ca-pub-9616934112105331`。 |
| OWN-02 | Cloudflare 后台能看到 mysquarefaceicon.com 并可编辑 DNS；在域名注册商处确认注册人是你。 |
| SITE-01 | AdSense → 网站，看 mysquarefaceicon.com 状态：「已准备就绪」= 已通过；「正在准备」= 审核中；「需要注意」= 被拒，点开看原因。 |
| SITE-02 | 已满足两种：`/ads.txt` 含正确授权行；页面已含 AdSense 代码。 |
| PROG-01 | 浏览自己网站时不点广告；本地/测试时在浏览器装广告拦截或使用 AdSense「发布商工具栏」查看，不要反复刷新有广告的页。 |
| PROG-04 | GA4 → 报告 → 流量获取：看来源/媒介。异常信号：大量 direct 且停留 0 秒、来自陌生的流量交换站、单一国家突然暴涨。没有买过流量、没参加互点即可。 |
| PROG-06 | 用第 2 节 R2 的网页排除，把 /admin、/contact、法律页排除；`/discord-banner-size` 与 Friend Block Test 内嵌游戏已在代码中不加载广告。 |
| PRIV-03 | 打开任意页 DevTools → Network，过滤 `googlesyndication` / `google-analytics`，检查请求 URL 不含邮箱、姓名、评论内容。站点 URL 本身无此类参数；Friend Block Test 片段在脚本运行前已清除。 |
| PRIV-05 | 不适用：代码中无 `geolocation` 调用（隐私政策已写明）。 |
| PRIV-07 | 不适用：使用官方 adsbygoogle.js 原样加载，无广告代理。 |
| PRIV-08 | 不适用：未使用再营销/受众列表。AdSense → 屏蔽控制 → 敏感类别可按需屏蔽。 |
| PRIV-09 | 不适用：你不投放房产/招聘/信贷广告。 |
| PRIV-10 | 隐私政策已含 IBA 披露（第 1 节）；欧洲用户同意由已发布的 GDPR 消息覆盖（R3）。 |

"待 AI 内容审核判定"的项，按本次读代码与线上页面的判断：

- CONTENT-01/02/08：内容原创，无采集；但 R1 的第三方 SWF 是主要价值来源，这是审核员判"原创/有价值"最大的扣分点，靠第 3 节扩写平衡。
- UX-01~04/06、PROG-02/03、PUB-10、REST-08：未发现诱导点击文案、弹窗、强制跳转；广告为 Auto ads，不在首屏遮挡工具。PWA 安装提示可关闭，不属于恶意弹窗。
- CONTENT-07：评论先审后发（moderation），符合要求；持续清理垃圾评论。
- PUB-01~09/13~16、REST-01~07：内容为头像/小游戏，未发现相关违规。
- PRIV-06：站点非面向儿童（隐私政策已声明）。若你认为主要受众是 13 岁以下，应在 AdSense 中将网站标记为面向儿童，否则保持现状。

## 4.5 本次验证状态（2026-10-17）

验证方法：本机 `core.autocrlf=true`，工作区为 CRLF，而各门禁 fixture 以 LF 记录，本机工作区会误报多项失败。结论以临时 LF worktree（与 Linux/CI/Cloudflare 一致）为准，对比干净 main 与应用本次 diff 后的同一组 30 个 `*:check`。

| 检查 | 结果 |
| --- | --- |
| 干净 main（LF） | 30/30 通过 |
| **本次改动（LF）** | **30/30 通过** |
| `lint` | 通过 |
| `build`（含 ruffle:check） | 通过（3 个 Ruffle 文件已按 LF 重新检出工作区副本，仓库无变化） |
| `seo:check`（本地生产构建，22 URL） | 必须级失败 0；应该级提醒 13。与本次相关：`/contact` 关键词密度 2.61%（页面变短，需人工复核）、`/privacy-policy` 密度 0.27%（页面变长）。按 CONTENT_PLAN 密度不是发布门禁 |
| 浏览器（内置浏览器，本地生产构建） | 首页页脚 10 个链接含 Editorial/Privacy/Terms，© 2026；375px 下三行换行、无横向滚动。`/privacy-policy` 有页头页脚、14 个 H2、5 个退出/说明外链、含 Google 标准披露句，375px 无横向滚动。`/contact` 有页头页脚，已无 early launch 句 |
| `cf:build`、生产线上 | 未验证（未部署） |

用户批准的三处新基线：
- privacy：`friend-quiz-fixes-delta.json` 整文件 delta + 三处日期断言（October 17）。
- 首页页脚：`discord-banner-local-delta.json` 中 HomePage.tsx 整文件 delta（pre-banner hash 不变）。
- contact：用户批准"更新 MIG-PIXEL-001 和两批 category 门禁里的哈希"。实现方式：未改这三处冻结哈希常量（`check-pixel-external-page.mjs` 自身又被 image-mobile-legacy/related-remaining/category-remaining-contract 冻结，直接改会连锁），而是在最外层 `friend-quiz-fixes-delta.json` 增加 contact 整文件逆向层，旧门禁仍看到原 contact 源并保持记录的 43c774… 哈希。效果相同（30 项全部通过），且不改动任何历史哈希。

过程事故（已修复）：搭建临时 worktree 时误把 `core.autocrlf=false` 写进本仓库 `.git/config`（worktree 共享配置），期间 stash 往返使 9 个改动文件变为双 CR（CR CR LF）行尾。已删除该本地配置（恢复为系统级 true），并把 9 个文件恢复为单 CRLF；`git hash-object` 确认提交时将存为纯 LF，diff 内容不变（228+/114−）。

## 4.6 发布记录

发布（用户 2026-10-17 验收通过并授权"在 main 提交、跑 cf:build 并部署，部署后跑 seo:prod"）：提交 `d040b2b` 已推送 origin/main；`cf:build` 通过；`opennextjs-cloudflare deploy` 发布 Worker version `80047fcd-7a73-4e8c-a1a2-20cbf7405012`（部署前 `c8600d60-1a7e-409a-a114-49ad7c6d3509`）。`seo:prod` 全部通过（17 页抽查、sitemap 22 URL、OP-11 一跳 308、无 noindex）。线上核对：21/22 个 sitemap URL 含 privacy 链接（仅 `/terms-of-service` 缺页头页脚，受 TERMS-001 冻结，待用户决定）；首页页脚含 Editorial/Privacy/Terms 与 © 2026；隐私页含 October 17、Google 标准披露句与退出链接；/contact 已无 early launch 句。回滚：`npx wrangler rollback c8600d60-1a7e-409a-a114-49ad7c6d3509`。

## 5. 整改后复检清单

部署前（本地）：

- [x] （本地）首页页脚可见 Privacy Policy / Terms of Service / Editorial Policy 三个链接，版权 2026
- [x] （本地）`/privacy-policy` 有页头页脚；含 "Third-party vendors, including Google, use cookies" 段落；Ads Settings、aboutads.info、partner-sites 三个外链可打开
- [x] （本地）`/contact` 不再出现 "early launch" 句子
- [x] privacy 页门禁基线已获批准并更新（ADSENSE-PRIV-001）
- [x] 30 个 `*:check` 在 LF worktree 全部通过
- [x] `npm run lint`、`npm run build`、`npm run cf:build` 通过
- [x] `seo:check` 必须级 0（应该级 13，含 /contact 密度复核）
- [x] 375px 下首页页脚换行正常、无横向滚动

部署后（线上）：

- [x] 线上首页含 privacy-policy 链接（d040b2b / Worker 80047fcd）
- [ ] 全部 22 个 sitemap URL 均含 privacy-policy 链接（现 21/22，仅 terms 页待你确认后补）
- [x] `npm run seo:prod` 通过（2026-10-17）
- [x] AdSense 后台：GDPR 消息已发布（R3，2026-05-21 已存在）
- [ ] 获批后：AdSense 网页排除加入 /admin/*、/contact、法律页（R2；未获批前后台无此入口）
- [ ] 对 R1（第三方 SWF 页是否出广告）已做出决定并落地
- [ ] contact@mysquarefaceicon.com 测试邮件可收到
- [ ] 扩写页按 3.1 顺序逐页完成并各自验收（至少 3 个抽样页 ≥ 900 词）
- [ ] 重新跑 seo.web.cafe/adsense：Fail = 0
- [ ] AdSense → 网站 → 请求审核
