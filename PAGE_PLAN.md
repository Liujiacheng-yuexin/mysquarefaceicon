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
| About Us | `/about-us` | Trust page | about My Square Face Icon | Learn who runs the site and how the project handles originality and privacy | P1 | Implemented |
| Contact | `/contact` | Trust page | contact My Square Face Icon | Contact the project about feedback, privacy, corrections, or moderation | P1 | Implemented |
| Editorial Policy | `/editorial-policy` | Trust page | editorial policy | Explain content quality, AI assistance, moderation, and correction standards | P1 | Implemented |
| Free Avatar Maker | `/free-avatar-maker` | Support / guide page | free avatar maker | Create a free avatar with a square face icon workflow | P1 | Implemented |
| Oval Face Icon Generator | `/oval-face-icon-generator` | Tool page | oval face icon generator | Play an oval face avatar maker and create a rounded profile icon | P1 | Implemented |
| Pixel Art Avatar Icon Generator | `/pixel-art-avatar-icon-generator` | External embedded tool page | pixel art avatar icon generator | Use the embedded icongenerators.net pixel avatar maker with source attribution and fallback link | P1 | Implemented |
| Square Avatar Generator | `/square-avatar-generator` | Support / guide page | square avatar generator | Learn how square source avatars work across profile crops and platforms | P1 | Implemented |
| Square Face Icon Gallery | `/gallery` | Inspiration gallery | square face icon gallery | Browse original square face icon examples and style ideas | P1 | Implemented |
| Square Face Icon Guide | `/square-face-icon-generator` | Support / guide page | square face icon generator | Learn how to create and use square face icons | P1 | Implemented |
| Cute Square Avatar Tips | `/cute-square-avatar-generator` | Support / guide page | cute square avatar generator | Learn style tips for cute square profile avatars | P1 | Implemented |
| Pixel Square Face Maker | `/pixel-square-face-maker` | Support / guide page | pixel square face maker | Create a pixel-inspired square face avatar workflow | P2 | Implemented |
| Blog Index | `/blog` | Blog hub | square face icon guides | Browse practical avatar icon guides | P1 | Implemented |
| Discord Profile Icon Guide | `/blog/how-to-make-a-cute-discord-profile-icon` | Blog guide | how to make a cute Discord profile icon | Make a readable Discord profile avatar | P1 | Implemented |
| Discord Avatar Size Guide | `/blog/discord-avatar-size-guide` | Blog guide | Discord avatar size | Learn avatar source size and crop-safe profile icon rules | P1 | Implemented |
| TikTok Profile Icon Ideas | `/blog/tiktok-profile-icon-ideas` | Blog guide | TikTok profile icon ideas | Find profile icon ideas for TikTok creator accounts | P1 | Implemented |
| Square Avatar vs Round Avatar | `/blog/square-avatar-vs-round-avatar` | Blog comparison | square avatar vs round avatar | Compare avatar source shape and platform display crops | P1 | Implemented |
| Cute Profile Picture Ideas | `/blog/cute-profile-picture-ideas` | Blog guide | cute profile picture ideas | Find cute avatar ideas for social and gaming profiles | P1 | Implemented |
| Best Discord Avatar Style | `/blog/best-discord-avatar-style` | Blog guide | best Discord avatar style | Choose a readable Discord avatar style for servers and circular crops | P1 | Implemented |
| Avatar Maker Without Signup | `/blog/avatar-maker-without-signup` | Blog guide | avatar maker without signup | Create a profile avatar without account creation or design software | P1 | Implemented |
| Privacy Policy | `/privacy-policy` | Legal | privacy policy | Understand data handling | P0 | Implemented |
| Terms of Service | `/terms-of-service` | Legal | terms of service | Understand usage terms | P0 | Implemented |

## Homepage Modules

