# GALLERY-001 · 示例来源与权利声明修正方案

状态：`已完成（本地已验收） / 生产未验证 / 未部署`。权威状态以 Liu-library HTML 看板 v1.55 为准；本文件是方案、实施与验收附件，不是第二份任务状态表。

方案原记录时间：`2026-09-02T10:24:29.697Z`。影响 URL：`/gallery`。用户先确认六处替换，现已明确回复 `GALLERY-001 验收通过`；本次仅记录本地验收，不授予实际许可或生产批准。

第 1–6 节保留 v1.53 方案语境与历史预演日期，第 7 节保留 v1.54 实现/验证，第 8 节记录当前明确验收。

## 1. 为什么是这一项

- 当前 `app/gallery/page.tsx` 的 description、CollectionPage 摘要、eyebrow 和 lead 含 original 或无条件社区描述；现有构建亦含旧句。仓库不能据此证明原创、作者或使用权限；这不是认定侵权。
- 页面 8 个静态样例由 `examples`、`avatarStyle` 与 CSS span/div 绘制，不是游戏截图；社区卡片是独立的 `CommentSection`。两者不能混称为游戏产出或真实用户作品。
- `app/api/comments/route.ts` 与 `lib/comment-store.ts:243` 仅公开 approved 投稿，支持 latest/liked 排序和真实 rating/likes，公开投影不含 email。保留这些实际功能及空态/错误态；本轮未查询当前投稿数量，也不以审核证明许可。
- 与已验收的 Terms/About/Editorial 保持同一来源边界。`lib/locales.ts` 的 authorized 残留另立后续，不做全站替换、不修改 Registry 的 UNKNOWN。

## 2. 单页布局、SEO、交互边界

| 维度 | 本方案 |
|---|---|
| 页面用途/布局 | 保留 Gallery 灵感 + 审核社区入口；不新增页面、不重排首屏或四个栏目、不改 CSS |
| 六处文字 | metadata.description、openGraph.description、twitter.description、CollectionPage.description、eyebrow、lead |
| URL/索引 | `/gallery`、正式自引用 canonical、robots/index、sitemap、语言状态均冻结 |
| Title/H1 | `Square Face Icon Gallery - Community Creations` 与 `Square Face Icon Gallery` 不变；原标题指栏目用途，不新增数量或热度保证 |
| Schema | 仅 CollectionPage.description 例外；其余字段和完整 BreadcrumbList 保持，不新增评分/评论标记 |
| 示例/社区 | 8 个样例数据、图形、标题、说明、role/aria-label 不变；CommentSection 的 en / limit 500 / showForm false / showSort true 及真实 API/审核/评分/点赞/排序保持 |
| 内链/交互 | 4 个主内容链接保持：两处 `/#maker`、`/free-avatar-maker`、`/cute-square-avatar-generator`；导航、Footer、表单/空态/错误态不改 |
| KW-02 | 保留已验收原句与 main 主词 3 次；不增加密度或改搜索意图。KW-04 新 SERP/语义覆盖未验证 |

## 3. 精确替换稿（已获确认并实施）

下列六处以外源码全部冻结。旧值、源码行号、逐字多行边界和拟稿哈希见 [proposal-checks.json](../quality/evidence/gallery-001-rights-copy/proposal-checks.json)。描述字段字符数只是近似检查，不保证搜索结果展示。

| 位置 | 新文案 |
|---|---|
| `metadata.description` | Explore the Square Face Icon Gallery for simple avatar style examples and approved community submissions when available. Check source and reuse permissions. |
| `openGraph.description` | Simple square face icon style examples, plus approved community submissions when available. Source and reuse permissions require separate verification. |
| `twitter.description` | Browse simple avatar style examples and approved community submissions when available. Check source and reuse permissions before using an image. |
| `collectionSchema.description` | Simple square face icon style examples and approved community submissions when available; selection or moderation does not establish authorship or image-use rights. |
| `eyebrow` | Avatar style ideas |

第六处 lead（仍是原位置的一个段落）：

