import type { Metadata } from "next";
import Link from "next/link";
import GameLink from "@/components/game/GameLink";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    absolute: "Page Not Found | My Square Face Icon"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main className="route-directory-shell">
        <section className="route-directory-hero route-category-hero" aria-labelledby="not-found-heading">
          <p className="route-eyebrow">404 · Page not found</p>
          <h1 id="not-found-heading">This route does not exist</h1>
          <p>
            The game or category address is not part of the published collection. Use one of the
            verified entry points below instead.
          </p>
        </section>

        <div className="route-return-links" aria-label="404 recovery links">
          <GameLink href="/games">Browse avatar games</GameLink>
          <Link href="/">Return to Square Face Generator</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
