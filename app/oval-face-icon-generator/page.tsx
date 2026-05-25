import type { Metadata } from "next";
import FlashGenerator from "@/components/FlashGenerator";
import InstallPrompt from "@/components/InstallPrompt";
import { CirclePlay, Gamepad2, Menu, Monitor, Sparkles } from "lucide-react";

const pageUrl = "https://mysquarefaceicon.com/oval-face-icon-generator";
const pageTitle = "Oval Face Icon Generator - Play the Classic Flash Avatar Game Online";
const pageDescription =
  "Play Oval Face Icon Generator online, a classic Flash avatar maker game for creating cute oval face icons in your browser. No Flash Player required.";

const howToSteps = [
  {
    title: "Load the oval face game",
    text: "Wait for the classic Flash game to appear in the player, then press the START button inside the game."
  },
  {
    title: "Pick oval face parts",
    text: "Use the in-game tabs to choose facial features, hair, expressions, colors, and small accessories."
  },
  {
    title: "Make a softer profile icon",
    text:
      "Try different combinations until the oval face feels right for your profile. If saving does not work in your browser, take a screenshot."
  }
];

const features = [
  {
    title: "Oval Face Style",
    text: "Create a softer rounded avatar look instead of a square face layout."
  },
  {
    title: "Classic Flash Game",
    text: "Play a preserved avatar maker from the classic browser game era."
  },
  {
    title: "No Flash Player Required",
    text: "The game runs through Ruffle, so modern browsers can load the SWF without Adobe Flash Player."
  },
  {
    title: "Simple Avatar Controls",
    text: "Choose parts from the game interface and experiment with different looks."
  },
  {
    title: "Free to Play",
    text: "Open the game directly in your browser without installing software or creating an account."
  },
  {
    title: "Desktop Friendly",
    text: "The original controls were designed for desktop, but mobile landscape mode may still work."
  }
];

const tips = [
  "Use a desktop or laptop browser for the most reliable controls",
  "Give Ruffle a few seconds to initialize before pressing buttons",
  "Use fullscreen mode if the player feels too small",
  "Reload the game if the SWF freezes or stops responding",
  "Use landscape mode if you are testing on a phone"
];

const troubleshooting = [
  {
    title: "Oval Face Icon Generator is not loading",
    text: "Wait a few seconds first. If it still does not start, use Reload Game or refresh the page."
  },
  {
    title: "The game freezes after loading",
    text: "Click Reload Game to remount the Ruffle player without leaving the page."
  },
  {
    title: "Mobile buttons are hard to use",
    text: "This is a classic Flash game built for desktop-style input. Rotate your phone or use a desktop browser."
  },
  {
    title: "Do I need Adobe Flash Player?",
    text: "No. This page uses a modern Flash emulator, so you do not need to install Adobe Flash Player."
  }
];

