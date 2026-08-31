# STRAT-001 · MySquareFaceIcon 产品定位

> 方案确认：用户于 2026-08-31 明确回复“确认 STRAT-001 方案”<br>
> 任务范围：产品、SEO 与交互边界治理<br>
> 生产影响：本任务不修改页面 UI、URL、metadata、索引状态、播放器或游戏文件<br>
> 变更权限：改变本定位需要新的用户明确决定

## 1. 已确认的一句话定位

英文：

> My Square Face Icon is a browser hub for classic face makers, avatar creator games, pixel avatar tools and lightweight character creators, led by the Square Face Generator.

中文：

> My Square Face Icon 是以 Square Face Generator 为旗舰，聚合经典脸型生成器、头像制作游戏、像素头像和轻量角色创建工具的垂直浏览器游戏平台。

这不是通用小游戏门户，也不是通用 AI 头像生成站。扩展必须增强 Face、Avatar、Icon、Character Creator 主题，而不是用无关游戏数量稀释现有品牌和搜索意图。

## 2. 产品层级

| 层级 | 角色 | 当前或未来内容 |
|---|---|---|
| Layer 1 · Flagship | 用户和搜索引擎首先理解的核心产品 | 首页 Square Face Generator |
| Layer 2 · Discovery | 帮助用户继续发现同主题内容 | Games、Categories、Featured、New、Related、Recently Played、Favorites |
| Layer 3 · Support | 帮助使用、理解、信任与回访 | Guides、Gallery、Blog、Troubleshooting、Source & Rights、About、Policy |

Layer 2 和 Layer 3 不能取代 Layer 1。首页的第一职责始终是让用户理解并开始使用 Square Face Generator；门户发现能力是第二职责。

## 3. 服务对象与核心任务

主要用户：

- 想快速创建可用于 Discord、TikTok、YouTube、论坛、游戏账号或个人资料的头像用户。
- 喜欢经典 Flash、像素、chibi、脸型组合或轻量角色创建体验的用户。
- 不希望注册、付费或安装桌面软件，只想在浏览器中开始制作的用户。

核心用户任务：

1. 找到与头像、脸型或角色创建直接相关的工具或游戏。
2. 快速判断它是本站可玩内容还是需要打开原站的 External Tool。
3. 开始制作并了解真实的保存、截图、设备和兼容性边界。
4. 在完成后继续发现同主题游戏、指南或灵感内容。

## 4. 允许扩展的内容范围

候选内容必须与头像或角色创建存在直接关系，并通过来源、许可、体验和质量门禁。

| 类型 | 是否在范围内 | 准入说明 |
|---|---|---|
| Face Makers | 是，核心 | 主要操作是组合、编辑或生成脸部形象 |
| Avatar Makers | 是，核心 | 主要产出是个人头像、图标或资料图片 |
| Pixel Avatars | 是 | 像素或 chibi 头像工具，必须有真实独立价值 |
| Character Creators | 是 | 以角色外观创建为核心，不是普通动作游戏 |
| Retro Flash Creators | 是 | 必须逐文件验证来源、许可和 Ruffle 兼容性 |
| Dress-up Creators | 有条件 | 只有主要结果可作为头像或角色形象时纳入 |
| External Tools | 有条件 | 只使用官方允许的方式；默认清晰标记并直接打开原站 |
| 自研 HTML5 头像小游戏 | 是 | 必须符合主题、性能、移动端和发布质量门 |

## 5. 明确排除的范围

第一阶段不做：

- Racing、Shooting、IO、赌博、体育、塔防、普通益智等泛小游戏分类。
- 只因为“好玩”但与头像、脸型、图标或角色创建无关的内容。
- 通用 AI 头像生成器或把现有产品重新包装成 AI 工具。
- 来源不明、商业或再托管权限为 UNKNOWN 的新增游戏库存。
- 只有 iframe 或 External Link 加薄文本、没有独立价值的页面。
- 为同义词、词序或轻微修饰词批量创建的近重复页面。
- 没有真实数据支持的 Popular、Trending、评分、点赞或用户数量。
- 第一阶段的账号、排行榜、成就、大型 UGC 社区和跨设备同步。

如果未来希望扩展为泛游戏平台，应另启品牌或由用户单独批准新的产品和 SEO 方向，不能在本项目中渐进偷换定位。

## 6. 页面类型边界

| pageType | 定义 | 主要交互与公开表达 |
|---|---|---|
| GAME | 本站真实可玩的游戏或工具 | 展示 Preview、Play、Loading、Error、Fullscreen、Reload |
| EXTERNAL_TOOL | 工具由第三方原站提供 | 明确 External 标签、来源、限制和 Open Original；不写“本站可玩” |
| GUIDE | 帮助用户完成具体头像任务的教程 | 提供完整步骤、事实核验、相关工具和指南内链 |
| GALLERY | 经确认的作品、curated examples 或灵感 | 区分真实 UGC 与 curated content，不编造互动数字 |
| BLOG | 教程、对比或平台使用知识 | 服务独立搜索意图，不混入 Games 库存 |
| POLICY | About、Contact、Editorial、Privacy、Terms 等 | 与真实主体、数据、权利和运营行为一致 |

导航、推荐、目录和 schema 必须尊重 pageType。Guide、Gallery、Blog 不能因为出现在游戏侧栏就被伪装成 Games。

## 7. 首页与核心搜索意图不变量

以下决定默认冻结：

