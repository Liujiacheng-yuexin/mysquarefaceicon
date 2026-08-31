#!/usr/bin/env node
/**
 * post-deploy-check.mjs · 生产环境 SEO 回归检查
 *
 * 验证 RULES.md 中标记 🌐 的规则。零依赖，需 Node 18+。每次部署后运行（OP-02）。
 *
 *   node scripts/post-deploy-check.mjs --base https://example.com
 *   node scripts/post-deploy-check.mjs --base https://example.com --sample 20
 *
 * 退出码：任一断言失败为 1。挂进部署流水线的 post-deploy 阶段。
 *
 * 为什么需要它：最灾难且最常见的 SEO 事故不是规划失误，而是某次部署
 * 意外给全站加了 noindex、或 canonical 指向了预览域名，三周后才在 GSC
 * 发现。人工清单挡不住这类事故，只有自动断言可以。
 */

import { readFileSync, existsSync } from 'node:fs';

function parseArgs(argv) {
  const a = { base: '', sample: 12, config: 'seo-check.config.json' };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--base') a.base = argv[++i];
    else if (argv[i] === '--sample') a.sample = Number(argv[++i]);
    else if (argv[i] === '--config') a.config = argv[++i];
    else if (argv[i] === '--help' || argv[i] === '-h') {
      console.log(`
post-deploy-check.mjs · 生产环境 SEO 回归检查

用法:
  node scripts/post-deploy-check.mjs --base https://example.com [--sample 12]

选项:
  --base <url>     生产环境根地址（省略则取 seo-check.config.json 的 prodDomain）
  --sample <n>     除核心页外，额外随机抽查 n 个 sitemap URL，默认 12
  --config <path>  复用 seo-check.config.json 中的 corePages
`);
      process.exit(0);
    }
  }
  return a;
}

const failures = [];
const passes = [];
const fail = (rule, msg) => failures.push(`✗ ${rule}  ${msg}`);
const pass = (rule, msg) => passes.push(`✓ ${rule}  ${msg}`);

async function get(url, redirect = 'follow', method = 'GET') {
  try {
    const res = await fetch(url, { method, redirect, headers: { 'user-agent': 'post-deploy-check/2.0' } });
    const ct = res.headers.get('content-type') || '';
    const body = method === 'GET' && /text|xml|json|html/i.test(ct) ? await res.text() : '';
    return { ok: res.ok, status: res.status, url: res.url, body, headers: res.headers };
  } catch (e) {
    return { ok: false, status: 0, url, body: '', headers: new Headers(), error: e.message };
  }
}

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] ?? m[3] ?? '') : null;
};

function extractSeo(html) {
  const h = html.replace(/<!--[\s\S]*?-->/g, '');
  const head = h.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? h;
  let canonical = null, robots = null, ogImage = null;
  for (const t of head.match(/<link\b[^>]*>/gi) || []) {
    if ((attr(t, 'rel') || '').toLowerCase() === 'canonical') canonical = attr(t, 'href');
  }
  for (const t of head.match(/<meta\b[^>]*>/gi) || []) {
    const n = (attr(t, 'name') || attr(t, 'property') || '').toLowerCase();
    if (n === 'robots') robots = (attr(t, 'content') || '').toLowerCase();
    if (n === 'og:image') ogImage = attr(t, 'content');
  }
  return { canonical, robots, ogImage, title: h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null };
}

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

