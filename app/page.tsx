import HomePage from "@/components/HomePage";
import { requireLegacyGamePath } from "@/lib/games/routes";
import { getLanguageAlternates, getLocaleUrl } from "@/lib/locales";
import { buildGameMetadata } from "@/lib/seo/game-metadata";

const squareFaceGame = requireLegacyGamePath("/");

export const metadata = buildGameMetadata(squareFaceGame, {
  languages: {
    ...getLanguageAlternates(),
    "x-default": getLocaleUrl("en")
  },
  openGraphLocale: "en_US"
});

export default function Home() {
  return <HomePage locale="en" />;
}
