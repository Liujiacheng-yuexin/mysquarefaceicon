import { GAME_SCHEMA_VERSION, defineGame } from "../../lib/games/game-schema";

const pixelArtAvatarGame = defineGame({
  schemaVersion: GAME_SCHEMA_VERSION,
  id: "pixel-art-avatar",
  name: "Pixel Art Avatar Icon Generator",
  slug: "pixel-art-avatar-icon-generator",
  pageType: "EXTERNAL_TOOL",
  type: "EXTERNAL_LINK",
  route: {
    path: "/pixel-art-avatar-icon-generator",
    canonical: "https://mysquarefaceicon.com/pixel-art-avatar-icon-generator",
    indexStatus: "INDEX",
    existingPublishedRoute: true
  },
  source: {
    kind: "OFFICIAL_EXTERNAL_PAGE",
    providerName: "IconGenerators",
    originalUrl: "https://www.icongenerators.net/pixelavatar.html",
    localAssetPath: null,
    sha256: null,
    attribution: "Original generator by Eichi Zerona / えいちぜろな (@h071019) on icongenerators.net."
  },
  license: {
    registryRecordId: "pixel-avatar-external",
    status: "RESTRICTED",
    releaseDecision: "DIRECT_LINK_ONLY",
    newPublicationAllowed: true,
    allowedDeliveryTypes: ["EXTERNAL_LINK"]
  },
  category: {
    primary: "pixel-avatars",
    secondary: ["avatar-makers", "character-creators"]
  },
  tags: ["pixel-art", "chibi-avatar", "external-tool", "profile-icon", "direct-link"],
  images: [
    {
      role: "THUMBNAIL",
      src: "/game-face-samples/gamer.webp",
      alt: "Pixel-friendly gamer avatar preview",
      width: 512,
      height: 512,
      provenance: "PROJECT_ASSET"
    },
    {
      role: "OPEN_GRAPH",
      src: "/og-image.svg",
      alt: "Pixel Art Avatar Icon Generator external tool page",
      width: 1200,
      height: 630,
      provenance: "PROJECT_ASSET"
    }
  ],
  controls: [
    {
      id: "open-original",
      label: "Open the original generator",
      description: "Use the page link to open the official icongenerators.net generator in a new browser tab.",
      inputMethods: ["POINTER", "TOUCH", "KEYBOARD"]
    },
    {
      id: "external-controls",
      label: "Use the original tool controls",
      description: "Choose pixel character parts and save or copy the result using the controls on the original site.",
      inputMethods: ["POINTER", "TOUCH"]
    }
  ],
  howToPlay: [
    {
      title: "Open the original generator",
      text: "Use the original-page button to open the icongenerators.net pixel avatar maker in a new tab."
    },
    {
      title: "Choose pixel character parts",
      text: "Use the generator controls to mix face details, hair, clothes, colors, and small accessories into a chibi pixel character."
    },
    {
      title: "Save or copy your result",
      text: "Follow the controls inside the original generator. If a browser blocks a feature, try a desktop browser or another network."
    }
  ],
  features: [
    {
      title: "External original tool",
      text: "The generator is provided by icongenerators.net, with visible source credit and a direct link to the original page."
    },
    {
      title: "Pixel art avatar style",
      text: "The tool focuses on small chibi character icons with a retro pixel-art look."
    },
    {
      title: "Works beside our face games",
      text: "Use it as a pixel-avatar companion to Square Face Generator and Oval Face Icon Generator."
    },
    {
      title: "No local copy of assets",
      text: "This page does not copy the external site files, artwork, comments, or generator source."
    },
    {
      title: "Original page access",
      text: "The original site restricts iframe embedding. Open the generator directly on icongenerators.net."
    },
    {
      title: "Desktop recommended",
      text: "Avatar generators with detailed controls are usually easier to use on desktop or landscape tablet screens."
    }
  ],
  tips: [
    "Use a desktop browser when editing detailed pixel parts",
    "Open the original generator in a new tab for the most reliable experience",
    "Try a simple color palette so the avatar stays readable at small sizes",
    "Check the icon at profile-picture size before using it",
    "Respect the original creator and link back when sharing the tool"
  ],
  faq: [
    {
      question: "What is Pixel Art Avatar Icon Generator?",
      answer: "Pixel Art Avatar Icon Generator is an external pixel-style chibi character icon maker from icongenerators.net."
    },
    {
      question: "Is this tool owned by My Square Face Icon?",
      answer: "No. This page links to the external generator with source attribution. The original tool and its assets remain on icongenerators.net."
    },
    {
      question: "Why does this page open the original site?",
      answer: "This page provides a direct link instead of embedding the generator. The original site restricts iframe embedding; use Open Original Page to continue on icongenerators.net."
    },
    {
      question: "Can a VPN, proxy, or network filter stop the generator from opening?",
      answer: "VPNs, privacy extensions, or network rules can affect access to external sites. Open the original page directly and, if it is unavailable, check with your network administrator or try again later."
    },
    {
      question: "Does this page copy the generator assets?",
      answer: "No. This site does not host or copy the original generator files, artwork, comments, or source code."
    },
    {
      question: "Can I use it on mobile?",
      answer: "The original site's mobile behavior has not been independently verified. Detailed controls may be easier on desktop or in landscape mode."
    }
  ],
  mobile: {
    support: "UNKNOWN",
    orientation: "LANDSCAPE_RECOMMENDED",
    verifiedAt: null,
    note: "The current page says the external tool may work on mobile and recommends desktop or landscape; the external mobile experience was not verified in GAME-DATA-001."
  },
  fullscreen: {
    availability: "NOT_APPLICABLE",
    mode: "NONE",
    note: "This project provides a direct link and does not host or embed the external generator, so it exposes no local fullscreen control."
  },
  player: {
    type: "EXTERNAL_LINK",
    url: "https://www.icongenerators.net/pixelavatar.html",
    ctaLabel: "Open Original Page",
    target: "_blank",
    rel: ["noopener", "noreferrer"],
    directLinkOnly: true
  },
  status: "PUBLISHED",
  seo: {
    title: "Pixel Art Avatar Icon Generator - Open the Original Chibi Icon Maker",
    description: "Open the Pixel Art Avatar Icon Generator from icongenerators.net to create cute chibi pixel icons, with source credit, play tips, and browser guidance.",
    h1: "Pixel Art Avatar Icon Generator",
    canonical: "https://mysquarefaceicon.com/pixel-art-avatar-icon-generator",
    primaryKeyword: "pixel art avatar icon generator",
    secondaryKeywords: ["chibi pixel icon maker", "pixel avatar maker", "icongenerators pixelavatar"],
    searchIntent: "Open the original icongenerators.net pixel avatar maker with source attribution and clear external boundaries",
    semanticCoverage: {
      topics: ["pixel avatar creation", "official source attribution", "direct-link access", "no-copy boundary", "mobile guidance"],
      score: null,
      reviewedAt: null,
      note: "Topics mirror the current direct-link page; no semantic coverage score was measured in GAME-DATA-001."
    },
    schemaTypes: ["WebPage", "FAQPage", "BreadcrumbList"]
  },
  content: {
    summary: "Open the original icongenerators.net pixel avatar maker with visible attribution, usage tips, and a direct-link-only boundary.",
    description: [
      "Pixel Art Avatar Icon Generator is an external pixel-style chibi character icon maker from icongenerators.net.",
      "This page links to the external generator with source attribution and does not host or copy the original generator files, artwork, comments, or source code."
    ],
    sections: ["external-tool", "gallery-preview", "what-is", "how-to-use", "features", "tips", "faq"]
  },
  relatedGameIds: ["square-face", "oval-face"],
  measurements: {
    inboundLinkCount: null,
    qualityScore: null
  },
  publication: {
    publishedAt: null,
    modifiedAt: null,
    timestampStatus: "UNKNOWN",
    note: "The route is already live, but exact public publication and modification timestamps were not verified for GAME-DATA-001."
  },
  author: null
});

export default pixelArtAvatarGame;
