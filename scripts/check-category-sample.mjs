#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeCategoryHomeNavigation, beforeCategorySampleSource } from "./category-sample-compat.mjs";
import { beforeCategoryRemainingMarkup, beforeCategoryRemainingMetadata } from "./category-remaining-compat.mjs";
import { beforeRelatedGamesSource } from "./related-games-compat.mjs";
import { beforeFavoritesMarkup as beforeFavoritesMarkupBase } from "./favorites-compat.mjs";
import { beforeDiscordBannerMarkup } from "./discord-banner-compat.mjs";
const beforeFavoritesMarkup = value => beforeDiscordBannerMarkup(beforeFavoritesMarkupBase(value));
import { root, read, plain, React, render, modules, scriptHarness } from "./category-sample-test-utils.mjs";

const sha = value => createHash("sha256").update(value).digest("hex");
const count = (text, value) => text.split(value).length - 1;
const golden = JSON.parse(read("scripts/fixtures/category-sample-baseline.json"));
let assertions = 0, negativeFixtures = 0;
const ok = (condition, name) => { assert.ok(condition, name); assertions++; };
const same = (a, b, name) => { assert.deepEqual(plain(a), plain(b), name); assertions++; };
const rejects = (callback, name) => { assert.throws(callback, undefined, name); negativeFixtures++; };
const loader = modules(), routeFile = "app/category/[slug]/page.tsx";
const page = loader.load(routeFile), categories = loader.load("lib/games/categories.ts");
const { gameCatalog } = loader.load("lib/games/catalog.ts");
const policy = loader.load("lib/games/category-policy.ts");
const { faceMakersContent } = loader.load("lib/games/category-content.ts");
const seo = loader.load("lib/seo/category-sample.ts");
const serialize = loader.load("lib/seo/game-structured-data.ts").serializeGameStructuredData;
const slugs = ["face-makers", "avatar-makers", "pixel-avatars", "retro-flash", "character-creators"];
const expectedCounts = [2, 3, 1, 2, 1];
const routes = categories.listDirectoryCategoryRoutes();
same(routes.map(r => r.category.slug), slugs, "allowlist and order");
same(routes.map(r => r.games.length), expectedCounts, "real counts");
same(page.generateStaticParams(), slugs.map(slug => ({ slug })), "exact static params");
same(categories.listDirectoryCategoryRoutes([]), [], "no invented empty category");
same(categories.listDirectoryCategoryRoutes([...gameCatalog, ...gameCatalog]).map(r => r.games.length), expectedCounts, "deduplication");
for (const slug of ["unknown", "racing-games", "../face-makers", "FACE-MAKERS", "face-makers/", "__proto__", "constructor"]) {
  same(categories.resolveDirectoryCategoryRoute(slug), undefined, "unknown slug");
  same(page.generateMetadata({ params: { slug } }).robots, { index: false, follow: false }, "unknown metadata");
  rejects(() => page.default({ params: { slug } }), "unknown route must throw notFound");
}
const mutations = [
  r => { r.status = "DRAFT"; }, r => { r.status = "BROKEN"; }, r => { r.status = "REVIEW"; },
  r => { r.pageType = "GUIDE"; }, r => { r.pageType = "BLOG"; },
  r => { r.id = "invented-legacy"; }, r => { r.route.path = "/invented-legacy"; },
  r => { r.route.path = "https://example.invalid/"; },
  r => { r.route.existingPublishedRoute = false; },
  r => { r.route.existingPublishedRoute = false; r.route.path = "/games/future"; r.slug = "future"; r.license.newPublicationAllowed = false; },
  r => { r.route.existingPublishedRoute = false; r.route.path = "/games/future"; r.slug = "future"; r.license.newPublicationAllowed = true; r.license.releaseDecision = "REVIEW_REQUIRED"; },
  r => { r.route.existingPublishedRoute = false; r.route.path = "/games/future"; r.slug = "future"; r.license.newPublicationAllowed = true; r.license.releaseDecision = "BLOCKED"; },
  r => { r.route.existingPublishedRoute = false; r.route.path = "/games/future"; r.slug = "future"; r.license.newPublicationAllowed = true; r.license.releaseDecision = "APPROVED"; r.license.allowedDeliveryTypes = []; }
];
for (const record of gameCatalog) for (const mutate of mutations) {
  const candidate = plain(record); mutate(candidate);
  same(categories.listDirectoryCategoryRoutes([candidate]), [], "invalid record excluded"); negativeFixtures++;
}
const duplicate = plain(gameCatalog[1]); duplicate.route.path = gameCatalog[0].route.path;
same(categories.resolveDirectoryCategoryRoute("face-makers", [gameCatalog[0], duplicate]).games.length, 1, "path cannot duplicate");
const future = plain(gameCatalog[2]);
future.id = future.slug = "approved-fixture";
future.route = { ...future.route, existingPublishedRoute: false, path: "/games/approved-fixture" };
same(categories.resolveDirectoryCategoryRoute("pixel-avatars", [future]).games[0].id, future.id, "approved future direct-link positive fixture");
const unknownCategory = plain(gameCatalog[0]); unknownCategory.category = { primary: "unknown", secondary: [] };
same(categories.listDirectoryCategoryRoutes([unknownCategory]), [], "category allowlist cannot expand from data");
const noCatalog = modules({ "lib/games/catalog.ts": { gameCatalog: [] } });
same(noCatalog.load(routeFile).generateStaticParams(), [], "page uses filtered static params");
rejects(() => noCatalog.load(routeFile).default({ params: { slug: "face-makers" } }), "empty known category is not a soft 404");

