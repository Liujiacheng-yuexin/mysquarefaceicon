import { ArrowRight, Heart, Images } from "lucide-react";
import Image from "next/image";

type GalleryPreviewItem = {
  title: string;
  src: string;
  alt: string;
  likes: number;
};

type GalleryPreviewProps = {
  title?: string;
  intro?: string;
  items: GalleryPreviewItem[];
  href?: string;
};

export default function GalleryPreview({
  title = "Community Gallery Preview",
  intro = "Check out a few square face icon styles before making your own.",
  items,
  href = "/gallery"
}: GalleryPreviewProps) {
  return (
    <section className="gallery-preview-section" aria-labelledby="community-gallery-preview">
      <div className="gallery-preview-card">
        <div className="gallery-preview-header">
          <div>
            <span className="gallery-preview-kicker">
              <Images aria-hidden="true" size={19} />
              Gallery
            </span>
            <h2 id="community-gallery-preview">{title}</h2>
            <p>{intro}</p>
          </div>
          <a className="gallery-preview-action" href={href}>
            View Full Gallery
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
        <div className="gallery-preview-grid">
          {items.map((item) => (
            <article className="gallery-preview-item" key={item.title}>
              <Image src={item.src} alt={item.alt} width={512} height={512} sizes="120px" />
              <strong>{item.title}</strong>
              <span className="preview-like-count" aria-label={`${item.likes} likes`}>
                <Heart aria-hidden="true" fill="currentColor" size={14} />
                {item.likes}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
