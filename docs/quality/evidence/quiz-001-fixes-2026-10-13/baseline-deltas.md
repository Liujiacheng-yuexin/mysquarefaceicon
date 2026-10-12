# Exact repair deltas

Base: a835bb89b60ddc955e4bbf986ead1a44909488f3. Original QUIZ-001 and older golden fixtures remain unchanged. A new, exact SHA-256-checked inverse covers the following approved source changes; current behavior is tested independently.

- app/globals.css
- app/layout.tsx
- app/privacy-policy/page.tsx
- components/DeferredThirdPartyScripts.tsx
- components/game-player/adapters/FriendQuizFrame.tsx
- components/game/GameDetailTemplate.tsx
- data/game-asset-manifest.json
- data/games/friend-block-test.ts
- next.config.mjs
- package.json
- public/games/friend-block-test/app.mjs
- scripts/banner-worker-policy.mjs
- scripts/category-sample-test-utils.mjs
- scripts/check-friend-quiz-integration.mjs
- scripts/friend-quiz-compat.mjs
- scripts/validate-favorites.tsx
- scripts/validate-recently-played.tsx
- scripts/qa-friend-quiz-http.mjs

The two local-data disclosure assertions now expect October 13 because the privacy text actually changed. No old negative fixtures were removed. The browser check measures the unopened stage and every cover/control rectangle at 320/375/390, then validates automatic invitations/results and request privacy at 320/375.

The HTTP verifier now expects beacon eligibility on the public detail page while retaining no-transform/noindex on the standalone game. Total exact repair deltas: 18.
