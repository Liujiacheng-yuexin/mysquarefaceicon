import { gameCatalog } from "./catalog";
import type { GameRecord } from "./game-schema";
import {
  getPublicGameHref,
  listAvailableCategoryRoutes,
  listPublishedGames,
  type CategoryRoute
} from "./routes";
import { selectRelatedGames } from "../recommendations/related-games";

export type HomeDiscoveryData = {
  readonly featuredGames: readonly GameRecord[];
  readonly newGames: readonly GameRecord[];
  readonly categories: readonly CategoryRoute[];
};

function hasPublicInternalHref(game: GameRecord) {
  const href = getPublicGameHref(game);
  return href.startsWith("/") && !href.startsWith("//");
}

function getVerifiedPublishedTimestamp(game: GameRecord): number | null {
  if (game.publication.timestampStatus !== "VERIFIED" || !game.publication.publishedAt) return null;

  const timestamp = Date.parse(game.publication.publishedAt);
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function resolveHomeFeaturedGames(
  currentGame: GameRecord,
  records: readonly GameRecord[] = gameCatalog
): readonly GameRecord[] {
  return selectRelatedGames(currentGame, records).recommendations
    .map(({ game }) => game)
    .filter(hasPublicInternalHref);
}

export function resolveHomeNewGames(
  currentGame: GameRecord,
  records: readonly GameRecord[] = gameCatalog,
  excludedGameIds: readonly string[] = []
): readonly GameRecord[] {
  const excludedIds = new Set([currentGame.id, ...excludedGameIds]);

  return listPublishedGames(records)
    .flatMap((game, catalogIndex) => {
      if (excludedIds.has(game.id) || !hasPublicInternalHref(game)) return [];
      const publishedTimestamp = getVerifiedPublishedTimestamp(game);
      return publishedTimestamp === null ? [] : [{ game, publishedTimestamp, catalogIndex }];
    })
    .sort(
      (left, right) =>
        right.publishedTimestamp - left.publishedTimestamp || left.catalogIndex - right.catalogIndex
    )
    .map(({ game }) => game);
}

export function resolveHomeDiscovery(
  currentGame: GameRecord,
  records: readonly GameRecord[] = gameCatalog
): HomeDiscoveryData {
  const featuredGames = resolveHomeFeaturedGames(currentGame, records);
  const newGames = resolveHomeNewGames(
    currentGame,
    records,
    featuredGames.map((game) => game.id)
  );

  return {
    featuredGames,
    newGames,
    categories: listAvailableCategoryRoutes(records)
  };
}
