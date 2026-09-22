# RECENT-001 · Recently Played 本地记录方案

> 2026-09-07 · 看板 v1.86 实施阶段 · **方案已确认，已本地实施，待用户验收**  
> 当前任务：`RECENT-001`  
> 用户确认：`确认 RECENT-001 方案，进行开发`  
> 成果验收口令：`RECENT-001 验收通过`

## 1. 当前事实与本轮停止点

- 当前没有统一 `game_start` 事件或 Recently Played 模块；首页和 `/games` 均只显示服务端 Game Data。
- 共享 `GamePlayer` 已集中处理五种 delivery type，并能区分可玩适配器与 `EXTERNAL_LINK`。第一次激活与 Reload 也已有明确分支，适合在“从 idle 首次启动”处记录一次。
- future `GameDetailTemplate` 的 player model 使用真实 `game.id`；Square/Oval 兼容 `FlashGenerator` 目前生成派生 legacy ID，实施时必须由既有 Game Data resolver 显式传入真实 ID，不能靠名称猜测。
- 英文首页已有 `Continue Playing` 条件插槽的产品约定，但当前不渲染；草稿语言页仍无发现区。`/games` 已是 3 条真实记录的 noindex 目录。
- Privacy Policy 目前只披露安装提示与评论点赞的 localStorage；实现本功能时必须增量披露最近游戏 ID 与启动时间只保存在当前浏览器。

这会新增跨页面客户端状态和两个可见模块，因此本轮只提交布局、数据、SEO、隐私与交互方案。确认前不修改运行时代码，不启动 `FAV-001`，不提交、推送或部署。

## 2. 记录时机与游戏资格

`game_start` 在本任务内定义为：用户对一个可玩 `GamePlayer` 从 `idle` 发起首次 Play，且 player model 已通过既有 release/type/URL 校验。

1. `RUFFLE_SWF`、`HTML5`、`LOCAL_IFRAME`、`OFFICIAL_IFRAME` 可记录；`EXTERNAL_LINK` 没有本站 Play 能力，因此 Pixel External 不记录为“玩过”。
2. 同一组件挂载中的 Reload 不新增一次 start；重新访问页面并再次从 idle 启动，会更新该游戏的最近时间并移到首位。
3. 只存真实 `game.id` 与 ISO `startedAt`；不存姓名、访客 ID、URL 查询参数、生成内容、游戏内选择、来源站浏览行为或账号信息。
4. 渲染前用当前服务器提供的候选表重新核对 ID、`PUBLISHED`、公开站内 href 与可玩类型。无效、重复、已下线、broken/draft 或 External 记录全部忽略；localStorage 不能自行创造页面或卡片文案。
5. 当前可记录且可显示的真实记录只有 `square-face` 与 `oval-face`。未来符合既有路由/发布门禁的可玩详情页自动兼容，但本任务不新增游戏或放宽权限。

## 3. localStorage 合同

- Key：`msfi-recently-played-v1`
- 结构：`{"version":1,"entries":[{"gameId":"square-face","startedAt":"ISO-8601"}]}`
- 写入：同一 ID 去重并移到首位，最多保存 8 条；界面最多显示最近 4 条。
- 读取：JSON、版本、数组、ID、时间与数量全部 fail-closed；单条坏数据被丢弃，完全不可读时按空历史处理。任何 storage 异常不得阻止游戏启动。
- 同页同步：写入/清除后触发项目内自定义变更事件；跨标签页监听原生 `storage` 事件。
- 清除：`Clear history` 只删除本 key，不删除 PWA 安装提示、评论 visitor ID/liked IDs 或其它站点数据。
- 无记录、记录全失效、localStorage 不可用或读取失败时，不输出 Continue 标题、卡片、空状态、保留高度或虚假默认项。

## 4. 页面布局

### 英文首页 `/`

保持既有主顺序：Hero / Player → Discover More Avatar Games → Gallery → 长内容。只在 discovery 内新增第一个条件面板，原 Related → New（当前为空）→ Categories 相对顺序不变。

```text
Discover More Avatar Games (现有 h2)
  Continue Playing       仅有有效本地记录时出现，h3
    [最近游戏卡，最多 4]                       [Clear history]
  Related Avatar Games  现有模块
  New Games             仍按 VERIFIED 时间条件输出
  Browse by Category    现有模块
```

- 只在英文根首页挂载；`/es`、`/vi`、`/ja`、`/th`、`/ar`、`/ru`、`/id` 不新增未本地化模块，但其中实际启动 Square 可形成同一浏览器记录。
- 卡片延用现有 mint/cream/orange token、真实 thumbnail、游戏名、Browser game 类型与普通站内 href；操作文案为 `Continue game`，不显示虚构次数、评分或“常玩”。
- desktop 最多两列，390/360px 单列；Clear 作为真实 `<button>`，不覆盖卡片或把整区做成横向滚动 carousel。

### 游戏目录 `/games`

在目录 Hero 后、On-site avatar games 前添加同一条件模块，标题层级为 h2。卡片仍进入 Square/Oval 的现有站内页面，不在目录内直接启动 player；原 On-site → External → Categories → scope note 顺序保持。

客户端首读不会输出服务器占位。实施时用带记录的真实浏览器状态检查插入后的 CLS；如超过 `0.1`，只调整 RECENT 模块的挂载/位置或作用域样式，不给无记录用户保留空白高度。

## 5. 交互与可访问性

