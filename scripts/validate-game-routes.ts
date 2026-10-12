import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pixelArtAvatarGame from "../data/games/pixel-art-avatar";
import { gameCategories } from "../data/game-categories";
import { gameCatalog } from "../lib/games/catalog";
import type { GameRecord } from "../lib/games/game-schema";
import {
  getCategoryStaticParams,
  getNewGameStaticParams,
  getPublicGameHref,
  listAvailableCategoryRoutes,
  listPublishedGames,
  listPublishedGamesForCategory,
  requireLegacyGamePath,
  resolveCategoryRoute,
  resolveLegacyGamePath,
  resolveNewGameSlug
} from "../lib/games/routes";

const projectRoot = resolve(__dirname, "../..");
const errors: string[] = [];

function expect(condition: unknown, message: string) {
  if (!condition) errors.push(message);
}

function expectThrows(action: () => unknown, message: string) {
  try {
    action();
    errors.push(message);
  } catch {
    // Expected fail-closed behavior.
  }
}

const expectedLegacyRoutes = new Map([
  ["/", "square-face"],
  ["/oval-face-icon-generator", "oval-face"],
  ["/pixel-art-avatar-icon-generator", "pixel-art-avatar"]
]);

expect(listPublishedGames().length === 4, "The current route catalog must expose three legacy records and the approved quiz.");

for (const [path, gameId] of expectedLegacyRoutes) {
  const game = resolveLegacyGamePath(path);
  expect(game?.id === gameId, `${path} must resolve to ${gameId}.`);
  if (game) expect(getPublicGameHref(game) === path, `${gameId} public href must remain ${path}.`);
}

expect(resolveLegacyGamePath("/oval-face-icon-generator/") === undefined, "Legacy lookup must not invent trailing-slash aliases.");
expect(resolveLegacyGamePath("/games/square-face-generator") === undefined, "Legacy lookup must not map a duplicate /games URL.");
expectThrows(() => requireLegacyGamePath("/missing-game"), "Missing legacy mappings must throw.");

for (const game of gameCatalog.filter((record) => record.route.existingPublishedRoute)) {
  expect(resolveNewGameSlug(game.slug) === undefined, `${game.id} must not receive a duplicate /games/[slug] route.`);
}
expect(JSON.stringify(getNewGameStaticParams()) === JSON.stringify([{ slug: "friend-block-test" }]), "Only the approved quiz generates new-game static params.");
expect(resolveNewGameSlug("friend-block-test")?.id === "friend-block-test", "The quiz must resolve through the real new-game route.");
expect(resolveNewGameSlug("../square-face") === undefined, "Unsafe slugs must fail closed.");
expect(resolveNewGameSlug("Square-Face") === undefined, "Non-canonical slugs must fail closed.");

const futureGame: GameRecord = {
  ...pixelArtAvatarGame,
  id: "future-pixel-avatar",
  name: "Future Pixel Avatar",
  slug: "future-pixel-avatar",
  route: {
    path: "/games/future-pixel-avatar",
    canonical: "https://mysquarefaceicon.com/games/future-pixel-avatar",
    indexStatus: "NOINDEX",
    existingPublishedRoute: false
  },
  seo: {
    ...pixelArtAvatarGame.seo,
    title: "Future Pixel Avatar | My Square Face Icon",
    description: "A route-validation fixture for a future rights-cleared external pixel avatar tool.",
    h1: "Future Pixel Avatar",
    canonical: "https://mysquarefaceicon.com/games/future-pixel-avatar",
    primaryKeyword: "future pixel avatar",
    searchIntent: "Open a future rights-cleared pixel avatar tool."
  },
  relatedGameIds: []
};

expect(
  resolveNewGameSlug(futureGame.slug, [futureGame])?.id === futureGame.id,
  "An eligible non-legacy record must resolve at /games/[slug]."
);
expect(
  getNewGameStaticParams([futureGame])[0]?.slug === futureGame.slug,
  "An eligible non-legacy record must generate one static param."
);

