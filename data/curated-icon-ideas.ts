export type CuratedIconIdea = {
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const curatedIconIdeas = {
  cute: {
    title: "Cute",
    src: "/game-face-samples/cute.webp",
    alt: "Cute square face icon with pigtails, blush cheeks, and a red hair bow",
    width: 512,
    height: 512
  },
  retro: {
    title: "Retro",
    src: "/game-face-samples/retro.webp",
    alt: "Retro smiling square face icon with a red hair clip",
    width: 512,
    height: 512
  },
  funny: {
    title: "Funny",
    src: "/game-face-samples/funny.webp",
    alt: "Funny square face icon with spiral eyes and a toothy grin",
    width: 512,
    height: 512
  },
  minimal: {
    title: "Minimal",
    src: "/game-face-samples/minimal.webp",
    alt: "Minimal square face icon with closed eyes and a small expression",
    width: 512,
    height: 512
  },
  gamer: {
    title: "Gamer",
    src: "/game-face-samples/gamer.webp",
    alt: "Square face icon with large black glasses and a focused expression",
    width: 512,
    height: 512
  },
  classic: {
    title: "Classic",
    src: "/game-face-samples/classic.webp",
    alt: "Classic pale square face icon with fine brown hair lines and a pink smile",
    width: 512,
    height: 512
  }
} as const satisfies Record<string, CuratedIconIdea>;

export const homeCuratedIconIdeas = [
  curatedIconIdeas.cute,
  curatedIconIdeas.retro,
  curatedIconIdeas.funny,
  curatedIconIdeas.minimal,
  curatedIconIdeas.gamer,
  curatedIconIdeas.classic
] as const satisfies readonly CuratedIconIdea[];
