import { gameCategories, getGameCategory, type GameCategoryDefinition } from "../../data/game-categories";
import { gameCatalog } from "./catalog";
import type { GameRecord } from "./game-schema";

const routeSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type CategoryRoute = {
  readonly category: GameCategoryDefinition;
  readonly games: readonly GameRecord[];
};

const legacyGamesByPath = new Map(
  gameCatalog
    .filter((game) => game.route.existingPublishedRoute && isPublished(game))
    .map((game) => [game.route.path, game])
);

function isPublished(game: GameRecord) {
  return game.status === "PUBLISHED";
}

function isAllowedNewPublication(game: GameRecord) {
  if (!game.license.newPublicationAllowed) return false;
  if (!game.license.allowedDeliveryTypes.includes(game.type)) return false;

  switch (game.license.releaseDecision) {
    case "APPROVED":
      return true;
    case "DIRECT_LINK_ONLY":
      return game.type === "EXTERNAL_LINK";
    case "REVIEW_REQUIRED":
    case "BLOCKED":
      return false;
  }
}

export function getPublicGameHref(game: GameRecord): string {
  return game.route.path;
}

export function listPublishedGames(records: readonly GameRecord[] = gameCatalog): readonly GameRecord[] {
  return records.filter((game) => {
    if (!isPublished(game)) return false;
    return game.route.existingPublishedRoute || isRoutableNewGame(game);
  });
}

export function resolveLegacyGamePath(
  path: string,
  records: readonly GameRecord[] = gameCatalog
): GameRecord | undefined {
  if (records === gameCatalog) return legacyGamesByPath.get(path);
  return records.find(
    (game) => isPublished(game) && game.route.existingPublishedRoute && game.route.path === path
  );
}

export function requireLegacyGamePath(path: string): GameRecord {
  const game = resolveLegacyGamePath(path);
  if (!game) throw new Error(`Missing legacy game route mapping for ${path}.`);
  return game;
}

export function isRoutableNewGame(game: GameRecord): boolean {
  if (game.route.existingPublishedRoute || !isPublished(game)) return false;
  if (!routeSlugPattern.test(game.slug)) return false;
  if (game.route.path !== `/games/${game.slug}`) return false;
  return isAllowedNewPublication(game);
}

export function listRoutableNewGames(records: readonly GameRecord[] = gameCatalog): readonly GameRecord[] {
  return records.filter(isRoutableNewGame);
}

export function resolveNewGameSlug(
  slug: string,
  records: readonly GameRecord[] = gameCatalog
): GameRecord | undefined {
  if (!routeSlugPattern.test(slug)) return undefined;
  return records.find((game) => game.slug === slug && isRoutableNewGame(game));
}

export function getNewGameStaticParams(records: readonly GameRecord[] = gameCatalog) {
  return listRoutableNewGames(records).map((game) => ({ slug: game.slug }));
}

export function listPublishedGamesForCategory(
  categorySlug: string,
  records: readonly GameRecord[] = gameCatalog
): readonly GameRecord[] {
  if (!getGameCategory(categorySlug)) return [];

  return listPublishedGames(records).filter(
    (game) => game.category.primary === categorySlug || game.category.secondary.includes(categorySlug)
  );
}

export function resolveCategoryRoute(
  slug: string,
  records: readonly GameRecord[] = gameCatalog
): CategoryRoute | undefined {
  const category = getGameCategory(slug);
  if (!category) return undefined;

  const games = listPublishedGamesForCategory(slug, records);
  if (games.length === 0) return undefined;
  return { category, games };
}

export function listAvailableCategoryRoutes(
  records: readonly GameRecord[] = gameCatalog
): readonly CategoryRoute[] {
  return gameCategories.flatMap((category) => {
    const route = resolveCategoryRoute(category.slug, records);
    return route ? [route] : [];
  });
}

export function getCategoryStaticParams(records: readonly GameRecord[] = gameCatalog) {
  return listAvailableCategoryRoutes(records).map(({ category }) => ({ slug: category.slug }));
}
