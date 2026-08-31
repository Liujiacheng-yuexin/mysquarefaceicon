# scripts · 自动检查

两个零依赖脚本，需 Node 18+。验证 `RULES.md` 中标记 `⚙` 和 `🌐` 的规则。

**存在的意义**：规范里能自动验证的规则，就不要靠 Agent 自述「已检查」。

---

## seo-check.mjs · 构建期检查

对本地开发/预览服务器运行。从 `robots.txt` 找到 sitemap，抓取全部 URL，构建站内链接图，逐项验证。

```bash
node scripts/seo-check.mjs --base http://localhost:3000
```

| 选项 | 说明 |
|---|---|
| `--base <url>` | 站点根地址（必填） |
| `--config <path>` | 配置文件，默认 `seo-check.config.json` |
| `--json` | 输出 JSON 报告 |
| `--max <n>` | 最多检查 n 个 URL（大站调试用） |
| `--concurrency <n>` | 并发数，默认 8 |

**退出码**：存在「必须」级失败为 `1`，否则 `0`。

### 覆盖的规则

| 分类 | 规则 |
|---|---|
| 索引控制 | `IDX-01` canonical 存在 · `IDX-02` 自引用 · `IDX-03` sitemap 无 noindex · `IDX-04` 生产域名 · `IDX-05` 不 canonical 到首页 / 无重复目标 · `IDX-06` sitemap URL 可访问 · `IDX-07` robots 声明 sitemap · `IDX-08` sitemap 体积 |
| 元数据 | `META-01/02` TDK 唯一 · `META-03/04` 长度 · `META-05` 单 H1 |
| 关键词 | `KW-01` 位置覆盖 · `KW-02` 出现次数 · `KW-03` 密度报警 |
| 内链 | `LINK-01` 孤岛页面 · `LINK-02` 核心页入链数 · `LINK-03` 出链数 · `LINK-08` 站内死链 |
| 多语言 | `I18-03` 自引用 · `I18-04` x-default · `I18-05` 语言码格式 |
| 性能 | `PF-02` 非客户端渲染 · `PF-03` 图片 alt / 尺寸 |
| 可访问性 | `AY-01` 按钮可访问名称 · `AY-02` 表单 label |
| URL | `IA-04` 格式 · `IA-07` 点击深度 |

### 配置文件

项目根目录创建 `seo-check.config.json`：

```json
{
  "prodDomain": "https://example.com",
  "corePages": ["/", "/tool", "/guide"],
  "keywords": {
    "/": "ai image generator",
    "/tool": "background remover",
    "/guide": "how to remove background"
  },
  "ignore": ["/admin", "/api"],
  "titleMin": 20, "titleMax": 60,
  "descMin": 110, "descMax": 160
}
```

| 字段 | 作用 |
|---|---|
| `prodDomain` | 生产域名。用于 `IDX-04` 精确比对 canonical。**本地开发时也要填生产域名**——canonical 本来就应该指向生产域 |
| `corePages` | 核心页面路径。用于 `LINK-02`（入链 ≥5）和 `IA-07`（点击深度 ≤3） |
| `keywords` | 路径 → 主关键词。**不配置就跳过全部 KW 检查**，所以这一项要认真填 |
| `ignore` | 跳过的路径前缀 |

### 脚本不检查什么

语义类规则需要人工判断，脚本不会假装检查：

- `KW-04` 语义覆盖率
- `CT-05` 本页独有内容
- `IA-02` 搜索意图是否真的独立
- `TR-03~08` 作者与来源的真实性
- `PF-01` Core Web Vitals 实测值

脚本用正则解析 HTML，不是完整解析器。它可靠地捕捉结构化问题，
但极端畸形的 HTML 可能漏判。

---

## post-deploy-check.mjs · 生产环境回归

**每次部署后运行**（`OP-02`）。比 `seo-check` 轻量，只做关键断言。

```bash
node scripts/post-deploy-check.mjs --base https://example.com
node scripts/post-deploy-check.mjs --base https://example.com --sample 20
```

### 断言内容

- `IDX-07` robots.txt 可访问、未全站封禁、声明的 sitemap 指向生产域名
- `IDX-06` sitemap 可访问且含 URL，URL 均指向生产域名
- `IDX-12` **抽样页面无 noindex**（超过半数带 noindex 时输出「立即回滚」告警）
- `IDX-01/04` canonical 存在且指向生产域名
- `OP-03` HTTP → HTTPS 为 301 且无多跳重定向链
- `META-08` 首页 og:image 可访问

### 为什么它比上线清单更重要

最灾难且最常见的 SEO 事故不是规划失误，而是：

- 某次部署把预发环境的 `noindex` 带上了线
- 环境变量没配好，canonical 全部指向 `xxx.vercel.app`
- 中间件或 CDN 规则误拦了 `/robots.txt`

这类事故的共同点是**静默**——网站看起来完全正常，三周后才在 GSC 发现流量塌了。
人工清单挡不住（谁会在每次部署后手动查一遍 canonical），只有自动断言可以。

---

## 接入 CI

### package.json

```json
{
  "scripts": {
    "seo:check": "node scripts/seo-check.mjs --base http://localhost:3000",
    "seo:prod": "node scripts/post-deploy-check.mjs --base https://example.com"
  }
}
```

### GitHub Actions

```yaml
- name: Build
  run: npm run build

- name: Start server
  run: npm start &

- name: Wait for server
  run: npx wait-on http://localhost:3000 -t 60000

- name: SEO check
  run: npm run seo:check
```

部署后：

```yaml
- name: Post-deploy SEO regression
  run: npm run seo:prod
```

### 本地最低要求

不接 CI 也至少要在**交付前**手动跑一次 `seo-check`，
并在交付报告中附上输出。必须级失败未清零就交付 = 未完成。

---

## 常见问题

**sitemap 是动态生成的，本地跑不起来？**
先 `npm run build && npm start`，对生产构建跑，不要对 dev server 跑。

**报了一堆 `PF-02 主内容区仅 N 词`？**
说明页面是客户端渲染的空壳。这是真问题（`PF-02` 是必须级）。
如果是误报——例如内容确实在 `<main>` 外——调整页面语义结构，
脚本按 `<main>` → `<article>` → `<body>` 的顺序取主内容区。

**`KW-*` 全部没有输出？**
`seo-check.config.json` 的 `keywords` 没配。不配就跳过。

**`IDX-04` 报 canonical 域名不匹配？**
本地开发时 canonical 应该已经指向生产域名。如果你的框架在开发环境
输出 `localhost` 的 canonical，那本身就是配置问题——上线后很可能出事。
