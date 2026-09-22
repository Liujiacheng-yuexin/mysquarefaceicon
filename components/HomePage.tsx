import FlashGenerator from "@/components/FlashGenerator";
import CuratedGalleryPreview from "@/components/CuratedGalleryPreview";
import GameSidebar, { type GameSidebarItem } from "@/components/GameSidebar";
import HomeDiscoveryRegion from "@/components/home/HomeDiscoveryRegion";
import HomeHero from "@/components/home/HomeHero";
import HomeResourceLinks from "@/components/home/HomeResourceLinks";
import InstallPrompt from "@/components/InstallPrompt";
import Image from "next/image";
import { CheckCircle2, ChevronDown, CirclePlay, Gamepad2, Menu, Monitor, Sparkles } from "lucide-react";
import { homeCuratedIconIdeas } from "@/data/curated-icon-ideas";
import { resolveHomeDiscovery } from "@/lib/games/home-discovery";
import { resolveSquareHomepage } from "@/lib/games/square-homepage";
import { requireLegacyGamePath } from "@/lib/games/routes";
import { getLocaleUrl, locales, reviewedLocaleCodes, type LocaleCode } from "@/lib/locales";

type HomePageProps = {
  locale: LocaleCode;
};

const squareFaceGame = requireLegacyGamePath("/");
const squareHomepage = resolveSquareHomepage(squareFaceGame);
const { features: gameFeatures, howToPlay: howToSteps, tips, faq } = squareFaceGame;
const homeContent = squareHomepage.content;
const homeDiscovery = resolveHomeDiscovery(squareFaceGame);

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

const trustBadges = ["Original Flash Style", "No Flash Plugin", "100% Free", "No Signup", "Runs in Browser"];

const legacyLocaleSidebarItems: GameSidebarItem[] = [
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
    text: "Style examples; approved posts when available.",
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
    text: "Open the Pixel tool details page for a link to the external provider.",
    href: "/pixel-art-avatar-icon-generator"
  },
  {
    title: "Gallery",
    text: "Browse simple square face style illustrations and approved submissions when available.",
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
  const isPrimaryHomepage = locale === "en";

  const videoGameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: squareFaceGame.name,
    description: homeContent.videoGameDescription,
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
        name: squareFaceGame.name,
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
              <a href="/games">All avatar games</a>
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
            <a href="/games">All avatar games</a>
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
        {isPrimaryHomepage ? (
          <HomeHero
            h1={squareHomepage.h1}
            copy={homeContent.hero}
            player={squareHomepage.player}
          />
        ) : (
          <section className="game-station" id="game-player">
            <span className="anchor-target" id="maker" aria-hidden="true" />
            <div className="game-station-grid">
              <div className="game-station-main">
                <div className="game-title-block">
                  <p className="eyebrow">{homeContent.hero.eyebrow}</p>
                  <h1>{squareHomepage.h1}</h1>
                  <p className="hero-text">{homeContent.hero.intro}</p>
                </div>
                <div className="home-game-player-card" aria-label={homeContent.hero.cardLabel}>
                  <FlashGenerator {...squareHomepage.player} />
                </div>
              </div>
              <GameSidebar items={legacyLocaleSidebarItems} />
            </div>
          </section>
        )}

        {isPrimaryHomepage ? (
          <HomeDiscoveryRegion
            featuredGames={homeDiscovery.featuredGames}
            newGames={homeDiscovery.newGames}
            categories={homeDiscovery.categories}
          />
        ) : null}

        <CuratedGalleryPreview
          title="Curated Icon Ideas"
          intro="Explore six square face styles for color, expression, and profile-crop inspiration."
          trustNote="Site-curated examples — not community submissions."
          items={homeCuratedIconIdeas}
          variant="home-editorial"
        />

        <section className="content-band about-game-band" id="what-is">
          <div className="about-game-card">
            <div className="about-game-art" aria-hidden="true">
              <Image src={squareHomepage.artworkSrc} alt="" width={260} height={260} sizes="260px" />
            </div>
            <div className="about-game-copy">
              <p className="eyebrow">{homeContent.about.eyebrow}</p>
              <h2>{homeContent.about.title}</h2>
              <p className="section-intro">{homeContent.about.text}</p>
              <div className="about-proof-grid" aria-label={homeContent.about.notesLabel}>
                <span>
                  <CheckCircle2 aria-hidden="true" size={24} />
                  {homeContent.about.notes[0]}
                </span>
                <span>
                  <CheckCircle2 aria-hidden="true" size={24} />
                  {homeContent.about.notes[1]}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="content-band" id="features">
          <div className="section-heading">
            <h2>{homeContent.headings.features}</h2>
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
              {homeContent.headings.howToPlay}
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
            <p className="eyebrow">{homeContent.headings.tipsEyebrow}</p>
            <h2>{homeContent.headings.tips}</h2>
            <p className="section-intro">{homeContent.tipsIntro}</p>
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
              {homeContent.headings.faq}
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

        {isPrimaryHomepage ? <HomeResourceLinks /> : null}

        <section className="home-final-cta" aria-label={homeContent.finalCta.ariaLabel}>
          <span className="cta-face" aria-hidden="true" />
          <div>
            <h2>{homeContent.finalCta.title}</h2>
            <p>{homeContent.finalCta.text}</p>
            <a className="hero-primary-link" href="#game-player">
              <CirclePlay aria-hidden="true" size={20} />
              {homeContent.finalCta.linkLabel}
            </a>
          </div>
          <span className="cta-sparkles" aria-hidden="true">✦ ♡ ✧</span>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer-brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <p>My Square Face Icon</p>
            <p>Classic Flash avatar games and free tools.</p>
          </div>
        </div>
        <nav className="home-footer-links" aria-label="Footer navigation">
          <a href="/">Home</a>
          <a href="/games">All avatar games</a>
          <a href="/gallery">Gallery</a>
          <a href="/square-face-icon-generator">Icon Guide</a>
          <a href="/blog">Blog</a>
          <a href="/about-us">About</a>
          <a href="/contact">Contact</a>
        </nav>
        <p className="home-footer-copyright">&copy; 2025 mysquarefaceicon.com. All rights reserved.</p>
        <div className="home-footer-social" aria-label="Social links">
          <a href="/contact" aria-label="Contact My Square Face Icon">●</a>
          <a href="/blog" aria-label="Read the blog">●</a>
          <a href="/gallery" aria-label="Open gallery">●</a>
        </div>
      </footer>
      <InstallPrompt />
    </div>
  );
}

