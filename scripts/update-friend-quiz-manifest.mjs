// Explicit QUIZ-001 inventory refresh, used after an intentional static asset edit.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
const path = "data/game-asset-manifest.json";
const manifest = JSON.parse(readFileSync(path, "utf8"));
manifest.cachePolicies.appStaticNoTransform = "public, max-age=0, no-transform";
const originals = manifest.assets.filter(asset => asset.gameId !== "friend-block-test");
const root = "public/games/friend-block-test/";
const files = readdirSync(root).filter(file => /\.(html|css|mjs|webp)$/.test(file)).map(file => root + file);
for (const avatar of ["classic", "cute", "funny", "gamer", "minimal", "retro"]) files.push(`public/game-face-samples/${avatar}.webp`);
const entries = files.map(sourcePath => {
  const content = readFileSync(sourcePath);
  const file = sourcePath.split("/").at(-1);
  const extension = file.split(".").at(-1);
  const existingSample = sourcePath.includes("/game-face-samples/");
  return {
    assetId: `friend-block-test-${existingSample ? "avatar-" : ""}${file.replaceAll(".", "-")}`,
    gameId: "friend-block-test", kind: extension === "webp" ? "IMAGE" : "HTML5_BUNDLE",
    delivery: "APP_STATIC", url: sourcePath.slice(6), objectKey: null, bytes: content.length,
    sha256: createHash("sha256").update(content).digest("hex"),
    contentType: { html: "text/html", css: "text/css", mjs: "text/javascript", webp: "image/webp" }[extension],
    cacheControl: existingSample ? manifest.cachePolicies.appStatic : manifest.cachePolicies.appStaticNoTransform, licenseRegistryRecordId: existingSample ? null : "friend-block-test-original",
    rightsGate: existingSample ? "REVIEW_REQUIRED" : "ALLOWED", migrationStatus: "HOLD_CURRENT", sourcePath
  };
});
manifest.assets = [...originals, ...entries];
writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n");
console.log(`QUIZ-001 manifest: ${entries.length} local files; ${originals.length} previous entries unchanged.`);
