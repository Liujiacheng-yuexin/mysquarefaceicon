# RELATED-001 · 剩余入口接入方案

记录日期：2026-09-07  
方案版本：v1.83（v1.82 方案已确认）  
当前范围：`RELATED_REMAINING_SURFACES`  
状态：**用户已确认并完成本地实施；剩余入口待验收；Oval 样例验收保持；生产未部署**

> 2026-09-07：用户明确回复 `确认 RELATED-001 剩余入口方案，进行开发`。下列方案已按原边界实施，验证与回滚证据见 [remaining-surfaces-README.md](../quality/evidence/related-001/remaining-surfaces-README.md)；验收前不启动 RECENT/FAV、不提交、推送或部署。

## 1. 当前事实与本轮目的

用户已经验收 `/oval-face-icon-generator` 的 Category + Tags 单页样例。现有服务端 `selectRelatedGames` 会先执行记录、发布、身份和路由门禁，再按共同有效分类数、共同规范化标签数、稳定 game ID 排序；它排除自身、无关项、非法/非发布项、伪 legacy 和重复身份/路径项，不补足不存在的结果。三条真实记录没有已核验的 popularity 数据，`qualityScore` 也均为 `null`，所以 quality/popularity 继续明确禁用，不能把未知值改写成 0 或编造评分。

当前仍有三处“相关推荐选择”尚未统一：

1. 英文首页 `/` 的 Featured 仍读取 Square Record 的手填 `relatedGameIds`。
2. `/pixel-art-avatar-icon-generator` 页尾仍手写两张游戏卡和一张指南卡。
3. 未来 `/games/[slug]` 使用的共享 `RelatedGames` 仍读取 `relatedGameIds`；当前没有可公开访问的非 legacy 新游戏详情页。

本轮目标是在不新增 URL、不开放索引、不改变许可门禁的前提下，让这三处使用已验收的选择器，并把游戏/外部工具与指南保持为不同内容类型。Oval 样例不重做。

## 2. 拟接入范围与当前确定结果

| 入口 | 选择方式 | 当前真实结果 | 可见变化 |
|---|---|---|---|
| 英文首页 `/` | Square 作为当前记录，调用 `selectRelatedGames` | Oval `3 类 / 3 标签`，Pixel External `1 类 / 1 标签` | 两张卡片、顺序、图片、href、类型标签和模块位置不变；只把内层标题和说明从“Featured/手填关系”改成“Related/分类与标签匹配” |
| Pixel `/pixel-art-avatar-icon-generator` | Pixel 作为当前记录，调用同一选择器 | Square `1 类 / 1 标签`，Oval `1 类 / 0 标签` | FAQ 后保留两张现有游戏卡并由算法决定顺序；原 Pixel Square Face Maker Guide 移入紧随其后的独立指南区 |
| 未来 `/games/[slug]` | 共享 `RelatedGames` 直接使用选择器 | 随未来通过现有路由/许可/发布门禁的真实记录动态计算 | 当前没有公开新详情页，因此不产生新 URL 或现网页面；保留已验收模板中的 Related 模块位置和 `detail-related` 卡片样式 |

数量继续默认最多 4、硬上限 8；当前只有两条真实相关候选，所以显示 2 条，不填充无关卡片。0 条时隐藏推荐模块。External Tool 仍先进入本站详情页，卡片明确显示 `External tool`，不 iframe、不伪装成本站可玩游戏。

## 3. 精确布局、文字与交互方案

### 英文首页 `/`

保持：

`Hero / Player → Discover More Avatar Games → Curated Icon Ideas → 原正文与 FAQ → Guides & Resources`

只在既有 discovery 内修改：

- `Featured Avatar Games` → `Related Avatar Games`
- `Selected from the Square game's published related records.` → `Matched from published games that share avatar categories or tags with Square Face Generator.`
- `data-home-module="featured"` 同步改为 `data-home-module="related"`，仅用于语义化测试钩子，不改 CSS 类和视觉布局。
- `New Games` 继续只接受真实 `VERIFIED` 发布时间，并排除已出现在 Related 的记录；当前仍不渲染。
- Browse by Category、卡片视觉、首页首屏、Player、Gallery、FAQ 和资源区保持原样。

### Pixel 页

FAQ 后调整为：

`Related Avatar Games（Square、Oval） → Pixel Avatar Guide（原 Pixel Square Face Maker Guide 卡） → 页脚`