const faq = [
  {
    question: "What is Oval Face Icon Generator?",
    answer:
      "Oval Face Icon Generator is a classic Flash avatar maker game where you can create cute rounded face icons."
  },
  {
    question: "Can I play Oval Face Icon Generator online?",
    answer: "Yes. You can play it directly in your browser using the Ruffle-powered game player on this page."
  },
  {
    question: "Is Oval Face Icon Generator different from Square Face Generator?",
    answer:
      "Yes. The oval version focuses on a rounded face shape, while Square Face Generator keeps the original square icon style."
  },
  {
    question: "Does Oval Face Icon Generator work on mobile?",
    answer:
      "It may work on some mobile browsers, but the original Flash game controls are usually better on desktop or laptop devices."
  },
  {
    question: "Can I save my oval face icon?",
    answer:
      "If the original game save feature does not work in your browser, you can take a screenshot of your finished avatar."
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
        alt: "Oval Face Icon Generator classic Flash avatar maker"
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

export default function OvalFaceIconGeneratorPage() {
  const videoGameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Oval Face Icon Generator",
    description: "Play the classic Oval Face Icon Generator Flash avatar maker game online.",
    url: pageUrl,
    gamePlatform: "Web browser",
    applicationCategory: "Game",
    operatingSystem: "Web"
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
        name: "Oval Face Icon Generator",
        item: pageUrl
      }
    ]
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="site-nav">
        <a className="brand" href="/" aria-label="My Square Face Icon home">
          <span className="brand-mark" aria-hidden="true" />
          <span>Oval Face Icon Generator</span>
        </a>
        <a className="mobile-start-link" href="#game-player">Play</a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#game-player">
            <Gamepad2 aria-hidden="true" size={16} />
            Game
          </a>
          <a href="#how-to-play">How to Play</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a href="/">Square Game</a>
          <a href="/gallery">Gallery</a>
          <a href="/blog">Blog</a>
          <a className="nav-cta" href="#game-player">Play Now</a>
        </nav>
        <details className="mobile-nav-menu">
          <summary aria-label="Open navigation menu">
            <Menu aria-hidden="true" size={18} />
            Menu
          </summary>
          <div className="mobile-nav-panel">
            <a href="#game-player">Play Now</a>
            <a href="#how-to-play">How to Play</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
            <a href="/">Square Game</a>
            <a href="/gallery">Gallery</a>
            <a href="/blog">Blog</a>
          </div>
        </details>
      </header>

      <main>
        <section className="game-hero oval-game-hero">
          <div className="game-hero-inner">
            <div className="game-hero-copy">
              <p className="eyebrow">Classic Flash oval avatar maker</p>
              <h1>Oval Face Icon Generator</h1>
              <p className="hero-text">
                Play the classic Oval Face Icon Generator Flash game online. Create cute rounded face icons directly in
                your browser with a softer avatar style.
              </p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="hero-primary-link" href="#game-player">
                  <CirclePlay aria-hidden="true" size={20} />
                  Play Now
                </a>
                <a className="hero-secondary-link" href="#how-to-play">How to Play</a>
              </div>
            </div>
            <div className="nostalgia-card" aria-label="Classic oval face game highlights">
              <div className="nostalgia-icon oval-nostalgia-icon" aria-hidden="true">
                <span />
              </div>
              <div>
                <strong>Oval Avatar Game</strong>
                <p>A rounded-face companion to the square face game, preserved for modern browsers with Ruffle.</p>
              </div>
              <div className="nostalgia-tags" aria-label="Game tags">
                <span>Oval Face</span>
                <span>Avatar Maker</span>
                <span>Classic Flash</span>
              </div>
            </div>
          </div>
        </section>

        <section className="game-player-section" id="game-player">
          <div className="game-card">
            <div className="game-card-header">
              <div>
                <p className="tool-card-kicker">Oval Face Icon Generator</p>
                <h2>Play Oval Face Icon Generator Online</h2>
              </div>
              <span className="tool-card-badge">Classic Flash Game</span>
            </div>
            <FlashGenerator
              gameName="Oval Face Icon Generator"
              swfSources={["/games/oval-face.swf"]}
              coverImageUrl="/games/oval-face-cover.svg"
              ariaLabel="Oval face Flash generator"
              coverLabel="Start Oval Face Icon Generator game"
              loadingMessage="Loading Oval Face Icon Generator..."
              errorMessage="The oval face game could not be loaded. Please refresh the page or try a desktop browser."
              slowLoadingHint="Still loading? This classic oval face game may take a few seconds to start."
              deviceNotice="This classic Flash game works best on desktop. If you are using a phone, try landscape mode for a better oval face editing experience."
            />
          </div>
        </section>

        <section className="content-band" id="what-is">
          <div className="section-heading">
            <p className="eyebrow">About the game</p>
            <h2>What Is Oval Face Icon Generator?</h2>
            <p className="section-intro">
              Oval Face Icon Generator is a classic Flash avatar maker game for designing rounded face icons. It is
              useful when you want a softer character look than a square icon while keeping the same quick browser-game
              workflow.
            </p>
          </div>
        </section>

        <section className="content-band alt-band" id="how-to-play">
          <div className="section-heading">
            <p className="eyebrow">Three simple steps</p>
            <h2>How to Play Oval Face Icon Generator</h2>
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
            <p className="eyebrow">Game features</p>
            <h2>Oval Face Icon Generator Features</h2>
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
            <h2>Tips for the Best Oval Face Experience</h2>
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

        <section className="content-band alt-band" id="troubleshooting">
          <div className="section-heading">
            <p className="eyebrow">Help</p>
            <h2>Troubleshooting Oval Face Icon Generator</h2>
          </div>
          <div className="faq-list">
            {troubleshooting.map((item) => (
              <details className="faq-item" key={item.title}>
                <summary>{item.title}</summary>
                <p>{item.text}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="content-band" id="faq">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>Frequently Asked Questions</h2>
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

        <section className="content-band alt-band">
          <div className="section-heading">
            <p className="eyebrow">More avatar makers</p>
            <h2>Related Avatar Games and Tools</h2>
          </div>
          <div className="related-grid">
            <a className="related-card" href="/">
              <Sparkles aria-hidden="true" size={20} />
              <h3>Square Face Generator</h3>
              <p>Play the square-shaped version of the classic face icon maker.</p>
            </a>
            <a className="related-card" href="/square-face-icon-generator">
              <Sparkles aria-hidden="true" size={20} />
              <h3>Square Face Icon Guide</h3>
              <p>Learn how square face icons work for social and gaming profiles.</p>
            </a>
            <a className="related-card" href="/free-avatar-maker">
              <Sparkles aria-hidden="true" size={20} />
              <h3>Free Avatar Maker</h3>
              <p>Compare quick avatar creation workflows for profile pictures.</p>
            </a>
            <a className="related-card" href="/gallery">
              <Sparkles aria-hidden="true" size={20} />
              <h3>Community Gallery</h3>
              <p>Browse approved community creations and square face examples.</p>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <p>&copy; 2026 My Square Face Icon.</p>
          <p>Classic square and oval face generator games for quick profile icons.</p>
        </div>
        <div className="footer-grid" aria-label="Footer navigation">
          <div>
            <h3>Games</h3>
            <a href="/">Square Face Generator</a>
            <a href="#game-player">Oval Face Icon Generator</a>
            <a href="#how-to-play">How to Play</a>
            <a href="#faq">FAQ</a>
          </div>
          <div>
            <h3>Resources</h3>
            <a href="/square-face-icon-generator">Icon Guide</a>
            <a href="/free-avatar-maker">Free Avatar Maker</a>
            <a href="/gallery">Gallery</a>
            <a href="/blog">Blog</a>
          </div>
          <div>
            <h3>Legal</h3>
            <a href="/contact">Contact</a>
            <a href="/editorial-policy">Editorial Policy</a>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </div>
      </footer>
      <InstallPrompt />
    </div>
  );
}
