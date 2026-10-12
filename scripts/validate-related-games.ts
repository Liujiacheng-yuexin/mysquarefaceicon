import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { gameCatalog, getGameById } from "../lib/games/catalog";
import type { GameRecord, GameStatus, NonEmptyReadonlyArray } from "../lib/games/game-schema";
import { selectRelatedGames } from "../lib/recommendations/related-games";

const projectRoot = resolve(__dirname, "../..");
function requireGame(id: string): GameRecord {
  const game = getGameById(id);
  assert.ok(game, `Missing test game ${id}.`);
  return game;
}

const square = requireGame("square-face");
const oval = requireGame("oval-face");
const pixel = requireGame("pixel-art-avatar");

let assertions = 0;
function same<T>(actual: T, expected: T, message: string) {
  assert.deepEqual(actual, expected, message);
  assertions += 1;
}
function ok(value: unknown, message: string) {
  assert.ok(value, message);
  assertions += 1;
}
function rejects(action: () => unknown, message: string) {
  assert.throws(action, RangeError, message);
  assertions += 1;
}

function makeExternalCandidate(
  id: string,
  primary: string,
  secondary: readonly string[],
  tags: NonEmptyReadonlyArray<string>
): GameRecord {
  const canonical = `https://mysquarefaceicon.com/games/${id}`;
  return {
    ...pixel,
    id,
    name: `${id} candidate`,
    slug: id,
    route: { ...pixel.route, path: `/games/${id}`, canonical, existingPublishedRoute: false },
    license: { ...pixel.license, registryRecordId: `${id}-registry` },
    category: { primary, secondary },
    tags,
    seo: {
      ...pixel.seo,
      canonical,
      title: `${id} candidate title`,
      description: `${id} candidate description for deterministic related-game validation.`
    },
    relatedGameIds: [],
    publication: { ...pixel.publication, note: `${id} test fixture with no verified popularity timestamp.` }
  };
}

const realInputSnapshot = JSON.stringify(gameCatalog);
const real = selectRelatedGames(oval);
same(real.recommendations.map(({ game }) => game.id), ["square-face", "pixel-art-avatar"], "real Oval order");
same(real.recommendations[0].sharedCategories, ["face-makers", "avatar-makers", "retro-flash"], "Square category overlap");
same(real.recommendations[0].sharedTags, ["avatar-maker", "flash-game", "ruffle"], "Square tag overlap");
same(real.recommendations[1].sharedCategories, ["avatar-makers"], "Pixel category overlap");
same(real.recommendations[1].sharedTags, [], "Pixel tag overlap");
same(real.diagnostics.currentStatus, "ELIGIBLE", "real current eligibility");
same(real.diagnostics.qualityPopularity, "DISABLED_NO_VERIFIED_DATA", "quality and popularity disabled");
same(JSON.stringify(gameCatalog), realInputSnapshot, "real catalog remains unchanged");
ok(gameCatalog.every((game) => game.measurements.qualityScore === null), "current quality values remain unknown");
ok(gameCatalog.every((game) => !("popularity" in game)), "no popularity field is invented");

const realSquare = selectRelatedGames(square);
same(realSquare.recommendations.map(({ game }) => game.id), ["oval-face", "pixel-art-avatar", "friend-block-test"], "real Square order");
same(realSquare.recommendations[0].sharedCategories, ["face-makers", "avatar-makers", "retro-flash"], "Square to Oval category overlap");
same(realSquare.recommendations[0].sharedTags, ["avatar-maker", "flash-game", "ruffle"], "Square to Oval tag overlap");
same(realSquare.recommendations[1].sharedCategories, ["avatar-makers"], "Square to Pixel category overlap");
same(realSquare.recommendations[1].sharedTags, ["profile-icon"], "Square to Pixel tag overlap");

const realPixel = selectRelatedGames(pixel);
same(realPixel.recommendations.map(({ game }) => game.id), ["square-face", "oval-face", "friend-block-test"], "real Pixel order");
same(realPixel.recommendations[0].sharedCategories, ["avatar-makers"], "Pixel to Square category overlap");
same(realPixel.recommendations[0].sharedTags, ["profile-icon"], "Pixel to Square tag overlap");
same(realPixel.recommendations[1].sharedCategories, ["avatar-makers"], "Pixel to Oval category overlap");
same(realPixel.recommendations[1].sharedTags, [], "Pixel to Oval tag overlap");

