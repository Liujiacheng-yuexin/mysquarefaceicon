# AI-01 crawler policy evidence

Status: `本地已验收 / 生产未验证 / 未部署`  
Evidence date: `2026-09-02`

## Authorization and scope

The user explicitly replied `确认 AI-01 分流策略` on 2026-09-02. This authorized implementation of the already presented 6-block / 5-allow crawler split. The user later explicitly replied `AI-01 验收通过，继续下一发布阻断项`, accepting the local source implementation while leaving production verification open and authorizing the next blocker to be opened. It did not authorize deployment, PF-01 work, licensing changes, a roadmap migration task, commit, push, or a KW-02 page edit before its required sample-plan confirmation.

No page URL, title, description, H1, canonical, index/noindex directive, sitemap membership, visible content, schema, player behavior, game asset, or search intent changed. The affected generated endpoint is `/robots.txt` only.

## Implemented policy

| Group | User-agents | Rule |
|---|---|---|
| Ordinary crawlers | `*` | Allow `/`; disallow `/admin/` and `/api/` |
| Training / bulk collection | `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`, `Bytespider`, `Applebot-Extended` | Disallow `/` |
| Search / user retrieval | `OAI-SearchBot`, `ChatGPT-User`, `Claude-User`, `Claude-SearchBot`, `PerplexityBot` | Allow `/`; disallow `/admin/` and `/api/` |

`ChatGPT-User` remains an expressed preference rather than a security guarantee because user-triggered fetches may not apply robots rules. `Bytespider` remains a conservative project-policy classification; no current primary vendor purpose statement was found in the dated proposal review.

## Source and automation

- `data/ai-crawler-policy.json`: single executable decision source.
- `app/robots.ts`: server-generated Next metadata route, with no client bundle or runtime request added.
- `scripts/robots-policy.mjs`: shared parser, policy-shape validation, fail-closed crawler rules, and wildcard safety check.
- `scripts/check-ai-crawler-policy.mjs` plus `npm run robots:check`: local production endpoint check with a 10-second request timeout and explicit exit codes.
- `scripts/seo-check.mjs`: AI-01 is now a must-level finding when any policy decision is missing or conflicts.
- `scripts/post-deploy-check.mjs`: the same AI-01 assertions will run after an authorized deployment.

The decision and rationale are recorded in `PROJECT_BRIEF.md`; project-specific execution guidance is recorded in `SEO_RULES.md`.

## Local generated endpoint evidence

The final Next production build served `http://localhost:3000/robots.txt` with:

- HTTP `200`.
- `content-type: text/plain`.
- 12 rule groups: one wildcard, six blocked, and five public-search/user-retrieval groups.
- Production `Host: https://mysquarefaceicon.com`.
- Production `Sitemap: https://mysquarefaceicon.com/sitemap.xml`.
- Built artifact SHA-256: `E114DFAAA714B7B9D2385907A7F1E915E30C606D049F11457F45A9F6549D554F`.

`npm run robots:check`: `通过` with `6 blocked, 5 public-search/user retrieval allowed`.

The built artifact also passed direct shared-validator inspection. A mutated fixture with `Claude-SearchBot` removed failed as expected, and an empty/malformed policy object produced configuration failures instead of passing.

## Engineering and regression results

- `npx tsc --noEmit`: `通过`.
- `npm run lint`: `通过`, zero warnings/errors.
- Script syntax checks for the shared policy module, dedicated checker, local SEO checker, and post-deploy checker: `通过`.
- Policy data assertion: `11 required / 6 blocked / 5 allowed / 2 private paths`: `通过`.
- `canonical:check` plus the 11 accepted task checks from `games:check` through `game-template:check`: `通过`.
- `game-template:check` still emits the pre-existing React server-render `fetchPriority` compatibility warning; it remains visible and was not caused or fixed by AI-01.
- `npm run build`: `通过`; 42 generated/static app routes including `/robots.txt`, middleware `26.8 kB`.
- `npm run cf:build`: `通过`; OpenNext Worker generated and project patch applied. The existing Windows compatibility warning remains visible.
- Local `npm run seo:check`: `不通过` globally with the unchanged 12 KW-02 must findings and 17 should reminders. AI-01 produced zero findings, so the crawler-policy portion passed without hiding the unrelated blockers.

## Visual, mobile, and accessibility boundary

AI-01 changes a plain-text metadata route and no rendered UI. Desktop/mobile visual QA, interaction QA, H1, focus, layout, and accessibility checks are therefore `不适用` for this source change rather than reported as passed. Existing page UI was not modified.

## Release state and remaining blockers

- Source implementation is `本地已验收`.
- Production `/robots.txt` is `未验证`; the currently deployed Worker remains unchanged.
- `npm run seo:prod` was not run because no deployment occurred.
- No commit, push, deployment, DNS/Cloudflare setting, KV, R2, D1, game, content, or schema mutation occurred.
- OP-11 production redirect evidence, 12 KW-02 must findings, PF-01 first-Play INP `221 ms`, and exact Square/Oval license evidence `UNKNOWN` remain open.
- `MIG-SQUARE-001` remains unopened.

## Rollback

Before deployment, restore the prior wildcard-only `app/robots.ts`, remove the AI policy data/checker integration, and revert the AI-01 decision records. No URL, data, or schema migration is involved. After a later authorized deployment, roll back to the preceding Worker version only after reconfirming its ID and rerun the production robots/canonical/sitemap checks immediately.

Acceptance record: the user explicitly replied `AI-01 验收通过，继续下一发布阻断项` on 2026-09-02. Production remains a separate unverified gate.
