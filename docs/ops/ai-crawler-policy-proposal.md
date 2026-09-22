# AI-01 crawler policy proposal

Status: `已确认、已实施并本地验收 / 生产未验证`; production robots behavior is unchanged.

Confirmation record: the user explicitly replied `确认 AI-01 分流策略` on 2026-09-02.

Acceptance record: the user explicitly replied `AI-01 验收通过，继续下一发布阻断项` on 2026-09-02. This accepts the local source implementation only; production robots remains unverified until an authorized deployment.

Official-purpose review: `2026-09-02`. The decision table covers all 10 user-agents required by `RULES.md` AI-01 plus the currently documented Anthropic search crawler `Claude-SearchBot`.

## Why confirmation was required

The accepted v2.1 rules required an explicit per-crawler choice. Before the user's confirmation, the wildcard-only rule allowed ordinary crawling but did not distinguish training crawlers from search and user-triggered retrieval, so `PROJECT_BRIEF.md` and `SEO_RULES.md` kept AI-01 undecided and prohibited an automatic robots change. The confirmation above closed that decision gate; implementation and production verification remain separate gates.

## Confirmed split policy

For this SEO- and advertising-oriented game/content site, preserve potential search citations and user-requested retrieval while opting out of bulk model-training collection:

| User-agent | Use | Confirmed decision |
|---|---|---|
| `GPTBot` | OpenAI training | Disallow `/` |
| `OAI-SearchBot` | ChatGPT search index | Allow `/`; keep `/admin/` and `/api/` disallowed |
| `ChatGPT-User` | User-triggered retrieval | Allow `/`; keep `/admin/` and `/api/` disallowed |
| `ClaudeBot` | Anthropic training | Disallow `/` |
| `Claude-User` | User-triggered retrieval | Allow `/`; keep `/admin/` and `/api/` disallowed |
| `Claude-SearchBot` | Anthropic search index | Allow `/`; keep `/admin/` and `/api/` disallowed |
| `PerplexityBot` | Search index | Allow `/`; keep `/admin/` and `/api/` disallowed |
| `Google-Extended` | Google model-training control | Disallow `/` |
| `CCBot` | Common Crawl dataset | Disallow `/` |
| `Bytespider` | Bulk crawler / training-risk classification required by project rules; no current primary vendor purpose statement was found | Disallow `/` |
| `Applebot-Extended` | Apple model-training control | Disallow `/` |

The normal `*` group remains allowed for public pages and blocked from `/admin/` and `/api/`. This proposal does not change Google Search indexing, page metadata, canonical URLs, sitemap membership, or visible content.

`ChatGPT-User` is included to make the site's intent explicit, but OpenAI currently notes that robots rules may not apply to user-initiated requests. This is therefore not represented as an enforceable access-control guarantee. `Google-Extended` does not affect inclusion or ranking in normal Google Search, although it controls additional Gemini training and grounding uses. `robots.txt` is a crawler preference signal, not a security boundary.

## Current primary-source review

- OpenAI documents `GPTBot` for potential training, `OAI-SearchBot` for ChatGPT search, and `ChatGPT-User` for user-triggered actions: <https://developers.openai.com/api/docs/bots>.
- Anthropic documents `ClaudeBot`, `Claude-User`, and the additional search-specific `Claude-SearchBot`: <https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler>.
- Perplexity states that `PerplexityBot` surfaces sites in search results and is not used for foundation-model training: <https://docs.perplexity.ai/docs/resources/perplexity-crawlers>.
- Google documents the scope and normal-Search boundary of `Google-Extended`: <https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers>.
- Apple documents `Applebot-Extended` as the generative-foundation-model training opt-out control while ordinary Applebot search discovery can remain enabled: <https://support.apple.com/en-ie/119829>.
- Common Crawl documents `CCBot`, its open crawl repository, and its robots opt-out: <https://commoncrawl.org/ccbot>.
- No current primary ByteDance/Bytespider purpose and robots-behavior statement was found in this review. The proposed block is a conservative project-policy decision, not a verified vendor characterization.

## Implementation and verification

- `PROJECT_BRIEF.md` now records all 11 decisions and the project rationale.
- `data/ai-crawler-policy.json` is the shared source used by `app/robots.ts`, the dedicated local checker, `seo-check`, and the post-deploy checker.
- Raw local production `/robots.txt` returned HTTP 200 `text/plain`; all 12 groups and private-path boundaries passed `npm run robots:check`.
- Type, zero-warning lint, 12 scoped regressions, Next build, and Cloudflare/OpenNext build passed. The corrected full `seo:check` still fails only on the pre-existing 12 KW-02 must findings and keeps 17 should reminders; AI-01 has zero findings.
- Production remains unverified because no deployment occurred, so `seo:prod` was not run.
- Full evidence is in `docs/quality/evidence/ai-01-crawler-policy/README.md`.

## Rollback

Rollback is source-only before deployment: restore the wildcard-only rules and the prior project-brief decision text, then remove the policy/checker integration. After deployment, redeploy the preceding Worker version and immediately rerun production robots, canonical, and sitemap checks. No page, data, or URL migration is involved.

The local source acceptance gate is closed. Production verification remains part of the controlled deployment gate.
