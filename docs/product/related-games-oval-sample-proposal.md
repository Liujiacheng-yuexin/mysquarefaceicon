# RELATED-001 · 算法与 Oval 单页接入方案

2026-09-07 · v1.81 · **Oval 单页样例已获用户明确验收；RELATED-001 整项仍未完成**。用户回复 `RELATED-001 Oval 单页样例验收通过`，仅关闭 v1.80 的服务端选择器与 `/oval-face-icon-generator` FAQ 后分组这一项本地样例范围。其它入口尚未形成或确认批量方案，不自动接入、开放索引、提交、推送或部署。验收记录见 [acceptance-checks.json](../quality/evidence/related-001/acceptance-checks.json)。

> 下方 v1.79 的范围、排序与文案是本次实施基准。CATEGORY-001 的本地验收、完整 Oval 模板迁移延期、许可证据 UNKNOWN、已取消的材料请求及全部生产门禁均未被本次局部实现改变。

## 1. 先做什么，以及为什么先确认

先完成可复用的服务端推荐选择器，并只接入 `/oval-face-icon-generator` **FAQ 后、页脚前**的推荐区作为样例。这里目前只有一张 Square 游戏卡和三张指南/Gallery 卡；Pixel 虽在手填关联数据中，却只出现在侧栏。此次将改变该局部的可见卡片与分组，按 `AGENTS.md`、KW-13、LINK-04 先确认；不能把“下一步开发”或 CATEGORY 验收当作这些页面改动的具体批准。

首页 Featured 是已有编辑精选，不自动改成算法推荐；Pixel 页、七个草稿语言页、通用 `RelatedGames`/未来模板、已验收 Games/五分类全部冻结。本阶段不是完整 Oval 模板迁移，也不启动 Recently Played/Favorite。样例通过后再提其它入口的接入范围，RELATED 整项不因单页样例通过自动完成。

## 2. 推荐规则（拟议）

| 步骤 | 明确规则 |
|---|---|
| 候选资格 | 复用 `resolveGamesDirectory` 的已审阅过滤/身份与路由限制，并验证记录形状；只接受 `PUBLISHED` 的 GAME/EXTERNAL_TOOL。排除自己、重复 ID/路径、无站内合法路径、BROKEN/DRAFT/REVIEW/ARCHIVED 等非 PUBLISHED；未来新记录仍需现有新发布许可与路由门禁。伪造 legacy 标记不能放行。 |
| 相关性 | 分类集合为有效 allowlist 内 primary + secondary 去重集合；tags 去重、trim/lowercase 后精确匹配，不做模糊 NLP。分类和标签交集都为空时不推荐，不用无关项补位。 |
| 顺序 | 先按**共同分类数量降序**，再共同标签数量降序，最后按稳定 game ID 字典序；类别优势不能被大量标签抵消。无随机、时间/设备/浏览器差异，不依赖输入数组次序。重复身份/路径的冲突候选全部排除而不是任取一条。 |
| 数量 | 默认最多 4，调用上限 8；负数/非有限/非整数输入按明确参数校验拒绝，0 返回空。真实不足时显示实际数量，不凑 4–8 条；0 条则省略整个游戏推荐区，指南仍显示。 |
| 可解释性 | 返回匹配分类/标签及排序依据供测试和诊断，不对用户显示“最佳/热门/评分”。输入不得被排序原地修改。当前记录缺失、形状错误或当前身份/路径不在有效候选集时返回空并保留诊断。 |

**路线图口径需本方案明确取舍：** 三条记录 `measurements.qualityScore` 均为 null，未发现 popularity 字段或已核验热度来源。本阶段**不启用 quality/popularity 因子**，不把缺值写成 0、不造分数/用户量、不据此授予质量或索引资格；诊断明确未配置。以后启用须先有来源、时间窗和合法评分证据，再单独确认。现有 Square/Oval legacy 资格只表示允许保留已存在的本地入口，不是 UNKNOWN 权利已通过；不修改 Registry/发布策略，也不恢复已取消的 LICENSE-GATE 材料任务。

当前数据的只读推算（尚非已实现算法）：

| 当前记录 | 第一候选（共同分类 / 标签） | 第二候选（共同分类 / 标签） |
|---|---|---|
| Oval | Square：3 / 3 | Pixel External：1 / 0 |
| Square（仅验证算法，不接首页） | Oval：3 / 3 | Pixel External：1 / 1 |
| Pixel（仅验证算法，不接页面） | Square：1 / 1 | Oval：1 / 0 |

