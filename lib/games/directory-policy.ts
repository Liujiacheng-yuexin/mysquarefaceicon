export const GAMES_DIRECTORY_PATH = "/games";

// This decision is only for the small, noindex directory, not an approval of ads elsewhere.
export const gamesDirectoryPolicy = {
  path: GAMES_DIRECTORY_PATH,
  adEligible: false,
  reason: "Small, noindex directory; keep advertising out of this document."
} as const;

export function isGamesDirectoryPath(path: string | null): boolean {
  if (path === null) return false;
  const pathname = path.split(/[?#]/, 1)[0];
  return pathname === GAMES_DIRECTORY_PATH || pathname === `${GAMES_DIRECTORY_PATH}/`;
}

export function crossesGamesDirectoryBoundary(from: string | null, to: string | null): boolean {
  return from !== null && to !== null && isGamesDirectoryPath(from) !== isGamesDirectoryPath(to);
}

export function canLoadAdsOutsideGamesDirectory(documentPath: string | null, currentPath: string): boolean {
  // Check both the original document and the live path, including while a navigation is pending.
  return documentPath !== null && !isGamesDirectoryPath(documentPath) && !isGamesDirectoryPath(currentPath);
}
