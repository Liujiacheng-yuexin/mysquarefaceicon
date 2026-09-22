# RELATED-001 · Category + Tags 推荐交付

记录日期：2026-09-05  
范围：`RELATED_OVAL_SAMPLE`  
状态：**Oval 单页样例与剩余入口均已本地验收；全站发布不通过，未部署**

> v1.84 · 2026-09-07：用户明确回复 `RELATED-001 剩余入口验收通过`。结合 v1.81 Oval 样例验收，RELATED-001 本地范围整项完成；v1.83 原实现、QA、失败与浏览器条件项保持原日期，本轮只登记验收，不重跑应用检查。[整项验收记录](remaining-acceptance-checks.json)。RECENT/FAV 未开始，不提交、推送或部署。

> v1.81 · 2026-09-07：用户明确回复 `RELATED-001 Oval 单页样例验收通过`。本次只登记 v1.80 Oval 样例验收，不重跑或改写原 QA，不代表其它入口、权利、索引、生产或整项完成。[验收记录](acceptance-checks.json)

> v1.82 · 2026-09-07：用户在样例验收后要求下一步开发。当前只提交[剩余入口方案](../../../product/related-games-remaining-surfaces-proposal.md)，拟覆盖英文首页 discovery、Pixel FAQ 后区和未来 `/games/[slug]` 的共享 RelatedGames；方案待确认，应用未实施。Oval 样例验收、v1.80 原 QA 和 33 个源验收任务键保持。[方案核对](remaining-surfaces-proposal-checks.json)

> v1.83 · 2026-09-07：用户明确回复 `确认 RELATED-001 剩余入口方案，进行开发`。首页、Pixel 和 future detail 共享组件已按方案接入，并通过源码、SSR/built/HTTP、全回归、Next/OpenNext、20 URL SEO、robots 和三视口 Chrome 检查；当前[剩余入口交付待验收](remaining-surfaces-README.md)。Oval 样例验收与 33 个源验收键保持；不启动 RECENT/FAV，不提交、推送或部署。

## v1.80 Oval 样例交付

- 新增服务端 `selectRelatedGames`：先验证记录与现有发布/身份/路由门禁，再按共同有效分类数降序、共同规范化标签数降序、稳定 game ID 排序。
- 排除自身、无相关性、非法记录、非 `PUBLISHED`、伪 legacy、重复 ID 或路径冲突的全部候选；默认最多 4、硬上限 8，真实不足不补位。
- `qualityScore=null` 与不存在的 popularity 不换算成 0、不参与排序；诊断固定记录 `DISABLED_NO_VERIFIED_DATA`。
- 只在 `/oval-face-icon-generator` 的 FAQ 后接入样例：游戏组为 Square + Pixel External；Pixel 先链接本站访问详情页。原三张 Guide/Gallery 卡保持原文、原序、原 href，移到独立资源组。
- 首页、Pixel 页、`/games`、五个分类页、共享 `RelatedGames`、URL/TDK/H1/canonical/schema/index/sitemap/robots、首屏 Player、SWF 与 CSS 均未改变。

## 结果分级

| 检查面 | 结论 | 证据 |
|---|---|---|
| 算法、源码、SSR/built/HTTP 卡片契约 | 通过 | `npm run related:check`，以及 runner 的 `--built`、`--base http://127.0.0.1:3000` 三种模式；每种 53 项核心断言通过 |
| TypeScript / ESLint | 通过 | 全项目 `tsc --noEmit`；`npm run lint` 为 0 warning / 0 error |
| Next / Cloudflare 等效构建 | 通过 | Next 共 42 routes；OpenNext 产出 worker，保留 Windows compatibility warning |
| 既有页面与组件冻结回归 | 通过 | Oval、Square、Pixel、Games Index、分类样例/四页、首页五组、Game Data/Player/Route/Component/Metadata/Template、rights/locale/canonical/robots 等相关 runner 通过；旧 golden 未刷新，使用精确可逆批准增量 |
| 本地 SEO | 通过（本次范围） | 20 页、0 must / 12 个既有 should；KW-04 仍是人工项 |
| 浏览器与移动 | 通过（本次范围） | Chrome/Playwright 1280×900、390×844、360×800；两组 2+3 卡、全文、类型、href、几何、无横向溢出、初载玩家资源 0；Pixel/Gallery/Square 共 9 个 focus/Enter/click/Back 往返；console/page error 0 |
| 人类内容/真实设备/其它浏览器/内部 SWF/CWV | 未验证 | 不从自动化与截图推导通过 |
| 生产、权利与全站发布 | 不通过 / 未验证 | 未部署、未运行 `seo:prod`；Square/Oval 精确权利仍 UNKNOWN，原 P0/CMP/生产门禁保持 |
| 权威看板视觉 | 未验证 | 沿用真实本地文件访问限制，不以替代副本绕过；只做源码/脚本门禁 |

