#!/usr/bin/env node
/**
 * seo-check.mjs · 构建期 SEO 规则自动检查
 *
 * 验证 RULES.md 中标记 ⚙ 的规则。零依赖，需 Node 18+。
 *
 *   node scripts/seo-check.mjs --base http://localhost:3000
 *   node scripts/seo-check.mjs --base http://localhost:3000 --config seo-check.config.json
 *   node scripts/seo-check.mjs --base http://localhost:3000 --json > seo-report.json
 *
 * 退出码：存在「必须」级失败时为 1，否则 0。可直接挂进 CI。
 *
 * 说明：本脚本用正则解析 HTML，不是完整解析器。它能可靠捕捉规范中
 * 结构化的、机器可判定的问题；语义类规则（KW-04 语义覆盖、CT-05 独有内容）
 * 仍需人工判断，脚本不会假装检查它们。
 */

import { readFileSync, existsSync } from 'node:fs';

// ---------------------------------------------------------------- 参数解析

function parseArgs(argv) {
  const args = { base: '', config: 'seo-check.config.json', json: false, max: 0, concurrency: 8 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base') args.base = argv[++i];
    else if (a === '--config') args.config = argv[++i];
    else if (a === '--json') args.json = true;
    else if (a === '--max') args.max = Number(argv[++i]);
    else if (a === '--concurrency') args.concurrency = Number(argv[++i]);
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
  }
  return args;
}

function printHelp() {
  console.log(`
seo-check.mjs · 构建期 SEO 规则检查

用法:
  node scripts/seo-check.mjs --base <url> [选项]

选项:
  --base <url>          站点根地址，例如 http://localhost:3000  (必填)
  --config <path>       配置文件，默认 seo-check.config.json
  --json                输出 JSON 报告而非文本
  --max <n>             最多检查 n 个 URL（大站调试用）
  --concurrency <n>     并发请求数，默认 8

配置文件示例 (seo-check.config.json):
{
  "prodDomain": "https://example.com",
  "corePages": ["/", "/tool", "/guide"],
  "keywords": { "/": "ai image generator", "/tool": "background remover" },
  "ignore": ["/admin", "/api"],
  "titleMax": 60, "titleMin": 20,
  "descMax": 160, "descMin": 110
}
`);
}

// ---------------------------------------------------------------- 报告收集

const RULE_LEVEL = {
  'IA-04': '应该', 'IA-07': '应该',
  'IDX-01': '必须', 'IDX-02': '必须', 'IDX-03': '必须', 'IDX-04': '必须',
  'IDX-05': '必须', 'IDX-06': '必须', 'IDX-07': '必须', 'IDX-08': '应该',
  'META-01': '必须', 'META-02': '必须', 'META-03': '应该', 'META-04': '应该', 'META-05': '应该',
  'KW-01': '必须', 'KW-02': '必须', 'KW-03': '应该',
  'LINK-01': '必须', 'LINK-02': '应该', 'LINK-03': '应该', 'LINK-08': '必须',
  'I18-01': '必须', 'I18-02': '必须', 'I18-03': '必须', 'I18-04': '必须', 'I18-05': '必须',
  'PF-02': '必须', 'PF-03': '必须',
  'AY-01': '必须', 'AY-02': '必须',
  'PS-04': '必须',
};

const findings = [];
function report(rule, url, message) {
  findings.push({ rule, level: RULE_LEVEL[rule] ?? '应该', url, message });
}

// ---------------------------------------------------------------- HTML 解析

const stripComments = (h) => h.replace(/<!--[\s\S]*?-->/g, '');

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? (m[2] ?? m[3] ?? m[4] ?? '').trim() : null;
}

