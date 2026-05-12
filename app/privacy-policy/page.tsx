import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for My Square Face Icon, a free browser-based square face generator.",
  alternates: {
    canonical: "/privacy-policy"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <a className="back-link" href="/">Back to Square Face Generator</a>
      <h1>Privacy Policy</h1>
      <p>Last updated: May 12, 2026</p>
      <p>
        My Square Face Icon is designed as a browser-based avatar tool. The main
        game runs through Ruffle, and a small HTML5 Canvas fallback may appear if
        the Flash game cannot load.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We do not require accounts to use the generator. If you submit a public
        comment, we collect the name, email address, rating, comment text, and
        optional image you provide. Your email is used for moderation context and
        is not displayed publicly.
      </p>
      <h2>Generated Images</h2>
      <p>
        The game and fallback run in your browser. If you save or download an
        image, the save action is handled by your browser and the active tool
        workflow.
      </p>
      <h2>Comment Images</h2>
      <p>
        Optional comment images are limited to JPG, PNG, WebP, or GIF files up to
        2MB. Approved comments may show the uploaded image publicly. Rejected or
        deleted comments may have their image removed from storage.
      </p>
      <h2>Cookies and Local Storage</h2>
      <p>
        The site may use local storage to remember whether you dismissed the PWA
        install prompt. The moderation area may use configured secrets or request
        headers to protect admin actions.
      </p>
      <h2>Analytics and Advertising</h2>
      <p>
        Advertising is not enabled by default. Cloudflare Web Analytics may be
        added when a site token is configured, helping measure aggregate traffic
        without requiring accounts.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy questions, contact the site owner through the contact method
        published with the production site.
      </p>
    </main>
  );
}
