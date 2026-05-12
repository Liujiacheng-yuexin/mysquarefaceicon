# PROJECT_BRIEF.md

## Website Basics

- Website name: My Square Face Icon
- Domain: `mysquarefaceicon.com`
- Website type: Free web tool / avatar generator
- Target country: Global, with initial focus on English search traffic
- Target language: English first, with ES, VI, JA, TH, AR, RU, and ID launch pages
- Monetization: None in v1. Future options may include display ads or affiliate links after traffic is stable.

## Audience

- Users who want a quick, cute square avatar for Discord, TikTok, YouTube, forums, games, or profile pages.
- Users want to create an icon without signup, payment, or installing an app.
- The core action is to start the browser game, customize a square face icon, and save it when the game workflow supports it.

## SEO Goals

- Primary keyword: `square face generator`
- Secondary keyword: `square face icon generator`
- Long-tail keywords: `free square face generator`, `cute square face icon`, `square avatar generator`, `pixel square face maker`
- First phase goal: launch an indexable, useful core tool page.
- 90-day goal: expand with supporting long-tail pages and content once the tool is stable.

## Competitor Reference

| Competitor | URL | Useful Reference | Do Not Copy |
|---|---|---|---|
| Square Face Generator reference site | `https://squarefacegenerator.app/` | Tool-first page structure, FAQ, gallery, schema, social metadata, authorized SWF behavior | Unauthorized images, comments, copy, keyword stuffing |

## Product Value

- The main tool uses an authorized SWF through Ruffle to preserve the original game feel.
- Ruffle is self-hosted from the site where possible instead of relying on CDN loading.
- The site keeps a lightweight HTML5 Canvas fallback if Ruffle or the SWF cannot load.
- The core user action should take three steps: start game, customize, save or use fallback.
- Production target is Cloudflare Workers through OpenNext, with Cloudflare KV for
  moderated comment metadata and R2 for optional comment images.
