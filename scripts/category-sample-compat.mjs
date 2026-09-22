import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { beforeCategoryRemainingSource } from "./category-remaining-compat.mjs";

// Only reverse the explicitly confirmed CATEGORY-001 follow-on patch. Existing
// migration and directory goldens remain unchanged; unrelated edits must fail.
const changes = JSON.parse(readFileSync(new URL("./fixtures/category-sample-approved-source-delta.json", import.meta.url), "utf8"));
const sha = value => createHash("sha256").update(value).digest("hex");

export function beforeCategorySampleSource(file, value) {
  value = beforeCategoryRemainingSource(file, value);
  const change = changes[file];
  if (!change) return value;
  let source = value.toString();
  const normalized = sha(source) !== change.afterSha256;
  const lf = text => normalized ? text.replace(/\r\n/g, "\n") : text;
  assert.equal(sha(source), normalized ? change.afterSha256LF : change.afterSha256, file + ": unexpected category follow-on change");
  for (const edit of [...change.edits].reverse()) {
    const offset = normalized ? edit.offsetLF : edit.offset;
    assert.equal(source.slice(offset, offset + lf(edit.after).length), lf(edit.after), file + ": approved category fragment missing");
    source = source.slice(0, offset) + lf(edit.before) + source.slice(offset + lf(edit.after).length);
  }
  assert.equal(sha(source), normalized ? change.beforeSha256LF : change.beforeSha256, file + ": change outside category scope");
  return source;
}

export function beforeCategoryHomeNavigation(html) {
  const links = [...html.matchAll(/<a\b[^>]*class="category-chip category-chip-home"[^>]*>/g)];
  if (links.length === 0) return html;
  const slugs = ["face-makers", "avatar-makers", "pixel-avatars", "retro-flash", "character-creators"];
  assert.equal(links.length, slugs.length, "Only the five approved home category links may change navigation");
  for (const [index, link] of links.entries()) {
    assert.ok(link[0].includes(`href="/category/${slugs[index]}"`));
    assert.ok(link[0].includes(`data-category-slug="${slugs[index]}"`));
    assert.equal(link[0].split(' data-navigation="document"').length, 2, "Home category document boundary missing");
    html = html.replace(link[0], link[0].replace(' data-navigation="document"', ""));
  }
  return html;
}
