# LAUNCH_CHECKLIST.md

## 上线前

- [ ] build 通过
- [ ] lint 通过
- [ ] 首页可访问
- [ ] 核心工具页 / 功能页可访问
- [ ] 核心指南页可访问
- [ ] 主要聚合页可访问
- [ ] 首批重要页面返回 200
- [ ] 404 页面可访问且不会误导搜索引擎收录
- [ ] sitemap.xml 可访问
- [ ] robots.txt 可访问
- [ ] robots.txt 声明 sitemap
- [ ] HTTPS 正常
- [ ] HTTP 自动跳转 HTTPS
- [ ] 每个 index 页面有 canonical
- [ ] canonical 使用正式生产域名，且没有测试域名、localhost 或旧域名
- [ ] noindex 页面不在 sitemap 中
- [ ] 每页只有一个 H1
- [ ] 每页 title 唯一
- [ ] 每页 description 唯一
- [ ] 每个 index 页面的主关键词密度在 3%-5%
- [ ] 页面没有为了关键词密度堆词或重复句子
- [ ] 大量重复按钮文案没有干扰主关键词密度
- [ ] 如果使用 CSS `content` 处理重复按钮文案，按钮仍有可访问名称
- [ ] 重要页面有内链入口
- [ ] 首页到核心页面点击深度 <= 3
- [ ] 核心页面有 2-5 个相关内链
- [ ] 移动端无明显布局问题
- [ ] 移动端无横向滚动
- [ ] 图片有 alt
- [ ] FAQ 内容可见且 schema 一致
- [ ] Open Graph 图片可访问
- [ ] Open Graph / Twitter Card 在真实 URL 下渲染正常
- [ ] 已检查至少一个移动端截图或真机视口
- [ ] About 页面完成
- [ ] Contact 页面完成
- [ ] Privacy Policy 页面完成
- [ ] 必要时完成 Editorial Policy
- [ ] 必要时完成 Disclaimer
- [ ] 核心页面速度可接受

## 内容质量检查

- [ ] 每个 index 页面有独立搜索意图
- [ ] 每个 index 页面已记录主关键词和关键词密度检查结果
- [ ] 不存在只替换关键词的模板页
- [ ] 不存在 thin content
- [ ] 不存在 doorway pages
- [ ] 同义关键词合并到同一个 canonical
- [ ] 多语言页面不是直接机器翻译，已按目标语言本地化关键词、标题、首段、H2 和 FAQ
- [ ] 多语言页面 canonical、hreflang、sitemap 和页面语言一致
- [ ] 多语言重复按钮文案只加载当前语言需要的 CSS 或 i18n 文案
- [ ] 低质量程序化页面 noindex
- [ ] sitemap 只包含高质量 index 页面
- [ ] 不存在夸张承诺或无法证实的绝对化表达
- [ ] AI 内容经过人工检查
- [ ] AI 图片或动画没有替代正文内容

## 模板改造检查

- [ ] 已确认保留哪些模板页面
- [ ] 已确认改造哪些模板页面
- [ ] 已确认删除或 noindex 哪些模板页面
- [ ] 已复用模板现有组件
- [ ] 已保持样式系统一致
- [ ] 未引入无必要的大规模重构
- [ ] 每个核心页面格局已和用户确认

## 上线当天

- [ ] 提交 Google Search Console
- [ ] 确认使用的是正确的 GSC 属性类型和正式域名
- [ ] 提交 sitemap
- [ ] 请求索引首页
- [ ] 请求索引核心页面
- [ ] 提交 Bing Webmaster Tools
- [ ] 记录上线时间
- [ ] 更新 SEO_LOG.md

## 上线后一周

- [ ] 检查 GSC 是否发现 sitemap
- [ ] 检查首页是否收录
- [ ] 检查核心页面是否被发现
- [ ] 检查 404 / 5xx
- [ ] 检查 robots / canonical 报错
- [ ] 检查 title / description 覆盖情况
- [ ] 根据初始数据更新 SEO_LOG.md
