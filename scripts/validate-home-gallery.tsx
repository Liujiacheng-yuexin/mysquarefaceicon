import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import CuratedGalleryPreview from "../components/CuratedGalleryPreview";
import { homeCuratedIconIdeas } from "../data/curated-icon-ideas";

const projectRoot = resolve(__dirname, "../..");
const fixedTitle = "Curated Icon Ideas";
const fixedIntro = "Explore six square face styles for color, expression, and profile-crop inspiration.";
const fixedTrustNote = "Site-curated examples — not community submissions.";

async function main() {
  assert.equal(homeCuratedIconIdeas.length, 6, "The root curated preview must contain exactly six ideas.");
  assert.deepEqual(
    homeCuratedIconIdeas.map((item) => item.title),
    ["Cute", "Retro", "Funny", "Minimal", "Gamer", "Classic"],
    "The confirmed root idea order must remain stable."
  );

  const markup = renderToStaticMarkup(
    <CuratedGalleryPreview
      title={fixedTitle}
      intro={fixedIntro}
      trustNote={fixedTrustNote}
      items={homeCuratedIconIdeas}
      variant="home-editorial"
    />
  );

  assert.match(markup, /<section[^>]+aria-labelledby="curated-icon-ideas-home-editorial"/);
  assert.match(markup, /<h2 id="curated-icon-ideas-home-editorial">Curated Icon Ideas<\/h2>/);
  assert.ok(markup.includes(fixedIntro));
  assert.ok(markup.includes(fixedTrustNote));
  assert.match(markup, /href="\/gallery"[^>]*>Browse All Icon Ideas/);
  assert.equal((markup.match(/data-curated-gallery-item=/g) ?? []).length, 6);
  assert.equal((markup.match(/<figure/g) ?? []).length, 6);
  assert.equal((markup.match(/loading="lazy"/g) ?? []).length, 6);
  assert.equal((markup.match(/width="512" height="512"/g) ?? []).length, 6);
  assert.doesNotMatch(markup, /Community Gallery Preview|aria-label="[^"]* likes"|rating|popularity/i);

  const componentSource = readFileSync(resolve(projectRoot, "components/CuratedGalleryPreview.tsx"), "utf8");
  assert.doesNotMatch(componentSource, /\bHeart\b|\blikes\b|\brating\b|\bpopularity\b|\bauthor\b/i);
  assert.doesNotMatch(componentSource, /["']use client["']|fetch\(|onClick=|localStorage|sessionStorage/);
  assert.match(componentSource, /<figure/);
  assert.match(componentSource, /<figcaption>/);
  assert.match(componentSource, /loading="lazy"/);

  const dataSource = readFileSync(resolve(projectRoot, "data/curated-icon-ideas.ts"), "utf8");
  assert.doesNotMatch(dataSource, /\blikes\b|\brating\b|\bpopularity\b|\bauthor\b|\bcommunity\b/i);
  assert.doesNotMatch(dataSource, /made in|original|official|authorized/i);

  const homePageSource = readFileSync(resolve(projectRoot, "components/HomePage.tsx"), "utf8");
  const ovalPageSource = readFileSync(resolve(projectRoot, "app/oval-face-icon-generator/page.tsx"), "utf8");
  const pixelPageSource = readFileSync(resolve(projectRoot, "app/pixel-art-avatar-icon-generator/page.tsx"), "utf8");
  const sharedCallSources = [homePageSource, ovalPageSource, pixelPageSource].join("\n");

  assert.match(homePageSource, /items=\{homeCuratedIconIdeas\}/);
  assert.match(homePageSource, /variant="home-editorial"/);
  assert.match(ovalPageSource, /variant="compact"/);
  assert.match(pixelPageSource, /variant="compact"/);
  assert.doesNotMatch(sharedCallSources, /Community Gallery Preview|<GalleryPreview|@\/components\/GalleryPreview/);
  assert.doesNotMatch(sharedCallSources, /\blikes\s*:/i);
  assert.equal(
    existsSync(resolve(projectRoot, "components/GalleryPreview.tsx")),
    false,
    "The mandatory-like GalleryPreview component must stay removed."
  );

  const galleryPageSource = readFileSync(resolve(projectRoot, "app/gallery/page.tsx"), "utf8");
  assert.match(galleryPageSource, /<CommentSection/);
  assert.match(galleryPageSource, /locale="en"/);

  const cssSource = readFileSync(resolve(projectRoot, "app/globals.css"), "utf8");
  for (const className of [
    ".curated-gallery-home-editorial",
    ".curated-gallery-compact",
    ".curated-gallery-figures",
    ".curated-gallery-action:focus-visible"
  ]) {
    assert.match(cssSource, new RegExp(className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(cssSource, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);

  for (const item of homeCuratedIconIdeas) {
    const assetPath = resolve(projectRoot, "public", item.src.replace(/^\//, ""));
    assert.ok(existsSync(assetPath), `Missing curated asset: ${item.src}`);
    const metadata = await sharp(assetPath).metadata();
    assert.equal(metadata.format, "webp", `${item.src} must remain WebP.`);
    assert.equal(metadata.width, item.width, `${item.src} width must match its explicit Image width.`);
    assert.equal(metadata.height, item.height, `${item.src} height must match its explicit Image height.`);
    assert.equal(metadata.width, 512, `${item.src} must remain 512px wide.`);
    assert.equal(metadata.height, 512, `${item.src} must remain 512px high.`);
  }

  console.log("HOME-GALLERY-001 validation passed");
  console.log("- exact curated title, copy, trust note, six-item order, and ordinary /gallery link passed");
  console.log("- semantic figures, explicit 512x512 dimensions, lazy loading, and responsive 3x2 CSS passed");
  console.log("- hardcoded likes, Heart UI, community-title claims, and the old mandatory-like component are absent");
  console.log("- Home uses the editorial variant; Oval and Pixel use the bounded compact variant");
  console.log("- the real /gallery CommentSection remains in place");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
