import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import HomeDiscoveryRegion from "../components/home/HomeDiscoveryRegion";
import ovalFaceGame from "../data/games/oval-face";
import squareFaceGame from "../data/games/square-face";
import { gameCatalog } from "../lib/games/catalog";
import type { GameRecord } from "../lib/games/game-schema";
import {
  resolveHomeDiscovery,
  resolveHomeFeaturedGames,
  resolveHomeNewGames
} from "../lib/games/home-discovery";

const projectRoot = resolve(__dirname, "../..");
const currentDiscovery = resolveHomeDiscovery(squareFaceGame);

assert.deepEqual(
  currentDiscovery.featuredGames.map((game) => game.id),
  ["oval-face", "pixel-art-avatar", "friend-block-test"],
  "Related must follow the shared Category + Tags score order."
);
assert.deepEqual(
  currentDiscovery.newGames,
  [],
  "Current UNKNOWN/null publication timestamps must not create a New Games module."
);
assert.deepEqual(
  currentDiscovery.categories.map(({ category, games }) => [category.slug, games.length]),
  [
    ["face-makers", 2],
    ["avatar-makers", 3],
    ["pixel-avatars", 1],
    ["retro-flash", 2],
    ["character-creators", 1],
    ["friend-quizzes", 1]
  ]
);

const currentMarkup = renderToStaticMarkup(
  <HomeDiscoveryRegion
    featuredGames={currentDiscovery.featuredGames}
    newGames={currentDiscovery.newGames}
    categories={currentDiscovery.categories}
  />
);

assert.match(currentMarkup, /data-home-section="discovery"/);
assert.match(currentMarkup, /data-home-module="related"/);
assert.match(currentMarkup, /data-home-module="categories"/);
assert.match(currentMarkup, />Related Avatar Games</);
assert.match(currentMarkup, /Matched from published games that share avatar categories or tags with Square Face Generator./);
assert.match(currentMarkup, /aria-label="Related avatar games"/);
assert.doesNotMatch(currentMarkup, /data-home-module="new"|>New Games</);
assert.equal((currentMarkup.match(/data-game-card-variant="home-media"/g) ?? []).length, 3);
assert.match(currentMarkup, /data-game-id="oval-face"/);
assert.match(currentMarkup, /data-game-id="pixel-art-avatar"/);
assert.match(currentMarkup, /oval-face-icon\.png/);
assert.match(currentMarkup, /gamer\.webp/);
assert.match(currentMarkup, /Oval Face Icon Generator preview/);
assert.match(currentMarkup, /Pixel-friendly gamer avatar preview/);
assert.match(currentMarkup, /route-game-link-external/);
assert.match(currentMarkup, /External tool/);
assert.match(currentMarkup, /href="\/pixel-art-avatar-icon-generator"/);
assert.doesNotMatch(currentMarkup, /target="_blank"/);
assert.equal((currentMarkup.match(/data-category-chip-variant="home-discovery"/g) ?? []).length, 6);
for (const countLabel of ["2 current entries", "3 current entries", "1 current entry"]) {
  assert.match(currentMarkup, new RegExp(countLabel));
}
assert.doesNotMatch(currentMarkup, /Popular|Trending|rating|users/i);
assert.doesNotMatch(
  currentMarkup,
  /href="\/(?:free-avatar-maker|gallery|blog|square-face-icon-generator)"/,
  "Support content must remain outside the Games discovery region."
);

const ignoredRelationFixture = {
  ...squareFaceGame,
  relatedGameIds: ["pixel-art-avatar", "missing-game"]
} satisfies GameRecord;
assert.deepEqual(
  resolveHomeFeaturedGames(ignoredRelationFixture).map((game) => game.id),
  ["oval-face", "pixel-art-avatar", "friend-block-test"],
  "Related selection must ignore legacy relatedGameIds ordering and use shared overlap scoring."
);

const verifiedNewGame = {
  ...ovalFaceGame,
  id: "verified-new-avatar",
  name: "Verified New Avatar",
  slug: "verified-new-avatar",
  route: {
    ...ovalFaceGame.route,
    path: "/verified-new-avatar",
    canonical: "https://mysquarefaceicon.com/verified-new-avatar",
    existingPublishedRoute: true
  },
  category: { primary: "pixel-avatars", secondary: ["character-creators"] },
  tags: ["verified-new-fixture"],
  relatedGameIds: [],
  publication: {
    publishedAt: "2026-08-30T12:00:00.000Z",
    modifiedAt: null,
    timestampStatus: "VERIFIED",
    note: "Task fixture with a verified publication timestamp."
  }
} satisfies GameRecord;

