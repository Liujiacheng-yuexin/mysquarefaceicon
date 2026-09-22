# RELATED-001 · 剩余入口本地交付

记录日期：2026-09-07  
范围：`RELATED_REMAINING_SURFACES`  
状态：**本地实现已获用户验收；生产未验证、未部署；全站发布不通过**

## 交付结果

- 英文首页继续显示 Oval → Pixel，但来源从 `relatedGameIds` 改为已验收的 Category + Tags 选择器；模块对外名称改为 `Related Avatar Games`。
- Pixel 页继续显示 Square → Oval，保留两张现有卡片的标题、说明、href 与顺序，并把原 Pixel Square Face Maker 指南独立为 `Pixel Avatar Guide`。
- 未来 `/games/[slug]` 的共享 `RelatedGames` 使用同一选择器；测试可传入明确候选记录，生产发布/权利/路由门禁没有放宽；空结果仍不渲染。
- `relatedGameIds` 保留为兼容字段，但不再决定首页、Pixel 和 future detail 这三个入口的排序。quality/popularity 仍为 `DISABLED_NO_VERIFIED_DATA`。
- Oval 已验收样例、目录、五分类、七个 noindex locale、URL、TDK、H1、canonical、schema、robots/index、sitemap、Player、SWF 与 CSS 均不在本轮变更范围。

## 验证结论

| 检查面 | 结论 |
|---|---|
| 算法、源码、SSR、built、loopback HTTP | 通过 |
| 全项目 TypeScript / ESLint | 通过；lint 0 warning / 0 error |
| Next / OpenNext Cloudflare 构建 | 通过；保留 OpenNext Windows compatibility warning |
| 历史页面与冻结金标 | 通过；用 `related-remaining-compat.mjs` 只逆转本轮批准差异，旧 golden 未刷新 |
| 本地 SEO / robots | 通过；20 URL 为 0 must / 12 个既有 should，robots 11 项策略通过 |
| Chrome 1280×900 / 390×844 / 360×800 | 有条件通过；布局、顺序、文本、类型、href、键盘/鼠标导航、无溢出、初载零玩家资源通过；首轮 Pixel 历史导航后 console 为 1/2/0，诊断复跑定位到第三方 Ads 403 并得到 1/0/0，完整计数已留证 |
| 生产、实际许可、人工事实审核、真机/其它浏览器、field CWV | 未验证或不通过 |

结构化命令、哈希、失败重跑、浏览器场景和未验证项见 [remaining-surfaces-checks.json](remaining-surfaces-checks.json)。

## 截图

- 首页 Related：[1280](screenshots/remaining-root-1280x900.png) · [390](screenshots/remaining-root-390x844.png) · [360](screenshots/remaining-root-360x800.png)
- Pixel Related：[1280](screenshots/remaining-pixel-related-1280x900.png) · [390](screenshots/remaining-pixel-related-390x844.png) · [360](screenshots/remaining-pixel-related-360x800.png)
- Pixel Guide：[1280](screenshots/remaining-pixel-guide-1280x900.png) · [390](screenshots/remaining-pixel-guide-390x844.png) · [360](screenshots/remaining-pixel-guide-360x800.png)

Browser 插件/专用 browser skill 在本环境未提供，因此按前端测试回退使用既有缓存 Playwright 1.62.1 与本机 Chrome，没有安装依赖。

## 验收与边界

用户已于 2026-09-07 明确回复 `RELATED-001 剩余入口验收通过`；结合既有 Oval 样例验收，RELATED-001 本地范围整项完成。独立验收记录见 [remaining-acceptance-checks.json](remaining-acceptance-checks.json)。

本次验收不自动开始 `RECENT-001` 或 `FAV-001`，不授权提交、推送或部署，也不表示真实权利、人工事实审核、索引或生产通过。

如需回滚，只撤销本轮剩余入口运行时、检查、精确兼容层和 v1.83 治理记录；保留已验收 Oval 样例、既有验收与用户工作区改动。由于未部署，无生产回滚动作。
