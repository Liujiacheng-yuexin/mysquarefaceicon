import { ArrowRight, Gamepad2 } from "lucide-react";
import Image from "next/image";
import { resolveLegacyGamePath } from "@/lib/games/routes";

export type GameSidebarItem = {
  title: string;
  text: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

type GameSidebarProps = {
  title?: string;
  items: GameSidebarItem[];
  browseHref?: string;
  browseLabel?: string;
};

export default function GameSidebar({
  title = "More Avatar Games",
  items,
  browseHref = "/free-avatar-maker",
  browseLabel = "Browse All Games"
}: GameSidebarProps) {
  return (
    <aside className="game-sidebar" aria-label={title}>
      <div className="game-sidebar-heading">
        <Gamepad2 aria-hidden="true" size={22} />
        <h2>{title}</h2>
      </div>
      <div className="game-sidebar-list">
        {items.map((item) => {
          const isExternal = resolveLegacyGamePath(item.href)?.pageType === "EXTERNAL_TOOL";
          return (
            <a className="side-game-card" href={item.href} data-game-page-type={isExternal ? "EXTERNAL_TOOL" : undefined} key={item.title}>
              <Image src={item.imageSrc} alt={item.imageAlt} width={84} height={84} sizes="56px" loading="lazy" />
              <span>
                <strong>{item.title}</strong>
                {isExternal ? <span className="route-game-type">External tool</span> : null}
                <small>{item.text}</small>
              </span>
            </a>
          );
        })}
      </div>
      <a className="sidebar-browse-link" href={browseHref}>
        {browseLabel}
        <ArrowRight aria-hidden="true" size={18} />
      </a>
    </aside>
  );
}
