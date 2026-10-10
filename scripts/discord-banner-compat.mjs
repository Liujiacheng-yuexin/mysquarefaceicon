import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// Test-only inverse of the user's Discord banner scope and authorized release fixes.
// Historical goldens stay unchanged;
// banner:check and the browser matrix test the new behavior itself.
const changes = JSON.parse(readFileSync(new URL("./fixtures/discord-banner-local-delta.json", import.meta.url), "utf8"));
const sha = text => createHash("sha256").update(text).digest("hex");
export function beforeDiscordBannerSource(file, value) {
  const change = changes.files[file];
  if (!change) return value;
  let source = value.toString().replace(/\r\n/g, "\n");
  // The legacy inverse chain can visit an already-reverted file more than once.
  if (!source.includes(change.marker)) return value;
  assert.equal(sha(source), change.afterSha256, `${file}: unexpected Discord banner change`);
  assert.equal(source.split(change.after).length - 1, 1, `${file}: exact banner delta must be unique`);
  source = source.replace(change.after, change.before);
  assert.equal(sha(source), change.beforeSha256, `${file}: change outside requested banner scope`);
  return source;
}

// Reverse only the reviewed accessible-name fix for frozen historical SSR.
export function beforeDiscordBannerMarkup(value) {
  const after = '<a class="brand" href="/" aria-label="Square Face Generator home">';
  const before = '<a class="brand" href="/" aria-label="My Square Face Icon home">';
  if (!value.includes(after)) return value;
  assert.equal(value.split(after).length - 1, 1, "shared brand link must be unique");
  return value.replace(after, before);
}
