import type { MetadataRoute } from "next";
import { getLocaleUrl, reviewedLocaleCodes } from "@/lib/locales";
import { gameCatalog } from "@/lib/games/catalog";
import { isIndexAllowedNewGame } from "@/lib/games/friend-quiz-policy";

const baseUrl = "https://mysquarefaceicon.com";

const contentPaths = [
  "/about-us",
  "/contact",
  "/editorial-policy",
  "/free-avatar-maker",
  "/oval-face-icon-generator",
  "/pixel-art-avatar-icon-generator",
  "/square-avatar-generator",
  "/gallery",
  "/square-face-icon-generator",
  "/blog",
  "/discord-banner-size",
  "/blog/avatar-maker-without-signup",
  "/blog/cute-profile-picture-ideas",
  "/blog/best-discord-avatar-style",
  "/blog/how-to-make-a-cute-discord-profile-icon",
  "/blog/discord-avatar-size-guide",
  "/blog/tiktok-profile-icon-ideas",
  "/blog/square-avatar-vs-round-avatar"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...gameCatalog.filter(isIndexAllowedNewGame).map((game) => ({ url: game.seo.canonical, changeFrequency: "monthly", priority: 0.7 }) satisfies MetadataRoute.Sitemap[number]),
    ...reviewedLocaleCodes.map((locale) => ({
      url: getLocaleUrl(locale),
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.8
    }) satisfies MetadataRoute.Sitemap[number]),
    ...contentPaths.map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: "monthly",
      priority: path === "/blog" ? 0.65 : path === "/about-us" ? 0.45 : 0.7
    }) satisfies MetadataRoute.Sitemap[number]),
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms-of-service`,
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];
}
