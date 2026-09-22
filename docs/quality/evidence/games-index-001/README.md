# GAMES-INDEX-001 · 本地目录完善交付

> v1.74 · 2026-09-04：用户明确回复 `GAMES-INDEX-001 验收通过`，本地目录验收已登记。见 [验收检查](acceptance-checks.json)。下面 v1.73“待验收”、测试结果和失败描述保留原时点，不重写 checks.json 或补写成新 QA。本轮未改网站代码/构建，未重跑应用或浏览器检查，未部署；只按下一项指令准备 CATEGORY-001 方案，不代表全站内容审核、许可、索引或生产已通过。

2026-09-04。用户“现在开始进行下一步开发”后，从已确认方案的暂停点继续。本轮只交付 `/games` 及目录往返/广告边界；HOME-DISC 原验收保持。权威 HTML 看板 v1.73 仅设 **待验收**，不是已完成或发布通过。

## 结果与页面

- `/games`：2 个本站游戏、1 个 External Tool，真实去重计数；Pixel 先进入本站来源说明页。5 个非空分类、重叠计数说明、完整摘要和空态；没有新增游戏、Featured 重复区、搜索/收藏/评分或虚构日期。
- 保持 H1/Title、URL、自引用 canonical、noindex/follow、sitemap 排除与模块顺序。增加目录自己的 description/OG/Twitter 与服务端 CollectionPage/Breadcrumb；没有把目录声明成可玩游戏。
- 共享导航/页脚，以及首页、Oval 独立导航/页脚增加 All avatar games。卡片、分类、面包屑、详情/分类/404 的目录往返为整页导航；其他链接保持原行为。
- `adEligible: false` 及实际加载器守卫：直接访问、交互、超过 12 秒、已有广告的来源页、前进/后退均核验。Analytics 原行为不变，不宣称零第三方请求或 CMP 通过。
- CSS、依赖、三条 GameRecord、Registry、SWF、播放器实现、部署配置未修改。首页与其他页面仅增加已确认的目录导航，不重做已验收发现区。

## 验证

