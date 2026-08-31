# TECH_RULES.md · 项目技术适配层

> 兼容说明：通用技术、SEO、内容、性能和发布规则统一以 [RULES.md](RULES.md) v2.1 为准；质量判定与证据格式见 [QUALITY_STANDARD.md](QUALITY_STANDARD.md)。本文件只记录 MySquareFaceIcon 的技术不变量，避免旧版规则重复和漂移。

## 当前技术边界

- 保持 Next.js 14 App Router、React 18、TypeScript 和现有 CSS 体系；没有用户批准不得更换框架或做无关大重构。
- 生产目标为 Cloudflare Workers + OpenNext；框架 build 与 `npm run cf:build` 是两个独立门禁（OP-09）。
- Square/Oval 使用本地 SWF + Ruffle；不得反编译或修改 SWF。
- Ruffle/WASM/SWF 必须 click-to-load，首次页面加载不得请求这些资源。
- Pixel 页面保持 external-link 类型；不得代理、镜像或 iframe 绕过原站限制。
- 已发布 URL、canonical 与 index 状态必须由明确数据或页面计划控制，不得散落式改名。

## 开发前检查

- 阅读 `package.json`、路由、组件、样式、metadata、sitemap、robots、数据来源、构建命令和当前 git 状态。
- 对照权威 HTML 看板只执行当前任务；保护用户已有未提交改动。
- 新页面、首屏重排、URL/index/search-intent 变化或核心模块重排，先提交页面布局/SEO/交互方案并取得用户确认。
- 新增或迁移游戏前读取 `data/game-license-registry.json`；`UNKNOWN` 权利不允许被自动提升为可发布或可商业使用。

## SEO 与页面实现

- Metadata、canonical、sitemap、robots、schema：IDX-01～IDX-12、META-01～META-09。
- 关键词只执行 KW-01～KW-07 和 KW-10～KW-16；旧 `3%-5%` 密度目标、`primaryKeywordDensity` 发布门禁和 CSS `content` 调词方案已经废除。
- 页面数据层如需质量字段，使用 `RULES.md` 附录 D；`qualityScore` 必须按附录 A 计算，不能自创算法。
- 内容无需执行客户端 JavaScript 即可被搜索引擎理解（PF-02）；图片执行 PF-03，移动端执行 PF-05。
- 交互控件保留真实可见文案和可访问名称（AY-01～AY-03）；不得为了 SEO 隐藏按钮文字。

## 发布证据

按变更范围执行并记录：

```text
npm run lint
npm run build
npm run cf:build
npm run seo:check   # 本地 production build 运行时
npm run seo:prod    # 仅在授权部署后
```

- 项目没有 test 脚本时写“未验证/不可用”，不能写通过。
- 任一 P0 失败时全局发布状态为“不通过”，即使当前文档或功能任务已实现。
- 未取得用户明确验收前不得把看板任务标为已完成，不得推送 `main` 或部署。
