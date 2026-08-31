# PROJECT_BRIEF.md

## Website Basics

- Website name: My Square Face Icon
- Domain: `mysquarefaceicon.com`
- Website type: Square-led classic avatar maker plus vertical face/avatar/character creator browser portal
- Target country: Global, with initial focus on English search traffic
- Target language: English first, with ES, VI, JA, TH, AR, RU, and ID launch pages
- Monetization: None in v1. Future options may include display ads or affiliate links after traffic is stable.

## Confirmed Product Direction

- On 2026-08-31, the user explicitly confirmed the STRAT-001 “vertical avatar game portal” proposal.
- Square Face Generator remains the flagship homepage experience and the primary intent of `/`; the portal role is additive and must not displace the core game.
- Expansion is limited to strongly related Avatar Maker, Face Maker, Character Creator, Pixel Avatar, Retro Flash, and conditional avatar-focused Dress-up Creator experiences.
- Generic Racing, Shooting, IO, gambling, sports, and unrelated game categories are outside this brand unless the user later approves a separate direction.
- Games, External Tools, Guides, Gallery, Blog, and Policy content must remain distinct; unsupported Popular/Trending/community metrics are prohibited.
- The durable positioning, inclusion tests, interaction boundaries, and change-control rules are defined in `docs/product/positioning.md`.

## Audience

- Users who want a quick, cute square avatar for Discord, TikTok, YouTube, forums, games, or profile pages.
- Users want to create an icon without signup, payment, or installing an app.
- The core action is to play the classic Flash avatar maker game in the browser, customize a square face icon, and save or screenshot the result when the original game workflow supports it.

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
- The per-crawler AI policy required by AI-01 remains a separate undecided item. Existing robots behavior must not be changed until the user explicitly chooses the training/search crawler policy.

## Competitor Reference

| Competitor | URL | Useful Reference | Do Not Copy |
|---|---|---|---|
| Square Face Generator reference site | `https://squarefacegenerator.app/` | Tool-first page structure, FAQ, gallery, schema, social metadata, SWF/Ruffle UX behavior | Images, comments, copy, downloadable assets, or unverified rights claims |

## Product Value

- The main experience currently runs a project-provided SWF through Ruffle. Its exact source and license permissions remain `UNKNOWN` until evidence is attached to `data/game-license-registry.json`; repository presence or an old project note must not be treated as authorization.
- Ruffle is self-hosted from the site where possible instead of relying on CDN loading.
- The public page should not present the game as an AI generator or a modern rebuilt generator.
- The core user action should take three steps: start the Flash game, customize the square face, then save through the game or take a screenshot if saving is not available.
- Production target is Cloudflare Workers through OpenNext, with Cloudflare KV for
  moderated comment metadata and lightweight like records, and R2 for optional
  comment images.
