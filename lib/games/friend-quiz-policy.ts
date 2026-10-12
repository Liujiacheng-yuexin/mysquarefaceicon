import type { GameRecord } from "./game-schema";

export const FRIEND_QUIZ_PATH = "/games/friend-block-test";
export const FRIEND_QUIZ_ENTRY = `${FRIEND_QUIZ_PATH}/index.html`;

// This single-record exception does not authorize any other new game's indexing.
export function isIndexAllowedNewGame(game: GameRecord): boolean {
  return game.id === "friend-block-test" && game.slug === "friend-block-test"
    && game.route.path === FRIEND_QUIZ_PATH && !game.route.existingPublishedRoute
    && game.route.indexStatus === "INDEX" && game.status === "PUBLISHED"
    && game.pageType === "GAME" && game.type === "HTML5" && game.player.type === "HTML5"
    && game.player.entryUrl === FRIEND_QUIZ_ENTRY
    && game.license.registryRecordId === "friend-block-test-original"
    && game.license.status === "VERIFIED" && game.license.newPublicationAllowed
    && game.license.releaseDecision === "APPROVED" && game.license.allowedDeliveryTypes.includes("HTML5");
}

export function isFriendQuizPath(path: string | null): boolean {
  if (path === null) return false;
  try {
    const pathname = decodeURIComponent(path.split(/[?#]/, 1)[0]);
    return pathname === FRIEND_QUIZ_PATH || pathname.startsWith(`${FRIEND_QUIZ_PATH}/`);
  } catch { return true; } // Malformed paths cannot opt into third-party scripts.
}

export function crossesFriendQuizBoundary(from: string | null, to: string | null): boolean {
  return from !== null && to !== null && isFriendQuizPath(from) !== isFriendQuizPath(to);
}
