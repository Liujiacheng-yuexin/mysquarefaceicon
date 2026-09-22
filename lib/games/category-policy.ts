// The small category collections (including their unknown/empty route boundary)
// are not approved advertising surfaces. Analytics retains its separate policy.
export const categoryPolicy = {
  routeFamily: "/category",
  adEligible: false,
  reason: "Small, noindex category collections and category errors must not load advertising."
} as const;

export function isCategoryPath(path: string | null): boolean {
  if (path === null) return false;
  const pathname = path.split(/[?#]/, 1)[0];
  return pathname === categoryPolicy.routeFamily || pathname.startsWith(`${categoryPolicy.routeFamily}/`);
}

export function crossesCategoryBoundary(from: string | null, to: string | null): boolean {
  return from !== null && to !== null && isCategoryPath(from) !== isCategoryPath(to);
}

export function canLoadAdsOutsideCategory(documentPath: string | null, currentPath: string): boolean {
  return documentPath !== null && !isCategoryPath(documentPath) && !isCategoryPath(currentPath);
}
