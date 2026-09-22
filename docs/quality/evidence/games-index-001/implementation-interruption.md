# GAMES-INDEX-001 部分实施暂停记录

2026-09-04（Asia/Shanghai）。这不是已完成交付或第二套任务看板；状态以权威 HTML 看板 v1.72 为准。详细快照见 [interruption-checks.json](interruption-checks.json)。

## 最新指令与已验收任务

用户先明确确认 GAMES-INDEX-001 目录页方案，允许本地实施；开发过程中，最新消息改为“确认 HOME-DISC-001 方案，进行开发”。核对 [HOME-DISC 原方案](../../../product/home-discovery-modules-proposal.md)、当前代码和原验收记录，HOME-DISC 已于 `2026-09-01T09:17:19.3773648+08:00` 验收完成。本轮不撤销验收或重复改造，需用户说明新增/调整范围。

重新运行 `scripts/run-home-discovery-check.mjs`，由 90 秒超时的 Node 子进程包装，退出 0：任务类型检查、Featured 关系顺序/去重、真实媒体、New verified/unknown 分支、External 站内目标、空态、五个非空分类和响应式源码断言通过。没有重跑当前实现的浏览器/移动/全量 lint/Next/OpenNext/SEO，原历史 QA 日期及限制不被覆盖。

## 目录已写入但未完成的增量

- 新增 `lib/games/directory-policy.ts`、`lib/games/directory.ts`、`lib/seo/games-directory.ts` 和 `components/game/GameLink.tsx`。
- 修改 `components/DeferredThirdPartyScripts.tsx`，加入目录边界的广告禁载与意外客户端跨界整页导航兜底；尚未完成实际行为验证，不能宣称修复通过。
- 修改共享 `GameCard`、`GameGrid`、`CategoryChip`、`GameBreadcrumb`，加入受控整页导航；`SiteHeader` 的桌面/移动菜单及 `SiteFooter` 加入目录入口。
- `app/games/page.tsx` 尚未接入新数据/metadata 模块；分类/详情/404 返回链接尚未全部处理，目录专用测试、全量构建和新版本浏览器验证均未完成。
- 三条 GameRecord、Registry、SWF、URL/index/sitemap 与部署配置未改。没有新增依赖。

修改前旧 production build 的 `/games` 在等待后可观察到 AdSense script 与广告 iframe。此为基线 DOM 观察，不是新代码通过证据；浏览器没有可用的 resource-timing/network 接口，未作“零广告网络请求”断言。旧构建未重建，启动会话后来已失效，不能把旧预览当作新版本。

## 停止点、风险与恢复

目录保持“开发中 / 部分实施已暂停”，不进入待验收；最新 HOME-DISC 请求待明确新修改范围。30 条源验收、原 QA 和取消的 LICENSE-GATE 材料任务全部保留。UNKNOWN 不等于许可，原 P0 与当前部分实现未验证使发布仍为“不通过”。没有提交、推送、部署或生产 SEO 检查。

回滚只允许核对快照中的当前哈希后，逆向本轮 7 个旧文件的精确增量和 4 个新文件；原文件副本路径记录在 JSON，临时备份不承诺永久保留。不得用 `git reset` 或 `git checkout` 覆盖此前脏工作区及已验收成果，也不得恢复材料待办。继续目录开发须按用户后续明确指令执行，先检查当前差异，不重新运行只适用于 v1.71 原状态的治理脚本。
