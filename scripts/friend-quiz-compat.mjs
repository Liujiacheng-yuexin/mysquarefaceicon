import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/friend-quiz-approved-delta.json", import.meta.url), "utf8"));
const sha = value => createHash("sha256").update(value).digest("hex");

// A test-only exact inverse of the approved QUIZ-001 delta. It preserves older
// task goldens; current quiz behavior is checked against real, unmodified files.
export function beforeFriendQuizSource(file, value) {
  const change = fixture.files[file];
  if (!change) return value;
  const source = value.toString().replace(/\r\n/g, "\n");
  if (!source.includes(change.marker)) return value; // Already visited by an older inverse.
  assert.equal(sha(source), change.afterSha256, `${file}: unexpected QUIZ-001 delta`);
  assert.equal(source.slice(change.offset, change.offset + change.after.length), change.after, `${file}: exact QUIZ-001 fragment missing`);
  const restored = source.slice(0, change.offset) + change.before + source.slice(change.offset + change.after.length);
  assert.equal(sha(restored), change.beforeSha256, `${file}: QUIZ-001 inverse changed unrelated content`);
  return restored;
}

export function beforeFriendQuizTermsMarkup(value) {
  const block = /<h2>Friend Quizzes<\/h2>\s*<p>([\s\S]*?)<\/p>/;
  const match = block.exec(value);
  if (!match) return value;
  const plain = text => text.replace(/&(?:apos|#x27|#39);/g, "'").replace(/\s+/g, " ").trim();
  const source = readFileSync(new URL("../app/terms-of-service/page.tsx", import.meta.url), "utf8");
  // The complete runtime source must still match the approved exact delta.
  beforeFriendQuizSource("app/terms-of-service/page.tsx", source);
  assert.equal(plain(match[1]), plain(block.exec(source)[1]), "Quiz terms must render the approved local-storage disclosure");
  return value.replace(block, "").replace("Last updated: October 12, 2026", "Last updated: September 2, 2026");
}

// Existing categories automatically gain exactly one new navigation chip.
// Verify it before removing it for immutable, pre-quiz rendered snapshots.
export function beforeFriendQuizCategoryMarkup(value) {
  const pattern = /<a\b[^>]*data-category-slug="friend-quizzes"[^>]*>[\s\S]*?<\/a>/g;
  const matches = value.match(pattern) ?? [];
  if (matches.length === 0) return value;
  assert.equal(matches.length, 1, "Only one Friend Quizzes category chip is allowed");
  assert.equal(matches[0], '<a class="category-chip" data-category-slug="friend-quizzes" href="/category/friend-quizzes" data-navigation="document"><strong>Friend Quizzes</strong><span>1 current entry</span></a>', "New category navigation must match the approved addition");
  return value.replace(pattern, "");
}