const invalidTimestampGame = {
  ...verifiedNewGame,
  id: "invalid-new-avatar",
  name: "Invalid New Avatar",
  slug: "invalid-new-avatar",
  route: {
    ...verifiedNewGame.route,
    path: "/invalid-new-avatar",
    canonical: "https://mysquarefaceicon.com/invalid-new-avatar"
  },
  publication: {
    ...verifiedNewGame.publication,
    publishedAt: "not-a-timestamp"
  }
} satisfies GameRecord;

const fixtureRecords = [...gameCatalog, invalidTimestampGame, verifiedNewGame];
assert.deepEqual(
  resolveHomeNewGames(
    squareFaceGame,
    fixtureRecords,
    currentDiscovery.featuredGames.map((game) => game.id)
  ).map((game) => game.id),
  ["verified-new-avatar"],
  "New must include only published records with a valid VERIFIED timestamp and exclude Featured records."
);

const fixtureDiscovery = resolveHomeDiscovery(squareFaceGame, fixtureRecords);
const fixtureMarkup = renderToStaticMarkup(
  <HomeDiscoveryRegion
    featuredGames={fixtureDiscovery.featuredGames}
    newGames={fixtureDiscovery.newGames}
    categories={fixtureDiscovery.categories}
  />
);
assert.match(fixtureMarkup, /data-home-module="new"/);
assert.match(fixtureMarkup, />New Games</);
assert.match(fixtureMarkup, /data-game-id="verified-new-avatar"/);
assert.doesNotMatch(fixtureMarkup, /data-game-id="invalid-new-avatar"/);

assert.equal(
  renderToStaticMarkup(<HomeDiscoveryRegion featuredGames={[]} newGames={[]} categories={[]} />),
  "",
  "The complete discovery section must not render when every module is empty."
);

const gameCardSource = readFileSync(resolve(projectRoot, "components/game/GameCard.tsx"), "utf8");
assert.match(gameCardSource, /getGameImage\(game, "THUMBNAIL"\)/);
assert.doesNotMatch(
  gameCardSource,
  /["']\/(?:games\/oval-face-icon\.png|game-face-samples\/gamer\.webp)["']/,
  "The shared card must resolve thumbnail paths from Game Data instead of hard-coding them."
);

const homePageSource = readFileSync(resolve(projectRoot, "components/HomePage.tsx"), "utf8");
assert.match(homePageSource, /resolveHomeDiscovery\(squareFaceGame\)/);
assert.match(homePageSource, /newGames=\{homeDiscovery\.newGames\}/);

const discoverySource = readFileSync(resolve(projectRoot, "components/home/HomeDiscoveryRegion.tsx"), "utf8");
assert.doesNotMatch(discoverySource, /["']use client["']|localStorage|sessionStorage/);
assert.match(discoverySource, /data-home-module="new"/);

const cssSource = readFileSync(resolve(projectRoot, "app/globals.css"), "utf8");
for (const className of [
  ".game-list-card-home-media",
  ".home-game-card-media",
  ".home-game-card-copy",
  ".category-chip-home",
  ".home-category-list"
]) {
  assert.match(cssSource, new RegExp(className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
assert.match(cssSource, /\.home-category-list\s*\{[\s\S]*?repeat\(5, minmax\(0, 1fr\)\)/);
assert.match(
  cssSource,
  /@media \(max-width:\s*760px\)[\s\S]*?\.home-category-list\s*\{[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)/
);
assert.match(cssSource, /route-game-link-external[\s\S]*?border:\s*2px dashed #ff9a42/);

console.log("HOME-DISC-001 validation passed");
console.log("- Related uses the shared Category + Tags selector and ignores legacy relatedGameIds order");
console.log("- New requires a valid VERIFIED publication timestamp and is absent for current UNKNOWN data");
console.log("- cards use real Game Data thumbnails; Pixel remains an onsite External Tool details link");
console.log("- six non-empty categories render with truthful counts; all-empty discovery renders nothing");
console.log("- desktop media cards and the compact two-column mobile category layout are present");
