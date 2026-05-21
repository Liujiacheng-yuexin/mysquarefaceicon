import CommentSection from "@/components/CommentSection";
import FlashGenerator from "@/components/FlashGenerator";
import InstallPrompt from "@/components/InstallPrompt";
import { ChevronDown, CirclePlay, Gamepad2, Menu, Monitor, Sparkles } from "lucide-react";
import { getLocaleUrl, locales, reviewedLocaleCodes, type LocaleCode } from "@/lib/locales";

type HomePageProps = {
  locale: LocaleCode;
};

const howToSteps = [
  {
    title: "Start the game",
    text: "Wait for the Flash game to load in the player above, then press the START button inside the game."
  },
  {
    title: "Customize your square face",
    text:
      "Use the in-game buttons to change the face, eyes, mouth, hair, colors, accessories, and other details."
  },
  {
    title: "Create your favorite look",
    text:
      "Try different combinations until you make a funny or cute square face icon. If the original game does not include a save button, you can take a screenshot of your creation."
  }
];

const gameFeatures = [
  {
    title: "Classic Flash Game",
    text: "Play a nostalgic avatar maker from the Flash game era."
  },
  {
    title: "Square Face Avatar",
    text: "Create funny square-shaped face characters."
  },
  {
    title: "No Flash Player Required",
    text: "The game runs in modern browsers with a Flash emulator."
  },
  {
    title: "Free to Play",
    text: "Play directly online without installing anything."
  },
  {
    title: "Simple Controls",
    text: "Use the in-game options to customize your face."
  },
  {
    title: "Desktop Friendly",
    text: "Best played on desktop or laptop browsers."
  }
];

const tips = [
  "Use a desktop or laptop browser",
  "Wait a few seconds for the game to load",
  "Try fullscreen mode if the game appears small",
  "Reload the game if it freezes",
  "Use landscape mode on mobile devices"
];

const troubleshooting = [
  {
    title: "Game not loading",
    text:
      "Please wait a few seconds. If the game still does not load, refresh the page or click the Reload Game button."
  },
  {
    title: "Game freezes",
    text: "Click Reload Game to restart the Flash player without leaving the page."
  },
  {
    title: "Buttons not working on mobile",
    text:
      "Some classic Flash games were designed for desktop controls. Try using a desktop browser or rotating your phone to landscape mode."
  },
  {
    title: "Do I need Adobe Flash Player?",
    text:
      "No. This page uses a modern Flash emulator, so you do not need to install Adobe Flash Player."
  }
];

const faq = [
  {
    question: "What is Square Face Generator?",
    answer:
      "Square Face Generator is a classic Flash avatar maker game where you can create funny square-shaped face icons."
  },
  {
    question: "Can I play Square Face Generator online?",
    answer: "Yes. You can play it directly in your browser using the game player on this page."
  },
  {
    question: "Do I need Flash Player to play it?",
    answer:
      "No. The game runs through a modern Flash emulator, so you do not need to install Adobe Flash Player."
  },
  {
    question: "Does it work on mobile?",
    answer:
      "It may work on some mobile browsers, but the game is best played on desktop or laptop devices."
  },
  {
    question: "Why is the game not loading?",
    answer:
      "The game may take a few seconds to load. Try refreshing the page or using the Reload Game button."
  },
  {
    question: "Can I save my square face?",
    answer:
      "If the original game does not include a save button, you can take a screenshot of your creation."
  }
];

const relatedCards = [
  {
    title: "Avatar Games",
    text: "Find a quick browser workflow for playful profile avatars.",
    href: "/free-avatar-maker"
  },
  {
    title: "Face Maker Games",
    text: "Learn how square face icons work for social and gaming profiles.",
    href: "/square-face-icon-generator"
  },
  {
    title: "Pixel Avatar Games",
    text: "Explore retro-inspired square avatar ideas and simple pixel-style rules.",
    href: "/pixel-square-face-maker"
  },
  {
    title: "Gallery",
    text: "Browse original square face icon ideas for colors, expressions, and profile crops.",
    href: "/gallery"
  },
  {
    title: "Dress Up Games",
    text: "More lightweight dress-up style tools may be added later.",
    disabled: true
  },
  {
    title: "Flash Games",
    text: "This page currently focuses on the classic Square Face Generator game.",
    disabled: true
  }
];

