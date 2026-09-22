# PF-01 activation-response evidence · 2026-09-02

Board gate: `本地已验收`. Local scope: `通过`. Global release: `不通过 / 未部署`. Production and field CWV: `未验证`.

The user explicitly confirmed `确认 PF-01 激活响应方案` and subsequently replied `PF-01 验收通过` on 2026-09-02. This record now includes the local acceptance follow-up; the authoritative HTML board remains the only task-status authority.

## Bounded implementation

- `components/game-player/GamePlayer.tsx`: keep loading/status urgent, separate adapter mounting from activation, schedule the first adapter mount through two animation frames, and cancel outstanding frames on unmount. Existing reload instance-key behavior remains.
- `scripts/validate-home-performance.tsx`: lock initial idle/unmounted state, loading-before-mount scheduling, conditional dynamic Ruffle loading, and the original no-runtime/stable-reservation boundaries.
- `scripts/validate-game-player.tsx`: lock deferred adapter dispatch while retaining existing five-type, delivery-policy, URL, and capability assertions.
- Governance/evidence: the approved proposal, this record, `PAGE_PLAN.md`, `LAUNCH_CHECKLIST.md`, `SEO_LOG.md`, release-preflight evidence, and authoritative board v1.41.

Affected surfaces: `/`, `/oval-face-icon-generator`, and existing draft locale pages that share `GamePlayer`. Future playable adapters inherit this mounting boundary, but no new game/route is published. Pixel's `EXTERNAL_LINK` branch remains unchanged.

No dependency, CSS, first-viewport layout, cover, visible copy, H1, metadata, canonical, schema, robots, sitemap, index policy, search intent, source/license statement, Ruffle/SWF URL or byte, secret, API, data, or deployment change occurred.

Verified final source SHA-256 (the final build/check rerun includes the explanatory code comment):

| File | SHA-256 |
|---|---|
| GamePlayer.tsx | 142CF22AC3A485C78285D920BBE84114F3931A38F0E9AEC067BBF8CA2E562D5C |
| validate-game-player.tsx | 370B6809735B2B1CCBD99003FEA04EA0F06A9761950333D765A661B3157797EB |
| validate-home-performance.tsx | AB1F4951E3C77A9806C355717DCFB20977D36FCAC2BE1EDD9090E7811A5C2916 |

## Repeatable mobile performance evidence

Environment: Windows, Next 14.2.35 production build, `http://127.0.0.1:3100/`, dedicated Chrome DevTools browser, `390 × 844 @ 3x`, mobile touch, 4x CPU slowdown, Slow 4G. Three separately named isolated browser contexts start at `about:blank`; close the previous player before the next run. Record navigation manually from blank, then separately record the first cover Play through ready. No active extra player runs alongside the next sample.

| Sample | Cold-navigation LCP | Navigation CLS | First-Play INP | Play CLS | Result |
|---|---:|---:|---:|---:|---|
| 1 | 2234 ms | 0.01 | 122 ms | 0.00 | 通过 |
| 2 | 2023 ms | 0.01 | 43 ms | 0.00 | 通过 |
| 3 | 2028 ms | 0.01 | 44 ms | 0.00 | 通过 |

Thresholds: LCP ≤2500 ms, every measured Play INP ≤200 ms, CLS ≤0.1. All three pass; no sample was omitted for a failed metric. An earlier tool-interrupted trace was incomplete and is not counted. The historical pre-change Play result was 221 ms. Its 533 ms LCP snapshot is not treated as a directly comparable cache-controlled baseline; the new isolated-context measurements are the current local evidence. No CrUX/real-user data was available, and no production performance claim is made.

The INP values above are the trace's interaction metrics. Browser Event Timing rounds durations (120/40/48 ms for the longest sampled events) and is not substituted for the trace metric. Fast visible feedback also does not mean instantaneous game readiness: loading-to-ready includes Ruffle/WASM/SWF work.

### Loading precedes the adapter and resource requests

Before each Play, install a `MutationObserver` on the shell's phase/state/mounted attributes, a `PerformanceObserver` for Event Timing, and click/loading/frame/mount performance marks. Read the surface rectangle plus document-relative top on every transition, and inspect Resource Timing for Ruffle/WASM/SWF. The extra instrumentation exists only in the test page, not production source.

