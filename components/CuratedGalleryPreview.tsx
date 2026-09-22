import type { CuratedIconIdea } from "@/data/curated-icon-ideas";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

type CuratedGalleryPreviewProps = {
  title: string;
  intro: string;
  trustNote: string;
  items: readonly CuratedIconIdea[];
  href?: string;
  variant: "home-editorial" | "compact";
};

export default function CuratedGalleryPreview({
  title,
  intro,
  trustNote,
  items,
  href = "/gallery",
  variant
}: CuratedGalleryPreviewProps) {
  const headingId = `curated-icon-ideas-${variant}`;

  return (
    <section
      className={`curated-gallery-section curated-gallery-${variant}`}
      aria-labelledby={headingId}
      data-curated-gallery={variant}
    >
      <div className="curated-gallery-inner">
        <div className="curated-gallery-copy">
          <h2 id={headingId}>{title}</h2>
          <p className="curated-gallery-intro">{intro}</p>
          <p className="curated-gallery-trust">{trustNote}</p>
        </div>

        <div className="curated-gallery-figures" aria-label={`${title} examples`}>
          {items.map((item, index) => (
            <figure
              className={`curated-gallery-figure${index === 0 ? " is-featured" : ""}`}
              data-curated-gallery-item={item.title}
              key={`${item.title}-${item.src}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes={
                  variant === "home-editorial" && index === 0
                    ? "(max-width: 760px) calc((100vw - 72px) / 3), (max-width: 1100px) 28vw, 180px"
                    : "(max-width: 760px) calc((100vw - 72px) / 3), (max-width: 1100px) 16vw, 128px"
                }
                loading="lazy"
              />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>

        <a className="curated-gallery-action" href={href}>
          Browse All Icon Ideas
          <ArrowRight aria-hidden="true" size={18} />
        </a>
      </div>
    </section>
  );
}
