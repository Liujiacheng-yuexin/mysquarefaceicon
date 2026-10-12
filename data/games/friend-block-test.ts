import { GAME_SCHEMA_VERSION, defineGame } from "../../lib/games/game-schema";

const friendBlockTest = defineGame({
  schemaVersion: GAME_SCHEMA_VERSION,
  id: "friend-block-test", name: "Friend Block Test", slug: "friend-block-test",
  pageType: "GAME", type: "HTML5", status: "PUBLISHED",
  route: { path: "/games/friend-block-test", canonical: "https://mysquarefaceicon.com/games/friend-block-test", indexStatus: "INDEX", existingPublishedRoute: false },
  source: { kind: "LOCAL_PROJECT_ASSET", providerName: "My Square Face Icon", originalUrl: null, localAssetPath: "public/games/friend-block-test/index.html", sha256: null, attribution: "An independent quiz created for My Square Face Icon. Character choices use existing project face samples." },
  license: { registryRecordId: "friend-block-test-original", status: "VERIFIED", releaseDecision: "APPROVED", newPublicationAllowed: true, allowedDeliveryTypes: ["HTML5"] },
  category: { primary: "friend-quizzes", secondary: [] },
  tags: ["friend-quiz", "avatar", "profile-icon", "local-game", "ten-questions"],
  images: [
    { role: "THUMBNAIL", src: "/games/friend-block-test/thumbnail.webp", width: 512, height: 512, alt: "Two illustrated square faces for Friend Block Test", provenance: "PROJECT_ASSET" },
    { role: "PLAYER_PREVIEW", src: "/games/friend-block-test/cover.webp", width: 960, height: 600, alt: "Friend Block Test: ten questions to share with your friends", provenance: "PROJECT_ASSET" },
    { role: "OPEN_GRAPH", src: "/games/friend-block-test/og.webp", width: 1200, height: 630, alt: "Friend Block Test: how well do your friends know you?", provenance: "PROJECT_ASSET" }
  ],
  controls: [
    { id: "choose", label: "Choose an answer", description: "Select one of four options, then Next question. Keyboard users can Tab and use Enter or Space.", inputMethods: ["POINTER", "TOUCH", "KEYBOARD"] },
    { id: "swap", label: "Swap this question", description: "Replace a question with one not already in your set while making a quiz.", inputMethods: ["POINTER", "TOUCH", "KEYBOARD"] },
    { id: "share", label: "Copy link", description: "Copy the whole quiz or result link. If clipboard access is blocked, select the displayed link and use your browser's Copy command.", inputMethods: ["POINTER", "TOUCH", "KEYBOARD"] }
  ],
  howToPlay: [
    { title: "Make your ten picks", text: "Start Friend Block Test, choose a face and enter a nickname. Answer ten questions about your everyday preferences. Each has four options; use Swap this question if it is not your thing. You can go back before generating the link." },
    { title: "Let a friend guess", text: "Copy your quiz link and send it using your own messaging app. Your friend opens this page, chooses a face and nickname, and guesses your ten answers. They receive a score out of 100 and a friendly result tier. No account is needed." },
    { title: "Collect the return link", text: "Ask your friend to copy their result link back to you. Open it in the browser that made the quiz to add their score to My results. Reopening the same result does not add a duplicate. Results stay on that device; Clear quiz records removes them." }
  ],
  features: [
    { title: "Your own mix of questions", text: "The bank has 24 original prompts about small preferences, shared activities and avatar style. Each quiz uses ten different questions, with four choices per question. Only your nickname is free text." },
    { title: "A link carries the game", text: "Quiz and return links contain their information after #. The game does not upload nicknames, answers or scores, and has no server leaderboard. Anyone with a link can read its contents, so use a nickname and share thoughtfully." },
    { title: "Four friendly outcomes", text: "Getting in Sync covers 0–3 matches, Good Vibes 4–6, Close Crew 7–8, and Same Wavelength 9–10. Every match is worth ten points. These playful labels do not judge whether someone is a good friend." }
  ],
  tips: [
    "Choose what feels most like you, rather than the answer you expect a friend to guess.",
    "Send the complete link, including #. If an app trims it, copy it again from the link box.",
    "Keep the original link. Clearing browser storage removes the identifiers used to collect results on this device.",
    "Use the score as a conversation starter. Preferences change; a low score does not make someone a fake friend.",
    "After playing, choose Make my square face to create a separate avatar on the homepage."
  ],
  faq: [
    { question: "Is this the block you test or Don't Block Me quiz from another website?", answer: "No. Friend Block Test is an independent game made for My Square Face Icon. A block you test link created on another website works with that website, not here. Use this page to make a new ten-question friend quiz." },
    { question: "Does the game save or upload my answers?", answer: "The quiz does not upload anything. Answers are carried in the share link. This browser saves up to 20 created-quiz identifiers and the latest 50 received results, including nicknames, avatars and scores. It does not store your original answer list in that results list. Clear quiz records removes local records. Anyone with the link can read its contents." },
    { question: "Do my friends need to sign up?", answer: "No. A friend needs the complete link and a browser with JavaScript enabled. They choose a nickname and avatar before guessing. Sending links uses your own messaging app; the game does not send messages for you." },
    { question: "Can I play on a phone?", answer: "The quiz uses large answer buttons and a single-question flow for narrow screens. Clipboard access can vary in social-app browsers; when copying is blocked, select the displayed link and use your browser's Copy command. No app installation is required." },
    { question: "What if a quiz link will not open?", answer: "Check that everything after # was copied. A damaged or unsupported link shows a recovery message. Ask the sender for a fresh copy. Links from another quiz website must be opened on that original site." },
    { question: "Why is a friend's result missing from My results?", answer: "Your friend must send their result link back, and you must open it in the browser that created the quiz. There is no automatic server collection or device sync. Storage restrictions, cleared site data or the local record limit can prevent saving; the return link can still display the result." },
    { question: "Does Friend Block Test actually block anyone?", answer: "No. It cannot block accounts or decide who your real friends are. A score only counts matching answers to this particular quiz. It is a lighthearted way to discover little preferences and start a conversation." }
  ],
  mobile: { support: "SUPPORTED", orientation: "PORTRAIT_RECOMMENDED", verifiedAt: null, note: "Choose one answer at a time with touch, mouse or keyboard. Results are local to this browser. Reloading clears unfinished answers." },
  fullscreen: { availability: "BROWSER_DEPENDENT", mode: "BROWSER_FULLSCREEN_API", note: "Fullscreen depends on browser support. All quiz actions also work in the normal page view." },
  player: { type: "HTML5", entryUrl: "/games/friend-block-test/index.html" },
  seo: {
    title: "Friend Block Test: How Well Do Your Friends Know You?",
    description: "Create a 10-question friend quiz, share your link, and see who knows you best. Free, no signup; answers stay in the link and results stay on your device.",
    h1: "Friend Block Test", canonical: "https://mysquarefaceicon.com/games/friend-block-test", primaryKeyword: "friend block test",
    secondaryKeywords: ["block you test", "block you test me", "dont block me quiz", "fake friend quiz"],
    searchIntent: "Make a new local ten-question friend quiz and exchange results with friends.",
    semanticCoverage: { topics: ["create a quiz", "share a link", "guess a friend's answers", "score and tiers", "no signup", "phone play", "privacy and local results", "independent-site links", "broken link recovery"], score: null, reviewedAt: null, note: "Implemented topics; live SERP and human review are recorded separately in QUIZ-001 evidence." },
    schemaTypes: ["VideoGame", "FAQPage", "BreadcrumbList"]
  },
  content: {
    summary: "Make a Friend Block Test, share ten little choices, and see how well your friends know you. Free, no signup, and played in your browser.",
    description: ["Friend Block Test is an independent friend-quiz maker created for this site in October 2026. It pairs square face characters with everyday questions you answer for yourself, then asks a friend to guess those choices. Compare what you picked and talk about the surprises.", "This page creates new quizzes for My Square Face Icon. It cannot import invitations from another service or recover another site's quiz. Results reflect ten preferences, not trust or whether someone is a fake friend. There is no real blocking, public ranking or automatic posting."],
    sections: ["player", "how-to-play", "about", "features", "tips", "faq", "source-rights", "related-games"]
  },
  relatedGameIds: ["square-face"], measurements: { inboundLinkCount: null, qualityScore: null },
  publication: { publishedAt: null, modifiedAt: null, timestampStatus: "UNKNOWN", note: "Local implementation prepared 2026-10-12. Public release has not been authorized or verified." },
  author: "My Square Face Icon"
});
export default friendBlockTest;
