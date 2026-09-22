# CATEGORY-001 · Face Makers 单页样例交付

> v1.79 · 2026-09-04：用户已明确验收剩余四页；结合原 Face Makers 样例验收，CATEGORY-001 本地整项完成。[批次验收记录](remaining-acceptance-checks.json)。原样例记录、v1.78 QA/失败均保持；五分类仍 noindex，人类事实审核/权利/生产不因此通过。本轮仅验收及 [RELATED 方案](../../../product/related-games-oval-sample-proposal.md) 待确认，应用未改/QA 未重跑/未部署。

> v1.78 · 2026-09-04：样例验收及原 QA 保留。用户已确认剩余四页方案，本批实施/QA 完成，**仅剩余四页待验收**；见 [批量交付](remaining-README.md)、[新证据](remaining-checks.json)、[逐页事实记录](remaining-content-review.md)。32 条原源验收保持，不用样例验收替代批次，整项未完成/未部署；下方均为原版本历史。

> v1.77 · 2026-09-04：Face Makers 样例验收及全部原证据保持；当前仅准备[剩余四页批量方案](../../../product/category-remaining-pages-proposal.md)，待明确确认，未实施。只读指纹、分类数据求值与看板离线门禁核验见 [remaining-proposal-checks.json](remaining-proposal-checks.json)，不代表新应用/浏览器/SEO/生产 QA；32 条源验收、原失败和 P0/UNKNOWN/材料任务取消不变。未提交/推送/部署，不开启 RELATED。

> v1.76 · 2026-09-04：用户明确回复“CATEGORY-001 单页样例验收通过”，已登记 CATEGORY_SAMPLE 范围验收，源验收总数 32。见 [验收核验记录](acceptance-checks.json)。CATEGORY-001 整项仍未完成，剩余四页方案/正文开发未启动。本轮只登记验收与核对文件/看板状态，不改网站代码，不重跑应用测试/构建/浏览器/SEO，不部署。下方 v1.75 待验收、通过/失败及时间全部保留原语境，原 checks.json / board-checks.json 不改写。用户成果验收不自动补成人类逐项事实审核、权利或生产通过；原 P0/UNKNOWN/取消状态保留。

2026-09-04 · v1.75。用户确认方案后已本地实施。**样例待验收，CATEGORY-001 整项未完成，未部署。** 此处存证，权威状态仍在原 HTML 看板。

## 交付范围

- /category/face-makers：保留原 H1/Title/简介和两卡片；增加选择说明、其它四分类和重叠提示，独立 OG/Twitter、CollectionPage/ItemList 与 Breadcrumb。
- 五页共用目录过滤，计数仍 2/3/1/2/1；/category 全族（含错误路径）禁止广告，分类往返使用文档边界并有遗漏客户端跳转守卫。保留 /games 隔离和 Analytics 行为，不宣称全站广告合规。
- 其余四页正文/布局/metadata 未改造，12 组截图逐字节相同。CSS、数据/Registry/UNKNOWN、SWF、依赖、游戏实现与首页发现内容保持。
- 五页仍 noindex/follow、自引用 canonical、不进 sitemap。无新增路由/游戏/图片/FAQ/评分/版权或可用性承诺。

## 本地验收

