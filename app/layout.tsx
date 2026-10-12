import type { Metadata, Viewport } from "next";
import DeferredThirdPartyScripts from "@/components/DeferredThirdPartyScripts";
import { friendQuizBootstrap } from "@/lib/games/friend-quiz-bootstrap";
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
        <script data-cfasync="false" dangerouslySetInnerHTML={{ __html: friendQuizBootstrap }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var localFilePage = true;
              var friendQuizPage = false;
              try {
                var decodedPath = decodeURIComponent(window.location.pathname);
                friendQuizPage = /^\\/games\\/friend-block-test\\/?$/.test(decodedPath);
                localFilePage = /^\\/discord-banner-size\\/?$/.test(decodedPath) || /^\\/games\\/friend-block-test\\/.+/.test(decodedPath);
              } catch (_) {}
              if (!localFilePage) {
                window.dataLayer = window.dataLayer || [];
                window.gtag = function(){dataLayer.push(arguments);};
                gtag('js', new Date());
                if (friendQuizPage) {
                  // Only the public page identity is measured, never invitation data.
                  gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
                  gtag('set', 'ads_data_redaction', true);
                  window.adsbygoogle = window.adsbygoogle || [];
                  window.adsbygoogle.requestNonPersonalizedAds = 1;
                  gtag('config', '${googleAnalyticsId}', { page_location: window.location.origin + '/games/friend-block-test', page_referrer: document.referrer.split('#')[0], allow_ad_personalization_signals: false });
                } else {
                  gtag('config', '${googleAnalyticsId}');
                }
                var analytics = document.createElement('script');
                analytics.async = true;
                if (friendQuizPage) analytics.referrerPolicy = 'no-referrer';
                analytics.src = 'https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}';
                document.head.appendChild(analytics);
              }
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
