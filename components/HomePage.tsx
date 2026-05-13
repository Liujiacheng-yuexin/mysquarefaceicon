import FlashGenerator from "@/components/FlashGenerator";
import ShareButtons from "@/components/ShareButtons";
import CommentSection from "@/components/CommentSection";
import InstallPrompt from "@/components/InstallPrompt";
import { ChevronDown, Grid3X3 } from "lucide-react";
import { getLocaleUrl, localeCodes, locales, siteUrl, type LocaleCode } from "@/lib/locales";

type HomePageProps = {
  locale: LocaleCode;
};

const aboutCards = [
  {
    title: "Welcome to a Cute Square Face Generator",
    text:
      "My Square Face Icon is built for people who want a quick, playful square avatar without opening a design app. The page keeps the generator in the first screen, so the main action is always simple: start the game, customize the face, and save an icon when the game workflow supports it."
  },
  {
    title: "Why Choose This Square Face Icon Generator?",
    text:
      "The tool focuses on a compact square icon style that reads well at small sizes. It uses a self-hosted Ruffle setup for the authorized SWF and includes a Canvas fallback so visitors still have a usable path if the Flash runtime cannot load."
  },
  {
    title: "Tips for Creating a Better Avatar",
    text:
      "Start with a clear expression, then adjust hair, eyes, mouth, clothes, and accessories. Strong contrast and simple colors usually work best for tiny profile pictures because the icon remains recognizable in chat lists, comments, and game lobbies."
  }
];

const resourceCards = [
  {
    title: "Square Face Icon Generator Guide",
    text: "Learn what makes a square face icon work well and when to use the original game or the fallback tool.",
    href: "/square-face-icon-generator"
  },
  {
    title: "Cute Square Avatar Generator Tips",
    text: "See practical ideas for making a softer, friendlier square avatar for social profiles and communities.",
    href: "/cute-square-avatar-generator"
  },
  {
    title: "Discord Profile Icon Guide",
    text: "Make a small avatar that still looks clear in servers, friend lists, and chat replies.",
    href: "/blog/how-to-make-a-cute-discord-profile-icon"
  }
];

export default function HomePage({ locale }: HomePageProps) {
  const content = locales[locale];
  const canonicalUrl = getLocaleUrl(locale);
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "My Square Face Icon",
    alternateName: ["Square Face Generator", "Square Face Icon Generator"],
    description: content.description,
    url: canonicalUrl,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    featureList: [
      "Ruffle-powered Flash avatar game",
      "Self-hosted SWF and Ruffle runtime",
      "HTML5 Canvas fallback",
      "User comments with moderation",
      "No signup required"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: content.hero.h1,
        item: canonicalUrl
      }
    ]
  };

  return (
    <div lang={content.code} dir={content.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="site-nav">
        <a className="brand" href="/" aria-label="My Square Face Icon home">
          <span className="brand-mark" aria-hidden="true" />
          <span>Square Face Generator</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#how-to-use">
            <Grid3X3 aria-hidden="true" size={16} />
            How to Use
          </a>
          <a href="/square-face-icon-generator">Icon Guide</a>
          <a href="/blog">Blog</a>
          <div className="language-links" aria-label="Language selection">
            <span className="language-current">
              {content.label}
              <ChevronDown aria-hidden="true" size={14} />
            </span>
            <div className="language-menu">
              {localeCodes.map((code) => (
                <a className={code === locale ? "is-active" : ""} href={locales[code].path} hrefLang={code} key={code}>
                  {locales[code].label}
                </a>
              ))}
            </div>
          </div>
          <a className="nav-cta" href="#generator">Start Creating</a>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="generator">
          <div className="hero-copy hero-copy-compact">
            <div>
              <p className="eyebrow">{content.hero.eyebrow}</p>
              <h1>{content.hero.h1}</h1>
            </div>
            <p className="hero-text">{content.hero.text}</p>
          </div>
          <FlashGenerator />
          <ShareButtons share={content.share} title={content.title} url={canonicalUrl} />
        </section>

        <section className="content-band">
          <div className="section-heading">
            <p className="eyebrow">{content.sections.featuresEyebrow}</p>
            <h2>{content.sections.featuresTitle}</h2>
          </div>
          <div className="feature-grid">
            {content.features.map((feature) => (
              <article className="info-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-band alt-band" id="how-to-use">
          <div className="section-heading">
            <p className="eyebrow">{content.sections.howEyebrow}</p>
            <h2>{content.sections.howTitle}</h2>
          </div>
          <div className="steps-grid">
            {content.steps.map((step, index) => (
              <article className="info-card" key={step.title}>
                <span className="step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-band">
          <div className="section-heading">
            <p className="eyebrow">{content.sections.useEyebrow}</p>
            <h2>{content.sections.useTitle}</h2>
          </div>
          <div className="use-grid">
            {content.useCases.map((useCase) => (
              <article key={useCase.title}>
                <h3>{useCase.title}</h3>
                <p>{useCase.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-band alt-band" id="about">
          <div className="section-heading">
            <p className="eyebrow">{content.sections.galleryEyebrow}</p>
            <h2>{content.sections.galleryTitle}</h2>
            <p className="section-intro">{content.sections.galleryNote}</p>
          </div>
          <div className="text-grid">
            {aboutCards.map((card) => (
              <article className="text-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-band">
          <div className="section-heading">
            <p className="eyebrow">Useful next steps</p>
            <h2>Square Face Icon Resources</h2>
            <p className="section-intro">
              Use these guides when you want a clearer profile icon, a more playful avatar style, or a better fit for a specific platform.
            </p>
          </div>
          <div className="resource-grid">
            {resourceCards.map((card) => (
              <a className="resource-card" href={card.href} key={card.href}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="content-band" id="comments">
          <div className="section-heading">
            <p className="eyebrow">{content.sections.commentsEyebrow}</p>
            <h2>{content.sections.commentsTitle}</h2>
          </div>
          <CommentSection locale={locale} content={content.comments} />
        </section>

        <section className="content-band alt-band" id="faq">
          <div className="section-heading">
            <p className="eyebrow">{content.sections.faqEyebrow}</p>
            <h2>{content.sections.faqTitle}</h2>
          </div>
          <div className="faq-list">
            {content.faq.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <p>&copy; 2026 My Square Face Icon.</p>
          <p>{content.footer.description}</p>
        </div>
        <div className="footer-grid" aria-label="Footer navigation">
          <div>
            <h3>Quick Links</h3>
            <a href="#generator">Square Face Generator</a>
            <a href="#how-to-use">How It Works</a>
            <a href="/square-face-icon-generator">Icon Guide</a>
            <a href="#faq">FAQ</a>
          </div>
          <div>
            <h3>Resources</h3>
            <a href="#about">What Is a Square Face Generator?</a>
            <a href="/cute-square-avatar-generator">Cute Square Avatars</a>
            <a href="/blog">Blog</a>
            <a href="#comments">Share Your Creation</a>
            <a href={`${siteUrl}/sitemap.xml`}>Sitemap</a>
          </div>
          <div>
            <h3>Legal</h3>
            <a href="/privacy-policy">{content.footer.privacy}</a>
            <a href="/terms-of-service">{content.footer.terms}</a>
          </div>
        </div>
      </footer>
      <InstallPrompt />
    </div>
  );
}
