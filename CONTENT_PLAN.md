# CONTENT_PLAN.md · v2.1 内容规划

> 本文件只做 MySquareFaceIcon 内容规划。规则唯一来源是 [RULES.md](RULES.md)，项目专用决策见 [SEO_RULES.md](SEO_RULES.md)。
>
> 2026-08-31 已按用户决定停止使用旧版 `3%-5%` 关键词密度目标和 CSS `content` 调词方案。

## 内容资产类型

- 核心游戏/工具页：Square、Oval。
- External Tool 说明页：Pixel。
- 支持指南：保存、裁切、平台头像、样式与故障排查。
- Gallery / curated examples。
- Blog / 教程 / FAQ / 对比内容。
- Trust / Legal：About、Contact、Editorial Policy、Privacy、Terms。
- 后续游戏平台的目录、分类、详情页与来源权利说明。

## 内容创建原则

适用规则：`IA-02`、`CT-01～CT-10`、`KW-01～KW-07`、`TR-01～TR-10`。

- 首段直接回答搜索意图（CT-01）。
- 每个 index 页面至少包含一项本页独有内容：实测结果、完整步骤、工具输出、独特解释、可复用模板或原创数据（CT-05）。
- 同一语义关键词合并到一个 canonical URL，不为词序或轻微变体拆页（IA-02）。
- 内容不足、重复或无独立价值的页面保持 noindex（CT-02）。
- 不编造游戏来源、许可、作者、功能、流量、热度或用户数量（CT-03）。
- 图片、动画和视频服务于理解，不替代正文（CT-07）。
- AI 辅助内容必须人工复核事实、语气、重复度与可读性（CT-06）。

## 关键词处理

### 1. 位置覆盖（KW-01）

主关键词或自然变体应覆盖：

- [ ] Title
- [ ] H1
- [ ] 首段前 100 词
- [ ] 至少一个 H2
- [ ] 至少一条指向本页的站内锚文本

### 2. 最低正文出现（KW-02）

主内容区正文中主关键词或自然变体至少出现 3 次。自动化只报告，不自动插词（KW-07）。

### 3. 语义覆盖（KW-04）

1. 搜索目标查询并查看前 10 名结果。
2. 列出共同覆盖的子话题与实体，通常 6～12 个。
3. 将本页覆盖位置映射到具体模块。
4. 覆盖率至少 70%；未覆盖项说明与真实功能或搜索意图不匹配的原因。

### 4. 自然度报警（KW-03、KW-05）

- 精确短语密度 `0.5%-2.0%` 仅作观察，不是优化目标。
- `>2.5%` 触发堆砌风险人工复核；`=0` 是错误。
- 禁止为了数值重复句子、堆同义词或牺牲可读性。
- 可见按钮文案保留在 DOM，并具有可访问名称；不得用 CSS `content` 调整关键词统计（KW-06、AY-01）。

## 已有页面增量补强

适用规则：`KW-10～KW-16`。

- 先记录“关键词 → URL → 文件 → 插入位置 → 内容目的”。
- 保留原有工具说明、流程、案例、FAQ、组件结构与交互。
- 优先在首段后的意图说明、现有 H2、真实 FAQ、内链上下文和 metadata 做局部补强。
- 同一 URL 的近义关键词合并，不创建重复段落或重复页面。
- 先完成一个页面样例并验收，再批量处理。

## 多语言内容

适用规则：`I18-01～I18-12`。

- 各语言独立调研主关键词与 SERP 子话题，禁止从英文主词逐字翻译（I18-07）。
- 重写 title、description、H1、首段、H2、FAQ 和 CTA，并本地化平台名称、单位和语气。
- 每个语言版本单独执行 KW-01 与 KW-04。
- 未经人工编辑或缺少独立价值的翻译页保持 noindex，不发布 hreflang，不进入 sitemap（I18-08）。
- 使用现有 i18n/React 文案，不拆分 `cn.css`、`en.css`、`ja.css` 来承载按钮文字。

## 游戏页独有内容要求

每个未来游戏记录至少要能支持：

- 真实核验的 controls、how-to、mobile/orientation、loading/error 行为。
- 来源、作者/权利人、许可状态和证据 URL；`UNKNOWN` 必须可见且不能当作允许。
- 与同类游戏不同的 features、tips、FAQ 和搜索意图。
- 真实 thumbnail/cover/OG 来源，不复制竞争站素材。
- Related Games 与父级分类内链，不成为孤岛。

## 页面内容字段

结构化或程序化内容使用 `RULES.md` 附录 D 的字段，包括 `semanticCoverage`、`inboundLinkCount`、`author`、`datePublished` 和真实 `dateModified`。不得重新引入 `primaryKeywordDensity` 发布门禁。

## 当前内容优先级

| 对象 | 主要意图 | 当前策略 | 后续门禁 |
|---|---|---|---|
| `/` | square face generator | 保留核心游戏主意图 | 性能、许可、内容与首页格局任务 |
| `/oval-face-icon-generator` | oval face icon generator | 保留独立游戏页 | 许可、统一 Game Data、模板回归 |
| `/pixel-art-avatar-icon-generator` | pixel art avatar icon generator | External Tool，清晰来源与出站 | 遵守原站条款，不 iframe/镜像 |
| Draft locales | 各语言本地意图 | noindex | 人工本地化 + 独立关键词调研 |
| 弱支持页 | 长尾指南 | noindex 或观察 | 有独立价值、内链和语义覆盖后再决定 |

## 发布前内容检查

- [ ] 独立搜索意图明确（CT-01、IA-02）。
- [ ] 至少一项本页独有内容（CT-05）。
- [ ] KW-01 位置覆盖和 KW-02 最低出现通过。
- [ ] KW-04 语义覆盖率至少 70%，有映射与缺失说明。
- [ ] 没有 KW-03 高密度报警，或报警已人工复核。
- [ ] canonical/index/sitemap 决策正确（IDX-01～IDX-07）。
- [ ] 至少 1 条入链；核心页目标至少 5 条相关入链（LINK-01、LINK-02）。
- [ ] 内容页至少 2 条相关出链（LINK-03）。
- [ ] 来源、许可、作者、日期和公开声明可核验（CT-03、TR-06、TR-07）。
- [ ] schema 与可见内容一致（META-06）。
- [ ] `seo-check` 已执行；失败和提醒均有真实处置结果。

## 程序化内容控制

适用规则：`PS-01～PS-10`，评分只使用 `RULES.md` 附录 A。

- `qualityScore < 70`：强制 noindex 且不进 sitemap。
- `70-84`：暂缓 index，人工复核。
- `≥85`：仅为 index 候选，仍需满足全部必须级规则。
- 删除前执行 OP-04，检查外链、收录和排名。
