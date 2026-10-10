# Discord Banner Size · P0 实现、验证与发布记录

## 2026-10-10 · 授权发布批次

用户明确要求“将遇到的问题进行修复，修复完成后再提交并部署，并且以后直接修改main”。已 fetch 核对：旧 main 是已发布基线 `8efe9c7` 的祖先，无分叉；原 26 个交付文件与上一轮证据逐项同哈希。main 已安全快进并承接这些未提交改动，`AGENTS.md` 记录以后默认直接在 main 开发；以后是否提交/部署仍按当次用户授权。没有新建分支、强推或覆盖其它工作。

本批实际修复：

- Firefox 153 无法解码移除 EXIF 后由多个 Blob slice 拼成的 JPEG。最小对照中原始 JPEG 成功、分片 Blob 失败、相同字节的连续 Blob 成功；现将受 20 MB 上限约束的压缩字节合并为一个缓冲再解码，没有增加原尺寸 Canvas。八种旋转/镜像重新验像素。
- 共享导航橙色按钮改用深色文字；品牌链接可访问名称包含可见文字。Banner 页手机 `Resize` 链接直达本页编辑器。Lighthouse 手机初始态和载图态的 Accessibility/SEO/Best Practices 均 100，0 失败；这不是性能/CWV 分数。
- 旧分类 SSR 冻结检查因上述品牌名称修正而失败；加入仅反向还原该完整链接属性的测试适配，保留原 golden 和未授权漂移负例。没有重录旧基线掩盖变化。
- 补录官方 Server Banners 文档显示的更新日 **May 31, 2022**（2026-10-10 再核查）。其余来源复核日仍保留 2026-10-09，不用构建时间冒充核查日期。

发布前验证：`banner:check` 28 组 / 860 断言；全部 30 项专项/回归、TypeScript、lint、Next 43 页与 OpenNext 构建通过。Chrome 主矩阵 20 组 / 46 个真实下载；Firefox + Playwright WebKit 22 组 / 32 个真实下载，覆盖 EXIF 1–8、三预设 Crop/Fit、JPEG、拒绝格式/资源限制、键盘、清理、隐私和 320/375/390/768/1440 宽度。Chrome 再覆盖 20 次替换、失败恢复、并发、DPR 及 200% CSS/text 模拟。当前本地 SEO 21 URL：0 must、12 should，robots 通过。WebKit 引擎测试不等于真实 Safari/iPhone。