## 3. Oval 局部布局与精确文案

`原首屏/Player/侧栏/正文/FAQ 不变 → Related Avatar Games and Tools（Square、Pixel）→ Avatar guides and inspiration（原 3 张资源卡）→ 原页脚`

- 游戏区保留原 eyebrow `More avatar makers`、H2 `Related Avatar Games and Tools`、既有 `related-grid`/`related-card` 视觉类，不改全局 CSS、组件顺序或首屏。Square 卡原名及描述 `Play the square-shaped version of the classic face icon maker.` 保持，href `/`。
- 新 Pixel 卡名 `Pixel Art Avatar Icon Generator`；使用现有记录摘要 `Open the original icongenerators.net pixel avatar maker with visible attribution, usage tips, and a direct-link-only boundary.`，可见标记 `External tool`，CTA `View access details`，href `/pixel-art-avatar-icon-generator`。这是站内访问详情链接，不直接开外站、不嵌入编辑器、不增加图片或能力承诺。
- 原三张资源卡移动到紧随其后的 `Avatar guides and inspiration` H2 下，**原顺序、标题、描述、链接逐字保持**：Square Face Icon Guide → `/square-face-icon-generator`；Free Avatar Maker → `/free-avatar-maker`；Community Gallery → `/gallery`。它们不参与算法、计数或游戏类型标签。
- 推荐文案展示从当前目标记录/明确的 Oval 展示映射取得；Square 特殊摘要仅适用于准确的旧身份，新增候选使用真实记录，不复制整份游戏数据。现有 Oval 侧栏不迁移、不重排；未改共享 `GameSidebar` 或首页发现区。
- 继续原生整页链接与现有焦点样式。桌面与 390/360px 验证卡片文字完整、键盘焦点/Enter 和往返，不以“无横向溢出”代替全文检查。

## 4. SEO、实现范围与验收

保持 Oval URL/Title/description/H1/canonical/OG/Twitter/现有 schema/index、其余正文、Player 参数与延迟加载；不新增路由、schema、FAQ 或改变 sitemap/robots。新增 Pixel 站内入链与资源分组服务同一头像主题（LINK-03/04/05/08）；不机械补关键词，不关闭全站 KW-04/CT-06/广告/CMP/生产门禁。

确认后预计只改 `lib/recommendations/related-games.ts`、Oval 页面和必要的局部展示辅助文件；若需要新增 Oval 展示映射，只增精确字段、不覆盖原 `legacyPage`/player/SEO/手填关系数据。测试新增专项与 npm/scripts 入口；原 Oval/Pixel/Locale/目录/分类的冻结范围，以**精确可逆批准增量**验证，不刷新旧 golden、不删除旧负例。若实现要求越过此范围，先报告再修订方案。

验证清单：当前三条结果、分类优先/标签次级/稳定同分、输入不变、重复/非法/空候选/自身/缺当前、类型与许可/伪 legacy 等反例；真实 SSR/原始 HTTP/水合卡片一致、空推荐仅隐藏游戏区；保留首屏/侧栏/其它页面/五分类冻结。type、lint、相关回归、Next/OpenNext、local SEO 分列；三视口与全部新/移动链接、Tab/Enter/Back、广告隔离和初次不加载玩家分别留证。人类内容审核、内部游戏操作、真机、CWV 和生产仍按实际执行范围报告，不能继承本次 CATEGORY 验收为通过。

v1.79 的方案治理证据继续原样保存在 [proposal-checks.json](../quality/evidence/related-001/proposal-checks.json)。v1.80 已新增 53 项算法/源码/渲染断言，并通过 type、零警告 lint、相关回归、Next/OpenNext、本地 HTTP/SEO，以及 1280/390/360px 浏览器布局和 9 个往返交互；更正后重跑结果与初始失败均在 [交付记录](../quality/evidence/related-001/README.md) 中分列。真实看板视觉、真机/其它浏览器、内部 SWF 操作、现场 CWV、人类事实审核与生产仍未验证。

用户已按上述精确口令完成 Oval 样例验收。RELATED-001 保持“样例已验收、其它入口未开始”，等待用户另行要求下一步；若继续扩展，须先提出明确的页面范围、SEO 与交互方案，不自动开始 RECENT-001/FAV-001 或部署。
