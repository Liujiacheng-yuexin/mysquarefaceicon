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
      <p>Last updated: October 13, 2026</p>
      <p>
        My Square Face Icon is designed as a browser-based classic Flash avatar
        maker page. The main game runs through Ruffle so visitors can play the
        SWF game in modern browsers without installing Adobe Flash Player.
      </p>
      <p>
        This privacy policy explains what information is provided through public
        comments, how moderation uses it, and which details are not shown publicly.
      </p>
      <h2>Privacy Policy: Information We Collect</h2>
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
        This browser may also save the stable ID and start time of recently played
        games to show Continue Playing. You can remove that history with Clear
        history, and it does not sync across devices.
      </p>
      <p>
        If you use Favorite or Save tool, this browser stores only stable game IDs
        so it can show your saved games and tools on the Games page. Favorites do
        not contain account or personal information and do not sync across devices.
        Press the Favorited or Saved tool button again to remove an item, or clear
        this site&apos;s stored data in your browser settings.
      </p>
      <p>
        Comment likes may store a hashed visitor identifier with the comment ID
        in Cloudflare KV. This helps count likes without showing your identity on
        the public page. The moderation area may use configured secrets or
        request headers to protect admin actions.
      </p>
      <h2>Friend Quiz Links and Results</h2>
      <p>
        Friend Block Test processes nicknames, answers and scores in your browser without uploading them.
        Quiz and result links contain their data after # and can be read by anyone who has the link.
        This browser keeps up to 20 created-quiz identifiers and the latest 50 received results
        (nicknames, avatars and scores), with no account or device sync. The original answer list
        is carried in the link, not the local results list. Use Clear quiz records in the game to
        remove its identifiers and results. Storage restrictions or clearing site data may prevent
        collecting future results for a quiz. The surrounding quiz page uses Google Analytics,
        AdSense and Cloudflare Web Analytics. The private link fragment is removed from the
        outer page address before those scripts run and passed locally to the embedded game;
        it is not included in analytics page URLs. The embedded game does not load analytics
        or ads. Keep the original invitation or use the game&apos;s Copy link button to share
        or reopen it; copying the cleaned address bar does not copy the quiz.
      </p>
      <h2>Analytics and Advertising</h2>
      <p>
        Public pages may use Google Analytics, Google AdSense and Cloudflare Web Analytics
        to measure visits and performance and display ads. These services can receive
        page, device and network information and may use cookies subject to consent and
        browser settings. Friend Block Test does not send quiz nicknames, answers, scores
        or share-link contents to these services. On that page, analytics and ad storage
        and ad personalization default to denied. Ad availability depends on consent,
        browser settings and the provider; this does not require a game account.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy questions, use the <a href="/contact">contact page</a> or email
        <a href="mailto:contact@mysquarefaceicon.com"> contact@mysquarefaceicon.com</a>.
      </p>
    </main>
  );
}
