# CATEGORY-001 · 剩余四页批量交付

> v1.79 · 2026-09-04：用户明确回复“CATEGORY-001 剩余四页验收通过”，本批已本地验收，结合原样例完成 CATEGORY-001 本地范围。[验收登记](remaining-acceptance-checks.json)。下方待验收/未收到字段属于 v1.78 原时点，不修改其 QA 与失败记录。五分类 noindex、人类事实审核/UNKNOWN/P0/生产门禁保持；本輪仅准备 [RELATED-001 待确认方案](../../../product/related-games-oval-sample-proposal.md)，不重跑应用 QA、不开启实现或部署。

2026-09-04 · v1.78。用户已确认批量方案；**本地实现完成，剩余四页待验收，未部署**。唯一状态源是原 HTML 看板，不以此证据文档代替看板。Face Makers 样例验收和 32 条原源验收保留；四页用户验收未收到，不启动 RELATED。

## 改动与验收入口

本地 production 预览 `http://127.0.0.1:3100`，本轮完成时已核实。四页卡片仍为 3/1/2/1：

- [Avatar Makers](http://127.0.0.1:3100/category/avatar-makers)：本站 maker 与 External 访问说明。
- [Pixel Avatars](http://127.0.0.1:3100/category/pixel-avatars)：访问详情、非嵌入编辑器及 Face Makers 链接。
- [Retro Flash](http://127.0.0.1:3100/category/retro-flash)：按需 Play 指引、分类自身不加载玩家。
- [Character Creators](http://127.0.0.1:3100/category/character-creators)：当前单条 External 集合与 Face Makers 选项。

四页新增 Other avatar categories、真实数量/交叉集合说明、OG/Twitter、CollectionPage/ItemList + BreadcrumbList。原 H1/Title/description、卡片、CSS、共享分类/Player/Registry/广告/导航实现、依赖、SWF 不改。新增段落绑定准确过滤后身份/类型/路径；缺失、重复或交付变化会省略受影响说明，保留其余真实卡片。

五页继续 **noindex/follow、自引用 canonical、不进 sitemap**。Face Makers 全部真实 SSR/metadata 保持。Pixel/Character 共用一条记录、Face/Retro 共用两条，不代表独立搜索价值已成立。

## 文件范围

网站运行改动只有 [分类路由](../../../../app/category/[slug]/page.tsx) 与新增 [分类说明依赖](../../../../lib/games/category-remaining-content.ts)。

测试新增 `scripts/check-category-remaining.mjs`、`category-remaining-compat.mjs` 和两份 `category-remaining-*` fixtures；已有 `check-category-sample.mjs`、`category-sample-compat.mjs`、package.json、scripts/README.md 只追加精确可逆兼容/执行入口。**不刷新原 golden、不删除旧断言**；原始冻结先逆向本批批准差异再验证，新检查独立验证新增事实。

治理只追加 PAGE_PLAN、LAUNCH_CHECKLIST、SEO_LOG、原方案/样例交付入口与本批三份证据。详尽新增/修改 SHA 清单、保全结果见 [remaining-checks.json](remaining-checks.json)。逐页主张、人类未覆盖和不放行索引的理由见 [事实记录](remaining-content-review.md)。

## 工程与 SEO 结果

| 检查 | 本轮结果 |
|---|---|
| Type | `tsc --noEmit --incremental false` 通过 |
| Lint | Next lint 与专项脚本 ESLint 零警告通过 |
| Source 回归 | 23 个任务检查通过；含原迁移/首页/目录/样例及新批量检查 |
| 新批量专项 | source 380 断言 / 162 负例；built 386 / 182；HTTP 397 / 182，全部通过 |
| 原样例专项 | source 581 / 80；built 587 / 90；HTTP 598 / 90，旧契约保留并通过 |
| Next | next build 退出 0 |
| Cloudflare/OpenNext | opennextjs-cloudflare build 与既有 patch 脚本分别退出 0，未发布 |
| Built / HTTP | 各 10 个任务检查通过；HTTP 200、三种真实 404、noindex/canonical、原始 HTML/schema/可见卡片一致 |
| Robots / SEO | AI 分流检查通过；20 个原 sitemap 页面 0 must / 12 should；五分类由专项另查 |

共 **26 code + 3 build + 10 built + 12 HTTP/robots/SEO = 51 个命令退出 0**，所有开始/结束时间、子进程超时与 stdout/stderr/退出码指纹留存。Node v22.16.0；最终 buildId `NbeJOq_fH0nAhjitrZ8be`；原 `nTDZHFbpW4UvLAIaq4fWV` 产物副本保留。已有 React 18 SSR fetchPriority 提醒不是新页面运行错误，原始日志未删。

可重跑：`npm run category-remaining:check`；加 `-- --built` 检查产物，加 `-- --base http://127.0.0.1:3100` 检查 HTTP。其余使用 `npm run lint`、`npm run build`、`npm run cf:build`、`npm run seo:check -- --base http://127.0.0.1:3100`；本轮实际 Node 命令等价映射详见 JSON。重建前先确认本地服务的 PID/命令与产物归属；不要在 Next 生产服务读产物时覆盖构建。

## 浏览器与视觉

Browser plugin not available；使用已安装 Playwright 1.62.1 + 本机 Chrome，无新增依赖。检查路径：直接分类或首页/目录 → 分类卡片/说明/互链/菜单/键盘 → 目标页面、新文档及浏览器历史状态正确。

- 五分类 + HOME/GAMES × 1280×900、390×844、360×800，共 21 组前后渲染，非空、正确 URL/Title/H1、无框架覆盖层、无横向溢出，初始控制台错误 0。
- Face/HOME/GAMES 共 9 组正文/metadata/schema/几何严格相等；7 组完整截图 SHA 相同。HOME 在 1280/360 的整图字节不相同，未据此声明全页面像素完全等价；其 DOM/正文及主要布局冻结通过。
- 四页全文与首卡可见。Character Creators 360px 因批准的较短列表 H2 少换一行，首卡上移 23.3125px；卡片身份/尺寸不变，其余 11 组位置不变。此差异已与方案及截图核对，不改 CSS。
- 177 场景：四页所有 main 链接、新增互链、上下文 Face 链接、菜单、Tab 可见焦点/Enter、前进/后退及 404 首页/目录退路通过。18 条控制台消息为已明确预期的 404 资源响应；无 pageerror、无分类广告/玩家资源请求。
- 最终 9 路独立长停留批次：load 后 12.5 秒，再键盘/指针/合成 touchstart/滚动，无分类广告/玩家请求。3 条消息为预期 404。
- 四条首页真实广告请求 200 + script load + adsbygoogle 全局存在 → 分类全新文档清除广告边界通过；未拦截网络或伪造广告执行。仅验证隔离，不认证全站广告/CMP 合规。

截图及浏览器原始 JSON 在 `C:/Users/liu/AppData/Local/Temp/mysquarefaceicon-category-remaining-v178-20260904/`；[机器证据](remaining-checks.json) 给出绝对路径与 SHA。它们是窄窗口和合成事件，不是真机或真实触控测试。

## 失败保留与结论边界

首次本轮长等待整体 **FAIL**：Character Creators 加载既有 GA 脚本发生 `net::ERR_CONNECTION_CLOSED`。`browser-idle-initial-failure.json` 原样保留；随后同脚本、不改 Analytics、不放宽断言，独立 9 路批次通过。不保证外部服务持续稳定。

临时 fixture 生成器正则转义和跨 VM 数组原型比较两次诊断失败已保留，修正检查工具后通过；首轮浏览器比较过度冻结批准 H2 导致的卡片 Y 位移，也保留原因与精确差异。原 v1.75 两次整体 load 超时及 39 份历史 JSON、原截图/证据不改写。

**通过：** 本批确认范围内的功能、限定源码/SSR/构建/HTTP/浏览器及离线看板状态核验。

**有条件通过：** 浏览器整体稳定性仍受既有 GA 外部网络影响；最终批次通过不抹除第一次失败。

**未验证：** humanReview、KW-04、CT-02/05 独立搜索价值、质量分、真机/全部游戏内部控件/保存/全屏、外站生成、当前 CWV、生产版本和真实 HTML 看板视觉；不绕过既有看板文件访问限制。原 About/Editorial/Gallery 视觉提醒、Oval 原首屏提醒及完整模板迁移延期不由本批关闭。

**不通过：全站发布。** 既有 P0/UNKNOWN、实际权利、广告/CMP/生产门禁继续开放；LICENSE-GATE 材料任务保持取消，不索取材料，不伪造授权。未提交、推送或部署，无生产版本/部署 URL 或线上回滚证据。

## 看板、验收和回滚

权威看板已到 v1.78：`F:/LYXGIT/Liu-library/我的知识库/05_工作跟进/网站开发/开发计划/mysquarefaceicon/mysquarefaceicon_rebuild_dashboard.html`。CATEGORY-001 剩余四页 **待验收**，全局仍 20/60、本周期 1/5。旧 CATEGORY_SAMPLE 只保留样例；新批次必须是新时间且 `CATEGORY_REMAINING_PAGES` 范围的真实用户验收才完成整项。离线 VM 的模拟点击不写真实浏览器存储，不代表用户验收。

请检查四页说明、External 标记、真实数量、其它分类/Face 链接和手机首卡，确认后回复 **`CATEGORY-001 剩余四页验收通过`**。验收前停在本项；之后也不自动索引或发布。

回滚只逆向本批两个运行文件、精确兼容/检查入口/新增 fixtures 与 v1.78 治理增量；完整实施前副本在上述临时目录 `before/` 和 `board.before.html`。先比对新工作，按本批 SHA/差异撤销，不能整仓 reset 或覆盖累计未提交内容。保留 v1.76 样例验收、旧 golden/QA/失败；重新构建/启动以验证回滚。未做线上操作，无线上回滚事项。
