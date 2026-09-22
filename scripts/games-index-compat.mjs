import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { beforeCategoryHomeNavigation, beforeCategorySampleSource } from "./category-sample-compat.mjs";
import { beforeRecentlyPlayedSource } from "./recently-played-compat.mjs";

// Exact, reviewable inverses of the confirmed GAMES-INDEX-001 follow-on changes.
// Old migration goldens remain untouched. Neither current source nor mutable QA
// evidence is an oracle, and unrelated edits still fail the original hashes.
const changes = JSON.parse(readFileSync(new URL("./fixtures/games-index-approved-source-delta.json", import.meta.url), "utf8"));
const sha = value => createHash("sha256").update(value).digest("hex");
const count = (text, value) => text.split(value).length - 1;

export function beforeGamesIndexSource(file, value) {
  value = beforeRecentlyPlayedSource(file, value);
  value = beforeCategorySampleSource(file, value);
  const change = changes[file];
  if (!change) return value;
  let source = value.toString();
  const normalized = sha(source) !== change.afterSha256;
  const lf = text => normalized ? text.replace(/\r\n/g, "\n") : text;
  assert.equal(sha(source), normalized ? change.afterSha256LF : change.afterSha256, file + ": unexpected follow-on source change");
  for (const edit of [...change.edits].reverse()) {
    const offset = normalized ? edit.offsetLF : edit.offset;
    assert.equal(source.slice(offset, offset + lf(edit.after).length), lf(edit.after), file + ": exact approved directory edit missing");
    source = source.slice(0, offset) + lf(edit.before) + source.slice(offset + lf(edit.after).length);
  }
  assert.equal(sha(source), normalized ? change.beforeSha256LF : change.beforeSha256, file + ": change outside confirmed directory scope");
  return source;
}

export function beforeGamesIndexNavigation(html) {
  html = beforeCategoryHomeNavigation(html);
  const link = '<a href="/games">All avatar games</a>';
  // Header desktop/mobile and footer. A missing or changed label is not ignored.
  assert.equal(count(html, link), 3, "Expected only the three approved directory navigation entries");
  return html.replaceAll(link, "");
}