| Sample | Loading mutation after click handler entry | First adapter-mount mutation after loading | First runtime request after loading | Ready after click handler entry |
|---|---:|---:|---:|---:|
| 1 | 14.0 ms | 55.2 ms | 373.1 ms | 3702.9 ms |
| 2 | 10.1 ms | 21.2 ms | 326.5 ms | 2386.5 ms |
| 3 | 10.4 ms | 20.6 ms | 327.7 ms | 2726.0 ms |

All three runs:

- Initial runtime requests: `[]`; initial phase `idle`, mounted `false`.
- An animation-frame sample sees `loading-visible`, loading overlay present, mounted `false`, no Ruffle adapter element.
- Raw trace inspection finds three main-thread Paint events between `pf01-loading-visible` and the first `pf01-adapter-mounted` mark. Thus evidence is not limited to a state-name assertion.
- Surface width `330`, height `286.953125`, document top `365.015625` CSS px stay identical across idle/loading/mount/ready; no horizontal overflow.
- Ruffle JS, core JS, WASM, and Square SWF requests start only after loading is visible. Final state is `ready`.

The callback's animation-frame timestamp denotes the frame timestamp and can precede the mutation's wall-clock sample. Ordering is proven by observed state and trace marks/Paint events, not by subtracting those unlike timestamps.

### Raw local artifacts

Raw traces and activation JSON are outside the repository at:

`C:\Users\liu\AppData\Local\Temp\mysquarefaceicon-pf01-20260902-113332`

The directory contains `cold-1..3.json.gz`, `play-1..3.json.gz`, `activation-1..3.json`, `root-desktop-ready.png`, and `root-mobile-ready.png`. The two screenshots show the post-Play viewport after control-driven scrolling, not an unscrolled first viewport. Temporary raw files may be removed by OS cleanup; the metrics/method/hash record here is durable.

| File | SHA-256 |
|---|---|
| cold-1.json.gz | AB6F2FFF886458A210430555CB8D8E7E113AE4B6DAB0DFC892C6214B84177342 |
| play-1.json.gz | 6B277CE64A78FBD1E5C461EEA787CBC3FFBD2890AD65F492C65A13FB3F401FE4 |
| cold-2.json.gz | E092201A2520D2DF212F3A128D36BD8DC2DB5D1141E7594DEE69D6A766B49327 |
| play-2.json.gz | C4CB59FE6864F20902410C652B9C44E00DCE56C9BABD4DFFD89CD3879ACD7635 |
| cold-3.json.gz | 9E525E29314AC9BF1745C6D6A274F12A0833D1CC9C5B6CE4EFC8882E31FD4FFC |
| play-3.json.gz | 81A19E18A4AAC7D9C5AC2ADA287A34F081E2F032852C33EC263531FD6268A8EB |

## Rules and automated checks

| Check | Evidence/result |
|---|---|
| PF-01 / PF-04 / PF-05 / PF-06 | Three mobile traces; stable surface; no overflow; runtime absent before Play: 通过（本地） |
| Type | `npx tsc --noEmit`, exit 0 |
| Lint | `npm run lint`, exit 0, 0 warnings/errors |
| Regression | `games`, `player`, `routes`, `components`, `metadata`, `home`, `home-hero`, `home-discovery`, `home-gallery`, `perf-home`, `game-template` checks all exit 0 |
| Canonical policy | `npm run canonical:check`, exit 0; no middleware change |
| Robots | `node scripts/check-ai-crawler-policy.mjs --base http://127.0.0.1:3100`, exit 0; 6 training/bulk blocked, 5 search/user groups allowed publicly |
| SEO | `node scripts/seo-check.mjs --base http://127.0.0.1:3100`, exit 0; 20 sitemap pages, 0 mandatory, 12 should (KW-03 ×1, META-03 ×7, META-04 ×4) |
| Framework build | `npm run build`, exit 0; 42 routes, root first-load JS 109 kB, middleware 26.8 kB |
| Platform-equivalent build | `npm run cf:build`, exit 0; OpenNext 1.3.0 bundle and one project chdir patch completed |

No new semantic-content or keyword work was performed. Metadata, sitemap/canonical/index and shared player policy checks retain the accepted decisions. No production SEO entry claiming deployment has been added; `SEO_LOG.md` records only the local performance change.

Existing warnings remain visible: the GAME-TPL server-render test emits React `fetchPriority` compatibility output; OpenNext emits its Windows compatibility warning. They are not new lint warnings.

