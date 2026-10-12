# QUIZ-001 production repairs · 2026-10-13

The user reported the production issues observed on 2026-10-12 and explicitly confirmed all changes, including the retained optional analytics/ads item, and authorized main commit, push, `npm run cf:deploy` and `npm run seo:prod` after the required checks pass.

- **Mobile preview:** constrain the unopened stage and controls to their container. Check actual stage and control rectangles at 320, 375 and 390 CSS pixels before clicking Start; checking only the activated iframe missed the original 480px stage.
- **Shared links:** `#fbt1.` quiz/result links automatically activate the existing player and scroll it into view. Plain visits keep the explicit Start action. Changes to the fragment in an already-open page follow the same flow.
- **Nickname:** the input exposes and enforces `maxlength="16"`; the existing cleaning/decoding limits remain.
- **Advertising and analytics:** the public detail page enables the existing AdSense, GA and Cloudflare integrations. A synchronous, non-deferred bootstrap captures the incoming fragment in memory and clears it from the outer address before third-party code runs. A local, origin/source-checked message hands it to the game, whose iframe URL stays fragment-free and whose CSP still blocks uploads and third-party resources. Analytics uses the public canonical page identity. Storage/personalization consent defaults to denied on this page; AdSense is requested without personalization. Provider fill and account-side consent configuration are separate from tag loading.

The cleaned address bar no longer contains an invitation. Keep the original link or use the game's Copy link button to share/reopen it. Reloading the outer page discards the in-memory invitation. No private payload is added to a server, query string, analytics dataLayer or browser-history state.

The page URL, title/H1, canonical, index allowlist, sitemap membership, category noindex policy, original rights records, SWFs and homepage first viewport stay unchanged. Copy and the privacy policy disclose the surrounding ads/analytics accurately. Legacy checks retain their original goldens via an exact, hash-checked inverse of this approved repair; new tests exercise the actual current code.

Evidence: `docs/quality/evidence/quiz-001-fixes-2026-10-13/`. The authoritative HTML board remains the only task tracker and will end at `待验收`, not automatically `已完成`.
