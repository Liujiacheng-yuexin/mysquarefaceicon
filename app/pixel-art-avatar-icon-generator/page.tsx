import CuratedGalleryPreview from "@/components/CuratedGalleryPreview";
import GamePlayer from "@/components/game-player/GamePlayer";
import GameSidebar, { type GameSidebarItem } from "@/components/GameSidebar";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { curatedIconIdeas, type CuratedIconIdea } from "@/data/curated-icon-ideas";
import { resolvePixelExternalPage } from "@/lib/games/pixel-external-page";
import { getPublicGameHref, requireLegacyGamePath } from "@/lib/games/routes";
import { selectRelatedGames } from "@/lib/recommendations/related-games";
import { buildGameMetadata, getGamePageH1 } from "@/lib/seo/game-metadata";
import { serializeGameStructuredData } from "@/lib/seo/game-structured-data";
import { ExternalLink, Monitor, Sparkles, Wrench } from "lucide-react";
import FavoriteToggle from "@/components/game/FavoriteToggle";

const pixelArtAvatarGame = requireLegacyGamePath("/pixel-art-avatar-icon-generator");
const pixelPage = resolvePixelExternalPage(pixelArtAvatarGame);
const pageUrl = pixelArtAvatarGame.route.canonical;
const { originalUrl, termsUrl, player: pixelPlayerModel } = pixelPage;
const { howToPlay: howToSteps, features, tips, faq } = pixelArtAvatarGame;
const pixelRelatedCopy = {
  "square-face": {
    title: "Square Face Generator",
    text: "Play the classic square face Flash avatar maker on this site."
  },
  "oval-face": {
    title: "Oval Face Icon Generator",
    text: "Try a rounded-face companion game with oval profile icon styling."
  }
} as const;
const pixelRelatedGames = selectRelatedGames(pixelArtAvatarGame).recommendations.map(({ game }) => ({
  game,
  copy: pixelRelatedCopy[game.id as keyof typeof pixelRelatedCopy] ?? {
    title: game.name,
    text: game.content.summary
  }
}));

const pixelGalleryPreviewItems = [
  curatedIconIdeas.gamer,
  curatedIconIdeas.cute,
  curatedIconIdeas.retro,
  curatedIconIdeas.funny,
  curatedIconIdeas.minimal,
  curatedIconIdeas.classic
] as const satisfies readonly CuratedIconIdea[];

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

export const metadata = buildGameMetadata(pixelArtAvatarGame);

export default function PixelArtAvatarIconGeneratorPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Pixel Art Avatar Icon Generator",
    description: pixelArtAvatarGame.seo.description,
    url: pageUrl
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeGameStructuredData(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeGameStructuredData(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeGameStructuredData(breadcrumbSchema) }} />

      <SiteHeader mobileStartLabel="Open" mobileStartHref="#external-generator" />
      <main>
        <section className="game-station external-game-hero" id="external-generator">
          <div className="game-station-grid">
            <div className="game-station-main">
              <div className="game-title-block">
              <p className="eyebrow">External tool · {pixelArtAvatarGame.source.providerName}</p>
              <h1>{getGamePageH1(pixelArtAvatarGame)}</h1>
              <p className="hero-text">
                Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons. This
                page keeps the original source visible and adds quick guidance for desktop and mobile users.
              </p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="hero-primary-link" href={originalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden="true" size={20} />
                  {pixelPlayerModel.player.ctaLabel}
                </a>
                <FavoriteToggle
                  gameId={pixelArtAvatarGame.id}
                  gameName={pixelArtAvatarGame.name}
                  pageType={pixelArtAvatarGame.pageType}
                  variant="detail"
                  showViewLink
                />
                <span>Opens icongenerators.net in a new tab.</span>
              </div>
            </div>
            <div className="game-card external-embed-card station-game-card">
            <div className="game-card-header">
              <div>
                <p className="tool-card-kicker">icongenerators.net original tool</p>
                <h2>Open Pixel Art Avatar Icon Generator Online</h2>
                <p className="tool-card-description">
                  This is an external tool from IconGenerators. Open the original page to use it; My Square Face Icon
                  does not host or embed the generator.
                </p>
              </div>
              <span className="tool-card-badge">External tool</span>
            </div>
            <GamePlayer model={pixelPlayerModel} />
            <div className="external-embed-note">
              <Wrench aria-hidden="true" size={18} />
              <p>
                The original site&apos;s{" "}
                <a href={termsUrl} target="_blank" rel="noopener noreferrer">
                  Terms of Use
                </a>{" "}
                govern the generator and its outputs. This page provides a direct link, not permission to embed, copy,
                or use generated images commercially.
              </p>
            </div>
          </div>
            </div>
            <GameSidebar items={pixelSidebarItems} />
          </div>
        </section>

        <CuratedGalleryPreview
          title="Curated Icon Ideas"
          intro="Browse six site-curated face styles for color and expression ideas before opening the external pixel avatar tool."
          trustNote="Site-curated examples — not community submissions."
          items={pixelGalleryPreviewItems}
          variant="compact"
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
            <h2>How to Use the Pixel Avatar Maker on the Original Site</h2>
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

        {pixelRelatedGames.length > 0 ? (
        <section className="content-band">
          <div className="section-heading">
            <p className="eyebrow">Continue exploring</p>
            <h2>Related Avatar Games</h2>
          </div>
          <div className="related-grid">
            {pixelRelatedGames.map(({ game, copy }) => (
              <div className="favoritable-game-card favoritable-related-card" key={game.id}>
                <a
                  className="related-card"
                  data-game-id={game.id}
                  data-game-page-type={game.pageType}
                  href={getPublicGameHref(game)}
                >
                  <Sparkles aria-hidden="true" size={20} />
                  <h3>{copy.title}</h3>
                  <p>{copy.text}</p>
                </a>
                <FavoriteToggle gameId={game.id} gameName={copy.title} pageType={game.pageType} />
              </div>
            ))}
          </div>
        </section>
        ) : null}

        <section className="content-band alt-band">
          <div className="section-heading">
            <p className="eyebrow">Practical guide</p>
            <h2>Pixel Avatar Guide</h2>
          </div>
          <div className="related-grid">
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
