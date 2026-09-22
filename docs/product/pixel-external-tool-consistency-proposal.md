# MIG-PIXEL-001 · External Tool 一致性单页方案

> 当前 v1.69 · 2026-09-03：用户明确要求“不用提供，取消该项任务计划和相关文件”。LICENSE-GATE 材料补充计划已取消，不再要求材料，也不依据历史记录重建或催办该任务。专属清单和两份预检文件已从活跃目录移至 docs/archive/license-gate-cancelled-2026-09-03，可恢复；旧 JSON 的原路径和待材料措辞仅为历史。
> 29 条验收、原 QA、共享 Registry/UNKNOWN、应用及 SWF 保留；取消不记作许可或发布验证通过。本轮只取消和清理引用，不部署或开始下一项。下文原版本计划保留当时语境，不能覆盖本次取消。

> 历史 v1.68 · 2026-09-03 · 用户已明确验收 EXTERNAL_TOOL_CONSISTENCY，共 29 条源验收。原方案与 v1.67 QA 保留；应用/URL/索引/布局未在本轮改动。
> 用户重新要求先部署累计成果再开发下一项；LICENSE-GATE 已阻塞，Square/Oval UNKNOWN/P0 不豁免。未提交、推送、部署或开始 CONTENT-QA-001。当前证据：docs/quality/evidence/mig-pixel-001/acceptance-checks.json。
>
> 下方历史方案确认/待验收文字保留原日期，不代表当前验收未完成。
>
> 历史 v1.67 · 2026-09-03 · 已收到明确方案确认，已按下方限定范围实施并完成本地验证；仅待成果验收，未部署。
> 证据：docs/quality/evidence/mig-pixel-001/README.md、checks.json；等待 MIG-PIXEL-001 验收通过。28 条源验收与 UNKNOWN/P0 保留。
>
> 下方 v1.66 内容是原提案原文，其待确认/确认后措辞保留历史语境，不表示当前尚未实施。
>
> 历史 2026-09-03 · 看板 v1.66 · **方案待确认，尚未实施**。
>
> 上一项 MIG-OVAL-001 的 LOCAL_DATA_BINDING 已获用户验收；原完整统一模板迁移仍延期、未完成。累计发布与 LICENSE-GATE 继续暂缓，UNKNOWN/P0 未关闭。
>
> 确认口令：**确认 MIG-PIXEL-001 External Tool 一致性方案，进行开发**。

## 目标与现码核对

本项对应路线图“将 Pixel 页面正式定义为 External Tool 类型”，不是新建游戏、复制外站或重做整个详情模板。

目标 URL 保持 /pixel-art-avatar-icon-generator，意图仍为访问 IconGenerators 原站的 pixel art avatar icon generator。当前记录已经是 EXTERNAL_TOOL / EXTERNAL_LINK / DIRECT_LINK_ONLY，通用 model 和 ExternalLinkAdapter 已在使用；不重新发明适配器或放宽许可。

本轮只读核对了现有源码与 v1.65 构建文件（不是新 HTTP/浏览器 QA）：

- 原构建中没有 iframe，主区有 5 个通往同一原站的链接，入口文字不统一。
- Hero、How-to 标题及 FAQ 仍有 4 处误导性的 Embedded 表述；FAQ 第 4 条与 Record 还存在 external embedded page / external page 差异。
- 3 How-to、6 Features、5 Tips 与 Record 完全重复；6 FAQ 中只有上述一条不同，可统一数据来源。
- 已输出 WebPage + FAQPage + BreadcrumbList，但 WebPage 内另含指向原站的 WebApplication；它并未把 application URL 写成本网站。本方案移除该嵌套，目的是与已确认的 External Tool 页面规则一致，不将当前状况夸大为已证实的索引事故。
- 页面没有原站 Terms of Use 链接。Shared GameCard 的首页/目录/通用 Related 已标记 External tool；GameSidebar 的旧 Pixel 卡片还没有明确类型标记。
- 当前静态页主区有 1 个 H1、9 个 H2、6 个 FAQ；约 869 个空白分词、主短语 10 次，仅作现状记录，不是正式 seo:check 或 KW-04 通过证据。

## 布局与交互

保留桌面主内容 + 右侧栏、手机原 DOM 顺序，不改全站 CSS，不套用 GameDetailTemplate，不搬动下方 Gallery / About / How-to / Features / Tips / FAQ / Related 的顺序。

