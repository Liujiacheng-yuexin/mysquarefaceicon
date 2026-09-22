import { ChevronRight, Grid2X2, PencilLine, Smile, UserRound, Zap, type LucideIcon } from "lucide-react";
import GameLink from "./GameLink";
import type { GameCategoryDefinition } from "../../data/game-categories";

export type CategoryChipVariant = "default" | "home-discovery";

type CategoryChipProps = {
  readonly category: GameCategoryDefinition;
  readonly gameCount: number;
  readonly variant?: CategoryChipVariant;
  readonly reloadDocument?: boolean;
};

const categoryIcons: Readonly<Record<string, LucideIcon>> = {
  "face-makers": Smile,
  "avatar-makers": UserRound,
  "pixel-avatars": Grid2X2,
  "retro-flash": Zap,
  "character-creators": PencilLine
};

function getCountLabel(gameCount: number) {
  return `${gameCount} current ${gameCount === 1 ? "entry" : "entries"}`;
}

export default function CategoryChip({ category, gameCount, variant = "default", reloadDocument = false }: CategoryChipProps) {
  if (variant === "default") {
    return (
      <GameLink className="category-chip" href={`/category/${category.slug}`} reloadDocument={reloadDocument} data-category-slug={category.slug}>
        <strong>{category.name}</strong>
        <span>{getCountLabel(gameCount)}</span>
      </GameLink>
    );
  }

  const CategoryIcon = categoryIcons[category.slug] ?? Grid2X2;

  return (
    <GameLink
      className="category-chip category-chip-home"
      href={`/category/${category.slug}`}
      reloadDocument={reloadDocument}
      data-category-slug={category.slug}
      data-category-chip-variant="home-discovery"
    >
      <span className="home-category-icon" aria-hidden="true">
        <CategoryIcon size={25} strokeWidth={2.1} />
      </span>
      <span className="home-category-copy">
        <strong>{category.name}</strong>
        <span>{getCountLabel(gameCount)}</span>
      </span>
      <ChevronRight className="home-category-chevron" aria-hidden="true" size={18} strokeWidth={2.2} />
    </GameLink>
  );
}
