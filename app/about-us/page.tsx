import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const pageUrl = "https://mysquarefaceicon.com/about-us";

export const metadata: Metadata = {
  title: "About My Square Face Icon",
  description:
    "Learn about My Square Face Icon, a free browser-based square face generator focused on cute profile icons, privacy, and original avatar resources.",
  alternates: {
    canonical: pageUrl
  },
  openGraph: {
    type: "website",
    url: pageUrl,
    title: "About My Square Face Icon",
    description:
      "A practical, privacy-aware avatar tool site for making cute square face icons in the browser.",
    images: ["/og-image.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "About My Square Face Icon",
    description:
      "Learn why My Square Face Icon exists and how the site approaches free avatar tools, privacy, and original content.",
    images: ["/og-image.svg"]
  }
};

export default function AboutUsPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About My Square Face Icon",
    description:
      "About page for My Square Face Icon, a free browser-based square face generator and avatar resource site.",
    url: pageUrl,
    mainEntity: {
      "@type": "Organization",
      name: "My Square Face Icon",
      url: "https://mysquarefaceicon.com",
      logo: "https://mysquarefaceicon.com/favicon.svg"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mysquarefaceicon.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: pageUrl
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />
      <main className="resource-page">
        <a className="back-link" href="/#maker">Back to the generator</a>
        <p className="eyebrow">About the project</p>
        <h1>About My Square Face Icon</h1>
        <p className="lead">
          My Square Face Icon is a free browser tool site for people who want a cute square profile icon without signing up, installing software, or opening a full design app. The project centers on a square face generator experience and supports it with practical guides, examples, and privacy-aware community features.
        </p>

        <section>
          <h2>Why This Site Exists</h2>
          <p>
            A good profile picture should be quick to make and easy to recognize at small sizes. Many users only need a playful avatar for Discord, TikTok, YouTube, forums, game profiles, classroom projects, or small communities. My Square Face Icon keeps that workflow simple: open the generator, create a face, and save or share the result when the tool supports it.
          </p>
          <p>
            The site is designed as a focused tool first, not a large social network. Pages are added only when they support the generator, answer a real search intent, or help visitors make better avatar choices.
          </p>
        </section>

        <section>
          <h2>What We Provide</h2>
          <div className="feature-grid">
            <article className="info-card">
              <h3>Free square face generator</h3>
              <p>The main page keeps the avatar tool visible in the first viewport so visitors can start creating without hunting through a landing page.</p>
            </article>
            <article className="info-card">
              <h3>Helpful avatar guides</h3>
              <p>Support pages explain icon readability, cute avatar style, platform crops, and practical profile image workflows.</p>
            </article>
            <article className="info-card">
              <h3>Original gallery ideas</h3>
              <p>Gallery examples are created for this site as inspiration. They are not copied from competitors, user comments, or third-party art packs.</p>
            </article>
          </div>
        </section>

        <section>
          <h2>Originality and Rights</h2>
          <p>
            The site does not copy competitor page text, screenshots, image libraries, comments, or downloadable assets. The main tool uses the square face game file that was provided for this project, while new examples and support content are written specifically for My Square Face Icon.
          </p>
          <p>
            If the product expands into more avatar makers, each new URL should contain a real usable tool or a clearly useful guide. We avoid publishing thin pages that exist only to target a keyword.
          </p>
        </section>

        <section>
          <h2>Privacy and Community</h2>
          <p>
            The generator experience runs in the browser. Public comments are moderated before publishing, and email addresses submitted with comments are not displayed publicly. Optional image uploads are intended for sharing avatar creations, not for collecting personal documents or sensitive information.
          </p>
          <p>
            You can read the full details in the <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms-of-service">Terms of Service</a>.
          </p>
        </section>

        <section>
          <h2>Next Product Direction</h2>
          <div className="link-grid">
            <a href="/#maker">
              <h3>Use the generator</h3>
              <p>Start with the core square face generator experience.</p>
            </a>
            <a href="/free-avatar-maker">
              <h3>Free avatar maker guide</h3>
              <p>Learn how to use the site as a simple free avatar maker.</p>
            </a>
            <a href="/gallery">
              <h3>Browse the gallery</h3>
              <p>See original square face icon ideas for style inspiration.</p>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
