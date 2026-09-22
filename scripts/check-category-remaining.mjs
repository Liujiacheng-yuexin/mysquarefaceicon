#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeCategoryRemainingMarkup, beforeCategoryRemainingMetadata, beforeCategoryRemainingSource } from "./category-remaining-compat.mjs";
import { beforeRelatedGamesSource } from "./related-games-compat.mjs";
import { beforeFavoritesMarkup } from "./favorites-compat.mjs";
import { root, read, plain, React, render, modules } from "./category-sample-test-utils.mjs";

const sha = value => createHash("sha256").update(value).digest("hex");
const clean = value => value.replaceAll("<!-- -->", ""); // React text separators only, not visible content.
const count = (text, value) => text.split(value).length - 1;
const contract = JSON.parse(read("scripts/fixtures/category-remaining-contract.json"));
const deltas = JSON.parse(read("scripts/fixtures/category-remaining-approved-source-delta.json"));
const site = "https://mysquarefaceicon.com";
let assertions = 0, negativeFixtures = 0;
const ok = (value, name) => { assert.ok(value, name); assertions++; };
const same = (a, b, name) => { assert.deepEqual(plain(a), plain(b), name); assertions++; };
const rejects = (callback, name) => { assert.throws(callback, undefined, name); negativeFixtures++; };

// Reviewable expectations from the confirmed proposal, not from current copy.
const copy = {
  "avatar-makers": {
    entries: "Avatar maker entries", heading: "Choose where to create", ids: ["square-face", "oval-face", "pixel-art-avatar"],
    paragraphs: [
      "Square Face Generator and Oval Face Icon Generator open maker pages on this site. Start with either entry if you want a square or rounded face icon.",
      "Pixel Art Avatar Icon Generator is an external tool entry. Its card opens our access-details page first, where you can review the source and usage notes before visiting the original website."
    ], links: []
  },
  "pixel-avatars": {
    entries: "Pixel avatar entries", heading: "Before opening the pixel avatar tool", ids: ["pixel-art-avatar"],
    paragraphs: [
      "The Pixel Art Avatar Icon Generator entry is an external tool. Its card opens the access-details page on this site, not an embedded editor.",
      "Read the source and usage notes on that page before following the link to the original website. For the site's Square and Oval entries, browse Face Makers."
    ], links: ["/category/face-makers"]
  },
  "retro-flash": {
    entries: "Retro Flash entries", heading: "Opening the Flash-based makers", ids: ["square-face", "oval-face"],
    paragraphs: [
      "Square Face Generator and Oval Face Icon Generator use Flash-based game files with a browser player. Open a maker page on this site, then select Play to load its player.",
      "This category does not run a game or download its player on its own. See the maker page for controls, saving guidance, and source or usage limitations."
    ], links: []
  },
  "character-creators": {
    entries: "Character creator entries", heading: "About this collection", ids: ["pixel-art-avatar"],
    paragraphs: [
      "The current character-creator entry is Pixel Art Avatar Icon Generator. It is listed here as an external tool, so this collection is a starting point for browsing rather than an on-site character editor.",
      "For a face-based character, browse Face Makers for the Square and Oval entries. Compare their square and rounded face styles before choosing a maker page."
    ], links: ["/category/face-makers"]
  }
};
const slugs = ["face-makers", ...Object.keys(copy)], pageFile = "app/category/[slug]/page.tsx";
const loader = modules(), page = loader.load(pageFile), categories = loader.load("lib/games/categories.ts");
const content = loader.load("lib/games/category-remaining-content.ts");
const { gameCatalog } = loader.load("lib/games/catalog.ts"), routes = categories.listDirectoryCategoryRoutes();
const props = slug => ({ params: { slug } });
const body = html => clean(html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)?.[0] ?? "");
const decode = text => text.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const text = html => decode(clean(html).replace(/<[^>]*>/g, ""));
const schemaList = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
function attributes(tag) { return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], decode(m[2])])); }
function meta(html, key, property = "name") {
  const matches = [...html.matchAll(/<meta\b[^>]*>/g)].map(m => attributes(m[0])).filter(a => a[property] === key);
  assert.equal(matches.length, 1, "unique meta " + key); return matches[0].content;
}

