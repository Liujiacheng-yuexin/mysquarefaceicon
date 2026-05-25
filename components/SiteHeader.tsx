import { Menu } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="site-nav">
      <a className="brand" href="/" aria-label="My Square Face Icon home">
        <span className="brand-mark" aria-hidden="true" />
        <span>Square Face Generator</span>
      </a>
      <a className="mobile-start-link" href="/#maker">Start</a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="/#maker">Generator</a>
        <a href="/oval-face-icon-generator">Oval Face</a>
        <a href="/free-avatar-maker">Free Avatar Maker</a>
        <a href="/gallery">Gallery</a>
        <a href="/square-face-icon-generator">Icon Guide</a>
        <a href="/blog">Blog</a>
        <a href="/about-us">About</a>
        <a href="/contact">Contact</a>
        <a className="nav-cta" href="/#maker">Start Creating</a>
      </nav>
      <details className="mobile-nav-menu">
        <summary aria-label="Open navigation menu">
          <Menu aria-hidden="true" size={18} />
          Menu
        </summary>
        <div className="mobile-nav-panel">
          <a href="/#maker">Start Creating</a>
          <a href="/oval-face-icon-generator">Oval Face</a>
          <a href="/free-avatar-maker">Free Avatar Maker</a>
          <a href="/gallery">Gallery</a>
          <a href="/square-face-icon-generator">Icon Guide</a>
          <a href="/blog">Blog</a>
          <a href="/about-us">About</a>
          <a href="/contact">Contact</a>
        </div>
      </details>
    </header>
  );
}
