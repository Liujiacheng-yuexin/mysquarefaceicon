import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { beforeRelatedGamesSource } from "./related-games-compat.mjs";

// Bounded inverses of the separately confirmed four-page batch, applied before
// the older sample and migration contracts. Old goldens are not regenerated.
const changes = JSON.parse(readFileSync(new URL("./fixtures/category-remaining-approved-source-delta.json", import.meta.url), "utf8"));
const rendered = JSON.parse(readFileSync(new URL("./fixtures/category-remaining-contract.json", import.meta.url), "utf8"));
const sha = value => createHash("sha256").update(value).digest("hex");
const count = (text, value) => text.split(value).length - 1;

export function beforeCategoryRemainingSource(file, value) {
  value = beforeRelatedGamesSource(file, value);
  const change = changes[file];
  if (!change) return value;
  let source = value.toString();
  const normalized = sha(source) !== change.afterSha256;
  const lf = text => normalized ? text.replace(/\r\n/g, "\n") : text;
  assert.equal(sha(source), normalized ? change.afterSha256LF : change.afterSha256, file + ": unexpected four-page batch change");
  for (const edit of [...change.edits].reverse()) {
    const offset = normalized ? edit.offsetLF : edit.offset;
    assert.equal(source.slice(offset, offset + lf(edit.after).length), lf(edit.after), file + ": approved batch fragment missing");
    source = source.slice(0, offset) + lf(edit.before) + source.slice(offset + lf(edit.after).length);
  }
  assert.equal(sha(source), normalized ? change.beforeSha256LF : change.beforeSha256, file + ": change outside batch scope");
  return source;
}

export function beforeCategoryRemainingMetadata(metadata, slug) {
  const contract = rendered.categories[slug];
  if (!contract?.choiceSection) return metadata;
  assert.deepEqual(JSON.parse(JSON.stringify(metadata)), contract.afterMetadata, slug + ": unexpected batch metadata");
  const { openGraph: _openGraph, twitter: _twitter, ...original } = metadata;
  assert.equal(sha(JSON.stringify(original)), contract.beforeMetadataSha256, slug + ": original metadata drift");
  return original;
}

export function beforeCategoryRemainingMarkup(html, slug) {
  const contract = rendered.categories[slug];
  if (!contract?.choiceSection) return html;
  const fragments = [...contract.schemaScripts, contract.choiceSection, contract.otherSection];
  for (const fragment of fragments) {
    assert.equal(count(html, fragment), 1, slug + ": exact approved batch addition missing or duplicated");
    html = html.replace(fragment, "");
  }
  for (const [after, before] of contract.headingEdits) {
    assert.equal(count(html, after), 1, slug + ": exact approved heading/label missing or duplicated");
    html = html.replace(after, before);
  }
  return html;
}