> This gallery pairs simple style illustrations with approved community submissions when available. The eight sample faces in the examples section are illustrations, not game screenshots. Use them to compare expression, contrast, and small-size readability. Display or moderation does not verify authorship or grant image-use rights; check permissions for the specific image.

普通 description 156 字符，OG 151，Twitter 144。样例是插画的说明不主张本站拥有版权；展示、选编或审核都不等于作者与使用权已核实。

保留的 KW-02 句：

> Use this square face icon gallery to compare expression, contrast, and small-size readability before you make a new design.

## 4. v1.53 方案预演结果与未覆盖范围（历史）

TSX 解析、隔离 React SSR 及六区外源码一致性于 `2026-09-02T10:23:41.829Z` 通过；应用文件未写入。Header/Footer/CommentSection 以空桩代替，locale 只用内容哨兵；因此 1 H1 / 4 H2 / 14 H3 / 19 段、4 链接不包含真实共享社区 UI，不是水合、接口或视觉结论。8 个 CSS 样例及 CommentSection props、两份 schema 的其余字段、关键词原句/3 次均保持。

当前源码 SHA-256：`352e649d9ff6592e62f74aa91f7f3cf3cb0e7b48d4671d553d4eb0106c6dd12e`。拟稿 SHA-256：`d051f12b8e4c71a9b15a75efb59c3ffbb1f9904ec5d69577f9640ff47d479901`。六区外冻结哈希：`0e6e6fb2063f544bd0f6d3757888a8b33d22ed79e8396764866b97ce9380bb39`。

146 项应用/检查/配置与现有构建保持；已验收 Editorial 的 checks.json 不改写。本轮没有新的 type/lint/全套测试/Next/OpenNext/HTTP/SEO/浏览器/桌面手机/性能结果，未核实当前服务存活或公开投稿数。既有 build 的旧文案仍在，不能把拟稿预演当成实现。

## 5. 确认后的实施与验收计划（原方案）

1. 仅在用户确认后实施六处逐字替换；增加有超时和退出码的源码/构建/HTTP 检查及反例，锁住其余源码、SEO 字段、schema、链接、8 样例、社区 props 与 KW-02。
2. 运行 type、零警告 lint、任务检查、Editor/About/Terms 与已验收回归；分别取得 Next 和 OpenNext 构建退出码。保持历史 warning 基线。
3. 在可用本地 production 预览上执行精确 HTTP/产物、robots/sitemap 与完整 `seo:check`；明确单一 base。维持 0 must，现有 12 should 单列，不跨任务修文。
4. 用 Browser 检查 1280×900 / 390×844 的真实文案、两个 JSON-LD、无横向溢出/遮挡、控制台、链接/Back/Tab/Enter与只读 latest/liked 排序；不提交评论、点赞或制造生产 UGC。真实空态/错误态及模拟数据测试分别标注。
5. 更新权威看板为 `待验收`，附实际证据，等待用户验收；失败/未测项继续可见，不继续下一项或自动部署。

## 6. 发布与回退

全局发布仍为 `不通过 / 未部署`：Square/Oval 精确来源、权利人、托管/运行/再分发/生成图片权限 UNKNOWN；文字修正不能授权。OP-11/AI-01/PF-01 与站点生产版本链、seo:prod、生产浏览器、KW-04/12 should 仍需各自证据；看板文件视觉保留既有访问限制，不绕行。

本轮仅治理/方案文件，没有线上回滚。若撤回 Gallery 方案，只撤回该方案的增量，保留 EDITORIAL-001 本次验收与所有旧证据；不覆盖用户已有应用改动或 reset 整个工作区。未来实施回退也只针对确认的六处文案及本项检查增量。

## 7. v1.54 实施与验收证据（历史）