function parseHtml(html) {
  const h = stripComments(html);
  const headMatch = h.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const head = headMatch ? headMatch[1] : h;

  const titleM = h.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleM ? decodeEntities(titleM[1]).trim() : null;

  const metaTags = head.match(/<meta\b[^>]*>/gi) || [];
  let description = null, robots = null;
  for (const t of metaTags) {
    const n = (attr(t, 'name') || attr(t, 'property') || '').toLowerCase();
    if (n === 'description') description = decodeEntities(attr(t, 'content') || '').trim();
    if (n === 'robots') robots = (attr(t, 'content') || '').toLowerCase();
  }

  const linkTags = head.match(/<link\b[^>]*>/gi) || [];
  let canonical = null;
  const hreflangs = [];
  for (const t of linkTags) {
    const rel = (attr(t, 'rel') || '').toLowerCase();
    if (rel === 'canonical') canonical = attr(t, 'href');
    if (rel === 'alternate' && attr(t, 'hreflang')) {
      hreflangs.push({ lang: attr(t, 'hreflang'), href: attr(t, 'href') });
    }
  }

  const h1s = [...h.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const h2s = [...h.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => stripTags(m[1]));

  const anchors = [...h.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((m) => ({
    href: attr('<a ' + m[1] + '>', 'href'),
    text: stripTags(m[2]),
    rel: (attr('<a ' + m[1] + '>', 'rel') || '').toLowerCase(),
  }));

  const images = (h.match(/<img\b[^>]*>/gi) || []).map((t) => ({
    src: attr(t, 'src') || attr(t, 'data-src') || '',
    alt: attr(t, 'alt'),
    width: attr(t, 'width'),
    height: attr(t, 'height'),
  }));

  const buttons = [...h.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)].map((m) => ({
    text: stripTags(m[2]),
    ariaLabel: attr('<button ' + m[1] + '>', 'aria-label'),
    ariaLabelledby: attr('<button ' + m[1] + '>', 'aria-labelledby'),
    title: attr('<button ' + m[1] + '>', 'title'),
  }));

  const inputs = (h.match(/<(input|select|textarea)\b[^>]*>/gi) || [])
    .filter((t) => {
      const type = (attr(t, 'type') || '').toLowerCase();
      return !['hidden', 'submit', 'button', 'reset', 'image'].includes(type);
    })
    .map((t) => ({
      id: attr(t, 'id'),
      ariaLabel: attr(t, 'aria-label'),
      ariaLabelledby: attr(t, 'aria-labelledby'),
      title: attr(t, 'title'),
    }));

  const labelFor = new Set(
    [...h.matchAll(/<label\b([^>]*)>/gi)].map((m) => attr('<label ' + m[1] + '>', 'for')).filter(Boolean)
  );

  return {
    title, description, robots, canonical, hreflangs,
    h1s, h2s, anchors, images, buttons, inputs, labelFor,
    mainText: extractMainText(h),
    rawLength: h.length,
  };
}

function stripTags(s) { return decodeEntities(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim(); }

function robotsBlocksAllUserAgents(body) {
  const groups = [];
  let agents = [], rules = [], hasRules = false;
  const flush = () => {
    if (agents.length) groups.push({ agents, rules });
    agents = []; rules = []; hasRules = false;
  };

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) continue;
    const directive = match[1].trim().toLowerCase();
    const value = match[2].trim();

    if (directive === 'user-agent') {
      if (hasRules) flush();
      agents.push(value.toLowerCase());
      continue;
    }
    if (agents.length && (directive === 'allow' || directive === 'disallow')) {
      rules.push({ directive, value });
      hasRules = true;
    }
  }
  flush();

  const wildcardRules = groups
    .filter((group) => group.agents.includes('*'))
    .flatMap((group) => group.rules);
  const rootDisallowed = wildcardRules.some((rule) => rule.directive === 'disallow' && rule.value === '/');
  const rootAllowed = wildcardRules.some((rule) => rule.directive === 'allow' && rule.value === '/');
  return rootDisallowed && !rootAllowed;
}

function decodeEntities(s) {
  return String(s)
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
}

/** 提取主内容区文本：优先 <main>/<article>，否则 body 去掉导航、页脚、脚本 */
function extractMainText(html) {
  let scope =
    html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ??
    html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] ??
    html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ??
    html;

  scope = scope
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<aside[\s\S]*?<\/aside>/gi, ' ');

  return stripTags(scope);
}

const CJK = /[一-鿿぀-ヿ가-힯]/g;

/** 词数估算：拉丁按空格分词；CJK 按字符数 / 1.5 折算 */
function countWords(text) {
  const cjkCount = (text.match(CJK) || []).length;
  const latin = text.replace(CJK, ' ').split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;
  return latin + Math.round(cjkCount / 1.5);
}

