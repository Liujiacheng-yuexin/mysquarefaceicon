import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { beforeRelatedRemainingSource } from "./related-remaining-compat.mjs";
import { beforeRecentlyPlayedSource } from "./recently-played-compat.mjs";
import { beforeFavoritesMarkup } from "./favorites-compat.mjs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/related-games-approved-delta.json", import.meta.url), "utf8"));
const sha = value => createHash("sha256").update(value).digest("hex");
const count = (text, value) => text.split(value).length - 1;

function reverseApprovedSource(file, source, afterSha256, beforeSha256, replacements) {
  assert.equal(sha(source), afterSha256, `${file}: unexpected RELATED-001 compatibility change`);
  for (const [after, before] of replacements) {
    assert.equal(count(source, after), 1, `${file}: approved RELATED-001 compatibility fragment missing or duplicated`);
    source = source.replace(after, before);
  }
  assert.equal(sha(source), beforeSha256, `${file}: change outside approved RELATED-001 compatibility scope`);
  return source;
}

// Reverse only the explicitly approved RELATED-001 source delta before older
// migration goldens run. The old snapshots and hashes are never regenerated.
export function beforeRelatedGamesSource(file, value) {
  value = beforeRecentlyPlayedSource(file, value);
  value = beforeRelatedRemainingSource(file, value);
  const supportedFiles = new Set([
    "package.json",
    "scripts/README.md",
    "scripts/check-oval-legacy-page.mjs",
    "scripts/category-remaining-compat.mjs",
    "scripts/check-category-sample.mjs",
    "scripts/check-category-remaining.mjs",
    "app/oval-face-icon-generator/page.tsx"
  ]);
  if (!supportedFiles.has(file)) return value;
  let source = value.toString().replace(/\r\n/g, "\n");
  if (file === "package.json") {
    const approvedLine = '    "related:check": "node scripts/run-related-games-check.mjs",\n';
    assert.equal(sha(source), "fb680047b7f00a24ed1ffd928191e6c0eb63657a83a24094e013d0dab1a0a694", `${file}: unexpected RELATED-001 package change`);
    assert.equal(count(source, approvedLine), 1, `${file}: approved RELATED-001 script entry missing or duplicated`);
    source = source.replace(approvedLine, "");
    assert.equal(sha(source), "7ffd72f3b5ec5e853869d8238da1ea11ce9ae4c84348725509a9ee10e7c756c5", `${file}: change outside approved RELATED-001 package scope`);
    return source;
  }
  if (file === "scripts/README.md") {
    const approvedBlock = "## RELATED-001 deterministic recommendation check\n\n`npm run related:check` compiles and runs the server-side Category + Tags selector checks. It verifies the current Oval → Square/Pixel order, category/tag/ID precedence, strict limits, input immutability, duplicate ID/path exclusion, publication and fake-legacy gates, missing/invalid/empty states, the disabled quality/popularity boundary, and the approved Oval source grouping. It does not grant rights, index eligibility, production approval, or test rendered browser behavior.\n\n";
    assert.equal(sha(source), "fa14a69f2a8d5a05faf66f429371a2b6af3f50841de0a8425f45441b92fa19b4", `${file}: unexpected RELATED-001 documentation change`);
    assert.equal(count(source, approvedBlock), 1, `${file}: approved RELATED-001 documentation missing or duplicated`);
    source = source.replace(approvedBlock, "");
    assert.equal(sha(source), "33e2a7efc167a8eed4fd1dd72ee67fb78d7012e7c6bb059468e0158d99e8adf8", `${file}: change outside approved RELATED-001 documentation scope`);
    return source;
  }
  if (file === "scripts/check-oval-legacy-page.mjs") {
    return reverseApprovedSource(file, source,
      "0dea536cdd2e7728c0dccf8895a54052677ab7d6eb208aa85c42305318794e13",
      "e956d6505ff788195c61f9e664cb63bc98e04bc75bd940871df0710fff612bc2",
      [
        ['import { beforeRelatedGamesMarkup, beforeRelatedGamesSource } from "./related-games-compat.mjs";\n', ""],
        ['  const currentMain = html.match(/<main\\b[^>]*>([\\s\\S]*?)<\\/main>/)?.[1];\n  const main = currentMain ? beforeRelatedGamesMarkup(currentMain) : currentMain;\n', '  const main = html.match(/<main\\b[^>]*>([\\s\\S]*?)<\\/main>/)?.[1];\n'],
        ['  const pageSource = beforeRelatedGamesSource(pageFile, read(pageFile));\n', '  const pageSource = read(pageFile);\n'],
        ['    assert.equal(sha(beforeGamesIndexNavigation(restoreOriginalCoverDimensions(originalPixelSidebarMarkup(beforeRelatedGamesMarkup(html), 1)))), golden.ssr,\n', '    assert.equal(sha(beforeGamesIndexNavigation(restoreOriginalCoverDimensions(originalPixelSidebarMarkup(html, 1)))), golden.ssr,\n'],
        ['      const html = beforeRelatedGamesMarkup(renderPage(modules({ records })));\n', '      const html = renderPage(modules({ records }));\n']
      ]
    );
  }
  if (file === "scripts/category-remaining-compat.mjs") {
    return reverseApprovedSource(file, source,
      "f076ec8a74743d964390772fc745f95b23f08a3fbada4c3db6278a89b32a9daf",
      "8d3c31e79eecc732e0aaca4a33e940e8b9d0f134795960e8471c0ab869270574",
      [
        ['import { beforeRelatedGamesSource } from "./related-games-compat.mjs";\n', ""],
        ['  value = beforeRelatedGamesSource(file, value);\n', ""]
      ]
    );
  }
  if (file === "scripts/check-category-sample.mjs") {
    return reverseApprovedSource(file, source,
      "de47ff29533231e3cd0cd5402b074d646c7d959d90a80b87efcb754ce1f3b46d",
      "32d380d645a2e517c95edf507c10fb4cca8539b28d1068905685155ac199b117",
      [
        ['import { beforeRelatedGamesSource } from "./related-games-compat.mjs";\n', ""],
        ['for (const [file, expected] of Object.entries(golden.frozenFiles)) same(sha(beforeRelatedGamesSource(file, readFileSync(resolve(root, file)))), expected, "frozen " + file);\n', 'for (const [file, expected] of Object.entries(golden.frozenFiles)) same(sha(readFileSync(resolve(root, file))), expected, "frozen " + file);\n']
      ]
    );
  }
  if (file === "scripts/check-category-remaining.mjs") {
    return reverseApprovedSource(file, source,
      "a224fcb104885b7be2c769dcbf5a8d38a852b2508feb3f71080c5bb30c1deeb8",
      "b26874f271a89b44d7c14238498139c5585436be4d72883a5591e275884744e9",
      [
        ['import { beforeRelatedGamesSource } from "./related-games-compat.mjs";\n', ""],
        ['for (const [file, expected] of Object.entries(contract.frozenFiles)) same(sha(beforeRelatedGamesSource(file, readFileSync(resolve(root, file)))), expected, "frozen " + file);\n', 'for (const [file, expected] of Object.entries(contract.frozenFiles)) same(sha(readFileSync(resolve(root, file))), expected, "frozen " + file);\n']
      ]
    );
  }
  assert.equal(sha(source), fixture.source.afterSha256LF, `${file}: unexpected RELATED-001 source change`);
  for (const edit of [...fixture.source.edits].reverse()) {
    assert.ok(edit.after.length > 0, `${file}: approved inverse cannot target an empty fragment`);
    assert.equal(count(source, edit.after), 1, `${file}: approved RELATED-001 fragment missing or duplicated`);
    source = source.replace(edit.after, edit.before);
  }
  assert.equal(sha(source), fixture.source.beforeSha256LF, `${file}: change outside approved RELATED-001 source scope`);
  return source;
}

