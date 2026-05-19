import type { Metadata, Viewport } from "next";
import Script from "next/script";
import CloudflareAnalytics from "@/components/CloudflareAnalytics";
import "./globals.css";

const siteUrl = "https://mysquarefaceicon.com";
const googleAnalyticsId = "G-VPL9X65STX";
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
    icon: "/favicon.svg",
    apple: "/favicon.svg"
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
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