const categoryWinner = makeExternalCandidate("category-winner", "face-makers", ["avatar-makers"], ["unrelated-tag"]);
const tagHeavy = makeExternalCandidate("tag-heavy", "avatar-makers", [], ["avatar-maker", "flash-game", "rounded-icon", "ruffle"]);
same(
  selectRelatedGames(oval, [oval, tagHeavy, categoryWinner]).recommendations.map(({ game }) => game.id),
  ["category-winner", "tag-heavy"],
  "category count outranks tag count"
);

const twoTags = makeExternalCandidate("two-tags", "avatar-makers", [], ["avatar-maker", "ruffle"]);
const oneTag = makeExternalCandidate("one-tag", "avatar-makers", [], ["avatar-maker"]);
same(
  selectRelatedGames(oval, [oval, oneTag, twoTags]).recommendations.map(({ game }) => game.id),
  ["two-tags", "one-tag"],
  "tag count breaks equal-category ties"
);

const alpha = makeExternalCandidate("alpha-related", "avatar-makers", [], ["avatar-maker"]);
const zeta = makeExternalCandidate("zeta-related", "avatar-makers", [], ["avatar-maker"]);
const stableInput = [oval, zeta, alpha];
const stableSnapshot = JSON.stringify(stableInput);
same(selectRelatedGames(oval, stableInput).recommendations.map(({ game }) => game.id), ["alpha-related", "zeta-related"], "ID breaks full ties");
same(selectRelatedGames(oval, [...stableInput].reverse()).recommendations.map(({ game }) => game.id), ["alpha-related", "zeta-related"], "input order does not affect output");
same(JSON.stringify(stableInput), stableSnapshot, "synthetic input remains unchanged");

same(selectRelatedGames(oval, gameCatalog, 1).recommendations.map(({ game }) => game.id), ["square-face"], "limit one");
same(selectRelatedGames(oval, gameCatalog, 0).recommendations, [], "limit zero");
rejects(() => selectRelatedGames(oval, gameCatalog, -1), "negative limit rejected");
rejects(() => selectRelatedGames(oval, gameCatalog, 1.5), "fractional limit rejected");
rejects(() => selectRelatedGames(oval, gameCatalog, Number.POSITIVE_INFINITY), "infinite limit rejected");
rejects(() => selectRelatedGames(oval, gameCatalog, 9), "over-maximum limit rejected");

const unrelated = makeExternalCandidate("unrelated", "pixel-avatars", ["character-creators"], ["pixel-art", "direct-link"]);
same(selectRelatedGames(oval, [oval, unrelated]).recommendations, [], "unrelated candidates do not pad results");
same(selectRelatedGames(oval, [square, pixel]).diagnostics.currentStatus, "NOT_ELIGIBLE", "missing current record");
same(selectRelatedGames({} as GameRecord, gameCatalog).diagnostics.currentStatus, "INVALID", "invalid current record");
same(selectRelatedGames(oval, null as unknown as readonly GameRecord[]).diagnostics.currentStatus, "NOT_ELIGIBLE", "invalid record collection fails closed");
const withInvalid = selectRelatedGames(oval, [...gameCatalog, {} as GameRecord]);
same(withInvalid.recommendations.map(({ game }) => game.id), ["square-face", "pixel-art-avatar"], "invalid candidate excluded");
same(withInvalid.diagnostics.invalidRecordCount, 1, "invalid candidate diagnosed");

const duplicateSquare = { ...square, name: "conflicting square identity" };
const identityConflict = selectRelatedGames(oval, [...gameCatalog, duplicateSquare]);
same(identityConflict.recommendations.map(({ game }) => game.id), ["pixel-art-avatar"], "all duplicate identity records excluded");
same(identityConflict.diagnostics.conflictingIds, ["square-face"], "duplicate ID diagnosed");
same(identityConflict.diagnostics.conflictingPaths, ["/"], "duplicate path diagnosed");

const sharedPathLeft = makeExternalCandidate("shared-path-left", "avatar-makers", [], ["avatar-maker"]);
const sharedPathRight = {
  ...makeExternalCandidate("shared-path-right", "avatar-makers", [], ["avatar-maker"]),
  slug: sharedPathLeft.slug,
  route: { ...sharedPathLeft.route },
  seo: { ...sharedPathLeft.seo, title: "shared path right candidate title" }
};
const pathConflict = selectRelatedGames(oval, [oval, sharedPathLeft, sharedPathRight]);
same(pathConflict.recommendations, [], "all duplicate-path records excluded");
same(pathConflict.diagnostics.conflictingPaths, ["/games/shared-path-left"], "duplicate candidate path diagnosed");