export default function HomePage({ locale }: HomePageProps) {
  const content = locales[locale];
  const canonicalUrl = getLocaleUrl(locale);

  const videoGameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Square Face Generator",
    description: "Play the classic Square Face Generator Flash avatar maker game online.",
    url: canonicalUrl,
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
        item: canonicalUrl
      }
    ]
  };

  return (
    <div lang={content.code} dir={content.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="site-nav">
        <a className="brand" href="/" aria-label="My Square Face Icon home">
          <span className="brand-mark" aria-hidden="true" />
          <span>Square Face Generator</span>
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
          <a href="/gallery">Gallery</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
          {reviewedLocaleCodes.length > 1 && (
            <details className="language-links">
              <summary className="language-current" aria-label="Select language">
                {content.label}
                <ChevronDown aria-hidden="true" size={14} />
              </summary>
              <div className="language-menu">
                {reviewedLocaleCodes.map((code) => (
                  <a className={code === locale ? "is-active" : ""} href={locales[code].path} hrefLang={code} key={code}>
                    {locales[code].label}
                  </a>
                ))}
              </div>
            </details>
          )}
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
            <a href="/gallery">Gallery</a>
            <a href="/blog">Blog</a>
            <a href="/contact">Contact</a>
          </div>
        </details>
      </header>

      <main>
        <section className="game-hero">
          <div className="game-hero-inner">
            <div className="game-hero-copy">
              <p className="eyebrow">Classic Flash avatar maker</p>
              <h1>Square Face Generator</h1>
              <p className="hero-text">
                Play the classic Square Face Generator Flash game online. Create funny square face icons directly in
                your browser.
              </p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="hero-primary-link" href="#game-player">
                  <CirclePlay aria-hidden="true" size={20} />
                  Play Now
                </a>
                <a className="hero-secondary-link" href="#how-to-play">How to Play</a>
              </div>
            </div>
            <div className="nostalgia-card" aria-label="Classic Flash game highlights">
              <div className="nostalgia-icon" aria-hidden="true">
                <span />
              </div>
              <div>
                <strong>Retro Flash Game</strong>
                <p>Pixel-inspired, playful, lightweight, and preserved for modern browsers with Ruffle.</p>
              </div>
              <div className="nostalgia-tags" aria-label="Game tags">
                <span>Avatar Maker</span>
                <span>Face Game</span>
                <span>No Flash Plugin</span>
              </div>
            </div>
          </div>
        </section>

        <section className="game-player-section" id="game-player">
          <span className="anchor-target" id="maker" aria-hidden="true" />
          <div className="game-card">
            <div className="game-card-header">
              <div>
                <p className="tool-card-kicker">Square Face Generator</p>
                <h2>Play Square Face Generator Online</h2>
              </div>
              <span className="tool-card-badge">Classic Flash Game</span>
            </div>
            <FlashGenerator />
          </div>
        </section>

        <section className="content-band" id="what-is">
          <div className="section-heading">
            <p className="eyebrow">About the game</p>
            <h2>What Is Square Face Generator?</h2>
            <p className="section-intro">
              Square Face Generator is a classic Flash avatar maker game where you can create funny square-shaped face
              icons. Mix different facial features, expressions, hairstyles, and accessories to design a unique square
              face character.
            </p>
          </div>
        </section>

        <section className="content-band alt-band" id="how-to-play">
          <span className="anchor-target" id="how-to-use" aria-hidden="true" />
          <div className="section-heading">
            <p className="eyebrow">Three simple steps</p>
            <h2>How to Play Square Face Generator</h2>
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
            <h2>Square Face Generator Features</h2>
          </div>
          <div className="feature-grid">
            {gameFeatures.map((feature) => (
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
            <h2>Tips for the Best Experience</h2>
            <p className="section-intro">
              For the best experience, play Square Face Generator on a desktop browser. If the game area looks too
              small, use the fullscreen button. If the game does not respond, reload the game and try again.
            </p>
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
            <h2>Troubleshooting</h2>
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

        <section className="content-band playful-band" id="community">
          <div className="section-heading">
            <p className="eyebrow">Community gallery</p>
            <h2>Recent Square Face Creations</h2>
            <p className="section-intro">
              Share a screenshot or feedback after you play. New comments are reviewed before publishing, and the home
              page shows a small recent sample only.
            </p>
          </div>
          <CommentSection locale={locale} content={content.comments} limit={6} showGalleryLink />
        </section>

        <section className="content-band alt-band">
          <div className="section-heading">
            <p className="eyebrow">More to explore</p>
            <h2>Related Avatar Games</h2>
          </div>
          <div className="related-grid">
            {relatedCards.map((card) =>
              card.disabled ? (
                <article className="related-card is-disabled" key={card.title}>
                  <Sparkles aria-hidden="true" size={20} />
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ) : (
                <a className="related-card" href={card.href} key={card.title}>
                  <Sparkles aria-hidden="true" size={20} />
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </a>
              )
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <p>&copy; 2026 My Square Face Icon.</p>
          <p>Classic square face generator game for quick profile icons.</p>
        </div>
        <div className="footer-grid" aria-label="Footer navigation">
          <div>
            <h3>Game</h3>
            <a href="#game-player">Play Square Face Generator</a>
            <a href="#how-to-play">How to Play</a>
            <a href="#troubleshooting">Troubleshooting</a>
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