const wrongPathGame: GameRecord = {
  ...futureGame,
  route: { ...futureGame.route, path: "/future-pixel-avatar" }
};
const reviewGame: GameRecord = { ...futureGame, status: "REVIEW" };
const blockedLicenseGame: GameRecord = {
  ...futureGame,
  license: { ...futureGame.license, newPublicationAllowed: false }
};
const legacyFlagGame: GameRecord = {
  ...futureGame,
  route: { ...futureGame.route, existingPublishedRoute: true }
};

expect(resolveNewGameSlug(futureGame.slug, [wrongPathGame]) === undefined, "Wrong new-game paths must fail closed.");
expect(resolveNewGameSlug(futureGame.slug, [reviewGame]) === undefined, "Review records must not resolve publicly.");
expect(
  resolveNewGameSlug(futureGame.slug, [blockedLicenseGame]) === undefined,
  "Records without new-publication permission must fail closed."
);
expect(resolveNewGameSlug(futureGame.slug, [legacyFlagGame]) === undefined, "Legacy records must not resolve under /games.");
expect(listPublishedGames([futureGame]).length === 1, "Eligible future records must enter public route lists.");
expect(listPublishedGames([reviewGame]).length === 0, "Review records must stay out of public route lists.");
expect(
  listPublishedGames([blockedLicenseGame]).length === 0,
  "New records without publication permission must stay out of public route lists."
);

const reviewLegacyGame: GameRecord = { ...gameCatalog[0], status: "REVIEW" };
expect(
  resolveLegacyGamePath(reviewLegacyGame.route.path, [reviewLegacyGame]) === undefined,
  "Non-published legacy records must fail closed."
);

const expectedCategoryCounts = new Map([
  ["face-makers", 2],
  ["avatar-makers", 3],
  ["pixel-avatars", 1],
  ["retro-flash", 2],
  ["character-creators", 1],
  ["friend-quizzes", 1]
]);

expect(gameCategories.length === expectedCategoryCounts.size, "The route category allowlist must contain five legacy categories and Friend Quizzes.");
expect(listAvailableCategoryRoutes().length === expectedCategoryCounts.size, "Every current allowlisted category must have records.");
expect(getCategoryStaticParams().length === expectedCategoryCounts.size, "Category static params must match available categories.");

for (const [slug, count] of expectedCategoryCounts) {
  const games = listPublishedGamesForCategory(slug);
  expect(games.length === count, `${slug} must contain ${count} current records.`);
  expect(resolveCategoryRoute(slug)?.games.length === count, `${slug} route must resolve with ${count} records.`);
}

expect(resolveCategoryRoute("racing-games") === undefined, "Out-of-scope categories must return no route.");
expect(resolveCategoryRoute("unknown") === undefined, "Unknown categories must return no route.");

const routeSourceAssertions = [
  ["app/games/page.tsx", ["gamesDirectoryMetadata", "resolveGamesDirectory", "reloadDocument"]],
  ["lib/seo/games-directory.ts", ["index: false", "follow: true", "gamesDirectoryUrl"]],
  ["lib/games/directory.ts", ["listPublishedGames", "EXTERNAL_TOOL"]],
  ["app/category/[slug]/page.tsx", ["dynamicParams = true", "index: false", "notFound()"]],
  ["app/games/[slug]/page.tsx", ["dynamicParams = true", "forceNoIndex: !isIndexAllowedNewGame(game)", "resolveNewGameSlug", "notFound()"]],
  ["app/not-found.tsx", ["404 · Page not found", "Browse avatar games", "SiteFooter"]]
] as const;

for (const [relativePath, requiredFragments] of routeSourceAssertions) {
  const source = readFileSync(resolve(projectRoot, relativePath), "utf8");
  for (const fragment of requiredFragments) {
    expect(source.includes(fragment), `${relativePath} must contain ${fragment}.`);
  }
}

if (errors.length > 0) {
  console.error("ROUTE-001 validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("ROUTE-001 validation passed");
  console.log("- three frozen legacy paths resolve without duplicate /games aliases");
  console.log("- future /games/[slug] routes require exact paths, published status, and release permission");
  console.log("- six allowlisted categories resolve from real published records; unknown categories fail closed");
  console.log("- new route families retain default noindex with one approved index exception and true 404 guards");
}
