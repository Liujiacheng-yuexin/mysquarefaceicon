import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const pageUrl = "https://mysquarefaceicon.com/blog";

export const metadata: Metadata = {
  title: "Square Face Icon Guides",
  description:
    "Read practical guides for making cute square face icons, profile avatars, Discord icons, and browser-based avatar generator workflows.",
  alternates: {
    canonical: pageUrl
  },
  openGraph: {
    type: "website",
    url: pageUrl,
    title: "Square Face Icon Guides",
    description:
      "Helpful guides for creating square face icons and using avatar generator tools.",
    images: ["/og-image.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Square Face Icon Guides",
    description:
      "Guides for square face icons, cute avatars, and profile image workflows.",
    images: ["/og-image.svg"]
  }
};

export default function BlogIndexPage() {
  return (
    <>
      <SiteHeader />
      <main className="resource-page">
        <a className="back-link" href="/">Back to home</a>
        <p className="eyebrow">Guides and resources</p>
        <h1>Square Face Icon Guides</h1>
        <p className="lead">
          This blog collects practical guides for creating profile icons with a square face generator. Each guide links back to the tool, related resources, and the next useful step instead of acting as a disconnected article.
        </p>

        <section>
          <h2>Latest Guides</h2>
          <div className="link-grid">
            <a href="/blog/how-to-make-a-cute-discord-profile-icon">
              <h3>How to Make a Cute Discord Profile Icon</h3>
              <p>Choose a readable expression, simple colors, and a square avatar style that works in chat lists and servers.</p>
            </a>
          </div>
        </section>

        <section>
          <h2>Core Resources</h2>
          <div className="link-grid">
            <a href="/#generator">
              <h3>Square Face Generator</h3>
              <p>Open the browser tool and start creating a square face icon.</p>
            </a>
            <a href="/square-face-icon-generator">
              <h3>Square Face Icon Generator Guide</h3>
              <p>Understand how square icons work and where they are most useful.</p>
            </a>
            <a href="/cute-square-avatar-generator">
              <h3>Cute Square Avatar Generator Tips</h3>
              <p>Make your avatar feel softer, friendlier, and easier to recognize.</p>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