首部仍为：导航 → External tool 标识 / 原 H1 / 原简介 → 一个主要 Open Original Page 链接 → 原外部访问卡片。卡片继续使用已接受的 GamePlayer → ExternalLinkAdapter，保留来源署名、卡片内 Open Original Page、Report Issue 和未验证手机体验的提示。

限定变化：

1. Hero 两个同目的地按钮合为一个 Open Original Page，旁边显示新标签页提示；保留 Hero 和卡片各一个有效出站 CTA，不增加 JS 跳转。
2. 卡片头 Original Page 链接改为非交互 External tool 标签；现有卡片下方网络提示区改为简洁的使用条款说明和原站条款链接。网络问题仍由 FAQ 回答。
3. 本页调用 SiteHeader 的现有参数：mobileStartLabel=Open，mobileStartHref=#external-generator。仅滚动到本站外链入口，不自动打开外站；其它页面导航不改。
4. 所有出站链接保持 HTTPS、target=_blank、rel=noopener noreferrer。无预加载原站资源、隐藏 iframe、镜像、代理、SWF、伪 Play/Reload/Fullscreen 控件或虚构加载失败状态。
5. GameSidebar 按已有公开 legacy route 解析其记录，仅为 EXTERNAL_TOOL 的 Pixel 项附加可见 External tool 标签和类型标记；原链接、名称、描述、图片、顺序不变，不把指南或未知 href 当游戏。

第 5 项是明确的跨页小范围例外：影响 Oval 及 /es、/vi、/ja、/th、/ar、/ru、/id 的 Pixel 侧栏卡片。英文首页已经有 External 标签，不新增或改它；Pixel 自身侧栏没有 Pixel 项，因此不应变化。不是对这些已验收页面的重设计，也不修复 Oval 既有首屏入口偏低问题。

实现后必须实测 1280×900、390×844、360×800：首个出站 CTA 在 Pixel 首屏可见，标签/说明完整换行，无横向溢出，Tab/Enter 可访问，新标签页目的地准确。若既有 CSS 无法满足，先报告并提出局部样式修订，不自行扩展成首屏重设计。

## 精确文案与数据变更

其余文案保持；不重新编写整页。以下为确认后允许的替换/新增，数组索引从 0 开始。

| 位置 | 确认后文字/行为 |
|---|---|
| Hero eyebrow | External tool · IconGenerators |
| Hero 主 CTA | Open Original Page（读取现有 player.ctaLabel）；删除同区域重复按钮 |
| Hero CTA 旁说明 | Opens icongenerators.net in a new tab. |
| 卡片头标签 | External tool（非链接） |
| 卡片说明 | This is an external tool from IconGenerators. Open the original page to use it; My Square Face Icon does not host or embed the generator. |
| 卡片下使用条款说明 | The original site's Terms of Use govern the generator and its outputs. This page provides a direct link, not permission to embed, copy, or use generated images commercially. |
| How-to H2 | How to Use the Pixel Avatar Maker on the Original Site |
| Record features[4].text | The original site restricts iframe embedding. Open the generator directly on icongenerators.net. |
| Record faq[2].question | Why does this page open the original site? |
| Record faq[2].answer | This page provides a direct link instead of embedding the generator. The original site restricts iframe embedding; use Open Original Page to continue on icongenerators.net. |
| Record faq[3].answer | VPNs, privacy extensions, or network rules can affect access to external sites. Open the original page directly and, if it is unavailable, check with your network administrator or try again later. |
| Record faq[5].answer | The original site's mobile behavior has not been independently verified. Detailed controls may be easier on desktop or in landscape mode. |
| 旧侧栏 Pixel 类型标签 | External tool |

Terms of Use 四词链接到 Registry 对应 pixel-avatar-external 的 licenseEvidenceUrl；署名与原站目的地沿用同一记录。新服务端 resolver 校验关联 ID、EXTERNAL_TOOL / EXTERNAL_LINK、DIRECT_LINK_ONLY、唯一允许 EXTERNAL_LINK、记录与 Registry 的目的地一致、安全 HTTPS 条款链接，缺失/矛盾时失败关闭，不通过默认值伪造许可。

删除页面的四组重复数组，直接读取 Record；FAQPage 与可见 FAQ 使用同一数组。只向客户端传既有必要 PlayerModel，不发送整个 Record 或 Registry。Hero 原简介、剩余 5 Features、全部 3 How-to / 5 Tips、其余 FAQ 与六张 curated 示例保持。

