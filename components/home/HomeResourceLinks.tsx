import Link from "next/link";

const homeResources = [
  {
    type: "Guide",
    title: "Free Avatar Maker",
    text: "Follow a practical browser workflow for creating a profile avatar without signup.",
    href: "/free-avatar-maker"
  },
  {
    type: "Guide",
    title: "Square Face Icon Guide",
    text: "Learn how square source icons work across profile crops and common platforms.",
    href: "/square-face-icon-generator"
  },
  {
    type: "Gallery",
    title: "Square Face Icon Gallery",
    text: "Browse square face styles and visual ideas separately from the game directory.",
    href: "/gallery"
  },
  {
    type: "Blog",
    title: "Avatar Guides & Tips",
    text: "Read focused guides for Discord, profile pictures, icon sizes, and avatar styles.",
    href: "/blog"
  }
] as const;

export default function HomeResourceLinks() {
  return (
    <section
      className="home-resources-section"
      aria-labelledby="home-resources-title"
      data-home-section="resources"
    >
      <div className="home-resources-card">
        <header className="home-resources-heading">
          <h2 id="home-resources-title">Guides &amp; Resources</h2>
          <p>Find supporting guides, gallery ideas, and articles without mixing them into the Games list.</p>
        </header>
        <nav className="home-resource-links" aria-label="Avatar guides and resources">
          {homeResources.map((resource) => (
            <Link className="home-resource-link" href={resource.href} key={resource.href}>
              <span>{resource.type}</span>
              <strong>{resource.title}</strong>
              <small>{resource.text}</small>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
