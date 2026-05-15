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
| Square Face Icon Guide | `/square-face-icon-generator` | Support / guide page | square face icon generator | Learn how to create and use square face icons | P1 | Implemented |
| Cute Square Avatar Tips | `/cute-square-avatar-generator` | Support / guide page | cute square avatar generator | Learn style tips for cute square profile avatars | P1 | Implemented |
| Pixel Square Face Maker | `/pixel-square-face-maker` | Support / guide page | pixel square face maker | Create a pixel-inspired square face avatar workflow | P2 | Implemented |
| Blog Index | `/blog` | Blog hub | square face icon guides | Browse practical avatar icon guides | P1 | Implemented |
| Discord Profile Icon Guide | `/blog/how-to-make-a-cute-discord-profile-icon` | Blog guide | how to make a cute Discord profile icon | Make a readable Discord profile avatar | P1 | Implemented |
| Discord Avatar Size Guide | `/blog/discord-avatar-size-guide` | Blog guide | Discord avatar size | Learn avatar source size and crop-safe profile icon rules | P1 | Implemented |
| TikTok Profile Icon Ideas | `/blog/tiktok-profile-icon-ideas` | Blog guide | TikTok profile icon ideas | Find profile icon ideas for TikTok creator accounts | P1 | Implemented |
| Square Avatar vs Round Avatar | `/blog/square-avatar-vs-round-avatar` | Blog comparison | square avatar vs round avatar | Compare avatar source shape and platform display crops | P1 | Implemented |
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
- Square Face Icon Resources
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
| Home | `/square-face-icon-generator` | Icon Guide |
| Home | `/cute-square-avatar-generator` | Cute Square Avatars |
| Home | `/pixel-square-face-maker` | Pixel Square Face Maker |
| Home | `/blog` | Blog |
| Blog | `/blog/how-to-make-a-cute-discord-profile-icon` | How to Make a Cute Discord Profile Icon |
| Blog | `/blog/discord-avatar-size-guide` | Discord Avatar Size Guide |
| Blog | `/blog/tiktok-profile-icon-ideas` | TikTok Profile Icon Ideas |
| Blog | `/blog/square-avatar-vs-round-avatar` | Square Avatar vs Round Avatar |
| Blog guide | `/` | Square Face Generator |
| Blog guide | `/square-face-icon-generator` | Square Face Icon Generator Guide |
| Support pages | `/blog` | Square Face Icon Guides |
| Legal pages | `/` | Square Face Generator |
