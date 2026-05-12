import Script from "next/script";

export default function CloudflareAnalytics() {
  const token = process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN;
  if (!token) return null;

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
      strategy="afterInteractive"
    />
  );
}
