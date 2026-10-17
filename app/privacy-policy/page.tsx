import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for My Square Face Icon: comments, local storage, cookies, Google AdSense advertising, analytics, and your choices.",
  alternates: {
    canonical: "https://mysquarefaceicon.com/privacy-policy"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <a className="back-link" href="/">Back to Square Face Generator</a>
        <h1>Privacy Policy</h1>
        <p>Last updated: October 17, 2026</p>
        <p>
          My Square Face Icon (mysquarefaceicon.com) is designed as a browser-based classic Flash avatar
          maker page. The main game runs through Ruffle so visitors can play the
          SWF game in modern browsers without installing Adobe Flash Player.
        </p>
        <p>
          This privacy policy explains what information is provided through public
          comments, what this browser stores locally, which cookies and identifiers
          third-party analytics and advertising services may use, and the choices
          you have.
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
        <h2>Advertising and Google AdSense</h2>
        <p>
          Public pages may display ads served by Google AdSense. Third-party vendors,
          including Google, use cookies to serve ads based on a user&apos;s prior visits
          to this website or other websites. Google&apos;s use of advertising cookies
          enables it and its partners to serve ads to you based on your visit to this
          site and/or other sites on the Internet. These vendors may also use web
          beacons, device identifiers, and IP addresses to measure ads and limit how
          often you see them.
        </p>
        <p>
          You may opt out of personalized advertising by visiting Google&apos;s{" "}
          <a href="https://adssettings.google.com" rel="noopener noreferrer">Ads Settings</a>.
          You can also opt out of some third-party vendors&apos; use of cookies for
          personalized advertising at{" "}
          <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer">www.aboutads.info</a>{" "}
          or, in Europe,{" "}
          <a href="https://www.youronlinechoices.eu/" rel="noopener noreferrer">www.youronlinechoices.eu</a>.
          Opting out of personalization does not remove ads; you may still see
          non-personalized ads.
        </p>
        <p>
          To learn how Google uses data when you visit sites that use its services, see{" "}
          <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer">
            How Google uses information from sites or apps that use our services
          </a>
          . We do not send names, email addresses, comment text, or Friend Block Test
          quiz data to advertising services, and we do not ask the ad code to target
          ads using sensitive categories.
        </p>
        <h2>Analytics</h2>
        <p>
          Public pages may use Google Analytics and Cloudflare Web Analytics to measure
          visits and performance. These services can receive page, device and network
          information, and Google Analytics may set cookies subject to consent and
          browser settings. You can block analytics with your browser&apos;s cookie
          controls or with the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer">
            Google Analytics opt-out browser add-on
          </a>
          . Friend Block Test does not send quiz nicknames, answers, scores or
          share-link contents to these services. On that page, analytics and ad storage
          and ad personalization default to denied. Ad availability depends on consent,
          browser settings and the provider; this does not require a game account.
        </p>
        <h2>Consent for Visitors in Europe</h2>
        <p>
          Where the law requires consent, for example for visitors in the European
          Economic Area, the United Kingdom, or Switzerland, a consent message may ask
          whether cookies and similar technologies can be used for personalized ads and
          measurement. Your choice controls whether those uses are allowed, and you can
          change it later from the same message or by clearing this site&apos;s cookies.
        </p>
        <h2>Hosting and Security Logs</h2>
        <p>
          The site is delivered through Cloudflare. Like most web hosts, Cloudflare
          processes IP addresses and request details to deliver pages, block abuse,
          and keep the service secure. Comment text is stored in Cloudflare KV and
          optional comment images are stored in Cloudflare R2.
        </p>
        <h2>Location Data</h2>
        <p>
          The site does not request precise location from your device. Advertising
          and analytics providers may estimate a general region from your IP address.
        </p>
        <h2>Children&apos;s Privacy</h2>
        <p>
          The site is not directed to children under 13, and we do not knowingly
          collect personal information from them. If you believe a child has submitted
          a comment with personal information, contact us and we will review and
          remove it.
        </p>
        <h2>Your Choices and Requests</h2>
        <p>
          You can clear cookies and local storage for this site in your browser at any
          time. To ask for a comment or uploaded image to be corrected or removed, send
          the comment name, date and page URL through the contact details below.
        </p>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy when the site adds or changes features, analytics,
          or advertising. The date at the top of this page shows the latest revision.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy questions, use the <a href="/contact">contact page</a> or email
          <a href="mailto:contact@mysquarefaceicon.com"> contact@mysquarefaceicon.com</a>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
