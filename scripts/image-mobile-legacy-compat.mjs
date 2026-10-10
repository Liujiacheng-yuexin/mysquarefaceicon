import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { beforeDiscordBannerSource } from "./discord-banner-compat.mjs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/image-mobile-legacy-delta.json", import.meta.url), "utf8"));
const sha = value => createHash("sha256").update(value).digest("hex");
const markers = {
  "lib/games/game-schema.ts": "export type GameImageRole",
  "data/games/square-face.ts": 'role: "PLAYER_PREVIEW"',
  "data/games/oval-face.ts": 'role: "PLAYER_PREVIEW"',
  "lib/games/game-player-model.ts": "getGamePlayerPreview",
  "lib/games/square-homepage.ts": "getGamePlayerPreview",
  "lib/games/oval-legacy-page.ts": "getGamePlayerPreview",
  "lib/games/recently-played.ts": "getGameImage",
  "components/game/GameCard.tsx": "getGameImage",
  "components/game/RecentlyPlayed.tsx": 'loading="lazy"',
  "components/GameSidebar.tsx": 'loading="lazy"',
  "lib/seo/game-metadata.ts": "getGameOpenGraphImage",
  "package.json": '"images:check"',
  "components/home/HomeHero.tsx": "AvatarGenerator",
  "components/AvatarGenerator.tsx": "compact",
  "scripts/validate-home-hero.tsx": "PLAYER_PREVIEW",
  "scripts/validate-home-performance.tsx": "PLAYER_PREVIEW",
  "scripts/validate-game-template.tsx": "PLAYER_PREVIEW",
  "scripts/validate-home-discovery.tsx": "getGameImage",
  "scripts/check-pixel-external-page.mjs": "beforeImageMobileSource",
  "app/globals.css": ".simple-maker"
};

// Test-only exact inverse. Historical golden hashes and runtime sources remain
// unchanged. Current image behavior and maker interactions have their own QA.
export function beforeImageMobileSource(file, value) {
  value = beforeDiscordBannerSource(file, value);
  const contract = fixture.files[file];
  if (!contract) return value;
  let source = value.toString().replace(/\r\n/g, "\n");
  if (!source.includes(markers[file])) return value;
  assert.equal(sha(source), contract.afterSha256, file + ": unexpected image/mobile source delta");
  for (const { after, before } of contract.edits) {
    assert.equal(source.split(after).length - 1, 1, file + ": exact inverse fragment must be unique");
    source = source.replace(after, before);
  }
  assert.equal(sha(source), contract.beforeSha256, file + ": image/mobile inverse changed unrelated source");
  return source;
}
