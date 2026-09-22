import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import ovalFaceGame from "../data/games/oval-face";
import squareFaceGame from "../data/games/square-face";
import { gameCatalog } from "../lib/games/catalog";
import { resolveRecentlyPlayedCandidates } from "../lib/games/recently-played";
import type { GameRecord } from "../lib/games/game-schema";
import {
  RECENTLY_PLAYED_DISPLAY_LIMIT,
  RECENTLY_PLAYED_STORAGE_KEY,
  RECENTLY_PLAYED_STORE_LIMIT,
  clearRecentlyPlayed,
  parseRecentlyPlayed,
  readRecentlyPlayed,
  recordRecentlyPlayed,
  selectRecentlyPlayedCandidates
} from "../lib/recently-played";

const projectRoot = resolve(__dirname, "../..");
const RecentlyPlayed = require("../components/game/RecentlyPlayed").default as
  typeof import("../components/game/RecentlyPlayed").default;
const times = Array.from({ length: 10 }, (_, index) => new Date(Date.UTC(2026, 8, 7, 8, index)).toISOString());
const json = (entries: unknown[], version = 1) => JSON.stringify({ version, entries });

class MemoryStorage {
  readonly values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

assert.deepEqual(parseRecentlyPlayed(null), []);
assert.deepEqual(parseRecentlyPlayed("not-json"), []);
assert.deepEqual(parseRecentlyPlayed("[]"), []);
assert.deepEqual(parseRecentlyPlayed(json([], 2)), []);
assert.deepEqual(
  parseRecentlyPlayed(json([
    { gameId: "square-face", startedAt: times[0] },
    { gameId: "square-face", startedAt: times[1] },
    { gameId: "Bad ID", startedAt: times[2] },
    { gameId: "oval-face", startedAt: "not-a-time" },
    null,
    { gameId: "oval-face", startedAt: times[3] }
  ])),
  [
    { gameId: "square-face", startedAt: times[0] },
    { gameId: "oval-face", startedAt: times[3] }
  ],
  "Parsing must drop malformed and duplicate entries without trusting later duplicates."
);
assert.equal(
  parseRecentlyPlayed(json(times.map((startedAt, index) => ({ gameId: `game-${index}`, startedAt })))).length,
  RECENTLY_PLAYED_STORE_LIMIT
);

const storage = new MemoryStorage();
storage.setItem("unrelated-key", "preserve-me");
assert.equal(recordRecentlyPlayed("square-face", times[0], storage), true);
assert.equal(recordRecentlyPlayed("oval-face", times[1], storage), true);
assert.equal(recordRecentlyPlayed("square-face", times[2], storage), true);
assert.deepEqual(readRecentlyPlayed(storage), [
  { gameId: "square-face", startedAt: times[2] },
  { gameId: "oval-face", startedAt: times[1] }
]);
assert.equal(recordRecentlyPlayed("Bad ID", times[3], storage), false);
assert.equal(recordRecentlyPlayed("square-face", "not-a-time", storage), false);
assert.equal(clearRecentlyPlayed(storage), true);
assert.equal(storage.getItem(RECENTLY_PLAYED_STORAGE_KEY), null);
assert.equal(storage.getItem("unrelated-key"), "preserve-me", "Clear must preserve every unrelated key.");

const throwingStorage = {
  getItem() { throw new Error("storage blocked"); },
  setItem() { throw new Error("storage blocked"); },
  removeItem() { throw new Error("storage blocked"); }
};
assert.deepEqual(readRecentlyPlayed(throwingStorage), []);
assert.equal(recordRecentlyPlayed("square-face", times[0], throwingStorage), false);
assert.equal(clearRecentlyPlayed(throwingStorage), false);

const currentCandidates = resolveRecentlyPlayedCandidates();
assert.deepEqual(currentCandidates.map((candidate) => candidate.gameId), ["square-face", "oval-face"]);
assert.ok(currentCandidates.every((candidate) => candidate.href.startsWith("/")));
assert.ok(currentCandidates.every((candidate) => candidate.image?.src.startsWith("/")));
assert.doesNotMatch(JSON.stringify(currentCandidates), /pixel-art-avatar|EXTERNAL_LINK|https:\/\//);

const futurePlayable = {
  ...ovalFaceGame,
  id: "future-avatar",
  name: "Future Avatar",
  slug: "future-avatar",
  route: {
    path: "/games/future-avatar",
    canonical: "https://mysquarefaceicon.com/games/future-avatar",
    indexStatus: "INDEX" as const,
    existingPublishedRoute: false
  },
  seo: {
    ...ovalFaceGame.seo,
    canonical: "https://mysquarefaceicon.com/games/future-avatar"
  },
  license: {
    ...ovalFaceGame.license,
    status: "VERIFIED" as const,
    releaseDecision: "APPROVED" as const,
    newPublicationAllowed: true,
    allowedDeliveryTypes: ["RUFFLE_SWF" as const]
  },
  relatedGameIds: []
} satisfies GameRecord;
const fakeLegacy = {
  ...squareFaceGame,
  id: "fake-legacy",
  name: "Fake Legacy",
  slug: "fake-legacy",
  route: {
    path: "/fake-legacy",
    canonical: "https://mysquarefaceicon.com/fake-legacy",
    indexStatus: "INDEX" as const,
    existingPublishedRoute: true
  },
  relatedGameIds: []
} satisfies GameRecord;
assert.deepEqual(
  resolveRecentlyPlayedCandidates([...gameCatalog, futurePlayable, fakeLegacy]).map((candidate) => candidate.gameId),
  ["square-face", "oval-face", "future-avatar"],
  "Only known legacy identities or approved routable future games may become candidates."
);

const selected = selectRecentlyPlayedCandidates(
  parseRecentlyPlayed(json([
    { gameId: "missing", startedAt: times[0] },
    { gameId: "oval-face", startedAt: times[1] },
    { gameId: "square-face", startedAt: times[2] }
  ])),
  currentCandidates
);
assert.deepEqual(selected.map((candidate) => candidate.gameId), ["oval-face", "square-face"]);
assert.equal(selectRecentlyPlayedCandidates([], currentCandidates).length, 0);
assert.equal(
  selectRecentlyPlayedCandidates(
    selected.map((candidate, index) => ({ gameId: candidate.gameId, startedAt: times[index] })),
    currentCandidates,
    99
  ).length <= RECENTLY_PLAYED_DISPLAY_LIMIT,
  true
);

const serverMarkup = renderToStaticMarkup(
  <RecentlyPlayed candidates={currentCandidates} variant="home" nextHeadingSelector={'[data-home-module="related"] h3'} />
);
assert.equal(serverMarkup, "", "Empty server output must not reserve history UI or live-region space.");

const source = (path: string) => readFileSync(resolve(projectRoot, path), "utf8");
const playerSource = source("components/game-player/GamePlayer.tsx");
const gameControlsSource = source("components/game/GameControls.tsx");
assert.match(playerSource, /hasStartedRef\.current[\s\S]*?recordRecentlyPlayed\(model\.id\)/);
assert.equal((playerSource.match(/recordRecentlyPlayed\(model\.id\)/g) ?? []).length, 1);
assert.match(playerSource, /if \(hasStartedRef\.current\)[\s\S]*?setInstanceKey[\s\S]*?else \{[\s\S]*?recordRecentlyPlayed/);
assert.match(playerSource, /const reload = useCallback\([\s\S]*?setActivated\(true\)[\s\S]*?scheduleAdapterMountAfterPaint\(\)[\s\S]*?\}, \[model\.labels\.loading/);
assert.doesNotMatch(playerSource.match(/const reload = useCallback\([\s\S]*?\}, \[model\.labels\.loading/)?.[0] ?? "", /recordRecentlyPlayed/);
assert.match(playerSource, /aria-label=\{`Retry \$\{model\.name\}`\}[\s\S]*?onClick=\{reload\}/);
assert.match(playerSource, /onActivateOrReload=\{activateOrReload\}[\s\S]*?onReload=\{reload\}/);
assert.match(gameControlsSource, /onClick=\{onReload \?\? onActivateOrReload\}/);

const flashSource = source("components/FlashGenerator.tsx");
assert.match(flashSource, /gameId: string/);
assert.match(flashSource, /id: gameId/);
assert.doesNotMatch(flashSource, /id: `legacy-/);
assert.match(source("lib/games/square-homepage.ts"), /gameId: game\.id/);
assert.match(source("lib/games/oval-legacy-page.ts"), /gameId: game\.id/);

const homeSource = source("components/home/HomeDiscoveryRegion.tsx");
assert.match(
  homeSource,
  /<RecentlyPlayed[\s\S]*?<div className="home-discovery-panel" data-home-module="related"/
);
assert.match(homeSource, /nextHeadingSelector=\{nextHeadingSelector\}/);
const gamesSource = source("app/games/page.tsx");
assert.ok(gamesSource.indexOf("<RecentlyPlayed") < gamesSource.indexOf("on-site-games-heading"));
assert.match(gamesSource, /nextHeadingSelector="#on-site-games-heading"/);

const privacySource = source("app/privacy-policy/page.tsx");
assert.match(privacySource, /Last updated: September 7, 2026/);
assert.match(privacySource, /stable ID and start time of recently played/);
assert.match(privacySource, /does not sync across devices/);

const clientSource = source("components/game/RecentlyPlayed.tsx");
assert.match(clientSource, /useSyncExternalStore/);
assert.match(clientSource, /Clear history/);
assert.match(clientSource, /document\.querySelector<HTMLElement>\(nextHeadingSelector\)/);
assert.doesNotMatch(clientSource, /dangerouslySetInnerHTML|fetch\(|XMLHttpRequest|sessionStorage/);
const storageSource = source("lib/recently-played.ts");
assert.match(storageSource, /window\.addEventListener\("storage"/);
assert.match(storageSource, /RECENTLY_PLAYED_CHANGE_EVENT/);

console.log("RECENT-001 validation passed");
console.log("- versioned parsing, dedupe, ordering, limits, clear isolation and storage failures pass");
console.log("- only published playable local candidates are mapped; Pixel External is excluded");
console.log("- Square, Oval and future player models use real Game Data IDs at first Play only");
console.log("- server output stays empty until valid local history exists; no network-backed state was added");
console.log("- homepage, /games, focus recovery and Privacy disclosure match the confirmed scope");
