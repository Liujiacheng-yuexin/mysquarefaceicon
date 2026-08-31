# LAUNCH_CHECKLIST.md · v2.1 证据清单

> 每一项都要填写证据，不是只打勾。通用规则以 [RULES.md](RULES.md) 为唯一来源，P0 状态按 [QUALITY_STANDARD.md](QUALITY_STANDARD.md) 判定。
>
> 项目：`mysquarefaceicon.com`
>
> 规范版本：`2026-08-31 / v2.1`

## 0. 当前已知发布阻断

| 状态 | 规则 | 当前证据 |
|---|---|---|
| P0 | OP-09 | `app/sitemap.ts` 现有语法损坏，lint/build 失败 |
| P0 | OP-11 | HTTP 根路径返回 200，没有一跳跳转 HTTPS |
| P0 | PF-01 | 2026-08-31 移动 Lighthouse LCP 4.6s；CrUX 数据不足 |

这些阻断关闭并完整重跑前，发布状态必须保持“不通过”。

## 1. 自动检查

```powershell
npm run lint
npm run build
npm run cf:build
# 有可运行的本地 production build 后：
npm run seo:check
```

| 项 | 规则 | 结果/证据 |
|---|---|---|
| `seo-check` 必须级失败数为 0 | — | |
| `seo-check` 应该级提醒逐项处置 | — | |
| type-check 通过 | OP-09 | |
| lint 0 error；warning 有基线 | OP-09 | |
| 必需单元/集成/浏览器测试通过 | OP-09 | |
| Next.js build 通过 | OP-09 | |
| Cloudflare/OpenNext 等效 build 通过 | OP-09 | |
| 所有子进程有超时、日志和明确退出码 | OP-10 | |

应该级提醒：

| 规则 ID | URL | 提醒 | 处置/不处理理由 |
|---|---|---|---|
| | | | |

## 2. 页面与内容人工验证

| 项 | 规则 | 证据 |
|---|---|---|
| 每个 index 页面有独立搜索意图 | IA-02、CT-01 | |
| 每页至少一项独有内容 | CT-05 | |
| 不存在 thin、near-duplicate、doorway | CT-02 | |
| KW-01 五个位置覆盖 | KW-01 | |
| 主词或变体正文至少出现 3 次 | KW-02 | |
| KW-03 无高密度报警，或已人工复核 | KW-03、KW-05 | |
| 语义覆盖率至少 70% | KW-04 | |
| 新增关键词文案为增量补强 | KW-10～KW-16 | |
| 无编造来源、许可、数据或热度 | CT-03、TR-07 | |
| AI 内容已人工检查 | CT-06 | |

旧 `3%-5%` 密度目标和 CSS `content` 调词方案已废除，不得作为证据。

## 3. 索引、Metadata 与内链

| 项 | 规则 | 证据 |
|---|---|---|
| index 页 canonical 正确且自引用 | IDX-01、IDX-02 | |
| canonical 使用正式域名 | IDX-04 | |
| sitemap 只含唯一、200、index、规范 URL | IDX-03、IDX-06 | |
| robots 声明 sitemap 且未封核心资源 | IDX-07 | |
| title/description 唯一 | META-01、META-02 | |
| 单一 H1 | META-05 | |
| schema 与可见内容一致 | META-06 | |
| schema 已检查原始 HTML 与水合浏览器 | META-09 | |
| 每个 index 页至少 1 条站内入链 | LINK-01 | |
| 核心页至少 5 条相关入链，或说明差距 | LINK-02 | |
| 内容页至少 2 条相关出链 | LINK-03 | |
| 首页到核心页点击深度不超过 3 | IA-07 | |

## 4. 游戏、来源与权利

| 项 | 规则/门禁 | 证据 |
|---|---|---|
| 所有公开游戏进入 License Registry | 项目 P0 | |
| 来源、作者/权利人、许可状态和证据 URL 已记录 | CT-03、TR-07 | |
| `UNKNOWN` 未被当成 Allowed | 项目 P0 | |
| External Tool 明确标记外部来源 | 项目决策 | |
| 未代理、镜像、iframe 或直链原站受限资源 | 项目决策 | |
| 未反编译或修改 Square/Oval SWF | 项目不变量 | |
| 首载没有 Ruffle/WASM/SWF | PF-06、项目不变量 | |

