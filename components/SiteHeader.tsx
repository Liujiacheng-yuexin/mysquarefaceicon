export default function SiteHeader() {
  return (
    <header className="site-nav">
      <a className="brand" href="/" aria-label="My Square Face Icon home">
        <span className="brand-mark" aria-hidden="true" />
        <span>Square Face Generator</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="/#maker">Generator</a>
        <a href="/free-avatar-maker">Free Avatar Maker</a>
        <a href="/gallery">Gallery</a>
        <a href="/square-face-icon-generator">Icon Guide</a>
        <a href="/blog">Blog</a>
        <a href="/about-us">About</a>
        <a className="nav-cta" href="/#maker">Start Creating</a>
      </nav>
    </header>
  );
}