- Navigation
- Hero section with classic Flash avatar maker positioning, square face example collage, and generator-focused CTAs
- Trust badges: Original Flash Style, No Flash Plugin, 100% Free, No Signup, Runs in Browser
- Game player section with click-to-load self-hosted Ruffle/SWF player
- Game control bar with Fullscreen, Reload Game, and Report Issue
- Desktop/mobile experience notice
- Anchor compatibility for `#maker`, `#what-is`, `#features`, `#how-to-use`, and `#faq`
- How to save your square face icon
- Static Square Face Icon Ideas grid when approved community examples are not available
- Profile use cases for Discord PFP, GitHub avatar, Notion icon, favicon, gaming, and social media
- What is Square Face Generator
- How to play
- Game features
- Tips for best experience
- Troubleshooting
- Related avatar games and tools
- FAQ
- Grouped footer links

## Admin and API Routes

| Route | Purpose | Indexable |
|---|---|---|
| `/admin/comments` | Moderate pending, approved, rejected, and deleted comments | No |
| `/api/comments` | Public comments and new submissions | No |
| `/api/comments/*/like` | Lightweight public like actions for approved comments | No |
| `/api/admin/comments` | Admin comment listing | No |
| `/api/comment-images/*` | Serves approved or stored comment image files | No |

## Temporary Noindex Controls

- Locale pages other than `/` are draft pages until native-language review is complete. They should remain noindex, hidden from sitemap, and excluded from hreflang.
- `/cute-square-avatar-generator` and `/pixel-square-face-maker` are useful support resources, but they should remain noindex until they contain stronger standalone product value.

## Internal Links

| Source Page | Target Page | Anchor |
|---|---|---|
| Home | `/privacy-policy` | Privacy Policy |
| Home | `/terms-of-service` | Terms of Service |
| Home | `/free-avatar-maker` | Free Avatar Maker |
| Home | `/oval-face-icon-generator` | Oval Face Icon Generator |
| Home | `/pixel-art-avatar-icon-generator` | Pixel Art Avatar Icon Generator |
| Home | `/square-avatar-generator` | Square Avatar Generator |
| Home | `/gallery` | Gallery |
| Home | `/about-us` | About Us |
| Home | `/square-face-icon-generator` | Icon Guide |
| Home | `/cute-square-avatar-generator` | Cute Square Avatars |
| Home | `/pixel-square-face-maker` | Pixel Square Face Maker |
| Home | `/blog` | Blog |
| Blog | `/blog/how-to-make-a-cute-discord-profile-icon` | How to Make a Cute Discord Profile Icon |
| Blog | `/blog/discord-avatar-size-guide` | Discord Avatar Size Guide |
| Blog | `/blog/tiktok-profile-icon-ideas` | TikTok Profile Icon Ideas |
| Blog | `/blog/square-avatar-vs-round-avatar` | Square Avatar vs Round Avatar |
| Blog | `/blog/cute-profile-picture-ideas` | Cute Profile Picture Ideas |
| Blog | `/blog/best-discord-avatar-style` | Best Discord Avatar Style |
| Blog | `/blog/avatar-maker-without-signup` | Avatar Maker Without Signup |
| Blog guide | `/` | Square Face Generator |
| Blog guide | `/square-face-icon-generator` | Square Face Icon Generator Guide |
| About Us | `/` | Square Face Generator |
| Free Avatar Maker | `/` | Square Face Generator |
| Oval Face Icon Generator | `/` | Square Face Generator |
| Oval Face Icon Generator | `/square-face-icon-generator` | Square Face Icon Guide |
| Pixel Art Avatar Icon Generator | `https://www.icongenerators.net/pixelavatar.html` | Original Pixel Art Avatar Icon Generator |
| Pixel Art Avatar Icon Generator | `/` | Square Face Generator |
| Pixel Art Avatar Icon Generator | `/oval-face-icon-generator` | Oval Face Icon Generator |
| Pixel Art Avatar Icon Generator | `/pixel-square-face-maker` | Pixel Square Face Maker Guide |
| Gallery | `/` | Square Face Generator |
| Support pages | `/blog` | Square Face Icon Guides |
| Legal pages | `/` | Square Face Generator |
