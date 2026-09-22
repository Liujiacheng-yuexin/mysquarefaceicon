# CATEGORY-001 · Face Makers 样例内容审核

> v1.76 · 2026-09-04：用户明确验收 CATEGORY-001 单页样例，成果验收已收到，见 [记录](acceptance-checks.json)。仅验收样例及已确认共享边界；下文 v1.75 的“userAcceptance 未收到”保留原时点，不表示当前。没有收到逐条主张/审核人等独立人类事实复核记录，humanReview 不据成果验收自动升级。原数据、QA/失败和其它边界不改，未部署或开发剩余四页。

2026-09-04。依据已验收内容标准/单页模板存证，不另建状态表。

## A. 身份与范围

- taskId：CATEGORY-001；gameId：不适用，分类集合不是游戏。
- pageUrl：/category/face-makers；pageType：CollectionPage；deliveryType：无播放器。
- 数据：lib/games/categories.ts → 已审阅目录过滤 → 原三条 GameRecord；新文案：lib/games/category-content.ts。
- 用户确认：确认 CATEGORY-001 单页样例方案，进行开发。范围仅 Face Makers 内容/metadata/schema，加五页共享数据/导航/广告边界。
- 冻结：其余四页正文/metadata/布局；原游戏数据/Registry/UNKNOWN、SWF、CSS、依赖、播放器、首页发现内容。
- 环境：Windows，Node 22.16.0，Next 14.2.35，React 18.3.1；Chrome 152.0.7977.65，Playwright 1.62.1；1280×900 / 390×844 / 360×800 模拟视口，不是真机。
- branch：codex/game-platform-rebuild；HEAD：c6d30087c2c03a7c4eb8d5bfe6e055e9b8d40228 加累计脏工作区；buildId：nTDZHFbpW4UvLAIaq4fWV。指纹与实际检查时间见 [checks.json](checks.json)。
- Agent：Codex；Agent 检查通过（仅以下声明范围），未虚构真人作者。
- humanReview：未完成；humanReviewer / humanReviewedAt / humanReviewEvidence：空。
- userAcceptance：未收到。方案确认不是成果验收或完整人类事实审核。

## B. 独立价值与近重复

页面帮助用户在两种脸型入口间选择，并解释与其它头像分类的重叠；不是生成器或新建索引落地页。与 /games 的全目录不同，只列 Square/Oval，明确形状选择与本站目标页。

两段选择说明和重叠说明是本轮贡献；共享页头/页脚、原卡片摘要及模板不计为独有贡献。去掉形状名称仍有“选择本站条目、到目标页启动并看说明”的导航信息，但不足以据此开放索引。其余四页不套写近重复段落。不按 250 词/8 条的应该级参考凑内容或计算评分。

## C. 新增主张—证据

| ID | 新增表达/位置 | 证据与类型 | 事实状态及边界 |
|---|---|---|---|
| CAT-01 | Square focuses on square face icons；Oval offers a rounded face style | 原 data/games/square-face.ts、oval-face.ts 名称/摘要；当前源/SSR/HTTP 对照 | 源码支持；不是重新验证内部控件或导出结果 |
| CAT-02 | Both entries open a maker page on this site；choose the shape | href / 与 /oval-face-icon-generator；当前三视口点击/返回 | 本地浏览器验证；不承诺许可、真机或生产 |
| CAT-03 | Each maker loads its player after you select Play | 原 GamePlayer/RuffleAdapter click-to-load；当前 player/perf-home/home-hero 回归 | 源码/测试支持；分类文档无 Ruffle/WASM/SWF 请求，不重签全部 SWF 行为 |
| CAT-04 | See maker page for controls, saving guidance, source or usage limitations | 目标页原数据绑定说明与旧契约回归 | 只指向说明；不承诺保存成功、商用许可或全屏兼容 |
| CAT-05 | Categories overlap: the same entry can appear in more than one group | 原 primary/secondary；计数 2/3/1/2/1；SSR/HTTP/水合 | 当前数据及页面验证；分类数不可相加为独立游戏数 |
| CAT-06 | Face maker entries / 2 entries；其它四项真实数量 | 同一过滤数据驱动卡片、分类数和 ItemList；负例/HTTP/水合 | 当前数据及页面验证，不称热度、评分或可用性认证 |
| CAT-07 | 社交图片为品牌插图 | 原 /og-image.svg；仅样例指定品牌 alt | 使用原文件，不称生成器输出或新许可 |

不适用：本页无 FAQ、播放器控制、保存、重试、全屏、外站内部行为、作者日期或测量声明。其余四页 Pixel 仍是 External tool，进入本站说明而非嵌入外站。Registry UNKNOWN 不升级；LICENSE-GATE 材料任务继续取消。

## D/E. 当前运行与设备

15 组页面：身份/H1/非空/无框架覆盖层/console warning 或 error 0。三视口首卡完整，文本无 line-clamp/裁切。其余四页 12 组前后截图 SHA、正文/metadata/schema/几何相同。

45 项导航/菜单/键盘/历史、12 项全文及 404 Home 返回补充通过。独立补测首页 AdSense 真实 HTTP 200、load 事件与全局对象存在：进入分类新文档后，全局对象、广告脚本/iframe 均无。

9 路真实 load 后 12.5 秒无广告正例来自两次整体失败运行；两次各有 load 等待超时，不改写整体结果或宣称单批稳定。原挂起来源未完整捕获；后来独立诊断 load 完成并记录 GA collect ERR_ABORTED，不足以确定原超时原因。见 [README.md](README.md)。

## F/G. SEO 与结论

- KW-01：保留 H1/Title Face Makers、原 description；首页分类区、/games、样例同级分类提供真实入链。
- KW-02/03：不堆首页关键词、不使用退役 3%–5%；20 页通用 SEO 0 must / 12 既有 should，分类另由专项检查。
- KW-04：未验证；未做前十搜索分析，不推导语义分数。CT-05 独立价值人工判断待复核。
- CT-01/02/05：集合导航意图/noindex，小样本不凑薄页；其余四页不批量。CT-06 人类事实/语气/重复/可读性复核未完成。
- META-06/09：Face OG/Twitter、CollectionPage/ItemList 2 项及 Breadcrumb 在服务端/HTTP/水合一致，无 VideoGame/评分/日期。其它四页 metadata 不变。
- 五页自引用 canonical、noindex/follow、sitemap 排除不变；未知分类 HTTP 404/noindex，无新增 URL。
- qualityScore：未验证，不计算。
- 工程：25 代码/类型/lint/回归 + Next/OpenNext/patch + 9 built + 11 HTTP/robots/SEO，共 48 项通过。
- 本轮内容：**有条件通过，仅本地样例/确认边界；人类审核及用户验收未完成**。
- 发布：**不通过**。原 P0/UNKNOWN、全站广告/CMP、KW-04、真实 CWV/真机和生产未关闭；未部署/提交/推送。
- 回滚/清单见 README/checks.json；权威看板 v1.75 样例待验收，整项未完成。

## H. 历史保护

原 31 条源验收、35 份历史 JSON、失败/旧 QA 日期保留；完整 Oval 模板迁移仍延期。未来数据、版本、页面或权利证据变化时按受影响声明重审，不将本轮局部审核扩张到所有游戏事实。
