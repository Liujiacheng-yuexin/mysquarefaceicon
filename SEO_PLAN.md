# SEO_PLAN.md

## 30 / 60 / 90 Day Plan

| Stage | Data to Watch | Page Work | Content Work | Decision Criteria |
|---|---|---|---|---|
| Days 1-7 | Indexing and crawl status | Core pages only | Fix launch issues | Homepage indexed |
| Weeks 2-4 | Impressions and queries | Add low-competition support pages if useful | 1-2 helpful articles | GSC shows impressions |
| Months 2-3 | Rankings and CTR | Expand long-tail pages | Keep content tied to the tool | Keywords enter top 50 |

## International Pages

- EN remains the canonical default at `/`.
- ES, VI, JA, TH, AR, RU, and ID use language-specific paths and hreflang.
- Arabic uses `dir="rtl"` on the page wrapper.
- Machine translation is acceptable for launch validation, but the next content
  quality task should be native-language review before serious link building.

## Cloudflare Launch Notes

- Use `npm run cf:build` to generate the OpenNext Worker bundle.
- Use `wrangler kv namespace create COMMENTS_KV` and an R2 bucket named
  `mysquarefaceicon-comment-images` before production deploy.
- Store `ADMIN_PASSWORD` and `SESSION_SECRET` as Wrangler secrets, not committed
  source files.
- Keep `MSFI_USE_CLOUDFLARE_BINDINGS=true` in Wrangler variables so comment
  routes use KV/R2 on Cloudflare while normal local Next runs use the memory
  fallback.

## Current SEO Architecture

- Homepage `/`: primary ranking and tool page for `square face generator`.
- Homepage anchors: `#maker`, `#what-is`, `#features`, `#how-to-use`, and `#faq` support direct sharing and search-result sitelink style navigation.
- Trust and inspiration pages:
  - `/about-us`: project trust, originality, privacy, and roadmap context.
  - `/free-avatar-maker`: broader free avatar maker intent tied back to the square face generator.
  - `/square-avatar-generator`: broader square avatar workflow intent tied back to the generator.
  - `/gallery`: original square face icon examples and inspiration, not third-party image reuse.
- Support pages:
  - `/square-face-icon-generator`: secondary keyword guide and internal link hub.
  - `/cute-square-avatar-generator`: style-focused long-tail support page.
  - `/pixel-square-face-maker`: pixel-inspired avatar workflow support page.
- Blog hub `/blog`: guide index, not a thin company news page.
- Blog guide `/blog/how-to-make-a-cute-discord-profile-icon`: first long-tail ranking page.
- Blog guide `/blog/discord-avatar-size-guide`: Discord avatar sizing and crop-safe icon intent.
- Blog guide `/blog/tiktok-profile-icon-ideas`: TikTok avatar inspiration intent.
- Blog guide `/blog/square-avatar-vs-round-avatar`: avatar shape comparison intent.
- Blog guide `/blog/cute-profile-picture-ideas`: cute profile picture inspiration intent.
- Blog guide `/blog/best-discord-avatar-style`: Discord avatar style and community identity intent.
- Blog guide `/blog/avatar-maker-without-signup`: no-signup avatar maker and privacy-friendly workflow intent.
- Legal pages remain low-priority indexable utility pages.

## Page Quality Rules

- Do not publish a new support page unless it has a unique search intent, unique metadata, visible H1, useful body content, and internal links back to the generator.
- Do not add a URL to sitemap until it has a stable canonical URL and at least one relevant internal link.
- If a page receives no impressions, no clicks, and no useful role after review, merge it into a stronger page or remove it from sitemap before expanding similar pages.
