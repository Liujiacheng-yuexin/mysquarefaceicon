# HOME-GALLERY-001 implementation and baseline evidence

Status: local implementation accepted by the user on 2026-09-01. Task result remains `有条件通过`; global release remains `不通过` because existing P0 blockers are still open.

Implementation date: 2026-09-01 (local development environment)

Acceptance: the user explicitly replied `确认验收，进行下一步开发` on 2026-09-01. This closes HOME-GALLERY-001 without changing the recorded unverified keyboard-focus item or any global release blocker. No commit, push, or deployment was authorized.

## Source and data findings

- `components/HomePage.tsx` maps the six homepage samples to hardcoded likes `120, 98, 76, 142, 110, 85`.
- `components/GalleryPreview.tsx` requires `likes: number` and renders a Heart plus an aria label for each value.
- Oval and Pixel legacy routes reuse the same component with additional hardcoded counts.
- The production English comments API returned HTTP 200 with zero approved comments at `2026-09-01T09:28:51.6524598+08:00`; see `production-approved-ugc-probe.json`.
- Local `/gallery` displayed `No creations yet` and `No approved comments yet. Share the first screenshot after your comment is reviewed.`
- The six root-homepage images are project-local 512 × 512 WebP files. Git commit history proves their repository introduction but does not by itself prove authorship or license, so the proposal uses `site-curated examples` and no originality claim.

## Browser baseline

### Desktop · 1440 × 900

- Heading: `Community Gallery Preview`
- Section document top: approximately `1555.59px`
- Section height: approximately `377.17px`
- Six hardcoded like aria labels were present.
- CTA: `View Full Gallery` → `/gallery`
- No horizontal overflow was measured.
- Screenshot: `baseline-desktop-1440x900.jpg`

### Mobile · 390 × 1000

- Browser content width: `375px`; document and body scroll width were also `375px`.
- Section document top: approximately `2037.23px`
- Section height: approximately `1620.92px`
- All six hardcoded like aria labels were present in vertically stacked cards.
- CTA remained `/gallery`.
- Screenshot: `baseline-mobile-390x1000.jpg`

## Proposal concepts

- `docs/product/concepts/home-gallery-001-desktop-concept.png`
- `docs/product/concepts/home-gallery-001-mobile-concept.png`

The concepts are layout specifications only. They are not UGC and will not be shipped as website images.

## Implemented scope

- Replaced the mandatory-like `GalleryPreview` with a server-rendered `CuratedGalleryPreview` whose item type contains only `title`, `src`, factual `alt`, `width`, and `height`.
- Added a single six-item curated data source in `data/curated-icon-ideas.ts`; it contains no likes, ratings, popularity, author, community, original, official, or authorization fields/claims.
- The shared HomePage now renders the confirmed `home-editorial` variant with the exact title, intro, trust note, six labels, and ordinary `/gallery` link.
- Oval and Pixel use the bounded `compact` variant in their existing module positions. Their H1, metadata, canonical, player/external-tool boundary, index state, and surrounding content remain unchanged.
- Deleted the unused old component so its required Heart/likes contract cannot be accidentally reused.
- `/gallery`, `CommentSection`, the comments API, moderation, real approved-comment likes, and honest empty state were not modified.

## Browser implementation evidence

The existing malformed `app/sitemap.ts` prevented a normal Next dev render. For browser-only QA, that exact file was temporarily renamed, then restored immediately after the checks. Its restored SHA-256 is `B21AEF365B81499147B4DAAF12F11A6802402D391185CD85E27E8BB6B34CEDD9`; the workaround is not a sitemap fix or release proof.

### Root homepage