历史 v1.54（记录 `2026-09-02T11:19:47.319Z`）：用户明确回复 `确认 GALLERY-001 示例来源与权利声明修正方案`，已按确认稿实施六处替换。20 项代码/回归、Next 42 路由及 OpenNext、4 页 built 检查、6 项 HTTP/robots/SEO 检查通过；6 路 HTTP 与产物一致，sitemap 20 唯一 URL、0 lastmod。完整本地 SEO 20 页、0 must / 12 should；Gallery 18 个源码与 20 个 HTML 反例被拒绝，4 种共享社区内存 SSR 状态通过。

Browser 1280×900 / 390×844：1 H1/4 H2/14 H3、19 页属段落 + 1 条真实初始社区空态段落、8 个 CSS 样例、4 条主链接和两份 schema 核对；12 条点击/跳转/Back 与 4 条 Tab/Enter 记录、44 项断言通过，8 张前后/全页/焦点截图已审阅。真实 latest/liked GET 均为 200、0 条；仅测试真实空态，其余状态为内存 SSR，无评论或点赞写入。

143 项原文件和 9 份旧 QA 证据未变，加本项检查器共 147 项源码/检查/配置；24 条既有验收保持，本轮不新增 GALLERY-001 成果验收。原有社区标题/副标题间距偏紧及 About/Editorial 窄卡提醒保留；12 should、KW-04、实际许可 UNKNOWN、独立 locale 文字及全部生产门禁仍开放。看板文件视觉未验证，保留既有访问限制且不绕行；未重测生产性能，未提交、推送、部署、seo:prod 或启动下一项/MIG-SQUARE-001。本项仅为 `待验收`，完整记录见 `docs/quality/evidence/gallery-001-rights-copy/README.md` 与 `checks.json`，等待 `GALLERY-001 验收通过`。

最终源码 SHA-256 与原拟稿一致：`d051f12b8e4c71a9b15a75efb59c3ffbb1f9904ec5d69577f9640ff47d479901`；六区外冻结哈希不变。新 build `Vyf3tcN5LOfwDiSXRH6xO` 已在 [本地 Gallery](http://127.0.0.1:3100/gallery) 服务，生产并未部署。原 proposal-checks.json 保留“未实施”历史状态，当前事实以 checks.json 为准。

新增 `scripts/check-gallery-rights.mjs`、package 的 `gallery:check` 入口及脚本文档；没有依赖/客户端脚本增量。真实社区评分/点赞/审核/接口源码不变，当前为空态，未做任何评论或点赞写入。回退只针对本次六处文字与检查器增量，保留所有历史证据和用户其它改动，不做整仓 reset。

## 8. v1.55 明确验收

2026-09-02T12:44:34.299Z，用户明确回复 `GALLERY-001 验收通过`。看板 v1.55 将本项记录为 `已完成（本地已验收） / 生产未验证 / 未部署`，新增第 25 条源验收；原 24 条验收及 v1.54 检查、构建、浏览器、截图和诊断日期均保留。

本轮只做验收治理：147 项源码/检查/配置及现有 Next/OpenNext 产物保持不变；原 checks.json 逐字节保留，SHA-256 `a41646b12dffdc099bc9c1a84cf10667f6efc1753b1db5be2c437e3695bd86af`。其中“待验收”和 userAcceptance=NOT_RECEIVED 仅代表 v1.54 历史时点，不撤销本次明确验收。未重跑 type/lint/测试/Next/OpenNext/HTTP/SEO/Browser/移动或性能，不重启预览，也不声称当前服务仍在运行。

v1.54 本地 SEO 20 页、0 must / 12 should 与桌面/手机结果保留原日期；社区空态与内存 fixture 的边界不变。原间距/窄卡提醒、实际许可 UNKNOWN、独立 locale 文字、KW-04/should 与全部生产门禁仍开放；看板文件视觉仍未验证，不绕行。等待用户下一步指示，不启动下一项/MIG-SQUARE-001，不提交、推送、部署或执行 seo:prod。

当前验收证据见 `docs/quality/evidence/gallery-001-rights-copy/acceptance-checks.json`。本轮无新增应用或线上回滚；若撤回验收只增加相应治理记录，保留原 QA，不覆盖用户其它改动。
