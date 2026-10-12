# PROJECT_BRIEF.md

## Website Basics

- Website name: My Square Face Icon
- Domain: `mysquarefaceicon.com`
- Website type: Square-led classic avatar maker plus vertical face/avatar/character creator browser portal
- Target country: Global, with initial focus on English search traffic
- Target language: English first, with ES, VI, JA, TH, AR, RU, and ID launch pages
- Monetization: None in v1. Future options may include display ads or affiliate links after traffic is stable.

## Confirmed Product Direction

- On 2026-10-13, the user confirmed the QUIZ-001 mobile-preview, shared-link auto-start and nickname repairs and explicitly included enabling the public page's ads/analytics. This supersedes only the earlier quiz-page script exclusion: the embedded game remains without third-party resources/uploads, and private fragments are captured and removed before vendors run. Main commit/push/deployment is authorized after the required checks. See `docs/product/friend-block-test-fixes.md`.

- On 2026-10-12, the user explicitly confirmed QUIZ-001 for local development: one avatar-led Friend Block Test at `/games/friend-block-test`, a `friend-quizzes` category, a per-record indexing exception and quiz-only third-party script isolation. This is a single supplementary experience, not an expansion into a general games portal. The Square flagship and homepage first viewport remain unchanged. Implementation acceptance and release permission remain separate; see `docs/product/friend-block-test-proposal.md`.

- On 2026-09-22, the user accepted HOME-CTR-001 homepage metadata and confirmed the HOME-MOBILE-001 proposal: a Classic game / Simple maker switch within the same homepage tool region. Phones default to the geometric Canvas maker; desktop defaults to the classic game. These are distinct visual styles, not a remake of the SWF. Homepage keyword, H1, canonical, index policy and vertical scope remain unchanged. Implementation acceptance and deployment remain separate.
- On 2026-08-31, the user explicitly confirmed the STRAT-001 “vertical avatar game portal” proposal.
- Square Face Generator remains the flagship homepage experience and the primary intent of `/`; the portal role is additive and must not displace the core game.
- Expansion is limited to strongly related Avatar Maker, Face Maker, Character Creator, Pixel Avatar, Retro Flash, and conditional avatar-focused Dress-up Creator experiences.
- Generic Racing, Shooting, IO, gambling, sports, and unrelated game categories are outside this brand unless the user later approves a separate direction.
- Games, External Tools, Guides, Gallery, Blog, and Policy content must remain distinct; unsupported Popular/Trending/community metrics are prohibited.
- The durable positioning, inclusion tests, interaction boundaries, and change-control rules are defined in `docs/product/positioning.md`.

## Audience

- Users who want a quick, cute square avatar for Discord, TikTok, YouTube, forums, games, or profile pages.
- Users want to create an icon without signup, payment, or installing an app.
- The core action is to customize a square avatar. Simple maker offers Canvas PNG export; Classic game keeps its in-game save or screenshot workflow when supported by the browser.

## SEO Goals

- Primary keyword: `square face generator`
- Secondary keyword: `square face icon generator`
- Long-tail keywords: `free square face generator`, `cute square face icon`, `square avatar generator`, `pixel square face maker`
- First phase goal: launch an indexable, useful core tool page.
- 90-day goal: establish a data-driven vertical avatar game platform, then expand only with rights-cleared, high-quality games and supporting content after the core tool is stable.

## SEO Governance Decision

- On 2026-08-31, the user explicitly approved migration to the `RULES.md` v2.1 SEO standard during `BASE-001` acceptance.
- The retired `3%-5%` exact-keyword density target is not a ranking target or release gate. Content follows KW-01/02 position and minimum-use coverage, KW-03 naturalness alerts, and KW-04 semantic coverage.
- `RULES.md` is the reusable rule authority; `SEO_RULES.md` contains only confirmed MySquareFaceIcon project decisions.
- On 2026-09-02, the user explicitly confirmed the recommended AI-01 split policy with `确认 AI-01 分流策略`.
- The project opts out of model-training and bulk-corpus crawlers while keeping public pages available to AI search and user-triggered retrieval. This preserves potential citation/discovery traffic without silently granting training access.
- `robots.txt` remains a crawler preference signal rather than a security control. `/admin/` and `/api/` stay disallowed for the wildcard group and every explicitly allowed AI search/retrieval group.

### AI-01 crawler decisions

| User-agent | Decision | Project rationale |
|---|---|---|
| `GPTBot` | Block all paths | Opt out of OpenAI model-training crawl |
| `OAI-SearchBot` | Allow public paths; block `/admin/` and `/api/` | Preserve ChatGPT search discovery |
| `ChatGPT-User` | Allow public paths; block `/admin/` and `/api/` | Express support for user-triggered retrieval; robots enforcement is not guaranteed for user actions |
| `ClaudeBot` | Block all paths | Opt out of Anthropic model-training crawl |
| `Claude-User` | Allow public paths; block `/admin/` and `/api/` | Preserve user-triggered retrieval |
| `Claude-SearchBot` | Allow public paths; block `/admin/` and `/api/` | Preserve Anthropic search discovery; added from the current official crawler list |
| `PerplexityBot` | Allow public paths; block `/admin/` and `/api/` | Preserve Perplexity search discovery |
| `Google-Extended` | Block all paths | Opt out of the covered Gemini training/grounding uses without changing normal Google Search policy |
| `CCBot` | Block all paths | Opt out of the Common Crawl open corpus |
| `Bytespider` | Block all paths | Conservative bulk/training-risk choice; current primary vendor purpose documentation was not found during the 2026-09-02 review |
| `Applebot-Extended` | Block all paths | Opt out of Apple foundation-model training while leaving ordinary Apple search discovery under the wildcard policy |

The dated primary-source review and rollback boundary are recorded in `docs/ops/ai-crawler-policy-proposal.md`. The executable decision source is `data/ai-crawler-policy.json`.

## Competitor Reference

| Competitor | URL | Useful Reference | Do Not Copy |
|---|---|---|---|
| Square Face Generator reference site | `https://squarefacegenerator.app/` | Tool-first page structure, FAQ, gallery, schema, social metadata, SWF/Ruffle UX behavior | Images, comments, copy, downloadable assets, or unverified rights claims |

## Product Value

- The main experience currently runs a project-provided SWF through Ruffle. Its exact source and license permissions remain `UNKNOWN` until evidence is attached to `data/game-license-registry.json`; repository presence or an old project note must not be treated as authorization.
- Ruffle is self-hosted from the site where possible instead of relying on CDN loading.
- The public page should not present the classic game as an AI generator or a modern rebuilt generator. Simple maker is labeled as a separate illustrated style, with no rights or authorship claims.
- The core user action should take three steps: start the Flash game, customize the square face, then save through the game or take a screenshot if saving is not available.
- Production target is Cloudflare Workers through OpenNext, with Cloudflare KV for
  moderated comment metadata and lightweight like records, and R2 for optional
  comment images.