- 初始 SSR 不含个性化历史；水合后只从当前浏览器读取，不发网络请求。
- 卡片是可抓取语义不依赖的普通站内链接，但是否显示由客户端本地记录决定；键盘 Tab/Enter、可见 `:focus-visible` 和浏览器 Back 必须通过。
- Clear 立即清除这份低风险本地历史。清除后整个可见模块消失，并通过零布局占用的 `aria-live` 状态宣布 `Recently played history cleared.`；焦点移到下一现有模块标题，不能遗留在已删除按钮上。
- 同页启动游戏后模块即时更新；另一标签页清除或启动后当前页同步。React 严格模式/重复订阅不得造成双写、重复卡或内存泄漏。
- 禁止 `dangerouslySetInnerHTML`、用户提供标题或任意 href；只把经服务器筛选的候选数据映射到本地 ID。

## 6. SEO、隐私与性能边界

- `/` 与 `/games` 的 URL、Title、description、H1、canonical、OG/Twitter、schema、robots/index、sitemap、搜索意图和现有静态正文全部冻结；动态历史不进入 JSON-LD、sitemap、推荐算法或服务器 HTML。
- Continue Playing 是回访功能，不用于关键词计数、内链数量、Popular/Trending/New、quality 或 popularity 证明。爬虫看不到本地历史时仍获得完整现有页面。
- Privacy Policy 的 `Cookies and Local Storage` 只增量补一句：当前浏览器可保存最近启动游戏的稳定 ID 与时间，用于 Continue Playing；可以通过 Clear history 删除，不跨设备同步。其 metadata、H1 与其它承诺冻结；因为这是实质披露更新，实施时按 TR-06 将可见 `Last updated` 从 `May 21, 2026` 改为 `September 7, 2026`，不批量刷新其它日期。
- 不增加 cookie、服务端数据库/KV、账号、指纹、同步、Analytics/GA 事件、广告资格或第三方请求。`game_start` 在本项只是本机记录语义，不冒充已建立产品分析指标。
- 首次页面请求继续不得加载 Ruffle/WASM/SWF；读取 localStorage 不触发 player、图片预加载或出站访问。客户端候选数据使用最小可序列化卡片字段，避免把完整 FAQ/正文传入 hydration payload。

## 7. 确认后的最小实现范围

预计新增：

- client-safe 的版本化存储/解析模块；
- 服务端 Recently Played 候选解析器与最小卡片 view model；
- 一个共享 `RecentlyPlayed` client island，支持 home/directory 两种现有样式语境；
- `recent:check` 与对应 runner/说明/证据。

预计限定修改：

- `GamePlayer` 首次激活记录点；`FlashGenerator` 及 Square/Oval resolver 显式传递真实 game ID；
- 英文 `HomePage` / `HomeDiscoveryRegion` 与 `/games` 条件挂载；
- Privacy Policy 的准确 localStorage 披露；
- RECENT 作用域 CSS、共享组件说明、PAGE_PLAN、LAUNCH_CHECKLIST、SEO_LOG 与权威看板。

不刷新旧 golden；若历史检查因批准增量失败，只允许加入能精确逆转本任务差异的窄兼容层，并保留原断言。

## 8. 确认后的验证计划

- 纯数据：版本/损坏 JSON/无效 ID/时间/重复/排序/8 条上限/4 条显示/清除/其它 key 保全/Storage 抛错/候选下线与 External 排除。
- Player：Square、Oval 与 future detail 的首次 idle → Play 各记录一次；Reload 不重复；Pixel External 不写；storage 失败不阻止 loading/adapter mount；初载玩家资源仍为 0。
- SSR/SEO：空历史下 `/` 与 `/games` 原 built/HTTP HTML 不出现 Continue；现有 metadata/H1/schema/noindex/sitemap/Related/Categories 保持；Privacy 披露只有批准增量。
- 浏览器：`1280×900`、`390×844`、`360×800`，分别验证空历史、预置单条/双条、同页启动即时出现、刷新保留、排序、链接/Back、Clear、跨标签页同步、无横向溢出和 seeded-history CLS ≤ 0.1。
- 工程：`recent:check`、player/home/home-discovery/games-index/related/privacy 相关检查、type、0-warning lint、Next build、OpenNext/Cloudflare build、本地 production `seo:check` 与 robots；失败、超时、未执行和既有 should 分列。
- 生产、真机、其它浏览器、field CWV、真实游戏内部操作、实际权利与全站广告/CMP 仍按实际证据标记，不能由 localStorage 功能推导通过。

## 9. 明确不在范围

- `FAV-001`、Favorites 页面、账号/云同步、服务端用户画像、跨设备历史、推荐个性化、搜索/筛选或分析看板。
- Pixel 原站访问历史、页面浏览即记录、游戏内保存/完成事件、会话时长或“最常玩”统计。
- URL/索引/metadata/schema/导航重构、新游戏、新图片、Game Data 权利/发布时间/quality/popularity 修改。
- 许可材料任务保持取消；Square/Oval `UNKNOWN`、完整 Oval 延期及原 P0/生产门禁不因此关闭。
- 提交、推送、部署与 `seo:prod`。

## 10. 确认门与回滚

确认后只实施上述 RECENT-001 范围，完成本地 QA 后写回看板并停在 `待验收`。回滚只移除本任务的存储 key 接入、条件模块、隐私增量、作用域 CSS、检查与治理记录；不清理其它 localStorage key，不覆盖用户工作区或撤销已验收的 RELATED/HOME/GAMES 成果。由于当前未部署，不存在生产回滚。

请明确回复：`确认 RECENT-001 方案，进行开发`
