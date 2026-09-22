import assert from "node:assert/strict";
import { beforeImageMobileSource } from "./image-mobile-legacy-compat.mjs";

const count = (value, needle) => value.split(needle).length - 1;

// Reverse only ASSET-001's confirmed package/documentation additions before
// immutable older task goldens run. The downstream hashes still reject every
// unrelated change; this compatibility layer never changes runtime behavior.
export function beforeAssetSource(file, value) {
  value = beforeImageMobileSource(file, value);
  let source = value.toString().replace(/\r\n/g, "\n");
  if (file === "package.json") {
    const line = '    "assets:check": "node scripts/run-game-asset-check.mjs",\n';
    if (!source.includes(line)) return source;
    assert.equal(count(source, line), 1, `${file}: approved ASSET-001 script entry missing or duplicated`);
    return source.replace(line, "");
  }
  if (file === "scripts/README.md") {
    const block = "## ASSET-001 game-asset boundary\n\n`npm run assets:check` compiles and validates the ASSET-001 game-asset manifest. It maps every current Game Data image\nand SWF URL to one manifest record, verifies local files by byte length and SHA-256, and rejects unapproved hosts,\nHTTP/r2.dev/query-versioned CDN URLs, mutable caching on content-addressed R2 objects, UNKNOWN or review-required R2\nmigration, Ruffle takeover, Pixel generator copying, missing references, and conflicting metadata. It is read-only: it\nnever uploads, deletes, or changes R2, local assets, Game Data, or page URLs. Run\n`node scripts/run-game-asset-check.mjs --base http://127.0.0.1:3100` to add loopback status, MIME, cache, byte, SHA-256,\nand no-R2-page-reference checks against a running production build.\n\n";
    if (!source.includes(block)) return source;
    assert.equal(count(source, block), 1, `${file}: approved ASSET-001 documentation block missing or duplicated`);
    return source.replace(block, "");
  }
  return value;
}
