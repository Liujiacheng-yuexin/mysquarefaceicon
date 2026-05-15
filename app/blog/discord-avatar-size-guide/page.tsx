import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const pageUrl = "https://mysquarefaceicon.com/blog/discord-avatar-size-guide";

const faq = [
  {
    question: "What size should I make a Discord avatar?",
    answer:
      "A square source image is the safest choice. A 512 by 512 pixel PNG is a practical working size because it gives you a clean source before Discord displays it at smaller sizes."
  },
  {
    question: "Does Discord crop profile icons into circles?",
    answer:
      "Discord often displays avatars as circles in the interface, so keep the face and important details near the center of the square source image."
  },
  {
    question: "Should I use a transparent background?",
    answer:
      "A transparent background can work, but a simple solid background is usually more reliable for small chat icons."
  }
];

export const metadata: Metadata = {
  title: "Discord Avatar Size Guide",
  description:
    "Learn practical Discord avatar size tips, square source image advice, crop-safe layout rules, and how to make a cute Discord icon.",
  alternates: {
    canonical: pageUrl
  },
  openGraph: {
    type: "article",
    url: pageUrl,
    title: "Discord Avatar Size Guide",
    description:
      "A practical guide to Discord avatar sizing, square image sources, circular crops, and readable profile icons.",
    images: ["/og-image.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Avatar Size Guide",
    description:
      "Make a Discord avatar that stays readable in servers, chats, and small profile previews.",
    images: ["/og-image.svg"]
  }
};

export default function DiscordAvatarSizeGuidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Discord Avatar Size Guide",
    description: metadata.description,
    image: "https://mysquarefaceicon.com/og-image.svg",
    author: {
      "@type": "Organization",
      name: "My Square Face Icon"
    },
    publisher: {
      "@type": "Organization",
      name: "My Square Face Icon",
      logo: {
        "@type": "ImageObject",
        url: "https://mysquarefaceicon.com/favicon.svg"
      }
    },
    datePublished: "2026-05-15",
    dateModified: "2026-05-15",
    mainEntityOfPage: pageUrl
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SiteHeader />
      <main className="resource-page article-page">
        <a className="back-link" href="/blog">Back to guides</a>
        <p className="eyebrow">Discord avatar workflow</p>
        <h1>Discord Avatar Size Guide</h1>
        <p className="lead">
          A Discord avatar should start as a clean square image, even though Discord often displays profile icons in circular crops. The safest workflow is to design the face in the center, keep the background simple, and check that the avatar still reads clearly when it becomes small.
        </p>

        <nav className="toc-card" aria-label="Article sections">
          <a href="#recommended-size">Recommended working size</a>
          <a href="#crop-safe">Circular crop safety</a>
          <a href="#small-preview">Small preview checks</a>
          <a href="#workflow">Generator workflow</a>
          <a href="#faq">FAQ</a>
        </nav>

        <section id="recommended-size">
          <h2>Recommended Discord Avatar Working Size</h2>
          <p>
            A square source image is the best starting point for a Discord avatar. A 512 by 512 pixel PNG is a practical working size because it gives you enough room to design the icon before it is displayed at smaller sizes in the Discord interface.
          </p>
          <p>
            You do not need a complicated full-body illustration for a chat avatar. A centered face, readable eyes, and a simple mouth usually work better than fine details that disappear in member lists and message rows.
          </p>
        </section>

        <section id="crop-safe">
          <h2>Keep the Avatar Crop Safe</h2>
          <p>
            Discord commonly presents avatars as circles, so corners are less important than the center. Put eyes, mouth, and hair shape near the middle of the square. Avoid placing key details at the edges, where a circular crop can make them feel cut off.
          </p>
          <div className="feature-grid">
            <article className="info-card">
              <h3>Center the face</h3>
              <p>Keep the facial expression inside the middle area so it survives circular display.</p>
            </article>
            <article className="info-card">
              <h3>Use simple backgrounds</h3>
              <p>A clean background keeps the avatar recognizable on both dark and light Discord themes.</p>
            </article>
            <article className="info-card">
              <h3>Avoid edge details</h3>
              <p>Do not rely on tiny corner decorations because they may disappear visually.</p>
            </article>
            <article className="info-card">
              <h3>Test it small</h3>
              <p>Zoom out after saving. If the face is still clear, the icon is ready.</p>
            </article>
          </div>
        </section>

        <section id="small-preview">
          <h2>Make the Icon Readable in Small Previews</h2>
          <p>
            A good Discord avatar is easy to identify in a server sidebar, a chat message, and a friend list. Strong contrast matters more than extra decoration. If you are choosing between more detail and a clearer expression, choose the clearer expression.
          </p>
          <p>
            Cute square face icons are useful here because the face is already framed tightly. You can build the character with simple features, then let the platform crop the final image without losing the main subject.
          </p>
        </section>

        <section id="workflow">
          <h2>Use the Square Face Generator for a Discord Avatar</h2>
          <div className="steps-grid">
            <article className="info-card">
              <span className="step-number">1</span>
              <h3>Open the generator</h3>
              <p>Start from the browser-based square face generator and load the avatar game.</p>
            </article>
            <article className="info-card">
              <span className="step-number">2</span>
              <h3>Create a crop-safe face</h3>
              <p>Pick eyes, mouth, hair, and colors that remain clear near the center of the icon.</p>
            </article>
            <article className="info-card">
              <span className="step-number">3</span>
              <h3>Save and check</h3>
              <p>Save when supported, then preview the result small before using it on Discord.</p>
            </article>
          </div>
        </section>

        <section>
          <h2>Related Resources</h2>
          <div className="link-grid">
            <a href="/blog/how-to-make-a-cute-discord-profile-icon">
              <h3>How to Make a Cute Discord Profile Icon</h3>
              <p>Use a step-by-step style workflow for a friendly Discord avatar.</p>
            </a>
            <a href="/#generator">
              <h3>Open the Square Face Generator</h3>
              <p>Start creating your square face icon in the browser.</p>
            </a>
            <a href="/square-face-icon-generator">
              <h3>Square Face Icon Generator Guide</h3>
              <p>Learn where square face icons work best.</p>
            </a>
          </div>
        </section>

        <section id="faq">
          <h2>Discord Avatar Size FAQ</h2>
          <div className="faq-list">
            {faq.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
