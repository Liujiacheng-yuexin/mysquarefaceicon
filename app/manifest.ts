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
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