## SEO 与发布边界

- 冻结 URL、Title、所有 description metadata、H1、canonical、Open Graph/Twitter、index、robots、sitemap 成员、7 草稿 noindex/follow/无 hreflang 及全部旧路由。不要 noindex、合并、删除或新建 Pixel 页面。
- 唯一 schema 改动：移除 WebPage.mainEntity 的 WebApplication；Record seo.schemaTypes 同步为 WebPage / FAQPage / BreadcrumbList；FAQPage 跟随上面已确认的问答文字。其余 WebPage 字段和 BreadcrumbList 保持。
- 原站原始链接、本站相关链接目标不变；只减少重复原站 CTA、增加条款链接、本页移动导航锚点和上述 External 标签。
- KW-01/02 检查覆盖；KW-03 只作观察，不追求密度。KW-04 仍未执行 SERP 前十语义核验，不写“SEO 全面通过”，不伪造质量分、移动支持或发布日期。
- 来源复核：本次读取原站[生成器页](https://www.icongenerators.net/pixelavatar.html)与[条款页](https://www.icongenerators.net/terms.html)；其公开说明支持个人使用的有限范围及页面链接，未经书面许可限制嵌入/复制。这里只据此维持既有 DIRECT_LINK_ONLY，不授予本站或用户商业使用权，不改历史 Registry 的 reviewedAt。
- 本次 HEAD 只读探测在响应 Date 2026-09-03 05:07:28 GMT 返回 200、X-Frame-Options: SAMEORIGIN、CSP frame-ancestors 'self'。这是单次头部观察，不证明外站交互/保存/手机运行正常；网页读取可能来自工具缓存，不冒充完整即时法律审查。
- 不改两份 SWF、UNKNOWN 权利、许可校验、广告/隐私/分析脚本或部署配置；不提交、推送、部署、执行 seo:prod 或进入 CONTENT-QA-001。

## 文件与验收计划

拟应用文件仅：

- app/pixel-art-avatar-icon-generator/page.tsx：限定文案/CTA/header 参数、四组绑定、schema 和条款入口。
- data/games/pixel-art-avatar.ts：上述 1 个 Feature、3 个 FAQ 条目、schemaTypes；原路由、摘要、图片、权利与 Player 配置不变。
- lib/games/pixel-external-page.ts（新增）：限定本页的已校验服务端解析，不取代通用许可模型。
- components/GameSidebar.tsx：仅补公开 External Tool 卡片标记，重用现有样式。

配套检查：新增 scripts/check-pixel-external-page.mjs 和 pixel-page:check；仅按明确变更适配 scripts/check-square-homepage.mjs、scripts/check-oval-legacy-page.mjs、scripts/check-locale-rights.mjs，并增加 package.json / scripts/README.md 入口。不因旧测试冻结了 Pixel 而跳过或整批刷新黄金值：须先验证精确批准差异，再逆向还原旧源码/SSR 契约；专门反例验证这种归一不能掩盖多改文案、错误链接、假 External 标记或权限放宽。发现其它检查冲突先说明，不扩大文件清单。

实施后运行 type、零警告 lint、游戏数据/玩家/路由/组件/metadata/模板/首页/各历史权利页及 Square/Oval/Locale 回归、Next 与 OpenNext 构建；对新构建执行 Pixel 及冻结页 built/HTTP 对照、11 条 robots、完整本地 SEO。所有命令有超时、日志和退出码。

浏览器验证 Pixel 三种宽度的可见内容、raw/水合 schema、来源/条款链接、新标签页、FAQ、Report/Back、站内双向链接和键盘；Oval 与 es/ar 三宽度核对新增侧栏标签的换行/焦点，全部 7 草稿由 SSR/HTTP 验证；英文首页桌面/手机确认无变化。未点击前不得请求原站工具资源，也不加载 Ruffle/WASM/SWF。外站内部保存/生成、其他引擎、真机和生产 CWV 未测时必须单列未验证。

完成后只设 MIG-PIXEL-001 待验收，等待用户验收。当前这份方案未做应用改动，未重跑 type/lint/测试/构建/本地 HTTP/Browser/性能，也未核实预览存活。

回滚仅逆向本项批准的源码/测试/文档补丁，保留其它未提交成果和原 QA，不使用全仓 reset。当前只需回滚方案/治理增量，无应用或线上回滚。

