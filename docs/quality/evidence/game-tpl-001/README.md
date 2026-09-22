# GAME-TPL-001 implementation evidence

Status: `已完成`. The user explicitly accepted `GAME-TPL-001` on 2026-09-01 with `GAME-TPL-001 验收通过`. The bounded template implementation and local task evidence are `通过`; acceptance does not convert the repository-wide release gate into a pass.

Implementation date: 2026-09-01 (local development environment)

Authorization: the user explicitly replied `确认 GAME-TPL-001 方案，进行开发`. This authorized only the confirmed shared template, future-route wiring, local checks, evidence, and board update. It did not authorize migration of `/`, Oval, or Pixel, nor commit, push, deployment, index changes, or production verification.

Acceptance and release authorization: the user subsequently replied `GAME-TPL-001 验收通过` and explicitly requested deployment of the previously accepted work before the next task. The deployment remains governed by the P0 release gates and the separate approval requirement for any redirect behavior change.

## Scope and delivered behavior

- Added a server-composed `GameDetailTemplate` with the confirmed order: Breadcrumb → one data-backed H1 and summary → Player/Controls/status/device notice → factual metadata → conditional Related → How-to → conditional Description → Features/Tips → FAQ → Source & Rights → More avatar games → existing footer.
- Added native `details/summary` FAQ output and a neutral Source & Rights panel. `UNKNOWN` explicitly says it is not permission; `DIRECT_LINK_ONLY` says the site does not host or embed the tool.
- Added an optional, backward-compatible `content.description` field and populated the three current Game Data records only with already-present factual copy. Existing public pages do not consume this field in this task.
- Added conservative structured-data generation: every eligible detail page gets `BreadcrumbList`; visible FAQ gets `FAQPage`; a playable game gets `VideoGame`; `EXTERNAL_TOOL` gets `WebPage` and never `VideoGame` or `WebApplication` from this template. Unsupported ratings, reviews, user counts, authors, dates, and performance claims are omitted.
- Wired the accepted template into future `app/games/[slug]/page.tsx` records while preserving `resolveNewGameSlug`, true 404 behavior, dynamic params, and `forceNoIndex: true` metadata.
- Added detail-specific Related card/grid variants without changing existing directory or homepage variants. The mobile template header now uses a truthful `Play` or `Open` anchor to the player region; all other `SiteHeader` callers keep the existing `Start` and `/#maker` defaults.
- Added scoped `.game-detail-*` styles, responsive two-plus-one player controls on mobile, single-column facts, visible focus styles, and a 44px minimum mobile header action target. `AdSlotShell` remains unmounted.
- Added `npm run game-template:check` and updated the metadata guard so a route delegated to the shared template still proves exactly one Game Data-backed H1.

No current public URL was added or migrated. The only affected route family is a future eligible `/games/{slug}` record; the repository currently has no such record, so current new-game slugs remain 404/noindex. The existing `/`, `/oval-face-icon-generator`, and `/pixel-art-avatar-icon-generator` rendering, title, description, H1, canonical, schema, index state, sitemap membership, and search intent remain outside this task.

## Main files

- Template and trust modules: `components/game/GameDetailTemplate.tsx`, `GameFaq.tsx`, `GameSourceRights.tsx`.
- Shared component variants: `components/game/GameCard.tsx`, `GameGrid.tsx`, `GameMeta.tsx`, `RelatedGames.tsx`, and `components/game/README.md`.
- Route and header: `app/games/[slug]/page.tsx`, `components/SiteHeader.tsx`.
- Data and SEO: `lib/games/game-schema.ts`, three `data/games/*.ts` records, and `lib/seo/game-structured-data.ts`.
- Presentation: the scoped GAME-TPL-001 block in `app/globals.css`.
- Checks: `scripts/run-game-template-check.mjs`, `scripts/validate-game-template.tsx`, `tsconfig.game-template-check.json`, `scripts/validate-game-metadata.ts`, and `package.json`.

## Automated evidence

Passed:

- `npm run game-template:check`: five delivery types, fixed module order, optional branches, policy rejection, factual rights, internal navigation, External WebPage-only schema, initial no-runtime/no-WASM/no-SWF markup, resolver/404/noindex route boundary.
- `npm run games:check`, `npm run player:check`, `npm run routes:check`, `npm run components:check`, and `npm run metadata:check`.
- `npm run home:check`, `npm run home-hero:check`, `npm run home-discovery:check`, `npm run home-gallery:check`, and `npm run perf-home:check` after the shared header/card changes.
- Scoped Next ESLint for all changed TypeScript/TSX source and validation files: zero warnings or errors.
- Runner `node --check`, `package.json` and task tsconfig JSON parsing, temporary-fixture absence, exact restored sitemap hash, and final `git diff --check`.

The isolated static renderer prints the known React 18 `fetchPriority` casing warning inherited from the accepted shared player. The task assertion passes, the existing home performance checks intentionally retain that source, and the hydrated browser runs had no warning/error from the page. This warning is recorded rather than misreported as a clean static-render stream.