function schemas(html) {
  return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
}
function checkDocument(html, slug, withHead = false) {
  html = beforeFavoritesMarkup(html);
  html = beforeCategoryRemainingMarkup(html, slug);
  const route = routes.find(r => r.category.slug === slug), sample = slug === "face-makers";
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main); assert.match(html, /<main[^>]*data-ad-eligible="false"/);
  assert.equal((main.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(main.includes(`<h1>${route.category.name}</h1>`));
  assert.ok(main.includes(route.category.description));
  const cards = [...main.matchAll(/<a\b[^>]*data-game-id="([^"]*)"[^>]*>[\s\S]*?<\/a>/g)];
  assert.deepEqual(cards.map(c => c[1]), plain(route.games.map(g => g.id)));
  for (const [index, card] of cards.entries()) {
    const record = route.games[index];
    assert.ok(card[0].includes(`href="${record.route.path}"`));
    assert.ok(card[0].includes(record.content.summary.replace(/&/g, "&amp;").replace(/'/g, "&#x27;")));
    assert.ok(card[0].includes(record.pageType === "EXTERNAL_TOOL" ? "External tool" : "Browser game"));
    assert.ok(card[0].includes(record.pageType === "EXTERNAL_TOOL" ? "View access details" : "Open game"));
    assert.doesNotMatch(card[0], /target="_blank"/);
  }
  for (const anchor of main.matchAll(/<a\b[^>]*>/g)) assert.ok(anchor[0].includes('data-navigation="document"'), "all category main exits are document navigation");
  assert.doesNotMatch(main, /<iframe|<img|<button|\.swf|\.wasm|Popular|Trending|rating/i);
  if (sample) {
    assert.ok(main.includes("Face maker entries")); assert.ok(!main.includes("Available Face Makers"));
    assert.ok(main.includes("Choosing a face maker"));
    for (const text of faceMakersContent.choiceParagraphs) assert.equal(count(main, text), 1);
    assert.equal(count(main, faceMakersContent.overlapNote), 1);
    const other = [...main.matchAll(/data-category-slug="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(other, slugs.slice(1));
    assert.deepEqual(schemas(html), plain(seo.buildCategorySampleStructuredData(route)));
    assert.ok(main.indexOf('data-game-id="oval-face"') < main.indexOf('id="category-choice-heading"'));
    assert.ok(main.indexOf('id="category-choice-heading"') < main.indexOf('id="other-categories-heading"'));
    assert.ok(main.indexOf('id="other-categories-heading"') < main.indexOf('class="route-return-links"'));
    assert.doesNotMatch(JSON.stringify(schemas(html)), /WebApplication|VideoGame|rating|datePublished|dateModified/);
  } else {
    assert.doesNotMatch(main, /Choosing a face maker|Other avatar categories|category-choice-heading/);
    assert.deepEqual(schemas(html), []);
  }
  if (withHead) {
    assert.ok(html.includes(`<title>${route.category.name} | My Square Face Icon</title>`));
    assert.ok(html.includes(`rel="canonical" href="https://mysquarefaceicon.com/category/${slug}"`));
    assert.ok(html.includes('name="robots" content="noindex, follow"'));
    if (sample) {
      assert.ok(html.includes('property="og:url" content="https://mysquarefaceicon.com/category/face-makers"'));
      for (const attr of ['property="og:title"', 'name="twitter:title"']) assert.ok(html.includes(`${attr} content="Face Makers | My Square Face Icon"`));
    }
  }
}

function restoreOtherCategoryMarkup(html, entries, slug) {
  html = beforeFavoritesMarkup(html);
  html = beforeCategoryRemainingMarkup(html, slug);
  assert.equal(count(html, ' data-ad-eligible="false"'), 1);
  html = html.replace(' data-ad-eligible="false"', "");
  let reversed = 0;
  html = html.replace(/<a\b[^>]*>/g, anchor => {
    if (!anchor.includes('data-navigation="document"') || anchor.includes('href="/games"')) return anchor;
    reversed++; return anchor.replace(' data-navigation="document"', "");
  });
  assert.equal(reversed, entries + 2, "only card, breadcrumb Home and return Home navigation additions");
  return html;
}

const documents = {};
for (const slug of slugs) {
  const metadata = page.generateMetadata({ params: { slug } });
  same(metadata.robots, { index: false, follow: true, googleBot: { index: false, follow: true } });
  same(metadata.alternates.canonical, `https://mysquarefaceicon.com/category/${slug}`);
  if (slug !== "face-makers") same(sha(JSON.stringify(beforeCategoryRemainingMetadata(metadata, slug))), golden.categories[slug].metadataSha256, "other category metadata frozen after exact approved batch inverse");
  const html = render(React.createElement(page.default, { params: { slug } }));
  documents[slug] = html; checkDocument(html, slug); assertions++;
  if (slug !== "face-makers") same(sha(restoreOtherCategoryMarkup(html, routes.find(r => r.category.slug === slug).games.length, slug)), golden.categories[slug].ssrSha256, "other category exact original SSR after bounded batch/attribute reversal");
}
const sampleHtml = documents["face-makers"];
for (const [before, after] of [
  ['data-ad-eligible="false"', 'data-ad-eligible="true"'], ['data-game-id="square-face"', 'data-game-id="fake"'],
  ['href="/oval-face-icon-generator" data-navigation="document"', 'href="https://example.invalid/"'],
  ['Face maker entries', 'Available Face Makers'], ['Choosing a face maker', 'Popular games'],
  [faceMakersContent.choiceParagraphs[0], 'All avatars are licensed for commercial use.'],
  ['data-category-slug="pixel-avatars"', 'data-category-slug="new-category"'],
  ['"numberOfItems":2', '"numberOfItems":99'], ['data-navigation="document"', 'data-navigation="client"']
]) { assert.ok(sampleHtml.includes(before), before); rejects(() => checkDocument(sampleHtml.replace(before, after), "face-makers"), before); }
for (const slug of slugs.slice(1)) {
  const html = documents[slug];
  rejects(() => checkDocument(html.replace('data-navigation="document"', ''), slug), "other category missing clean navigation");
  rejects(() => assert.equal(sha(restoreOtherCategoryMarkup(html.replace("Current collection", "New collection"), expectedCounts[slugs.indexOf(slug)], slug)), golden.categories[slug].ssrSha256), "other category text drift must not hide behind inverse");
}
const hostileRoute = plain(routes[0]); hostileRoute.games[0].name = '</script><script>alert("x")</script>';
ok(!serialize(seo.buildCategorySampleStructuredData(hostileRoute)[0]).includes("</script>"), "safe JSON-LD serialization");
const GameLink = loader.load("components/game/GameLink.tsx").default;
for (const href of ["/category", "/category/face-makers", "/category/unknown", "/category/face-makers/?x=1#top", "/games"])
  ok(render(React.createElement(GameLink, { href }, "Open")).includes('data-navigation="document"'), "clean category target " + href);
for (const href of ["/categoryish", "/games/example", "/games/square-face.swf", "/gallery", "https://example.invalid/category/face-makers"])
  ok(!render(React.createElement(GameLink, { href }, "Open")).includes('data-navigation="document"'), "unrelated default navigation preserved " + href);

same(policy.categoryPolicy.adEligible, false);
for (const path of ["/category", "/category/", ...slugs.map(s => "/category/" + s), "/category/unknown", "/category/face-makers/?x=1#top", "/category?x=1", "/category/face-makers/extra"]) {
  ok(policy.isCategoryPath(path), path);
  same(policy.canLoadAdsOutsideCategory(path, path), false);
  for (const trigger of ["wait", "pointerdown", "keydown", "touchstart", "scroll"]) {
    const h = scriptHarness(path);
    same([...h.listeners.values()].every(item => item.options.passive), true, "passive listeners");
    trigger === "wait" ? h.wait() : h.event(trigger);
    same(h.ads().length, 0, "no category ads " + path + " " + trigger);
    same(h.scripts.length, 1, "analytics remains separate"); h.wait(); h.event("scroll");
    same(h.scripts.length, 1, "once-only loading"); same(h.timers.size + h.listeners.size, 0, "cleanup after activation");
  }
}
for (const path of ["/", "/categoryish", "/categories", "/games/example", "/games/square-face.swf", "/gallery"]) {
  same(policy.isCategoryPath(path), false); const h = scriptHarness(path); h.wait(); same(h.ads().length, 1, "unrelated ads unchanged; not an eligibility approval");
}
for (const path of ["/games", "/games/"]) { const h = scriptHarness(path); h.wait(); same(h.ads().length, 0, "accepted directory guard preserved"); }
same(policy.canLoadAdsOutsideCategory(null, "/"), false); const unknownDocument = scriptHarness(null); unknownDocument.wait(); same(unknownDocument.ads().length, 0);
for (const [from, to] of [["/", "/category/face-makers"], ["/category/face-makers", "/"], ["/games", "/category/face-makers"], ["/category/unknown", "/games"]]) {
  const h = scriptHarness(from); h.move(to); h.event("scroll");
  same(h.replacements.length, 1, "missed client boundary reloads document"); same(h.ads().length, 0, "transitional document cannot insert ads");
}
const between = scriptHarness("/category/face-makers"); between.move("/category/avatar-makers"); between.wait(); same(between.replacements.length, 0); same(between.ads().length, 0);
const pending = scriptHarness("/"); pending.pending("/category/unknown"); pending.event("pointerdown"); same(pending.ads().length, 0, "live path prevents race before usePathname update");
const loaded = scriptHarness("/"); loaded.wait(); loaded.move("/category/face-makers"); same(loaded.ads().length, 1, "do not pretend executed source ads are undone"); same(loaded.replacements.length, 1);
const delayed = scriptHarness("/category/face-makers", "loading"); delayed.unmount(); delayed.event("load"); delayed.wait(); same(delayed.scripts.length + delayed.timers.size + delayed.listeners.size, 0);

const deltas = JSON.parse(read("scripts/fixtures/category-sample-approved-source-delta.json"));
for (const file of Object.keys(deltas)) {
  ok(beforeCategorySampleSource(file, readFileSync(resolve(root, file))), "raw exact inverse " + file);
  ok(beforeCategorySampleSource(file, read(file).replace(/\r\n/g, "\n")), "LF exact inverse " + file);
  rejects(() => beforeCategorySampleSource(file, read(file) + "\n// unrelated\n"), "extra source edit");
  const edit = deltas[file].edits.find(e => e.after.length > 0);
  if (edit) rejects(() => beforeCategorySampleSource(file, read(file).slice(0, edit.offset) + "X" + read(file).slice(edit.offset)), "missing approved fragment");
}
const HomeDiscovery = loader.load("components/home/HomeDiscoveryRegion.tsx");
// Full homepage SSR is additionally covered by the original Square/Home/Locale regression checks.
ok(HomeDiscovery.default, "actual home category component loads");
const homeLinks = slugs.map(slug => `<a class="category-chip category-chip-home" href="/category/${slug}" data-navigation="document" data-category-slug="${slug}">`).join("");
ok(!beforeCategoryHomeNavigation(homeLinks).includes('data-navigation="document"'), "exact five home attributes reversed");
rejects(() => beforeCategoryHomeNavigation(homeLinks.replace('data-navigation="document"', '')), "missing home boundary cannot be normalized");
rejects(() => beforeCategoryHomeNavigation(homeLinks.replace('/category/face-makers', '/category/fake')), "home category href drift");
for (const [file, expected] of Object.entries(golden.frozenFiles)) same(sha(beforeRelatedGamesSource(file, readFileSync(resolve(root, file)))), expected, "frozen " + file);

const args = process.argv.slice(2);
assert.ok(args.length === 0 || (args.length === 1 && args[0] === "--built") || (args.length === 2 && args[0] === "--base"), "usage: category-sample:check [-- --built | -- --base http://127.0.0.1:3100]");
if (args.length) {
  let base;
  if (args[0] === "--base") {
    base = new URL(args[1]); assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname) && /^https?:$/.test(base.protocol) && base.pathname === "/" && !base.search && !base.hash && !base.username && !base.password);
  }
  const get = async path => { const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(10000) }); assert.equal(response.status, 200, path); return response.text(); };
  for (const slug of slugs) {
    const built = read(`.next/server/app/category/${slug}.html`), html = base ? await get(`/category/${slug}`) : built;
    if (base) same(html, built, "served build matches " + slug);
    checkDocument(html, slug, true); assertions++;
    for (const [before, after] of [['name="robots" content="noindex, follow"', 'name="robots" content="index, follow"'], [`rel="canonical" href="https://mysquarefaceicon.com/category/${slug}"`, 'rel="canonical" href="https://mysquarefaceicon.com/"']])
      rejects(() => checkDocument(html.replace(before, after), slug, true), "built/HTTP metadata drift " + slug);
  }
  const sitemap = base ? await get('/sitemap.xml') : read('.next/server/app/sitemap.xml.body');
  ok(!sitemap.includes('https://mysquarefaceicon.com/category/'), "all categories excluded from sitemap");
  if (base) for (const missing of ["/category", "/category/unknown", "/category/face-makers/extra"]) {
    const response = await fetch(new URL(missing, base), { redirect: "manual", signal: AbortSignal.timeout(10000) }); same(response.status, 404, missing + " true HTTP 404");
    const html = await response.text(); ok(/noindex/.test(html), missing + " noindex");
  }
}
console.log(JSON.stringify({ task: "CATEGORY-001", scope: "CATEGORY_SAMPLE", result: "PASS", assertions, negativeFixtures, mode: args[0] ?? "source/SSR/loader", humanReview: "not completed", browser: "separate evidence required" }));