function countPhrase(text, phrase) {
  if (!phrase) return 0;
  const esc = phrase.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  const hasCjk = CJK.test(phrase); CJK.lastIndex = 0;
  const re = new RegExp(hasCjk ? esc : `\\b${esc}\\b`, 'gi');
  return (text.match(re) || []).length;
}

// ---------------------------------------------------------------- URL 工具

function normalize(u, base) {
  try {
    const url = new URL(u, base);
    url.hash = '';
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) url.pathname = url.pathname.slice(0, -1);
    return url.href;
  } catch { return null; }
}

const sameOrigin = (u, base) => { try { return new URL(u).origin === new URL(base).origin; } catch { return false; } };
const pathOf = (u) => { try { return new URL(u).pathname || '/'; } catch { return u; } };

// ---------------------------------------------------------------- 网络

async function get(url, { method = 'GET' } = {}) {
  try {
    const res = await fetch(url, { method, redirect: 'follow', headers: { 'user-agent': 'seo-check/2.0' } });
    const ct = res.headers.get('content-type') || '';
    const body = method === 'GET' && /text|xml|json|html/i.test(ct) ? await res.text() : '';
    return { ok: res.ok, status: res.status, url: res.url, body, headers: res.headers };
  } catch (e) {
    return { ok: false, status: 0, url, body: '', headers: new Headers(), error: e.message };
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  }));
  return out;
}

// ---------------------------------------------------------------- sitemap

