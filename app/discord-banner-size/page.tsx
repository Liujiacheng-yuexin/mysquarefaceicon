import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GameBreadcrumb from "@/components/game/GameBreadcrumb";
import DiscordBannerEditor from "@/components/DiscordBannerEditor";
import { BANNER_DESCRIPTION, BANNER_TITLE, BANNER_URL, CHECKED_DATE, CHECKED_LABEL, LIMITS, PRESETS, SOURCES } from "@/lib/discord-banner/config";
import styles from "./banner.module.css";

export const metadata: Metadata = {
  title: { absolute: BANNER_TITLE }, description: BANNER_DESCRIPTION,
  alternates: { canonical: BANNER_URL }, robots: { index: true, follow: true },
  openGraph: { type: "website", url: BANNER_URL, title: BANNER_TITLE, description: BANNER_DESCRIPTION,
    images: [{ url: "/discord-banner-size-og.png", width: 1200, height: 630, alt: "Discord banner size guide: profile 680 × 240, server 960 × 540, invite 1920 × 1080" }] },
  twitter: { card: "summary_large_image", title: BANNER_TITLE, description: BANNER_DESCRIPTION, images: ["/discord-banner-size-og.png"] }
};

const [profile, server, invite] = PRESETS;
const dimensions = (p: (typeof PRESETS)[number]) => `${p.width} × ${p.height}`;
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": `${BANNER_URL}#page`, url: BANNER_URL, name: BANNER_TITLE,
      description: BANNER_DESCRIPTION, inLanguage: "en", dateModified: CHECKED_DATE,
      isPartOf: { "@type": "WebSite", name: "My Square Face Icon", url: "https://mysquarefaceicon.com" } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mysquarefaceicon.com" },
      { "@type": "ListItem", position: 2, name: "Guides & Resources", item: "https://mysquarefaceicon.com/blog" },
      { "@type": "ListItem", position: 3, name: "Discord Banner Size", item: BANNER_URL }
    ] }
  ]
};

