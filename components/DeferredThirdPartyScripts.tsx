"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { crossesBannerBoundary, isBannerPath } from "../lib/discord-banner/config";
import { canLoadAdsOutsideCategory, crossesCategoryBoundary } from "../lib/games/category-policy";
import { crossesFriendQuizBoundary, isFriendQuizPath } from "../lib/games/friend-quiz-policy";
import { getFriendQuizBridge } from "../lib/games/friend-quiz-browser";
import {
  canLoadAdsOutsideGamesDirectory,
  crossesGamesDirectoryBoundary
} from "../lib/games/directory-policy";

type DeferredThirdPartyScriptsProps = {
  googleAdsenseClient: string;
  cloudflareAnalyticsToken?: string;
};

const INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"];

function appendScript(src: string, attributes: Record<string, string> = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = src;

  Object.entries(attributes).forEach(([key, value]) => {
    script.setAttribute(key, value);
  });

  document.head.appendChild(script);
}

export default function DeferredThirdPartyScripts({
  googleAdsenseClient,
  cloudflareAnalyticsToken
}: DeferredThirdPartyScriptsProps) {
  const pathname = usePathname();
  const documentPath = useRef<string | null>(pathname);

  useEffect(() => {
    // Collection links use document navigation; also guard a future missed client-side link.
    if (crossesGamesDirectoryBoundary(documentPath.current, pathname)
      || crossesCategoryBoundary(documentPath.current, pathname)
      || crossesBannerBoundary(documentPath.current, pathname)
      || crossesFriendQuizBoundary(documentPath.current, pathname)) {
      window.location.replace(window.location.href);
    }
  }, [pathname]);

  useEffect(() => {
    let loaded = false;
    let timer: number | undefined;

    function cleanup() {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener("load", scheduleAfterLoad);
      INTERACTION_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, loadScripts);
      });
    }

    function loadScripts() {
      if (loaded) return;
      loaded = true;
      cleanup();

      // The local-file editor runs in a clean document with no analytics or ad runtime.
      if (isBannerPath(documentPath.current) || isBannerPath(window.location.pathname)) return;
      const friendQuiz = isFriendQuizPath(documentPath.current) || isFriendQuizPath(window.location.pathname);
      // The raw game remains private. The public detail page must install its
      // fragment guard before any deferred third-party code is allowed to run.
      if (friendQuiz && !getFriendQuizBridge()) return;

      if (canLoadAdsOutsideGamesDirectory(documentPath.current, window.location.pathname)
        && canLoadAdsOutsideCategory(documentPath.current, window.location.pathname)) {
        appendScript(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsenseClient}`, {
          crossorigin: "anonymous",
          ...(friendQuiz ? { referrerpolicy: "no-referrer" } : {})
        });
      }

      if (cloudflareAnalyticsToken) {
        appendScript("https://static.cloudflareinsights.com/beacon.min.js", {
          defer: "defer",
          "data-cf-beacon": JSON.stringify({ token: cloudflareAnalyticsToken })
        });
      }
    }

    function scheduleAfterLoad() {
      timer = window.setTimeout(loadScripts, 12000);
    }

    if (document.readyState === "complete") {
      scheduleAfterLoad();
    } else {
      window.addEventListener("load", scheduleAfterLoad, { once: true });
    }

    INTERACTION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, loadScripts, { once: true, passive: true });
    });

    return () => {
      window.removeEventListener("load", scheduleAfterLoad);
      cleanup();
    };
  }, [cloudflareAnalyticsToken, googleAdsenseClient]);

  return null;
}
