export const RECENTLY_PLAYED_STORAGE_KEY = "msfi-recently-played-v1";
export const RECENTLY_PLAYED_VERSION = 1;
export const RECENTLY_PLAYED_STORE_LIMIT = 8;
export const RECENTLY_PLAYED_DISPLAY_LIMIT = 4;
export const RECENTLY_PLAYED_CHANGE_EVENT = "msfi:recently-played-change";

const gameIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type RecentlyPlayedEntry = {
  readonly gameId: string;
  readonly startedAt: string;
};

export type RecentlyPlayedCandidate = {
  readonly gameId: string;
  readonly name: string;
  readonly href: string;
  readonly summary: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
  } | null;
};

type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "getItem" | "setItem">;
type StorageRemover = Pick<Storage, "removeItem">;

function isCanonicalIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value;
}

function isValidGameId(value: unknown): value is string {
  return typeof value === "string" && gameIdPattern.test(value);
}

export function parseRecentlyPlayed(value: string | null): readonly RecentlyPlayedEntry[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return [];
    const record = parsed as { version?: unknown; entries?: unknown };
    if (record.version !== RECENTLY_PLAYED_VERSION || !Array.isArray(record.entries)) return [];

    const seen = new Set<string>();
    const entries: RecentlyPlayedEntry[] = [];
    for (const candidate of record.entries) {
      if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate)) continue;
      const entry = candidate as { gameId?: unknown; startedAt?: unknown };
      if (!isValidGameId(entry.gameId) || !isCanonicalIsoTimestamp(entry.startedAt)) continue;
      if (seen.has(entry.gameId)) continue;
      seen.add(entry.gameId);
      entries.push({ gameId: entry.gameId, startedAt: entry.startedAt });
      if (entries.length === RECENTLY_PLAYED_STORE_LIMIT) break;
    }
    return entries;
  } catch {
    return [];
  }
}

export function readRecentlyPlayed(storage?: StorageReader): readonly RecentlyPlayedEntry[] {
  try {
    const target = storage ?? window.localStorage;
    return parseRecentlyPlayed(target.getItem(RECENTLY_PLAYED_STORAGE_KEY));
  } catch {
    return [];
  }
}

function notifyRecentlyPlayedChanged() {
  try {
    if (typeof window !== "undefined") window.dispatchEvent(new Event(RECENTLY_PLAYED_CHANGE_EVENT));
  } catch {
    // Local history is optional and must never interrupt the game.
  }
}

export function recordRecentlyPlayed(
  gameId: string,
  startedAt = new Date().toISOString(),
  storage?: StorageWriter
): boolean {
  if (!isValidGameId(gameId) || !isCanonicalIsoTimestamp(startedAt)) return false;

  try {
    const target = storage ?? window.localStorage;
    const entries = readRecentlyPlayed(target).filter((entry) => entry.gameId !== gameId);
    target.setItem(
      RECENTLY_PLAYED_STORAGE_KEY,
      JSON.stringify({
        version: RECENTLY_PLAYED_VERSION,
        entries: [{ gameId, startedAt }, ...entries].slice(0, RECENTLY_PLAYED_STORE_LIMIT)
      })
    );
    notifyRecentlyPlayedChanged();
    return true;
  } catch {
    return false;
  }
}

export function clearRecentlyPlayed(storage?: StorageRemover): boolean {
  try {
    const target = storage ?? window.localStorage;
    target.removeItem(RECENTLY_PLAYED_STORAGE_KEY);
    notifyRecentlyPlayedChanged();
    return true;
  } catch {
    return false;
  }
}

export function getRecentlyPlayedSnapshot(): string | null {
  try {
    return window.localStorage.getItem(RECENTLY_PLAYED_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function subscribeToRecentlyPlayed(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleCustomChange = () => onStoreChange();
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === RECENTLY_PLAYED_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener(RECENTLY_PLAYED_CHANGE_EVENT, handleCustomChange);
  window.addEventListener("storage", handleStorageChange);
  return () => {
    window.removeEventListener(RECENTLY_PLAYED_CHANGE_EVENT, handleCustomChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function selectRecentlyPlayedCandidates(
  entries: readonly RecentlyPlayedEntry[],
  candidates: readonly RecentlyPlayedCandidate[],
  limit = RECENTLY_PLAYED_DISPLAY_LIMIT
): readonly RecentlyPlayedCandidate[] {
  const boundedLimit = Math.max(0, Math.min(RECENTLY_PLAYED_DISPLAY_LIMIT, Math.floor(limit)));
  if (boundedLimit === 0) return [];
  const candidatesById = new Map(candidates.map((candidate) => [candidate.gameId, candidate]));
  const selected: RecentlyPlayedCandidate[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    if (seen.has(entry.gameId)) continue;
    const candidate = candidatesById.get(entry.gameId);
    if (!candidate) continue;
    seen.add(entry.gameId);
    selected.push(candidate);
    if (selected.length === boundedLimit) break;
  }
  return selected;
}