- Square、Oval 保留当前页面已经审核过的标题、描述和站内 href，只把选择来源改成算法，并增加可测试的 game ID/page type 属性。
- 独立指南卡的标题、描述和 `/pixel-square-face-maker` href 逐字保持，不参加算法或推荐数量。
- 使用现有 `content-band`、`related-grid`、`related-card` 和焦点样式；仅按相邻 band 交替背景，不新增全局 CSS 或动画。
- 所有链接继续是普通站内链接；键盘 Enter、点击和浏览器 Back 路径不变。

### 未来详情模板

- `RelatedGames` 改用 `selectRelatedGames(game)` 的推荐结果，不再用 `relatedGameIds` 决定顺序。
- H2 `Related avatar games`、`detail-related` 卡片、External Tool 标签、空结果不渲染和模板模块顺序全部保持。
- 测试 fixture 可显式注入候选 records，生产默认读取真实 catalog；不得为让 fixture 通过而放宽发布、身份、路由或许可门禁。

## 4. SEO、内容与发布边界

- 不改变 `/`、Pixel、Oval 或任何现有页面的 URL、Title、description、H1、canonical、OG/Twitter、schema、robots、index/noindex、sitemap 或搜索意图。
- 首页只改一个 H3 和一段 discovery 说明；Pixel 把现有混合页尾内容分为游戏与指南两个 H2。实施后必须重新核对 KW-01/KW-02 既有契约和主内容可见文本，不能假设无影响。
- 当前真实内链目标和顺序不变；收益是未来记录接入后不再手工维护推荐列表。不会借本任务制造 4–8 个占位或重复链接。
- `/games` 与五个 `/category/[slug]` 是目录/聚合页，已经列出全部或分类内记录，本轮不再追加 Related 区，以免重复和机械互链。
- 七个草稿语言首页继续 noindex、无 hreflang、不进 sitemap；不把英文新增句子复制或翻译过去，原侧栏保持。
- `relatedGameIds` 字段暂时保留给既有兼容/审核映射，不删除 schema 或批量改数据；本轮只停止它在上述三处承担推荐排序。
- Square/Oval 实际权利仍为 `UNKNOWN`。RELATED 本地验收不会授予许可、开放索引或关闭生产 P0；已取消的 LICENSE-GATE 材料任务不恢复。

适用规则：IA-01/02/03、IDX-01～07、META-01/02/05/06/09、KW-01/02/05/10～16、LINK-01/03/04/05/07/08、CT-01～07、PF-02/05/06、AY-01/03、OP-05/09/10/12。

## 5. 预计实现文件与可逆边界

预计运行时文件：

- `lib/games/home-discovery.ts`
- `components/home/HomeDiscoveryRegion.tsx`
- `components/HomePage.tsx`（仅必要的 prop/data 命名同步）
- `components/game/RelatedGames.tsx`
- `app/pixel-art-avatar-icon-generator/page.tsx`
- `components/game/README.md`

专项与兼容层预计更新 `scripts/validate-related-games.ts`、首页 discovery、game template、Pixel 的现有检查器及精确 approved-delta/compat 文件。历史 golden、Oval v1.80 checks、v1.81 acceptance、已验收 CATEGORY/GAMES/HOME/PIXEL/GAME-TPL 证据不得重新生成或覆盖；兼容层只能逆向本次确认的精确片段。如果实现需要修改选择器排序、Game Data、CSS、Oval、目录/分类、locale、metadata、索引或路由，停止并重新提案。

## 6. 确认后的验证与验收

确认后至少执行：

- `npm run related:check`：Square/Pixel/Oval 真实排序、共享组件、首页、Pixel 分组、future template fixture、0/2 条结果及全部负例。
- type-check、全站零错误 lint；既有 warning 单独记录，不得冒充零 warning。
- 相关 Game Data/Player/Route/Component/Metadata/Template/Home/Pixel/Oval/Games/Category/rights/locale/canonical/robots 回归。
- Next build、Cloudflare/OpenNext 等效 build；本地 production HTTP 与 `seo:check`。
- `/` 与 Pixel 至少验证 1280×900、390×844、360×800：全文、分组、类型、无横向溢出、焦点/Enter/点击/Back、空结果 fixture、初载无 Ruffle/WASM/SWF、console/page error。
- 记录所有首次失败和修正后重跑；不把浏览器截图、构建或本地 SEO 当成生产、许可、真机/CWV 或人工内容验收。

实现完成后只把 RELATED-001 设为 `待验收`。建议成果验收口令为：

`RELATED-001 剩余入口验收通过`

在用户明确确认本方案前，不修改上述应用文件，不启动 RECENT-001/FAV-001，不提交、推送或部署。确认口令：

`确认 RELATED-001 剩余入口方案，进行开发`