Environment corrections are not hidden: port 3000 belongs to an unrelated CopyBox service, so the first hard-coded `robots:check` invocation failed against the wrong app. It was rerun successfully with the explicit isolated base `127.0.0.1:3100`; that unrelated service and package defaults were left unchanged. One initial source assertion had an incorrect handler slice end and was corrected, then rerun successfully. A stale dedicated DevTools profile process and a later tool refresh interrupted setup; neither incomplete run counts as a passing trace.

## Rendered regression

Browser plugin available and used for app UI; dedicated Chrome DevTools used only for the approved performance traces. Target flow: root cover or desktop Hero Play → visible loading → one ready player; Reload → one ready player. Shared Oval Start Game → loading → ready; Reload and Help navigation remain usable.

| Check | Result |
|---|---|
| Identity / meaningful content / no framework overlay | 通过 for root and Oval local production pages |
| Desktop / mobile visual | Root `1280 × 900` and `390 × 844`; Oval `390 × 844`; screenshots inspected/emitted; no changed layout or horizontal overflow |
| Geometry | Root desktop `640.359375 × 556.828125`, root mobile `330 × 286.953125`, Oval mobile `320 × 254.8125`; dimensions unchanged after activation |
| Interaction | Root cover, desktop Hero, keyboard Enter activation, Reload; Report/Help → Contact and Back; Oval Start/Reload: 通过 |
| Console | Root and Oval warn/error logs `[]` |
| Unverified | Real hardware, Safari/Firefox, every draft locale, true fullscreen entry, forced runtime-error/retry path, full SWF editing/export; no claim of complete cross-browser game certification |

## Authoritative board checks

Board v1.41 JavaScript parsing and isolated source-state assertions pass: focus `PF-01`, gate `待验收`, local result `通过`, no PF-01 acceptance record, `MIG-SQUARE-001` unstarted, five global blocker entries retained, and export version 1.41. `git diff --check` exits 0; existing LF→CRLF notices remain informational.

Board desktop/mobile visual verification is `未验证`: the in-app browser's URL security policy rejected direct navigation to the local HTML file. No alternate HTTP server/browser surface or other bypass was used. The board's CSS and layout are unchanged; its static text and runtime gate/evidence data were both updated and source-checked. This limitation is distinct from the successful localhost website desktop/mobile QA.

Final rerun after the explanatory source comment: type, zero-warning lint, player/performance checks, the full Next build inside OpenNext, and the completed Cloudflare bundle all exit 0. The restarted production server again passes robots and SEO (0 must / 12 should); desktop and mobile root Play again reach one ready player without overflow or warn/error logs. Temporary browser tabs were closed, the viewport override reset, and only this task's port 3100 server stopped; no listener remains on 3100.

## Acceptance, release, and rollback

- The user explicitly accepted PF-01 locally on 2026-09-02 and requested the next step. Only TERMS-001 rights-copy proposal work has opened; `MIG-SQUARE-001` remains unstarted.
- No commit, push, deployment, `seo:prod`, Cloudflare/DNS write, SWF modification, or database migration occurred.
- Global release stays `不通过`: OP-11/AI-01/PF-01 production evidence, exact Square/Oval license `UNKNOWN` and Terms authorized/generated-output conflict, deployment/version linkage, and production smoke remain open. The 12 should reminders also remain independent.
- Roll back only this task's code if loading sticks, initial runtime requests reappear, geometry changes, or performance fails the agreed threshold: remove the deferred mount state/frames/hooks and restore the previous `{activated && ...}` adapter gate, then restore the two corresponding assertions. Do not reset the accumulated working tree or remove earlier accepted work.
- No URL, assets, data, secrets, or deployment rollback is needed for this local-only task. If deployed later, the production rollback version must be revalidated at that time.

## Acceptance follow-up · board v1.42

User message: `PF-01 验收通过` plus a request to proceed to the next development step. The current GamePlayer hash still matches the tested source above. No application code, runtime asset, dependency, index setting, or deployment changed in this acceptance turn, so type/lint/build/SEO/browser/performance checks were not rerun and are not presented as fresh measurements.

The next gate is the proposal-only `TERMS-001` at `docs/legal/terms-rights-consistency-proposal.md`. It addresses the Terms authorized-file and unconditional generated-output claims without treating wording changes as license evidence. The board records PF-01 acceptance separately from production verification and preserves all remaining release blockers.