function checkDocument(html, slug, withHead = false) {
  html = beforeFavoritesMarkup(html);
  const route = routes.find(r => r.category.slug === slug), main = body(html), expected = copy[slug];
  assert.ok(main, slug + " nonblank main");
  assert.equal(main, clean(contract.categories[slug].afterMain), slug + " exact approved main");
  assert.equal(count(main, "<h1>"), 1); assert.ok(main.includes(`<h1>${route.category.name}</h1>`));
  assert.ok(main.includes('data-ad-eligible="false"'));
  assert.doesNotMatch(main, /<iframe|<img|<button|\.swf|\.wasm|Popular|Trending|rating/i);
  const cards = [...main.matchAll(/<a\b[^>]*data-game-id="([^"]+)"[^>]*>[\s\S]*?<\/a>/g)];
  assert.deepEqual(cards.map(c => c[1]), plain(route.games.map(g => g.id)));
  for (const [index, card] of cards.entries()) {
    const record = route.games[index], a = attributes(card[0].split(">")[0] + ">");
    assert.equal(a.href, record.route.path); assert.equal(a["data-game-page-type"], record.pageType);
    assert.ok(text(card[0]).includes(record.content.summary));
    assert.ok(text(card[0]).includes(record.pageType === "EXTERNAL_TOOL" ? "External tool" : "Browser game"));
    assert.ok(text(card[0]).includes(record.pageType === "EXTERNAL_TOOL" ? "View access details" : "Open game"));
  }
  for (const match of main.matchAll(/<a\b[^>]*>/g)) {
    const a = attributes(match[0]); assert.equal(a["data-navigation"], "document");
    assert.ok(a.href.startsWith("/") && !a.href.startsWith("//")); assert.equal(a.target, undefined);
  }
  assert.deepEqual([...main.matchAll(/data-category-slug="([^"]+)"/g)].map(m => m[1]), slugs.filter(s => s !== slug));
  const json = schemaList(html);
  assert.deepEqual(json, plain([
    { "@context": "https://schema.org", "@type": "CollectionPage", name: route.category.name, url: `${site}/category/${slug}`,
      mainEntity: { "@type": "ItemList", numberOfItems: route.games.length, itemListElement: route.games.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: g.name, url: site + g.route.path })) } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site + "/" },
      { "@type": "ListItem", position: 2, name: "Games", item: site + "/games" },
      { "@type": "ListItem", position: 3, name: route.category.name, item: `${site}/category/${slug}` }
    ] }
  ]));
  assert.doesNotMatch(JSON.stringify(json), /WebApplication|VideoGame|rating|datePublished|dateModified/);
  if (expected) {
    const choice = main.match(/<section[^>]*aria-labelledby="category-choice-heading"[\s\S]*?<\/section>/)[0];
    assert.ok(choice.includes(`<h2 id="category-choice-heading">${expected.heading}</h2>`));
    assert.deepEqual([...choice.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => text(m[1])), expected.paragraphs);
    assert.deepEqual([...choice.matchAll(/<a\b[^>]*>/g)].map(m => attributes(m[0]).href), expected.links);
    assert.ok(main.includes(`<h2 id="category-games-heading">${expected.entries}</h2>`));
    assert.ok(main.indexOf('id="category-choice-heading"') > main.indexOf('data-game-id="' + expected.ids.at(-1) + '"'));
    assert.ok(main.indexOf('id="other-categories-heading"') > main.indexOf('id="category-choice-heading"'));
    assert.ok(main.indexOf('class="route-return-links"') > main.indexOf('id="other-categories-heading"'));
  }
  if (withHead) {
    const title = `${route.category.name} | My Square Face Icon`, url = `${site}/category/${slug}`;
    assert.equal(text(html.match(/<title>(.*?)<\/title>/)[1]), title);
    assert.equal(meta(html, "description"), route.category.description);
    const canonical = [...html.matchAll(/<link\b[^>]*>/g)].map(m => attributes(m[0])).filter(a => a.rel === "canonical");
    assert.deepEqual(canonical.map(a => a.href), [url]);
    assert.equal(meta(html, "robots"), "noindex, follow"); assert.equal(meta(html, "googlebot"), "noindex, follow");
    for (const [key, value] of Object.entries({ "og:type": "website", "og:title": title, "og:description": route.category.description, "og:url": url, "og:site_name": "My Square Face Icon", "og:image": site + "/og-image.svg", "og:image:width": "1200", "og:image:height": "630", "og:image:alt": "My Square Face Icon brand illustration" })) assert.equal(meta(html, key, "property"), value, key);
    for (const [key, value] of Object.entries({ "twitter:card": "summary_large_image", "twitter:title": title, "twitter:description": route.category.description, "twitter:image": site + "/og-image.svg" })) assert.equal(meta(html, key), value, key);
  }
}

