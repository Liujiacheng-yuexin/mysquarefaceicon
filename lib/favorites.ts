export const FAVORITES_STORAGE_KEY = "msfi-favorites-v1";
export const FAVORITES_VERSION = 1;
export const FAVORITES_LIMIT = 50;
export const FAVORITES_CHANGE_EVENT = "msfi:favorites-change";

const gameIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "getItem" | "setItem">;

export type FavoriteWriteResult = {
  readonly ok: boolean;
  readonly isFavorite: boolean;
};

function isValidGameId(value: unknown): value is string {
  return typeof value === "string" && gameIdPattern.test(value);
}

export function parseFavorites(value: string | null): readonly string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return [];
    const record = parsed as { version?: unknown; gameIds?: unknown };
    if (record.version !== FAVORITES_VERSION || !Array.isArray(record.gameIds)) return [];

    const ids: string[] = [];
    const seen = new Set<string>();
    for (const gameId of record.gameIds) {
      if (!isValidGameId(gameId) || seen.has(gameId)) continue;
      seen.add(gameId);
      ids.push(gameId);
      if (ids.length === FAVORITES_LIMIT) break;
    }
    return ids;
  } catch {
    return [];
  }
}

export function readFavorites(storage?: StorageReader): readonly string[] {
  try {
    const target = storage ?? window.localStorage;
    return parseFavorites(target.getItem(FAVORITES_STORAGE_KEY));
  } catch {
    return [];
  }
}

function notifyFavoritesChanged() {
  try {
    if (typeof window !== "undefined") window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
  } catch {
    // Favorites are optional and must never interrupt navigation or play.
  }
}

export function setFavorite(
  gameId: string,
  nextIsFavorite: boolean,
  storage?: StorageWriter
): FavoriteWriteResult {
  if (!isValidGameId(gameId)) return { ok: false, isFavorite: false };

  try {
    const target = storage ?? window.localStorage;
    const current = readFavorites(target).filter((id) => id !== gameId);
    const gameIds = nextIsFavorite ? [gameId, ...current].slice(0, FAVORITES_LIMIT) : current;
    target.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ version: FAVORITES_VERSION, gameIds }));
    notifyFavoritesChanged();
    return { ok: true, isFavorite: nextIsFavorite };
  } catch {
    return { ok: false, isFavorite: false };
  }
}

export function getFavoritesSnapshot(): string | null {
  try {
    return window.localStorage.getItem(FAVORITES_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function subscribeToFavorites(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleCustomChange = () => onStoreChange();
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === FAVORITES_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener(FAVORITES_CHANGE_EVENT, handleCustomChange);
  window.addEventListener("storage", handleStorageChange);
  return () => {
    window.removeEventListener(FAVORITES_CHANGE_EVENT, handleCustomChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}
