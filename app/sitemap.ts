import type { MetadataRoute } from "next";
import { getLocaleUrl, localeCodes } from "@/lib/locales";

const baseUrl = "https://mysquarefaceicon.com";

const contentPaths = [
  "/about-us",
  "/free-avatar-maker",
  "/square-avatar-generator",
  "/gallery",
  "/square-face-icon-generator",
  "/cute-square-avatar-generator",
  "/pixel-square-face-maker",
  "/blog",
  "/blog/avatar-maker-without-signup",
  "/blog/cute-profile-picture-ideas",
  "/blog/best-discord-avatar-style",
  "/blog/how-to-make-a-cute-discord-profile-icon",
  "/blog/discord-avatar-size-guide",
  "/blog/tiktok-profile-icon-ideas",
  "/blog/square-avatar-vs-round-avatar"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-17");

  return [
    ...localeCodes.map((locale) => ({
      url: getLocaleUrl(locale),
      lastModified,
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.8
    }) satisfies MetadataRoute.Sitemap[number]),
    ...contentPaths.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency: "monthly",
      priority: path === "/blog" ? 0.65 : path === "/about-us" ? 0.45 : 0.7
    }) satisfies MetadataRoute.Sitemap[number]),
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];
}
