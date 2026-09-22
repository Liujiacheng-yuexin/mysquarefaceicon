import GameLink from "./GameLink";
import { Fragment } from "react";

export type GameBreadcrumbItem = {
  readonly label: string;
  readonly href?: string;
};

type GameBreadcrumbProps = {
  readonly items: readonly [GameBreadcrumbItem, ...GameBreadcrumbItem[]];
  readonly reloadDocument?: boolean;
};

export default function GameBreadcrumb({ items, reloadDocument = false }: GameBreadcrumbProps) {
  const finalIndex = items.length - 1;

  return (
    <nav className="game-breadcrumb route-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isCurrent = index === finalIndex;

        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {!isCurrent && item.href ? (
              <GameLink href={item.href} reloadDocument={reloadDocument}>{item.label}</GameLink>
            ) : (
              <span aria-current={isCurrent ? "page" : undefined}>{item.label}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