// The new and old rendered groups are exact server-rendered fragments. Revert
// only that one fragment so the original MIG-OVAL SSR/build goldens still prove
// every previously accepted byte outside this task.
export function beforeRelatedGamesMarkup(value) {
  const html = beforeFavoritesMarkup(value);
  assert.ok(fixture.markup.after.length > 0, "RELATED-001 rendered fragment must be non-empty");
  const exactCount = count(html, fixture.markup.after);
  if (exactCount === 1) return html.replace(fixture.markup.after, fixture.markup.before);
  assert.equal(exactCount, 0, "Approved RELATED-001 rendered fragment duplicated");

  // Older MIG-OVAL relationship-binding tests deliberately change a related
  // record's href. Reconstruct the old mixed section from the same rendered
  // Square card and unchanged guide cards while removing the new Pixel card.
  const sectionsPattern = /<section class="content-band alt-band" aria-labelledby="related-avatar-games-heading">[\s\S]*?<\/section><section class="content-band" aria-labelledby="avatar-guides-heading">[\s\S]*?<\/section>/g;
  const sections = html.match(sectionsPattern) ?? [];
  assert.equal(sections.length, 1, "Approved RELATED-001 rendered sections missing or duplicated");
  const current = sections[0];
  const square = current.match(/<a class="related-card" data-game-id="square-face" data-game-page-type="GAME" href="([^"]+)">([\s\S]*?)<\/a>/);
  const pixel = current.match(/<a class="related-card route-game-link-external" data-game-id="pixel-art-avatar" data-game-page-type="EXTERNAL_TOOL" href="[^"]+">[\s\S]*?<\/a>/);
  const guides = current.match(/<div class="related-grid" aria-label="Avatar guides and inspiration">([\s\S]*)<\/div><\/section>$/);
  assert.ok(square, "Approved Square recommendation missing");
  assert.ok(pixel, "Approved Pixel External recommendation missing");
  assert.ok(guides, "Approved guide group missing");
  assert.equal((guides[1].match(/<a class="related-card"/g) ?? []).length, 3, "Approved guide cards changed");
  const original = `<section class="content-band alt-band"><div class="section-heading"><p class="eyebrow">More avatar makers</p><h2>Related Avatar Games and Tools</h2></div><div class="related-grid"><a class="related-card" href="${square[1]}">${square[2]}</a>${guides[1]}</div></section>`;
  return html.replace(current, original);
}
