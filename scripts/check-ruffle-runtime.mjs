#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { assertRuntimeContract, manifest, projectRoot } from "./ruffle-runtime-lib.mjs";

const read = (file) => readFileSync(resolve(projectRoot, file), "utf8").replace(/\r\n/g, "\n");
const count = (value, needle) => value.split(needle).length - 1;

function validateSourceContract({ adapter, nextConfig, serviceWorker, packageJson }) {
  assert.match(adapter, /const RUFFLE_RUNTIME_URL = `\$\{RUFFLE_PUBLIC_PATH\}ruffle\.js`;/, "adapter must derive the same-origin Ruffle entry from publicPath");
  assert.match(adapter, /publicPath: RUFFLE_PUBLIC_PATH/, "adapter must set the explicit same-origin publicPath");
  assert.match(adapter, /const RUFFLE_PUBLIC_PATH = "\/ruffle\/";/, "adapter publicPath drifted");
  assert.equal(count(adapter, "await loadScript(RUFFLE_RUNTIME_URL);"), 1, "adapter must load one Ruffle entry");
  assert.doesNotMatch(adapter, /https?:\/\//, "adapter must not contain a remote runtime fallback");
  assert.doesNotMatch(adapter, /unpkg|jsdelivr|@latest/i, "adapter must not contain an unpinned CDN fallback");
  assert.match(adapter, /script\.remove\(\);/, "failed or timed-out Ruffle script must be removable for retry");

  assert.match(nextConfig, /ruffle-runtime-manifest\.json/, "Next headers must derive from the Ruffle manifest");
  assert.match(nextConfig, /async headers\(\)/, "Next must emit Ruffle response headers");
  assert.match(serviceWorker, /const RUFFLE_ENTRY = "\/ruffle\/ruffle\.js";/, "service worker entry policy drifted");
  assert.match(serviceWorker, /if \(url\.pathname === RUFFLE_ENTRY\)/, "Ruffle entry must have a dedicated fetch policy");
  assert.match(serviceWorker, /fetch\(request\)[\s\S]*caches\.match\(request\)/, "Ruffle entry must prefer network with cache fallback");
  assert.doesNotMatch(serviceWorker.match(/const CORE_ASSETS = \[[\s\S]*?\];/)?.[0] ?? "", /\/ruffle\/|\.swf/, "install must not prefetch Ruffle or SWF files");
  assert.match(serviceWorker, /url\.pathname\.startsWith\("\/ruffle\/"\)/, "hashed Ruffle children must remain runtime-cacheable");

  const scripts = packageJson.scripts ?? {};
  assert.equal(scripts["ruffle:sync"], "node scripts/sync-ruffle-runtime.mjs", "ruffle:sync command drifted");
  assert.equal(scripts["ruffle:check"], "node scripts/check-ruffle-runtime.mjs", "ruffle:check command drifted");
  assert.ok(scripts.build.startsWith("npm run ruffle:check && "), "build must run the read-only Ruffle gate first");
  assert.ok(scripts["cf:build"].startsWith("npm run ruffle:check && "), "cf:build must run the read-only Ruffle gate first");
  assert.ok(scripts["cf:deploy"].startsWith("npm run ruffle:check && "), "cf:deploy must run the read-only Ruffle gate first");
}

function validateSyntheticRuntime(value) {
  assert.equal(value.packageSpec, manifest.version, "package pin drifted");
  assert.equal(value.lockSpec, manifest.version, "lockfile root spec drifted");
  assert.equal(value.lockVersion, manifest.version, "lockfile installed version drifted");
  assert.equal(value.installedVersion, manifest.version, "installed version drifted");
  assert.deepEqual(value.publicFiles, manifest.files.map((file) => file.path).sort(), "public runtime allowlist drifted");
  for (const file of manifest.files) {
    assert.deepEqual(value.publicMetadata[file.path], { bytes: file.bytes, sha256: file.sha256 }, `${file.path} content drifted`);
  }
}

function runNegativeFixtures(base) {
  const cases = [
    ["range spec", (value) => { value.synthetic.packageSpec = `^${manifest.version}`; }],
    ["lock spec drift", (value) => { value.synthetic.lockSpec = `^${manifest.version}`; }],
    ["installed version drift", (value) => { value.synthetic.installedVersion = "0.2.0-nightly.2099.1.1"; }],
    ["missing public file", (value) => { value.synthetic.publicFiles.pop(); }],
    ["extra public file", (value) => { value.synthetic.publicFiles.push("unexpected.js"); }],
    ["tampered public file", (value) => { value.synthetic.publicMetadata[manifest.entryFile].sha256 = "0".repeat(64); }],
    ["remote fallback", (value) => { value.adapter += "\nhttps://cdn.example.invalid/ruffle.js"; }],
    ["missing publicPath", (value) => { value.adapter = value.adapter.replace("publicPath: RUFFLE_PUBLIC_PATH", "polyfills: false"); }],
    ["build gate removed", (value) => { value.packageJson.scripts.build = "next build"; }],
    ["SW prefetch", (value) => { value.serviceWorker = value.serviceWorker.replace('  "/favicon.ico",', '  "/favicon.ico",\n  "/ruffle/ruffle.js",'); }]
  ];
  let rejected = 0;
  for (const [label, mutate] of cases) {
    const value = structuredClone(base);
    mutate(value);
    assert.throws(() => {
      validateSyntheticRuntime(value.synthetic);
      validateSourceContract(value);
    }, undefined, `${label} fixture must be rejected`);
    rejected += 1;
  }
  return rejected;
}

async function verifyHttp(baseArgument) {
  const base = new URL(baseArgument);
  assert.equal(base.protocol, "http:", "RUFFLE-001 HTTP verification accepts local HTTP only");
  assert.ok(["127.0.0.1", "localhost"].includes(base.hostname), "RUFFLE-001 HTTP verification accepts loopback only");
  assert.equal(base.pathname, "/", "RUFFLE-001 HTTP base must be an origin");

  const responses = [];
  for (const file of manifest.files) {
    const url = new URL(`${manifest.publicBasePath}${file.path}`, base);
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    assert.equal(response.status, 200, `${file.path} HTTP status drifted`);
    assert.equal(response.headers.get("content-type")?.toLowerCase(), file.contentType, `${file.path} HTTP MIME drifted`);
    assert.equal(response.headers.get("cache-control")?.toLowerCase(), file.cacheControl, `${file.path} HTTP cache policy drifted`);
    const body = Buffer.from(await response.arrayBuffer());
    assert.equal(body.byteLength, file.bytes, `${file.path} HTTP byte length drifted`);
    assert.equal(createHash("sha256").update(body).digest("hex"), file.sha256, `${file.path} HTTP SHA-256 drifted`);
    responses.push({ path: url.pathname, status: response.status, contentType: file.contentType, cacheControl: file.cacheControl, bytes: body.byteLength, sha256: file.sha256 });
  }

  const swfs = [
    { path: "/games/square-face.swf", sha256: "b1d074c95f15b7dcecdbc2405abf820ead985669bb12cd47247fc8ea7537bc1e" },
    { path: "/games/oval-face.swf", sha256: "80e974d8ef4ad5e849e93464eaea1833620c269bac30601d960f5438c285e09b" }
  ];
  for (const file of swfs) {
    const response = await fetch(new URL(file.path, base), { signal: AbortSignal.timeout(20_000) });
    assert.equal(response.status, 200, `${file.path} HTTP status drifted`);
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    assert.match(contentType, /shockwave-flash|octet-stream/, `${file.path} must not be served as text or HTML`);
    const body = Buffer.from(await response.arrayBuffer());
    assert.equal(createHash("sha256").update(body).digest("hex"), file.sha256, `${file.path} HTTP SHA-256 drifted`);
    responses.push({ path: file.path, status: response.status, contentType, cacheControl: response.headers.get("cache-control"), bytes: body.byteLength, sha256: file.sha256 });
  }

  for (const path of ["/", "/oval-face-icon-generator"]) {
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20_000) });
    assert.equal(response.status, 200, `${path} HTTP status drifted`);
    const html = await response.text();
    const eagerRequestMarkup = html.match(/<(?:script|link|img)\b[^>]+(?:src|href)="[^"]*(?:\/ruffle\/|\.swf)[^"]*"/gi) ?? [];
    assert.deepEqual(eagerRequestMarkup, [], `${path} must not eagerly request Ruffle or SWF assets`);
  }
  return responses;
}

