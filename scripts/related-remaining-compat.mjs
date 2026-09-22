import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { beforeFavoritesMarkup, beforeFavoritesSource } from "./favorites-compat.mjs";

const sha = value => createHash("sha256").update(value).digest("hex");
const count = (text, value) => text.split(value).length - 1;

// Exact inverses for the user-confirmed RELATED-001 remaining-surface patch.
// Historical task goldens stay immutable: this layer removes only the reviewed
// source delta before those older contracts run.
const changes = {
  "lib/games/home-discovery.ts": {
    after: "9db8d4e6db534274e6bdb05fcfff6c2191d6395270c02b4de25c4424ec73a007",
    before: "b172dd4a9e807754f59dfe5f9bb5b42fdc2d360bd89c54eab504f5577dac166e",
    replacements: [
      ['import { selectRelatedGames } from "../recommendations/related-games";\n', ""],
      [
        '  return selectRelatedGames(currentGame, records).recommendations\n    .map(({ game }) => game)\n    .filter(hasPublicInternalHref);',
        '  const publishedGamesById = new Map(\n    listPublishedGames(records)\n      .filter(hasPublicInternalHref)\n      .map((game) => [game.id, game])\n  );\n  const seenIds = new Set([currentGame.id]);\n\n  return currentGame.relatedGameIds.flatMap((gameId) => {\n    if (seenIds.has(gameId)) return [];\n    const game = publishedGamesById.get(gameId);\n    if (!game) return [];\n    seenIds.add(gameId);\n    return [game];\n  });'
      ]
    ]
  },
  "components/home/HomeDiscoveryRegion.tsx": {
    after: "c7fb2ac8ea2e54ae2f4000217128434016b2875b846e9c830efb6e9d2df0dec0",
    before: "8652a91eeeb4650230235422c661be58841a49475ce1bc446425c7e2ac697b04",
    replacements: [
      ['data-home-module="related"', 'data-home-module="featured"'],
      ["<h3>Related Avatar Games</h3>", "<h3>Featured Avatar Games</h3>"],
      ["<p>Matched from published games that share avatar categories or tags with Square Face Generator.</p>", "<p>Selected from the Square game&apos;s published related records.</p>"],
      ['ariaLabel="Related avatar games"', 'ariaLabel="Featured avatar games"']
    ]
  },
  "components/game/RelatedGames.tsx": {
    after: "0d0f82928e4ed89a33adad7deb87e569d246c0311314bdd4468db009f78cef39",
    before: "1fa094f28bd8b0855c7869596b9df55b0072a48a8db6d3db8c6558f954209aa7",
    replacements: [
      ['import { gameCatalog } from "../../lib/games/catalog";', 'import { getGameById } from "../../lib/games/catalog";'],
      ['import { selectRelatedGames } from "../../lib/recommendations/related-games";', 'import { listPublishedGames } from "../../lib/games/routes";'],
      [
        'import GameGrid from "./GameGrid";\n',
        'import GameGrid from "./GameGrid";\n\nconst publishedGameIds = new Set(listPublishedGames().map((game) => game.id));\n'
      ],
      ['  readonly records?: readonly GameRecord[];\n', ""],
      [
        'export default function RelatedGames({\n  game,\n  limit = 4,\n  records = gameCatalog,\n  variant = "default"\n}: RelatedGamesProps) {\n  const relatedGames = selectRelatedGames(game, records, limit).recommendations.map(({ game: related }) => related);',
        'export default function RelatedGames({ game, limit = 4, variant = "default" }: RelatedGamesProps) {\n  const relatedGames = game.relatedGameIds\n    .flatMap((id) => {\n      const related = getGameById(id);\n      return related && related.id !== game.id && publishedGameIds.has(related.id) ? [related] : [];\n    })\n    .slice(0, Math.max(0, limit));'
      ]
    ]
  },
  "components/game/GameDetailTemplate.tsx": {
    after: "fc810e5de24498107c5081a154177a875b24e97451c45a9f753e4745805a01e9",
    before: "3ed1e3577a95db9c5bf455d52fa1f09a7b5be214f16d3706773b2c5d6ae81d4a",
    replacements: [
      ['  readonly relatedGameRecords?: readonly GameRecord[];\n', ""],
      ['export default function GameDetailTemplate({ game, playerModel, relatedGameRecords }: GameDetailTemplateProps) {', 'export default function GameDetailTemplate({ game, playerModel }: GameDetailTemplateProps) {'],
      ['<RelatedGames game={game} records={relatedGameRecords} variant="detail-related" />', '<RelatedGames game={game} variant="detail-related" />']
    ]
  },
  "app/pixel-art-avatar-icon-generator/page.tsx": {
    after: "586c30c4807991934096fcdf753bf5c09b3953369d0ea18d7fefcfed95570dbd",
    before: "6116dc65fae1b664512d2267263f242b5085765f4a5f0fbac3368c301d92496c",
    replacements: [
      ['import { getPublicGameHref, requireLegacyGamePath } from "@/lib/games/routes";\nimport { selectRelatedGames } from "@/lib/recommendations/related-games";', 'import { requireLegacyGamePath } from "@/lib/games/routes";'],
      [
        'const pixelRelatedCopy = {\n  "square-face": {\n    title: "Square Face Generator",\n    text: "Play the classic square face Flash avatar maker on this site."\n  },\n  "oval-face": {\n    title: "Oval Face Icon Generator",\n    text: "Try a rounded-face companion game with oval profile icon styling."\n  }\n} as const;\nconst pixelRelatedGames = selectRelatedGames(pixelArtAvatarGame).recommendations.map(({ game }) => ({\n  game,\n  copy: pixelRelatedCopy[game.id as keyof typeof pixelRelatedCopy] ?? {\n    title: game.name,\n    text: game.content.summary\n  }\n}));\n',
        ""
      ],
      [
        '        {pixelRelatedGames.length > 0 ? (\n        <section className="content-band">\n          <div className="section-heading">\n            <p className="eyebrow">Continue exploring</p>\n            <h2>Related Avatar Games</h2>\n          </div>\n          <div className="related-grid">\n            {pixelRelatedGames.map(({ game, copy }) => (\n              <a\n                className="related-card"\n                data-game-id={game.id}\n                data-game-page-type={game.pageType}\n                href={getPublicGameHref(game)}\n                key={game.id}\n              >\n                <Sparkles aria-hidden="true" size={20} />\n                <h3>{copy.title}</h3>\n                <p>{copy.text}</p>\n              </a>\n            ))}\n          </div>\n        </section>\n        ) : null}\n\n        <section className="content-band alt-band">\n          <div className="section-heading">\n            <p className="eyebrow">Practical guide</p>\n            <h2>Pixel Avatar Guide</h2>\n          </div>\n          <div className="related-grid">',
        '        <section className="content-band">\n          <div className="section-heading">\n            <p className="eyebrow">Related tools</p>\n            <h2>More Avatar Games and Guides</h2>\n          </div>\n          <div className="related-grid">\n            <a className="related-card" href="/">\n              <Sparkles aria-hidden="true" size={20} />\n              <h3>Square Face Generator</h3>\n              <p>Play the classic square face Flash avatar maker on this site.</p>\n            </a>\n            <a className="related-card" href="/oval-face-icon-generator">\n              <Sparkles aria-hidden="true" size={20} />\n              <h3>Oval Face Icon Generator</h3>\n              <p>Try a rounded-face companion game with oval profile icon styling.</p>\n            </a>'
      ]
    ]
  },
  "components/game/README.md": {
    after: "e456f4b51c98c42fb09ba89df7d5ff1de7326b6ea4e30f97b61eeec6f6caf989",
    before: "4c7ea3c7e616a686fbf08567f8b9e28082912a2dbcbfc7a73d3166867c172f89",
    replacements: [
      [
        '| `RelatedGames` | Used by `GameDetailTemplate` | Uses the shared Category + Tags selector over eligible published records; the detail variant changes presentation, not selection. Tests may inject an explicit candidate set without relaxing production eligibility. |',
        '| `RelatedGames` | Used by `GameDetailTemplate` | Uses explicit `relatedGameIds` and published records only; the detail variant changes presentation, not selection. Scoring belongs to `RELATED-001`. |'
      ],
      [
        "The server-only `lib/games/home-discovery.ts` resolver owns homepage selection: the Related module uses the shared Category + Tags selector, independent of `relatedGameIds`; New accepts only published records with a valid `VERIFIED` timestamp, sorts newest first, and excludes the current and Related records; Categories resolve only non-empty allowlisted routes with published records.",
        "The server-only `lib/games/home-discovery.ts` resolver owns homepage selection: Featured follows the current Square record's explicit published relations in source order; New accepts only published records with a valid `VERIFIED` timestamp, sorts newest first, and excludes the current and Featured records; Categories resolve only non-empty allowlisted routes with published records."
      ]
    ]
  },
  "scripts/validate-home-discovery.tsx": {
    after: "ac88bc4afc2d3d2cc022f5d05beacf1cd37e1f3a44995454e2634cba420f302d",
    before: "f0236c66dc6e603595d39ba675293c5aba44add9a50cd71b7a2f7e461065d894",
    replacements: [
      ['"Related must follow the shared Category + Tags score order."', '"Featured must follow Square\'s explicit published related-game order."'],
      ['data-home-module="related"', 'data-home-module="featured"'],
      ['assert.match(currentMarkup, />Related Avatar Games</);\nassert.match(currentMarkup, /Matched from published games that share avatar categories or tags with Square Face Generator\./);\nassert.match(currentMarkup, /aria-label="Related avatar games"/);\n', ""],
      ['const ignoredRelationFixture = {\n  ...squareFaceGame,\n  relatedGameIds: ["pixel-art-avatar", "missing-game"]\n} satisfies GameRecord;\nassert.deepEqual(\n  resolveHomeFeaturedGames(ignoredRelationFixture).map((game) => game.id),\n  ["oval-face", "pixel-art-avatar"],\n  "Related selection must ignore legacy relatedGameIds ordering and use shared overlap scoring."\n);', 'const duplicateRelationFixture = {\n  ...squareFaceGame,\n  relatedGameIds: ["oval-face", "oval-face", "missing-game", "pixel-art-avatar", "pixel-art-avatar"]\n} satisfies GameRecord;\nassert.deepEqual(\n  resolveHomeFeaturedGames(duplicateRelationFixture).map((game) => game.id),\n  ["oval-face", "pixel-art-avatar"],\n  "Featured must exclude missing and duplicate related records without changing the first valid order."\n);'],
      ['  category: { primary: "pixel-avatars", secondary: ["character-creators"] },\n  tags: ["verified-new-fixture"],\n', ""],
      ['console.log("- Related uses the shared Category + Tags selector and ignores legacy relatedGameIds order");', 'console.log("- Featured preserves Square\'s published relation order and removes duplicates");']
    ]
  },
  "scripts/validate-game-template.tsx": {
    after: "73d6f5fedec483212e78909169465458f1ccd53506b73f6a5fb0273e5a44e24c",
    before: "5427f7fbd835530eaa34ef7fc514692b203f8f312e71624ed51df3dc14af6406",
    replacements: [
      ['import { gameCatalog } from "../lib/games/catalog";\n', ""],
      ['function renderTemplate(game: GameRecord, relatedGameRecords: readonly GameRecord[] = [game, ...gameCatalog]) {', 'function renderTemplate(game: GameRecord) {'],
      ['  return renderToStaticMarkup(\n    <GameDetailTemplate game={game} playerModel={model} relatedGameRecords={relatedGameRecords} />\n  );', '  return renderToStaticMarkup(<GameDetailTemplate game={game} playerModel={model} />);'],
      ['const noOptionalMarkup = renderTemplate(noOptionalModules, [noOptionalModules]);', 'const noOptionalMarkup = renderTemplate(noOptionalModules);'],
      ['\nconst relatedSource = readFileSync(resolve(projectRoot, "components/game/RelatedGames.tsx"), "utf8");\nassert.match(relatedSource, /selectRelatedGames\\(game, records, limit\\)/);\nassert.doesNotMatch(relatedSource, /relatedGameIds/);\n', '']
    ]
  },
  "scripts/validate-home-information-architecture.tsx": {
    after: "7e9b9ff619d4baad913817cb5a6077a94cd5d9f2bc94013503305546eaa2c605",
    before: "e3c0001100d69301d7007ba8fc3840779530fbdadae93bd784d48978138cfbc4",
    replacements: [
      ['"Homepage Related must follow the shared Category + Tags score order."', '"Homepage Featured must follow the Square record\'s explicit published related-game order."'],
      ['data-home-module="related"', 'data-home-module="featured"'],
      ['console.log("- Related contains only Oval and Pixel published Game Data; Pixel remains External Tool");', 'console.log("- Featured contains only Oval and Pixel published Game Data; Pixel remains External Tool");']
    ]
  },
  "scripts/check-pixel-external-page.mjs": {
    after: "2dd5825fe3b1a0abc5025f87e9efde69147a184ca3c6ce3079e06b4081dcfe14",
    before: "51df87ab42a045b6b37b494805cefa4e8841da934fbfe6caaafd398b52828ad9",
    replacements: [
      ['import { beforeRelatedRemainingMarkup, beforeRelatedRemainingSource } from "./related-remaining-compat.mjs";\n', ""],
      ['  source = beforeRelatedRemainingSource(file, source);\n', ""],
      [
        '  return reverseExact(\n    normalizeTextSeparators(beforeGamesIndexNavigation(beforeRelatedRemainingMarkup(html))),\n    markupEdits\n  );',
        '  return reverseExact(normalizeTextSeparators(beforeGamesIndexNavigation(html)), markupEdits);'
      ],
      ['  assert.equal((main.match(/<h2\\b/g) ?? []).length, 10);', '  assert.equal((main.match(/<h2\\b/g) ?? []).length, 9);'],
      [
        '  const page = beforeRelatedRemainingSource(pixelPage, read(pixelPage));\n  for (const edit of pageSourceEdits) {\n    const candidate = page.replace(edit.new, edit.old);\n    assert.notEqual(candidate, page, "Approved page change fixture must apply: " + edit.id);\n    assert.throws(() => {\n      const original = reverseExact(candidate, pageSourceEdits);\n      assert.equal(sha(original), sourceHashes[pixelPage]);\n    }, undefined, "Missing approved page change: " + edit.id);\n    rejected++;\n  }',
        '  const page = read(pixelPage);\n  for (const edit of pageSourceEdits) {\n    assert.throws(() => originalPixelSource(pixelPage, page.replace(edit.new, edit.old)), undefined, "Missing approved page change: " + edit.id);\n    rejected++;\n  }'
      ]
    ]
  },
  "scripts/check-square-homepage.mjs": {
    after: "b7539ae337c92971ff4545157110793a58b13052160111cf968057c0f5392f2b",
    before: "41e99e6ec5b81d0ca3cc849cb8705d13bc87e1a2b52f772c8b6d2823f2d6c852",
    replacements: [
      ['import { beforeRelatedRemainingHomeMarkup } from "./related-remaining-compat.mjs";\n', ""],
      [
        'beforeGamesIndexNavigation(beforeRelatedRemainingHomeMarkup(originalPixelSidebarMarkup(html, locale === "en" ? 0 : 1)))',
        'beforeGamesIndexNavigation(originalPixelSidebarMarkup(html, locale === "en" ? 0 : 1))'
      ]
    ]
  },
  "scripts/check-locale-rights.mjs": {
    after: "da5409558edfd5987e7e413878803e41d780b26b7b8185d823bbfcd50035182d",
    before: "05acbc5cf323e2a024e1f664d0a71badaede373a7b9955627020336403b5aeef",
    replacements: [
      ['import { beforeRelatedRemainingHomeMarkup } from "./related-remaining-compat.mjs";\n', ""],
      [
        'beforeRelatedRemainingHomeMarkup(originalPixelSidebarMarkup(main, code === "en" ? 0 : 1))',
        'originalPixelSidebarMarkup(main, code === "en" ? 0 : 1)'
      ]
    ]
  },
  "scripts/README.md": {
    after: "ebed6696b6ca8f096a9516c76ddfa369a5e664eb89a84d9f94784a053fd56e73",
    before: "fa14a69f2a8d5a05faf66f429371a2b6af3f50841de0a8425f45441b92fa19b4",
    replacements: [
      [
        '`npm run related:check` compiles and runs the server-side Category + Tags selector checks. It verifies the current Oval, Square, and Pixel orders; category/tag/ID precedence; strict limits; immutability; duplicate ID/path exclusion; publication and fake-legacy gates; missing/invalid/empty states; the disabled quality/popularity boundary; and the Oval, homepage, Pixel, and shared detail-component source contracts. Run `node scripts/run-related-games-check.mjs --built` or `--base http://127.0.0.1:3000` to add exact rendered checks for all three current surfaces. It does not grant rights, index eligibility, or production approval.',
        '`npm run related:check` compiles and runs the server-side Category + Tags selector checks. It verifies the current Oval → Square/Pixel order, category/tag/ID precedence, strict limits, input immutability, duplicate ID/path exclusion, publication and fake-legacy gates, missing/invalid/empty states, the disabled quality/popularity boundary, and the approved Oval source grouping. It does not grant rights, index eligibility, production approval, or test rendered browser behavior.'
      ]
    ]
  }
};

