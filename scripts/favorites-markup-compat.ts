// TypeScript mirror used by compiled legacy checks. Keep replacements aligned
// with favorites-compat.mjs; current FAV behavior has its own dedicated checks.
export function beforeFavoritesMarkup(value: string): string {
  let html = value;
  html = html.replace(/<span class="favorites-live" aria-live="polite" aria-atomic="true"><\/span>/g, "");
  html = html.replace(/<div class="favorite-actions favorite-actions-detail" data-favorite-actions="true">[\s\S]*?<\/div>/g, "");
  html = html.replace(/<div class="favoritable-game-card(?: favoritable-related-card)?">(<a\b[\s\S]*?<\/a>)<div class="favorite-actions favorite-actions-card" data-favorite-actions="true">[\s\S]*?<\/div><\/div>/g, "$1");
  html = html.replace(/<div class="home-hero-actions" aria-label="Game actions">([\s\S]*?)<\/div>/g, "$1");
  return html;
}
