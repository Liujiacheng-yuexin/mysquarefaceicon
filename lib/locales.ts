export const siteUrl = "https://mysquarefaceicon.com";

export const localeCodes = ["en", "es", "vi", "ja", "th", "ar", "ru", "id"] as const;

export type LocaleCode = (typeof localeCodes)[number];

export const reviewedLocaleCodes = ["en"] as const satisfies readonly LocaleCode[];

export type ReviewedLocaleCode = (typeof reviewedLocaleCodes)[number];

type Step = {
  title: string;
  text: string;
};

type Card = {
  title: string;
  text: string;
};

type Faq = {
  question: string;
  answer: string;
};

export type LocaleContent = {
  code: LocaleCode;
  label: string;
  shortLabel: string;
  path: string;
  dir: "ltr" | "rtl";
  title: string;
  description: string;
  nav: {
    generator: string;
    howTo: string;
    comments: string;
    faq: string;
  };
  hero: {
    eyebrow: string;
    h1: string;
    text: string;
  };
  sections: {
    howEyebrow: string;
    howTitle: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryNote: string;
    featuresEyebrow: string;
    featuresTitle: string;
    useEyebrow: string;
    useTitle: string;
    commentsEyebrow: string;
    commentsTitle: string;
    faqEyebrow: string;
    faqTitle: string;
  };
  steps: Step[];
  features: Card[];
  useCases: Card[];
  faq: Faq[];
  share: {
    label: string;
    copy: string;
    copied: string;
    native: string;
  };
  comments: {
    intro: string;
    name: string;
    email: string;
    rating: string;
    comment: string;
    image: string;
    submit: string;
    pending: string;
    error: string;
    empty: string;
    loadError: string;
  };
  footer: {
    description: string;
    privacy: string;
    terms: string;
  };
};

const englishFeatures: Card[] = [
  {
    title: "Simple & Fun",
    text: "Open the square face generator, press Start Game, and begin making a cute icon without a long setup flow."
  },
  {
    title: "Free to Use",
    text: "The generator is free to play in your browser and does not require signup, payment, or an installed app."
  },
  {
    title: "Original Game Feel",
    text: "The main tool keeps the familiar Flash avatar maker interaction by running the authorized SWF through Ruffle."
  },
  {
    title: "Browser Friendly",
    text: "Ruffle lets modern browsers play the generator without installing the old Flash Player plugin."
  },
  {
    title: "Troubleshooting Help",
    text: "If the game does not load or freezes, the page provides reload guidance and a clear report path."
  },
  {
    title: "Made for Profile Icons",
    text: "The square layout works well for Discord, TikTok, YouTube, forums, game profiles, and small account avatars."
  }
];

const englishUseCases: Card[] = [
  {
    title: "Social Media Profiles",
    text: "Create a playful square face icon for TikTok, YouTube, Instagram, X, or any profile page that uses a small avatar."
  },
  {
    title: "Game Profiles",
    text: "Use a simple character icon for game accounts, lobbies, clans, and casual player communities."
  },
  {
    title: "Team & Community",
    text: "Make matching square avatars for friend groups, chat servers, classroom projects, or small online communities."
  },
  {
    title: "Creative Projects",
    text: "Use a cute square face as a placeholder character, profile badge, mood board detail, or lightweight visual identity."
  }
];

const englishFaq: Faq[] = [
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
];

const englishSections = {
  howEyebrow: "Simple workflow",
  howTitle: "How It Works",
  galleryEyebrow: "Guide",
  galleryTitle: "What Is a Square Face Generator?",
  galleryNote: "Learn how this browser-based generator helps create cute square profile icons without installing anything.",
  featuresEyebrow: "Built for quick profiles",
  featuresTitle: "Why Use This Square Face Generator?",
  useEyebrow: "Perfect for",
  useTitle: "Perfect For",
  commentsEyebrow: "Community",
  commentsTitle: "Share Your Creation",
  faqEyebrow: "FAQ",
  faqTitle: "Frequently Asked Questions"
};

const englishSteps: Step[] = [
  {
    title: "Choose face parts",
    text: "Press Start Game and use the original tabs to choose face parts, hair, eyes, mouth, clothes, and accessories."
  },
  {
    title: "Adjust colors & styles",
    text: "Try different combinations until your square face icon matches the mood you want for your profile or project."
  },
  {
    title: "Save your square face icon",
    text: "Use the game save option when supported. If saving is not available in your browser, take a screenshot of your finished square face."
  }
];

const englishShare = {
  label: "Share",
  copy: "Copy link",
  copied: "Copied",
  native: "Share"
};

const englishComments = {
  intro: "Share feedback or your square face creation. Comments are reviewed before publishing.",
  name: "Your name",
  email: "Your email",
  rating: "Rating",
  comment: "Write a comment",
  image: "Optional image",
  submit: "Submit comment",
  pending: "Thanks. Your comment is waiting for review.",
  error: "Something went wrong. Please try again.",
  empty: "No approved comments yet.",
  loadError: "Could not load comments."
};

const englishFooter = {
  description: "Free square face generator for quick profile icons.",
  privacy: "Privacy Policy",
  terms: "Terms of Service"
};

