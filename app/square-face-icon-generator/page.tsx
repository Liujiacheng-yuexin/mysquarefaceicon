import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const pageUrl = "https://mysquarefaceicon.com/square-face-icon-generator";

export const metadata: Metadata = {
  title: "Square Face Icon Generator Guide",
  description:
    "Learn how to use a square face icon generator, choose clear avatar details, and create cute profile icons for social, gaming, and community accounts.",
  alternates: {
    canonical: pageUrl
  },
  openGraph: {
    type: "article",
    url: pageUrl,
    title: "Square Face Icon Generator Guide",
    description:
      "A practical guide to creating clear, cute square face icons for profile pictures and online communities.",
    images: ["/og-image.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Square Face Icon Generator Guide",
    description:
      "Create better square face icons with practical avatar tips and direct links to the free generator.",
    images: ["/og-image.svg"]
  }
};

const faq = [
  {
    question: "What is a square face icon generator?",
    answer:
      "A square face icon generator is a browser tool for making compact avatar-style face icons that work well as profile pictures."
  },
  {
    question: "Should I use the Flash game or the fallback generator?",
    answer:
      "Use the Ruffle-powered game when it loads correctly because it preserves the original square face workflow. Use the fallback only when the SWF cannot load."
  },
  {
    question: "Where can I use a square face icon?",
    answer:
      "Square face icons work well for Discord, TikTok, YouTube, forums, game profiles, classroom projects, and small community accounts."
  }
];

export default function SquareFaceIconGeneratorPage() {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SiteHeader />
      <main className="resource-page">
        <a className="back-link" href="/#generator">Back to the generator</a>
        <p className="eyebrow">Square avatar guide</p>
        <h1>Square Face Icon Generator Guide</h1>
        <p className="lead">
          A square face icon generator helps you create a compact avatar that stays readable at small sizes. My Square Face Icon keeps the original game experience available through Ruffle and adds a fallback path for browsers that cannot load the game.
        </p>

        <nav className="toc-card" aria-label="Page sections">
          <a href="#why-square-icons">Why square icons work</a>
          <a href="#create">How to create one</a>
          <a href="#platforms">Where to use it</a>
          <a href="#faq">FAQ</a>
        </nav>

        <section id="why-square-icons">
          <h2>Why Square Face Icons Work Well</h2>
          <p>
            Square icons fit the default shape used by many social platforms, game profiles, and community tools. A face-focused square avatar is easy to recognize in a small chat list because the most important details are centered: eyes, mouth, hair, and expression.
          </p>
          <p>
            The best square face icons avoid too many tiny details. Clear contrast, a simple expression, and a recognizable hairstyle usually matter more than complex decoration. This is why a playful square face style can work better than a full character illustration for small profile images.
          </p>
        </section>

        <section id="create">
          <h2>How to Create a Better Square Face Icon</h2>
          <div className="steps-grid">
            <article className="info-card">
              <span className="step-number">1</span>
              <h3>Start with the expression</h3>
              <p>Choose eyes and mouth first. The expression controls the personality of the icon before colors or accessories are added.</p>
            </article>
            <article className="info-card">
              <span className="step-number">2</span>
              <h3>Keep the silhouette clear</h3>
              <p>Hair and accessories should make the avatar recognizable without covering the face or making the icon busy.</p>
            </article>
            <article className="info-card">
              <span className="step-number">3</span>
              <h3>Test it small</h3>
              <p>After saving, view the icon at a small size. If the face still reads clearly, it is ready for a profile picture.</p>
            </article>
          </div>
        </section>

        <section id="platforms">
          <h2>Best Uses for a Square Face Icon</h2>
          <div className="link-grid">
            <a href="/blog/how-to-make-a-cute-discord-profile-icon">
              <h3>Discord profile icons</h3>
              <p>Create a small icon that still looks clear in servers and direct messages.</p>
            </a>
            <a href="/cute-square-avatar-generator">
              <h3>Cute square avatars</h3>
              <p>Use softer colors and simple shapes for a friendlier character style.</p>
            </a>
            <a href="/#generator">
              <h3>Start the generator</h3>
              <p>Open the free browser tool and begin creating your square face icon.</p>
            </a>
          </div>
        </section>

        <section id="faq">
          <h2>Square Face Icon Generator FAQ</h2>
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