same(routes.map(r => r.category.slug), slugs, "five existing categories only");
same(routes.map(r => r.games.length), [2, 3, 1, 2, 1], "unchanged real counts");
same(page.generateStaticParams(), slugs.map(slug => ({ slug })), "static allowlist unchanged");
const documents = {};
for (const route of routes) {
  const slug = route.category.slug, metadata = page.generateMetadata(props(slug)), html = render(React.createElement(page.default, props(slug)));
  const legacyHtml = beforeFavoritesMarkup(html);
  documents[slug] = html; checkDocument(html, slug); assertions++;
  same(sha(legacyHtml), contract.categories[slug].afterSsrSha256, "whole real SSR exact " + slug);
  same(metadata, contract.categories[slug].afterMetadata, "exact metadata " + slug);
  same(metadata.robots, { index: false, follow: true, googleBot: { index: false, follow: true } }, "noindex " + slug);
  same(sha(beforeCategoryRemainingMarkup(legacyHtml, slug)), contract.categories[slug].beforeSsrSha256, "old whole SSR after exact inverse " + slug);
  same(sha(JSON.stringify(beforeCategoryRemainingMetadata(metadata, slug))), contract.categories[slug].beforeMetadataSha256, "old metadata after inverse " + slug);
  if (copy[slug]) {
    same(route.games.map(g => g.id), copy[slug].ids, "approved membership " + slug);
    const before = JSON.stringify(route), resolved = content.resolveRemainingCategoryContent(route, routes);
    same(resolved.paragraphs.map(p => p.parts.map(part => typeof part === "string" ? part : part.text).join("")), copy[slug].paragraphs, "approved exact copy " + slug);
    same(resolved.omittedParagraphIds, [], "all dependencies currently valid " + slug); same(JSON.stringify(route), before, "resolver is pure " + slug);
  } else same(content.resolveRemainingCategoryContent(route, routes), undefined, "sample is not reimplemented");
}
same(contract.categories["face-makers"].beforeSsrSha256, contract.categories["face-makers"].afterSsrSha256, "Face Makers freeze not replaced by new golden");

for (const slug of Object.keys(copy)) {
  const html = documents[slug];
  for (const [before, after] of [[copy[slug].heading, "Unapproved heading"], [copy[slug].paragraphs[0], "All avatars are licensed for commercial use."], ['data-ad-eligible="false"', 'data-ad-eligible="true"'], ['data-navigation="document"', 'data-navigation="client"'], ['"numberOfItems":' + copy[slug].ids.length, '"numberOfItems":99'], ['data-category-slug="face-makers"', 'data-category-slug="racing"']]) {
    assert.ok(html.includes(before), "negative mutation must apply"); rejects(() => checkDocument(html.replace(before, after), slug), "render mutation " + slug + " " + before);
  }
  rejects(() => checkDocument(html.replace('</main>', '<p>Unapproved extra content</p></main>'), slug), "extra visible content " + slug);
  rejects(() => beforeCategoryRemainingMarkup(beforeFavoritesMarkup(html.replace(copy[slug].heading, "Unexpected")), slug), "inverse cannot swallow new copy drift " + slug);
  const metadata = plain(page.generateMetadata(props(slug)));
  for (const mutate of [m => { m.robots.index = true; }, m => { m.alternates.canonical = site; }, m => { m.openGraph.title = "Wrong"; }, m => { m.twitter.images = ["/fake.png"]; }, m => { m.extra = "unapproved"; }]) {
    const fixture = plain(metadata); mutate(fixture); rejects(() => beforeCategoryRemainingMetadata(fixture, slug), "metadata inverse mutation " + slug);
  }
}