const fakeLegacy = {
  ...square,
  id: "fake-legacy",
  name: "fake legacy",
  slug: "fake-legacy",
  route: { ...square.route, path: "/fake-legacy", canonical: "https://mysquarefaceicon.com/fake-legacy" },
  seo: {
    ...square.seo,
    title: "Fake legacy title",
    description: "Fake legacy description used only as a negative recommendation fixture.",
    canonical: "https://mysquarefaceicon.com/fake-legacy"
  }
} as GameRecord;
same(selectRelatedGames(oval, [oval, fakeLegacy]).recommendations, [], "fake legacy flag cannot bypass catalog identity gate");

const blockedNew = { ...alpha, license: { ...alpha.license, newPublicationAllowed: false } };
same(selectRelatedGames(oval, [oval, blockedNew]).recommendations, [], "new publication permission is required");
for (const status of ["DRAFT", "REVIEW", "TRENDING", "DECLINING", "BROKEN", "ARCHIVED"] as const satisfies readonly GameStatus[]) {
  const candidate = { ...alpha, status };
  same(selectRelatedGames(oval, [oval, candidate]).recommendations, [], `${status} candidate excluded`);
}

const qualityLowCategoryWinner = { ...categoryWinner, measurements: { ...categoryWinner.measurements, qualityScore: 1 } };
const qualityHighTagHeavy = { ...tagHeavy, measurements: { ...tagHeavy.measurements, qualityScore: 100 } };
same(
  selectRelatedGames(oval, [oval, qualityHighTagHeavy, qualityLowCategoryWinner]).recommendations.map(({ game }) => game.id),
  ["category-winner", "tag-heavy"],
  "quality values do not influence this stage"
);

const pageSource = readFileSync(resolve(projectRoot, "app/oval-face-icon-generator/page.tsx"), "utf8");
for (const text of [
  "selectRelatedGames(ovalFaceGame)",
  "Related avatar games and tools",
  "Avatar guides and inspiration",
  "External tool",
  "View access details",
  "Square Face Icon Guide",
  "Free Avatar Maker",
  "Community Gallery"
]) ok(pageSource.includes(text), `Oval source includes ${text}`);
ok(!pageSource.includes("ovalPage.relatedCards.map"), "mixed manual game-card loop removed");
same((pageSource.match(/href="\/square-face-icon-generator"/g) ?? []).length, 2, "guide and footer links preserved");
same((pageSource.match(/href="\/free-avatar-maker"/g) ?? []).length, 2, "avatar guide and footer links preserved");
same((pageSource.match(/href="\/gallery"/g) ?? []).length, 2, "gallery and footer links preserved");

const homeResolverSource = readFileSync(resolve(projectRoot, "lib/games/home-discovery.ts"), "utf8");
ok(homeResolverSource.includes("selectRelatedGames(currentGame, records)"), "Homepage resolver uses shared selector");
ok(!homeResolverSource.includes("currentGame.relatedGameIds"), "Homepage resolver no longer sorts from relatedGameIds");
const sharedComponentSource = readFileSync(resolve(projectRoot, "components/game/RelatedGames.tsx"), "utf8");
ok(sharedComponentSource.includes("selectRelatedGames(game, records, limit)"), "Shared template component uses shared selector");
ok(!sharedComponentSource.includes("relatedGameIds"), "Shared template component no longer sorts from relatedGameIds");
const pixelPageSource = readFileSync(resolve(projectRoot, "app/pixel-art-avatar-icon-generator/page.tsx"), "utf8");
for (const text of [
  "selectRelatedGames(pixelArtAvatarGame)",
  "Related Avatar Games",
  "Pixel Avatar Guide",
  "data-game-id={game.id}",
  "data-game-page-type={game.pageType}"
]) ok(pixelPageSource.includes(text), `Pixel source includes ${text}`);

console.log("RELATED-001 validation passed");
console.log(`- ${assertions} algorithm, boundary, immutability, and Oval source assertions passed`);
console.log("- real Oval order: Square (3 categories / 3 tags), Pixel External (1 category / 0 tags)");
console.log("- quality/popularity remain disabled; unrelated candidates are not used as fillers");