async function main() {
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || (args.length === 2 && args[0] === "--base"), "usage: npm run ruffle:check [-- --base http://127.0.0.1:3100]");
  assertRuntimeContract();
  const state = {
    adapter: read("components/game-player/adapters/RuffleAdapter.tsx"),
    nextConfig: read("next.config.mjs"),
    serviceWorker: read("public/sw.js"),
    packageJson: JSON.parse(read("package.json")),
    synthetic: {
      packageSpec: manifest.version,
      lockSpec: manifest.version,
      lockVersion: manifest.version,
      installedVersion: manifest.version,
      publicFiles: manifest.files.map((file) => file.path).sort(),
      publicMetadata: Object.fromEntries(manifest.files.map((file) => [file.path, { bytes: file.bytes, sha256: file.sha256 }]))
    }
  };
  validateSourceContract(state);
  validateSyntheticRuntime(state.synthetic);
  const rejected = runNegativeFixtures(state);
  const bytes = manifest.files.reduce((sum, file) => sum + file.bytes, 0);
  console.log(`RUFFLE-001 check passed: ${manifest.version}; ${manifest.files.length} files; ${bytes} bytes; ${rejected} negative fixtures rejected.`);
  if (args.length === 2) {
    const responses = await verifyHttp(args[1]);
    console.log(`RUFFLE-001 local HTTP passed: ${responses.length} runtime/SWF responses verified by status, MIME and SHA-256.`);
    console.log(JSON.stringify(responses, null, 2));
  }
}

main().catch((error) => {
  console.error(`RUFFLE-001 check failed: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
