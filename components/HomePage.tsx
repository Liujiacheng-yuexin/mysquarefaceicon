import FlashGenerator from "@/components/FlashGenerator";
import InstallPrompt from "@/components/InstallPrompt";
import { Camera, CheckCircle2, ChevronDown, CirclePlay, Gamepad2, Menu, Monitor, Sparkles } from "lucide-react";
import Image from "next/image";
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

const saveSteps = [
  {
    title: "Create your face",
    text: "Choose the face, eyes, mouth, hair, and accessories you like."
  },
  {
    title: "Save or screenshot your result",
    text: "Use the in-game save button when available, or take a screenshot."
  },
  {
    title: "Use it as your icon",
    text: "Set it as a Discord PFP, GitHub avatar, Notion icon, favicon, or profile picture."
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

const trustBadges = ["Original Flash Style", "No Flash Plugin", "100% Free", "No Signup", "Runs in Browser"];

const heroSamples = [
  {
    title: "Cute",
    src: "/game-face-samples/cute.webp",
    alt: "Cute square face icon made in the classic Square Face Generator game"
  },
  {
    title: "Retro",
    src: "/game-face-samples/retro.webp",
    alt: "Retro smiling square face icon made in the Flash avatar game"
  },
  {
    title: "Funny",
    src: "/game-face-samples/funny.webp",
    alt: "Funny square face icon with spiral eyes made in the game"
  },
  {
    title: "Minimal",
    src: "/game-face-samples/minimal.webp",
    alt: "Minimal square face icon with simple eyes made in the game"
  },
  {
    title: "Gamer",
    src: "/game-face-samples/gamer.webp",
    alt: "Gamer style square face icon with glasses made in the game"
  },
  {
    title: "Classic",
    src: "/game-face-samples/classic.webp",
    alt: "Classic calm square face icon made in Square Face Generator"
  }
];

const iconIdeas = [
  {
    title: "Cute Square Face",
    text: "Soft smile, simple eyes, and a friendly profile mood.",
    src: "/game-face-samples/ideas/cute-square-face.webp",
    alt: "Cute square face avatar made with the classic game"
  },
  {
    title: "Retro Flash Face",
    text: "A nostalgic look inspired by browser avatar games.",
    src: "/game-face-samples/ideas/retro-flash-face.webp",
    alt: "Retro Flash style square face avatar made with the game"
  },
  {
    title: "Simple Icon Face",
    text: "Clean shapes and a profile-friendly face that reads at small sizes.",
    src: "/game-face-samples/ideas/simple-icon-face.webp",
    alt: "Simple square face icon made with Square Face Generator"
  },
  {
    title: "Funny Square Face",
    text: "A playful expression for casual game and forum profiles.",
    src: "/game-face-samples/ideas/funny-square-face.webp",
    alt: "Funny spiral eye square face icon made with the game"
  },
  {
    title: "Minimal Face",
    text: "A clean face icon that works for tiny favicons and badges.",
    src: "/game-face-samples/ideas/minimal-face.webp",
    alt: "Minimal square face avatar made with the game"
  },
  {
    title: "Gamer Avatar",
    text: "A stronger color combo for lobbies, clans, and game accounts.",
    src: "/game-face-samples/ideas/gamer-avatar.webp",
    alt: "Gamer square face avatar with glasses"
  },
  {
    title: "Discord PFP",
    text: "A bright square source that crops well into a circle.",
    src: "/game-face-samples/ideas/discord-pfp.webp",
    alt: "Square face icon suitable for a Discord profile picture"
  },
  {
    title: "GitHub Avatar",
    text: "A lightweight developer avatar with a clean face shape.",
    src: "/game-face-samples/ideas/github-avatar.webp",
    alt: "Simple square face icon suitable for a GitHub avatar"
  },
  {
    title: "Notion Icon",
    text: "A cute face marker for pages, dashboards, and notes.",
    src: "/game-face-samples/ideas/notion-icon.webp",
    alt: "Cute square face icon suitable for Notion"
  },
  {
    title: "Favicon Style",
    text: "High contrast details that remain readable when tiny.",
    src: "/game-face-samples/ideas/favicon-style.webp",
    alt: "Square face icon with strong features for small icon use"
  },
  {
    title: "Classic Face",
    text: "Simple square face styling close to the original game mood.",
    src: "/game-face-samples/ideas/classic-face.webp",
    alt: "Classic square face icon made in the Flash game"
  },
  {
    title: "Weird Face",
    text: "An odd little expression for comments and playful projects.",
    src: "/game-face-samples/ideas/weird-face.webp",
    alt: "Weird square face avatar with glasses made with the game"
  }
];

const profileUseCases = [
  {
    title: "Discord PFP",
    text: "Create a fun retro square face for your Discord profile."
  },
  {
    title: "GitHub Avatar",
    text: "Use a simple square face as a lightweight developer avatar."
  },
  {
    title: "Notion Icon",
    text: "Make a cute face icon for Notion pages and dashboards."
  },
  {
    title: "Favicon",
    text: "Turn your square face into a small website icon."
  },
  {
    title: "Gaming Profile",
    text: "Use a funny square face as a game profile picture."
  },
  {
    title: "Social Media",
    text: "Create a playful icon for forums, comments, and social accounts."
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
      "Square Face Generator is a classic Flash avatar maker game where you can create funny retro square face icons."
  },
  {
    question: "Can I use my square face as an avatar?",
    answer:
      "Yes. You can use your square face as a Discord PFP, GitHub avatar, Notion icon, favicon, or social profile picture."
  },
  {
    question: "Do I need Adobe Flash Player?",
    answer:
      "No. The game runs in modern browsers with Ruffle, so you do not need to install Adobe Flash Player."
  },
  {
    question: "How do I save my square face icon?",
    answer:
      "Use the in-game save option if it works in your browser, or take a screenshot and crop it into a square icon."
  },
  {
    question: "Does it work on mobile?",
    answer:
      "It may work on some mobile browsers, but the classic Flash game works best on desktop or laptop devices."
  },
  {
    question: "Is Square Face Generator free?",
    answer: "Yes. The game is free to play and does not require signup."
  }
];

const relatedCards = [
  {
    title: "Oval Face Icon Generator",
    text: "Try a softer rounded avatar maker with oval-shaped profile icons.",
    href: "/oval-face-icon-generator"
  },
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
    text: "Use an embedded external chibi pixel avatar maker with source credit.",
    href: "/pixel-art-avatar-icon-generator"
  },
  {
    title: "Gallery",
    text: "Browse original square face icon ideas for colors, expressions, and profile crops.",
    href: "/gallery"
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
    description: "Play the classic Square Face Generator Flash avatar maker game online and create retro square face icons.",
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
          <details className="nav-dropdown">
            <summary>
              <Gamepad2 aria-hidden="true" size={16} />
              Game
              <ChevronDown aria-hidden="true" size={14} />
            </summary>
            <div className="nav-dropdown-menu">
              <a href="#game-player">Square Face Generator</a>
              <a href="/oval-face-icon-generator">Oval Face Icon Generator</a>
              <a href="/pixel-art-avatar-icon-generator">Pixel Art Avatar Icon Generator</a>
            </div>
          </details>
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
            <a href="/oval-face-icon-generator">Oval Face</a>
            <a href="/pixel-art-avatar-icon-generator">Pixel Avatar</a>
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
                Play the classic Square Face Generator online and create retro square face icons for avatars, Discord
                PFPs, GitHub profiles, favicons, and more.
              </p>
              <div className="hero-badge-row" aria-label="Square Face Generator benefits">
                {trustBadges.map((badge) => (
                  <span key={badge}>
                    <CheckCircle2 aria-hidden="true" size={15} />
                    {badge}
                  </span>
                ))}
              </div>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="hero-primary-link" href="#game-player">
                  <CirclePlay aria-hidden="true" size={20} />
                  Create My Square Face
                </a>
                <a className="hero-secondary-link" href="#game-player">Play Classic Game</a>
              </div>
            </div>
            <div className="hero-sample-board" aria-label="Square face icon style examples">
              {heroSamples.map((sample) => (
                <article className="hero-sample-tile" key={sample.title}>
                  <Image
                    className="game-face-sample-image"
                    src={sample.src}
                    alt={sample.alt}
                    width={512}
                    height={512}
                    sizes="112px"
                  />
                  <strong>{sample.title}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Square Face Generator quick facts">
          {trustBadges.map((badge) => (
            <span key={badge}>
              <CheckCircle2 aria-hidden="true" size={17} />
              {badge}
            </span>
          ))}
        </section>

        <section className="game-player-section" id="game-player">
          <span className="anchor-target" id="maker" aria-hidden="true" />
          <div className="game-card">
            <div className="game-card-header">
              <div>
                <p className="tool-card-kicker">Square Face Generator</p>
                <h2>Play Square Face Generator Online</h2>
                <p className="tool-card-description">
                  Click the button below to load the classic Flash game. It runs in your browser with Ruffle, so you do
                  not need to install Adobe Flash Player.
                </p>
              </div>
              <span className="tool-card-badge">Classic Flash Game</span>
            </div>
            <FlashGenerator reportHref="#troubleshooting" />
          </div>
        </section>

        <section className="content-band" id="save-icon">
          <div className="section-heading">
            <p className="eyebrow">Save your icon</p>
            <h2>How to Save Your Square Face Icon</h2>
            <p className="section-intro">
              After creating your square face, you can use the in-game save option if it is available. If the classic
              Flash game does not save correctly in your browser, take a screenshot of your finished face and crop it
              into a square icon.
            </p>
          </div>
          <div className="steps-grid">
            {saveSteps.map((step, index) => (
              <article className="info-card save-step-card" key={step.title}>
                <span className="step-number">Step {index + 1}</span>
                <Camera aria-hidden="true" size={22} />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-band playful-band" id="icon-ideas">
          <div className="section-heading">
            <p className="eyebrow">Style ideas</p>
            <h2>Square Face Icon Ideas</h2>
            <p className="section-intro">
              Get inspired by cute, retro, pixel, and funny square face styles before creating your own.
            </p>
          </div>
          <div className="ideas-grid">
            {iconIdeas.map((idea) => (
              <article className="idea-card" key={idea.title}>
                <Image
                  className="game-face-sample-image"
                  src={idea.src}
                  alt={idea.alt}
                  width={512}
                  height={512}
                  sizes="96px"
                />
                <h3>{idea.title}</h3>
                <p>{idea.text}</p>
                <a href="#game-player">Make This Style</a>
              </article>
            ))}
          </div>
        </section>

        <section className="content-band alt-band" id="use-cases">
          <div className="section-heading">
            <p className="eyebrow">Use cases</p>
            <h2>Use Your Square Face Icon Anywhere</h2>
          </div>
          <div className="use-grid">
            {profileUseCases.map((useCase) => (
              <article key={useCase.title}>
                <h3>{useCase.title}</h3>
                <p>{useCase.text}</p>
              </article>
            ))}
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
            <a href="/oval-face-icon-generator">Oval Face Icon Generator</a>
            <a href="/pixel-art-avatar-icon-generator">Pixel Art Avatar Icon Generator</a>
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