const enContent: LocaleContent = {
  code: "en",
  label: "English",
  shortLabel: "EN",
  path: "/",
  dir: "ltr",
  title: "Square Face Generator - Classic Flash Avatar & Icon Maker",
  description: "Play Square Face Generator online and create retro square face icons for avatars, Discord PFPs, GitHub profiles, favicons, and more. Free, no signup, no Flash plugin required.",
  nav: {
    generator: "Generator",
    howTo: "How to Use",
    comments: "Comments",
    faq: "FAQ"
  },
  hero: {
    eyebrow: "Classic Flash avatar maker",
    h1: "Square Face Generator",
    text: "Play the classic Square Face Generator online and create retro square face icons for avatars, Discord PFPs, GitHub profiles, favicons, and more."
  },
  sections: englishSections,
  steps: englishSteps,
  features: englishFeatures,
  useCases: englishUseCases,
  faq: englishFaq,
  share: englishShare,
  comments: englishComments,
  footer: englishFooter
};

const draftLocaleMeta = {
  es: {
    label: "Espanol",
    shortLabel: "ES",
    path: "/es",
    dir: "ltr",
    title: "My Square Face Icon - Square Face Generator",
    description: "Draft Spanish page for the square face generator. This localized page is not indexed until review is complete.",
    h1: "Square Face Generator"
  },
  vi: {
    label: "Tieng Viet",
    shortLabel: "VI",
    path: "/vi",
    dir: "ltr",
    title: "My Square Face Icon - Square Face Generator",
    description: "Draft Vietnamese page for the square face generator. This localized page is not indexed until review is complete.",
    h1: "Square Face Generator"
  },
  ja: {
    label: "Japanese",
    shortLabel: "JA",
    path: "/ja",
    dir: "ltr",
    title: "My Square Face Icon - Square Face Generator",
    description: "Draft Japanese page for the square face generator. This localized page is not indexed until review is complete.",
    h1: "Square Face Generator"
  },
  th: {
    label: "Thai",
    shortLabel: "TH",
    path: "/th",
    dir: "ltr",
    title: "My Square Face Icon - Square Face Generator",
    description: "Draft Thai page for the square face generator. This localized page is not indexed until review is complete.",
    h1: "Square Face Generator"
  },
  ar: {
    label: "Arabic",
    shortLabel: "AR",
    path: "/ar",
    dir: "rtl",
    title: "My Square Face Icon - Square Face Generator",
    description: "Draft Arabic page for the square face generator. This localized page is not indexed until review is complete.",
    h1: "Square Face Generator"
  },
  ru: {
    label: "Russian",
    shortLabel: "RU",
    path: "/ru",
    dir: "ltr",
    title: "My Square Face Icon - Square Face Generator",
    description: "Draft Russian page for the square face generator. This localized page is not indexed until review is complete.",
    h1: "Square Face Generator"
  },
  id: {
    label: "Bahasa Indonesia",
    shortLabel: "ID",
    path: "/id",
    dir: "ltr",
    title: "My Square Face Icon - Square Face Generator",
    description: "Draft Indonesian page for the square face generator. This localized page is not indexed until review is complete.",
    h1: "Square Face Generator"
  }
} satisfies Record<Exclude<LocaleCode, "en">, {
  label: string;
  shortLabel: string;
  path: string;
  dir: "ltr" | "rtl";
  title: string;
  description: string;
  h1: string;
}>;

function makeDraftLocale(code: Exclude<LocaleCode, "en">): LocaleContent {
  const meta = draftLocaleMeta[code];
  return {
    code,
    label: meta.label,
    shortLabel: meta.shortLabel,
    path: meta.path,
    dir: meta.dir,
    title: meta.title,
    description: meta.description,
    nav: enContent.nav,
    hero: {
      eyebrow: "Localization review pending",
      h1: meta.h1,
      text: "This localized page is available for testing, but it is kept out of search results until the translation has been reviewed."
    },
    sections: englishSections,
    steps: englishSteps,
    features: englishFeatures,
    useCases: englishUseCases,
    faq: englishFaq,
    share: englishShare,
    comments: englishComments,
    footer: englishFooter
  };
}

export const locales: Record<LocaleCode, LocaleContent> = {
  en: enContent,
  es: makeDraftLocale("es"),
  vi: makeDraftLocale("vi"),
  ja: makeDraftLocale("ja"),
  th: makeDraftLocale("th"),
  ar: makeDraftLocale("ar"),
  ru: makeDraftLocale("ru"),
  id: makeDraftLocale("id")
};

export function getLocalePath(locale: LocaleCode) {
  return locales[locale].path;
}

export function getLocaleUrl(locale: LocaleCode) {
  return `${siteUrl}${getLocalePath(locale) === "/" ? "" : getLocalePath(locale)}`;
}

export function isLocaleCode(value: string): value is Exclude<LocaleCode, "en"> {
  return value !== "en" && localeCodes.includes(value as LocaleCode);
}

export function isReviewedLocaleCode(locale: LocaleCode): locale is ReviewedLocaleCode {
  return reviewedLocaleCodes.includes(locale as ReviewedLocaleCode);
}

export function getLanguageAlternates() {
  return Object.fromEntries(reviewedLocaleCodes.map((locale) => [locale, getLocaleUrl(locale)]));
}
