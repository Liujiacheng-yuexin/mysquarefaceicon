import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/friend-quiz-fixes-delta.json", import.meta.url), "utf8"));
const sha = text => createHash("sha256").update(text).digest("hex");

// Only the explicitly approved 2026-10-13 repair is reversed for historical
// snapshots. Current repair tests always exercise the real files and browser.
export function beforeFriendQuizFixesSource(file, value) {
  const change = fixture.files[file];
  if (!change) return value;
  const text = value.toString().replace(/\r\n/g, "\n");
  if (!text.includes(change.marker)) return value;
  assert.equal(sha(text), change.afterSha256, `${file}: unexpected QUIZ-001 delta (2026-10-13 repair)`);
  assert.equal(text.slice(change.offset, change.offset + change.after.length), change.after);
  const restored = text.slice(0, change.offset) + change.before + text.slice(change.offset + change.after.length);
  assert.equal(sha(restored), change.beforeSha256, `${file}: quiz repair inverse changed unrelated content`);
  return restored;
}
