# SEO_ARCHITECTURE.md

This document turns the general SEO rules into the current operating system for `mysquarefaceicon.com`.

## 1. Information Architecture

```text
Home /
  -> Generator first viewport
  -> Anchor sections
      -> #maker
      -> #what-is
      -> #features
      -> #how-to-use
      -> #faq
  -> Square face icon resources
  -> Trust and inspiration pages
      -> /about-us
      -> /free-avatar-maker
      -> /square-avatar-generator
      -> /gallery
  -> Support pages
      -> /square-face-icon-generator
      -> /cute-square-avatar-generator
      -> /pixel-square-face-maker
  -> Blog hub
      -> /blog
      -> /blog/how-to-make-a-cute-discord-profile-icon
      -> /blog/discord-avatar-size-guide
      -> /blog/tiktok-profile-icon-ideas
      -> /blog/square-avatar-vs-round-avatar
      -> /blog/cute-profile-picture-ideas
      -> /blog/best-discord-avatar-style
      -> /blog/avatar-maker-without-signup
  -> Legal
      -> /privacy-policy
      -> /terms-of-service
```

## 2. Page Type Inventory

| Page Type | Role | Current URLs |
|---|---|---|
| Core tool page | Primary ranking page and product page | `/`, locale pages |
| Trust page | Explains project purpose, originality, privacy, and roadmap | `/about-us` |
| Broad support page | Broader avatar maker intent tied back to the generator | `/free-avatar-maker`, `/square-avatar-generator` |
| Gallery | Original inspiration examples and internal discovery | `/gallery` |
| Support guide | Secondary keyword and internal link hub | `/square-face-icon-generator`, `/cute-square-avatar-generator`, `/pixel-square-face-maker` |
| Blog hub | Lists practical guides and distributes internal links | `/blog` |
| Blog guide | Long-tail search landing page | `/blog/how-to-make-a-cute-discord-profile-icon`, `/blog/discord-avatar-size-guide`, `/blog/tiktok-profile-icon-ideas`, `/blog/square-avatar-vs-round-avatar`, `/blog/cute-profile-picture-ideas`, `/blog/best-discord-avatar-style` |
| Legal | Trust and compliance | `/privacy-policy`, `/terms-of-service` |
| Admin/API | Utility only, not indexable | `/admin/*`, `/api/*` |

## 3. URL Rules

- Use lowercase English URLs.
- Use short hyphenated slugs.
- Do not publish parameter-based SEO URLs.
- Do not create duplicate URLs for the same search intent.
- Once indexed, avoid changing URLs unless there is a clear migration plan.

## 4. Metadata Templates

- Homepage: `My Square Face Icon - Free Square Face Generator Online`
- Support guide: `{Topic} - My Square Face Icon`
- Blog article: `{Natural question or tutorial title} - My Square Face Icon`
- Legal: `{Policy Name} - My Square Face Icon`

Descriptions should explain the page value in one or two natural sentences and should not repeat keywords mechanically.

## 5. Sitemap Strategy

- `app/sitemap.ts` is the source of truth.
- Sitemap includes only public, indexable pages.
- Admin routes, API routes, uploads, and low-value experimental pages stay out of sitemap.
- New important pages must be added to sitemap only after canonical, metadata, and internal links exist.

## 6. Canonical Strategy

- Each indexable page canonical points to itself.
- Locale pages use hreflang through the homepage metadata helper.
- Search, filters, admin, API, and upload-serving routes are not planned as indexable SEO pages.
- Do not canonical unrelated pages to the homepage.

## 7. Internal Linking Strategy

- Homepage links to the generator, support pages, blog, FAQ, and legal pages.
- Support pages link back to the generator and to related support or blog pages.
- Blog hub links to every published guide and core resource page.
- Blog guides link back to the generator and at least two related resources.
- Legal pages link back to the generator.

## 8. Middle Pages vs Ranking Pages

