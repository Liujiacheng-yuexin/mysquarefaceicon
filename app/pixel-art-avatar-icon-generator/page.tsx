import type { Metadata } from "next";
import GalleryPreview from "@/components/GalleryPreview";
import GameSidebar, { type GameSidebarItem } from "@/components/GameSidebar";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ExternalLink, Gamepad2, Monitor, Sparkles, Wrench } from "lucide-react";

const pageUrl = "https://mysquarefaceicon.com/pixel-art-avatar-icon-generator";
const originalUrl = "https://www.icongenerators.net/pixelavatar.html";
const pageTitle = "Pixel Art Avatar Icon Generator - Open the Original Chibi Icon Maker";
const pageDescription =
  "Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons, with source credit, play tips, and browser guidance.";

const howToSteps = [
  {
    title: "Open the original generator",
    text: "Use the original-page button to open the icongenerators.net pixel avatar maker in a new tab."
  },
  {
    title: "Choose pixel character parts",
    text: "Use the generator controls to mix face details, hair, clothes, colors, and small accessories into a chibi pixel character."
  },
  {
    title: "Save or copy your result",
    text: "Follow the controls inside the original generator. If a browser blocks a feature, try a desktop browser or another network."
  }
];

const features = [
  {
    title: "External original tool",
    text: "The generator is provided by icongenerators.net, with visible source credit and a direct link to the original page."
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
    title: "Original page access",
    text: "The original site currently blocks iframe embedding, so the safest path is opening the generator directly."
  },
  {
    title: "Desktop recommended",
    text: "Avatar generators with detailed controls are usually easier to use on desktop or landscape tablet screens."
  }
];

const tips = [
  "Use a desktop browser when editing detailed pixel parts",
  "Open the original generator in a new tab for the most reliable experience",
  "Try a simple color palette so the avatar stays readable at small sizes",
  "Check the icon at profile-picture size before using it",
  "Respect the original creator and link back when sharing the tool"
];

const pixelGalleryPreviewItems = [
  {
    title: "Gamer",
    src: "/game-face-samples/gamer.webp",
    alt: "Pixel-friendly gamer avatar preview",
    likes: 110
  },
  {
    title: "Cute",
    src: "/game-face-samples/cute.webp",
    alt: "Cute avatar gallery preview",
    likes: 120
  },
  {
    title: "Retro",
    src: "/game-face-samples/retro.webp",
    alt: "Retro avatar gallery preview",
    likes: 98
  },
  {
    title: "Funny",
    src: "/game-face-samples/funny.webp",
    alt: "Funny avatar gallery preview",
    likes: 76
  },
  {
    title: "Minimal",
    src: "/game-face-samples/minimal.webp",
    alt: "Minimal avatar gallery preview",
    likes: 64
  },
  {
    title: "Classic",
    src: "/game-face-samples/classic.webp",
    alt: "Classic avatar gallery preview",
    likes: 85
  }
];

