import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GameDetailTemplate from "@/components/game/GameDetailTemplate";
import { createGamePlayerModel } from "@/lib/games/game-player-model";
import { getNewGameStaticParams, resolveNewGameSlug } from "@/lib/games/routes";
import { buildGameMetadata, buildMissingGameMetadata } from "@/lib/seo/game-metadata";

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

  return buildGameMetadata(game, { forceNoIndex: true });
}

export default function NewGameRoutePage({ params }: NewGameRoutePageProps) {
  const game = resolveNewGameSlug(params.slug);
  if (!game) notFound();

  const playerModel = createGamePlayerModel(game, {
    labels: {
      start: "Play Game",
      reload: "Reload Game",
      help: "Report Issue"
    },
    showStartControl: false
  });

  return <GameDetailTemplate game={game} playerModel={playerModel} />;
}
