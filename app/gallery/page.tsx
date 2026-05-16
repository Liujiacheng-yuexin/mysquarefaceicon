import type { CSSProperties } from "react";
import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const pageUrl = "https://mysquarefaceicon.com/gallery";

export const metadata: Metadata = {
  title: "Square Face Icon Gallery",
  description:
    "Browse original square face icon gallery ideas for cute avatars, profile pictures, gaming icons, and social media styles.",
  alternates: {
    canonical: pageUrl
  },
  openGraph: {
    type: "website",
    url: pageUrl,
    title: "Square Face Icon Gallery",
    description:
      "Original square face icon ideas for avatar expressions, colors, accessories, and profile picture styles.",
    images: ["/og-image.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Square Face Icon Gallery",
    description:
      "Browse original square face avatar ideas before making your own icon.",
    images: ["/og-image.svg"]
  }
};

const examples = [
  {
    title: "Soft Mint Smile",
    text: "A friendly profile icon style with soft color contrast and a calm expression.",
    bg: "#d8f5e1",
    hair: "#5a3420",
    cheek: "#ff9a9a",
    accent: "#19c58d",
    mood: "smile"
  },
  {
    title: "Coral Creator",
    text: "A brighter avatar idea for TikTok, YouTube, and creator profile pages.",
    bg: "#ffe1d4",
    hair: "#2f2a28",
    cheek: "#ff7a7a",
    accent: "#ff7a1a",
    mood: "smile"
  },
  {
    title: "Game Lobby Green",
    text: "A simple gaming-style icon with clear edges and a readable small-size face.",
    bg: "#d9fff0",
    hair: "#174b3f",
    cheek: "#ffb3b3",
    accent: "#08795e",
    mood: "neutral"
  },
  {
    title: "Peach Chat Icon",
    text: "A warm square avatar that works well for chat apps and small communities.",
    bg: "#fff0d1",
    hair: "#7a431e",
    cheek: "#ff9f9f",
    accent: "#f4b24f",
    mood: "smile"
  },
  {
    title: "Blue Forum Badge",
    text: "A cool, clean style for forums, classroom projects, and team profiles.",
    bg: "#dcecff",
    hair: "#233a5a",
    cheek: "#ff9eb0",
    accent: "#4d8fd6",
    mood: "neutral"
  },
  {
    title: "Berry Cute Avatar",
    text: "A playful look with a stronger accent color and a compact centered face.",
    bg: "#ffe3f1",
    hair: "#5c2240",
    cheek: "#ff8ab3",
    accent: "#d94f86",
    mood: "smile"
  },
  {
    title: "Minimal Profile Face",
    text: "A low-detail avatar idea for users who want a clean, private profile image.",
    bg: "#f5f2ea",
    hair: "#3f3028",
    cheek: "#f49b91",
    accent: "#c9bda8",
    mood: "neutral"
  },
  {
    title: "Sunny Group Icon",
    text: "A bright square face style for friend groups, light projects, and casual servers.",
    bg: "#fff3b8",
    hair: "#6a3b14",
    cheek: "#ff8f87",
    accent: "#ffaf03",
    mood: "smile"
  }
];

function avatarStyle(example: (typeof examples)[number]) {
  return {
    "--sample-bg": example.bg,
    "--sample-hair": example.hair,
    "--sample-cheek": example.cheek,
    "--sample-accent": example.accent
  } as CSSProperties;
}

export default function GalleryPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Square Face Icon Gallery",
    description:
      "Original square face icon style ideas for profile avatars and social media icons.",
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "My Square Face Icon",
      url: "https://mysquarefaceicon.com"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mysquarefaceicon.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gallery",
        item: pageUrl
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />
      <main className="resource-page">
        <a className="back-link" href="/#maker">Make your own icon</a>
        <p className="eyebrow">Original avatar ideas</p>
        <h1>Square Face Icon Gallery</h1>
        <p className="lead">
          This gallery shows original square face icon ideas made for My Square Face Icon. Use these examples as style references for expressions, colors, and profile-picture readability before making your own avatar in the generator.
        </p>

        <section>
          <h2>Browse Square Face Avatar Ideas</h2>
          <div className="gallery-showcase-grid">
            {examples.map((example) => (
              <article className="gallery-card" key={example.title}>
                <div className="avatar-sample" role="img" aria-label={`${example.title} square face icon example`} style={avatarStyle(example)}>
                  <span className="sample-hair" aria-hidden="true" />
                  <span className="sample-eye sample-eye-left" aria-hidden="true" />
                  <span className="sample-eye sample-eye-right" aria-hidden="true" />
                  <span className={`sample-mouth ${example.mood === "neutral" ? "is-neutral" : ""}`} aria-hidden="true" />
                  <span className="sample-cheek sample-cheek-left" aria-hidden="true" />
                  <span className="sample-cheek sample-cheek-right" aria-hidden="true" />
                </div>
                <h3>{example.title}</h3>
                <p>{example.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>How to Use These Gallery Examples</h2>
          <div className="steps-grid">
            <article className="info-card">
              <span className="step-number">1</span>
              <h3>Pick a mood</h3>
              <p>Decide whether the avatar should feel friendly, calm, bold, playful, or minimal before choosing parts.</p>
            </article>
            <article className="info-card">
              <span className="step-number">2</span>
              <h3>Copy the principle, not the exact look</h3>
              <p>Use the examples for color balance and readability, then create your own combination in the generator.</p>
            </article>
            <article className="info-card">
              <span className="step-number">3</span>
              <h3>Check the small preview</h3>
              <p>A good gallery-inspired avatar should still read clearly when it appears as a small social profile icon.</p>
            </article>
          </div>
        </section>

        <section>
          <h2>Create Your Own Square Face Icon</h2>
          <p>
            The examples on this page are intentionally simple because profile avatars are usually viewed at small sizes. If you want a stronger result, focus on one memorable feature: a hairstyle, glasses, a bright background, or a clear smile.
          </p>
          <div className="link-grid">
            <a href="/#maker">
              <h3>Open the generator</h3>
              <p>Start with the main square face generator and build your own icon.</p>
            </a>
            <a href="/free-avatar-maker">
              <h3>Use the free avatar maker workflow</h3>
              <p>Follow a fast process for creating profile-ready avatars.</p>
            </a>
            <a href="/cute-square-avatar-generator">
              <h3>Read cute avatar tips</h3>
              <p>Learn how to choose softer expressions, colors, and accessories.</p>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
