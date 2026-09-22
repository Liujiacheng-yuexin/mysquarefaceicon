import { GAME_SCHEMA_VERSION, defineGame } from "../../lib/games/game-schema";

const squareFaceGame = defineGame({
  schemaVersion: GAME_SCHEMA_VERSION,
  id: "square-face",
  name: "Square Face Generator",
  slug: "square-face-generator",
  pageType: "GAME",
  type: "RUFFLE_SWF",
  route: {
    path: "/",
    canonical: "https://mysquarefaceicon.com",
    indexStatus: "INDEX",
    existingPublishedRoute: true
  },
  source: {
    kind: "LOCAL_PROJECT_ASSET",
    providerName: "Project repository file",
    originalUrl: null,
    localAssetPath: "public/games/square-face.swf",
    sha256: "B1D074C95F15B7DCECDBC2405ABF820EAD985669BB12CD47247FC8EA7537BC1E",
    attribution: null
  },
  license: {
    registryRecordId: "square-face-swf",
    status: "UNKNOWN",
    releaseDecision: "REVIEW_REQUIRED",
    newPublicationAllowed: false,
    allowedDeliveryTypes: []
  },
  category: {
    primary: "face-makers",
    secondary: ["avatar-makers", "retro-flash"]
  },
  tags: ["square-face", "avatar-maker", "flash-game", "profile-icon", "ruffle"],
  images: [
    {
      role: "THUMBNAIL",
      src: "/square-face-icon.png",
      alt: "Square Face Generator preview",
      width: 512,
      height: 512,
      provenance: "PROJECT_ASSET"
    },
    {
      role: "PLAYER_PREVIEW",
      src: "/games/square-face-cover.png",
      alt: "Square Face Generator game cover",
      width: 970,
      height: 844,
      provenance: "PROJECT_ASSET"
    },
    {
      role: "OPEN_GRAPH",
      src: "/og-image.svg",
      alt: "My Square Face Icon square avatar generator preview",
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
      label: "Choose face parts",
      description: "Use the in-game buttons to change face parts, colors, hair, and accessories.",
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
      title: "Start the game",
      text: "Wait for the Flash game to load in the player above, then press the START button inside the game."
    },
    {
      title: "Customize your square face",
      text: "Use the in-game buttons to change the face, eyes, mouth, hair, colors, accessories, and other details."
    },
    {
      title: "Create your favorite look",
      text: "Try different combinations until you make a funny or cute square face icon. If the original game does not include a save button, you can take a screenshot of your creation."
    }
  ],
  features: [
    {
      title: "Classic Flash Game",
      text: "Play a nostalgic avatar maker from the Flash game era."
    },
    {
      title: "Square Face Avatar",
      text: "Create funny square-shaped face characters."
    },
    {
      title: "No Flash Player Required",
      text: "The game runs in modern browsers with a Flash emulator."
    },
    {
      title: "Free to Play",
      text: "Play directly online without installing anything."
    },
    {
      title: "Simple Controls",
      text: "Use the in-game options to customize your face."
    },
    {
      title: "Desktop Friendly",
      text: "Best played on desktop or laptop browsers."
    }
  ],
  tips: [
    "Use a desktop or laptop browser",
    "Wait a few seconds for the game to load",
    "Try fullscreen mode if the game appears small",
    "Reload the game if it freezes",
    "Use landscape mode on mobile devices"
  ],
  faq: [
    {
      question: "What is Square Face Generator?",
      answer: "Square Face Generator is a classic Flash avatar maker game where you can create funny retro square face icons."
    },
    {
      question: "Can I use my square face as an avatar?",
      answer: "Yes. You can use your square face as a Discord PFP, GitHub avatar, Notion icon, favicon, or social profile picture."
    },
    {
      question: "Do I need Adobe Flash Player?",
      answer: "No. The game runs in modern browsers with Ruffle, so you do not need to install Adobe Flash Player."
    },
    {
      question: "How do I save my square face icon?",
      answer: "Use the in-game save option if it works in your browser, or take a screenshot and crop it into a square icon."
    },
    {
      question: "Does it work on mobile?",
      answer: "It may work on some mobile browsers, but the classic Flash game works best on desktop or laptop devices."
    },
    {
      question: "Is Square Face Generator free?",
      answer: "Yes. The game is free to play and does not require signup."
    }
  ],
  mobile: {
    support: "PARTIAL",
    orientation: "LANDSCAPE_RECOMMENDED",
    verifiedAt: null,
    note: "The current page says the classic Flash controls work best on desktop and recommends landscape mode on phones; no device matrix was verified in GAME-DATA-001."
  },
  fullscreen: {
    availability: "BROWSER_DEPENDENT",
    mode: "BROWSER_FULLSCREEN_API",
    note: "The current player exposes fullscreen only when the browser Fullscreen API is available."
  },
  player: {
    type: "RUFFLE_SWF",
    swfSources: ["/games/square-face.swf"],
    backgroundColor: "#FFAF03",
    aspectRatio: "690 / 600",
    clickToLoad: true
  },
  status: "PUBLISHED",
  seo: {
    title: "Square Face Generator - Free Online Avatar & Icon Maker",
    description: "Create a square face icon online for free. Customize your avatar in your browser, then save in-game or take a screenshot. No signup or Flash plugin needed.",
    h1: "Square Face Generator",
    canonical: "https://mysquarefaceicon.com",
    primaryKeyword: "square face generator",
    secondaryKeywords: ["square face icon generator", "square avatar maker", "classic flash avatar maker"],
    searchIntent: "Play a square face avatar maker and create an icon",
    semanticCoverage: {
      topics: ["square face creation", "avatar use cases", "Ruffle browser play", "saving by screenshot", "mobile guidance"],
      score: null,
      reviewedAt: null,
      note: "Topics mirror the current page; no semantic coverage score was measured in GAME-DATA-001."
    },
    schemaTypes: ["VideoGame", "FAQPage", "BreadcrumbList"]
  },
  content: {
    summary: "Play the classic Square Face Generator online and create retro square face icons for avatars and profile images.",
    description: [
      "Square Face Generator is a classic Flash avatar maker game where you can create funny retro square face icons.",
      "The game runs in modern browsers through Ruffle. Use the in-game save option when it works, or take a screenshot of your finished icon."
    ],
    sections: ["game-player", "gallery-preview", "what-is", "features", "how-to-play", "tips", "faq"],
    homepage: {
      hero: {
        eyebrow: "Classic Flash avatar maker",
        intro: "Play the classic Square Face Generator online and create retro square face icons for avatars, Discord PFPs, GitHub profiles, favicons, and more.",
        cardLabel: "Play Square Face Generator Online"
      },
      about: {
        eyebrow: "About the game",
        title: "What Is Square Face Generator?",
        text: "Square Face Generator is a classic Flash avatar maker game where you can create funny square-shaped face icons. Mix different facial features, expressions, hairstyles, and accessories to design a unique square face character.",
        notesLabel: "Square Face Generator browser notes",
        notes: ["Runs in modern browsers with Ruffle", "No Flash Player installation"]
      },
      headings: {
        features: "Square Face Generator Features",
        howToPlay: "How to Play",
        tipsEyebrow: "Best experience",
        tips: "Tips for the Best Experience",
        faq: "Frequently Asked Questions (FAQ)"
      },
      tipsIntro: "For the best experience, play Square Face Generator on a desktop browser. If the game area looks too small, use the fullscreen button. If the game does not respond, reload the game and try again.",
      finalCta: {
        ariaLabel: "Start playing Square Face Generator",
        title: "Ready to make a square face icon?",
        text: "Jump into the classic Square Face Generator and start creating now!",
        linkLabel: "Play Square Face Generator Now"
      },
      videoGameDescription: "Play the classic Square Face Generator Flash avatar maker game online and create retro square face icons.",
      playerPresentation: {
        ariaLabel: "Square face Flash generator",
        coverLabel: "Start Square Face Generator game",
        loadingMessage: "Loading Square Face Generator...",
        errorMessage: "The game could not be loaded. Please refresh the page or try a desktop browser.",
        slowLoadingHint: "Still loading? This classic Flash game may take a few seconds to start.",
        deviceNotice: "This classic Flash game works best on desktop. If you are using a phone, try landscape mode for a better experience.",
        maxWidth: "980px",
        reportHref: "/contact",
        startLabel: "Play Game",
        reloadLabel: "Reload Game",
        helpLabel: "Report Issue",
        showStartControl: false
      }
    }
  },
  relatedGameIds: ["oval-face", "pixel-art-avatar"],
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

export default squareFaceGame;
