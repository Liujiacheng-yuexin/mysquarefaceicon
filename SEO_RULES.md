# SEO_RULES.md · MySquareFaceIcon 项目 SEO 决策

> 口径版本：`2026-08-31 / v2.1`
>
> 迁移决定：用户在验收 `BASE-001` 时明确选择“SEO 口径迁移到 v2.1”。
>
> 通用规则唯一来源：[RULES.md](RULES.md)。本文件只保留 `mysquarefaceicon.com` 已确认的项目决策，不再复制通用规则。

## 1. 权威顺序

1. 用户当前明确指令。
2. `AGENTS.md` 的任务与验收门禁。
3. 本文件的项目专用 SEO 决策。
4. `RULES.md` v2.1 的规则 ID、分级和算法。
5. `PAGE_PLAN.md`、`CONTENT_PLAN.md`、`LAUNCH_CHECKLIST.md` 等执行记录。

本次迁移已经解决旧版 `3%-5%` 主关键词密度冲突：以后不得再把该数值当成目标或发布门禁，也不得用 CSS `content` 隐藏可见按钮文案来调节词频。

## 2. 核心搜索意图与 URL

- `/` 是 `square face generator` 的主排名页和核心可玩页；默认保持 URL、canonical、主意图与首屏工具优先级不变。
- `/oval-face-icon-generator` 承担独立的 oval/rounded face generator 意图，保留现有 URL。
- `/pixel-art-avatar-icon-generator` 是指向 `icongenerators.net` 的 **External Tool** 说明与出站页，不得描述成本站托管或本站可玩的游戏。
- `/square-face-icon-generator`、`/square-avatar-generator`、`/free-avatar-maker` 等支持页必须与首页保持不同的搜索意图；同义词或轻微词序变化不另建页（IA-02）。
- 已发布 URL 默认冻结；任何改名、合并或迁移必须先检查 GSC、索引与外链，并单独审批 301 映射（IA-03、OP-03、OP-04）。
- 不扩展与 Avatar Maker / Face Maker / Character Creator / Pixel Avatar / Retro Flash / Dress-up Creator 无强关联的泛小游戏页面，除非用户另行确认品牌方向。

## 3. 索引与多语言

- sitemap 只包含希望索引、返回 200、canonical 正确且有站内入口的页面（IDX-01～IDX-07、LINK-01）。
- `/es`、`/vi`、`/ja`、`/th`、`/ar`、`/ru`、`/id` 在完成目标语言关键词调研和人工本地化前保持 `noindex, follow`，不进入 sitemap，也不发布 hreflang。
- `/cute-square-avatar-generator` 与 `/pixel-square-face-maker` 在具备更强独立价值前保持 noindex；不得因为已有 URL 就自动进入 sitemap。
- 搜索、筛选、管理、API、错误和低质量页面默认不索引；noindex 页面不得进入 sitemap。

## 4. 关键词与内容口径

所有 index 页面按 `RULES.md` 执行：

- KW-01：主关键词或自然变体覆盖 Title、H1、首段前 100 词、至少一个 H2、至少一条指向本页的站内锚文本。
- KW-02：主内容区正文中主关键词或自然变体至少出现 3 次。
- KW-03：精确短语密度 `0.5%-2.0%` 仅作自然度观察；`>2.5%` 报堆砌风险，`=0` 视为错误。密度不是排名目标，也不作为单独“达标”结论。
- KW-04：根据目标查询 SERP 前 10 名的共同子话题与实体建立语义覆盖清单，覆盖率至少 70%；缺失项说明原因。
- KW-05～KW-07：禁止堆词、隐藏 SEO 正文或由脚本自动插入关键词。
- 已有页面只能做可回滚的增量补强，遵守 KW-10～KW-16；不得整页覆盖用户已有内容。

## 5. 内链与页面质量

- 每个 index 页面至少有 1 条站内入链（LINK-01）。
- 首页、核心游戏页和重要指南页以至少 5 条相关入链为目标（LINK-02）；这是“入链”要求，不是机械添加 2～5 条出链。
- 内容页至少提供 2 条相关出链（LINK-03），链接必须帮助用户继续完成同一主题任务。
- 页面必须有独立搜索意图和至少一项独有内容（CT-01、CT-05）；不创建 thin、near-duplicate 或 doorway pages（CT-02）。
- Gallery、推荐与热度数字必须来自真实数据或明确标记为 curated examples；不得编造社区规模、评分或受欢迎程度。

## 6. 游戏来源、权利与公开文案

- Square、Oval 和所有未来游戏都必须进入 `data/game-license-registry.json`；`UNKNOWN` 不等于允许。
- 未有可复核许可证据时，不得把 `authorized`、`official`、`original creator approved`、商业可用或可再分发写成已确认事实（CT-03、TR-07）。
- 不复制竞品 SWF、图片、评论、文案、源码或下载资源；不反编译或修改 Square/Oval SWF。
- External Tool 必须显示来源、实际打开方式和外部边界；能访问或能 iframe 不代表允许嵌入、商业使用或再托管。
- 用户生成图片的用途必须遵守对应生成器的公开条款，站点不得擅自扩大为商业许可。

## 7. 性能、发布与证据

- 首页和 Oval 的 Ruffle/WASM/SWF 必须 click-to-load，首次加载不得请求 player runtime 或 SWF。
- 移动端目标为 LCP ≤2.5s、INP ≤200ms、CLS ≤0.1，且不得横向滚动（PF-01、PF-05）。
- 每次 SEO、页面、内容、内链、索引或发布相关工作更新 `SEO_LOG.md`（OP-05）。
- 发布前必须通过 type-check、lint、必需测试、框架 build 和 Cloudflare/OpenNext 等效 build（OP-09）；失败或未执行不得写成通过。
- 只有授权部署后才运行生产发布验收；HTTP/HTTPS、www/非 www 必须一跳归一（OP-02、OP-11、OP-12）。

## 8. AI crawler 项目决策

- 用户于 2026-09-02 明确回复 `确认 AI-01 分流策略`，批准训练/批量抓取阻止、搜索/用户检索允许的分流口径。
- `PROJECT_BRIEF.md` 是逐 crawler 决策与理由的项目记录；`data/ai-crawler-policy.json` 是代码与自动检查共用的执行来源。
- 训练/批量组全站阻止；搜索/用户检索组允许公开路径，但 `/admin/`、`/api/` 继续阻止。普通 `*` 组也保持公开允许、私有路径阻止。
- 当前清单包含 `RULES.md` 的 10 项以及一手资料新增的 `Claude-SearchBot`。`Bytespider` 因缺少当前一手厂商用途说明采用保守阻止，不把推断写成供应商已确认事实。
- 本决策不改变普通 Google Search 抓取、页面 index/noindex、canonical、sitemap、URL、metadata、可见内容或搜索意图。
