import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const pageUrl = "https://mysquarefaceicon.com/editorial-policy";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "Read the My Square Face Icon editorial policy for content sources, asset rights, AI-assisted drafts, moderation, corrections, and page quality standards.",
  alternates: {
    canonical: pageUrl
  },
  openGraph: {
    type: "website",
    url: pageUrl,
    title: "Editorial Policy",
    description:
      "How My Square Face Icon handles content sources, asset rights, AI-assisted drafts, corrections, and community moderation.",
    images: ["/og-image.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial Policy",
    description:
      "Content sources, asset rights, AI-assisted drafts, moderation, and corrections at My Square Face Icon.",
    images: ["/og-image.svg"]
  }
};

export default function EditorialPolicyPage() {
  const policySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Editorial Policy",
    url: pageUrl,
    about: ["content quality", "AI transparency", "comment moderation", "corrections"]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(policySchema) }} />
      <SiteHeader />
      <main className="resource-page">
        <a className="back-link" href="/#maker">Back to the generator</a>
        <p className="eyebrow">Editorial standards</p>
        <h1>Editorial Policy</h1>
        <p className="lead">
          My Square Face Icon is a tool-first website. Pages are published only when they support the generator, answer a real avatar-making question, or improve trust and usability.
        </p>

        <section>
          <h2>Editorial Policy for Content Sources and Asset Rights</h2>
          <p>
            Editorial standards prohibit copying competitor text, screenshots, user comments, image packs, or downloadable assets. Homepage examples are site-curated; the gallery combines simple style examples with approved community submissions when available. Selection, moderation, or generation by a tool does not establish authorship or grant image-use rights. Claims about sources and permissions require evidence for the specific file or asset. Permissions for the Square and Oval game files and their generated images remain unverified.
          </p>
          <p>
            This editorial policy also requires corrections, source notes, and asset claims to remain traceable to the page where they appear.
          </p>
        </section>

        <section>
          <h2>AI Assistance and Review</h2>
          <p>
            Draft copy, outlines, or visual ideas may be assisted by AI tools. Pages must still be reviewed for usefulness, accuracy, originality, and user intent before they are treated as indexable SEO pages.
          </p>
          <p>
            Localized pages are not treated as search-ready until the translation has been reviewed. Draft language pages are kept out of the sitemap and marked noindex.
          </p>
        </section>

        <section>
          <h2>Page Quality Rules</h2>
          <div className="feature-grid">
            <article className="info-card">
              <h3>Unique intent</h3>
              <p>New pages need a distinct user problem, not just a keyword variation.</p>
            </article>
            <article className="info-card">
              <h3>Real utility</h3>
              <p>Support pages should include practical steps, examples, checks, or links back to the generator workflow.</p>
            </article>
            <article className="info-card">
              <h3>Search controls</h3>
              <p>Weak, duplicate, or draft pages can be noindexed and removed from the sitemap until improved.</p>
            </article>
          </div>
        </section>

        <section>
          <h2>Corrections and Moderation</h2>
          <p>
            Public comments and optional images are moderated before display. Content correction requests can be sent through the <a href="/contact">contact page</a>.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
