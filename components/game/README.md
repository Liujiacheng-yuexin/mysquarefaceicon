# Shared Game Component Contract

`COMP-001` provides direct-import, typed building blocks for the avatar-game platform. Components read `GameRecord` or the existing validated `GamePlayerModel`; they do not own route policy, metadata, indexability, publication rights, analytics, or recommendation scoring.

## Current integration

| Component | Current use | Boundary |
|---|---|---|
| `GameCard`, `GameGrid` | `/games`, allowlisted category routes, and the primary homepage discovery region | Cards link to the record's fixed public path; external records first open the local source/details page. |
| `GameBreadcrumb` | `/games`, category routes, and the future game detail template | Visible breadcrumb labels and current-page semantics; JSON-LD breadcrumbs are built separately from the same Game Data. |
| `CategoryChip` | `/games` and the primary homepage discovery region | Counts come from the route resolver's published records. |
| `GamePlayer` | Stable shared import for the accepted player core | Re-exports the existing five-adapter implementation without moving or duplicating it. |
| `GameControls` | Used by `components/game-player/GamePlayer.tsx` | Playable controls and external-tool controls remain separate; external tools do not gain fake play/fullscreen/reload actions. |
| `GameMeta` | Used by `GameDetailTemplate` | Shows only typed category, device, fullscreen, source, and page-type facts. |
| `RelatedGames` | Used by `GameDetailTemplate` | Uses the shared Category + Tags selector over eligible published records; the detail variant changes presentation, not selection. Tests may inject an explicit candidate set without relaxing production eligibility. |
| `GameDetailTemplate` | Future eligible `/games/[slug]` records | Owns the accepted Player-first module order and conditional sections; it does not relax resolver, rights, 404, or noindex policy. |
| `GameFaq` | Used by `GameDetailTemplate` | Renders server-visible answers through native `details/summary`; an empty collection renders nothing. |
| `GameSourceRights` | Used by `GameDetailTemplate` | Exposes recorded source, license, release, publication, and delivery facts with explicit UNKNOWN/direct-link warnings. |
| `EmptyState` | Used by `GameGrid` when no records are supplied | Does not invent content or render fake cards. |
| `AdSlotShell` | Not mounted on current routes | Inert layout reservation only. It loads no ad script and stays off noindex, 404, and current low-volume scaffold pages. |

`HOME-IA-001` composes `GameGrid`, `GameCard`, and `CategoryChip` inside a server-rendered homepage discovery boundary. `HOME-DISC-001` adds controlled `home-media` and `home-discovery` variants without changing the default directory/category markup. Homepage cards read the record's `THUMBNAIL`, dimensions, alt, type, public path, name, summary, and action label from Game Data; missing media falls back to the existing text layout rather than an invented image. Pixel remains an External Tool and its whole card still opens the onsite details route.

The server-only `lib/games/home-discovery.ts` resolver owns homepage selection: the Related module uses the shared Category + Tags selector, independent of `relatedGameIds`; New accepts only published records with a valid `VERIFIED` timestamp, sorts newest first, and excludes the current and Related records; Categories resolve only non-empty allowlisted routes with published records. Any empty module is omitted, and if all three are empty the discovery section is omitted. Import component files directly; there is no barrel file so client bundles do not pull unrelated components.

`GAME-TPL-001` composes the detail page on the server from a validated `GameRecord` and matching `GamePlayerModel`. `lib/seo/game-structured-data.ts` emits only visible facts: Breadcrumb plus conservative VideoGame for playable records or WebPage for External Tools, and FAQPage only when FAQ is rendered. The current route remains force-noindex and fail-closed until a separate publishing task supplies an eligible non-legacy record.