// Dependency mutation tests exercise the real resolver, not a copied algorithm.
const dependencyCases = [
  ["avatar-makers", "square-face", "onsite-choice"], ["avatar-makers", "oval-face", "onsite-choice"], ["avatar-makers", "pixel-art-avatar", "external-access"],
  ["pixel-avatars", "pixel-art-avatar", "external-boundary"], ["retro-flash", "square-face", "click-to-load"], ["retro-flash", "oval-face", "click-to-load"],
  ["character-creators", "pixel-art-avatar", "current-collection"]
];
for (const [slug, id, omitted] of dependencyCases) {
  const original = routes.find(r => r.category.slug === slug);
  for (const mutation of [r => { r.name = "Changed name"; }, r => { r.id = "forged"; }, r => { r.route.path = "/changed"; }, r => { r.route.existingPublishedRoute = false; }, r => { r.status = "BROKEN"; }, r => { r.pageType = "GUIDE"; }, r => { r.type = "IFRAME"; }, r => { r.player.type = "HTML5"; }, ...(id === "pixel-art-avatar" ? [r => { r.player.directLinkOnly = false; }, r => { r.license.releaseDecision = "APPROVED"; }] : [r => { r.player.clickToLoad = false; }])]) {
    const route = plain(original); mutation(route.games.find(g => g.id === id));
    const result = content.resolveRemainingCategoryContent(route, routes);
    ok(result.omittedParagraphIds.includes(omitted), "changed dependency omitted " + slug + " " + id); negativeFixtures++;
  }
  for (const mutate of [r => { r.games = r.games.filter(g => g.id !== id); }, r => { r.games.push(r.games.find(g => g.id === id)); }]) {
    const route = plain(original); mutate(route);
    ok(content.resolveRemainingCategoryContent(route, routes).omittedParagraphIds.includes(omitted), "missing/duplicate dependency omitted " + slug); negativeFixtures++;
  }
}
for (const slug of ["pixel-avatars", "character-creators"]) {
  const route = routes.find(r => r.category.slug === slug), secondId = slug === "pixel-avatars" ? "source-and-alternative" : "face-alternative";
  for (const alternative of [[], routes.filter(r => r.category.slug !== "face-makers"), [...routes, routes[0]], routes.map(r => r.category.slug === "face-makers" ? { ...r, games: r.games.slice(0, 1) } : r), routes.map(r => r.category.slug === "face-makers" ? { ...r, games: r.games.map(g => ({ ...g, name: "Changed" })) } : r)]) {
    const result = content.resolveRemainingCategoryContent(route, alternative);
    ok(result.omittedParagraphIds.includes(secondId), "unavailable face alternative omitted " + slug);
    same(result.paragraphs.length, 1, "valid first paragraph retained " + slug); negativeFixtures++;
  }
}
const character = plain(routes.find(r => r.category.slug === "character-creators"));
character.games.push({ ...character.games[0], id: "future-character" });
ok(content.resolveRemainingCategoryContent(character, routes).omittedParagraphIds.includes("current-collection"), "expanded collection cannot retain singular claim"); negativeFixtures++;
for (const slug of ["unknown", "__proto__", "constructor", "FACE-MAKERS"]) {
  same(content.resolveRemainingCategoryContent({ ...routes[0], category: { ...routes[0].category, slug } }, routes), undefined, "copy allowlist " + slug);
  rejects(() => page.default(props(slug)), "unknown page real notFound " + slug);
  same(page.generateMetadata(props(slug)).robots, { index: false, follow: false }, "unknown noindex " + slug);
}
function pageFor(records) {
  return modules({ "lib/games/categories.ts": {
    listDirectoryCategoryRoutes: () => categories.listDirectoryCategoryRoutes(records),
    resolveDirectoryCategoryRoute: slug => categories.resolveDirectoryCategoryRoute(slug, records),
    getDirectoryCategoryStaticParams: () => categories.getDirectoryCategoryStaticParams(records)
  } }).load(pageFile);
}
const externalOnly = pageFor([gameCatalog[2]]);
const externalHtml = render(React.createElement(externalOnly.default, props("avatar-makers")));
ok(!text(externalHtml).includes(copy["avatar-makers"].paragraphs[0]), "real SSR omits absent on-site explanation");
ok(text(externalHtml).includes(copy["avatar-makers"].paragraphs[1]), "real SSR retains external explanation");
ok(!body(externalHtml).includes('/category/face-makers'), "no unavailable category links");
for (const slug of ["pixel-avatars", "character-creators"]) {
  const html = render(React.createElement(externalOnly.default, props(slug)));
  ok(!body(html).includes('/category/face-makers'), "real SSR omits absent face link " + slug);
  same((body(beforeFavoritesMarkup(html)).match(/data-game-id=/g) ?? []).length, 1, "real card preserved " + slug);
}
const noCatalog = pageFor([]); same(noCatalog.generateStaticParams(), [], "empty category static params");
for (const slug of slugs) { rejects(() => noCatalog.default(props(slug)), "empty category throws notFound"); same(noCatalog.generateMetadata(props(slug)).robots, { index: false, follow: false }, "empty metadata"); }