- `1440 × 900`: requested viewport; one-line title, explanation column, a larger Cute figure plus five compact figures, six lazy images, CTA height about `49.59px`, section height about `389.55px`, initial Ruffle count `0`, and horizontal overflow `0`.
- `1280 × 900`: six desktop columns retained, section height about `406.91px`, horizontal overflow `0`.
- `430 × 1000`: true 3 × 2 figure grid, section height about `677.30px`, horizontal overflow `0`.
- `390 × 1000`: browser content width `375px`; 3 × 2 columns were approximately `102.33px` each, section height about `686.69px` versus the `1620.92px` baseline, CTA height about `49.59px`, horizontal overflow `0`, and sticky-header-safe heading top about `123.23px` versus header bottom `66px`.
- `360 × 1000`: true 3 × 2 grid, section height about `691.48px`, horizontal overflow `0`.
- All root widths showed six figures, no old community title, no like aria labels, and no initial Ruffle runtime.
- CTA click reached `/gallery`; the real page continued to show `No creations yet` and `No approved comments yet` with no horizontal overflow.
- Root browser console check returned no errors or warnings.
- Screenshots: `implementation-desktop-1440x900.jpg` and `implementation-mobile-390x1000.jpg`.

### Shared truth cleanup

- Oval at `1280` and `390`: exact existing H1/canonical preserved; six compact figures, no likes/community title, no Ruffle before Play, and no horizontal overflow. Section heights were about `385.98px` and `648.70px`.
- Pixel at `1280` and `390`: exact existing H1/canonical preserved; six compact figures, no likes/community title, no Ruffle, and no horizontal overflow. Section heights were about `385.98px` and `673.50px`.
- Pixel still exposes the external-tool adapter, `icongenerators.net` source, and safe original-page links; no iframe points to the external generator.
- The CSS contains a dedicated `:focus-visible` outline and the CTA is an ordinary named anchor. The in-app browser's Tab injection left `document.activeElement` on `BODY`, so the end-to-end keyboard-triggered focus appearance remains `未验证` rather than being claimed as passed.

## Concept fidelity ledger

1. The root module is an open cream editorial band, not the previous large gradient card.
2. Desktop keeps the explanation and truth boundary on the left and all six figures on the right.
3. Cute is visually larger without a Featured, Popular, Best, rating, or social-proof label.
4. The other five ideas form a compact stable rail with factual figcaptions.
5. Mobile uses the confirmed 3 × 2 contact sheet without hiding any image or copy.
6. Mobile CTA is a full-width, at-least-44px target after the figures in real DOM order.
7. Existing brown text, cream background, mint borders, and orange focus color remain aligned with the site style guide.

## Automated and engineering checks

Passed:

- `npm run home-gallery:check`
- `npm run home-discovery:check`
- `npm run home-hero:check`
- `npm run home:check`
- `npm run metadata:check`
- `npm run games:check`
- `npm run player:check`
- `npm run routes:check`
- `npm run components:check`
- task-scope TypeScript through `tsconfig.home-gallery-check.json`
- task-scope ESLint, runner syntax, JSON parsing, and screenshot dimension/format inspection

Blocked/failed only at the preserved `app/sitemap.ts` parser error:

- full `tsc --noEmit`: `不通过`
- `npm run lint`: `不通过`
- `npm run build`: `不通过`
- `npm run cf:build`: `不通过`

No production build exists, so `npm run seo:check` is `未验证`. No deployment was authorized, so `npm run seo:prod` was not run.

## SEO, data, and release boundary

- Affected visible URLs: `/`, `/oval-face-icon-generator`, `/pixel-art-avatar-icon-generator`.
- Frozen and unchanged: URL, title, description, H1 values, canonical, Open Graph, Twitter, schema, robots/indexability, language alternates, sitemap membership, search intent, and player behavior.
- The root CTA remains a server-rendered ordinary internal `/gallery` link.
- No database, API, moderation, submission, privacy, or approved-like behavior changed.
- No commit, push, deployment, migration, secret, production verification, or `seo:prod` occurred.

Rollback: restore the three former call-site arrays and old preview component, remove `CuratedGalleryPreview`, `data/curated-icon-ideas.ts`, the scoped CSS/check/command, and these task records. No data, URL, metadata, index, player, SWF, or deployment rollback is required.

## Quality boundary

The implementation removes unsupported metrics and community claims, but the global release remains blocked by the preserved malformed `app/sitemap.ts`, HTTP canonicalization, mobile LCP, exact Square/Oval license evidence, and the existing KW-02 findings. These cannot be hidden by the task-level checks.
