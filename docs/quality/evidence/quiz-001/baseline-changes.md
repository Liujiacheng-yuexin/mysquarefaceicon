# QUIZ-001 基线与夹具变更说明

基线提交：`1d275c678a1e15170a8e836b2c540ab3c68ea8f6`。旧夹具未覆盖、未删除；新文件 `scripts/fixtures/friend-quiz-approved-delta.json` 保存本任务的精确变更、前后 SHA-256 和定位标记。每次校验先核对当前完整源码哈希，只逆向这一份已审查增量。新增行为直接测试当前源码及实际浏览器，不能用逆向视图证明新功能通过。

| 文件 | 必要原因 |
|---|---|
| `app/games/[slug]/page.tsx` | 仅批准记录可索引，sitemap/metadata/检查共享此边界 |
| `app/globals.css` | 仅新增测验范围样式；旧首屏规则保留 |
| `app/layout.tsx` | 仅对测验入口提供第三方脚本、文档导航和响应头隔离 |
| `app/sitemap.ts` | 仅批准记录可索引，sitemap/metadata/检查共享此边界 |
| `app/privacy-policy/page.tsx` | 披露本机成绩、链接内容与清除范围，保留旧权利文案 |
| `app/terms-of-service/page.tsx` | 披露本机成绩、链接内容与清除范围，保留旧权利文案 |
| `components/DeferredThirdPartyScripts.tsx` | 仅对测验入口提供第三方脚本、文档导航和响应头隔离 |
| `components/game-player/adapters/Html5Adapter.tsx` | 复用 HTML5 适配器，限定该记录传递片段与动态高度 |
| `components/game/GameDetailTemplate.tsx` | 新增测验专用启动按钮，保留片段；其它页头默认输出保持 |
| `components/game/GameLink.tsx` | 仅对测验入口提供第三方脚本、文档导航和响应头隔离 |
| `lib/seo/game-metadata.ts` | 仅批准记录可索引，sitemap/metadata/检查共享此边界 |
| `lib/games/catalog.ts` | 只登记一个新游戏与一个新分类 |
| `data/game-categories.ts` | 只登记一个新游戏与一个新分类 |
| `data/game-license-registry.json` | 只追加项目原创实现记录；旧三条事实完全保留 |
| `data/game-asset-manifest.json` | 增加 13 项本地文件与显式 no-transform 策略，旧 10 项资产不改 |
| `package.json` | 新增 quiz:check；无依赖变更 |
| `next.config.mjs` | 仅对测验入口提供第三方脚本、文档导航和响应头隔离 |
| `scripts/banner-worker-policy.mjs` | 仅对测验入口提供第三方脚本、文档导航和响应头隔离 |
| `scripts/validate-game-data.ts` | 真实库存从 3 到 4、分类从 5 到 6；保留全部旧行为与失败关闭断言 |
| `scripts/validate-game-metadata.ts` | 增加实际新路由和精确索引白名单正反例 |
| `scripts/validate-game-routes.ts` | 增加实际新路由和精确索引白名单正反例 |
| `scripts/check-terms-rights.mjs` | 新增本地成绩说明后保留全部旧条款断言与反例 |
| `scripts/check-oval-legacy-page.mjs` | 修复原有逆向链尾部 CRLF/LF 不一致；旧 golden 不变 |
| `scripts/check-discord-banner.mjs` | 保留 977 断言；先逆向本任务变更，再对实际旧片段施加原有反例 |
| `scripts/validate-home-information-architecture.tsx` | 真实库存从 3 到 4、分类从 5 到 6；保留全部旧行为与失败关闭断言 |
| `scripts/validate-home-discovery.tsx` | 真实库存从 3 到 4、分类从 5 到 6；保留全部旧行为与失败关闭断言 |
| `scripts/validate-related-games.ts` | 真实库存从 3 到 4、分类从 5 到 6；保留全部旧行为与失败关闭断言 |
| `scripts/validate-recently-played.tsx` | 真实库存从 3 到 4、分类从 5 到 6；保留全部旧行为与失败关闭断言 |
| `scripts/validate-favorites.tsx` | 真实库存从 3 到 4、分类从 5 到 6；保留全部旧行为与失败关闭断言 |
| `scripts/validate-game-template.tsx` | 真实库存从 3 到 4、分类从 5 到 6；保留全部旧行为与失败关闭断言 |
| `scripts/check-games-index.mjs` | 真实库存从 3 到 4、分类从 5 到 6；保留全部旧行为与失败关闭断言 |
| `scripts/check-category-sample.mjs` | 增加第六分类的真实断言；仅精确逆向新增导航 chip 后比较旧 HTML |
| `scripts/check-category-remaining.mjs` | 增加第六分类的真实断言；仅精确逆向新增导航 chip 后比较旧 HTML |
| `seo-check.config.json` | 仅批准记录可索引，sitemap/metadata/检查共享此边界 |
| `wrangler.toml` | 唯一新增 HTML 文件禁用静态 HTML 路径规范化，避免入口抢占详情页；无新 binding |
| `lib/games/game-asset-schema.ts` | 显式登记 no-transform；仅允许 Workers 额外的 must-revalidate，拒绝 TTL 改变、缺失隐私指令或其它额外缓存指令 |
| `scripts/validate-game-assets.ts` | 显式登记 no-transform；仅允许 Workers 额外的 must-revalidate，拒绝 TTL 改变、缺失隐私指令或其它额外缓存指令 |
| `components/SiteHeader.tsx` | 新增测验专用启动按钮，保留片段；其它页头默认输出保持 |

`quiz:check` 对 38 份当前源码逐一匹配，并拒绝 76 份无关修改反例。Category 的旧 HTML 仅移除逐字匹配的一条 Friend Quizzes 导航 chip；实际目录的四条记录、六分类、新页 noindex/index 和广告隔离另有真实断言。

新增 `.gitattributes` 仅锁定本游戏 HTML/CSS/MJS 的 LF 及 WebP 的二进制模式，以免 Windows/CI 换行转换破坏字节清单。未修改 package-lock、SWF、原有 GameRecord、旧 Registry 记录或旧资产条目。