## 5. 性能、移动端与可访问性

| 指标 | 阈值 | 实测值 | URL/证据 |
|---|---:|---:|---|
| LCP | ≤2.5s | | |
| INP | ≤200ms | | |
| CLS | ≤0.1 | | |

| 项 | 规则 | 证据 |
|---|---|---|
| 嵌入、播放器和广告位预留稳定尺寸 | PF-04 | |
| 移动端无横向滚动 | PF-05 | |
| 至少检查 390px 与桌面视口 | — | |
| 所有控件有可访问名称 | AY-01 | |
| 表单有 label | AY-02 | |
| 键盘可完成核心流程 | AY-03 | |
| 正文对比度符合目标 | AY-04 | |
| FAQ 可见且存在于 DOM | AY-06 | |

## 6. 多语言

| 项 | 规则 | 证据 |
|---|---|---|
| 各语言独立关键词调研，非直译 | I18-07 | |
| 各语言分别执行 KW-04 | KW-04 | |
| 未人工编辑页面保持 noindex | I18-08 | |
| hreflang 双向、自引用并有唯一 x-default | I18-02～I18-04 | |
| 页面语言、canonical、schema、OG 一致 | I18-01、I18-10 | |

## 7. 信任、隐私、广告与 AI 搜索

| 项 | 规则 | 证据 |
|---|---|---|
| About、Contact、Privacy、Editorial/Disclaimer 完整 | TR-01、TR-02 | |
| 公开数据、广告与隐私承诺符合真实行为 | TR-10 | |
| 引用外部数据与许可有可访问来源 | TR-07 | |
| AdSense Ready 未被当作全站质量认证 | AD-06 | |
| `/ads.txt` 可达且 publisher ID 可核对 | AD-01 | |
| 广告仅加载在允许的完整公开页 | AD-02 | |
| 广告位预留尺寸并在真实填充下测 CWV | AD-03、PF-01、PF-04 | |
| 所需地区 CMP 已验证接受/拒绝/撤回 | AD-05 | |
| AI crawler 已逐项显式决定并写入 PROJECT_BRIEF | AI-01 | |

## 8. 规范域与发布证据链

| 项 | 规则 | 证据 |
|---|---|---|
| HTTP/HTTPS、www/非 www、旧域一跳归一 | OP-11 | |
| Change Log 已更新 | OP-05 | |
| commit、push、部署版本可对应 | OP-12 | |
| 回滚条件与步骤可执行 | OP-12 | |
| P0 阻断为 0 | QUALITY_STANDARD | |

授权部署后执行：

```powershell
npm run seo:prod
```

生产验收必须记录 robots、sitemap、canonical、核心 URL/404、游戏启动、移动视口、广告/隐私边界和部署版本。没有部署授权时写“未部署”，不得运行写入型外部操作。

## 9. 上线当天

| 项 | 规则 | 时间/证据 |
|---|---|---|
| 使用正确域名属性验证 GSC | OP-01 | |
| 提交 sitemap | OP-01 | |
| 请求索引首页与核心页 | OP-01 | |
| 提交 Bing Webmaster Tools | OP-06 | |
| 运行生产 `post-deploy-check` | OP-02 | |
| 更新 `SEO_LOG.md` | OP-05 | |

## 10. 上线后一周

| 项 | 规则 | 结果 |
|---|---|---|
| GSC 是否发现 sitemap | OP-07 | |
| 首页与核心页是否被发现/索引 | OP-07 | |
| 404/5xx、robots、canonical 报错 | OP-07 | |
| 已抓取尚未编入索引的 URL | OP-07 | |
| 游戏加载错误与外部链接状态 | 项目监控 | |
| 根据真实数据更新 `SEO_LOG.md` | OP-05 | |
