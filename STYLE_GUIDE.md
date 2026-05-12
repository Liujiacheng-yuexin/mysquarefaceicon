# STYLE_GUIDE.md

## Visual Direction

- Style keywords: clean, cute, practical, fast, friendly
- Mood: light tool interface with enough personality for an avatar maker
- First viewport: show the generator immediately
- Current homepage direction: US-style cute tool page with a compact white nav, mint hero band, orange CTA, and the SWF preview as the main visual.

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

- Keep the Ruffle/SWF game centered in the first viewport. The Canvas generator should only appear as fallback.
- Cards should use 8px border radius unless a control needs to be circular.
- Avoid large decorative gradients, blobs, and empty hero sections.
- Keep text readable and prevent horizontal overflow on mobile.

## Components

- Buttons: clear icon plus label when the action benefits from a symbol.
- Controls: segmented buttons for option sets, color inputs for colors.
- FAQ: native details/summary for accessibility and no JavaScript dependency.
- Footer: simple legal and sitemap links.
