import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ovalFaceGame from "../data/games/oval-face";
import pixelArtAvatarGame from "../data/games/pixel-art-avatar";
import squareFaceGame from "../data/games/square-face";
import friendBlockTest from "../data/games/friend-block-test";
import { isIndexAllowedNewGame } from "../lib/games/friend-quiz-policy";
import { gameCatalog } from "../lib/games/catalog";
import type { GameRecord } from "../lib/games/game-schema";
import { resolveSquareHomepage } from "../lib/games/square-homepage";
import {
  assertValidGameMetadataCatalog,
  buildGameMetadata,
  buildMissingGameMetadata,
  getGamePageH1,
  validateGameMetadataCatalog
} from "../lib/seo/game-metadata";

const projectRoot = resolve(__dirname, "../..");

assert.equal(isIndexAllowedNewGame(friendBlockTest), true);
const deniedNewGames: GameRecord[] = [
  { ...friendBlockTest, id: "different-game" },
  { ...friendBlockTest, slug: "different-slug" },
  { ...friendBlockTest, status: "REVIEW" },
  { ...friendBlockTest, pageType: "EXTERNAL_TOOL" },
  { ...friendBlockTest, route: { ...friendBlockTest.route, indexStatus: "NOINDEX" } },
  { ...friendBlockTest, player: { type: "HTML5", entryUrl: "/games/other/index.html" } },
  { ...friendBlockTest, license: { ...friendBlockTest.license, newPublicationAllowed: false } },
  { ...friendBlockTest, license: { ...friendBlockTest.license, releaseDecision: "REVIEW_REQUIRED" } },
  { ...friendBlockTest, license: { ...friendBlockTest.license, status: "UNKNOWN" } },
  { ...friendBlockTest, license: { ...friendBlockTest.license, allowedDeliveryTypes: [] } },
  { ...friendBlockTest, license: { ...friendBlockTest.license, registryRecordId: "another-record" } }
];
for (const game of deniedNewGames) {
  assert.equal(isIndexAllowedNewGame(game), false);
  assert.equal(JSON.parse(JSON.stringify(buildGameMetadata(game, { forceNoIndex: false }))).robots.index, false);
}
assert.equal(JSON.parse(JSON.stringify(buildGameMetadata(friendBlockTest))).robots, undefined);

assert.doesNotThrow(() => assertValidGameMetadataCatalog(gameCatalog));
assert.equal(resolveSquareHomepage(squareFaceGame).h1, getGamePageH1(squareFaceGame));

for (const game of gameCatalog) {
  const output = JSON.parse(JSON.stringify(buildGameMetadata(game)));
  const openGraphImage = game.images.find((image) => image.role === "OPEN_GRAPH");

  assert.equal(output.title.absolute, game.seo.title, `${game.id} title must come from Game Data.`);
  assert.equal(output.description, game.seo.description, `${game.id} description must come from Game Data.`);
  assert.equal(output.alternates.canonical, game.seo.canonical, `${game.id} canonical must come from Game Data.`);
  assert.equal(output.openGraph.url, game.seo.canonical, `${game.id} OG URL must use the canonical.`);
  assert.equal(output.openGraph.title, game.seo.title, `${game.id} OG title must come from Game Data.`);
  assert.equal(output.openGraph.description, game.seo.description, `${game.id} OG description must come from Game Data.`);
  assert.equal(output.openGraph.images[0].url, openGraphImage?.src, `${game.id} OG image must come from Game Data.`);
  assert.equal(output.twitter.title, game.seo.title, `${game.id} Twitter title must come from Game Data.`);
  assert.equal(output.twitter.description, game.seo.description, `${game.id} Twitter description must come from Game Data.`);
  assert.equal(getGamePageH1(game), game.seo.h1, `${game.id} H1 must come from Game Data.`);
  assert.equal(output.robots, undefined, `${game.id} accepted index state must not gain a noindex directive.`);

  if (game.route.existingPublishedRoute) {
    assert.equal(
      new URL(game.seo.canonical).pathname,
      game.route.path,
      `${game.id} must preserve its legacy canonical pathname.`
    );
  }
}

const futureNoIndexMetadata = JSON.parse(
  JSON.stringify(buildGameMetadata(pixelArtAvatarGame, { forceNoIndex: true }))
);
assert.deepEqual(futureNoIndexMetadata.robots, {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true }
});

