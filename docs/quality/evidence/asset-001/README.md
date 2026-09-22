# ASSET-001 local implementation evidence

`ASSET-001` was implemented only after the user confirmed the proposal. The user explicitly accepted this local implementation on 2026-09-08 with `ASSET-001 验收通过`; the separate machine-readable acceptance record is [acceptance-checks.json](acceptance-checks.json). The delivered scope is local asset governance: a manifest, structural rules and a fail-closed checker. It does not upload, delete, move or re-authorize any asset.

## Passed locally

- `data/game-asset-manifest.json` maps all 10 current Game Data asset references. The eight unique local files match their byte lengths, SHA-256 values, MIME types and local cache policy.
- Twenty negative fixtures reject unknown hosts, HTTP, `r2.dev`, unsafe paths, duplicate IDs/object keys, hash/MIME/cache drift, missing Game Data mappings, UNKNOWN-rights R2 migration, Ruffle capture and Pixel copying.
- The manifest declares zero R2 objects. Square/Oval SWFs remain `BLOCKED_RIGHTS_UNKNOWN`; Pixel remains `EXTERNAL_DIRECT_ONLY`; Ruffle stays under its separate accepted runtime manifest; the Square first-viewport cover remains `KEEP_APP_STATIC_LCP`.
- TypeScript, lint, canonical-host, Game Data, Player, Ruffle, homepage performance, Square/Oval/Pixel, games index, categories, Related, Recent and Favorites checks pass.
- Next generated 42/42 pages. OpenNext produced the Worker bundle and the existing chdir patch applied once; the existing Windows compatibility warning remains.
- A rebuilt production preview at `http://127.0.0.1:3100` verified eight local asset responses and seven Ruffle/SWF responses. Status, MIME, cache, bytes and hashes match; the three game surfaces contain no R2 game-object URL.
- Local SEO checked 20 indexed URLs with zero mandatory failures and twelve existing should-level notices. The AI crawler policy passes.
- Desktop browser checks reached the running Square and Oval states and confirmed the Pixel page remains an external-tool surface without Ruffle or an R2 game-object URL.

## Preserved failures and corrections

- An early malformed-byte negative fixture disabled file verification and therefore could not exercise the intended branch. The fixture was corrected to keep file verification enabled; all twenty negatives then failed closed as intended.
- Adding ASSET documentation under `data/games/README.md` tripped the immutable Pixel source baseline. That unrelated documentation edit was reverted; the historical baseline was not refreshed.
- The first compatibility adapter was not idempotent when several historical regression chains called it. It was made exact and idempotent; all affected legacy checks then passed without weakening their frozen hashes.
- Background `Start-Process` was rejected by the execution policy and `npm run start -- -H ... -p ...` was swallowed by npm on Windows. The repository-local Next CLI started the preview successfully.
- `check-square-homepage.mjs --base ...` rejects arguments by design and printed its usage. Its supported source mode passes; final Square HTTP/asset behavior is covered by the asset, Ruffle and SEO checks plus browser activation.
- The browser adapter did not expose Playwright screenshot, network, performance, viewport or final console APIs used by the preferred test workflow. Direct accessibility-tree clicks and screenshots were used for desktop interaction; exact HTTP checks supply the resource evidence. No unsupported result is counted as a pass.
- Opening the `file://` authoritative board through browser automation was rejected by the browser URL policy. The board was validated by JavaScript syntax, embedded-state assertions and SHA-256 only; no browser-policy workaround was attempted.

## Not verified / blocking release

- Fresh 390 px and 360 px browser runs, real devices, additional engines, request-panel observation, failure injection/Retry, real fullscreen and in-game save behavior remain unverified in this task.
- The board's current visual rendering remains unverified because the local-file browser action was policy-blocked.
- Field and production CWV, production SEO, advertising/CMP and remaining human factual review are not verified.
- Square/Oval SWF rights remain `UNKNOWN`. No SWF was copied, modified, decompiled or moved to R2.
- No R2 bucket/domain/CORS/TLS/object mutation, URL cutover, local asset deletion, commit, push, deployment, `seo:prod`, GSC or IndexNow action occurred. Whole-site release remains not passed.

The implementation record is [checks.json](checks.json). Local acceptance is recorded separately and does not represent R2, rights, production or release approval.
