import { getGameCategory } from "../../data/game-categories";
import { gameCatalog } from "../games/catalog";
import { validateGameRecord, type GameRecord } from "../games/game-schema";
import { resolveGamesDirectory } from "../games/directory";

const DEFAULT_RELATED_GAME_LIMIT = 4;
const MAX_RELATED_GAME_LIMIT = 8;

export type RelatedGameRecommendation = {
  readonly game: GameRecord;
  readonly sharedCategories: readonly string[];
  readonly sharedTags: readonly string[];
};

export type RelatedGamesDiagnostics = {
  readonly currentStatus: "ELIGIBLE" | "INVALID" | "NOT_ELIGIBLE";
  readonly requestedLimit: number;
  readonly inputRecordCount: number;
  readonly validRecordCount: number;
  readonly eligibleRecordCount: number;
  readonly invalidRecordCount: number;
  readonly conflictingIds: readonly string[];
  readonly conflictingPaths: readonly string[];
  readonly qualityPopularity: "DISABLED_NO_VERIFIED_DATA";
};

export type RelatedGamesResult = {
  readonly recommendations: readonly RelatedGameRecommendation[];
  readonly diagnostics: RelatedGamesDiagnostics;
};

function validateLimit(limit: number) {
  if (!Number.isFinite(limit) || !Number.isInteger(limit) || limit < 0 || limit > MAX_RELATED_GAME_LIMIT) {
    throw new RangeError(`Related game limit must be an integer from 0 to ${MAX_RELATED_GAME_LIMIT}.`);
  }
}

function findConflicts(values: readonly string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value)
    .sort();
}

function normalizedCategories(game: GameRecord) {
  return [...new Set([game.category.primary, ...game.category.secondary])]
    .filter((category) => getGameCategory(category) !== undefined);
}

function normalizedTags(game: GameRecord) {
  return [...new Set(game.tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}

function emptyResult(
  currentStatus: RelatedGamesDiagnostics["currentStatus"],
  limit: number,
  inputRecordCount: number,
  validRecordCount: number,
  eligibleRecordCount: number,
  invalidRecordCount: number,
  conflictingIds: readonly string[],
  conflictingPaths: readonly string[]
): RelatedGamesResult {
  return {
    recommendations: [],
    diagnostics: {
      currentStatus,
      requestedLimit: limit,
      inputRecordCount,
      validRecordCount,
      eligibleRecordCount,
      invalidRecordCount,
      conflictingIds,
      conflictingPaths,
      qualityPopularity: "DISABLED_NO_VERIFIED_DATA"
    }
  };
}

export function selectRelatedGames(
  currentGame: GameRecord,
  records: readonly GameRecord[] = gameCatalog,
  limit = DEFAULT_RELATED_GAME_LIMIT
): RelatedGamesResult {
  validateLimit(limit);

  const inputRecords = Array.isArray(records) ? records : [];
  const currentErrors = validateGameRecord(currentGame);
  if (currentErrors.length > 0) {
    return emptyResult("INVALID", limit, inputRecords.length, 0, 0, inputRecords.length, [], []);
  }

  const validRecords = inputRecords.filter((record) => validateGameRecord(record).length === 0);
  const invalidRecordCount = inputRecords.length - validRecords.length;
  const conflictingIds = findConflicts(validRecords.map((game) => game.id));
  const conflictingPaths = findConflicts(validRecords.map((game) => game.route.path));
  const conflictingIdSet = new Set(conflictingIds);
  const conflictingPathSet = new Set(conflictingPaths);
  const unconflictedRecords = validRecords.filter(
    (game) => !conflictingIdSet.has(game.id) && !conflictingPathSet.has(game.route.path)
  );
  const eligibleGames = resolveGamesDirectory(unconflictedRecords).games;
  const eligibleCurrent = eligibleGames.find(
    (game) => game.id === currentGame.id && game.route.path === currentGame.route.path
  );

  if (!eligibleCurrent) {
    return emptyResult(
      "NOT_ELIGIBLE",
      limit,
      inputRecords.length,
      validRecords.length,
      eligibleGames.length,
      invalidRecordCount,
      conflictingIds,
      conflictingPaths
    );
  }

  const currentCategories = new Set(normalizedCategories(eligibleCurrent));
  const currentTags = new Set(normalizedTags(eligibleCurrent));
  const recommendations = eligibleGames
    .flatMap((game): RelatedGameRecommendation[] => {
      if (game.id === eligibleCurrent.id || game.route.path === eligibleCurrent.route.path) return [];
      const sharedCategories = normalizedCategories(game).filter((category) => currentCategories.has(category));
      const sharedTags = normalizedTags(game).filter((tag) => currentTags.has(tag));
      if (sharedCategories.length === 0 && sharedTags.length === 0) return [];
      return [{ game, sharedCategories, sharedTags }];
    })
    .sort((left, right) => {
      if (left.sharedCategories.length !== right.sharedCategories.length) {
        return right.sharedCategories.length - left.sharedCategories.length;
      }
      if (left.sharedTags.length !== right.sharedTags.length) {
        return right.sharedTags.length - left.sharedTags.length;
      }
      return left.game.id < right.game.id ? -1 : left.game.id > right.game.id ? 1 : 0;
    })
    .slice(0, limit);

  return {
    recommendations,
    diagnostics: {
      currentStatus: "ELIGIBLE",
      requestedLimit: limit,
      inputRecordCount: inputRecords.length,
      validRecordCount: validRecords.length,
      eligibleRecordCount: eligibleGames.length,
      invalidRecordCount,
      conflictingIds,
      conflictingPaths,
      qualityPopularity: "DISABLED_NO_VERIFIED_DATA"
    }
  };
}
