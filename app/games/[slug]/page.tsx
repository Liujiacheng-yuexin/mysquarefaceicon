import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GameDetailTemplate from "@/components/game/GameDetailTemplate";
import { createGamePlayerModel } from "@/lib/games/game-player-model";
import { getNewGameStaticParams, resolveNewGameSlug } from "@/lib/games/routes";
import { buildGameMetadata, buildMissingGameMetadata } from "@/lib/seo/game-metadata";
import { isIndexAllowedNewGame } from "@/lib/games/friend-quiz-policy";

type NewGameRoutePageProps = {
  params: {
    slug: string;
  };
};

// Future allowlisted records can be pre-rendered, while rejected slugs still run
// through the resolver and the shared, recoverable 404 boundary.
export const dynamicParams = true;

export function generateStaticParams() {
  return getNewGameStaticParams();
}

export function generateMetadata({ params }: NewGameRoutePageProps): Metadata {
  const game = resolveNewGameSlug(params.slug);
  if (!game) {
    return buildMissingGameMetadata();
  }

  return buildGameMetadata(game, { forceNoIndex: !isIndexAllowedNewGame(game) });
}

export default function NewGameRoutePage({ params }: NewGameRoutePageProps) {
  const game = resolveNewGameSlug(params.slug);
  if (!game) notFound();

  const playerModel = createGamePlayerModel(game, {
    labels: {
      start: game.id === "friend-block-test" ? "Start Friend Block Test" : "Play Game",
      reload: "Reload Game",
      help: "Report Issue"
    },
    showStartControl: false,
    ...(game.id === "friend-block-test" ? {
      maxWidth: "760px", aspectRatio: "8 / 5", backgroundColor: "#fffdf8",
      labels: { start: "Start Friend Block Test", cover: "Start Friend Block Test", reload: "Restart quiz", help: "Report Issue" }
    } : {})
  });

  return <GameDetailTemplate game={game} playerModel={playerModel} />;
}
