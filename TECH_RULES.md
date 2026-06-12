# TECH_RULES.md

本文件用于约束已有网站模板的技术改造。开发前必须优先理解当前模板的技术栈和实现方式，再按现有模式扩展。

## 技术目标

- 保留模板已有技术优势。
- 页面速度快。
- 移动端体验稳定。
- metadata、canonical、sitemap、robots 可控。
- 支持结构化页面和后续扩展。
- 支持工具交互、内容管理或程序化页面时，必须能控制 index 质量。
- 支持后续多语言扩展时，URL、metadata、hreflang 方案要提前规划。

## 开发前检查

开始写代码前先检查：

- package.json
- 框架版本
- 路由目录
- 页面目录
- 组件目录
- 样式系统
- metadata 实现
- sitemap / robots 实现
- 数据来源
- 构建命令
- lint 命令

## 技术栈规则

以当前模板为准，不要擅自更换框架或大规模重构。

如果没有明确技术栈，优先使用：

- Next.js
- TypeScript
- Tailwind CSS
- MDX 或结构化内容数据
- 静态生成优先，必要时使用服务端渲染

## SEO 技术要求

- 每个 index 页面必须有唯一 title。
- 每个 index 页面必须有唯一 description。
- 每个 index 页面必须有 canonical。
- 每个 index 页面必须检查主关键词密度，目标范围为 `3% - 5%`。
- 每个页面只能有一个 H1。
- sitemap 只输出 index 页面。
- robots.txt 声明 sitemap。
- noindex 页面不得出现在 sitemap。
- Open Graph 和 Twitter Card 必须可配置。
- 重要页面必须支持结构化数据。
- 页面 URL 一旦发布，不得随意修改。

## 关键词密度技术检查

每次开发、改造或优化 index 页面后，必须在交付前检查主关键词密度。

检查口径：

- 统计页面主内容区的可见文本。
- 排除导航、页脚、重复站点模板、脚本、schema JSON、隐藏文本和 aria-only 辅助文本。
- 英文按正文总单词数计算；多词关键词按完整短语出现次数计算。
- 中文、日文、韩文等无空格语言可使用分词、正则匹配或人工估算，但最终必须报告是否达到 `3% - 5%`。

技术实现建议：

- 如果项目已有内容数据层，可在内容审核脚本中加入 `primaryKeywordDensity` 字段。
- 如果项目有程序化页面，建议把关键词密度作为质量检查项之一，和 `qualityScore`、`indexStatus`、`canonical` 一起验证。
- 检查脚本不得为了达标自动机械插入关键词；自动化只能报告问题，具体改写必须保证可读性。

## 重复 UI 文案技术处理

当页面中存在大量重复按钮或控件文案，并且这些文案明显影响关键词密度时，可以使用 CSS `content` 技巧把视觉 UI 标签移出主内容 DOM 文本。

适用场景：

- 同一页面有大量 `Play`、`Copy`、`Download`、`Use`、`Generate`、`Preview` 等重复按钮。
- 重复文案是固定 UI 标签，不是正文说明、标题、FAQ 或有 SEO 价值的内容。
- 页面关键词密度因这些重复 UI 文案明显偏离 `3% - 5%`。

实现要求：

- 优先保留原有组件结构和样式系统，只做局部调整。
- 可以用伪元素输出视觉文案，例如 `.play-button::after { content: "Play"; }`。
- 按钮必须保留可访问名称，例如 `aria-label="Play"`，不能变成无名称按钮。
- 如果是图标按钮，图标必须有可识别状态，悬停或聚焦状态仍要清晰。
- 不要把正文内容、SEO 关键词、FAQ、标题或内链锚文本放进 CSS `content`。
- 检查关键词密度时，应排除这类重复 UI 标签，重点统计主内容可见正文。

多语言实现：

- 多语言 UI 标签可以拆成语言 CSS 文件，例如 `cn.css`、`en.css`、`ja.css`。
- 每个语言页面只加载当前语言对应的 CSS 文件。
- 不要为了多语言同时渲染多个语言版本的按钮文案。
- 如果项目已有 i18n 系统，优先遵守现有语言加载方式；CSS `content` 只作为重复 UI 标签的优化手段。

验证要求：

- 检查页面视觉是否仍显示正确按钮文案。
- 检查按钮可访问名称是否存在。
- 检查移动端按钮宽度、换行和点击区域。
- 重新估算主关键词密度是否回到 `3% - 5%`。

## 程序化页面控制

如果项目包含批量页面，数据层必须支持：

```text
slug
title
description
h1
canonical
indexStatus
qualityScore
primaryKeywordDensity
pageType
primaryKeyword
secondaryKeywords
searchIntent
lastUpdated
relatedPages
```

规则：

- `indexStatus = noindex` 的页面必须输出 noindex meta。
- `indexStatus = noindex` 的页面不得进入 sitemap。
- `qualityScore` 低于阈值的页面自动 noindex。
- 默认阈值为：`qualityScore < 70` 自动 noindex，`70-84` 人工审核后再决定，`85+` 可作为 index 候选。
- 阈值和 index 判断应集中在数据层、sitemap 生成逻辑或 SEO 配置中，不要散落在多个页面组件里。
- `primaryKeywordDensity` 不在 `3% - 5%` 范围内的页面不得直接进入最终发布状态，必须先人工调整或说明原因。
- 相似度过高的页面不得同时 index。
- 搜索页、筛选页默认 noindex。

## 性能要求

- 首页和核心页面必须快速加载。
- 首屏不要依赖过重客户端脚本。
- 图片使用 WebP / AVIF。
- 图片必须设置 width、height、alt。
- 避免布局偏移。
- 移动端不得横向滚动。
- 核心内容必须无需 JS 也能被搜索引擎理解。
- 动画不得影响 LCP / INP / CLS。

## 可访问性要求

- 表单控件必须有 label。
- 按钮必须有清晰可访问名称。
- 颜色对比度必须足够。
- 键盘可以完成核心流程。
- FAQ、导航、面包屑和主内容结构语义清晰。

## 结构化数据

常用 schema：

- WebSite
- Organization
- WebApplication
- SoftwareApplication
- Article
- FAQPage
- BreadcrumbList
- CollectionPage

注意：

- schema 内容必须和页面可见内容一致。
- 不要标记页面上不存在的 FAQ。
- 不要滥用 rating、review 等结构化数据。

## 发布前技术检查

- build 通过
- lint 通过
- 首页返回 200
- 核心页面返回 200
- 不存在明显 404 / 5xx
- sitemap 可访问
- robots 可访问
- canonical 正确
- noindex / index 状态正确
- 每页只有一个 H1
- title / description 唯一
- 移动端无布局问题
