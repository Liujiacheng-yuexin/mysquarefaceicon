import { FAVORITES_LIMIT } from "../favorites";
import { resolveGamesDirectory } from "./directory";
import type { GameRecord } from "./game-schema";
import { validateGameRecord } from "./game-schema";
import { gameCatalog } from "./catalog";

export function resolveFavoriteGames(
  records: readonly GameRecord[] = gameCatalog
): readonly GameRecord[] {
  return resolveGamesDirectory(records).games.filter((game) => validateGameRecord(game).length === 0);
}

export function selectFavoriteGames(
  gameIds: readonly string[],
  candidates: readonly GameRecord[],
  limit = FAVORITES_LIMIT
): readonly GameRecord[] {
  const boundedLimit = Math.max(0, Math.min(FAVORITES_LIMIT, Math.floor(limit)));
  if (boundedLimit === 0) return [];

  const candidatesById = new Map(candidates.map((game) => [game.id, game]));
  const selected: GameRecord[] = [];
  const seen = new Set<string>();
  for (const gameId of gameIds) {
    if (seen.has(gameId)) continue;
    const game = candidatesById.get(gameId);
    if (!game) continue;
    seen.add(gameId);
    selected.push(game);
    if (selected.length === boundedLimit) break;
  }
  return selected;
}
