import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for My Square Face Icon, a free square face icon generator.",
  alternates: {
    canonical: "https://mysquarefaceicon.com/terms-of-service"
  }
};

export default function TermsOfServicePage() {
  return (
    <main className="legal-page">
      <a className="back-link" href="/">Back to Square Face Generator</a>
      <h1>Terms of Service</h1>
      <p>Last updated: September 2, 2026</p>
      <h2>Terms of Service: Use of the Tool</h2>
      <p>
        My Square Face Icon provides a free browser-based generator for creating
        simple square avatar images. Use the site responsibly and do not attempt
        to disrupt the service. Read these terms of service before using a
        generated icon, submitting a comment or image, or relying on the tool for
        a particular browser workflow.
      </p>
      <h2>Generated Icons</h2>
      <p>
        We have not verified personal or commercial usage permissions for images
        produced by the Square and Oval Flash games on this site. These terms do
        not grant a license to third-party game artwork or generated images.
        Before using an image, check the applicable license or obtain the
        permission needed for your intended use.
      </p>
      <h2>Comments and Uploads</h2>
      <p>
        Comments and optional uploaded images are moderated before public
        display. Do not submit illegal, abusive, private, copyrighted, or
        impersonating content. We may reject or delete submissions at any time.
        Likes are a lightweight community signal and may be limited, removed, or
        adjusted if they appear automated or abusive.
      </p>
      <h2>Third-Party Game Files</h2>
      <p>
        The Square and Oval players run third-party Flash (SWF) files through
        Ruffle. We have not verified the original source, rights holder, or
        permissions to host, publicly run, or redistribute the exact files used
        here. Availability on this site must not be treated as proof of
        authorization or official affiliation. These terms do not grant
        permission to extract, redistribute, or reuse third-party game files.
      </p>
      <h2>No Warranty</h2>
      <p>
        The tool is provided as is. We do not guarantee that every browser,
        device, or download workflow will work without interruption.
      </p>
      <h2>Future Changes</h2>
      <p>
        These terms may be updated as the site adds new features such as asset
        packs, analytics, advertising, or additional pages.
      </p>
      <h2>Contact and Corrections</h2>
      <p>
        For questions about these terms, content corrections, or moderation issues,
        use the <a href="/contact">contact page</a>.
      </p>
    </main>
  );
}
