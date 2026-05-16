import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const pageUrl = "https://mysquarefaceicon.com/square-avatar-generator";

const faq = [
  {
    question: "What is a square avatar generator?",
    answer:
      "A square avatar generator helps you create a profile image from a square source file, usually for social, gaming, forum, or community accounts."
  },
  {
    question: "Is a square avatar useful if apps crop images into circles?",
    answer:
      "Yes. Many platforms accept square uploads before cropping them into circles. A square source image gives you predictable spacing and a safer centered face."
  },
  {
    question: "How is this different from a square face icon generator?",
    answer:
      "A square avatar generator is the broader workflow for making a profile image. A square face icon generator is a more specific style focused on a face-centered square icon."
  },
  {
    question: "Can I make a square avatar without signup?",
    answer:
      "Yes. My Square Face Icon is designed as a browser-based avatar workflow that does not require account creation before you start."
  }
];

export const metadata: Metadata = {
  title: "Square Avatar Generator for Cute Profile Icons",
  description:
    "Use a square avatar generator workflow to create cute profile icons for Discord, TikTok, YouTube, games, forums, and online communities.",
  alternates: {
    canonical: pageUrl
  },
  openGraph: {
    type: "article",
    url: pageUrl,
    title: "Square Avatar Generator for Cute Profile Icons",
    description:
      "Learn how square avatars work as profile images and start creating a cute square face icon in the browser.",
    images: ["/og-image.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Square Avatar Generator for Cute Profile Icons",
    description:
      "Create and use square avatars for social, gaming, and community profiles.",
    images: ["/og-image.svg"]
  }
};

export default function SquareAvatarGeneratorPage() {
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
        name: "Square Avatar Generator",
        item: pageUrl
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />
      <main className="resource-page">
        <a className="back-link" href="/#maker">Open the generator</a>
        <p className="eyebrow">Square profile images</p>
        <h1>Square Avatar Generator for Cute Profile Icons</h1>
        <p className="lead">
          A square avatar generator helps you create a clean profile image from a square source file. My Square Face Icon focuses on cute square face avatars that are easy to recognize in chat lists, profile cards, game lobbies, and social media comments.
        </p>

        <nav className="toc-card" aria-label="Page sections">
          <a href="#why-square">Why square avatars work</a>
          <a href="#workflow">Avatar workflow</a>
          <a href="#platforms">Best platforms</a>
          <a href="#faq">FAQ</a>
        </nav>

        <section id="why-square">
          <h2>Why Square Avatars Work Well</h2>
          <p>
            A square source image is predictable. It gives you even spacing on every side and keeps the face, expression, hair, and accessories centered. Even when a platform displays the final image as a circle, the square upload is still the foundation of the crop.
          </p>
          <p>
            This is why a square face avatar is practical for small profile slots. The image does not need a detailed background or full-body pose. It needs a readable face, a clear silhouette, and enough contrast to survive resizing.
          </p>
        </section>

        <section id="workflow">
          <h2>Simple Square Avatar Generator Workflow</h2>
          <div className="steps-grid">
            <article className="info-card">
              <span className="step-number">1</span>
              <h3>Start with the profile use</h3>
              <p>Decide whether the avatar is for Discord, TikTok, YouTube, a game account, or a community project.</p>
            </article>
            <article className="info-card">
              <span className="step-number">2</span>
              <h3>Keep the face centered</h3>
              <p>Place the most important expression details in the middle so the avatar survives circular crops.</p>
            </article>
            <article className="info-card">
              <span className="step-number">3</span>
              <h3>Use one strong identity detail</h3>
              <p>Hair, glasses, a hat, blush, or a background color can make the avatar memorable without making it busy.</p>
            </article>
          </div>
        </section>

        <section id="platforms">
          <h2>Where to Use a Square Avatar</h2>
          <div className="feature-grid">
            <article className="info-card">
              <h3>Discord</h3>
              <p>Use a centered face and strong contrast so the icon stays clear in member lists and chat rows.</p>
            </article>
            <article className="info-card">
              <h3>TikTok</h3>
              <p>Choose a simple, memorable color combination that reads quickly on mobile profile previews.</p>
            </article>
            <article className="info-card">
              <h3>YouTube</h3>
              <p>Keep the avatar recognizable in comments, channel cards, and small profile placements.</p>
            </article>
            <article className="info-card">
              <h3>Games and forums</h3>
              <p>Use a playful square face as a lightweight identity for lobbies, clans, teams, and community accounts.</p>
            </article>
            <article className="info-card">
              <h3>Classroom projects</h3>
              <p>Square avatars can give students or groups friendly icons without requiring personal photos.</p>
            </article>
            <article className="info-card">
              <h3>Creative placeholders</h3>
              <p>Use square avatars as early character concepts, mood board details, or private profile badges.</p>
            </article>
          </div>
        </section>

        <section>
          <h2>Start With My Square Face Icon</h2>
          <p>
            If you want a cute, face-centered square avatar, start with the main generator and then compare your result with the gallery examples. The best square avatars are usually simple: one expression, one color direction, and one memorable detail.
          </p>
          <div className="link-grid">
            <a href="/#maker">
              <h3>Open the square face generator</h3>
              <p>Start creating a square face avatar in the browser.</p>
            </a>
            <a href="/free-avatar-maker">
              <h3>Free avatar maker workflow</h3>
              <p>Use a broader avatar-making guide without signup or design software.</p>
            </a>
            <a href="/gallery">
              <h3>Browse square face icon ideas</h3>
              <p>Use original gallery examples for color and expression inspiration.</p>
            </a>
          </div>
        </section>

        <section id="faq">
          <h2>Square Avatar Generator FAQ</h2>
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
