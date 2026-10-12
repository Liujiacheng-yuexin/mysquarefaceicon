export type GameCategoryDefinition = {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
};

const categoryDefinitions = [
  {
    slug: "face-makers",
    name: "Face Makers",
    description: "Browse browser-based tools centered on choosing and combining facial features for profile icons."
  },
  {
    slug: "avatar-makers",
    name: "Avatar Makers",
    description: "Browse tools for creating profile avatars, icons, and lightweight character portraits."
  },
  {
    slug: "pixel-avatars",
    name: "Pixel Avatars",
    description: "Browse pixel-art and chibi-style avatar tools with clear on-site or external-use boundaries."
  },
  {
    slug: "retro-flash",
    name: "Retro Flash",
    description: "Browse preserved creator experiences that run in the browser through a compatible Flash runtime."
  },
  {
    slug: "character-creators",
    name: "Character Creators",
    description: "Browse focused tools for building a character look that can work as an avatar or profile image."
  },
  {
    slug: "friend-quizzes",
    name: "Friend Quizzes",
    description: "Make a friendly quiz with a face of your choice, share your ten picks, and compare results with friends."
  }
] as const satisfies readonly GameCategoryDefinition[];

export type GameCategorySlug = (typeof categoryDefinitions)[number]["slug"];

export const gameCategories: readonly GameCategoryDefinition[] = Object.freeze(categoryDefinitions);

const categoriesBySlug = new Map(gameCategories.map((category) => [category.slug, category]));

export function getGameCategory(slug: string): GameCategoryDefinition | undefined {
  return categoriesBySlug.get(slug);
}
