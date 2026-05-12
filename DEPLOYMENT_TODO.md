# DEPLOYMENT_TODO.md

## Current Status

The site is ready for local preview and Cloudflare deployment preparation, but not fully production-ready until the Cloudflare resources below are created and verified.

Current Windows result: `npm run cf:build` fails with `EPERM: operation not permitted, lstat 'C:\Users\liu'`. OpenNext also warns that Windows is not fully compatible. Treat WSL or Linux CI as the required environment for the Cloudflare build.

## Done Locally

- `npm run lint` passes with existing Next.js image optimization warnings for moderated user uploads.
- `npm run build` passes.
- Local production preview routes return `200` for `/`, `/es`, legal pages, `robots.txt`, `sitemap.xml`, `/games/square-face.swf`, `/games/square-face-cover.svg`, and `/ruffle/ruffle.js`.
- Homepage, legal pages, `robots.txt`, `sitemap.xml`, local SWF, local Ruffle runtime, and local cover SVG are implemented.
- Homepage no longer links to unsupported Blog or Gallery sections.
- `Share` and `Copy link` controls are centered under the game.

## Manual Cloudflare Tasks

0. Run `scripts/cloudflare-login.cmd` and complete the browser login. This stores Wrangler auth under the project-local `.wrangler-config` directory.
1. KV namespaces and R2 buckets have been created.
2. KV namespace IDs have been added to `wrangler.toml`.
3. Run `scripts/cloudflare-set-secrets.cmd` to set Wrangler secrets:
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
4. Optional: set `CLOUDFLARE_WEB_ANALYTICS_TOKEN`.
5. Run `npm run cf:build` in WSL or a Linux CI environment.
6. Run `npm run cf:preview` after KV/R2 bindings exist.
7. Deploy and bind `mysquarefaceicon.com` to the Worker route.

## Final Pre-Launch Browser Checks

- Click the game cover and verify Ruffle loads the SWF.
- Confirm the original game can be used without console errors.
- Confirm mobile width has no horizontal overflow.
- Submit a comment, approve it in `/admin/comments`, and confirm it appears publicly.
- Upload a small valid image and reject an invalid or oversized image.
- Confirm `/robots.txt` points to `https://mysquarefaceicon.com/sitemap.xml`.
- Submit the sitemap in Google Search Console and Bing Webmaster Tools after launch.
