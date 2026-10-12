#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { beforeGamesIndexNavigation, beforeGamesIndexSource } from "./games-index-compat.mjs";
import { beforeFavoritesMarkup } from "./favorites-compat.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript"), React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const read = file => readFileSync(resolve(root, file), "utf8");
const plain = value => JSON.parse(JSON.stringify(value));
const occurrence = (text, value) => text.split(value).length - 1;
let assertions = 0, negativeFixtures = 0;
function ok(condition, message) { assert.ok(condition, message); assertions++; }
function same(actual, expected, message) { assert.deepEqual(plain(actual), plain(expected), message); assertions++; }
function rejects(callback, message) { assert.throws(callback, undefined, message); negativeFixtures++; }

// Actual TS/TSX + React SSR, with explicit hook/window mocks only for the loader tests.
function modules(overrides = {}, globals = {}) {
  const cache = new Map();
  function load(file) {
    file = file.replace(/\\/g, "/");
    if (file in overrides) return overrides[file];
    if (cache.has(file)) return cache.get(file).exports;
    const mod = { exports: {} }; cache.set(file, mod);
    if (file.endsWith(".json")) { mod.exports = JSON.parse(read(file)); return mod.exports; }
    const source = read(file);
    const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    same(parsed.parseDiagnostics, [], file + " parse");
    const compiled = ts.transpileModule(source, { fileName: file, compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true
    } }).outputText;
    function localRequire(id) {
      if (id in overrides) return overrides[id];
      if (!id.startsWith(".") && !id.startsWith("@/")) return require(id);
      const stem = id.startsWith("@/") ? id.slice(2) : join(dirname(file), id);
      const target = [stem, stem + ".ts", stem + ".tsx", stem + ".json", join(stem, "index.ts")]
        .find(candidate => existsSync(resolve(root, candidate)) && statSync(resolve(root, candidate)).isFile());
      assert.ok(target, id + " from " + file);
      return load(target);
    }
    vm.runInNewContext(compiled, { module: mod, exports: mod.exports, require: localRequire, console, URL, ...globals },
      { filename: file, timeout: 5000 });
    return mod.exports;
  }
  return { load };
}

const loader = modules();
const { resolveGamesDirectory, directoryEntryCount } = loader.load("lib/games/directory.ts");
const { gameCatalog } = loader.load("lib/games/catalog.ts");
const policy = loader.load("lib/games/directory-policy.ts");
const seo = loader.load("lib/seo/games-directory.ts");
const { serializeGameStructuredData } = loader.load("lib/seo/game-structured-data.ts");
const directory = resolveGamesDirectory();
same(seo.gamesDirectoryMetadata.robots, { index: false, follow: true, googleBot: { index: false, follow: true } });
same(seo.gamesDirectoryMetadata.alternates.canonical, "https://mysquarefaceicon.com/games");
same(seo.gamesDirectoryMetadata.openGraph.url, "https://mysquarefaceicon.com/games");
same(directory.games.map(game => game.id), ["square-face", "oval-face", "pixel-art-avatar", "friend-block-test"], "stable unique catalog");
same([directory.onSiteGames.length, directory.externalTools.length], [3, 1]);
same(directory.categoryRoutes.map(({ games }) => games.length), [2, 3, 1, 2, 1, 1]);
same([directoryEntryCount(0), directoryEntryCount(1), directoryEntryCount(2)], ["0 entries", "1 entry", "2 entries"]);
same(resolveGamesDirectory([]), { games: [], onSiteGames: [], externalTools: [], categoryRoutes: [] });
same(resolveGamesDirectory([...gameCatalog, ...gameCatalog]).games.length, 4, "deduplicate ids and paths");