export function beforeRelatedRemainingSource(file, value) {
  value = beforeFavoritesSource(file, value);
  const change = changes[file];
  if (!change) return value;
  let source = value.toString().replace(/\r\n/g, "\n");
  if (sha(source) === change.before) return source;
  assert.equal(sha(source), change.after, `${file}: unexpected RELATED-001 remaining-surface change`);
  for (const [after, before] of change.replacements) {
    assert.equal(count(source, after), 1, `${file}: approved remaining-surface fragment missing or duplicated`);
    source = source.replace(after, before);
  }
  assert.equal(sha(source), change.before, `${file}: change outside approved remaining-surface scope`);
  return source;
}

// Rebuild the exact pre-task mixed Pixel section from the two approved groups.
// The card bodies are reused so unrelated text, icon, and link drift remains
// visible to the original Pixel SSR golden.
export function beforeRelatedRemainingMarkup(value) {
  const html = beforeFavoritesMarkup(value);
  const sectionsPattern = /<section class="content-band"><div class="section-heading"><p class="eyebrow">Continue exploring<\/p><h2>Related Avatar Games<\/h2><\/div><div class="related-grid">[\s\S]*?<\/section><section class="content-band alt-band"><div class="section-heading"><p class="eyebrow">Practical guide<\/p><h2>Pixel Avatar Guide<\/h2><\/div><div class="related-grid">[\s\S]*?<\/section>/g;
  const sections = html.match(sectionsPattern) ?? [];
  assert.equal(sections.length, 1, "Approved Pixel Related/Guide sections missing or duplicated");
  const current = sections[0];
  const square = current.match(/<a class="related-card" data-game-id="square-face" data-game-page-type="GAME" href="\/">([\s\S]*?)<\/a>/);
  const oval = current.match(/<a class="related-card" data-game-id="oval-face" data-game-page-type="GAME" href="\/oval-face-icon-generator">([\s\S]*?)<\/a>/);
  const guide = current.match(/<a class="related-card" href="\/pixel-square-face-maker">([\s\S]*?)<\/a>/);
  assert.ok(square && oval && guide, "Approved Pixel Related/Guide cards changed");
  const original = `<section class="content-band"><div class="section-heading"><p class="eyebrow">Related tools</p><h2>More Avatar Games and Guides</h2></div><div class="related-grid"><a class="related-card" href="/">${square[1]}</a><a class="related-card" href="/oval-face-icon-generator">${oval[1]}</a><a class="related-card" href="/pixel-square-face-maker">${guide[1]}</a></div></section>`;
  return html.replace(current, original);
}

export function beforeRelatedRemainingHomeMarkup(value) {
  let html = beforeFavoritesMarkup(value);
  if (!html.includes('data-home-module="related"')) return html;
  const replacements = [
    ['data-home-module="related"', 'data-home-module="featured"'],
    ['<h3>Related Avatar Games</h3>', '<h3>Featured Avatar Games</h3>'],
    ['<p>Matched from published games that share avatar categories or tags with Square Face Generator.</p>', '<p>Selected from the Square game&#x27;s published related records.</p>'],
    ['aria-label="Related avatar games"', 'aria-label="Featured avatar games"']
  ];
  for (const [after, before] of replacements) {
    assert.equal(count(html, after), 1, "Approved homepage Related fragment missing or duplicated");
    html = html.replace(after, before);
  }
  return html;
}
