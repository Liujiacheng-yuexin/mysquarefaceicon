import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import GameCard from "../components/game/GameCard";
import FavoritesSection from "../components/game/FavoritesSection";
import pixelArtAvatarGame from "../data/games/pixel-art-avatar";
import squareFaceGame from "../data/games/square-face";
import {
  FAVORITES_LIMIT,
  FAVORITES_STORAGE_KEY,
  parseFavorites,
  readFavorites,
  setFavorite
} from "../lib/favorites";
import { resolveFavoriteGames, selectFavoriteGames } from "../lib/games/favorites";

const projectRoot = resolve(__dirname, "../..");
const json = (gameIds: unknown[], version = 1) => JSON.stringify({ version, gameIds });

class MemoryStorage {
  readonly values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

assert.deepEqual(parseFavorites(null), []);
assert.deepEqual(parseFavorites("not-json"), []);
assert.deepEqual(parseFavorites("[]"), []);
assert.deepEqual(parseFavorites(json([], 2)), []);
assert.deepEqual(
  parseFavorites(json(["square-face", "square-face", "Bad ID", null, "oval-face"])),
  ["square-face", "oval-face"],
  "Parsing must retain first valid IDs while dropping malformed and duplicate entries."
);
assert.equal(
  parseFavorites(json(Array.from({ length: 60 }, (_, index) => `game-${index}`))).length,
  FAVORITES_LIMIT
);

const storage = new MemoryStorage();
storage.setItem("msfi-recently-played-v1", "preserve-recent-history");
storage.setItem("unrelated-key", "preserve-me");
assert.deepEqual(setFavorite("square-face", true, storage), { ok: true, isFavorite: true });
assert.deepEqual(setFavorite("oval-face", true, storage), { ok: true, isFavorite: true });
assert.deepEqual(setFavorite("square-face", true, storage), { ok: true, isFavorite: true });
assert.deepEqual(readFavorites(storage), ["square-face", "oval-face"], "Latest save must move to the front.");
assert.deepEqual(setFavorite("square-face", false, storage), { ok: true, isFavorite: false });
assert.deepEqual(readFavorites(storage), ["oval-face"]);
assert.equal(storage.getItem("msfi-recently-played-v1"), "preserve-recent-history");
assert.equal(storage.getItem("unrelated-key"), "preserve-me");
assert.ok(storage.getItem(FAVORITES_STORAGE_KEY)?.startsWith('{"version":1,"gameIds":['));
assert.deepEqual(setFavorite("Bad ID", true, storage), { ok: false, isFavorite: false });

const throwingStorage = {
  getItem() { throw new Error("storage blocked"); },
  setItem() { throw new Error("storage blocked"); }
};
assert.deepEqual(readFavorites(throwingStorage), []);
assert.deepEqual(setFavorite("square-face", true, throwingStorage), { ok: false, isFavorite: false });

const candidates = resolveFavoriteGames();
assert.deepEqual(candidates.map((game) => game.id), ["square-face", "oval-face", "pixel-art-avatar", "friend-block-test"]);
assert.equal(candidates.find((game) => game.id === "pixel-art-avatar")?.pageType, "EXTERNAL_TOOL");
assert.deepEqual(
  selectFavoriteGames(["missing", "pixel-art-avatar", "square-face", "pixel-art-avatar"], candidates)
    .map((game) => game.id),
  ["pixel-art-avatar", "square-face"]
);
assert.deepEqual(selectFavoriteGames(["square-face"], candidates, 0), []);

const gameCardMarkup = renderToStaticMarkup(<GameCard game={squareFaceGame} />);
assert.match(gameCardMarkup, /class="favoritable-game-card"/);
assert.match(gameCardMarkup, /<a[^>]*data-game-id="square-face"[\s\S]*?<\/a><div class="favorite-actions/);
assert.match(gameCardMarkup, /<button[^>]*aria-pressed="false"[^>]*data-favorite-toggle/);
assert.doesNotMatch(
  gameCardMarkup.match(/<a\b[\s\S]*?<\/a>/)?.[0] ?? "",
  /<button/,
  "Favorite buttons must not be nested inside card links."
);

const externalCardMarkup = renderToStaticMarkup(<GameCard game={pixelArtAvatarGame} />);
assert.match(externalCardMarkup, />Save tool<\/span>/);
assert.match(externalCardMarkup, /External tool/);
assert.doesNotMatch(externalCardMarkup, /target="_blank"/);

const emptyFavoritesMarkup = renderToStaticMarkup(
  <FavoritesSection candidates={candidates} nextHeadingSelector="#on-site-games-heading" />
);
assert.doesNotMatch(emptyFavoritesMarkup, /<section|Favorites/, "Server output must not reserve a visible empty section.");
assert.match(emptyFavoritesMarkup, /aria-live="polite"/);

const source = (path: string) => readFileSync(resolve(projectRoot, path), "utf8");
const toggleSource = source("components/game/FavoriteToggle.tsx");
assert.match(toggleSource, /useSyncExternalStore/);
assert.match(toggleSource, /aria-pressed=\{isFavorite\}/);
assert.match(toggleSource, /showViewLink \? <Link className="favorite-view-link" href="\/games">/);
assert.doesNotMatch(toggleSource, /fetch\(|XMLHttpRequest|sessionStorage|Date\(|analytics|rating|popular/i);
const favoritesSource = source("lib/favorites.ts");
assert.match(favoritesSource, /window\.addEventListener\("storage"/);
assert.match(favoritesSource, /FAVORITES_CHANGE_EVENT/);
assert.doesNotMatch(favoritesSource, /msfi-recently-played-v1|removeItem|fetch\(|XMLHttpRequest/);

const gamesSource = source("app/games/page.tsx");
assert.ok(gamesSource.indexOf("<RecentlyPlayed") < gamesSource.indexOf("<FavoritesSection"));
assert.ok(
  gamesSource.indexOf("<FavoritesSection") < gamesSource.indexOf('aria-labelledby="on-site-games-heading"')
);
assert.match(gamesSource, /nextHeadingSelector="#on-site-games-heading"/);
const homeHeroSource = source("components/home/HomeHero.tsx");
assert.ok(homeHeroSource.indexOf("data-home-hero-play") < homeHeroSource.indexOf("<FavoriteToggle"));
const ovalSource = source("app/oval-face-icon-generator/page.tsx");
assert.ok(ovalSource.indexOf("hero-primary-link") < ovalSource.indexOf("hero-secondary-link"));
assert.ok(ovalSource.indexOf("hero-secondary-link") < ovalSource.indexOf("<FavoriteToggle"));
const pixelSource = source("app/pixel-art-avatar-icon-generator/page.tsx");
assert.ok(pixelSource.indexOf("hero-primary-link") < pixelSource.indexOf("<FavoriteToggle"));
assert.match(pixelSource, /pageType=\{pixelArtAvatarGame\.pageType\}/);

const privacySource = source("app/privacy-policy/page.tsx");
assert.match(privacySource, /Last updated: October 12, 2026/);
assert.match(privacySource, /Favorite or Save tool/);
assert.match(privacySource, /only stable game IDs/);
assert.match(privacySource, /do not sync across devices/);
assert.match(privacySource, /Favorited or Saved tool button again to remove an item/);

const cssSource = source("app/globals.css");
assert.match(cssSource, /\.favorite-toggle[\s\S]*?min-height: 44px/);
assert.match(cssSource, /\.favoritable-game-card > \.route-game-link/);
assert.match(cssSource, /\.favorites-live[\s\S]*?clip-path: inset\(50%\)/);

console.log("FAV-001 validation passed");
console.log("- versioned local parsing, newest-first order, 50-item limit and fail-closed storage pass");
console.log("- all three published Game Data records are eligible, including labeled Pixel External");
console.log("- card buttons are link siblings; detail actions preserve primary CTA order and /games visibility");
console.log("- empty SSR, focus target, privacy disclosure and no-network boundary match the confirmed scope");