const badRecords = [
  record => { record.status = "DRAFT"; },
  record => { record.status = "BROKEN"; },
  record => { record.pageType = "GUIDE"; },
  record => { record.route.path = "https://example.invalid/tool"; },
  record => { record.id = "invented-legacy"; },
  record => { record.route.existingPublishedRoute = false; },
  record => { record.route.existingPublishedRoute = false; record.route.path = "/games/unknown"; record.slug = "unknown"; },
  record => { record.route.existingPublishedRoute = false; record.route.path = "/games/unknown"; record.slug = "unknown";
    record.license.newPublicationAllowed = true; record.license.releaseDecision = "BLOCKED"; },
  record => { record.route.existingPublishedRoute = false; record.route.path = "/games/unknown"; record.slug = "unknown";
    record.license.newPublicationAllowed = true; record.license.releaseDecision = "APPROVED"; record.license.allowedDeliveryTypes = []; }
];
for (const mutate of badRecords) {
  const record = plain(gameCatalog[0]); mutate(record);
  same(resolveGamesDirectory([record]).games, [], "invalid/unapproved record excluded"); negativeFixtures++;
}
const duplicatePath = plain(gameCatalog[1]); duplicatePath.route.path = gameCatalog[0].route.path;
same(resolveGamesDirectory([gameCatalog[0], duplicatePath]).games.length, 1); negativeFixtures++;
const unlistedCategory = plain(gameCatalog[0]);
unlistedCategory.category = { primary: "unlisted", secondary: [] };
same(resolveGamesDirectory([unlistedCategory]).categoryRoutes, [], "no unlisted or empty category");

