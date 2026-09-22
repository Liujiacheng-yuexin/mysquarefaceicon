import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { beforeAssetSource } from "./asset-compat.mjs";

const sha = (value) => createHash("sha256").update(value).digest("hex");
const count = (value, needle) => value.split(needle).length - 1;

const expectedBefore = {
  "package.json": "1fb9813496832e4a574490e10b564b53351f1052eafc2ab52af8742b6c9b6b45",
  "package-lock.json": "bf7b778ff42d02d40a11190d56d969cb03ac183a0cf70dbd85c199dc79778c97",
  "scripts/README.md": "9c8de157f33cae5c87da13a7cbfe5efa4a1f9a6354a47f5cdbc14983191c4da1",
  "components/game-player/adapters/RuffleAdapter.tsx": "5fcff6669f4ca75147728e8a73434cdef8abb2823325110d585ad46a1cfe8ada",
  "public/sw.js": "05b14d5b9f3e447b180a12fb025c6937675bc7009b6e68082eebb4a8d83f322d",
  "next.config.mjs": "10f3416af7a0a92f59c4d283113624e9c286f645c6155e91c5a381d512feb9ee"
};

function replaceOne(source, after, before, file) {
  assert.equal(count(source, after), 1, `${file}: approved RUFFLE-001 fragment missing or duplicated`);
  return source.replace(after, before);
}

export function beforeRuffleSource(file, value) {
  value = beforeAssetSource(file, value);
  if (!(file in expectedBefore)) return value;
  let source = value.toString().replace(/\r\n/g, "\n");
  if (sha(source) === expectedBefore[file]) return source;
  const markers = {
    "package.json": '"ruffle:check":',
    "package-lock.json": `"@ruffle-rs/ruffle": "0.2.0-nightly.2026.5.12"`,
    "scripts/README.md": "## RUFFLE-001 runtime governance",
    "components/game-player/adapters/RuffleAdapter.tsx": "const RUFFLE_PUBLIC_PATH",
    "public/sw.js": "msfi-v9-ruffle-2026-05-12",
    "next.config.mjs": "ruffle-runtime-manifest.json"
  };
  if (!source.includes(markers[file])) return source;

  if (file === "package.json") {
    source = replaceOne(source, '    "ruffle:sync": "node scripts/sync-ruffle-runtime.mjs",\n', "", file);
    source = replaceOne(source, '    "ruffle:check": "node scripts/check-ruffle-runtime.mjs",\n', "", file);
    source = replaceOne(source, '    "build": "npm run ruffle:check && next build",', '    "build": "next build",', file);
    source = replaceOne(source, '    "cf:build": "npm run ruffle:check && opennextjs-cloudflare build && node scripts/patch-opennext-worker.mjs",', '    "cf:build": "opennextjs-cloudflare build && node scripts/patch-opennext-worker.mjs",', file);
    source = replaceOne(source, '    "cf:deploy": "npm run ruffle:check && opennextjs-cloudflare build && node scripts/patch-opennext-worker.mjs && opennextjs-cloudflare deploy",', '    "cf:deploy": "opennextjs-cloudflare build && node scripts/patch-opennext-worker.mjs && opennextjs-cloudflare deploy",', file);
    source = replaceOne(source, `    "@ruffle-rs/ruffle": "0.2.0-nightly.2026.5.12",`, `    "@ruffle-rs/ruffle": "^0.2.0-nightly.2026.5.12",`, file);
  } else if (file === "package-lock.json") {
    source = replaceOne(source, `        "@ruffle-rs/ruffle": "0.2.0-nightly.2026.5.12",`, `        "@ruffle-rs/ruffle": "^0.2.0-nightly.2026.5.12",`, file);
  } else if (file === "scripts/README.md") {
    const start = source.indexOf("## RUFFLE-001 runtime governance\n");
    const end = source.indexOf("\n## ", start + 4);
    assert.ok(start >= 0 && end > start, `${file}: approved RUFFLE-001 documentation block missing`);
    source = source.slice(0, start) + source.slice(end + 1);
  } else if (file === "components/game-player/adapters/RuffleAdapter.tsx") {
    source = replaceOne(source, 'const RUFFLE_PUBLIC_PATH = "/ruffle/";\nconst RUFFLE_RUNTIME_URL = `${RUFFLE_PUBLIC_PATH}ruffle.js`;', 'const ruffleUrls = [\n  "/ruffle/ruffle.js",\n  "https://unpkg.com/@ruffle-rs/ruffle",\n  "https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle@latest/ruffle.js"\n];', file);
    source = replaceOne(source, '    const script = existing?.isConnected ? existing : document.createElement("script");', '    const script = existing ?? document.createElement("script");', file);
    source = replaceOne(source, '    const timeout = window.setTimeout(() => {\n      script.remove();\n      reject(new Error(`Timed out loading Ruffle from ${url}`));\n    }, SCRIPT_TIMEOUT_MS);', '    const timeout = window.setTimeout(() => reject(new Error(`Timed out loading Ruffle from ${url}`)), SCRIPT_TIMEOUT_MS);', file);
    source = replaceOne(source, '      script.remove();\n      reject(new Error(`Failed to load Ruffle from ${url}`));', '      reject(new Error(`Failed to load Ruffle from ${url}`));', file);
    source = replaceOne(source, '    publicPath: RUFFLE_PUBLIC_PATH,\n    polyfills: false', '    polyfills: false', file);
    source = replaceOne(source, `  let lastError: unknown;\n  try {\n    await loadScript(RUFFLE_RUNTIME_URL);\n    for (let attempt = 0; attempt < 30; attempt += 1) {\n      const release = window.RufflePlayer?.newest?.();\n      if (release) return release;\n      await new Promise((resolve) => window.setTimeout(resolve, 150));\n    }\n  } catch (error) {\n    lastError = error;\n  }\n\n  throw lastError ?? new Error("Ruffle did not initialize.");`, `  let lastError: unknown;\n  for (const url of ruffleUrls) {\n    try {\n      await loadScript(url);\n      for (let attempt = 0; attempt < 30; attempt += 1) {\n        const release = window.RufflePlayer?.newest?.();\n        if (release) return release;\n        await new Promise((resolve) => window.setTimeout(resolve, 150));\n      }\n    } catch (error) {\n      lastError = error;\n    }\n  }\n\n  throw lastError ?? new Error("Ruffle did not initialize.");`, file);
  } else if (file === "public/sw.js") {
    source = replaceOne(source, 'const CACHE_NAME = "msfi-v9-ruffle-2026-05-12";\nconst RUFFLE_ENTRY = "/ruffle/ruffle.js";', 'const CACHE_NAME = "msfi-v8";', file);
    const networkFirst = `  if (url.pathname === RUFFLE_ENTRY) {\n    event.respondWith(\n      fetch(request)\n        .then((response) => {\n          if (response.ok) {\n            const copy = response.clone();\n            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => undefined);\n          }\n          return response;\n        })\n        .catch(() => caches.match(request))\n    );\n    return;\n  }\n\n`;
    source = replaceOne(source, networkFirst, "", file);
  } else if (file === "next.config.mjs") {
    source = `/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  reactStrictMode: true\n};\n\nexport default nextConfig;\n`;
  }

  assert.equal(sha(source), expectedBefore[file], `${file}: change outside confirmed RUFFLE-001 scope`);
  return source;
}