[打开 Face Makers 样例](http://127.0.0.1:3100/category/face-makers)。已重启生产预览，buildId：nTDZHFbpW4UvLAIaq4fWV。

环境：Windows，Node 22.16.0 / Next 14.2.35 / React 18.3.1 / OpenNext 1.3.0；Playwright 1.62.1 + Chrome 152.0.7977.65，独立无头上下文、模拟视口。当前无 Browser 插件，按前端测试技能使用现有 Playwright，理由 Browser plugin not available；无安装依赖，不是真机或全浏览器验证。

| 检查 | 结果与边界 |
|---|---|
| 类型、lint、检查器 lint、22 任务回归 | 通过；25 命令 exit 0 |
| Next / OpenNext / 既有 Worker patch | 通过；3 命令 exit 0，42 静态路由；构建不是部署 |
| 9 built / 11 HTTP、robots、SEO | 通过；共 48 项最终工程命令 exit 0 |
| 分类专项 | source/真实 SSR/加载器 581 断言、80 反例；built 587/90；HTTP 598/90 |
| SEO | 20 页 0 must / 12 既有 should；分类专项另验；KW-04 未验证 |
| 响应式 | 5 页 × 1280×900、390×844、360×800 共 15 组；无横向溢出/空白/覆盖层，console warning/error 0 |
| 样例首屏/全文 | 首卡底部 707.546875 / 650.8125 / 673.140625px，均在首屏且几何未变；说明和分类全文可见，无 clamp/裁切 |
| 冻结 | 其余四页正文/metadata/schema/几何、12 组截图 SHA 相同；141 原运行/资源文件 SHA 保持 |
| 操作 | 45 项导航/菜单/键盘/Enter/历史通过；另 12 项全文和 404 Home 文档重载补充通过 |
| 广告归属 | 主流程 3 个 AdSense 请求来自首页，分类 0；主流程只证明已插入脚本。独立补测另确认首页 HTTP 200 + load 事件 +全局对象，进入分类新文档后三者及 iframe 均无 |
| 长停留 | 9 路实际 load 后 12.5 秒无广告正例跨两次运行覆盖；两轮整体仍因其它页面 load 超时为 FAIL，不宣称单批全通过/外部加载稳定 |
| 看板 | 离线 VM 87 断言通过；验收仅模拟，不产生真实用户验收。真实看板视觉未验证，不绕过历史文件访问限制 |

旧首页/目录/游戏契约通过精确可逆增量兼容，不刷新旧 golden。旧检查“hash unchanged”可能指逆向获准增量后的契约，不意味着本次修改的 7 文件原字节没变。

## 失败与未验证

- 基线初轮 networkidle 超时，记录保留；改按身份/可见 H1/绘制完成取基线。
- 临时 fixture 生成器的 Windows ESM 路径报不支持协议；改 file URL 后成功。先行检查缺 fixture 报 ENOENT，未改旧 golden。
- 两轮长停留整体 load 超时，当时未完整捕获挂起来源。完成的 9 路正例逐条引用来源；独立诊断后来 load 完成、GA collect ERR_ABORTED，不足以归因原超时。未拦截第三方或改变应用 Analytics 来让检查通过。
- 首轮 45 项交互后，临时报告器误把字符串 URL 当方法导致 FAIL；修正后完整重跑通过。9 条精确缺失路径的预期 404 资源提示单列，不伪装为控制台完全无提示。
- 看板补丁初次 hunk 顺序校验被拒，无写入；按行序重发成功并完成 VM。模拟验收不增加真实源验收，仍 31 条。
- 保留 React 18 旧 fetchPriority SSR、OpenNext Windows 提醒。CWV/真机、SWF 内部编辑/保存/全屏、外站生成器、生产版本/SEO/广告/CMP 未验证。
- 发布 **不通过**；原 P0/UNKNOWN、12 should、KW-04、人类事实审核、Oval 完整迁移延期不关闭。LICENSE-GATE 材料任务继续取消，不恢复或索要材料。

## 文件与证据

运行新增：lib/games/categories.ts、category-policy.ts、category-content.ts、lib/seo/category-sample.ts。

运行修改：app/category/[slug]/page.tsx、components/game/GameLink.tsx、components/DeferredThirdPartyScripts.tsx。

测试新增：scripts/check-category-sample.mjs、category-sample-test-utils.mjs、category-sample-compat.mjs、fixtures/category-sample-baseline.json、fixtures/category-sample-approved-source-delta.json。

接线修改：scripts/check-games-index.mjs、scripts/games-index-compat.mjs、scripts/README.md、package.json。治理：本目录、方案顶部、PAGE_PLAN、LAUNCH_CHECKLIST、SEO_LOG、权威看板。

见 [checks.json](checks.json)、[board-checks.json](board-checks.json)、[内容审核](content-review.md)。v1.74 [proposal-checks.json](proposal-checks.json) 原样保留。

截图/脚本/日志：C:/Users/liu/AppData/Local/Temp/mysquarefaceicon-category-v175-20260904/。临时目录可能被清理，关键结果/指纹/边界留存于仓库。

~~~powershell
Set-Location D:\LYXGIT\mysquarefaceicon
npm run category-sample:check
npm run category-sample:check -- --built
npm run category-sample:check -- --base http://127.0.0.1:3100
node scripts/seo-check.mjs --base http://127.0.0.1:3100
~~~

## 验收与回滚

请验收两卡片、两段说明、其它分类、手机全文/菜单、返回/键盘。通过后回复 **CATEGORY-001 单页样例验收通过**。

看板 v1.75 只开放样例验收；通过后整项仍是设计中，剩余四页须单独方案确认。不自动批量、RELATED、索引或部署；原 31 条用户验收不增加。

未提交/推送/部署，无线上版本变更。回滚先核对 SHA，再按 category-sample-approved-source-delta.json 逐段逆向 7 个既有文件，仅移除本项新增文件/接线与治理增量，保留 GAMES/首页/游戏成果、全部验收/取消记录。不得整仓 reset 或以旧 HEAD 覆盖累计脏工作区；回滚后重新构建核验。

质量监管技能管理单项/验收/发布门禁；React 技能用于服务端数据、脚本监听和最小客户端守卫；前端测试技能用于真实页面/截图/焦点/网络/失败记录。技能检查不等于人类或生产验收。