const pixelSidebarItems: GameSidebarItem[] = [
  {
    title: "Square Face Generator",
    text: "Play the original classic Flash square face avatar maker.",
    href: "/",
    imageSrc: "/square-face-icon.png",
    imageAlt: "Square Face Generator preview"
  },
  {
    title: "Oval Face Icon Generator",
    text: "Create cute oval face icons with a rounded avatar game.",
    href: "/oval-face-icon-generator",
    imageSrc: "/games/oval-face-icon.png",
    imageAlt: "Oval Face Icon Generator preview"
  },
  {
    title: "Free Avatar Maker",
    text: "Use a fast avatar workflow for profile pictures and icons.",
    href: "/free-avatar-maker",
    imageSrc: "/game-face-samples/ideas/discord-pfp.webp",
    imageAlt: "Free avatar maker preview"
  },
  {
    title: "Square Avatar Guide",
    text: "Learn how to create the best square face icons.",
    href: "/square-face-icon-generator",
    imageSrc: "/game-face-samples/ideas/simple-icon-face.webp",
    imageAlt: "Square avatar guide preview"
  },
  {
    title: "Gallery",
    text: "Explore approved community face icon creations.",
    href: "/gallery",
    imageSrc: "/game-face-samples/ideas/cute-square-face.webp",
    imageAlt: "Community gallery preview"
  },
  {
    title: "Blog Guide",
    text: "Read tips and tutorials about avatar making.",
    href: "/blog",
    imageSrc: "/game-face-samples/ideas/favicon-style.webp",
    imageAlt: "Avatar blog guide preview"
  }
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
      "No. This page links to the external generator with source attribution. The original tool and its assets remain on icongenerators.net."
  },
  {
    question: "Why does the embedded generator not load?",
    answer:
      "The original site currently sends browser security headers that allow the page to be framed only by itself. Use the Open Original Page button to launch it directly."
  },
  {
    question: "Can a VPN, proxy, or network filter stop the generator from opening?",
    answer:
      "Yes. VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters may block the external embedded page. Try turning off the proxy for this page, switching networks, or opening the original page directly."
  },
  {
    question: "Does this page copy the generator assets?",
    answer:
      "No. This site does not host or copy the original generator files, artwork, comments, or source code."
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
        <section className="game-station external-game-hero" id="external-generator">
          <div className="game-station-grid">
            <div className="game-station-main">
              <div className="game-title-block">
              <p className="eyebrow">Embedded external avatar maker</p>
              <h1>Pixel Art Avatar Icon Generator</h1>
              <p className="hero-text">
                Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons. This
                page keeps the original source visible and adds quick guidance for desktop and mobile users.
              </p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="hero-primary-link" href={originalUrl} target="_blank" rel="noopener noreferrer">
                  <Gamepad2 aria-hidden="true" size={20} />
                  Open Generator
                </a>
                <a className="hero-secondary-link" href={originalUrl} target="_blank" rel="noopener noreferrer">
                  Open Original
                  <ExternalLink aria-hidden="true" size={17} />
                </a>
              </div>
            </div>
            <div className="game-card external-embed-card station-game-card">
            <div className="game-card-header">
              <div>
                <p className="tool-card-kicker">icongenerators.net original tool</p>
                <h2>Open Pixel Art Avatar Icon Generator Online</h2>
                <p className="tool-card-description">
                  The original generator is hosted by icongenerators.net. Their current security headers prevent iframe
                  embedding, so this page sends players to the working original tool.
                </p>
              </div>
              <a className="tool-card-badge badge-link" href={originalUrl} target="_blank" rel="noopener noreferrer">
                Original Page
                <ExternalLink aria-hidden="true" size={14} />
              </a>
            </div>
            <div className="external-open-panel">
              <div className="external-open-icon" aria-hidden="true">
                <Gamepad2 size={42} />
              </div>
              <div>
                <p className="eyebrow">Iframe blocked by the original site</p>
                <h3>Open the generator in a new tab</h3>
                <p>
                  icongenerators.net now sends <code>X-Frame-Options: SAMEORIGIN</code> and{" "}
                  <code>{`frame-ancestors 'self'`}</code>, so browsers refuse to show it inside another website. Use the
                  direct link below for the working generator.
                </p>
                <a className="hero-primary-link" href={originalUrl} target="_blank" rel="noopener noreferrer">
                  Open Pixel Art Avatar Icon Generator
                  <ExternalLink aria-hidden="true" size={18} />
                </a>
              </div>
            </div>
            <div className="external-embed-note">
              <Wrench aria-hidden="true" size={18} />
              <p>
                VPNs, proxy tools, privacy extensions, school networks, company networks, or DNS filters can also stop
                the external page from opening. Try turning off the proxy for this page, switching networks, or use{" "}
                <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                  the original page
                </a>{" "}
                instead.
              </p>
            </div>
          </div>
            </div>
            <GameSidebar items={pixelSidebarItems} />
          </div>
        </section>

        <GalleryPreview
          title="Community Gallery Preview"
          intro="Browse a few face icon examples before opening the pixel avatar tool."
          items={pixelGalleryPreviewItems}
        />

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
