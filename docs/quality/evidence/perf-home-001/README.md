# PERF-HOME-001 implementation evidence

Status: user accepted on 2026-09-01; `已完成`. The scoped task result remains `有条件通过` because local performance evidence is not production PF-01 proof, and the global release remains `不通过`.

Implementation date: 2026-09-01 (local development environment)

Acceptance record: the user explicitly replied `确认验收，进行下一步开发` on 2026-09-01. This closes only `PERF-HOME-001`; it does not convert local Lighthouse data into production evidence or authorize commit, push, deployment, or `seo:prod`.

## Scope and change

- Kept the accepted root Hero composition, H1, copy, CTA, player dimensions, module order, metadata, canonical, schema, robots, sitemap policy, and click-to-load interaction unchanged.
- Downloaded the existing project-CDN cover without altering its pixels and stored it at `public/games/square-face-cover.png`.
- Verified the local PNG is `970 × 844`, `76,781` bytes, and SHA-256 `15A5C93F79859441EEF3032CE45E07ABC2E91A7520A9AAEF42158DD4FE00A535`; changed the Square Game Data record from the remote URL to the byte-identical local asset and corrected the intrinsic dimensions.
- Added stable player-state hooks and `aria-busy` on the reserved surface. These attributes do not alter layout; they make the `idle → loading → ready` boundary directly testable.
- Added `npm run perf-home:check`, which locks the local cover hash, initial no-runtime/no-WASM/no-SWF HTML, conditional Ruffle adapter, common reserved surface, and service-worker no-precache boundary.

## Acceptance evidence

| Requirement | Result | Evidence |
|---|---|---|
| Initial requests contain no Ruffle runtime, WASM, or SWF | Passed | Mobile Lighthouse network audit: 23 initial requests, forbidden matches `0`; hydrated initial DOM had no runtime/SWF URL and `0` Ruffle elements. |
| Preview, Loading, and Player keep one aspect ratio and reservation | Passed | CSS uses one `.flash-player` with `aspect-ratio: var(--flash-aspect-ratio, 690 / 600)`; preview/loading/runtime are absolute `inset: 0` children. At 390px, surface stayed `330 × 286.953` at document top `365.016`; preview/loading/runtime content stayed `322 × 278.953` at document top `369.016`. At 1440px, surface stayed `687.078 × 597.453` at document top `140.594`; content stayed `675.078 × 585.453` at document top `146.594`. |
| CLS target `≤ 0.1` | Passed for local mobile lab run | Lighthouse CLS `0.011`. This is a local-development lab result, not production field evidence. |
| Player initializes only after Play | Passed | Mobile cover click and desktop Hero CTA both produced `idle / activated=false / Ruffle=0 → loading / aria-busy=true / Ruffle=0 → ready / aria-busy=false / Ruffle=1`; `/ruffle/ruffle.js` appeared only after activation. |

## Performance diagnostic

The same cached Lighthouse CLI, URL, mobile form factor, and simulated-throttling configuration were used before and after the bounded change.

| Metric | Remote cover baseline | Local cover implementation |
|---|---:|---:|
| Performance score | 57 | 75 |
| FCP | 2.2 s | 2.2 s |
| LCP | 14.2 s | 3.5 s |
| TBT | 550 ms | 550 ms |
| CLS | 0.011 | 0.011 |
| Speed Index | 3.7 s | 2.2 s |
| Forbidden initial Ruffle/WASM/SWF requests | 0 | 0 |

The baseline LCP element was the cover image, and Lighthouse attributed about `12.626 s` (`89%`) of baseline LCP to its remote load time. After localization, the same visual cover remained the LCP element. The resulting local-development LCP `3.5 s` still exceeds PF-01's `2.5 s` target, so this task does not close the global mobile-LCP blocker or prove production performance.

Compact machine-readable values are stored in `metrics.json`. Raw Lighthouse JSON stayed in the system temp directory and was not added to the repository.

## Browser evidence

- URL: `http://localhost:3000/`
- Viewports: `390 × 844` (document client width `375`) and `1440 × 1000` (document client width `1425`).
- Both widths had `clientWidth === scrollWidth`, one H1, meaningful page content, no framework overlay, and no console warning/error.
- Mobile cover Play and desktop Hero Play were exercised; both initialized the same shared player without moving the reserved document geometry.
- The in-app browser screenshots were displayed during the task run. Temporary viewport overrides were reset and the temporary tab was closed.
- Chrome DevTools trace capture was unavailable because its managed profile was already locked by an existing tool process. Lighthouse and in-app-browser evidence were collected instead; INP remains `未验证`.

## Automated checks

Passed:

- `npm run perf-home:check`
- `npm run home-hero:check`
- `npm run home:check`
- `npm run home-discovery:check`
- `npm run home-gallery:check`
- `npm run games:check`
- `npm run player:check`
- `npm run routes:check`
- `npm run components:check`
- `npm run metadata:check`
- scoped Next ESLint for changed TypeScript/TSX files: zero warnings/errors
- runner syntax, JSON parse, and `git diff --check`

Full gates on the restored real worktree remain failed at the preserved malformed `app/sitemap.ts`:

- `npx tsc --noEmit`: failed with TypeScript parser errors starting at line 1.
- `npm run lint`: failed with `Parsing error: Unexpected keyword or identifier`.
- `npm run build`: failed at line 1 `cursive n`.
- `npm run cf:build`: reached the nested Next build and failed at the same file.
- `npm run seo:check`: not run because no local production build exists.
- `npm run seo:prod`: not run because no deployment was authorized.

The temporary browser-QA rename of `app/sitemap.ts` was reversed before full gates. Its restored SHA-256 is `B21AEF365B81499147B4DAAF12F11A6802402D391185CD85E27E8BB6B34CEDD9`.

## Remaining blockers and rollback

- Global release remains `不通过`: malformed sitemap, HTTP canonicalization, production mobile LCP, exact Square/Oval license evidence, and existing KW-02 findings remain open. INP and a production trace remain unverified.
- No commit, push, deployment, or production write occurred.
- Rollback: restore the Square cover URL/dimensions/provenance and FlashGenerator defaults, remove the local PNG and `perf-home:check` files/command, and remove the nonvisual player-state attributes. No URL, index, metadata, SWF, API, database, or deployment rollback is required.
