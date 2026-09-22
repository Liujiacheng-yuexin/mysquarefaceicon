import { GAME_SCHEMA_VERSION, defineGame } from "../../lib/games/game-schema";

const ovalFaceGame = defineGame({
  schemaVersion: GAME_SCHEMA_VERSION,
  id: "oval-face",
  name: "Oval Face Icon Generator",
  slug: "oval-face-icon-generator",
  pageType: "GAME",
  type: "RUFFLE_SWF",
  route: {
    path: "/oval-face-icon-generator",
    canonical: "https://mysquarefaceicon.com/oval-face-icon-generator",
    indexStatus: "INDEX",
    existingPublishedRoute: true
  },
  source: {
    kind: "LOCAL_PROJECT_ASSET",
    providerName: "Project repository file",
    originalUrl: null,
    localAssetPath: "public/games/oval-face.swf",
    sha256: "80E974D8EF4AD5E849E93464EAEA1833620C269BAC30601D960F5438C285E09B",
    attribution: null
  },
  license: {
    registryRecordId: "oval-face-swf",
    status: "UNKNOWN",
    releaseDecision: "REVIEW_REQUIRED",
    newPublicationAllowed: false,
    allowedDeliveryTypes: []
  },
  category: {
    primary: "face-makers",
    secondary: ["avatar-makers", "retro-flash"]
  },
  tags: ["oval-face", "avatar-maker", "flash-game", "rounded-icon", "ruffle"],
  images: [
    {
      role: "THUMBNAIL",
      src: "/games/oval-face-icon.png",
      alt: "Oval Face Icon Generator preview",
      width: 512,
      height: 512,
      provenance: "PROJECT_ASSET"
    },
    {
      role: "PLAYER_PREVIEW",
      src: "/games/oval-face-cover.png",
      alt: "Oval Face Icon Generator game cover",
      width: 974,
      height: 775,
      provenance: "PROJECT_ASSET"
    },
    {
      role: "OPEN_GRAPH",
      src: "/og-image.svg",
      alt: "Oval Face Icon Generator classic Flash avatar maker",
      width: 1200,
      height: 630,
      provenance: "PROJECT_ASSET"
    }
  ],
  controls: [
    {
      id: "load-game",
      label: "Load the game",
      description: "Click, tap, or use the keyboard on the preview to initialize the Ruffle player.",
      inputMethods: ["POINTER", "TOUCH", "KEYBOARD"]
    },
    {
      id: "in-game-options",
      label: "Choose oval face parts",
      description: "Use the in-game tabs and buttons to choose features, hair, expressions, colors, and accessories.",
      inputMethods: ["POINTER", "TOUCH"]
    },
    {
      id: "player-actions",
      label: "Player actions",
      description: "Use the page controls to enter fullscreen, reload the game, or report an issue.",
      inputMethods: ["POINTER", "TOUCH", "KEYBOARD"]
    }
  ],
  howToPlay: [
    {
      title: "Load the oval face game",
      text: "Wait for the classic Flash game to appear in the player, then press the START button inside the game."
    },
    {
      title: "Pick oval face parts",
      text: "Use the in-game tabs to choose facial features, hair, expressions, colors, and small accessories."
    },
    {
      title: "Make a softer profile icon",
      text: "Try different combinations until the oval face feels right for your profile. If saving does not work in your browser, take a screenshot."
    }
  ],
  features: [
    {
      title: "Oval Face Style",
      text: "Create a softer rounded avatar look instead of a square face layout."
    },
    {
      title: "Classic Flash Game",
      text: "Play a preserved avatar maker from the classic browser game era."
    },
    {
      title: "No Flash Player Required",
      text: "The game runs through Ruffle, so modern browsers can load the SWF without Adobe Flash Player."
    },
    {
      title: "Simple Avatar Controls",
      text: "Choose parts from the game interface and experiment with different looks."
    },
    {
      title: "Free to Play",
      text: "Open the game directly in your browser without installing software or creating an account."
    },
    {
      title: "Desktop Friendly",
      text: "The original controls were designed for desktop, but mobile landscape mode may still work."
    }
  ],
  tips: [
    "Use a desktop or laptop browser for the most reliable controls",
    "Give Ruffle a few seconds to initialize before pressing buttons",
    "Use fullscreen mode if the player feels too small",
    "Reload the game if the SWF freezes or stops responding",
    "Use landscape mode if you are testing on a phone"
  ],
  faq: [
    {
      question: "What is Oval Face Icon Generator?",
      answer: "Oval Face Icon Generator is a classic Flash avatar maker game where you can create cute rounded face icons."
    },
    {
      question: "Can I play Oval Face Icon Generator online?",
      answer: "Yes. You can play it directly in your browser using the Ruffle-powered game player on this page."
    },
    {
      question: "Is Oval Face Icon Generator different from Square Face Generator?",
      answer: "Yes. The oval version focuses on a rounded face shape, while Square Face Generator keeps the original square icon style."
    },
    {
      question: "Does Oval Face Icon Generator work on mobile?",
      answer: "It may work on some mobile browsers, but the original Flash game controls are usually better on desktop or laptop devices."
    },
    {
      question: "Can I save my oval face icon?",
      answer: "If the original game save feature does not work in your browser, you can take a screenshot of your finished avatar."
    }
  ],
  mobile: {
    support: "PARTIAL",
    orientation: "LANDSCAPE_RECOMMENDED",
    verifiedAt: null,
    note: "The current page says the original Flash controls work best on desktop and recommends landscape mode on phones; no device matrix was verified in GAME-DATA-001."
  },
  fullscreen: {
    availability: "BROWSER_DEPENDENT",
    mode: "BROWSER_FULLSCREEN_API",
    note: "The current player exposes fullscreen only when the browser Fullscreen API is available."
  },
  player: {
    type: "RUFFLE_SWF",
    swfSources: ["/games/oval-face.swf"],
    backgroundColor: "#FFAF03",
    aspectRatio: "972 / 774",
    clickToLoad: true
  },
  status: "PUBLISHED",
  seo: {
    title: "Oval Face Icon Generator - Play the Classic Flash Avatar Game Online",
    description: "Play Oval Face Icon Generator online, a classic Flash avatar maker game for creating cute oval face icons in your browser. No Flash Player required.",
    h1: "Oval Face Icon Generator",
    canonical: "https://mysquarefaceicon.com/oval-face-icon-generator",
    primaryKeyword: "oval face icon generator",
    secondaryKeywords: ["oval face avatar maker", "rounded profile icon", "classic flash avatar game"],
    searchIntent: "Play an oval face avatar maker and create a rounded profile icon",
    semanticCoverage: {
      topics: ["oval face creation", "rounded profile icons", "Ruffle browser play", "saving by screenshot", "mobile guidance"],
      score: null,
      reviewedAt: null,
      note: "Topics mirror the current page; no semantic coverage score was measured in GAME-DATA-001."
    },
    schemaTypes: ["VideoGame", "FAQPage", "BreadcrumbList"]
  },
  content: {
    summary: "Play the classic Oval Face Icon Generator online and create cute rounded face icons in a modern browser.",
    description: [
      "Oval Face Icon Generator is a classic Flash avatar maker game for creating cute rounded face icons in a modern browser.",
      "The oval version focuses on a rounded face shape, while Square Face Generator keeps the original square icon style."
    ],
    legacyPage: {
      "hero": {
        "eyebrow": "Classic Flash oval avatar maker",
        "intro": "Play the classic Oval Face Icon Generator Flash game online. Create cute rounded face icons directly in your browser with a softer avatar style.",
        "playLabel": "Play Now",
        "howToPlayLabel": "How to Play"
      },
      "card": {
        "label": "Oval Face Icon Generator",
        "title": "Play Oval Face Icon Generator Online",
        "description": "Click Play Now to load the classic oval face Flash game in Ruffle. It keeps the original rounded avatar maker intact while the page around it stays mobile friendly.",
        "badge": "Classic Flash Game"
      },
      "about": {
        "eyebrow": "About the game",
        "title": "What Is Oval Face Icon Generator?",
        "text": "Oval Face Icon Generator is a classic Flash avatar maker game for designing rounded face icons. It is useful when you want a softer character look than a square icon while keeping the same quick browser-game workflow."
      },
      "headings": {
        "howToPlayEyebrow": "Three simple steps",
        "howToPlay": "How to Play Oval Face Icon Generator",
        "featuresEyebrow": "Game features",
        "features": "Oval Face Icon Generator Features",
        "tipsEyebrow": "Best experience",
        "tips": "Tips for the Best Oval Face Experience",
        "troubleshootingEyebrow": "Help",
        "troubleshooting": "Troubleshooting Oval Face Icon Generator",
        "faqEyebrow": "FAQ",
        "faq": "Frequently Asked Questions",
        "relatedEyebrow": "More avatar makers",
        "related": "Related Avatar Games and Tools"
      },
      "troubleshooting": [
        {
          "title": "Oval Face Icon Generator is not loading",
          "text": "Wait a few seconds first. If it still does not start, use Reload Game or refresh the page."
        },
        {
          "title": "The game freezes after loading",
          "text": "Click Reload Game to remount the Ruffle player without leaving the page."
        },
        {
          "title": "Mobile buttons are hard to use",
          "text": "This is a classic Flash game built for desktop-style input. Rotate your phone or use a desktop browser."
        },
        {
          "title": "Do I need Adobe Flash Player?",
          "text": "No. This page uses a modern Flash emulator, so you do not need to install Adobe Flash Player."
        }
      ],
      "relatedGames": [
        {
          "gameId": "square-face",
          "title": "Square Face Generator",
          "text": "Play the original square-shaped classic Flash avatar maker.",
          "imageSrc": "/square-face-icon.png",
          "imageAlt": "Square Face Generator preview",
          "relatedCard": {
            "title": "Square Face Generator",
            "text": "Play the square-shaped version of the classic face icon maker."
          }
        },
        {
          "gameId": "pixel-art-avatar",
          "title": "Pixel Art Avatar Icon Generator",
          "text": "Open a chibi pixel avatar maker with source credit.",
          "imageSrc": "/game-face-samples/gamer.webp",
          "imageAlt": "Pixel art avatar icon generator preview"
        }
      ],
      "videoGameDescription": "Play the classic Oval Face Icon Generator Flash avatar maker game online.",
      "playerPresentation": {
        "ariaLabel": "Oval face Flash generator",
        "coverLabel": "Start Oval Face Icon Generator game",
        "loadingMessage": "Loading Oval Face Icon Generator...",
        "errorMessage": "The oval face game could not be loaded. Please refresh the page or try a desktop browser.",
        "slowLoadingHint": "Still loading? This classic oval face game may take a few seconds to start.",
        "deviceNotice": "This classic Flash game works best on desktop. If you are using a phone, try landscape mode for a better oval face editing experience.",
        "maxWidth": "972px",
        "reportHref": "/contact",
        "startLabel": "Start Game",
        "reloadLabel": "Reload",
        "helpLabel": "Game Help",
        "showStartControl": true
      }
    },
    sections: ["game-player", "gallery-preview", "what-is", "how-to-play", "features", "tips", "troubleshooting", "faq"]
  },
  relatedGameIds: ["square-face", "pixel-art-avatar"],
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

export default ovalFaceGame;