- “/” 继续承担 square face generator 主搜索意图。
- 首页 H1 继续为 Square Face Generator。
- 首页 canonical 继续指向正式根路径。
- Square 游戏 Preview 和明确 Play 入口保持在首屏或紧邻首屏。
- Ruffle、WASM 和 SWF 继续 click-to-load，不进入首次页面加载。
- 现有 “/oval-face-icon-generator” 保留其独立 oval/rounded face 意图和 URL。
- “/pixel-art-avatar-icon-generator” 保留为 External Tool / direct-link 页面。
- 现有已发布 URL 默认不迁移；任何 301、合并、canonical 或 index 变化必须单独审批。

STRAT-001 不授权修改任何 URL、Title、H1、canonical、schema 或 sitemap。

## 8. 首页未来信息顺序

后续首页任务应基于以下顺序单独提案和验收：

1. Square Face Generator 核心价值、Preview 与 Play。
2. Continue Playing，仅在存在真实本地记录时显示。
3. Featured Avatar Games，仅使用真实已发布 Game Data。
4. New Games，按真实发布时间生成。
5. Browse by Category，只显示有真实内容的垂直分类。
6. Curated Icon Ideas；真实 UGC 不足时不得伪装成活跃社区。
7. Square 游戏说明、How to Play、Save、Tips 与 FAQ。
8. 独立的 Guides、Gallery 和 Blog 入口。

没有数据时整个模块不渲染。Popular 或 Trending 只有在事件、时间窗、最低样本和排序规则明确后才能出现。

## 9. 新游戏准入测试

每个候选游戏在进入开发前必须同时通过：

1. **主题相关性**：主要任务确实是创建或定制脸型、头像、图标或角色外观。
2. **独立价值**：不是现有页面的同义复制，用户能获得新的真实体验。
3. **来源与权利**：Registry 有可复核证据；UNKNOWN 不得被当成允许。
4. **交付真实性**：本地可玩、明确允许 iframe，或清晰标记为 External Tool。
5. **质量可维护性**：能记录 controls、how-to、mobile、loading/error、source 和 SEO 必填信息。
6. **需求证据**：上线优先级以后续关键词、趋势、竞品和用户数据判断，不凭个人感觉制造库存。

任一项失败，候选保持 draft、rejected 或 research，不进入 published。

## 10. SEO 与内容原则

- 遵守 IA-01～IA-03：先页面类型与独立搜索意图，再决定 URL 和 metadata。
- 遵守 CT-01～CT-05：页面提供真实功能或完整答案，不生产 thin、near-duplicate 或 doorway pages。
- 遵守 LINK-01～LINK-04：每个可索引游戏必须有目录或分类入口和相关内链。
- 遵守 META-06：External Tool 不使用暗示本站托管、可玩或拥有该工具的 schema。
- 遵守 PF-01、PF-05 与项目 click-to-load 不变量。
- 遵守 Game License Registry：来源、作者、权利、商业、嵌入、修改和再分发均以证据为准。
- 新分类只有达到真实内容阈值并具备独立说明时才可成为 index 候选。

## 11. 当前实现偏差及所属后续任务

这些是已记录的偏差，不属于 STRAT-001 的代码修改范围：

| 当前偏差 | 后续任务 |
|---|---|
| 首页 More Avatar Games 混入 Guide、Gallery 和 Blog | SEO-IA-001、HOME-DISC-001 |
| Pixel 已直接外链但仍残留 embedded 旧文案 | MIG-PIXEL-001 |
| Gallery Preview 使用硬编码点赞数字 | HOME-GALLERY-001 |
| Square/Oval 页面及公开文案仍有未证实的权利表述 | 专项公开文案修复；继续受 LEGAL-001 Registry 约束 |
| Games、Category、Related 尚未由统一 Game Data 驱动 | GAME-DATA-001、ROUTE-001、RELATED-001 |
| Popular、Trending 缺少真实事件与排序规则 | ANA-001、STATUS-001、QUALITY-001 |

这些偏差不得在无关任务中顺手修改。

## 12. STRAT-001 验收映射

- [x] Square Face Generator 明确为首页旗舰核心。
- [x] 产品明确定位为垂直头像游戏门户，而非泛游戏平台。
- [x] Avatar Maker、Face Maker、Character Creator、Pixel Avatar、Retro Flash 和条件式 Dress-up Creator 已纳入边界。
- [x] Racing、Shooting、IO 等泛游戏已明确排除。
- [x] GAME、EXTERNAL_TOOL、GUIDE、GALLERY、BLOG、POLICY 已区分。
- [x] 首页 URL、H1、canonical、核心意图和 click-to-load 不变量已记录。
- [x] UNKNOWN 权利、虚假热度、薄页面和无关扩张已被禁止。
- [x] 当前实现偏差已映射到后续看板任务，没有扩大本任务范围。
- [x] 用户已在写入前明确确认方案。

## 13. 回滚与变更控制

本任务只新增本定位文档，并在项目简报、SEO 日志和权威看板中登记决定。若 STRAT-001 被退回：

- 保留已经验收的 AUDIT-001、BASE-001、LEGAL-001 和 SEO v2.1 迁移。
- 将 STRAT-001 恢复到设计中并记录退回原因。
- 修改或删除本文件中被退回的定位决定。
- 不借回滚修改生产页面、游戏、URL、索引状态或已验收的 License Registry。

任何未来偏离本定位的提议，必须说明目标用户、品牌影响、搜索意图、URL/索引影响、权利来源、质量门和回滚方案，并重新取得用户明确确认。