## 浏览器截图

- [桌面 1280×900](screenshots/desktop-1280-related-focused.png)
- [移动 390×844](screenshots/mobile-390-related-focused.png)
- [移动 360×800](screenshots/mobile-360-related-focused.png)

三张截图均聚焦 Pixel External 卡；桌面同时呈现完整资源组，移动截图与几何断言共同证明分组顺序和无裁切/溢出。Browser plugin/skill 在当前环境未提供，因此按前端测试 skill 的回退要求使用已缓存 Playwright 1.62.1 与本机 Chrome，没有安装新依赖。

## 初始失败与更正后重跑

以下失败均保留，不用最终 PASS 覆盖：

1. 新专项首次编译因测试 fixture 的可选类型未收窄而失败；只修正测试 helper 后重跑通过。
2. 重复路径负例首次使用了自身已无效的 slug/canonical fixture，未形成两个有效冲突；改成两个各自合法但同路径的记录后，全部冲突候选排除断言通过。
3. 旧 Oval checker 首次因新分组不再匹配旧手写卡片正则而失败；加入只认可本任务精确增量的逆变换后 source/built/HTTP 重跑通过。
4. 兼容层先后暴露动态 href、`package.json`、scripts README、旧 checker 和二进制 Buffer 的范围处理问题；逐项收窄为白名单精确逆变换，旧 golden 未更新，相关目录/分类/Oval runner 重跑通过。
5. 一次 PowerShell 临时 hash 命令转义失败、一次截图 glob 误用 `-LiteralPath` 失败；均改为无歧义的文件枚举后复核，不影响应用。
6. `Start-Process` 后台启动命令在执行前被策略拒绝；没有留下额外进程。随后用当前执行通道前台启动 Next production server成功，HTTP/SEO/浏览器检查完成。

## 代码与证据文件

- 运行时：`lib/recommendations/related-games.ts`、`app/oval-face-icon-generator/page.tsx`
- 专项检查：`scripts/validate-related-games.ts`、`scripts/run-related-games-check.mjs`、`tsconfig.related-games-check.json`
- 冻结兼容：`scripts/related-games-compat.mjs`、`scripts/fixtures/related-games-approved-delta.json`，以及四个既有回归脚本的窄接入
- 工具入口：`package.json` 的 `related:check`、`scripts/README.md`
- 治理：本文件、`checks.json`、方案、`PAGE_PLAN.md`、`LAUNCH_CHECKLIST.md`、`SEO_LOG.md` 与权威 HTML 看板

`proposal-checks.json` 是 v1.79 方案阶段的不可变历史记录，本次没有覆盖。结构化最终结果见 [checks.json](checks.json)。

## 验收与回滚

用户已验收 Oval FAQ 后的两张游戏/工具卡、紧随其后的三张资源卡与移动边界，也已单独验收首页、Pixel 和 future detail 剩余入口。RELATED-001 本地范围整项完成；不自动开始 RECENT-001/FAV-001，不提交、推送或部署。整项验收见 [remaining-acceptance-checks.json](remaining-acceptance-checks.json)，原交付、检查与回滚边界见 [remaining-surfaces-README.md](remaining-surfaces-README.md)。

如需撤销已验收样例，回滚仅撤销上列本任务运行时/检查/治理增量并移除 `related:check`；保留此前全部用户改动与 CATEGORY-001 验收。因为没有部署，无线上数据或生产回滚。
