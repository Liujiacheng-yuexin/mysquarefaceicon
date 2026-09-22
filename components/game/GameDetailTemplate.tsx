import { ArrowLeft, ChevronRight, Gamepad2, Grid2X2 } from "lucide-react";
import Link from "next/link";
import GameLink from "./GameLink";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import type { GamePlayerModel } from "../../lib/games/game-player-model";
import { assertValidGamePlayerModel } from "../../lib/games/game-player-model";
import type { GameRecord } from "../../lib/games/game-schema";
import { resolveCategoryRoute } from "../../lib/games/routes";
import {
  buildGameStructuredData,
  serializeGameStructuredData
} from "../../lib/seo/game-structured-data";
import { getGamePageH1 } from "../../lib/seo/game-metadata";
import GameBreadcrumb from "./GameBreadcrumb";
import GameFaq from "./GameFaq";
import GameMeta from "./GameMeta";
import GamePlayer from "./GamePlayer";
import GameSourceRights from "./GameSourceRights";
import RelatedGames from "./RelatedGames";
import FavoriteToggle from "./FavoriteToggle";

type GameDetailTemplateProps = {
  readonly game: GameRecord;
  readonly playerModel: GamePlayerModel;
  readonly relatedGameRecords?: readonly GameRecord[];
};

function getAvailableCategories(game: GameRecord) {
  const seen = new Set<string>();
  return [game.category.primary, ...game.category.secondary].flatMap((slug) => {
    if (seen.has(slug)) return [];
    seen.add(slug);
    const route = resolveCategoryRoute(slug);
    return route ? [route.category] : [];
  });
}

export default function GameDetailTemplate({ game, playerModel, relatedGameRecords }: GameDetailTemplateProps) {
  assertValidGamePlayerModel(playerModel);
  if (playerModel.id !== game.id || playerModel.type !== game.type) {
    throw new Error(`GameDetailTemplate received a player model that does not match ${game.id}.`);
  }

  const description = game.content.description ?? [];
  const availableCategories = getAvailableCategories(game).slice(0, 2);
  const structuredData = buildGameStructuredData(game);
  const hasFeaturesOrTips = game.features.length > 0 || game.tips.length > 0;

  return (
    <>
      <SiteHeader
        mobileStartHref="#game-player"
        mobileStartLabel={game.pageType === "EXTERNAL_TOOL" ? "Open" : "Play"}
      />
      <main className="game-detail-shell">
        <GameBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Games", href: "/games" },
            { label: game.name }
          ]}
        />

        <header className="game-detail-heading">
          <h1>{getGamePageH1(game)}</h1>
          <p>{game.content.summary}</p>
          <FavoriteToggle
            gameId={game.id}
            gameName={game.name}
            pageType={game.pageType}
            variant="detail"
            showViewLink
          />
        </header>

        <section id="game-player" className="game-detail-player" aria-label={`${game.name} experience`}>
          <GamePlayer model={playerModel} />
        </section>

        <section className="game-detail-meta" aria-label={`${game.name} facts`}>
          <GameMeta game={game} />
        </section>

        <RelatedGames game={game} records={relatedGameRecords} variant="detail-related" />

        {game.howToPlay.length > 0 ? (
          <section className="game-detail-section game-detail-how-to" aria-labelledby={`game-how-to-${game.id}`}>
            <h2 id={`game-how-to-${game.id}`}>How to play {game.name}</h2>
            <ol>
              {game.howToPlay.map((step, index) => (
                <li key={step.title}>
                  <span className="game-detail-step-number" aria-hidden="true">{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {description.length > 0 ? (
          <section className="game-detail-section game-detail-about" aria-labelledby={`game-about-${game.id}`}>
            <h2 id={`game-about-${game.id}`}>About {game.name}</h2>
            <div className="game-detail-about-copy">
              {description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>
        ) : null}

        {hasFeaturesOrTips ? (
          <section className="game-detail-section game-detail-features-tips" aria-label={`${game.name} features and tips`}>
            {game.features.length > 0 ? (
              <div>
                <h2>Features</h2>
                <ul className="game-detail-feature-list">
                  {game.features.map((feature) => (
                    <li key={feature.title}>
                      <span aria-hidden="true" />
                      <div>
                        <h3>{feature.title}</h3>
                        <p>{feature.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {game.tips.length > 0 ? (
              <div>
                <h2>Tips</h2>
                <ul className="game-detail-tip-list">
                  {game.tips.map((tip) => (
                    <li key={tip}>
                      <span aria-hidden="true" />
                      <p>{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        <GameFaq gameId={game.id} items={game.faq} />
        <GameSourceRights game={game} />

        <nav className="game-detail-more" aria-labelledby={`game-more-${game.id}`}>
          <h2 id={`game-more-${game.id}`}>More avatar games</h2>
          <div className="game-detail-more-links">
            <GameLink href="/games">
              <Gamepad2 aria-hidden="true" size={23} />
              <span>Browse all avatar games</span>
              <ChevronRight aria-hidden="true" size={20} />
            </GameLink>
            {availableCategories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <Grid2X2 aria-hidden="true" size={22} />
                <span>{category.name}</span>
                <ChevronRight aria-hidden="true" size={20} />
              </Link>
            ))}
            <Link className="game-detail-return" href="/">
              <ArrowLeft aria-hidden="true" size={22} />
              <span>Return to Square Face Generator</span>
              <ChevronRight aria-hidden="true" size={20} />
            </Link>
          </div>
        </nav>
      </main>

      {structuredData.map((value, index) => (
        <script
          key={`${game.id}-structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeGameStructuredData(value) }}
        />
      ))}
      <SiteFooter />
    </>
  );
}