环境：Windows、Node 22.16.0、Next 14.2.35、React 18.3.1、OpenNext 1.3.0。分支 `codex/game-platform-rebuild`，HEAD `c6d30087c2c03a7c4eb8d5bfe6e055e9b8d40228` 加当前脏工作区；未提交。
最终 production build：`0I9s24K1NYq3oZVWsWY5B`；预览 [http://127.0.0.1:3100/games](http://127.0.0.1:3100/games)。

| 检查 | 本轮结果 |
|---|---|
| 类型、lint、检查器 lint、21 个任务回归 | 通过；24 项最终代码命令 exit 0 |
| Next、OpenNext、既有 Worker patch | 通过；3 项命令 exit 0，42 静态路由；平台构建不是部署 |
| 8 项构建产物检查、10 项 HTTP/robots/SEO | 通过；本轮共 45 项最终工程/产物/HTTP 命令 exit 0 |
| 目录专项 | source/真实 React SSR/加载器 289 断言、60 个反例；built/HTTP 各 291 断言、62 个反例 |
| SEO | 20 页、0 must、12 条既有 should；KW-04 和人类内容复核未完成，目录继续 noindex |
| 身份/非空/框架覆盖层/控制台 | 1280×900、390×844、360×800 通过；主流程 console warning/error 0、pageerror 0 |
| 响应式、全文与键盘 | 通过；无横向溢出或卡片摘要裁切，首卡底部 784.65625 / 714.625 / 764.140625px，均在首屏；Tab/Enter 与可见焦点通过 |
| 交互 | 28 条主流程：3 个卡片、5 分类、返回链接、桌面/手机菜单、已有广告来源页与历史前进/后退 |
| 广告请求归属复核 | 24 次返回复核通过；24 个广告脚本请求由离开前的来源文档发起，目录文档请求 0。来源首页 AdSense 脚本真实 HTTP 200，跨文档后目录仍无广告脚本/iframe |
| 404 补充 | 9 路 HTTP 的 200/404/noindex 检查通过；3 个缺失路径 × 桌面/390px 共 6 次真实返回目录通过 |
| 看板 | JS/离线状态与验收流程单列 `board-checks.json`；真实看板视觉仍未验证，不绕过历史访问限制 |

当前会话没有 Browser skill，采用已安装的 Playwright 1.62.1 + Chrome，独立无头上下文；理由 `Browser plugin not available`，没有安装依赖。宽度是模拟视口，不是真机或所有引擎。13 张主流程截图 + 2 张 404 截图位于本轮临时证据目录；Agent 已目视复核桌面/手机全文、手机焦点/菜单和 404 截图，不代替人类验收。

## 失败、修正和证据边界

1. 初次 ROUTE-001 检查在 `app/games/page.tsx` 查找已移入辅助模块的字段而失败；更新检查定位，并由专项执行实际 metadata/data/SSR，最终回归通过。原失败日志保留。
2. 初始旧 SSR 比较暴露首页和 Oval 使用独立导航/页脚；在已确认导航范围内补齐。兼容层保留旧 golden，只逆向精确获准导航和源码片段；支持原始/标准换行，反例确保不能隐藏额外改动。旧测试的“hash unchanged”输出指归一后的旧契约，不代表所有原文件原始字节未变；真实文件改动见 checks.json。
3. 第一份浏览器日志按操作阶段标记，24 次来源页 pointer/scroll 广告请求被记到“返回目录”阶段。补充日志记录请求当时的 frame URL，确认全部发生在来源文档；不删除原请求、不据此声称全站无广告。
4. 补充脚本在最后的 HTTP 404 断言失败：Next 的动态 notFound 响应可能是携带 RSC 的错误壳，没有字面的 `<a>`。原整体 FAIL 保留；单独复测 HTTP 404/noindex 与实际水合页非空/返回链接均通过。没有修改错误页索引或错误壳机制来迁就测试。
5. 旧 React SSR `fetchPriority`、OpenNext Windows 提醒保留；不是新浏览器错误。没有重测 CWV、真实全屏/全部 SWF 内部控件/保存、外站生成器、生产版本/一跳/SEO/广告/CMP；全站发布为 **不通过 / 未部署**。

许可 UNKNOWN、KW-04、12 should、旧 Oval 首屏偏低及既有窄卡/间距提醒不关闭。LICENSE-GATE 材料任务仍已取消，不索要材料、不重建文件；30 条源验收与历史 QA 保留。取消不是授权，局部功能通过也不是发布通过。目录内容事实表见 [content-review.md](content-review.md)，人类审核仍等待用户。

## 文件清单

本任务新增 7 个运行/测试文件：

- `lib/games/directory.ts`、`lib/games/directory-policy.ts`、`lib/seo/games-directory.ts`
- `components/game/GameLink.tsx`
- `scripts/check-games-index.mjs`、`scripts/games-index-compat.mjs`、`scripts/fixtures/games-index-approved-source-delta.json`

本任务调整 20 个既有文件（包含暂停前的增量）：

- `app/games/page.tsx`、`app/category/[slug]/page.tsx`、`app/not-found.tsx`、`app/oval-face-icon-generator/page.tsx`
- `components/DeferredThirdPartyScripts.tsx`、`components/SiteHeader.tsx`、`components/SiteFooter.tsx`、`components/HomePage.tsx`
- `components/game/GameCard.tsx`、`GameGrid.tsx`、`CategoryChip.tsx`、`GameBreadcrumb.tsx`、`GameDetailTemplate.tsx`
- `scripts/check-square-homepage.mjs`、`check-oval-legacy-page.mjs`、`check-pixel-external-page.mjs`、`check-locale-rights.mjs`、`validate-game-routes.ts`、`scripts/README.md`、`package.json`

治理更新：本目录证据、`PAGE_PLAN.md`、`LAUNCH_CHECKLIST.md`、`SEO_LOG.md`、原目录方案顶部及权威 HTML 看板；原方案/暂停 JSON、标准模板、旧验收/失败截图均不改写。

## 复现、验收与回滚

```powershell
Set-Location D:\LYXGIT\mysquarefaceicon
npm run games-index:check
npm run games-index:check -- --built
npm run games-index:check -- --base http://127.0.0.1:3100
node scripts/seo-check.mjs --base http://127.0.0.1:3100
```

完整命令/起止时间/超时/退出码和日志指纹在 [checks.json](checks.json)。原始日志和 Playwright 脚本保存在 `C:/Users/liu/AppData/Local/Temp/mysquarefaceicon-games-index-v173-20260904/`；临时目录可能被系统清理，checks.json 中的摘要/证据边界与兼容契约保留。

仅撤销本项时，先核对当前文件是否匹配本轮 SHA，再逐段逆向 `games-index-approved-source-delta.json` 的明确改动；Pixel 检查器只逆向新增兼容 import/调用。仅移除本项新增文件与治理增量，保留用户其他脏工作区成果、原验收与取消状态，然后重新构建和核验。不得 `reset --hard`、整仓还原或按旧 HEAD 覆盖累计工作。没有线上版本变化，无线上回滚事项。

质量监管技能保持单项/待验收/发布门禁；React 技能用于服务端目录数据和最小客户端路由策略；前端测试技能补充真实浏览器、全文、焦点与网络证据。等待用户明确回复 **`GAMES-INDEX-001 验收通过`**，不自动开始下一项、提交、推送或部署。
