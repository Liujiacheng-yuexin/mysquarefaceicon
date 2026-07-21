import FlashGenerator from "@/components/FlashGenerator";
import GalleryPreview from "@/components/GalleryPreview";
import GameSidebar, { type GameSidebarItem } from "@/components/GameSidebar";
import InstallPrompt from "@/components/InstallPrompt";
import Image from "next/image";
import { CheckCircle2, ChevronDown, CirclePlay, Gamepad2, Menu, Monitor, Sparkles } from "lucide-react";
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

const galleryPreviewItems = heroSamples.map((sample, index) => ({
  ...sample,
  likes: [120, 98, 76, 142, 110, 85][index] ?? 64
}));

const homeSidebarItems: GameSidebarItem[] = [
  {
    title: "Oval Face Icon Generator",
    text: "Create cute oval face icons with a softer rounded avatar game.",
    href: "/oval-face-icon-generator",
    imageSrc: "/games/oval-face-icon.png",
    imageAlt: "Oval face icon generator preview"
  },
  {
    title: "Pixel Art Avatar Icon Generator",
    text: "Open a chibi pixel avatar maker with source credit.",
    href: "/pixel-art-avatar-icon-generator",
    imageSrc: "/game-face-samples/gamer.webp",
    imageAlt: "Pixel avatar icon preview"
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
    text: "Explore square face icons created by players.",
    href: "/gallery",
    imageSrc: "/game-face-samples/ideas/cute-square-face.webp",
    imageAlt: "Square face gallery preview"
  },
  {
    title: "Blog Guide",
    text: "Tips, tutorials, and guides about avatar making.",
    href: "/blog",
    imageSrc: "/game-face-samples/ideas/favicon-style.webp",
    imageAlt: "Avatar blog guide preview"
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
          <a href="/free-avatar-maker">Free Avatar Maker</a>
          <a href="/gallery">Gallery</a>
          <a href="/square-face-icon-generator">Icon Guide</a>
          <a href="/blog">Blog</a>
          <a href="/about-us">About</a>
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
          <a className="nav-cta" href="#game-player">Start Creating</a>
        </nav>
        <details className="mobile-nav-menu">
          <summary aria-label="Open navigation menu">
            <Menu aria-hidden="true" size={18} />
            Menu
          </summary>
          <div className="mobile-nav-panel">
            <a href="#game-player">Play Now</a>
            <a href="/oval-face-icon-generator">Oval Face</a>
            <a href="/pixel-art-avatar-icon-generator">Pixel Avatar</a>
            <a href="/free-avatar-maker">Free Avatar Maker</a>
            <a href="/gallery">Gallery</a>
            <a href="/square-face-icon-generator">Icon Guide</a>
            <a href="/blog">Blog</a>
            <a href="/about-us">About</a>
            <a href="/contact">Contact</a>
          </div>
        </details>
      </header>

      <main>
        <section className="game-station" id="game-player">
          <span className="anchor-target" id="maker" aria-hidden="true" />
          <div className="game-station-grid">
            <div className="game-station-main">
              <div className="game-title-block">
                <p className="eyebrow">Classic Flash avatar maker</p>
                <h1>Square Face Generator</h1>
                <p className="hero-text">
                  Play the classic Square Face Generator online and create retro square face icons for avatars, Discord
                  PFPs, GitHub profiles, favicons, and more.
                </p>
              </div>
              <div className="home-game-player-card" aria-label="Play Square Face Generator Online">
                <FlashGenerator
                  reportHref="/contact"
                  startLabel="Play Game"
                  reloadLabel="Reload Game"
                  helpLabel="Report Issue"
                  showStartControl={false}
                />
              </div>
            </div>
            <GameSidebar items={homeSidebarItems} />
          </div>
        </section>

        <GalleryPreview
          title="Community Gallery Preview"
          intro="Check out square face icon styles from the community and our original examples before making your own."
          items={galleryPreviewItems}
        />

        <section className="content-band about-game-band" id="what-is">
          <div className="about-game-card">
            <div className="about-game-art" aria-hidden="true">
              <Image src="/square-face-icon.png" alt="" width={260} height={260} sizes="260px" />
            </div>
            <div className="about-game-copy">
              <p className="eyebrow">About the game</p>
              <h2>What Is Square Face Generator?</h2>
              <p className="section-intro">
                Square Face Generator is a classic Flash avatar maker game where you can create funny square-shaped
                face icons. Mix different facial features, expressions, hairstyles, and accessories to design a unique
                square face character.
              </p>
              <div className="about-proof-grid" aria-label="Square Face Generator browser notes">
                <span>
                  <CheckCircle2 aria-hidden="true" size={24} />
                  Runs in modern browsers with Ruffle
                </span>
                <span>
                  <CheckCircle2 aria-hidden="true" size={24} />
                  No Flash Player installation
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="content-band" id="features">
          <div className="section-heading">
            <h2>Square Face Generator Features</h2>
          </div>
          <div className="feature-grid">
            {gameFeatures.map((feature, index) => (
              <article className="info-card feature-card" key={feature.title}>
                <span className={`feature-icon feature-icon-${index + 1}`} aria-hidden="true" />
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-band alt-band" id="how-to-play">
          <span className="anchor-target" id="how-to-use" aria-hidden="true" />
          <div className="section-heading">
            <h2>
              <Gamepad2 aria-hidden="true" size={24} />
              How to Play
            </h2>
          </div>
          <div className="steps-grid play-steps-grid">
            {howToSteps.map((step, index) => (
              <article className="info-card play-step-card" key={step.title}>
                <span className="step-number">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
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
            {tips.slice(0, 4).map((tip) => (
              <li key={tip}>
                <Monitor aria-hidden="true" size={18} />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="content-band" id="faq">
          <div className="section-heading">
            <h2>
              <Sparkles aria-hidden="true" size={24} />
              Frequently Asked Questions (FAQ)
            </h2>
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

        <section className="home-final-cta" aria-label="Start playing Square Face Generator">
          <span className="cta-face" aria-hidden="true" />
          <div>
            <h2>Ready to make a square face icon?</h2>
            <p>Jump into the classic Square Face Generator and start creating now!</p>
            <a className="hero-primary-link" href="#game-player">
              <CirclePlay aria-hidden="true" size={20} />
              Play Square Face Generator Now
            </a>
          </div>
          <span className="cta-sparkles" aria-hidden="true">✦ ♡ ✧</span>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <p>My Square Face Icon</p>
            <p>Classic Flash avatar games and free tools.</p>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="/">Home</a>
          <a href="/gallery">Gallery</a>
          <a href="/square-face-icon-generator">Icon Guide</a>
          <a href="/blog">Blog</a>
          <a href="/about-us">About</a>
          <a href="/contact">Contact</a>
        </nav>
        <p className="footer-copyright">&copy; 2025 mysquarefaceicon.com. All rights reserved.</p>
        <div className="footer-social" aria-label="Social links">
          <a href="/contact" aria-label="Contact My Square Face Icon">●</a>
          <a href="/blog" aria-label="Read the blog">●</a>
          <a href="/gallery" aria-label="Open gallery">●</a>
        </div>
      </footer>
      <InstallPrompt />
    </div>
  );
}