async function collectSitemapUrls(sitemapUrl, seen = new Set()) {
  if (seen.has(sitemapUrl)) return { urls: [], sitemaps: [] };
  seen.add(sitemapUrl);

  const res = await get(sitemapUrl);
  if (!res.ok) {
    report('IDX-06', sitemapUrl, `sitemap 不可访问（HTTP ${res.status}）`);
    return { urls: [], sitemaps: [] };
  }

  const bytes = Buffer.byteLength(res.body, 'utf8');
  const isIndex = /<sitemapindex/i.test(res.body);
  const locs = [...res.body.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((m) => decodeEntities(m[1]).trim());

  if (isIndex) {
    const nested = await Promise.all(locs.map((l) => collectSitemapUrls(l, seen)));
    return {
      urls: nested.flatMap((n) => n.urls),
      sitemaps: [{ url: sitemapUrl, count: locs.length, bytes }, ...nested.flatMap((n) => n.sitemaps)],
    };
  }

  const hasLastmod = /<lastmod>/i.test(res.body);
  return { urls: locs, sitemaps: [{ url: sitemapUrl, count: locs.length, bytes, hasLastmod }] };
}

// ---------------------------------------------------------------- 主流程

async function main() {
  const args = parseArgs(process.argv);
  if (!args.base) { console.error('错误：缺少 --base。用 --help 查看用法。'); process.exitCode = 2; return; }
  const base = args.base.replace(/\/$/, '');

  const cfg = existsSync(args.config) ? JSON.parse(readFileSync(args.config, 'utf8')) : {};
  // 占位值视为未配置，否则每个页面都会误报 IDX-04
  if (cfg.prodDomain && /请填写|example\.com/.test(cfg.prodDomain)) {
    console.error(`提示：seo-check.config.json 的 prodDomain 仍是占位值（${cfg.prodDomain}），IDX-04 精确比对已跳过。`);
    cfg.prodDomain = '';
  }
  const placeholderKw = Object.entries(cfg.keywords || {}).filter(([, v]) => /请填写/.test(v));
  if (placeholderKw.length) {
    console.error(`提示：${placeholderKw.length} 个页面的 keywords 仍是占位值，对应 KW-* 检查已跳过：${placeholderKw.map(([k]) => k).join(', ')}`);
    for (const [k] of placeholderKw) delete cfg.keywords[k];
  }

  const conf = {
    prodDomain: cfg.prodDomain || '',
    corePages: cfg.corePages || ['/'],
    keywords: cfg.keywords || {},
    ignore: cfg.ignore || [],
    titleMin: cfg.titleMin ?? 20, titleMax: cfg.titleMax ?? 60,
    descMin: cfg.descMin ?? 110, descMax: cfg.descMax ?? 160,
  };

  // --- IDX-07 robots.txt --------------------------------------------------
  const robotsRes = await get(`${base}/robots.txt`);
  let sitemapUrls = [];
  if (!robotsRes.ok) {
    report('IDX-07', `${base}/robots.txt`, `robots.txt 不可访问（HTTP ${robotsRes.status}）`);
  } else {
    const declared = [...robotsRes.body.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]);
    if (declared.length === 0) report('IDX-07', `${base}/robots.txt`, 'robots.txt 未声明 sitemap');
    sitemapUrls = declared;

    if (robotsBlocksAllUserAgents(robotsRes.body)) {
      report('IDX-07', `${base}/robots.txt`, '⚠️ robots.txt 对所有 UA 声明了 Disallow: /（全站封禁）');
    }
    // AI-01 提示（不计入失败，仅提醒显式声明）
    const aiBots = ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];
    const missing = aiBots.filter((b) => !new RegExp(`user-agent:\\s*${b}`, 'i').test(robotsRes.body));
    if (missing.length === aiBots.length) {
      console.error(`提示 · AI-01：robots.txt 未对任何 AI 爬虫做显式声明。RULES.md 要求显式选择，缺省状态不被接受。`);
    }
  }

  if (sitemapUrls.length === 0) sitemapUrls = [`${base}/sitemap.xml`];

  // --- 收集 sitemap URL ---------------------------------------------------
  let allUrls = [];
  const sitemapStats = [];
  for (const sm of sitemapUrls) {
    const { urls, sitemaps } = await collectSitemapUrls(normalize(sm, base) || sm);
    allUrls.push(...urls);
    sitemapStats.push(...sitemaps);
  }

  for (const s of sitemapStats) {
    if (s.count > 50000) report('IDX-08', s.url, `sitemap 含 ${s.count} 条 URL，超过 50,000 上限，需拆分为 sitemap index`);
    if (s.bytes > 50 * 1024 * 1024) report('IDX-08', s.url, `sitemap 未压缩体积 ${(s.bytes / 1048576).toFixed(1)}MB，超过 50MB 上限`);
  }

  allUrls = [...new Set(allUrls.map((u) => normalize(u, base)).filter(Boolean))]
    .filter((u) => !conf.ignore.some((ig) => pathOf(u).startsWith(ig)));

  if (allUrls.length === 0) { console.error('错误：sitemap 中没有可检查的 URL。'); process.exitCode = 2; return; }
  if (args.max > 0) allUrls = allUrls.slice(0, args.max);

  // sitemap 中的 URL 可能指向生产域名，检查时映射回 base
  const toLocal = (u) => { try { const a = new URL(u); const b = new URL(base); a.protocol = b.protocol; a.host = b.host; return a.href; } catch { return u; } };

  console.error(`正在检查 ${allUrls.length} 个 URL …`);

  // --- 抓取全部页面 -------------------------------------------------------
  const pages = new Map();
  await mapLimit(allUrls, args.concurrency, async (u) => {
    const res = await get(toLocal(u));
    if (!res.ok) { report('IDX-06', u, `sitemap 中的 URL 返回 HTTP ${res.status}`); return; }
    const doc = parseHtml(res.body);
    doc.xRobotsTag = (res.headers.get('x-robots-tag') || '').toLowerCase();
    pages.set(u, doc);
  });

  // --- 逐页检查 -----------------------------------------------------------
  const titleMap = new Map(), descMap = new Map(), canonicalTargets = new Map();
  const inbound = new Map(allUrls.map((u) => [u, new Set()]));
  const outbound = new Map();
  const externalLinkTargets = new Set();

  for (const [url, doc] of pages) {
    const p = pathOf(url);

    // IDX-03 · sitemap 中不得有 noindex
    const noindex = (doc.robots || '').includes('noindex') || doc.xRobotsTag.includes('noindex');
    if (noindex) report('IDX-03', url, 'sitemap 中的页面带有 noindex');

    // IDX-01/02/04/05 · canonical
    let canonicalToHome = false;
    if (!doc.canonical) {
      report('IDX-01', url, '缺少 canonical');
    } else {
      const can = normalize(doc.canonical, url);
      if (!/^https?:\/\//i.test(doc.canonical)) report('IDX-01', url, `canonical 应使用绝对 URL，当前为 "${doc.canonical}"`);
      if (conf.prodDomain) {
        const prodHost = new URL(conf.prodDomain).host;
        const canHost = (() => { try { return new URL(can).host; } catch { return ''; } })();
        if (canHost && canHost !== prodHost) report('IDX-04', url, `canonical 指向非生产域名 "${canHost}"，应为 "${prodHost}"`);
      }
      // 仅在未配置 prodDomain 时启用黑名单启发式，避免与上面的精确比对重复报警
      if (!conf.prodDomain && /localhost|127\.0\.0\.1|\.vercel\.app|\.netlify\.app|staging\.|preview\./i.test(can || '')) {
        report('IDX-04', url, `canonical 含预览/测试域名："${can}"（未配置 prodDomain，无法精确比对）`);
      }
      const canPath = pathOf(can || '');
      if (canPath !== p) {
        if (canPath === '/' && p !== '/') {
          report('IDX-05', url, 'canonical 指向首页（禁止）');
          canonicalToHome = true; // 已报警，下面不再计入重复目标统计
        } else {
          report('IDX-02', url, `canonical 未自引用：页面 ${p} → canonical ${canPath}`);
        }
      }
      if (!canonicalToHome) canonicalTargets.set(can, [...(canonicalTargets.get(can) || []), url]);
    }

    // META-01~04 · TDK
    if (!doc.title) report('META-01', url, '缺少 title');
    else {
      titleMap.set(doc.title, [...(titleMap.get(doc.title) || []), url]);
      const len = doc.title.length;
      if (len > conf.titleMax) report('META-03', url, `title ${len} 字符，超过建议上限 ${conf.titleMax}`);
      else if (len < conf.titleMin) report('META-03', url, `title 仅 ${len} 字符，短于建议下限 ${conf.titleMin}`);
    }
    if (!doc.description) report('META-02', url, '缺少 description');
    else {
      descMap.set(doc.description, [...(descMap.get(doc.description) || []), url]);
      const len = doc.description.length;
      if (len > conf.descMax) report('META-04', url, `description ${len} 字符，超过建议上限 ${conf.descMax}`);
      else if (len < conf.descMin) report('META-04', url, `description 仅 ${len} 字符，短于建议下限 ${conf.descMin}`);
    }

    // META-05 · H1
    if (doc.h1s.length === 0) report('META-05', url, '缺少 H1');
    else if (doc.h1s.length > 1) report('META-05', url, `存在 ${doc.h1s.length} 个 H1`);

    // IA-04 · URL 格式
    if (/[A-Z]/.test(p)) report('IA-04', url, 'URL 含大写字母');
    if (/_/.test(p)) report('IA-04', url, 'URL 使用下划线，应使用短横线');

    // PF-02 · 无 JS 可理解（双阈值：极少文本近乎确定是 CSR 空壳，中间区间仅提醒）
    const mainWords = countWords(doc.mainText);
    if (mainWords < 15) {
      report('PF-02', url, `原始 HTML 主内容区仅 ${mainWords} 词，核心内容几乎确定依赖客户端渲染`);
    } else if (mainWords < 50) {
      findings.push({ rule: 'PF-02', level: '应该', url, message: `原始 HTML 主内容区仅 ${mainWords} 词，请确认核心内容非客户端渲染` });
    }

    // PF-03 · 图片
    for (const img of doc.images) {
      if (img.alt === null) report('PF-03', url, `图片缺少 alt：${img.src.slice(0, 80)}`);
      if (!img.width || !img.height) report('PF-03', url, `图片缺少 width/height（CLS 风险）：${img.src.slice(0, 80)}`);
    }

    // AY-01 · 按钮可访问名称
    for (const b of doc.buttons) {
      if (!b.text && !b.ariaLabel && !b.ariaLabelledby && !b.title) {
        report('AY-01', url, '存在无可访问名称的 button');
      }
    }
    // AY-02 · 表单控件 label
    for (const inp of doc.inputs) {
      const labelled = (inp.id && doc.labelFor.has(inp.id)) || inp.ariaLabel || inp.ariaLabelledby || inp.title;
      if (!labelled) report('AY-02', url, `表单控件缺少 label${inp.id ? `（id="${inp.id}"）` : ''}`);
    }

    // KW-01~03 · 关键词
    const kw = conf.keywords[p] || conf.keywords[p + '/'] || null;
    if (kw) {
      const missing = [];
      if (countPhrase(doc.title || '', kw) === 0) missing.push('Title');
      if (countPhrase(doc.h1s.join(' '), kw) === 0) missing.push('H1');
      const first100 = doc.mainText.split(/\s+/).slice(0, 100).join(' ');
      if (countPhrase(first100, kw) === 0 && countPhrase(doc.mainText.slice(0, 300), kw) === 0) missing.push('首段前 100 词');
      if (countPhrase(doc.h2s.join(' '), kw) === 0) missing.push('任一 H2');
      if (missing.length) report('KW-01', url, `主关键词「${kw}」缺失于：${missing.join('、')}`);

      const hits = countPhrase(doc.mainText, kw);
      const words = countWords(doc.mainText);
      if (hits < 3) report('KW-02', url, `主关键词「${kw}」在正文仅出现 ${hits} 次，要求 ≥ 3`);
      if (words > 0) {
        const density = (hits / words) * 100;
        if (density > 2.5) report('KW-03', url, `密度 ${density.toFixed(2)}% > 2.5%，堆砌风险，需人工复核（命中 ${hits} 次 / ${words} 词）`);
        else if (hits > 0 && density < 0.5) report('KW-03', url, `密度 ${density.toFixed(2)}% < 0.5%（命中 ${hits} 次 / ${words} 词）`);
      }
    }

    // I18 · hreflang
    if (doc.hreflangs.length > 0) {
      const selfRef = doc.hreflangs.some((h) => pathOf(normalize(h.href, url) || '') === p);
      if (!selfRef) report('I18-03', url, 'hreflang 组缺少自引用条目');
      const xdef = doc.hreflangs.filter((h) => h.lang.toLowerCase() === 'x-default');
      if (xdef.length === 0) report('I18-04', url, 'hreflang 组缺少 x-default');
      if (xdef.length > 1) report('I18-04', url, `存在 ${xdef.length} 个 x-default，应只有一个`);
      for (const h of doc.hreflangs) {
        if (h.lang.toLowerCase() === 'x-default') continue;
        if (!/^[a-z]{2,3}(-[A-Z]{2})?$/.test(h.lang)) {
          report('I18-05', url, `hreflang 语言码格式错误："${h.lang}"（应形如 zh-CN / en / ja）`);
        }
        if (/^(jp|uk|cn)$/i.test(h.lang)) {
          report('I18-05', url, `hreflang "${h.lang}" 不是合法代码（日语用 ja，英国用 en-GB，简体中文用 zh-CN）`);
        }
      }
    }

    // 链接图
    const outs = new Set();
    for (const a of doc.anchors) {
      if (!a.href || /^(#|mailto:|tel:|javascript:)/i.test(a.href)) continue;
      const target = normalize(a.href, url);
      if (!target) continue;
      if (sameOrigin(target, base)) {
        outs.add(target);
        if (inbound.has(target) && target !== url) inbound.get(target).add(url);
        if (!pages.has(target) && !conf.ignore.some((ig) => pathOf(target).startsWith(ig))) externalLinkTargets.add(target);
      }
    }
    outbound.set(url, outs);
    if (outs.size < 2) report('LINK-03', url, `站内出链仅 ${outs.size} 条，要求 ≥ 2`);
  }

  // --- META-01/02 唯一性 --------------------------------------------------
  for (const [t, urls] of titleMap) if (urls.length > 1) report('META-01', urls[0], `title 重复（${urls.length} 个页面）："${t.slice(0, 60)}" → ${urls.map(pathOf).join(', ')}`);
  for (const [d, urls] of descMap) if (urls.length > 1) report('META-02', urls[0], `description 重复（${urls.length} 个页面）→ ${urls.map(pathOf).join(', ')}`);

  // --- IDX-05 多页 canonical 到同一目标 -----------------------------------
  for (const [target, urls] of canonicalTargets) {
    if (urls.length > 1) report('IDX-05', urls[0], `${urls.length} 个不同页面 canonical 到同一 URL ${pathOf(target)} → ${urls.map(pathOf).join(', ')}`);
  }

  // --- LINK-01/02 入链 ----------------------------------------------------
  for (const [url, sources] of inbound) {
    if (!pages.has(url)) continue;
    if (pathOf(url) === '/') continue;
    if (sources.size === 0) report('LINK-01', url, '孤岛页面：没有任何站内入链');
  }
  for (const cp of conf.corePages) {
    const full = normalize(base + cp, base);
    if (!full || !inbound.has(full)) continue;
    const n = inbound.get(full).size;
    if (pathOf(full) !== '/' && n < 5) report('LINK-02', full, `核心页入链仅 ${n} 条，要求 ≥ 5`);
  }

  // --- LINK-08 站内死链 ---------------------------------------------------
  const toProbe = [...externalLinkTargets].slice(0, 300);
  if (toProbe.length) {
    console.error(`正在探测 ${toProbe.length} 个站内链接目标 …`);
    await mapLimit(toProbe, args.concurrency, async (u) => {
      const res = await get(toLocal(u), { method: 'HEAD' });
      const status = res.status === 405 || res.status === 0 ? (await get(toLocal(u))).status : res.status;
      if (status >= 400) {
        const from = [...(inbound.get(u) || [])].map(pathOf).slice(0, 3);
        report('LINK-08', u, `站内链接指向 HTTP ${status}${from.length ? `（来源：${from.join(', ')}）` : ''}`);
      }
    });
  }

  // --- IA-07 点击深度 -----------------------------------------------------
  const root = normalize(base + '/', base);
  const depth = new Map([[root, 0]]);
  const queue = [root];
  while (queue.length) {
    const cur = queue.shift();
    for (const next of outbound.get(cur) || []) {
      if (!depth.has(next)) { depth.set(next, depth.get(cur) + 1); queue.push(next); }
    }
  }
  for (const cp of conf.corePages) {
    const full = normalize(base + cp, base);
    const d = depth.get(full);
    if (d === undefined) report('IA-07', full || cp, '核心页从首页不可达（无链接路径）');
    else if (d > 3) report('IA-07', full, `从首页点击深度为 ${d}，要求 ≤ 3`);
  }

  // ---------------------------------------------------------------- 输出
  const must = findings.filter((f) => f.level === '必须');
  const should = findings.filter((f) => f.level === '应该');

  if (args.json) {
    console.log(JSON.stringify({
      base, checkedUrls: pages.size, specVersion: '2026-08-31',
      summary: { must: must.length, should: should.length },
      findings,
    }, null, 2));
  } else {
    console.log(`\n${'='.repeat(64)}`);
    console.log(`seo-check · 规范版本 2026-08-31 · 已检查 ${pages.size} 个页面`);
    console.log('='.repeat(64));

    // 按「实际级别 + 规则」分组：同一规则可能同时产生两级结果（如 PF-02 双阈值）
    const SEP = '\u0000';
    const byRule = new Map();
    for (const f of findings) {
      const key = f.level + SEP + f.rule;
      byRule.set(key, [...(byRule.get(key) || []), f]);
    }
    const order = [...byRule.keys()].sort((a, b) => {
      const [la, ra] = a.split(SEP), [lb, rb] = b.split(SEP);
      return (la === '必须' ? 0 : 1) - (lb === '必须' ? 0 : 1) || ra.localeCompare(rb);
    });

    for (const key of order) {
      const items = byRule.get(key);
      const [level, rule] = key.split(SEP);
      const mark = level === '必须' ? '✗ 必须' : '! 应该';
      console.log(`\n${mark}  ${rule}  (${items.length} 处)`);
      for (const f of items.slice(0, 12)) console.log(`      ${pathOf(f.url)}  —  ${f.message}`);
      if (items.length > 12) console.log(`      … 另有 ${items.length - 12} 处`);
    }

    console.log(`\n${'-'.repeat(64)}`);
    if (findings.length === 0) console.log('✓ 全部通过');
    else console.log(`必须级失败 ${must.length} 项 · 应该级提醒 ${should.length} 项`);
    console.log('注：KW-04 语义覆盖、CT-05 独有内容等语义类规则需人工判断，本脚本不检查。');
    console.log('-'.repeat(64) + '\n');
  }

  process.exitCode = must.length > 0 ? 1 : 0;
}

main().catch((e) => { console.error('seo-check 执行失败：', e); process.exitCode = 2; });