function sectionByLabel(html: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(new RegExp(`<section[^>]*aria-labelledby="${escaped}"[^>]*>[\\s\\S]*?<\\/section>`))?.[0] ?? "";
}

function sectionContaining(html: string, marker: string) {
  return [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)]
    .map(([section]) => section)
    .find((section) => section.includes(marker)) ?? "";
}

async function validateRenderedOutput() {
  const args = process.argv.slice(2);
  assert.ok(
    args.length === 0 || (args.length === 1 && args[0] === "--built") || (args.length === 2 && args[0] === "--base"),
    "usage: npm run related:check [-- --built | -- --base http://127.0.0.1:3000]"
  );
  if (args.length === 0) return;

  const builtPath = resolve(projectRoot, ".next/server/app/oval-face-icon-generator.html");
  const built = readFileSync(builtPath, "utf8");
  let html = built;
  let mode = "built HTML";
  if (args[0] === "--base") {
    const base = new URL(args[1]);
    assert.ok(["http:", "https:"].includes(base.protocol));
    assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(base.hostname));
    assert.equal(base.pathname, "/");
    assert.ok(!base.search && !base.hash && !base.username && !base.password);
    const response = await fetch(new URL("/oval-face-icon-generator", base), {
      redirect: "manual",
      signal: AbortSignal.timeout(10_000)
    });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /text\/html/i);
    assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex|none/i);
    html = await response.text();
    assert.equal(html, built, "loopback output must match the current production build artifact");
    mode = "loopback HTTP";
  }

  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  ok(main.length > 0, `${mode} has a non-empty main`);
  const games = sectionByLabel(main, "related-avatar-games-heading");
  const guides = sectionByLabel(main, "avatar-guides-heading");
  ok(games.length > 0, `${mode} includes the game recommendation group`);
  ok(guides.length > 0, `${mode} includes the separate guide group`);
  same((games.match(/<a\b/g) ?? []).length, 2, `${mode} game-card count`);
  same((guides.match(/<a\b/g) ?? []).length, 3, `${mode} guide-card count`);
  ok(games.indexOf('data-game-id="square-face"') < games.indexOf('data-game-id="pixel-art-avatar"'), `${mode} preserves algorithm order`);
  assert.match(games, /<a class="related-card" data-game-id="square-face" data-game-page-type="GAME" href="\/">[\s\S]*?<h3>Square Face Generator<\/h3><p>Play the square-shaped version of the classic face icon maker\.<\/p><\/a>/);
  assertions += 1;
  assert.match(games, /<a class="related-card route-game-link-external" data-game-id="pixel-art-avatar" data-game-page-type="EXTERNAL_TOOL" href="\/pixel-art-avatar-icon-generator">[\s\S]*?<span class="route-game-type">External tool<\/span><h3>Pixel Art Avatar Icon Generator<\/h3><p>Open the original icongenerators\.net pixel avatar maker with visible attribution, usage tips, and a direct-link-only boundary\.<\/p><span class="route-card-action">View access details<\/span><\/a>/);
  assertions += 1;
  assert.doesNotMatch(games, /href="https?:\/\//i);
  assertions += 1;
  const expectedGuides = [
    ["/square-face-icon-generator", "Square Face Icon Guide", "Learn how square face icons work for social and gaming profiles."],
    ["/free-avatar-maker", "Free Avatar Maker", "Compare quick avatar creation workflows for profile pictures."],
    ["/gallery", "Community Gallery", "Browse approved community creations and square face examples."]
  ] as const;
  let previousGuide = -1;
  for (const [href, title, description] of expectedGuides) {
    const marker = `href="${href}"`;
    const index = guides.indexOf(marker);
    ok(index > previousGuide, `${mode} guide order includes ${href}`);
    ok(guides.includes(`<h3>${title}</h3><p>${description}</p>`), `${mode} guide copy includes ${title}`);
    previousGuide = index;
  }
  ok(main.indexOf('id="faq"') < main.indexOf('aria-labelledby="related-avatar-games-heading"'), `${mode} related group follows FAQ`);
  ok(main.indexOf('aria-labelledby="related-avatar-games-heading"') < main.indexOf('aria-labelledby="avatar-guides-heading"'), `${mode} games precede guides`);
  assert.doesNotMatch(main, /ruffle-player|\.wasm(?:[?"']|$)|\.swf(?:[?"']|$)|\/ruffle\//i);
  assertions += 1;
  console.log(`- ${mode}: two related entries, three separate guide cards, internal links, and initial click-to-load boundary passed`);

  async function loadSurface(path: string, artifact: string) {
    const builtSurface = readFileSync(resolve(projectRoot, artifact), "utf8");
    if (args[0] !== "--base") return builtSurface;
    const base = new URL(args[1]);
    const response = await fetch(new URL(path, base), {
      redirect: "manual",
      signal: AbortSignal.timeout(10_000)
    });
    assert.equal(response.status, 200, `${path} status`);
    assert.match(response.headers.get("content-type") ?? "", /text\/html/i);
    assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex|none/i);
    const surface = await response.text();
    assert.equal(surface, builtSurface, `${path} loopback output must match the build artifact`);
    return surface;
  }

  const homeHtml = await loadSurface("/", ".next/server/app/index.html");
  const homeMain = homeHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  const homeRelated = sectionContaining(homeMain, 'data-home-module="related"');
  ok(homeRelated.length > 0, `${mode} homepage includes the Related module`);
  same((homeRelated.match(/<a\b[^>]*data-game-id=/g) ?? []).length, 2, `${mode} homepage related-card link count`);
  ok(homeRelated.indexOf('data-game-id="oval-face"') < homeRelated.indexOf('data-game-id="pixel-art-avatar"'), `${mode} homepage preserves shared selector order`);
  assert.match(homeRelated, /<h3>Related Avatar Games<\/h3>/);
  assertions += 1;
  assert.match(homeRelated, /Matched from published games that share avatar categories or tags with Square Face Generator\./);
  assertions += 1;

  const pixelHtml = await loadSurface(
    "/pixel-art-avatar-icon-generator",
    ".next/server/app/pixel-art-avatar-icon-generator.html"
  );
  const pixelMain = pixelHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  const pixelRelated = sectionContaining(pixelMain, "<h2>Related Avatar Games</h2>");
  const pixelGuide = sectionContaining(pixelMain, "<h2>Pixel Avatar Guide</h2>");
  ok(pixelRelated.length > 0, `${mode} Pixel page includes its related group`);
  ok(pixelGuide.length > 0, `${mode} Pixel page includes its separate guide group`);
  same((pixelRelated.match(/<a\b[^>]*data-game-id=/g) ?? []).length, 2, `${mode} Pixel related-card link count`);
  ok(pixelRelated.indexOf('data-game-id="square-face"') < pixelRelated.indexOf('data-game-id="oval-face"'), `${mode} Pixel preserves shared selector order`);
  assert.match(pixelRelated, /data-game-id="square-face" data-game-page-type="GAME" href="\/"[\s\S]*?<h3>Square Face Generator<\/h3><p>Play the classic square face Flash avatar maker on this site\.<\/p>/);
  assertions += 1;
  assert.match(pixelRelated, /data-game-id="oval-face" data-game-page-type="GAME" href="\/oval-face-icon-generator"[\s\S]*?<h3>Oval Face Icon Generator<\/h3><p>Try a rounded-face companion game with oval profile icon styling\.<\/p>/);
  assertions += 1;
  assert.doesNotMatch(pixelRelated, /href="https?:\/\//i);
  assertions += 1;
  same((pixelGuide.match(/<a\b/g) ?? []).length, 1, `${mode} Pixel guide-card count`);
  assert.match(pixelGuide, /href="\/pixel-square-face-maker"[\s\S]*?<h3>Pixel Square Face Maker Guide<\/h3><p>Read practical pixel-inspired avatar tips for square profile icons\.<\/p>/);
  assertions += 1;
  ok(pixelMain.indexOf("<h2>Related Avatar Games</h2>") < pixelMain.indexOf("<h2>Pixel Avatar Guide</h2>"), `${mode} Pixel keeps games before guide`);
  assert.doesNotMatch(pixelRelated + pixelGuide, /ruffle-player|\.wasm(?:[?"']|$)|\.swf(?:[?"']|$)|\/ruffle\//i);
  assertions += 1;
  console.log(`- ${mode}: homepage and Pixel remaining surfaces use the shared selector; guide separation and initial click-to-load boundary passed`);
}

validateRenderedOutput().catch((error) => {
  console.error(`RELATED-001 rendered validation failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