KW-04：精确查询 `"discord banner size"` 的检索工具前十条结果现已可读，按返回顺序为 [Discord](https://support.discord.com/hc/en-us/articles/360028716472-Server-Banners)、[PostSize profile](https://postsize.org/discord/banner-size)、[Woodpunch](https://woodpunchsgraphics.com/blogs/tutorials/discord-banner-size)、[Discord Banner Hub](https://www.discordbanner.org/size-guide)、[AdFlint](https://www.adflint.com/sizes/discord-banner)、[On Air Kit](https://www.onairkit.com/discord-banner-size)、[Social Toolshed](https://www.socialtoolshed.com/discord/banner-size)、[Linklay](https://linklay.io/social-media/discord/banner-size)、[PostSize server](https://postsize.org/discord/server-banner-size)、[DisTools](https://distools.net/discord-banner-size)。抽取 12 项主题，已覆盖 10 项（83.3% ≥ 70%）：场景、尺寸/比例、invite、格式/动画、文件大小、权益、构图、清晰度、移动展示和本地隐私。Discord 客户端上传步骤链接官方文档，不重复易变界面教程；模板库不属 P0。检索器顺序不是固定地区的 Google 排名，竞争页面中与官方矛盾的数值没有采用。

本批证据目录：`C:/Users/liu/.codex/visualizations/2026/10/09/01a12051-6ea0-7192-8bb3-c0caac116cd5/discord-banner-release-2026-10-10/`；包含修复前失败、Firefox 最小对照、最终检查、下载及截图。提交/部署完成后的 commit、Worker version、生产检查和回滚收据写入该目录与权威 HTML 看板，不预填成功。发布前生产回滚点为 Worker `261ecffc-7a02-4cd9-b007-9e0069e7f0bd`。下文保留 2026-10-09 本地交付历史，其中“未授权/未部署”描述的是当时状态。

仍未验证：真 iPhone/Android、Apple Safari、人工读屏、浏览器菜单原生 200% 缩放、峰值内存/移动性能、真实 Discord 上传/账号权益、GSC 收录与真实 CWV。Square/Oval 权利 UNKNOWN、IMG-001 原验收及已取消材料任务保持原记录。

## 2026-10-09 · 原始本地交付

2026-10-09。任务状态只以 Liu-library 中的权威 HTML 看板 `DISCORD-BANNER-001` 为准。当前用户明确要求按附件新建该页面并交付可审查代码；附件是规格依据，不构成其余任务、分支、提交或发布授权。

## 本页范围与布局

- 唯一新页面 `/discord-banner-size`，搜索意图为尺寸查询及本地静态图片调整，与现有头像尺寸文章区分。复用 `SiteHeader`、`SiteFooter`、`GameBreadcrumb`、站点按钮和颜色；不加入 Game Data，不改变首页核心工具顺序。
- 顺序：H1 与三场景短答案 → 核查日期及 680/600 来源差异入口 → 三预设和上传 → Crop/Fit 与下载 → 四场景规格表 → 官方差异说明 → 操作/权益/显示限制 → FAQ → 来源与相关头像入口。
- 桌面为预览与控制双栏；手机为单栏，窄屏卡片使用短标签、保留完整可访问名称。鼠标可拖动，键盘使用原生 range；触屏使用滑杆，预览保留纵向滚动。
- Title 为 `Discord Banner Size Guide & Free Image Resizer`；唯一 H1，非 www self-canonical，index/follow；独立 1200×630 PNG OG，WebPage/BreadcrumbList，与首个 HTML 的可见内容一致。不添加评分或 FAQ 富结果承诺。
- 用户本次直接指定附件的页面、交互与 P0 范围并要求实施，因此沿该明确授权开发；没有从历史看板推断新方向或发布许可。600×240 独立预设、动画、多文件批处理、远程 URL、自定义尺寸和安全区叠层均未实施。

## 规格与来源

页面逐项链接 Discord 官方文档；统一配置位于 `lib/discord-banner/config.ts`，复核日期固定为 **2026-10-09**，不会随构建自动更新。

| 场景 | 文档原意与权益 | 来源及文档日期 |
|---|---|---|
| 全局个人资料 | 最低 680×240；Full Nitro；PNG/JPG/animated GIF，小于 10 MB | [Custom Profiles](https://support.discord.com/hc/en-us/articles/4403147417623-Custom-Profiles)，2026-03-11 |
| 服务器内成员个人资料 | 推荐最低 600×240；Full Nitro；同上格式及大小条件 | [Per-Server Profiles](https://support.discord.com/hc/en-us/articles/4409388345495-Per-Server-Profiles)，2025-08-06 |
| 服务器频道列表 banner | 建议至少 960×540，16:9；1920×1080 是可缩放示例而非上限；通常静态 Level 2 / 7 boosts、动画 Level 3 / 14 boosts；需管理权限，Partner 有例外；未从文档补造通用字节上限 | [Server Banners](https://support.discord.com/hc/en-us/articles/360028716472-Server-Banners)；[Guild API](https://docs.discord.com/developers/resources/guild#modify-guild)；未记录页面更新日 |
| 邀请背景 | 文档指定精确 1920×1080；静态 JPG/PNG，无动画；Level 1+ / 2 boosts；未补造字节上限 | [Server Invite Background](https://support.discord.com/hc/en-us/articles/4415841146391-Server-Invite-Background)，2022-04-08 |

权益另核对 [Boosting FAQ](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-FAQ)（2026-09-14）和 [Nitro / Basic](https://support.discord.com/hc/en-us/articles/115000435108-What-are-Nitro-Nitro-Basic)（2026-09-29）。官方文档核对不是登录账户后的实际上传测试。没有把 600×240 宣布为全部过时，也没有把 5:2 或 10 MB 写成所有 banner 通用规则。

## 实现与隐私

输入按真实文件签名校验，仅 PNG/JPEG；上限含等号：20,000,000 bytes、16,000,000 pixels、最长边 8192。PNG 检查有界 chunk/CRC、拒绝 APNG 控制块；JPEG 检查段、SOF、扫描与 EXIF。解码前检查尺寸，拒绝损坏、截断和不支持的签名，扩展名不决定格式。

EXIF 1–8 读一次；先从解码输入移除方向元数据，再使用原始位图和方向矩阵绘制。没有原图尺寸的中间 Canvas。Crop/Fit 共享纯函数几何与同一渲染器，预览及导出 Canvas 都使用目标真实像素，不依赖 CSS、DPR 或截图尺寸。

导出后校验 Blob MIME、严格小于 9,500,000 bytes、真实签名和像素，并重新解码验证；PNG 回退不能伪装 JPG。JPEG 质量 0.50–0.95、默认 0.92；明确背景色。文件、参数变化立即失效旧下载；解码/编码分别串行，版本标记丢弃过期结果。替换、移除、离开时释放位图及 URL。

编辑器没有网络、日志、storage 或文件名展示入口。新页停用 GA/AdSense/Cloudflare Analytics 客户端脚本，相关入口使用完整文档导航，并防护未来遗漏的 SPA 入口；路径判断解码后匹配，覆盖 `/%64iscord-banner-size` 等可被框架识别的编码写法。其余页面仍沿现有统计流程。现有 Service Worker 只缓存站点静态资源，检查未发现图片 Blob、文件名或原始元数据落盘。导出不复制原始 EXIF/GPS 块；不声称所有浏览器的任意元数据绝对清空。线上可能存在的边缘注入仍需发布后的独立检查。

## 可复查文件

| 文件 | 用途 |
|---|---|
| `app/discord-banner-size/page.tsx` / `banner.module.css` | 服务端规格正文、元数据、结构化数据及页面响应式样式 |
| `components/DiscordBannerEditor.tsx` | 上传、构图、键盘、并发、错误、真实下载与清理 |
| `lib/discord-banner/{config,geometry,image-file,canvas}.ts` | 集中规格、纯函数几何、输入解析及 Canvas/Blob 校验 |
| `app/layout.tsx` / `components/DeferredThirdPartyScripts.tsx` | 本地文件页面的第三方脚本隔离 |
| `components/home/HomeResourceLinks.tsx` / `app/blog/page.tsx` | 现有资源区域的原生链接 |
| 三篇现有 Discord 文章的 `page.tsx` | 每篇一条相关正文内链，原 URL/H1/canonical 保持 |
| `app/sitemap.ts` / `seo-check.config.json` | 已实现新页的 sitemap 与目标关键词 |
| `public/discord-banner-size-og.png` / `scripts/generate-discord-banner-og.mjs` | 本站纯文字规格分享图与可重建脚本，不使用外部图片 |
| `scripts/check-discord-banner.mjs` / `package.json` | `npm run banner:check` 的几何、边界、格式和兼容负例 |
| `scripts/discord-banner-compat.mjs` / `fixtures/discord-banner-local-delta.json` / `image-mobile-legacy-compat.mjs` | 精确反向还原本次共享文件增量，保留历史冻结断言；旧 golden 未更换；额外变更仍失败 |

## 测试与证据

本机证据目录：`C:/Users/liu/.codex/visualizations/2026/10/09/01a12051-6ea0-7192-8bb3-c0caac116cd5/discord-banner/`。`delivery.json` 为机器可读索引；`browser.json` / `final-ui.json` 包含测试、真实下载文件属性、截图、网络及未覆盖范围。浏览器脚本、夹具和截图均在仓库外。

- `npm run banner:check`：27 组，843 项数字/结构断言；A01–A09、A13–A14 几何和 B01–B06 边界覆盖。完整 20,000,000-byte PNG 可通过解析，20,000,001-byte 输入拒绝；16 MP/8192 边界也做了浏览器加载。
- Chrome 主矩阵：20 组、46 个实际下载；覆盖 A01–A14、B01–B10，包括 EXIF 1–8 各样本四象限像素、PNG 预览与文件逐像素一致、Fit 留边、透明度、JPEG 背景和质量、DPR 1/2/3、200% CSS/text 模拟、故障、过期结果及 20 次替换清理。
- 最终 UI 补测：12 组、9 个实际下载，含 Edge 三尺寸、拖放、鼠标拖动、多文件投递取消旧加载、原生解码异常、Chrome 可访问性树、焦点、五宽布局及模拟触屏滚动。
- 输入上限实测：合法带 tEXt 块的 20,000,000-byte PNG 在 Chrome 完成解码与 680×240 PNG 下载，见 `exact-limit.json`。
- 最后发现框架接受编码路径，而原始路径判断会遗漏；已修复入口的解码匹配，重新通过 30 项回归、Next/OpenNext 和 SEO。`encoded-path.json` 中两种编码入口与带查询参数入口的 3 个下载、等待 13 秒后的脚本/网络/storage/console 检查通过，首页 GA 初始化保留。各批次累计校验 **59 个实际下载文件**；最终路径修正没有改变已验证的渲染器与 UI。
- 320/375/390/768/1440 CSS px：空白、载图及错误态无横向溢出；可见主要编辑控件高度至少 44px；最终上传按钮在 900px 高的首屏内。截图已人工查看。200% 使用 CSS zoom/text resize，不冒充浏览器菜单缩放或真机。
- TypeScript、零警告 lint、30 个专项/回归命令、Next 静态生成 43 页和 Cloudflare/OpenNext 等效构建通过；OpenNext 的 Windows 兼容性提醒仍保留。
- 本地 SEO：21 URL，0 必须失败、12 个应该级建议。新页关键词密度约 0.27%；其余 11 条为已有页面建议（其中新增内链使一篇既有文章的低密度提醒数值轻微变化）。不靠重复关键词消除此建议。robots 策略通过；首个 HTML 的 HTTP 200、唯一 Title/H1、index/follow、非 www canonical、独立 OG 和真实 schema 已检查。
- 本页最终独立上下文 console/pageerror 均为 0、网络仅同源 GET；主矩阵往返旧首页阶段保留 3 条 GA/广告连接关闭错误。Long Task 观察值包含夹具传输和故障注入，不能作为真实 CWV 或手机性能结果。

最初发现并修复：320px 上传按钮过低、radio 显式标签和正文结构造成的 SEO 必须项失败、移动预设断词。首次 UI 测试选择器误选多个 live region、触控合成器未产生滚动等测试脚本失败单独保留；最终使用真实 CDP touchStart/Move/End 事件验证滚动，不把第一次失败覆盖成通过。

## 语义覆盖与未验证范围

针对 `discord banner size profile server invite crop fit resizer` 检索结果中前 10 个工具/规格页面建立主题清单，读取搜索返回的正文/摘要，没有上传竞品图片或复制素材。样本依次为 [Discord Banner Hub](https://www.discordbanner.org/resizer)、[AdFlint](https://www.adflint.com/sizes/discord-banner)、[EmoteResize](https://emoteresize.com/discord-banner-resizer/)、[ClipZeal](https://clipzeal.com/discord-banner-size)、[Postiz](https://postiz.com/tools/discord-banner-resizer)、[SocialResizer](https://socialresizer.com/discord-profile-banner-size.html)、[Blinkimg](https://blinkimg.com/resize-image-for-discord-pfp)、[GIFBloom](https://gifbloom.com/discord-banner-resizer)、[DisTools](https://distools.net/discord-banner-size)、[On Air Kit](https://www.onairkit.com/discord-banner-size)。这些是检索器返回顺序，不是已核验的固定 Google 排名；部分摘要与官方规格冲突，页面事实只采信官方来源。

本页覆盖 10 个主题：profile/server 区分、invite、600/680 差异、尺寸/比例语义、格式/大小、动画边界、Nitro/boost/权限、Crop/Fit、不清晰或被裁剪的原因、本地隐私与下载。动画处理、模板库及批量处理因本次 P0 边界不实现；页面明确说明不支持。该清单覆盖已抽取主题，但精确主词 `discord banner size` 的补充检索连续两次连接失败，浏览器备用查询也遇到 Google 验证页，因此 **KW-04 的完整主词前十排名复核仍未验证**，不将抽样清单伪装为全部 SEO 人工门禁通过。备用查询记录见 `primary-query-browser-attempt.json`。

真 iPhone/Android、Firefox/Safari、人工读屏、浏览器菜单 200% 缩放、峰值内存/移动性能、Discord 实际上传与账号权益、生产边缘脚本、正式域名跳转/生产 SEO/GSC 及真实 CWV 未验证。Edge 仅为烟测，不代表另一渲染引擎。既有 Square/Oval 权利 UNKNOWN 与 IMG-001 原验收状态不变；取消的 LICENSE-GATE 材料任务未恢复。

## 交付和回滚边界

开始时工作区干净，分支 `codex/game-platform-rebuild`，HEAD `8efe9c73aaaa1a3c02c528ff54a1207f8c47f187`；本地 main 和 origin/main 为 `a1a2c9df94fb51fced7c39406de28c7e306379c7`，HEAD 领先 main 两个提交。实施前当前分支与 main 均未发现目标路由或未发布实现。这些是本机 refs，未 fetch，不冒充 GitHub 远端即时状态。没有切分支或执行 commit、push、deploy、IndexNow 或 GSC 提交。

所有交付均为本地未提交增量，等待用户验收；生产结果为未验证/未部署。需要回滚时，只撤销本任务清单的新增文件与行级修改，并从证据目录的 `board-before.html` 恢复本次看板增量；不可整库 reset 或覆盖交付后用户新增的修改。没有生产版本需要回滚。