## Browser and interaction evidence

- Playable template widths checked: desktop `1440 × 1100` and `1280 × 900`; mobile `390 × 1200`, `360 × 900`, and `430 × 1000`.
- At all checked widths: one H1, meaningful semantic DOM, no Next error overlay, no horizontal overflow, ordinary crawlable internal links, and the Player immediately follows the heading/summary.
- Mobile controls measured `52px` high. Fullscreen and Reload use two columns; Report Issue spans the next row. The header `Play` target measures `44px` high and links to `#game-player`; the player lands below the sticky header.
- Initial playable markup contained no Ruffle runtime, WASM, or SWF request URL. A second activation run used the existing local `/games/oval-face.swf` only inside a temporary local record: the player changed from `idle` to `ready`, created one Ruffle element, and displayed `Template Preview Avatar Maker loaded.` The reserved surface stayed exactly `980 × 780.359` at document top `268.828` before and after activation. The fresh tab produced informational Ruffle load messages and no warning/error.
- The External Tool fixture displayed only `Open Original Page` plus `Report Issue`; the original link used `_blank` with `noopener noreferrer`. Its JSON-LD types were exactly `BreadcrumbList`, `WebPage`, and `FAQPage`, with no `VideoGame` or `WebApplication`.
- Native FAQ disclosure was exercised; its answer remained server-rendered. Related action colors were measured after the specificity fix and retained white text on the green/orange actions.
- Temporary QA records were deleted. Both temporary slugs were rechecked as `Page Not Found`, `noindex`, no template DOM, and HTTP `404`; no fixture reference or backup file remains.
- Browser viewport overrides were reset and all temporary QA tabs and local dev servers were closed.

Screenshots were displayed during QA from the system temp directory and were not added as production assets. The final desktop first/content/trust and mobile first-viewport captures were compared against all four accepted concept images with `view_image`.

## Visual fidelity ledger

| Approved concept requirement | Result | Evidence / bounded deviation |
|---|---|---|
| Player-first hierarchy | Passed | Breadcrumb, H1, summary, and the real aspect-ratio player precede metadata and long content. |
| Desktop content rhythm | Passed | Related uses two horizontal cards; How-to uses three steps; About is a bounded mint panel; Features/Tips use a balanced two-column section. |
| Trust and navigation | Passed | Native FAQ, neutral document-search rights icon, factual definition rows, explicit warnings, and four ordinary More links match the approved hierarchy. |
| Mobile stacking and controls | Passed | Short brand + Play + Menu, wrapping breadcrumb/H1, full-width player, two-plus-one controls, single-column facts, then Related. No horizontal overflow at 360/390/430px. |
| Color, type, borders, and actions | Passed | Existing cream surface, mint/green/orange tokens, dark text, 8px radii, thin borders, Lucide icons, and high-contrast action text are preserved. |
| Real-data aspect ratio | Passed with intentional visual difference | The QA record preserves the real Oval `972 / 774` ratio, so desktop controls/metadata sit just below a tall player rather than inside the generated concept crop. The core game remains visible and no content is stretched or cropped. |
| Shared site chrome | Passed with intentional inherited difference | The production implementation reuses the accepted `SiteHeader` and dark `SiteFooter`; the generated trust concept showed a light footer only as a structural reference. |
| Copy and imagery | Passed with QA-only difference | Concepts use Oval sample copy. Browser captures used clearly labeled temporary copy and existing project assets; those fixtures were removed and are not publishable pages. |

## Full release gates

The real worktree was restored before global gates; `app/sitemap.ts` SHA-256 is `B21AEF365B81499147B4DAAF12F11A6802402D391185CD85E27E8BB6B34CEDD9`.

- `npx tsc --noEmit`: `不通过`; parser errors begin at `app/sitemap.ts:1`.
- `npm run lint`: `不通过`; `app/sitemap.ts` has `Parsing error: Unexpected keyword or identifier`.
- `npm run build`: `不通过`; Next compilation stops at line 1, `cursive n`.
- `npm run cf:build`: `不通过`; OpenNext reaches its nested Next build and stops at the same file.
- `npm run seo:check`: `未验证`; no local production build exists.
- `npm run seo:prod`: `未运行`; deployment was not authorized.

This task does not hide those failures behind its scoped success. Global release is still blocked by the malformed sitemap, OP-03 HTTP→HTTPS canonicalization, production mobile LCP/INP evidence, exact Square/Oval license evidence, and existing KW-02 findings.

## Rollback

Remove the three new template/trust files and structured-data builder; restore the future route's former summary shell; remove the optional description field and the three factual description arrays; revert the detail-related variants, mobile header props/min-height, and `.game-detail-*` styles; remove the task checker/config/package command; restore the prior metadata-source assertion. No public URL, index state, sitemap entry, SWF, external tool, API, database, or deployment rollback is required.

No commit, push, deployment, production write, or next roadmap task occurred. `GAME-TPL-001` must remain `待验收` until the user explicitly accepts it.
