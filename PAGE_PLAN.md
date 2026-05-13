# PAGE_PLAN.md

## First Release Pages

| Page | URL | Type | Primary Keyword | Search Intent | Priority | Status |
|---|---|---|---|---|---|---|
| Home EN | `/` | Tool page | square face generator | Play a square face avatar maker and create an icon | P0 | Implemented |
| Home ES | `/es` | Tool page | generador de caras cuadradas | Play the localized generator | P0 | Implemented |
| Home VI | `/vi` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Home JA | `/ja` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Home TH | `/th` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Home AR | `/ar` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Home RU | `/ru` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Home ID | `/id` | Tool page | square face generator | Play the localized generator | P0 | Implemented |
| Privacy Policy | `/privacy-policy` | Legal | privacy policy | Understand data handling | P0 | Implemented |
| Terms of Service | `/terms-of-service` | Legal | terms of service | Understand usage terms | P0 | Implemented |

## Homepage Modules

- Navigation
- Tool-first hero with Ruffle/SWF generator
- HTML5 Canvas fallback for load failures
- Why use this generator
- How it works
- Perfect for
- What is a Square Face Generator
- Share your creation / comments
- FAQ
- Grouped footer links

## Admin and API Routes

| Route | Purpose | Indexable |
|---|---|---|
| `/admin/comments` | Moderate pending, approved, rejected, and deleted comments | No |
| `/api/comments` | Public comments and new submissions | No |
| `/api/admin/comments` | Admin comment listing | No |
| `/api/comment-images/*` | Serves approved or stored comment image files | No |

## Internal Links

| Source Page | Target Page | Anchor |
|---|---|---|
| Home | `/privacy-policy` | Privacy Policy |
| Home | `/terms-of-service` | Terms of Service |
| Legal pages | `/` | Square Face Generator |
