#!/usr/bin/env node

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = "b62557d66d1b4c3fabaecea8c3f9409b";
const DEFAULT_SITE_URL = "https://mysquarefaceicon.com";
const MAX_BATCH_SIZE = 10000;
const MAX_EXPLICIT_QUERY_PARAMS = 5;
const BLOCKED_PATH_PATTERNS = [
  /^\/admin(?:\/|$)/i,
  /^\/api\/admin(?:\/|$)/i,
  /^\/wp-admin(?:\/|$)/i,
  /^\/dashboard(?:\/|$)/i,
  /^\/login(?:\/|$)/i,
  /^\/signin(?:\/|$)/i
];

const STATUS_HINTS = {
  400: "请求格式错误",
  403: "key 文件无法验证，检查 keyLocation 是否能访问",
  422: "URL 不属于 host 或 key 格式/协议不匹配",
  429: "提交过于频繁"
};

function parseArgs(argv) {
  const args = {};
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }

    const [rawKey, inlineValue] = arg.slice(2).split("=", 2);

    if (rawKey === "all") {
      args.all = true;
      continue;
    }

    const nextArg = argv[index + 1];
    const nextValue = inlineValue ?? (nextArg?.startsWith("--") ? undefined : nextArg);
    if (inlineValue === undefined && nextValue !== undefined) {
      index += 1;
    }

    args[rawKey] = nextValue;
  }

  for (const key of ["domain", "url", "urls", "sitemap"]) {
    const envValue = process.env[`npm_config_${key}`];
    if (args[key] === undefined && envValue && envValue !== "true") {
      args[key] = envValue;
    }
  }

  if (args.all === undefined && process.env.npm_config_all === "true") {
    args.all = true;
  }

  applyPositionalFallbacks(args, positionals);

  return args;
}

function applyPositionalFallbacks(args, positionals) {
  const remaining = [...positionals];

  if (!args.domain && remaining[0] && !/^https?:\/\//i.test(remaining[0])) {
    args.domain = remaining.shift();
  }

  if (!args.url && !args.urls && !args.sitemap && !args.all) {
    const source = remaining.find((value) => /^https?:\/\//i.test(value));

    if (source?.includes(",")) {
      args.urls = source;
    } else if (source?.toLowerCase().includes("sitemap")) {
      args.sitemap = source;
    } else if (source) {
      args.url = source;
    } else if (args.domain && positionals.length === 1) {
      args.all = true;
    }
  }
}

function normalizeDomain(input) {
  const source = input || process.env.SITE_URL || DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(source) ? source : `https://${source}`;
  const url = new URL(withProtocol);

  return url.hostname.toLowerCase();
}

function getAllowedDomain() {
  return normalizeDomain(process.env.SITE_URL || DEFAULT_SITE_URL);
}

function decodeXmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractSitemapLocations(xml) {
  const locations = [];
  const locPattern = /<loc>\s*([\s\S]*?)\s*<\/loc>/gi;
  let match;

  while ((match = locPattern.exec(xml)) !== null) {
    locations.push(decodeXmlEntities(match[1].trim()));
  }

  return locations;
}

function hasBlockedPath(url) {
  return BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

function shouldKeepUrl(rawUrl, domain, source) {
  const input = rawUrl?.trim();

  if (!input) {
    return false;
  }

  let url;
  try {
    url = new URL(input);
  } catch {
    return false;
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return false;
  }

  if (url.hostname.toLowerCase() !== domain) {
    return false;
  }

  if (input.includes("#")) {
    return false;
  }

  if (hasBlockedPath(url)) {
    return false;
  }

  if (source !== "sitemap" && Array.from(url.searchParams).length > MAX_EXPLICIT_QUERY_PARAMS) {
    return false;
  }

  return true;
}

function uniqueUrls(urls) {
  return [...new Set(urls)];
}

async function getUrlsFromSitemap(sitemapUrl, domain) {
  const response = await fetch(sitemapUrl);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status} ${text}`);
  }

  return uniqueUrls(extractSitemapLocations(text).filter((url) => shouldKeepUrl(url, domain, "sitemap")));
}

function getExplicitUrls(args, domain) {
  const urls = [];

  if (args.url) {
    urls.push(args.url);
  }

  if (args.urls) {
    urls.push(...args.urls.split(","));
  }

  return uniqueUrls(urls.filter((url) => shouldKeepUrl(url, domain, "explicit")));
}

function chunkUrls(urls) {
  const chunks = [];

  for (let start = 0; start < urls.length; start += MAX_BATCH_SIZE) {
    chunks.push(urls.slice(start, start + MAX_BATCH_SIZE));
  }

  return chunks;
}

async function submitBatch(domain, urlList) {
  const payload = {
    host: domain,
    key: INDEXNOW_KEY,
    keyLocation: `https://${domain}/${INDEXNOW_KEY}.txt`,
    urlList
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const responseText = await response.text();
  const hint = STATUS_HINTS[response.status];

  console.log(`domain: ${domain}`);
  console.log(`urlCount: ${urlList.length}`);
  console.log(`status: ${response.status}`);
  console.log(`response: ${responseText || "(empty)"}`);

  if (response.status === 200) {
    console.log("result: submitted");
  } else if (response.status === 202) {
    console.log("result: accepted, waiting for key verification");
  } else if (hint) {
    console.error(`error: ${hint}`);
  } else if (!response.ok) {
    console.error(`error: IndexNow request failed with HTTP ${response.status}`);
  }
}

function printUsage() {
  console.log(`Usage:
  npm run indexnow -- --domain mysquarefaceicon.com --url https://mysquarefaceicon.com/
  npm run indexnow -- --domain mysquarefaceicon.com --urls https://mysquarefaceicon.com/,https://mysquarefaceicon.com/gallery
  npm run indexnow -- --domain mysquarefaceicon.com --sitemap https://mysquarefaceicon.com/sitemap.xml
  npm run indexnow -- --domain mysquarefaceicon.com --all`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const domain = normalizeDomain(args.domain);
  const allowedDomain = getAllowedDomain();

  if (domain !== allowedDomain) {
    throw new Error(`Refusing to submit ${domain}. This project is configured for ${allowedDomain}.`);
  }

  let urls = [];

  if (args.url || args.urls) {
    urls = getExplicitUrls(args, domain);
  } else if (args.sitemap) {
    urls = await getUrlsFromSitemap(args.sitemap, domain);
  } else if (args.all) {
    urls = await getUrlsFromSitemap(`https://${domain}/sitemap.xml`, domain);
  } else {
    printUsage();
    return;
  }

  if (urls.length === 0) {
    throw new Error("No valid URLs to submit after filtering.");
  }

  for (const [index, batch] of chunkUrls(urls).entries()) {
    console.log(`batch: ${index + 1}`);
    await submitBatch(domain, batch);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
