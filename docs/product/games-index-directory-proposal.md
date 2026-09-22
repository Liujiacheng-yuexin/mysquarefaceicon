# GAMES-INDEX-001 · /games 本地目录完善方案

> 当前 v1.74 · 2026-09-04：用户已明确回复 `GAMES-INDEX-001 验收通过`，本地成果已验收。原 v1.73 实现/QA 与历史暂停记录保留；不重复索取验收。下一项只准备 [CATEGORY-001 单页样例方案](category-pages-proposal.md)，确认前不编码或部署。验收证据：[acceptance-checks.json](../quality/evidence/games-index-001/acceptance-checks.json)。

> 当前 v1.73 · 2026-09-04：用户要求下一步开发后，从已确认方案的暂停点恢复并完成本地实施/验证，现待成果验收。见 [交付证据](../quality/evidence/games-index-001/README.md)。下面的 v1.72 暂停、原方案“待确认/未实施”文字仅保留历史语境；不重复索取方案确认、不开放索引或部署。

> 当前记录 · 2026-09-04：用户已明确确认本方案，随后部分实施；开发中最新消息转为已验收的 HOME-DISC-001 同名确认，故目录暂停，等待明确新范围。尚未完成实现或验证，不能验收/部署。见 [暂停记录](../quality/evidence/games-index-001/implementation-interruption.md)。下文保留最初方案与当时待确认语境。

2026-09-03 · 原方案提交时待确认，尚未实施。用户已验收 CONTENT-QA-001，并要求下一步开发；任务状态仅以权威 HTML 看板为准。本方案确认不授权提交、推送、部署或开放索引。

## 1. 从当前实现继续

[现有目录](../../app/games/page.tsx) 已有面包屑、标题、本站/外部两组卡片、分类入口和范围说明，并非空白页。[集中式路由规则](../../lib/games/routes.ts) 当前只返回 3 条真实公开记录；新游戏仍须经过原状态、路径和权限判断。

| 条目 | 目录分组 | 唯一目标 |
|---|---|---|
| Square Face Generator | On-site avatar games | `/` |
| Oval Face Icon Generator | On-site avatar games | `/oval-face-icon-generator` |
| Pixel Art Avatar Icon Generator | External avatar tools | `/pixel-art-avatar-icon-generator`，先到本站来源说明页 |

本项补齐“可用的目录入口与质量约束”，不重做已验收的首页或播放器。选择沿用既有设计体系的小范围增强，不重排核心模块、不制作新图片或另起视觉风格；不以概念图冒充实现截图。

## 2. 布局与交互

保留现有顺序：共享导航 → Home / Games → H1 与简介 → 本站游戏 → External Tools → 分类入口 → 范围说明 → 共享页脚。

- H1 保留 `Avatar Games & Face Makers`。薄荷标题区、米白背景、棕色文字及既有 GameGrid/GameCard/CategoryChip 延用；桌面两列、窄屏单列，全部摘要可读。若移动入口被挤出首屏，只调整目录作用域内的间距，不改首页/分类共用样式。
- 本站组保持 Square、Oval 的固定目录顺序；外部组单列 Pixel，保留醒目的 External tool 标签。数量从实际分组计算，使用 `2 entries` / `1 entry`，不把 PUBLISHED 解释为刚完成可玩性测试。
- 卡片沿用记录的名称和摘要；点击只进入对应页面，不在目录内启动播放器或打开原站。Pixel 的 CTA 保留 `View source and access details`，并明确“先查看本站说明，再自行打开原站”。不添加 iframe、SWF、第三方缩略图请求或新的游戏功能承诺。
- 分类只链接已有、非空、白名单路由。当前数量为 Face Makers 2、Avatar Makers 3、Pixel Avatars 1、Retro Flash 2、Character Creators 1；这是重叠分类，不能相加冒充 9 个游戏。分类页内容与索引不在本项重做。
- 共享导航的 Game 下拉、手机菜单和页脚各增加一个 `All avatar games` 入口；保留所有原链接及顺序。检查现有首页/详情/分类返回目录的入口，形成双向可达关系，不改变这些页面的正文、主意图或播放器。
- 3 个条目不再重复铺 Featured 区：Square 保持首位即可，属于本方案对原路线图 Featured 建议的明确取舍，不标 Popular/Trending/New、评分或虚构日期。搜索、筛选、排序、收藏、最近玩过、Related 算法及新分类留在各自任务。

空态只说明当前没有条目；不添加占位游戏、死链接或未批准的新游戏。所有入口是带真实 href 的链接，保留可见焦点、键盘访问及浏览器返回行为。

## 3. 内容与 SEO 边界

