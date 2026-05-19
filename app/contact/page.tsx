import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const pageUrl = "https://mysquarefaceicon.com/contact";

export const metadata: Metadata = {
  title: "Contact My Square Face Icon",
  description:
    "Contact My Square Face Icon about the square face generator, privacy questions, content corrections, or site feedback.",
  alternates: {
    canonical: pageUrl
  },
  openGraph: {
    type: "website",
    url: pageUrl,
    title: "Contact My Square Face Icon",
    description:
      "Contact the My Square Face Icon project about the generator, privacy, content, or feedback.",
    images: ["/og-image.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact My Square Face Icon",
    description:
      "Send feedback, privacy questions, and content correction requests for My Square Face Icon.",
    images: ["/og-image.svg"]
  }
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact My Square Face Icon",
    url: pageUrl,
    mainEntity: {
      "@type": "Organization",
      name: "My Square Face Icon",
      url: "https://mysquarefaceicon.com",
      email: "contact@mysquarefaceicon.com"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <SiteHeader />
      <main className="resource-page">
        <a className="back-link" href="/#maker">Back to the generator</a>
        <p className="eyebrow">Contact</p>
        <h1>Contact My Square Face Icon</h1>
        <p className="lead">
          Use this page for feedback about the square face generator, privacy questions, content correction requests, or reports about comments and uploads.
        </p>

        <section>
          <h2>Email</h2>
          <p>
            Contact: <a href="mailto:contact@mysquarefaceicon.com">contact@mysquarefaceicon.com</a>
          </p>
          <p>
            If the email inbox is not active yet during early launch, use your domain email provider to enable this address before public outreach.
          </p>
        </section>

        <section>
          <h2>What to Include</h2>
          <div className="feature-grid">
            <article className="info-card">
              <h3>Generator issues</h3>
              <p>Send your browser name, device type, and what happened after pressing Start Game.</p>
            </article>
            <article className="info-card">
              <h3>Privacy requests</h3>
              <p>Include the comment name, date, and any image details if you want a submission reviewed or removed.</p>
            </article>
            <article className="info-card">
              <h3>Content corrections</h3>
              <p>Point to the page URL and explain what should be corrected or clarified.</p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
