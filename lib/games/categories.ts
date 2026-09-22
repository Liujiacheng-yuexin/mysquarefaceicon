import { gameCatalog } from "./catalog";
import { resolveGamesDirectory } from "./directory";
import type { GameRecord } from "./game-schema";

// Categories share the directory's publication/type/identity and deduplication gates.
// This does not change the underlying legacy or new-game publication permissions.
export function listDirectoryCategoryRoutes(records: readonly GameRecord[] = gameCatalog) {
  return resolveGamesDirectory(records).categoryRoutes;
}

export function resolveDirectoryCategoryRoute(slug: string, records: readonly GameRecord[] = gameCatalog) {
  return listDirectoryCategoryRoutes(records).find(({ category }) => category.slug === slug);
}

export function getDirectoryCategoryStaticParams(records: readonly GameRecord[] = gameCatalog) {
  return listDirectoryCategoryRoutes(records).map(({ category }) => ({ slug: category.slug }));
}