- URL/canonical 固定为 `https://mysquarefaceicon.com/games`；继续 `noindex, follow`，不加入 sitemap，不增加参数页、分页、hreflang 或新的 `/games/[slug]` 记录。现有 3 个 legacy URL、分类和草稿语言页策略全部冻结。
- Title 保留 `Avatar Games & Face Makers | My Square Face Icon`；补齐目录自己的 OG/Twitter URL、标题与说明，避免继承首页分享文案。沿用现有通用品牌 OG 图，不能称作游戏实测输出。
- 只增量解释“本站游戏与外部工具如何选择、分类计数为什么重叠、点击后去哪里”，不改写 GameRecord 中已验收正文，不堆关键词或凑 250 词。遵循 [CONTENT-QA 标准](../content/game-page-quality-standard.md)，新文案逐条列事实与依据，Agent 自查和人类审核分开。
- 可补服务端 `CollectionPage` 与 `BreadcrumbList`，只描述可见目录和 3 个内部目标；不输出评分、评论、虚假日期或目录本身可玩的 Game/WebApplication 声明。原始 HTML 与水合页面均需检查。
- 现在只有 3 条记录，且没有本目录的 SERP 前十语义审核。因此推荐保留 noindex；RULES 附录 B 的“250 词且有效条目 ≥8”是项目的应该级参考，不是 Google 的硬门槛，也不凭达到数量就自动 index。未来开放索引须另行确认独立价值、KW-01/02/04 与全部必须级条件。

2026-09-03 查阅的一手依据：Google 要求页面可被抓取，才能读取 noindex；本方案不在 robots.txt 封锁目录。[noindex 说明](https://developers.google.com/search/docs/crawling-indexing/block-indexing)；目录入口使用真实链接和描述性锚文本。[可抓取链接说明](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)。这不是本目录已完成 KW-04 调研或已获得收录的证据。

## 4. 目录的广告边界

源码发现：[RootLayout](../../app/layout.tsx) 挂载全局 [DeferredThirdPartyScripts](../../components/DeferredThirdPartyScripts.tsx)，它在交互或加载后 12 秒请求 AdSense，没有按路由区分。这是源码判断，本轮没有重测网络或证明真实广告填充。

推荐将本目录明确设为 `adEligible: false`，原因是当前集合仍处于小样本、未开放索引的目录阶段；不挂广告位，也不只靠隐藏广告容器。广告与 Analytics 分开，GA/Cloudflare Analytics 现有行为不在此变更，不宣称“零第三方请求”或 CMP 已通过。

实现须覆盖直接访问、等待超过 12 秒、交互、从已有页面进入目录和前进/后退。如果上一页已加载广告脚本，不能仅移除 script 标签就声称副作用被清理；与目录相关的跨页入口必要时采用整页导航以隔离文档。限定调整目录策略、加载器及目录往返链接，其他页面资格、CMP 和全站广告治理不顺带改造。不能在此范围可靠隔离时，明确记录 AD-02 阻断并停止扩展，不以局部功能成功宣布发布通过。

## 5. 确认后的开发与验收

预计修改 `app/games/page.tsx`、目录专用数据/metadata 辅助模块（如需要）、共享导航/页脚及已有目录往返入口、目录作用域 CSS、必要的广告策略/加载器和专用测试；不改变游戏记录、Registry、SWF、部署配置或依赖。

- 数据/SSR：3 条记录各出现一次；DRAFT/BROKEN、未知或权限不符的新记录不进入目录；无空分类、重复路径或 guide/blog 混入。沿用原路由资格，不新增许可例外。
- 规则/SEO：IA-02/03/06、IDX-01～07/10、META-06/09、LINK-01/04/07/08、CT-02/03/05/06、AY-01/03、PF-02/05、AD-02/04；目录 noindex/canonical/sitemap、原有核心 URL 与 404 边界分别验证。
- 工程：任务级类型检查与回归，相关 games/routes/components/metadata/home/三条 legacy 页面检查，lint、Next build、Cloudflare/OpenNext build。测试子进程必须有超时、日志与退出码；未执行或失败单列。
- 真实页面：本地 production build 下检查 1280×900、390×844、360×800 的完整摘要、焦点、菜单、所有卡片/分类/返回链接；记录截图、控制台及广告网络边界。不加载目录播放器；不将模拟窄屏、HTTP 200 或外链跳转当成真机、内部编辑/保存或 CWV 达标。
- SEO 自动检查使用同一个本地 production base；保留既有 should、未完成 KW-04、生产一跳/广告/CMP 等风险。实施证据写回看板后只设 `待验收`，等待 `GAMES-INDEX-001 验收通过`。

LICENSE-GATE 材料任务保持取消，不催件、不恢复其活跃文件；Registry 的 UNKNOWN 与原权限事实不变。CONTENT-QA 验收只覆盖规范与模板，不代表 3 个页面已完成人类事实复审。

## 6. 停止点与回滚

本轮只有方案和验收登记，未修改网站代码、重跑应用 QA 或部署。后续回滚只逆向本项获准的目录、导航、策略与测试增量；不得覆盖脏工作区中的历史验收成果，不恢复材料待办。整体发布仍受未关闭的 P0 门禁约束。

请明确回复：`确认 GAMES-INDEX-001 目录页方案，进行开发`。
