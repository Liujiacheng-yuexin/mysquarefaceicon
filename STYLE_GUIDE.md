# STYLE_GUIDE.md

## Visual Direction

- Style keywords: clean, cute, practical, fast, friendly
- Mood: light tool interface with enough personality for an avatar maker
- First viewport: show the generator immediately
- Current homepage direction: US-style retro Flash game page with a compact white nav, mint hero band, orange CTA, and the self-hosted Ruffle/SWF player as the main visual.

## Colors

- Primary: `#19c58d`
- Primary dark: `#08795e`
- Accent: `#ff7a1a`
- Accent dark: `#c75a08`
- Hero mint: `#d8f5e1`
- Background: `#fffaf1`
- Surface: `#fffdf8`
- Text: `#3f3028`
- Muted text: `#6f6158`
- Border: `#efd8b7`

## Layout

- Keep the Ruffle/SWF game centered near the first viewport and treat it as a classic Flash avatar maker game.
- Keep the game flow explicit near the game: load the player, press START, customize, and save or screenshot when the original game allows it.
- Do not present the page as an AI generator or a rebuilt modern generator.
- The HTML5 Canvas maker may remain available in the codebase for future fallback work, but the public homepage should prioritize the classic Flash game player.
- Cards should use 8px border radius unless a control needs to be circular.
- Avoid large decorative gradients, blobs, and empty hero sections.
- Keep text readable and prevent horizontal overflow on mobile.

## Components

- Buttons: clear icon plus label when the action benefits from a symbol.
- Controls: segmented buttons for option sets, color inputs for colors.
- Export controls: offer practical sizes first (`512`, `256`, `128`) and show small/circular previews so users understand profile cropping.
- FAQ: native details/summary for accessibility and no JavaScript dependency.
- Footer: simple user-facing navigation and legal links. Keep `/sitemap.xml` available for crawlers, but do not show it as a visible footer link.
- Mobile navigation: keep the first viewport compact by showing a short Start button and collapsing secondary links into a menu.
