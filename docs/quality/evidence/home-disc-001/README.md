# HOME-DISC-001 implementation evidence

Date: 2026-09-01  
Scope: English root homepage `/`, Hero after-region through the start of Gallery  
Status: user accepted on 2026-09-01; task marked complete  
Deployment: not authorized and not performed

## Implemented contract

- Featured is resolved server-side from the current Square record's ordered `relatedGameIds`; current, missing, duplicate, unpublished, or non-public records are excluded.
- New accepts only `PUBLISHED` records with `timestampStatus = VERIFIED` and a valid `publishedAt`, sorts newest first, and excludes current/Featured records. The three current records are `UNKNOWN`/`null`, so no New heading, container, badge, date, or empty state exists on `/`.
- Categories use the existing allowlist, published records, fixed order, real counts (`2/3/1/2/1`), ordinary onsite anchors, and omit empty groups.
- Oval and Pixel use their real Game Data thumbnails with explicit 512×512 source dimensions, stable square media, alt text, responsive sizes, and lazy loading. Pixel remains an External Tool, has a 2px orange dashed boundary plus text label, and links first to `/pixel-art-avatar-icon-generator` without `target=_blank`.
- If Featured, New, and Categories are all empty, the whole discovery section is omitted.

## Automated checks

| Check | Result | Evidence |
|---|---|---|
| `npm run home-discovery:check` | 通过 | Selection order/deduplication, verified and invalid New fixtures, empty-section branch, real media, internal paths, external boundary, categories, counts, headings, and responsive CSS assertions pass. |
| `npm run home:check` | 通过 | Accepted root module order and frozen homepage semantics pass with the resolver-backed discovery props. |
| `npm run home-hero:check` | 通过 | Accepted Hero/core-entry regression remains intact. |
| `npm run games:check` | 通过 | Game Data records and assets pass. |
| `npm run components:check` | 通过 | Shared component contract and default branches pass. |
| `npm run metadata:check` | 通过 | Frozen root/game metadata contract passes. |
| `npm run player:check` | 通过 | Existing five-adapter player boundary passes. |
| `npm run routes:check` | 通过 | Legacy, detail, directory, category, and 404 policy passes. |
| Task-scoped ESLint | 通过 | HOME-DISC implementation, data, and validation files report no lint errors. |
| `node --check scripts/run-home-discovery-check.mjs` | 通过 | Runner syntax passes. |
| package/tsconfig JSON parse | 通过 | Both files parse. |
| `git diff --check` | 通过 | No whitespace errors; Git emitted only line-ending warnings. |
| `npm run lint` | 不通过 | Stops at preserved `app/sitemap.ts:1` malformed `cursive n`. |
| `npm run build` | 不通过 | Stops at the same preserved sitemap parse error. |
| `npm run cf:build` | 不通过 | Nested Next build stops at the same preserved sitemap parse error. |
| `npm run seo:check` | 未验证 | No local production build exists because of the sitemap P0. |
| `npm run seo:prod` | 未运行 | No deployment authorization or deployment occurred. |

The preserved sitemap SHA-256 is `B21AEF365B81499147B4DAAF12F11A6802402D391185CD85E27E8BB6B34CEDD9`.

## Browser and responsive evidence

The Codex in-app browser loaded the Next development server and verified the rendered DOM rather than only source code.

| Viewport | Result |
|---|---|
| 1600×960 | Two equal Featured media cards, five-column category rail, no New module, no horizontal overflow. |
| 1440×900 | Same desktop composition; discovery height about 689px. |
| 1280×900 | Two 560×278 media cards and five 227×92 categories; discovery height about 712px; no overflow. |
| 430×1000 | Stacked horizontal media cards, two-column categories plus full-width fifth item; discovery height about 1207px; no overflow. |
| 390×1000 | Media cards 331px wide, categories 161px/161px plus 331px final item; discovery height about 1235px versus the earlier approximate 1441px; no overflow. |
| 360×1000 | Media cards 301px wide, category grid remains contained, fifth item full width; discovery height about 1269px; no overflow. |

Root page identity remained `Square Face Generator - Classic Flash Avatar & Icon Maker` with one `Square Face Generator` H1. Before Play, `ruffle-player`/`ruffle-object` count remained zero at every measured viewport. No browser console errors were recorded. Three Next development warnings about sticky-header auto-scroll occurred during client-route transitions; they did not block navigation or indicate a HOME-DISC runtime exception.

Real click results:

- Oval card → `/oval-face-icon-generator`, correct title and H1.
- Pixel card → `/pixel-art-avatar-icon-generator`, correct title/H1 and visible links to the original external generator; the homepage card itself stayed onsite and had no `target`.
- Face Makers → `/category/face-makers`, H1 `Face Makers`, robots `noindex, follow`.
- Retro Flash → `/category/retro-flash`, H1 `Retro Flash`, robots `noindex, follow`.

All interactive discovery items are ordinary anchors in DOM/visual order and inherit the shared `.route-game-link:focus-visible` rule. The in-app browser CUA did not move `document.activeElement` when sending Tab, so the final rendered keyboard-focus appearance is recorded as `未验证`, not as a pass. Link semantics, names, targets, touch sizes, route results, and focus CSS are verified.

## Visual fidelity ledger

Accepted references:

- `docs/product/concepts/home-disc-001-desktop-concept.png`
- `docs/product/concepts/home-disc-001-mobile-concept.png`

Comparison points:

1. Section hierarchy matches: open cream band, discovery intro, Featured, conditional New slot, Categories, then an independent Gallery card.
2. Desktop Featured matches the approved two-column media composition with a stable square thumbnail on the left and type/name/summary/action on the right.
3. Pixel keeps the approved orange dashed external boundary and explicit External Tool text; production wording and thumbnails come from Game Data as the proposal requires.
4. Desktop Categories match the approved five-column open rail with separators, icons, names, real counts, and chevrons.
5. Mobile keeps the approved stacked horizontal media cards, two-column category grid, and full-width fifth category without horizontal scroll.
6. Typography, cream/mint/orange palette, border radii, and spacing remain within the existing site tokens; no generated concept asset or new decoration was shipped.
7. Production content is intentionally denser and slightly smaller than the illustrative mobile concept at its much larger source scale, but all required labels, summaries, actions, external cues, and touch targets remain visible.

Screenshots:

- [Desktop 1600×960](./desktop-1600x960.png)
- [Desktop 1440×900](./desktop-1440x900.png)
- [Mobile 390×1000 — discovery top](./mobile-390x1000.png)
- [Mobile 390×1000 — categories continuation](./mobile-390x1000-bottom.png)

## Release boundary and rollback

Task conclusion: `有条件通过` because the end-to-end Tab-focus appearance is explicitly `未验证`; all implemented data, layout, route, visual, and automated checks above pass.  
Global release: `不通过` because the preserved sitemap parse failure, HTTP root 200/no one-hop HTTPS, mobile LCP 4.6s, Square/Oval exact license evidence `UNKNOWN`, and three KW-02 mandatory findings remain open.

User acceptance: `通过`. At `2026-09-01T09:17:19.3773648+08:00`, the user explicitly replied `HOME-DISC-001 验收通过`. This closes the task but does not convert the unverified keyboard item or global release blockers into passes, and it does not authorize a commit, push, deployment, or the next task.

Rollback is code-only: remove the homepage discovery resolver and HOME-DISC variants/check, restore the prior discovery CSS and prop shape, and revert this task's documentation/board entries. No Game Data, URL, metadata, index state, Hero, Gallery, player, SWF, deployment, or persistent user data migration requires rollback.
