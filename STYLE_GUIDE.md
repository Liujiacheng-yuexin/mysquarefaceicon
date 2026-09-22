# STYLE_GUIDE.md

## Visual Direction

- Style keywords: clean, cute, practical, fast, friendly
- Mood: light tool interface with enough personality for an avatar maker
- First viewport: show the generator immediately
- Current homepage direction: compact white nav and mint hero band, with a Classic game / Simple maker choice in the core tool area. Desktop defaults to the orange-CTA classic preview; phones default to the compact Canvas maker (confirmed 2026-09-22).

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

- Keep the selected editor visible in the first viewport; present the Ruffle/SWF option as a classic Flash avatar maker game.
- Keep the game flow explicit near the game: load the player, press START, customize, and save or screenshot when the original game allows it.
- Do not present either mode as an AI generator or claim that the Simple maker recreates the classic game's artwork.
- The confirmed mobile homepage uses the existing Canvas drawing code for Simple maker, with face/hair/eyes/colors and PNG export. Desktop defaults to Classic game. Explicit choices persist across viewport changes, and Canvas settings persist across mode switches within the current page visit; no account or storage is added.
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
