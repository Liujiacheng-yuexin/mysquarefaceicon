# LAUNCH_CHECKLIST.md

## Before Launch

- [x] `npm run build` passes
- [x] `npm run lint` passes, or the reason is documented
- [x] Homepage is accessible
- [x] `/privacy-policy` is accessible
- [x] `/terms-of-service` is accessible
- [x] `/about-us` is accessible
- [x] `/free-avatar-maker` is accessible
- [x] `/square-avatar-generator` is accessible
- [x] `/gallery` is accessible
- [x] `/blog/cute-profile-picture-ideas` is accessible
- [x] `/blog/best-discord-avatar-style` is accessible
- [x] `/blog/avatar-maker-without-signup` is accessible
- [x] `sitemap.xml` is accessible
- [x] `robots.txt` is accessible and declares sitemap
- [x] Local SWF file is accessible at `/games/square-face.swf`
- [x] Local Ruffle runtime is accessible at `/ruffle/ruffle.js`
- [x] Every indexable page has a canonical URL
- [x] Every page has exactly one H1
- [x] Important buttons have accessible labels
- [x] Homepage links only to supported public pages
- [x] GA4 Google tag is configured once across all pages
- [ ] `npm run cf:build` passes
- [ ] `wrangler dev` preview works with valid KV/R2 bindings
- [x] `COMMENTS_KV` production and preview namespaces are created
- [x] `COMMENT_IMAGES_R2` production and preview buckets are created
- [ ] `ADMIN_PASSWORD` is configured as a Wrangler secret
- [ ] `SESSION_SECRET` is configured as a Wrangler secret
- [x] Comment submission enters pending status
- [x] Admin approve/reject/delete works
- [x] Approved comments render publicly
- [ ] Mobile layout has no horizontal overflow
- [ ] Ruffle loads the SWF game
- [ ] Canvas fallback randomize, reset, color update, and download work

## Launch Day

- [ ] Bind `mysquarefaceicon.com` to the Cloudflare Worker route
- [ ] Submit site to Google Search Console
- [ ] Submit sitemap to Google Search Console
- [ ] Request homepage indexing
- [ ] Submit site to Bing Webmaster Tools
- [ ] Record launch date in `SEO_LOG.md`
