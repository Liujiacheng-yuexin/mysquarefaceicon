# SEO_LOG.md

| Date | Action | Page | Keyword | Result | Next Step |
|---|---|---|---|---|---|
| 2026-05-12 | Initial implementation completed | `/` | square face generator | Build, lint, routes, sitemap, robots, H1, canonical, WebApplication schema, and FAQ schema verified locally | Deploy to Vercel and bind domain |
| 2026-05-12 | Switched core tool to Ruffle/SWF | `/` | square face generator | Main generator now uses authorized local SWF and local Ruffle runtime, with Canvas fallback | Browser-click test Ruffle player after deploy |
| 2026-05-12 | Replaced SWF with provided 2013 file | `/games/square-face.swf` | square face generator | Local SWF now matches `square-face-icon-generator-2013.swf` provided by user | Test Start Game in browser |
| 2026-05-12 | Fixed Ruffle mount DOM conflict | `/` | square face generator | Ruffle now mounts into a dedicated DOM node so React no longer removes children managed by Ruffle | Retest Start Game in browser console |
| 2026-05-12 | Added multilingual tool pages | `/`, `/es`, `/vi`, `/ja`, `/th`, `/ar`, `/ru`, `/id` | square face generator | 8 public language pages now build with canonical, alternates, WebApplication schema, FAQ schema, and one H1 each | Native-language review before heavy promotion |
| 2026-05-12 | Added moderated comments and upload policy | `/`, `/admin/comments`, `/privacy-policy`, `/terms-of-service` | square face icon generator | Comments submit as pending, admin approval publishes them, and upload limits are documented | Configure Cloudflare KV/R2 and admin secrets |
| 2026-05-12 | Added Cloudflare OpenNext setup | project config | square face generator | Added OpenNext/Wrangler config, PWA manifest, service worker, Cloudflare analytics hook, and sitemap updates | Run `npm run cf:build` in WSL or non-sandbox Cloudflare environment |
| 2026-05-12 | Refined homepage visual style and game preview | `/` | square face generator | Homepage now uses a cute US-style header, orange CTA, mint hero band, and local SWF-style preview cover before Ruffle loads | Browser-check desktop and mobile layout |
| 2026-05-12 | Simplified homepage nav and removed thin gallery block | `/` | square face generator | Removed unsupported Blog/Gallery nav items, centered share controls, removed Square Face Icon Ideas section, and cleaned up the SWF preview cover | Recheck visual spacing after restart |
| 2026-05-12 | Added deployment todo and aligned project docs | project docs | square face generator | Updated style/page/checklist docs to match the current homepage and documented Cloudflare manual tasks | Complete KV/R2/secrets and run OpenNext build in WSL or CI |
| 2026-05-12 | Rechecked local production preview | `/` | square face generator | `npm run lint`, `npm run build`, and local route checks passed; Cloudflare build still blocked on Windows/OpenNext permission issue | Run Cloudflare build in WSL or Linux CI |
