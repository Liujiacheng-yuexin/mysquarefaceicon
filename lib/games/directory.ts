import { gameCatalog } from "./catalog";
import type { GameRecord } from "./game-schema";
import { listAvailableCategoryRoutes, listPublishedGames } from "./routes";

export function resolveGamesDirectory(records: readonly GameRecord[] = gameCatalog) {
  const ids = new Set<string>();
  const paths = new Set<string>();
  const games = listPublishedGames(records).filter((game) => {
    if (game.pageType !== "GAME" && game.pageType !== "EXTERNAL_TOOL") return false;
    // Only the catalog's existing identity/path pairs can use the legacy route exception.
    if (game.route.existingPublishedRoute && !gameCatalog.some(
      (known) => known.id === game.id && known.route.path === game.route.path
    )) return false;
    if (ids.has(game.id) || paths.has(game.route.path)) return false;
    ids.add(game.id);
    paths.add(game.route.path);
    return true;
  });

  return {
    games,
    onSiteGames: games.filter((game) => game.pageType === "GAME"),
    externalTools: games.filter((game) => game.pageType === "EXTERNAL_TOOL"),
    categoryRoutes: listAvailableCategoryRoutes(games)
  };
}

export function directoryEntryCount(count: number): string {
  return `${count} ${count === 1 ? "entry" : "entries"}`;
}
