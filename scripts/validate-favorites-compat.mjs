import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeFavoritesMarkup, beforeFavoritesSource } from "./favorites-compat.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sha = value => createHash("sha256").update(value).digest("hex");
const expected = {
  "components/game/GameCard.tsx": "e405ecff0e4a26ef3ed686ef5ac7c06d5c622312d17a010bdcae6e495c66edcd",
  "components/game/GameGrid.tsx": "ae5a454723185b9c2b34f2129c00e1e3cc3d6336567034d9b4f7798767b71f6c",
  "components/game/RecentlyPlayed.tsx": "110671be591af757b7114ad322048d5f607d8367fe0dd67ebcd1244931334b07",
  "components/home/HomeHero.tsx": "d7c0c2c35b98735c002d4a9066b68615e73df77326cc42468eaee6607b442fd3",
  "components/game/GameDetailTemplate.tsx": "fc810e5de24498107c5081a154177a875b24e97451c45a9f753e4745805a01e9",
  "app/games/page.tsx": "14de6c9dc2e3eab53eaffb264c225e929ac99f9828d1fd2ad583c81c207a7409",
  "app/privacy-policy/page.tsx": "fce773f0aa2d14a915cde7a9efacd1369b3834eb8fb7d7100fcc6a02cfb4c1f4",
  "app/oval-face-icon-generator/page.tsx": "dcabb4e17228e253afe758d299a67ec7c514011272a39eb11575e25963ab4ae6",
  "app/pixel-art-avatar-icon-generator/page.tsx": "586c30c4807991934096fcdf753bf5c09b3953369d0ea18d7fefcfed95570dbd",
  "app/globals.css": "ba915d64081b80d6f166983c090f155f9434267b0ef844ed3074932c0a2993c6",
  "package.json": "56bb4a5cd9743882b38f1d51a3683829fc8cafb95f6ba223402294e6062c94cd",
  "scripts/README.md": "fcef3c53881348b5eb979c4ba7baf48a54a438fc5d1ae44910faa586471f6d81"
};

for (const [file, hash] of Object.entries(expected)) {
  const source = readFileSync(resolve(root, file), "utf8");
  assert.equal(sha(beforeFavoritesSource(file, source)), hash, `${file}: bounded FAV-001 inverse drifted`);
  assert.equal(beforeFavoritesSource(file, beforeFavoritesSource(file, source)), beforeFavoritesSource(file, source));
}

const binary = readFileSync(resolve(root, "public/games/square-face-cover.png"));
assert.ok(Buffer.isBuffer(beforeFavoritesSource("public/games/square-face-cover.png", binary)));
assert.equal(sha(beforeFavoritesSource("public/games/square-face-cover.png", binary)), sha(binary));

const currentMarkup = '<div class="favoritable-game-card"><a href="/" data-game-id="square-face">Square</a><div class="favorite-actions favorite-actions-card" data-favorite-actions="true"><button data-favorite-toggle="true">Favorite</button><span class="favorites-live" aria-live="polite" aria-atomic="true"></span></div></div>';
assert.equal(beforeFavoritesMarkup(currentMarkup), '<a href="/" data-game-id="square-face">Square</a>');
assert.equal(beforeFavoritesMarkup('<a href="/guide">Guide</a>'), '<a href="/guide">Guide</a>');

console.log("FAV-001 compatibility validation passed");
console.log("- exact pre-FAV source hashes remain available to immutable historical checks");
console.log("- binary inputs remain byte-identical and only favorite wrappers/controls are removed from legacy SSR");
