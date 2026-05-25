import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Square Face Icon",
    short_name: "Square Face",
    description: "Create cute square face icons online with a Ruffle-powered avatar game.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7fbfa",
    theme_color: "#20b8aa",
    icons: [
      {
        src: "/favicon192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/favicon512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