for (const file of Object.keys(deltas)) {
  ok(beforeCategoryRemainingSource(file, readFileSync(resolve(root, file))), "raw approved inverse " + file);
  ok(beforeCategoryRemainingSource(file, read(file).replace(/\r\n/g, "\n")), "LF approved inverse " + file);
  rejects(() => beforeCategoryRemainingSource(file, read(file) + "\n// unrelated\n"), "extra source change rejected " + file);
  const edit = deltas[file].edits.find(e => e.after.length > 0);
  if (edit) rejects(() => beforeCategoryRemainingSource(file, read(file).slice(0, edit.offset) + "X" + read(file).slice(edit.offset)), "changed fragment rejected " + file);
}
for (const [file, expected] of Object.entries(contract.frozenFiles)) same(sha(beforeRelatedGamesSource(file, readFileSync(resolve(root, file)))), expected, "frozen " + file);
same(sha(readFileSync(resolve(root, contract.newRuntime.path))), contract.newRuntime.sha256, "approved new helper source");
assert.doesNotMatch(read(contract.newRuntime.path), /["']use client["']|fetch\(|localStorage/); assertions++;

const args = process.argv.slice(2);
assert.ok(args.length === 0 || (args.length === 1 && args[0] === "--built") || (args.length === 2 && args[0] === "--base"), "usage: category-remaining:check [-- --built | -- --base http://127.0.0.1:3100]");
if (args.length) {
  let base;
  if (args[0] === "--base") { base = new URL(args[1]); assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname) && /^https?:$/.test(base.protocol) && base.pathname === "/" && !base.search && !base.hash && !base.username && !base.password); }
  const get = async path => { const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(10000) }); assert.equal(response.status, 200, path); return response.text(); };
  for (const slug of slugs) {
    const built = read(`.next/server/app/category/${slug}.html`), html = base ? await get(`/category/${slug}`) : built;
    if (base) same(html, built, "served artifact identity " + slug);
    checkDocument(html, slug, true); assertions++;
    for (const [before, after] of [['name="robots" content="noindex, follow"', 'name="robots" content="index, follow"'], [`rel="canonical" href="${site}/category/${slug}"`, `rel="canonical" href="${site}/"`], ['property="og:image" content="' + site + '/og-image.svg"', 'property="og:image" content="' + site + '/fake.png"'], ['name="twitter:card" content="summary_large_image"', 'name="twitter:card" content="summary"']]) {
      assert.ok(html.includes(before), "negative head mutation must apply"); rejects(() => checkDocument(html.replace(before, after), slug, true), "built/HTTP head mutation " + slug);
    }
  }
  const sitemap = base ? await get('/sitemap.xml') : read('.next/server/app/sitemap.xml.body');
  ok(!sitemap.includes(site + '/category/'), "all categories excluded from sitemap");
  if (base) for (const path of ["/category", "/category/unknown", "/category/face-makers/extra"]) {
    const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(10000) }); same(response.status, 404, "true 404 " + path); ok((await response.text()).includes("noindex"), "404 noindex " + path);
  }
}
console.log(JSON.stringify({ task: "CATEGORY-001", scope: "CATEGORY_REMAINING_PAGES", result: "PASS", assertions, negativeFixtures, mode: args[0] ?? "source/SSR", humanReview: "not completed", browser: "separate evidence required", indexing: "noindex remains; independent search value not certified" }));
