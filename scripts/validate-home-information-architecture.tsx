import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeFavoritesMarkup } from "./favorites-markup-compat";
import HomeDiscoveryRegion from "../components/home/HomeDiscoveryRegion";
import HomeResourceLinks from "../components/home/HomeResourceLinks";
import squareFaceGame from "../data/games/square-face";
import { resolveHomeDiscovery } from "../lib/games/home-discovery";

const projectRoot = resolve(__dirname, "../..");
const { featuredGames, newGames, categories } = resolveHomeDiscovery(squareFaceGame);

assert.deepEqual(
  featuredGames.map((game) => game.id),
  ["oval-face", "pixel-art-avatar"],
  "Homepage Related must follow the shared Category + Tags score order."
);
assert.equal(categories.length, 5, "Only the five allowlisted categories with published records should render.");

const discoveryMarkup = beforeFavoritesMarkup(renderToStaticMarkup(
  <HomeDiscoveryRegion featuredGames={featuredGames} newGames={newGames} categories={categories} />
));
assert.match(discoveryMarkup, /data-home-section="discovery"/);
assert.match(discoveryMarkup, /data-home-module="related"/);
assert.match(discoveryMarkup, /data-home-module="categories"/);
assert.equal((discoveryMarkup.match(/data-game-id=/g) ?? []).length, 2);
assert.match(discoveryMarkup, /data-game-id="oval-face"/);
assert.match(discoveryMarkup, /data-game-id="pixel-art-avatar"/);
assert.doesNotMatch(discoveryMarkup, /data-game-id="square-face"/);
assert.match(discoveryMarkup, /External tool/);
assert.equal((discoveryMarkup.match(/data-category-slug=/g) ?? []).length, 5);
assert.doesNotMatch(discoveryMarkup, /Continue Playing|New Games/i, "Empty Continue and New modules must not render.");
assert.doesNotMatch(discoveryMarkup, /Popular|Trending|rating|users/i, "Discovery must not invent popularity signals.");
assert.doesNotMatch(
  discoveryMarkup,
  /href="\/(?:free-avatar-maker|gallery|blog|square-face-icon-generator)"/,
  "Guides, Gallery, and Blog must not appear in the Games discovery region."
);

const resourceMarkup = renderToStaticMarkup(<HomeResourceLinks />);
assert.match(resourceMarkup, /data-home-section="resources"/);
for (const href of ["/free-avatar-maker", "/square-face-icon-generator", "/gallery", "/blog"]) {
  assert.match(resourceMarkup, new RegExp(`href="${href}"`));
}
assert.doesNotMatch(resourceMarkup, /data-game-id=|Browser game|External tool/);

const homePageSource = readFileSync(resolve(projectRoot, "components/HomePage.tsx"), "utf8");
const discoveryIndex = homePageSource.indexOf("<HomeDiscoveryRegion");
const galleryIndex = homePageSource.indexOf("<CuratedGalleryPreview");
const whatIsIndex = homePageSource.indexOf('id="what-is"');
const faqIndex = homePageSource.indexOf('id="faq"');
const resourcesIndex = homePageSource.indexOf("<HomeResourceLinks");
const finalCtaIndex = homePageSource.indexOf('className="home-final-cta"');

for (const [name, index] of [
  ["discovery", discoveryIndex],
  ["gallery", galleryIndex],
  ["what-is", whatIsIndex],
  ["faq", faqIndex],
  ["resources", resourcesIndex],
  ["final CTA", finalCtaIndex]
] as const) {
  assert.ok(index >= 0, `Homepage source must contain ${name}.`);
}
assert.ok(discoveryIndex < galleryIndex, "Discovery must render immediately after the core game and before Gallery.");
assert.ok(galleryIndex < whatIsIndex, "Gallery must remain before the long Square content sections.");
assert.ok(whatIsIndex < faqIndex, "Square explanatory content must retain its semantic order.");
assert.ok(faqIndex < resourcesIndex, "Guides and resources must render after FAQ.");
assert.ok(resourcesIndex < finalCtaIndex, "The final CTA must remain after Guides and Resources.");
assert.match(homePageSource, /locale === "en"/);
assert.match(homePageSource, /isPrimaryHomepage \? \(\s*<HomeHero/);
assert.match(homePageSource, /<GameSidebar items=\{legacyLocaleSidebarItems\}/);
assert.match(homePageSource, /resolveHomeDiscovery\(squareFaceGame\)/);
assert.match(homePageSource, /newGames=\{homeDiscovery\.newGames\}/);

const discoverySource = readFileSync(resolve(projectRoot, "components/home/HomeDiscoveryRegion.tsx"), "utf8");
assert.doesNotMatch(discoverySource, /["']use client["']|localStorage|sessionStorage/);
assert.doesNotMatch(discoverySource, /Continue Playing/);
assert.match(discoverySource, /data-home-module="new"/);

const cssSource = readFileSync(resolve(projectRoot, "app/globals.css"), "utf8");
for (const className of [
  ".home-hero-grid",
  ".home-discovery-section",
  ".home-category-list",
  ".home-resources-section",
  ".home-resource-links"
]) {
  assert.match(cssSource, new RegExp(className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
assert.match(
  cssSource,
  /\.home-game-player-card \.flash-play-panel\s*\{[\s\S]*?right:\s*auto;[\s\S]*?left:\s*50%;[\s\S]*?transform:\s*translateX\(-50%\);[\s\S]*?\}/,
  "The mobile Play button must remain centered in both resting and hover states."
);

console.log("HOME-IA-001 validation passed");
console.log("- Square remains the core section and discovery precedes Gallery and long-form content");
console.log("- Related contains only Oval and Pixel published Game Data; Pixel remains External Tool");
console.log("- five real category routes render; empty Continue/New modules do not render");
console.log("- Guide, Gallery, and Blog links are isolated in the post-FAQ Resources section");
console.log("- the mobile core Play button remains centered in resting and hover states");
