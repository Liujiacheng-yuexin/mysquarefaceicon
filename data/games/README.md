# Game Data

This directory contains the typed records for the current game/tool inventory. The runtime contract is
`lib/games/game-schema.ts`, and `lib/games/catalog.ts` is the query layer used to resolve records by id, slug, or
published path.

## Add a record

1. Add one typed record in this directory and register it with a direct import in `lib/games/catalog.ts`.
2. Reference an existing entry in `data/game-license-registry.json`. Do not convert `UNKNOWN` into permission.
3. Keep external tools on the delivery mode allowed by their release decision. `DIRECT_LINK_ONLY` must never become an
   iframe or local asset path.
4. Use `null` plus an explanatory note for unverified authors, measurements, semantic scores, and publication dates.
5. Run `npm run games:check`. It type-checks the isolated data layer, validates catalog uniqueness and relations,
   reconciles license gates, hashes local SWFs, and verifies referenced project assets.
6. Run `npm run metadata:check`. It verifies the required SEO fields, unique index-page title/description/canonical,
   one Game Data H1 per game page, Open Graph/Twitter output, legacy canonicals, and fail-closed noindex behavior.

`META-001` wires the three records into the game-page metadata and H1 boundary. Later migration tasks still own the
remaining content/template work, so current URLs, indexing, player behavior, and search intent cannot change accidentally.