async function main() {
  const args = parseArgs(process.argv);
  const cfg = existsSync(args.config) ? JSON.parse(readFileSync(args.config, 'utf8')) : {};

  // --base 未显式给出时，从 seo-check.config.json 的 prodDomain 取，避免两处配置生产域名
  const target = args.base || cfg.prodDomain || '';
  if (!target) {
    console.error('错误：未指定生产域名。请传 --base，或在 seo-check.config.json 中填写 prodDomain。');
    process.exitCode = 2; return;
  }
  if (/请填写|example\.com/.test(target)) {
    console.error(`错误：生产域名仍是占位值（${target}）。请先填写 seo-check.config.json 的 prodDomain。`);
    process.exitCode = 2; return;
  }
  const base = target.replace(/\/$/, '');
  const prodHost = new URL(base).host;
  const corePages = cfg.corePages || ['/'];

  console.error(`生产环境回归检查 · ${base}\n`);

  // --- IDX-07 robots.txt --------------------------------------------------
  const robots = await get(`${base}/robots.txt`);
  if (!robots.ok) fail('IDX-07', `robots.txt 返回 HTTP ${robots.status}`);
  else {
    if (robotsBlocksAllUserAgents(robots.body)) {
      fail('IDX-07', '🚨 robots.txt 对所有 UA 声明 Disallow: /（全站封禁，很可能是预发配置泄漏）');
    } else pass('IDX-07', 'robots.txt 未全站封禁');

    const sm = [...robots.body.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]);
    if (sm.length === 0) fail('IDX-07', 'robots.txt 未声明 sitemap');
    else {
      pass('IDX-07', `robots.txt 声明了 ${sm.length} 个 sitemap`);
      for (const s of sm) {
        if (!s.includes(prodHost)) fail('IDX-07', `robots.txt 中的 sitemap 指向非生产域名：${s}`);
      }
    }
  }

  // --- sitemap ------------------------------------------------------------
  const smRes = await get(`${base}/sitemap.xml`);
  let sitemapUrls = [];
  if (!smRes.ok) fail('IDX-06', `sitemap.xml 返回 HTTP ${smRes.status}`);
  else {
    sitemapUrls = [...smRes.body.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((m) => m[1].trim());
    if (sitemapUrls.length === 0) fail('IDX-06', 'sitemap.xml 中没有 URL');
    else pass('IDX-06', `sitemap 含 ${sitemapUrls.length} 条 URL`);
    const wrongHost = sitemapUrls.filter((u) => { try { return new URL(u).host !== prodHost; } catch { return true; } });
    if (wrongHost.length) fail('IDX-04', `sitemap 中 ${wrongHost.length} 条 URL 指向非生产域名，例如 ${wrongHost[0]}`);
  }

  // --- HTTPS 跳转 ---------------------------------------------------------
  if (base.startsWith('https://')) {
    const httpRes = await get(base.replace('https://', 'http://'), 'manual');
    if (httpRes.status >= 300 && httpRes.status < 400) {
      const loc = httpRes.headers.get('location') || '';
      if (loc.startsWith('https://')) pass('OP-03', `HTTP → HTTPS 跳转正常（${httpRes.status}）`);
      else fail('OP-03', `HTTP 跳转目标不是 HTTPS：${loc}`);
      if (httpRes.status === 302) fail('OP-03', 'HTTP → HTTPS 使用 302，永久跳转应为 301');
    } else if (httpRes.status === 200) {
      fail('OP-03', 'HTTP 直接返回 200，未跳转到 HTTPS');
    }
  }

  // --- 抽样页面 -----------------------------------------------------------
  const sample = [...new Set([
    ...corePages.map((p) => base + (p.startsWith('/') ? p : '/' + p)),
    ...sitemapUrls.sort(() => Math.random() - 0.5).slice(0, args.sample),
  ])];

  console.error(`抽查 ${sample.length} 个页面 …\n`);

  let noindexCount = 0;
  for (const url of sample) {
    const res = await get(url, 'manual');

    // 重定向链
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      const hop = await get(new URL(loc, url).href, 'manual');
      if (hop.status >= 300 && hop.status < 400) fail('OP-03', `${url} 存在超过 1 跳的重定向链`);
      if (sitemapUrls.includes(url)) fail('IDX-06', `sitemap 中的 URL ${url} 返回 ${res.status} 重定向`);
      continue;
    }

    if (res.status !== 200) { fail('IDX-06', `${url} 返回 HTTP ${res.status}`); continue; }

    const seo = extractSeo(res.body);

    // IDX-12 · noindex 泄漏
    const xrt = (res.headers.get('x-robots-tag') || '').toLowerCase();
    if ((seo.robots || '').includes('noindex') || xrt.includes('noindex')) {
      noindexCount++;
      fail('IDX-12', `${url} 带有 noindex${xrt.includes('noindex') ? '（X-Robots-Tag 响应头）' : '（meta robots）'}`);
    }

    // IDX-01/04 · canonical
    if (!seo.canonical) fail('IDX-01', `${url} 缺少 canonical`);
    else {
      let canHost = '';
      try { canHost = new URL(seo.canonical, url).host; } catch { }
      if (canHost !== prodHost) fail('IDX-04', `${url} 的 canonical 指向 "${canHost}"，应为 "${prodHost}"`);
    }

    if (!seo.title) fail('META-01', `${url} 缺少 title`);
  }

  if (noindexCount === 0) pass('IDX-12', `抽查的 ${sample.length} 个页面均无 noindex`);
  if (noindexCount > sample.length * 0.5) {
    failures.unshift('✗ IDX-12  🚨 超过半数抽查页面带 noindex —— 极可能是全站配置泄漏，立即回滚');
  }

  // --- META-08 · OG 图片 --------------------------------------------------
  const homeRes = await get(base);
  if (homeRes.ok) {
    const og = extractSeo(homeRes.body).ogImage;
    if (!og) fail('META-08', '首页缺少 og:image');
    else {
      const ogRes = await get(new URL(og, base).href, 'follow', 'HEAD');
      if (!ogRes.ok) fail('META-08', `og:image 不可访问（HTTP ${ogRes.status}）：${og}`);
      else pass('META-08', 'og:image 可访问');
    }
  }

  // ---------------------------------------------------------------- 输出
  console.log('='.repeat(64));
  console.log(`生产环境回归检查 · ${base}`);
  console.log('='.repeat(64));
  for (const p of passes) console.log('  ' + p);
  if (failures.length) {
    console.log('');
    for (const f of failures) console.log('  ' + f);
  }
  console.log('-'.repeat(64));
  console.log(failures.length === 0 ? '✓ 全部通过' : `✗ ${failures.length} 项失败`);
  console.log('-'.repeat(64) + '\n');

  process.exitCode = failures.length > 0 ? 1 : 0;
}

main().catch((e) => { console.error('post-deploy-check 执行失败：', e); process.exitCode = 2; });
