# PF-01 activation-response remediation proposal

Status: `本地已验收 / 未部署`. The user explicitly confirmed `确认 PF-01 激活响应方案` and subsequently replied `PF-01 验收通过` on 2026-09-02. The bounded local implementation is accepted; production performance remains unverified.

## Pre-remediation local production evidence (historical)

Environment: `http://localhost:3000/`, Next production build, Chrome mobile emulation `390 × 844 @ 3x`, touch, 4x CPU slowdown, Slow 4G, 2026-09-02.

- Cold navigation: LCP `533 ms`, CLS `0.01`; no field/CrUX data.
- Initial navigation requests contained no Ruffle runtime, WASM, or SWF.
- First Play interaction: INP `221 ms`, CLS `0.00`.
- INP breakdown: input delay `28 ms`, event processing `108 ms`, presentation delay `85 ms`.

LCP and CLS meet PF-01 locally. The measured Play INP is `21 ms` above the `≤200 ms` project target, so production deployment cannot be described as fully passing.

## Confirmed bounded change

- Keep the immediate loading/status update urgent.
- Defer mounting the dynamically imported player adapter until the browser has had an opportunity to paint the loading state.
- Preserve the same reserved player surface, click-to-load boundary, cover, labels, controls, source order, error behavior, and Ruffle/SWF URLs.
- Add a regression assertion that the first visible response precedes adapter initialization and that no runtime request occurs before Play.

## Verification and rollback

Run at least three cold mobile navigation traces and three first-Play traces with the same emulation. Require LCP `≤2.5 s`, every measured Play interaction `≤200 ms`, CLS `≤0.1`, no initial Ruffle/WASM/SWF, and unchanged player geometry. Then rerun all player/home/performance checks, type, lint, Next build, and Cloudflare build.

Rollback is code-only: restore synchronous adapter activation and its prior regression assertion. No URL, SEO, asset, data, or deployment migration is involved.

Approval phrase: `确认 PF-01 激活响应方案`.

## Implementation and verification · 2026-09-02

`GamePlayer` now separates the urgent `activated`/loading response from `adapterMounted`. Two nested animation-frame callbacks leave a paint opportunity before mounting the existing dynamic adapter; pending callbacks are canceled on unmount. Reload still uses the existing instance key. No layout, cover pixels, labels, controls, URL, metadata, index, rights copy, Ruffle version, or SWF resource changed.

Three isolated mobile sessions against the current Next production build at `http://127.0.0.1:3100/` used `390 × 844 @ 3x`, touch, 4x CPU slowdown, and Slow 4G:

| Run | Cold-navigation LCP | Navigation CLS | First-Play INP | Play CLS |
|---|---:|---:|---:|---:|
| 1 | 2234 ms | 0.01 | 122 ms | 0.00 |
| 2 | 2023 ms | 0.01 | 43 ms | 0.00 |
| 3 | 2028 ms | 0.01 | 44 ms | 0.00 |

Every sample meets the agreed local thresholds. Each raw trace contains Paint events after the loading-visible mark and before the first adapter-mounted mark. All three initial runtime request lists are empty; loading-frame samples show the loading overlay with no mounted adapter; surface dimensions and document position remain unchanged. These are local lab results, not field CWV or deployed results. The earlier 533 ms LCP snapshot is retained as history, not a directly comparable cold-cache baseline.

Type, zero-warning lint, canonical policy, robots at the explicit local base, all 11 task checks, Next build, and Cloudflare/OpenNext build passed. `seo-check` exited 0 with 0 mandatory findings and the same 12 independent should reminders. Browser coverage includes root 1280/390px, keyboard Enter activation, Reload, Report/Help and Back, and shared Oval 390px Start/Reload. Fullscreen entry, real mobile hardware, all draft locales, and complete SWF editing/export remain unverified in this task.

Complete evidence, environment caveats, trace hashes, and rollback: [PF-01 evidence](evidence/pf-01-activation-response/README.md).

Acceptance follow-up: the user replied `PF-01 验收通过` and requested the next task on 2026-09-02. PF-01 is closed locally; no source or performance change was made in this acceptance turn and the measurements above were not rerun. TERMS-001 is now the separate one-page rights-copy confirmation gate: `docs/legal/terms-rights-consistency-proposal.md`. No commit, push, deployment, `seo:prod`, or `MIG-SQUARE-001` work occurred. The global release remains `不通过 / 未部署` because production OP-11/AI-01/PF-01 evidence, exact-license/public-rights-copy consistency, and release version linkage are still open.
