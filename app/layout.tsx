import type { Metadata, Viewport } from "next";
import DeferredThirdPartyScripts from "@/components/DeferredThirdPartyScripts";
import "./globals.css";

const siteUrl = "https://mysquarefaceicon.com";
const googleAnalyticsId = "G-VPL9X65STX";
const googleAdsenseClient = "ca-pub-9616934112105331";
const siteTitle = "Square Face Generator - Play the Classic Flash Avatar Game Online";
const siteDescription =
  "Play Square Face Generator online, a classic Flash avatar maker game where you can create funny square face icons in your browser. No Flash Player required.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | My Square Face Icon"
  },
  description: siteDescription,
  applicationName: "My Square Face Icon",
  authors: [{ name: "My Square Face Icon" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "My Square Face Icon",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "My Square Face Icon square avatar generator preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.svg"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/favicon180.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#20b8aa",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `
          }}
        />
      </head>
      <body>
        {children}
        <DeferredThirdPartyScripts
          googleAdsenseClient={googleAdsenseClient}
          cloudflareAnalyticsToken={process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN}
        />
      </body>
    </html>
  );
}
