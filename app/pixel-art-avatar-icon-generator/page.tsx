import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ExternalLink, Gamepad2, Monitor, ShieldCheck, Sparkles, Wrench } from "lucide-react";

const pageUrl = "https://mysquarefaceicon.com/pixel-art-avatar-icon-generator";
const originalUrl = "https://www.icongenerators.net/pixelavatar.html";
const pageTitle = "Pixel Art Avatar Icon Generator - Embedded Chibi Icon Maker";
const pageDescription =
  "Use the embedded Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons, with source credit, play tips, and browser guidance.";

const howToSteps = [
  {
    title: "Open the embedded generator",
    text: "Wait for the icongenerators.net pixel avatar maker to load in the frame above. If it does not appear, use the original-page button."
  },
  {
    title: "Choose pixel character parts",
    text: "Use the generator controls to mix face details, hair, clothes, colors, and small accessories into a chibi pixel character."
  },
  {
    title: "Save or copy your result",
    text: "Follow the controls inside the original generator. If a browser blocks a feature, open the original page in a new tab."
  }
];

const features = [
  {
    title: "External original tool",
    text: "The generator is embedded from icongenerators.net, with visible source credit and a direct link to the original page."
  },
  {
    title: "Pixel art avatar style",
    text: "The tool focuses on small chibi character icons with a retro pixel-art look."
  },
  {
    title: "Works beside our face games",
    text: "Use it as a pixel-avatar companion to Square Face Generator and Oval Face Icon Generator."
  },
  {
    title: "No local copy of assets",
    text: "This page does not copy the external site files, artwork, comments, or generator source."
  },
  {
    title: "Original page fallback",
    text: "If browser security blocks the iframe, you can still open the generator directly on icongenerators.net."
  },
  {
    title: "Desktop recommended",
    text: "Avatar generators with detailed controls are usually easier to use on desktop or landscape tablet screens."
  }
];

const tips = [
  "Use a desktop browser when editing detailed pixel parts",
  "Keep the original page button available if the iframe fails",
  "Try a simple color palette so the avatar stays readable at small sizes",
  "Check the icon at profile-picture size before using it",
  "Respect the original creator and link back when sharing the tool"
];

const faq = [
  {
    question: "What is Pixel Art Avatar Icon Generator?",
    answer:
      "Pixel Art Avatar Icon Generator is an external pixel-style chibi character icon maker from icongenerators.net."
  },
  {
    question: "Is this tool owned by My Square Face Icon?",
    answer:
      "No. This page embeds the external generator with source attribution. The original tool and its assets remain on icongenerators.net."
  },
  {
    question: "Why might the embedded generator not load?",
    answer:
      "Some browsers, extensions, network filters, or iframe security settings can block embedded pages. Use the Open Original Page button if that happens."
  },
  {
    question: "Can a VPN, proxy, or network filter stop the generator from opening?",
    answer:
      "Yes. VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters may block the external embedded page. Try turning off the proxy for this page, switching networks, or opening the original page directly."
  },
  {
    question: "Does this page copy the generator assets?",
    answer:
      "No. The external page is loaded by iframe, so this site does not host or copy the original generator files."
  },
  {
    question: "Can I use it on mobile?",
    answer:
      "It may work, but detailed avatar controls are usually easier on desktop or in landscape mode."
  }
];

export const metadata: Metadata = {
  title: {
    absolute: pageTitle
  },
  description: pageDescription,
  alternates: {
    canonical: pageUrl
  },
  openGraph: {
    type: "website",
    url: pageUrl,
    title: pageTitle,
    description: pageDescription,
    siteName: "My Square Face Icon",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Pixel art avatar icon generator embedded tool page"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/og-image.svg"]
  }
};

export default function PixelArtAvatarIconGeneratorPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Pixel Art Avatar Icon Generator",
    description: pageDescription,
    url: pageUrl,
    mainEntity: {
      "@type": "WebApplication",
      name: "Pixel Art Avatar Icon Generator",
      url: originalUrl,
      applicationCategory: "DesignApplication",
      operatingSystem: "Web browser",
      provider: {
        "@type": "Organization",
        name: "icongenerators.net",
        url: "https://www.icongenerators.net/"
      }
    }
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Square Face Generator",
        item: "https://mysquarefaceicon.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pixel Art Avatar Icon Generator",
        item: pageUrl
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />
      <main>
        <section className="game-hero external-game-hero">
          <div className="game-hero-inner">
            <div className="game-hero-copy">
              <p className="eyebrow">Embedded external avatar maker</p>
              <h1>Pixel Art Avatar Icon Generator</h1>
              <p className="hero-text">
                Use the embedded Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel
                icons. This page keeps the original source visible and adds quick guidance for desktop and mobile users.
              </p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="hero-primary-link" href="#embedded-generator">
                  <Gamepad2 aria-hidden="true" size={20} />
                  Use Embedded Generator
                </a>
                <a className="hero-secondary-link" href={originalUrl} target="_blank" rel="noopener noreferrer">
                  Open Original
                  <ExternalLink aria-hidden="true" size={17} />
                </a>
              </div>
            </div>
            <div className="nostalgia-card external-source-card">
              <ShieldCheck aria-hidden="true" size={30} />
              <div>
                <strong>Source-first embed</strong>
                <p>
                  The generator below is loaded from icongenerators.net. If your browser blocks embedded pages, open the
                  original tool directly.
                </p>
              </div>
              <div className="nostalgia-tags" aria-label="Tool tags">
                <span>Pixel Avatar</span>
                <span>External Tool</span>
                <span>Chibi Icon</span>
              </div>
            </div>
          </div>
        </section>

        <section className="game-player-section" id="embedded-generator">
          <div className="game-card external-embed-card">
            <div className="game-card-header">
              <div>
                <p className="tool-card-kicker">icongenerators.net embed</p>
                <h2>Use Pixel Art Avatar Icon Generator Online</h2>
              </div>
              <a className="tool-card-badge badge-link" href={originalUrl} target="_blank" rel="noopener noreferrer">
                Original Page
                <ExternalLink aria-hidden="true" size={14} />
              </a>
            </div>
            <div className="external-embed-frame">
              <iframe
                src={originalUrl}
                title="Embedded Pixel Art Avatar Icon Generator from icongenerators.net"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
                allow="clipboard-write; fullscreen"
              >
                Open the Pixel Art Avatar Icon Generator on icongenerators.net.
              </iframe>
            </div>
            <div className="external-embed-note">
              <Wrench aria-hidden="true" size={18} />
              <p>
                If the embedded generator stays blank, your browser or the original site may be blocking iframe loading.
                VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters can also stop
                the external page from opening. Try turning off the proxy for this page, switching networks, or use{" "}
                <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                  the original page
                </a>{" "}
                instead.
              </p>
            </div>
          </div>
        </section>

        <section className="content-band" id="what-is">
          <div className="section-heading">
            <p className="eyebrow">About the external tool</p>
            <h2>What Is Pixel Art Avatar Icon Generator?</h2>
            <p className="section-intro">
              Pixel Art Avatar Icon Generator is an external chibi-style pixel avatar maker from icongenerators.net. It
              is useful when you want a small pixel character icon rather than a simple square or oval face icon.
            </p>
          </div>
        </section>

        <section className="content-band alt-band" id="how-to-use">
          <div className="section-heading">
            <p className="eyebrow">Three simple steps</p>
            <h2>How to Use the Embedded Pixel Avatar Maker</h2>
          </div>
          <div className="steps-grid">
            {howToSteps.map((step, index) => (
              <article className="info-card" key={step.title}>
                <span className="step-number">Step {index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-band" id="features">
          <div className="section-heading">
            <p className="eyebrow">Why this page exists</p>
            <h2>Pixel Art Avatar Icon Generator Features</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="info-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-band playful-band">
          <div className="section-heading">
            <p className="eyebrow">Best experience</p>
            <h2>Tips for Using Pixel Avatar Generators</h2>
          </div>
          <ul className="tips-list">
            {tips.map((tip) => (
              <li key={tip}>
                <Monitor aria-hidden="true" size={18} />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="content-band alt-band" id="faq">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>Pixel Art Avatar Icon Generator FAQ</h2>
          </div>
          <div className="faq-list">
            {faq.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="content-band">
          <div className="section-heading">
            <p className="eyebrow">Related tools</p>
            <h2>More Avatar Games and Guides</h2>
          </div>
          <div className="related-grid">
            <a className="related-card" href="/">
              <Sparkles aria-hidden="true" size={20} />
              <h3>Square Face Generator</h3>
              <p>Play the classic square face Flash avatar maker on this site.</p>
            </a>
            <a className="related-card" href="/oval-face-icon-generator">
              <Sparkles aria-hidden="true" size={20} />
              <h3>Oval Face Icon Generator</h3>
              <p>Try a rounded-face companion game with oval profile icon styling.</p>
            </a>
            <a className="related-card" href="/pixel-square-face-maker">
              <Sparkles aria-hidden="true" size={20} />
              <h3>Pixel Square Face Maker Guide</h3>
              <p>Read practical pixel-inspired avatar tips for square profile icons.</p>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
