import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for My Square Face Icon, a free browser-based square face generator.",
  alternates: {
    canonical: "https://mysquarefaceicon.com/privacy-policy"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <a className="back-link" href="/">Back to Square Face Generator</a>
      <h1>Privacy Policy</h1>
      <p>Last updated: May 21, 2026</p>
      <p>
        My Square Face Icon is designed as a browser-based classic Flash avatar
        maker page. The main game runs through Ruffle so visitors can play the
        SWF game in modern browsers without installing Adobe Flash Player.
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
        The game runs in your browser. If you save an image through the original
        game or take a screenshot of your creation, that action is handled by
        your browser or device.
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
        install prompt and to keep a simple visitor ID for comment likes. The
        visitor ID is used to reduce duplicate likes from the same browser and is
        not a login account.
      </p>
      <p>
        Comment likes may store a hashed visitor identifier with the comment ID
        in Cloudflare KV. This helps count likes without showing your identity on
        the public page. The moderation area may use configured secrets or
        request headers to protect admin actions.
      </p>
      <h2>Analytics and Advertising</h2>
      <p>
        Advertising is not enabled by default. Cloudflare Web Analytics may be
        added when a site token is configured, helping measure aggregate traffic
        without requiring accounts.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy questions, use the <a href="/contact">contact page</a> or email
        <a href="mailto:contact@mysquarefaceicon.com"> contact@mysquarefaceicon.com</a>.
      </p>
    </main>
  );
}
