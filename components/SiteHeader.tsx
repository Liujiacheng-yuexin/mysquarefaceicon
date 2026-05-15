export default function SiteHeader() {
  return (
    <header className="site-nav">
      <a className="brand" href="/" aria-label="My Square Face Icon home">
        <span className="brand-mark" aria-hidden="true" />
        <span>Square Face Generator</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="/#generator">Generator</a>
        <a href="/square-face-icon-generator">Icon Guide</a>
        <a href="/cute-square-avatar-generator">Cute Avatars</a>
        <a href="/pixel-square-face-maker">Pixel Maker</a>
        <a href="/blog">Blog</a>
        <a className="nav-cta" href="/#generator">Start Creating</a>
      </nav>
    </header>
  );
}
