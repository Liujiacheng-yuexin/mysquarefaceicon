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
