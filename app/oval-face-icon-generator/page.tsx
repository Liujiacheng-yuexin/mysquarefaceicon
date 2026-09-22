import FlashGenerator from "@/components/FlashGenerator";
import CuratedGalleryPreview from "@/components/CuratedGalleryPreview";
import GameSidebar, { type GameSidebarItem } from "@/components/GameSidebar";
import InstallPrompt from "@/components/InstallPrompt";
import SiteHeader from "@/components/SiteHeader";
import { curatedIconIdeas, type CuratedIconIdea } from "@/data/curated-icon-ideas";
import { getPublicGameHref, requireLegacyGamePath } from "@/lib/games/routes";
import { resolveOvalLegacyPage } from "@/lib/games/oval-legacy-page";
import { selectRelatedGames } from "@/lib/recommendations/related-games";
import { buildGameMetadata, getGamePageH1 } from "@/lib/seo/game-metadata";
import { CirclePlay, Monitor, Sparkles } from "lucide-react";
import FavoriteToggle from "@/components/game/FavoriteToggle";

const ovalFaceGame = requireLegacyGamePath("/oval-face-icon-generator");
const ovalPage = resolveOvalLegacyPage(ovalFaceGame);
const { content } = ovalPage;
const { howToPlay: howToSteps, features, tips, faq } = ovalFaceGame;
const troubleshooting = content.troubleshooting;
const pageUrl = ovalFaceGame.route.canonical;
const ovalRelatedGames = selectRelatedGames(ovalFaceGame).recommendations.map(({ game }) => {
  const reviewedLegacyCard = ovalPage.relatedCards.find((card) => card.gameId === game.id);
  return {
    gameId: game.id,
    title: reviewedLegacyCard?.title ?? game.name,
    text: reviewedLegacyCard?.text ?? game.content.summary,
    href: getPublicGameHref(game),
    external: game.pageType === "EXTERNAL_TOOL"
  };
});

const ovalGalleryPreviewItems = [
  {
    title: "Soft Oval",
    src: "/games/oval-face-icon.png",
    alt: "Rounded pale face icon with brown hair, closed eyes, and a pink smile",
    width: 512,
    height: 512
  },
  curatedIconIdeas.cute,
  curatedIconIdeas.retro,
  curatedIconIdeas.minimal,
  curatedIconIdeas.gamer,
  curatedIconIdeas.classic
] as const satisfies readonly CuratedIconIdea[];

const ovalSidebarItems: GameSidebarItem[] = [
  ...ovalPage.sidebarGames,
  {
    title: "Free Avatar Maker",
    text: "Use a fast avatar workflow for profile pictures and icons.",
    href: "/free-avatar-maker",
    imageSrc: "/game-face-samples/ideas/discord-pfp.webp",
    imageAlt: "Free avatar maker preview"
  },
  {
    title: "Square Avatar Guide",
    text: "Learn how square and oval face icons work for profiles.",
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

export const metadata = buildGameMetadata(ovalFaceGame);

export default function OvalFaceIconGeneratorPage() {
  const videoGameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
name: ovalFaceGame.name,
    description: content.videoGameDescription,
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
name: ovalFaceGame.name,
        item: pageUrl
      }
    ]
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      <main>
        <section className="game-station oval-game-hero" id="game-player">
          <div className="game-station-grid">
            <div className="game-station-main">
              <div className="game-title-block">
<p className="eyebrow">{content.hero.eyebrow}</p>
              <h1>{getGamePageH1(ovalFaceGame)}</h1>
              <p className="hero-text">{content.hero.intro}</p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="hero-primary-link" href="#game-player">
                  <CirclePlay aria-hidden="true" size={20} />
                  {content.hero.playLabel}
                </a>
<a className="hero-secondary-link" href="#how-to-play">{content.hero.howToPlayLabel}</a>
                <FavoriteToggle
                  gameId={ovalFaceGame.id}
                  gameName={ovalFaceGame.name}
                  pageType={ovalFaceGame.pageType}
                  variant="detail"
                  showViewLink
                />
              </div>
            </div>
            <div className="game-card station-game-card">
            <div className="game-card-header">
              <div>
<p className="tool-card-kicker">{content.card.label}</p>
<h2>{content.card.title}</h2>
                <p className="tool-card-description">{content.card.description}</p>
              </div>
<span className="tool-card-badge">{content.card.badge}</span>
            </div>
            <FlashGenerator {...ovalPage.player} />
          </div>
            </div>
            <GameSidebar items={ovalSidebarItems} />
          </div>
        </section>

        <CuratedGalleryPreview
          title="Curated Icon Ideas"
          intro="Browse six site-curated face styles for color and expression ideas before making a softer oval avatar."
          trustNote="Site-curated examples — not community submissions."
          items={ovalGalleryPreviewItems}
          variant="compact"
        />

        <section className="content-band" id="what-is">
          <div className="section-heading">
<p className="eyebrow">{content.about.eyebrow}</p>
<h2>{content.about.title}</h2>
            <p className="section-intro">{content.about.text}</p>
          </div>
        </section>

        <section className="content-band alt-band" id="how-to-play">
          <div className="section-heading">
<p className="eyebrow">{content.headings.howToPlayEyebrow}</p>
<h2>{content.headings.howToPlay}</h2>
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
<p className="eyebrow">{content.headings.featuresEyebrow}</p>
<h2>{content.headings.features}</h2>
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
<p className="eyebrow">{content.headings.tipsEyebrow}</p>
<h2>{content.headings.tips}</h2>
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
<p className="eyebrow">{content.headings.troubleshootingEyebrow}</p>
<h2>{content.headings.troubleshooting}</h2>
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
<p className="eyebrow">{content.headings.faqEyebrow}</p>
<h2>{content.headings.faq}</h2>
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

        {ovalRelatedGames.length > 0 ? (
          <section className="content-band alt-band" aria-labelledby="related-avatar-games-heading">
            <div className="section-heading">
<p className="eyebrow">{content.headings.relatedEyebrow}</p>
<h2 id="related-avatar-games-heading">{content.headings.related}</h2>
            </div>
            <div className="related-grid" aria-label="Related avatar games and tools">
              {ovalRelatedGames.map((item) => (
                <div className="favoritable-game-card favoritable-related-card" key={item.gameId}>
                  <a
                    className={`related-card${item.external ? " route-game-link-external" : ""}`}
                    data-game-id={item.gameId}
                    data-game-page-type={item.external ? "EXTERNAL_TOOL" : "GAME"}
                    href={item.href}
                  >
                    <Sparkles aria-hidden="true" size={20} />
                    {item.external ? <span className="route-game-type">External tool</span> : null}
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    {item.external ? <span className="route-card-action">View access details</span> : null}
                  </a>
                  <FavoriteToggle
                    gameId={item.gameId}
                    gameName={item.title}
                    pageType={item.external ? "EXTERNAL_TOOL" : "GAME"}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="content-band" aria-labelledby="avatar-guides-heading">
          <div className="section-heading">
            <h2 id="avatar-guides-heading">Avatar guides and inspiration</h2>
          </div>
          <div className="related-grid" aria-label="Avatar guides and inspiration">
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
            <a href="/pixel-art-avatar-icon-generator">Pixel Art Avatar Icon Generator</a>
            <a href="/games">All avatar games</a>
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