function checkDocument(html, withHead = false) {
  html = beforeFavoritesMarkup(html);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, "real main");
  assert.equal(occurrence(main, "<h1>"), 1);
  assert.ok(main.includes("Avatar Games &amp; Face Makers"));
  assert.match(html, /data-ad-eligible="false"/);
  const cards = [...main.matchAll(/<a\b[^>]*data-game-id="([^"]*)"[^>]*>[\s\S]*?<\/a>/g)];
  assert.deepEqual(cards.map(card => card[1]), ["square-face", "oval-face", "friend-block-test", "pixel-art-avatar"]);
  for (const [index, card] of cards.entries()) {
    assert.ok(card[0].includes(`href="${gameCatalog.find(game => game.id === card[1]).route.path}"`));
    assert.ok(card[0].includes('data-navigation="document"'));
    assert.ok(card[0].includes(gameCatalog.find(game => game.id === card[1]).content.summary.replace(/&/g, "&amp;").replace(/'/g, "&#x27;")));
    assert.doesNotMatch(card[0], /target="_blank"|available|rating/i);
  }
  assert.match(cards[3][0], /External tool/);
  assert.match(cards[3][0], /View source and access details/);
  assert.match(main, /3 entries/); assert.match(main, /1 entry/);
  assert.match(main, /Categories overlap/);
  const categories = [...main.matchAll(/<a\b[^>]*data-category-slug="([^"]*)"[^>]*>/g)];
  assert.deepEqual(categories.map(item => item[1]), ["face-makers", "avatar-makers", "pixel-avatars", "retro-flash", "character-creators", "friend-quizzes"]);
  for (const item of categories) assert.ok(item[0].includes('data-navigation="document"'));
  for (const item of main.matchAll(/<a\b[^>]*>/g)) assert.ok(item[0].includes('data-navigation="document"'), "every main exit starts a clean document");
  assert.doesNotMatch(main, /<iframe|<img|<button|\.swf|\.wasm|Popular|Trending|Featured|>New</i);
  assert.equal(occurrence(html, '<a href="/games">All avatar games</a>'), 3);
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(item => JSON.parse(item[1]));
  assert.deepEqual(schemas, plain(seo.buildGamesDirectoryStructuredData(directory.games)));
  assert.doesNotMatch(JSON.stringify(schemas), /rating|datePublished|dateModified|WebApplication|VideoGame|icongenerators/i);
  if (withHead) {
    assert.match(html, /<title>Avatar Games &amp; Face Makers \| My Square Face Icon<\/title>/);
    assert.match(html, /name="robots" content="noindex, follow"/);
    assert.match(html, /rel="canonical" href="https:\/\/mysquarefaceicon.com\/games"/);
    assert.match(html, /property="og:url" content="https:\/\/mysquarefaceicon.com\/games"/);
    for (const attr of ['property="og:title"', 'name="twitter:title"'])
      assert.ok(html.includes(`${attr} content="Avatar Games &amp; Face Makers | My Square Face Icon"`));
  }
}
const html = renderToStaticMarkup(React.createElement(loader.load("app/games/page.tsx").default));
checkDocument(html); assertions++;
for (const [from, to] of [
  ['data-ad-eligible="false"', 'data-ad-eligible="true"'],
  ['data-game-id="square-face"', 'data-game-id="invented"'],
  ['href="/pixel-art-avatar-icon-generator" data-navigation="document"', 'href="https://example.invalid/tool"'],
  ['3 entries', '30 entries'], ['1 entry', '1 available'],
  ['External tool', 'Playable here'], ['Categories overlap', 'Nine distinct games'],
  ['data-navigation="document"', 'data-navigation="client"'],
  ['All avatar games', 'All popular games'],
  ['"numberOfItems":4', '"numberOfItems":99']
]) {
  assert.ok(html.includes(from), "fixture must mutate actual markup: " + from);
  rejects(() => checkDocument(html.replace(from, to)), "negative HTML: " + from);
}
const empty = modules({ "lib/games/catalog.ts": { gameCatalog: [] } });
const emptyHtml = renderToStaticMarkup(React.createElement(empty.load("app/games/page.tsx").default));
ok(emptyHtml.includes("No on-site entries") && !emptyHtml.includes('data-game-id="'), "empty does not invent a game");
const hostile = plain(directory.games); hostile[0].name = '</script><script>alert("x")</script>';
const escaped = serializeGameStructuredData(seo.buildGamesDirectoryStructuredData(hostile)[0]);
ok(!escaped.includes("</script>") && escaped.includes("\\u003c"), "JSON-LD script escaping");

// Exercise the real loader, not just the predicate. No remote scripts execute here.
function scriptHarness(initialPath, readyState = "complete") {
  let currentPath = initialPath, ref, cursor = 0;
  const effects = [], slots = [], listeners = new Map(), timers = new Map(), scripts = [], replacements = [];
  const window = {
    location: { pathname: initialPath, href: "http://localhost:3100" + initialPath, replace: url => replacements.push(url) },
    addEventListener: (name, callback, options) => listeners.set(name, { callback, options }),
    removeEventListener: (name, callback) => { if (listeners.get(name)?.callback === callback) listeners.delete(name); },
    setTimeout: (callback, delay) => { assert.equal(delay, 12000); const id = timers.size + 1; timers.set(id, callback); return id; },
    clearTimeout: id => timers.delete(id)
  };
  const document = {
    readyState,
    querySelector: selector => scripts.find(script => selector === `script[src="${script.src}"]`),
    createElement: () => ({ setAttribute(name, value) { this[name] = value; } }),
    head: { appendChild: script => scripts.push(script) }
  };
  const hooks = {
    ...React,
    useRef: value => { ref ??= { current: value }; return ref; },
    useEffect: (callback, deps) => {
      const i = cursor++, old = slots[i];
      if (!old || deps.some((dep, index) => dep !== old.deps[index])) {
        effects.push(() => { old?.cleanup?.(); slots[i] = { deps, cleanup: callback() }; });
      }
    }
  };
  const mod = modules({ react: hooks, "next/navigation": { usePathname: () => currentPath } }, { window, document });
  function render() { cursor = 0; mod.load("components/DeferredThirdPartyScripts.tsx").default({ googleAdsenseClient: "fixture", cloudflareAnalyticsToken: "fixture" }); while (effects.length) effects.shift()(); }
  render();
  return {
    scripts, timers, listeners, replacements,
    ads: () => scripts.filter(script => /adsbygoogle/.test(script.src)),
    event: name => listeners.get(name)?.callback(),
    wait: () => { for (const callback of [...timers.values()]) callback(); },
    move: path => { currentPath = path; window.location.pathname = path; window.location.href = "http://localhost:3100" + path; render(); },
    unmount: () => slots.forEach(slot => slot.cleanup?.())
  };
}
same(policy.gamesDirectoryPolicy.adEligible, false);
for (const path of ["/games", "/games/", "/games?sort=x", "/games#top"]) {
  ok(policy.isGamesDirectoryPath(path), path);
  same(policy.canLoadAdsOutsideGamesDirectory(path, path), false);
  for (const trigger of ["wait", "pointerdown", "keydown", "touchstart", "scroll"]) {
    const h = scriptHarness(path);
    same([...h.listeners.values()].every(item => item.options.passive === true), true);
    trigger === "wait" ? h.wait() : h.event(trigger);
    same(h.ads().length, 0, "no directory ads for " + trigger);
    same(h.scripts.length, 1, "analytics remains separate");
    h.wait(); h.event("scroll"); same(h.scripts.length, 1, "once only");
    same(h.listeners.size + h.timers.size, 0, "all triggers cleaned up");
  }
}
for (const path of ["/", "/games/example", "/games/square-face.swf", "/gallery"]) {
  same(policy.isGamesDirectoryPath(path), false);
  const h = scriptHarness(path); h.wait(); h.event("scroll");
  same(h.ads().length, 1, "outside policy unchanged, not an ad eligibility approval");
}
// CATEGORY-001 explicitly extends the real loader guard; the original /games predicate is unchanged.
same(policy.isGamesDirectoryPath("/category/face-makers"), false);
const categoryLoader = scriptHarness("/category/face-makers"); categoryLoader.wait();
same(categoryLoader.ads().length, 0, "confirmed category follow-on blocks ads separately");
same(policy.canLoadAdsOutsideGamesDirectory(null, "/"), false, "unknown document fails closed");
const delayed = scriptHarness("/games", "loading"); delayed.unmount(); delayed.event("load"); delayed.wait();
same(delayed.scripts.length + delayed.timers.size + delayed.listeners.size, 0, "unmount before load");
for (const [from, to] of [["/", "/games"], ["/games", "/"], ["/games", "/category/face-makers"]]) {
  const h = scriptHarness(from); h.move(to); h.event("scroll");
  same(h.replacements.length, 1, "missed client link triggers clean document replacement");
  same(h.ads().length, 0, "no ad inserted during directory transition");
}
const loaded = scriptHarness("/"); loaded.wait(); loaded.move("/games");
same(loaded.ads().length, 1, "test does not pretend removing a tag undoes loaded ads");
same(loaded.replacements.length, 1, "loaded ad document must be replaced");
same(policy.crossesGamesDirectoryBoundary("/games", "/games?x=1"), false);

const args = process.argv.slice(2);
const deltas = JSON.parse(read("scripts/fixtures/games-index-approved-source-delta.json"));
for (const file of Object.keys(deltas)) {
  ok(beforeGamesIndexSource(file, readFileSync(resolve(root, file))), "approved source inverse " + file);
  ok(beforeGamesIndexSource(file, read(file).replace(/\r\n/g, "\n")), "normalized newline inverse " + file);
  rejects(() => beforeGamesIndexSource(file, read(file) + "\n// unrelated edit\n"), "source delta cannot hide unrelated changes");
  const edit = deltas[file].edits.find(item => item.after.length > 0);
  if (edit) rejects(() => beforeGamesIndexSource(file, read(file).slice(0, edit.offset) + "X" + read(file).slice(edit.offset)), "changed approved edit must fail");
}
same(occurrence(beforeGamesIndexNavigation(html), "All avatar games"), 0);
rejects(() => beforeGamesIndexNavigation(html.replace("All avatar games", "All popular games")), "navigation label drift");
rejects(() => beforeGamesIndexNavigation(html + '<a href="/games">All avatar games</a>'), "extra directory anchor");
assert.ok(args.length === 0 || (args.length === 1 && args[0] === "--built") || (args.length === 2 && args[0] === "--base"), "usage: games-index:check [-- --built | -- --base http://127.0.0.1:3100]");
if (args.length) {
  let document, sitemap;
  if (args[0] === "--built") {
    document = read(".next/server/app/games.html"); sitemap = read(".next/server/app/sitemap.xml.body");
  } else {
    const base = new URL(args[1]);
    assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(base.hostname) && /^https?:$/.test(base.protocol)
      && base.pathname === "/" && !base.search && !base.hash && !base.username && !base.password, "loopback only");
    const get = async path => {
      const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(10000) });
      assert.equal(response.status, 200, path); return response.text();
    };
    document = await get("/games"); sitemap = await get("/sitemap.xml");
    assert.equal(document, read(".next/server/app/games.html"), "served current production artifact");
  }
  checkDocument(document, true); assertions++;
  ok(!sitemap.includes("https://mysquarefaceicon.com/games</loc>"), "directory excluded from sitemap");
  for (const [from, to] of [['name="robots" content="noindex, follow"', 'name="robots" content="index, follow"'],
    ['property="og:url" content="https://mysquarefaceicon.com/games"', 'property="og:url" content="https://mysquarefaceicon.com/"']]) {
    rejects(() => checkDocument(document.replace(from, to), true), "metadata negative fixture");
  }
}
console.log(JSON.stringify({ task: "GAMES-INDEX-001", result: "PASS", assertions, negativeFixtures, mode: args[0] ?? "source/SSR/loader", browser: "separate evidence required" }));
