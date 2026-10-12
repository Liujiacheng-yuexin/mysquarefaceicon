import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { isGamesDirectoryPath } from "../../lib/games/directory-policy";
import { isCategoryPath } from "../../lib/games/category-policy";
import { isFriendQuizPath } from "../../lib/games/friend-quiz-policy";

type GameLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  readonly href: string;
  readonly reloadDocument?: boolean;
};

export default function GameLink({ href, reloadDocument = false, children, ...props }: GameLinkProps) {
  // A clean document prevents an existing ad runtime from surviving into a collection.
  if (reloadDocument || isGamesDirectoryPath(href) || isCategoryPath(href) || isFriendQuizPath(href)) {
    return <a {...props} href={href} data-navigation="document">{children}</a>;
  }
  return <Link {...props} href={href}>{children}</Link>;
}