| URL | Type | Ranking Intent |
|---|---|---|
| `/` | Ranking page | Primary keyword and tool intent |
| `/about-us` | Trust page | Brand and project trust intent |
| `/free-avatar-maker` | Ranking support page | Free avatar maker workflow intent |
| `/square-avatar-generator` | Ranking support page | Square avatar workflow and profile crop intent |
| `/gallery` | Middle + inspiration page | Square face icon examples and style intent |
| `/square-face-icon-generator` | Ranking + hub page | Secondary keyword and education intent |
| `/cute-square-avatar-generator` | Ranking support page | Cute avatar style intent |
| `/pixel-square-face-maker` | Ranking support page | Pixel-inspired avatar workflow intent |
| `/blog` | Middle page | Discovery and internal distribution |
| `/blog/how-to-make-a-cute-discord-profile-icon` | Ranking page | Discord avatar tutorial intent |
| `/blog/discord-avatar-size-guide` | Ranking page | Discord avatar sizing and crop-safe source intent |
| `/blog/tiktok-profile-icon-ideas` | Ranking page | TikTok profile icon inspiration intent |
| `/blog/square-avatar-vs-round-avatar` | Ranking page | Avatar shape comparison intent |
| `/blog/cute-profile-picture-ideas` | Ranking page | Cute profile picture inspiration intent |
| `/blog/best-discord-avatar-style` | Ranking page | Discord avatar style and server identity intent |
| `/blog/avatar-maker-without-signup` | Ranking page | No-signup avatar maker workflow intent |

## 9. Blog Strategy

Prioritize practical guides that lead back to the generator:

1. How to make a Discord profile icon.
2. Discord avatar size and crop guide.
3. TikTok profile icon ideas.
4. Square avatar vs round avatar.
5. Cute profile picture ideas.
6. Best avatar style for Discord servers.
7. Avatar maker without signup.

Each article must include a clear answer, H2/H3 structure, related links, metadata, and schema when appropriate.

## 10. Batch Page Quality Control

- No bulk page generation until templates, sitemap rules, canonical rules, and internal link rules are stable.
- Every page needs unique intent, not just a keyword variant.
- Pages with overlapping intent should be merged instead of split.
- Pages must be useful without relying on generated filler text.

## 11. Page Pruning Rules

Review pages after search data is available:

- Keep pages with impressions, clicks, conversions, backlinks, or strong internal navigation value.
- Improve pages with impressions but low CTR or weak engagement.
- Merge, noindex, or remove pages with no search demand and no user value.
- Remove pruned pages from sitemap.

## 12. Technical Error Checklist

- `npm run lint` passes.
- `npm run build` passes.
- `/robots.txt` returns 200 and lists sitemap.
- `/sitemap.xml` returns 200 and includes only indexable pages.
- New pages have one H1.
- New pages have canonical metadata.
- No unsupported navigation links.
- Mobile layout has no horizontal overflow.
- Cloudflare Worker logs have no recurring 5xx errors.

## 13. First Pages Created

- `/`
- `/es`, `/vi`, `/ja`, `/th`, `/ar`, `/ru`, `/id`
- `/about-us`
- `/free-avatar-maker`
- `/square-avatar-generator`
- `/gallery`
- `/square-face-icon-generator`
- `/cute-square-avatar-generator`
- `/pixel-square-face-maker`
- `/blog`
- `/blog/how-to-make-a-cute-discord-profile-icon`
- `/blog/discord-avatar-size-guide`
- `/blog/tiktok-profile-icon-ideas`
- `/blog/square-avatar-vs-round-avatar`
- `/blog/cute-profile-picture-ideas`
- `/blog/best-discord-avatar-style`
- `/blog/avatar-maker-without-signup`
- `/privacy-policy`
- `/terms-of-service`

## 14. 30 / 60 / 90 Day Plan

| Stage | Focus | Action |
|---|---|---|
| Days 1-7 | Launch stability | Fix Cloudflare errors, verify indexing, submit sitemap |
| Weeks 2-4 | Search feedback | Use GSC queries to choose 1-2 new guide topics |
| Months 2-3 | Expansion | Add support pages only for distinct search intents |

## 15. Validation Log

Record every meaningful SEO production change in `SEO_LOG.md`, including lint/build results and follow-up risks.