const missingMetadata = JSON.parse(JSON.stringify(buildMissingGameMetadata()));
assert.equal(missingMetadata.title.absolute, "Page Not Found | My Square Face Icon");
assert.deepEqual(missingMetadata.robots, {
  index: false,
  follow: false
});

const missingTitleGame = {
  ...squareFaceGame,
  seo: { ...squareFaceGame.seo, title: "" }
} as GameRecord;
assert.throws(
  () => buildGameMetadata(missingTitleGame),
  /seo\.title must be a non-empty string/,
  "Missing SEO fields must fail the build helper."
);

const duplicateMetadataGame = {
  ...ovalFaceGame,
  id: "duplicate-metadata-fixture",
  seo: {
    ...ovalFaceGame.seo,
    title: squareFaceGame.seo.title,
    description: squareFaceGame.seo.description
  }
} as GameRecord;
const duplicateErrors = validateGameMetadataCatalog([squareFaceGame, duplicateMetadataGame]);
assert(duplicateErrors.some((error) => error.includes("duplicates title")));
assert(duplicateErrors.some((error) => error.includes("duplicates description")));

const metadataSources = [
  "app/page.tsx",
  "app/oval-face-icon-generator/page.tsx",
  "app/pixel-art-avatar-icon-generator/page.tsx",
  "app/games/[slug]/page.tsx"
];
for (const relativePath of metadataSources) {
  const source = readFileSync(resolve(projectRoot, relativePath), "utf8");
  assert.match(source, /buildGameMetadata/, `${relativePath} must use the shared metadata builder.`);
}

const h1Sources = [
  "components/HomePage.tsx",
  "app/oval-face-icon-generator/page.tsx",
  "app/pixel-art-avatar-icon-generator/page.tsx"
];
for (const relativePath of h1Sources) {
  const source = readFileSync(resolve(projectRoot, relativePath), "utf8");
  assert.equal(
    (source.match(/<h1(?:\s|>)/g) ?? []).length,
    1,
    `${relativePath} must contain exactly one game-page H1.`
  );
  if (relativePath === "components/HomePage.tsx") {
    assert.match(source, /const squareFaceGame = requireLegacyGamePath\("\/"\)/);
    assert.match(source, /const squareHomepage = resolveSquareHomepage\(squareFaceGame\)/);
    assert.match(source, /h1=\{squareHomepage\.h1\}/, "The primary Hero must receive the resolved H1.");
    assert.match(source, /<h1>\{squareHomepage\.h1\}<\/h1>/, "Draft pages must use the same resolved H1.");
    const resolver = readFileSync(resolve(projectRoot, "lib/games/square-homepage.ts"), "utf8");
    assert.match(resolver, /h1: getGamePageH1\(game\)/, "The homepage resolver must retain the shared H1 validation.");
  } else {
    assert.match(source, /getGamePageH1/, `${relativePath} must resolve the H1 from Game Data.`);
  }
}

const futureGameRouteSource = readFileSync(resolve(projectRoot, "app/games/[slug]/page.tsx"), "utf8");
const gameDetailTemplateSource = readFileSync(
  resolve(projectRoot, "components/game/GameDetailTemplate.tsx"),
  "utf8"
);
assert.equal(
  (futureGameRouteSource.match(/<h1(?:\s|>)/g) ?? []).length,
  0,
  "The future game route must not duplicate the shared template H1."
);
assert.match(
  futureGameRouteSource,
  /<GameDetailTemplate\b/,
  "The future game route must render the shared Game Detail Page Template."
);
assert.equal(
  (gameDetailTemplateSource.match(/<h1(?:\s|>)/g) ?? []).length,
  1,
  "The shared Game Detail Page Template must contain exactly one game-page H1."
);
assert.match(
  gameDetailTemplateSource,
  /getGamePageH1/,
  "The shared Game Detail Page Template must resolve its H1 from Game Data."
);

console.log("META-001 validation passed");
console.log("- Square, Oval, Pixel, and future game routes use the shared Game Data metadata builder");
console.log("- title, description, canonical, OG, Twitter, and one H1 resolve from validated records or the shared detail template");
console.log("- frozen legacy canonicals and current index states remain unchanged");
console.log("- missing required SEO fields and duplicate index metadata fail closed");
