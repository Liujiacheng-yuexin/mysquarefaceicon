# QUIZ-001 production repairs

Date: 2026-10-13 (Asia/Shanghai). Base commit: `a835bb89b60ddc955e4bbf986ead1a44909488f3`. The user explicitly confirmed the repairs and the retained optional ads/analytics item and authorized main commit, push, Cloudflare deployment and production checks after validation.

## Implementation

- The unopened cover keeps its 8:5 ratio but no longer has the 300px minimum height that forced a 480px minimum width. The scoped stage/shell can shrink. Before activation, the stage is now 296/351/366px at 320/375/390px; cover, Start label, Restart and Report Issue fit.
- Quiz/result invitations auto-start and scroll the player into view. A scheduled activation avoids a React Strict Mode cleanup cancelling the player's adapter mount.
- Nickname input `maxlength` is 16, alongside the existing sanitization and protocol validation.
- The public page enables GA, AdSense and Cloudflare beacon eligibility. A synchronous bootstrap removes the private fragment before vendors run and passes it locally to a fragment-free iframe. Hash/popstate events carrying private URLs are contained. GA receives the public page identity; storage and ad personalization default to denied and AdSense is requested without personalization. The embedded game retains CSP `connect-src 'none'`, no third-party resources and no-transform protection.
- The game copy, FAQ, tips and privacy policy disclose site analytics/ads. Use the game's Copy link button or keep the original invitation: the cleaned address bar cannot reproduce the quiz, and an outer-page reload discards its in-memory invitation.

URLs: `/games/friend-block-test`, its static entry, and the updated `/privacy-policy` disclosure. URL/title/H1/canonical/index/sitemap policy, the noindex category, homepage first viewport, old rights records and SWFs remain unchanged.

## Local verification

| Gate | Result | Evidence |
|---|---|---|
| TypeScript, lint | 通过 | `local/typecheck-result.json`, `local/lint.log`; zero lint warnings/errors |
| 31 offline `*:check` scripts, including quiz | 通过 | `local/results.json`; all exit 0 |
| Framework / platform builds | 通过 | `local/build.log`, `local/cf-build.log`; both exit 0; OpenNext Windows advisory retained |
| Browser production-build check | 通过 | `local/browser.json`; unopened 320/375/390 and complete create/answer/result/return at 320/375, including hash changes after mock telemetry |
| Privacy request inspection | 通过 in the tested local scope | 296 requests inspected; no quiz fragment, nickname or quiz ID; mock vendors used locally, real vendors must be re-tested after deployment |
| Production-build SEO / robots | 有条件通过 / 通过 | 22 URLs, 0 must failures, 13 should reminders. The added reminder is privacy-policy keyword density (0.46%) after necessary disclosure; no keyword filler added |
| Next / Worker HTTP matrix | 通过 | Two runtimes; 22 index, 16 noindex, 3 real 404s, encoded paths, canonical/schema and protected static entry |

`npm run quiz:browser:check` is the current repair browser gate. Set `QUIZ_BASE`, `QUIZ_PLAYWRIGHT` (an existing Playwright package), `QUIZ_QA_OUT`, and optionally `QUIZ_REAL_TELEMETRY=true` for production. Browser plugin not available; existing Playwright and system Chrome were used without adding dependencies. Screenshots are stored outside the repository.

## Release evidence and limitations

This document is committed before release and does not claim deployment has already succeeded. The exact source commit, Worker annotation/version, push result, `seo:prod`, real-vendor 320/375 round trips, request audit and screenshots are recorded after deployment in the authoritative HTML board and:

`C:/Users/liu/.codex/visualizations/2026/10/13/01a13010-c102-71b3-876d-6bacaa8d5aa9/quiz-001-fixes/`

Initial production-browser connection failure, development auto-start/scroll failures, old date assertions and the strict guard error-message mismatch are retained in that directory. The original 38-file QUIZ-001 fixture and older goldens remain unchanged; the [exact repair inverse](baseline-deltas.md) preserves them while current behavior is tested directly.

No physical phone/Safari/screen-reader, actual ad fill, vendor-dashboard receipt, region/CMP certification, field CWV, KW-04, separately documented human content review or search indexing claim is made. Legacy rights UNKNOWN values remain. IndexNow/GSC writes are outside this request. The board ends at `待验收`; no new user acceptance is fabricated.

Rollback source: base commit `a835bb89`. Before this release the active Worker was `eb878f23-c269-4cbc-9210-5bfe7a5d99e2` (100%). Verify availability and use the normal Wrangler rollback procedure with appropriate authorization if a confirmed regression needs recovery; then repeat production checks. No data migration occurred; Worker rollback does not restore KV/R2. Use ordinary source revert, never force-push/reset.

References: [GA page-view configuration](https://developers.google.com/analytics/devguides/collection/ga4/views), [Google consent mode](https://developers.google.com/tag-platform/security/guides/consent), [Cloudflare beacon collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/).
