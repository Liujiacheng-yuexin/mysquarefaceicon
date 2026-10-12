# QUIZ-001 · 开发前核对与页面提案

日期：2026-10-12（Asia/Shanghai）。此目录为证据附件；任务状态唯一来源仍是权威 HTML 看板。

本轮请求为“读取该文档并且开发新页面”。已保存附件副本并形成 [一页方案](../../../product/friend-block-test-proposal.md)。附件内 `/goal` 范例不是用户已执行的指令；未创建 goal，未登记方案已确认或发布授权。

## 当前仓库与改动

- 工作目录：`D:/LYXGIT/mysquarefaceicon`，分支 `main`。
- 开始时工作区干净；`git fetch origin` 后 HEAD 与 origin/main 均为 `1d275c678a1e15170a8e836b2c540ab3c68ea8f6`，ahead/behind 为 0/0。
- 本轮只新增需求副本、提案、基线日志及治理记录；应用、检查器、依赖、索引和素材尚未修改。
- 看板可访问，原当前任务 DISCORD-BANNER-001 有 2026-10-10 的完成/发布记录；其证据与验收保持。本轮登记 QUIZ-001 为设计中 / 方案待确认。

## 基线结果

| 检查 | 结论 | 证据与范围 |
|---|---|---|
| `npm run lint` | 通过 | [lint.log](baseline/lint.log)，0 warning/error |
| `npm run build` | 通过 | [build.log](baseline/build.log)，包含 lint/type validation，生成 43 个静态页面 |
| 30 项离线 `*:check` | 不通过 | [逐项退出码](baseline/check-results.json)：29 通过、1 失败；原始日志均保留 |
| `npm run oval-page:check` | 不通过 | [原始失败](baseline/oval-page-check.log)：`components/HomePage.tsx changed outside its confirmed migration boundary` |
| `npm run seo:check -- --base http://127.0.0.1:3112` | 有条件通过 | [seo-check.log](baseline/seo-check.log)，21 URL，0 必须失败/12 既有应该提醒；不代表 KW-04、人类审核或新页面已通过 |
| `node scripts/check-ai-crawler-policy.mjs --base http://127.0.0.1:3112` | 通过 | [robots-check.log](baseline/robots-check.log)，6 blocked / 5 allowed；npm 的 robots 入口固定读取第一个 base，因此用相同脚本验证本次端口 |
| 独立 type 命令 / `npm run cf:build` | 未验证 | 本阶段没有新应用代码；Next 构建内的类型验证已通过，未单跑 tsc 或平台构建 |
| 新游戏 / `quiz:check` / 四宽浏览器流程 | 未验证 | 未编码，等待方案确认 |
| 部署 / `seo:prod` / IndexNow / GSC | 未验证 | 本轮未授权、未执行 |

生产构建检查使用本任务新启的 `127.0.0.1:3112`。3000 已被另一个项目占用，未停止或重用该进程。SEO 检查读取的是本仓库刚生成的生产构建。

## 发现与后续处置

1. `app/games/[slug]/page.tsx` 当前强制 `forceNoIndex: true`，目录只有三条 legacy 记录；新记录需要精确白名单，其它新记录继续 fail closed。
2. HTML5 adapter 不传递父页面 hash，默认播放器比例为 16:9；提案包含本记录的分享接入与手机高度处理。
3. `app/layout.tsx` 与 `DeferredThirdPartyScripts.tsx` 会加载第三方脚本；提案显式提出本测验页隔离，避免公开“不上传测验内容”的承诺与外层脚本行为冲突。尚未实测数据泄漏，不把风险当成已发生事故。
4. 原始 Oval 哈希失败：actual `fd9f94372bd2cbc98ddcf88b4364183d860ad24dd5dbb5551790fca63e8a8c9c`，expected `5ef46b20b057f491dbcd16051db5dac33a5b1dd1b24f184d0391e3ba43b4fe2f`。当前 HEAD `1d275c6` 的确改了首页品牌 aria-label，仓库存在 `beforeDiscordBannerSource` 精确逆向兼容工具；尚未证明这是全部差异，未修改任何基线或夹具。
5. 附件的流行度、难度、排名和素材权属表述不能替代来源核实；现有 Square/Oval UNKNOWN 保持，不恢复已取消的材料申请任务。

## 门禁与回滚

当前实现未开始，方案等待用户明确确认。现有必需回归失败仍可见，发布结论为“不通过”；没有提交、推送、部署或生产 SEO 变更，因此不新增生产成功记录。

本轮仅需逆向移除本任务新增文档、证据和看板/SEO_LOG 的标记增量即可回退；保留其他任务状态、历史验收与原有文件内容。新页面完成后再做实现验收及经授权的发布验证。
