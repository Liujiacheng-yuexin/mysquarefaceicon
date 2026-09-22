# KW-02 remaining 11-page batch evidence

Status: `通过，已由用户验收 / 未部署`. User authorization: `确认 KW-02 剩余 11 页批量方案，进行开发`; user acceptance: `KW-02 剩余 11 页验收通过` on 2026-09-02.

## Scope and exclusions

- Added the 11 exact visible sentences recorded in `docs/seo/keyword-coverage-release-proposal.md` to About, Editorial, Gallery, Blog hub, five mapped blog guides, Privacy, and Terms.
- Preserved the accepted `/contact` sample and every existing title, H1, URL, canonical, schema, robots/index decision, sitemap membership, component, interaction, and CSS rule.
- Preserved the existing Terms `authorized SWF` and generated-output claims. Their conflict with exact Square/Oval license evidence `UNKNOWN` remains a separate release blocker and was not silently repaired.
- No game asset, API, data, secret, migration, deployment configuration, production origin, or external service changed.

## Local verification · 2026-09-02 · Windows production build

- Final source assertions: exit `0`; each exact sentence occurred once at its confirmed boundary; the accepted `/contact` sentence remained once; both independent Terms conflict paragraphs remained present.
- Raw production server: `http://127.0.0.1:3101` because port 3000 belonged to an unrelated CopyBox process and was left untouched. The temporary server was stopped and port 3101 released after QA.
- All 12 mapped routes returned HTTP `200`, one H1, expected `https://mysquarefaceicon.com/...` canonical, no `noindex`, configured main-content phrase count `3`, and accepted-sentence count `1`.
- `node scripts/seo-check.mjs --base http://127.0.0.1:3101`: exit `0`; mandatory findings `11 → 0`; 12 should reminders remain: KW-03 ×1, META-03 ×7, META-04 ×4.
- `node scripts/check-ai-crawler-policy.mjs --base http://127.0.0.1:3101`: exit `0`; 6 training/bulk crawlers blocked and 5 public-search/user-retrieval crawlers allowed with private-path boundaries.
- `npx tsc --noEmit`: exit `0`.
- `npm run lint`: exit `0`, no warnings or errors.
- `npm run canonical:check`: exit `0`.
- All 11 accepted task checks from `games:check` through `game-template:check`: exit `0`. The existing GAME-TPL React `fetchPriority` compatibility warning remains visible.
- `npm run build`: exit `0`; 42 static/generated routes, middleware `26.8 kB`.
- `npm run cf:build`: exit `0`; OpenNext Worker generated and the project patch applied. The existing Windows compatibility warning remains visible.
- Final project `git diff --check`: exit `0`; Windows LF→CRLF notices remain informational.

## Browser and responsive evidence

- Desktop `1280 × 900` and mobile `390 × 844` sampled `/about-us`, `/gallery`, `/blog/how-to-make-a-cute-discord-profile-icon`, `/privacy-policy`, and `/terms-of-service` as representative trust, hub, article, and legal templates.
- Every sampled page retained the expected title/canonical, one H1, phrase count `3`, sentence count `1`, visible sentence box, zero horizontal overflow, and no large fixed obstruction.
- Meaningful DOM snapshots confirmed the sentence inside its intended section on About, Gallery, and Terms. Visual screenshots were inspected for desktop Terms and mobile Terms/Gallery.
- Terms `contact page` navigation reached `/contact`; the accepted sample still counted `3`; browser Back restored Terms with count `3`.
- Browser warning/error logs: empty. Temporary viewport override was reset and the QA tab was closed.
- Authoritative board v1.39 inline JavaScript and active-state assertions passed. Its desktop `1280 × 900` and mobile `390 × 844` render showed `KW-02 剩余 11 页待验收`, the evidence path, zero horizontal overflow, no open dialog, and empty warning/error logs.

- After explicit acceptance, board v1.40 inline JavaScript and source assertions passed. Desktop `1280 × 900` and mobile `390 × 844` renders showed the PF-01 proposal gate, the exact confirmation phrase, board version 1.40, no horizontal overflow, no open dialog, and empty browser logs.

## Result, blockers, and rollback

Task-level result: `通过，已由用户验收 / 未部署`. The 12 should-level reminders remain independently recorded. Global release result: `不通过 / 未部署` because OP-11 and AI-01 production evidence, PF-01 first-Play INP `221 ms`, exact Square/Oval license evidence and Terms consistency, commit/push/deployment linkage, `seo:prod`, and production browser/SEO checks remain open.

No commit, push, deployment, `seo:prod`, PF-01 implementation, or `MIG-SQUARE-001` work occurred. Rollback is copy-only: remove the 11 added sentences and reverse this batch's documentation/board entries. No data, schema, route, asset, secret, migration, or production rollback is required.
