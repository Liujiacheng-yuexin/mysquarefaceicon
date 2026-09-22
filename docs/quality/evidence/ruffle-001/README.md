# RUFFLE-001 local implementation evidence

`RUFFLE-001` was implemented only after the user confirmed the proposal. The application now uses one exact self-hosted Ruffle version and fails closed instead of falling back to a remote latest runtime.

## Passed locally

- `package.json`, lockfile, installed package, manifest and `public/ruffle/` agree on `0.2.0-nightly.2026.5.12`.
- All five public runtime files match the installed package by byte length and SHA-256; explicit offline sync copied zero files.
- The adapter loads only `/ruffle/ruffle.js`, sets `/ruffle/` as `publicPath`, and removes failed script elements so the existing Retry path can make a fresh attempt.
- Next/OpenNext carry exact JavaScript/WASM MIME and cache headers. The service worker does not prefetch Ruffle/SWF; the entry is network-first with cache fallback and hashed children stay runtime-cacheable.
- TypeScript, lint, player/performance, Square/Oval/Pixel, template, component, Favorites, Recent and Related checks pass. Historical source goldens are retained through a bounded RUFFLE inverse; no old baseline was refreshed.
- Local Next and OpenNext builds pass. Local HTTP verifies five runtime and two SWF bodies, MIME and hashes.
- Browser runs at 1280×900, 390×844 and 360×800 reach ready for both Square and Oval with no horizontal overflow. Desktop reload reuses one runtime script; console error/warning count is zero.
- Twenty indexed URLs have zero mandatory SEO failures; twelve existing should-level notices remain visible. AI crawler policy passes.

## Preserved failures and corrections

- The first Next build compiled and type-checked but exited 134 during static generation because the machine was under memory pressure. A command-local `NODE_OPTIONS=--max-semi-space-size=64` retry passed 42/42 pages; no permanent memory setting was added.
- Windows npm swallowed `--hostname`/`--port` and later `--base` flags. The production server and checks passed when the repository-local Next/Node entry points were invoked directly.
- RELATED loopback initially counted both a card link and its already-accepted Favorite button as separate related cards. The assertion was narrowed to `a[data-game-id]`, then source and HTTP modes passed; no page behavior changed.

## Not verified / blocking release

- Browser request interception was unavailable, so an actual failed runtime response and click-to-Retry recovery were not injected. Fail-closed URLs, promise reset and failed-script removal are covered by source and negative-fixture checks.
- The automated browser did not establish `document.fullscreenElement`; real fullscreen remains unverified.
- In-game authoring, save output, real devices, additional engines and field/production CWV remain unverified.
- Actual Square/Oval SWF rights remain `UNKNOWN`. No SWF was modified, decompiled or re-authorized.
- No commit, push, deployment, production `seo:prod`, GSC or IndexNow action occurred. Whole-site release remains not passed.

The machine-readable record is [checks.json](checks.json). The acceptance request is exactly `RUFFLE-001 验收通过`.