export default function DiscordBannerSizePage() {
  return <>
    <SiteHeader mobileStartHref="#banner-editor-title" mobileStartLabel="Resize" />
    <main className={styles.page}>
      <GameBreadcrumb reloadDocument items={[{ label: "Home", href: "/" }, { label: "Guides & Resources", href: "/blog" }, { label: "Discord Banner Size" }]} />
      <div className={styles.intro}>
        <h1>Discord Banner Size</h1>
        <p>Discord banner size: profiles require at least {dimensions(profile)} px; server banners are recommended at {dimensions(server)} px or larger; invite backgrounds use exactly {dimensions(invite)} px. Crop or fit a static image below.</p>
        <p className={styles.checked}>Last checked: <time dateTime={CHECKED_DATE}>{CHECKED_LABEL}</time>. <a href="#profile-source-difference">680 × 240 vs 600 × 240: official source notes</a>.</p>
      </div>

      <DiscordBannerEditor />

      <section className={styles.content} aria-labelledby="specifications">
        <h2 id="specifications">Discord banner size requirements at a glance</h2>
        <p>These are separate upload surfaces. A member’s per-server profile is their personal identity inside one server; the server banner belongs to the server and appears above its channel list. A server profile’s banner color is also a separate setting from uploading these image files.</p>
        <table className={styles.table}>
          <thead><tr><th scope="col">Where it appears</th><th scope="col">Discord’s size guidance</th><th scope="col">Formats and file size</th><th scope="col">Access</th></tr></thead>
          <tbody>
            <tr><th scope="row">Global profile banner</th><td>Minimum {dimensions(profile)} px. This tool exports that size.<a href={SOURCES.profile.url}>{SOURCES.profile.name}</a><small>Updated {SOURCES.profile.updated}</small></td><td>PNG, JPG or animated GIF; less than 10 MB.</td><td>Full Nitro</td></tr>
            <tr><th scope="row">Per-server member profile</th><td>Recommended minimum 600 × 240 px. A separate preset is not included in this version.<a href={SOURCES.member.url}>{SOURCES.member.name}</a><small>Updated {SOURCES.member.updated}</small></td><td>PNG, JPG or animated GIF; less than 10 MB.</td><td>Full Nitro</td></tr>
            <tr><th scope="row">Server banner</th><td>Recommended at least {dimensions(server)} px, 16:9. {dimensions(invite)} is an example that Discord can resize, not a maximum.<a href={SOURCES.server.url}>{SOURCES.server.name}</a></td><td>Static PNG/JPEG; animated GIF where eligible. The linked banner documentation does not specify a byte limit.<a href={SOURCES.guild.url}>Guild API format reference</a></td><td>Usually Level 2 for static; Level 3 for animated. Server management permissions required.</td></tr>
            <tr><th scope="row">Server invite background</th><td>Exactly {dimensions(invite)} px in the documentation.<a href={SOURCES.invite.url}>{SOURCES.invite.name}</a><small>Updated {SOURCES.invite.updated}</small></td><td>JPG or PNG. No GIF or animation. The linked documentation does not specify a byte limit.</td><td>Level 1 and above</td></tr>
          </tbody>
        </table>
        <p className={styles.note}>The figures describe the cited public documents, checked on {CHECKED_LABEL}; they are not results of a signed-in Discord upload test. Source update dates are document dates, not confirmed product change dates.</p>
      </section>

      <section className={styles.content} id="profile-source-difference">
        <h2>Why do official profile guides say both 680 × 240 and 600 × 240?</h2>
        <p><a href={SOURCES.profile.url}>Custom Profiles</a> lists a minimum of {dimensions(profile)} px for the global profile banner. <a href={SOURCES.member.url}>Per-Server Profiles</a> still recommends a minimum of 600 × 240 px for a member’s server-specific profile. We keep the distinction visible instead of calling either number a universal rule or declaring 600 × 240 obsolete.</p>
        <p>The profile preset here uses {dimensions(profile)} as a starting canvas. That minimum does not mean every image must have exactly those dimensions. The arithmetic ratios are 17:6 for 680:240, 5:2 for 600:240, and 16:9 for the server and invite presets. A canvas ratio does not establish a universal display ratio: desktop and mobile clients may show different portions of your banner.</p>
        <p>For an avatar beside your banner, use the separate <a href="/blog/discord-avatar-size-guide">Discord avatar size guide</a>. Avatar and banner files serve different positions and should be prepared separately.</p>
      </section>

      <section className={styles.content}>
        <h2>Crop your banner or fit the whole image</h2>
        <p>Choose the banner type first, then select one static PNG or JPG. The source dimensions shown after loading account for orientation, including mirrored JPEG photos. Choose <strong>Crop to fill</strong> to cover the canvas without stretching the image. Zoom and the horizontal and vertical sliders decide which part remains; the sliders work with keyboard arrow keys, too.</p>
        <p>Choose <strong>Fit whole image</strong> when you want to keep every edge. It centers the complete image and fills the surrounding space with your background color. PNG can leave that space transparent. JPG always fills transparent pixels and empty space with the selected color, white by default. Fit does not add a zoom that would cut off the image.</p>
        <p>A small source can still be exported, but enlargement may soften it. Start with a larger original when text or fine detail matters. Changing canvas dimensions cannot recover missing detail, and Discord may resize or compress the image again. Check the result in the actual clients your community uses.</p>
        <p>The download becomes available after the encoded file’s dimensions, format and byte count have been checked. The size beside the button describes that same file. JPG quality ranges from {LIMITS.jpegQuality.min * 100}% to {LIMITS.jpegQuality.max * 100}%, starting at {LIMITS.jpegQuality.default * 100}%; these are tool settings, not official quality recommendations.</p>
      </section>

      <section className={styles.content}>
        <h2>Nitro, Server Boosts and upload restrictions</h2>
        <p>You can edit and download here without a Discord account or subscription. Uploading the result to Discord still requires the relevant account or server feature; this independent tool does not unlock those features.</p>
        <ul>
          <li><a href={SOURCES.nitro.url}>Full Nitro</a> includes personal profile banners and per-server profiles. Nitro Basic does not include the same profile customization. Having personal Nitro does not automatically make a server Level 2.</li>
          <li>The <a href={SOURCES.boosts.url}>Server Boosting FAQ</a> lists Level 1 at 2 Boosts, Level 2 at 7, and Level 3 at 14 counted toward levels. Invite backgrounds, static server banners and animated server banners belong to those respective tiers.</li>
          <li><a href={SOURCES.server.url}>Discord Partner servers</a> can have the server banner perk without buying a Boosting Level. Server owners or members with Manage Server or Administrator permission can change the server banner.</li>
        </ul>
        <p>The 10 MB restriction cited for profile banners must not be applied to every Discord banner surface. Ordinary attachment upload limits also do not replace banner-specific rules. This editor accepts up to {LIMITS.inputBytes.toLocaleString("en-US")} input bytes and requires every output to be less than {LIMITS.outputBytesExclusive.toLocaleString("en-US")} bytes as its own conservative resource policy.</p>
        <p>For server banners, Discord suggests keeping the top 48 px visually simple so the server title is readable. That advice is specific to that surface, not an official safe area for all banners. On invite backgrounds, the central invitation card covers part of the picture: open your real invite link in a private window to check the placement.</p>
      </section>

      <section className={`${styles.content} ${styles.faq}`} aria-labelledby="banner-faq">
        <h2 id="banner-faq">Discord banner size FAQ</h2>
        <details><summary>What size should a Discord profile banner be?</summary><p>The current <a href={SOURCES.profile.url}>Custom Profiles guide</a> gives {dimensions(profile)} px as the minimum. It does not say that larger uploads must be exactly this size. This tool uses that minimum for its profile output preset.</p></details>
        <details><summary>Why do some guides say 600 × 240?</summary><p>The official <a href={SOURCES.member.url}>Per-Server Profiles guide</a> recommends that minimum for a member’s server-specific profile. See the <a href="#profile-source-difference">source comparison</a>; a single 5:2 rule would hide the difference.</p></details>
        <details><summary>Is a profile banner the same as a server banner?</summary><p>No. A profile banner belongs to a person, including their identity in a specific server. A server banner appears above the channel list; an invite background sits behind an invitation. Select the matching surface before editing.</p></details>
        <details><summary>Do I need Nitro or Server Boosts?</summary><p>Discord’s personal profile banner feature requires full Nitro. Servers usually need Level 2 for static banners, Level 3 for animated banners, and Level 1 for invite backgrounds; Partner server exceptions exist. Editing and downloading here requires neither.</p></details>
        <details><summary>Why does my banner look cropped or blurry?</summary><p>Crop removes edges to fill the canvas; Fit preserves the whole source with space around it. Enlarging a small image softens detail. Client layouts, overlapping interface elements and Discord’s own image processing can also change the result. Review your final upload on desktop and mobile.</p></details>
        <details><summary>Can this tool resize animated banners?</summary><p>No. This version rejects GIF, APNG, WebP, SVG, HEIC and other unsupported inputs, including files renamed to PNG or JPG. It does not silently export the first frame. Discord’s support for GIF in eligible profile and server banners does not mean this editor supports animation. Invite backgrounds do not support animation.</p></details>
        <details><summary>Does my image get uploaded or saved?</summary><p>The editor processes the file locally in your browser and holds it for this page visit. It does not upload your image, save it to browser storage, or send its contents, name or metadata to analytics. Remove image clears the editor; downloading saves a file only when you choose to do so. Export does not copy the original EXIF or GPS blocks; this is not a guarantee about every possible metadata field in every browser.</p></details>
      </section>

      <section className={styles.content} aria-labelledby="banner-sources">
        <h2 id="banner-sources">Official sources and review dates</h2>
        <p>Requirements last checked on <time dateTime={CHECKED_DATE}>{CHECKED_LABEL}</time>. Recheck the relevant Discord document and upload screen before relying on an entitlement or limit.</p>
        <ul className={styles.sourceNotes}>{Object.values(SOURCES).map(source => <li key={source.url}><a href={source.url}>{source.name}</a>{"updated" in source ? ` — document updated ${source.updated}.` : ` — checked ${CHECKED_LABEL}; no update date recorded here.`}</li>)}</ul>
      </section>
      <section className={styles.content}>
        <h2>Finish your Discord profile</h2>
        <nav className={styles.related} aria-label="Related avatar guides">
          <a href="/blog/discord-avatar-size-guide">Discord avatar size guide</a>
          <a href="/blog/best-discord-avatar-style">Choose a Discord avatar style</a>
          <a href="/#maker">Open the square face avatar maker</a>
        </nav>
      </section>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <SiteFooter />
  </>;
}
