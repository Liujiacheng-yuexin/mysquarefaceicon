"use client";

import { useEffect } from "react";

type DeferredThirdPartyScriptsProps = {
  googleAnalyticsId: string;
  googleAdsenseClient: string;
  cloudflareAnalyticsToken?: string;
};

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
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
  googleAnalyticsId,
  googleAdsenseClient,
  cloudflareAnalyticsToken
}: DeferredThirdPartyScriptsProps) {
  useEffect(() => {
    let loaded = false;
    let timer: number | undefined;

    function cleanup() {
      if (timer) window.clearTimeout(timer);
      INTERACTION_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, loadScripts);
      });
    }

    function loadScripts() {
      if (loaded) return;
      loaded = true;
      cleanup();

      appendScript(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsenseClient}`, {
        crossorigin: "anonymous"
      });

      const analyticsWindow = window as AnalyticsWindow;
      analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
      analyticsWindow.gtag = function gtag(...args: unknown[]) {
        analyticsWindow.dataLayer?.push(args);
      };
      analyticsWindow.gtag("js", new Date());
      analyticsWindow.gtag("config", googleAnalyticsId);
      appendScript(`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`);

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
  }, [cloudflareAnalyticsToken, googleAdsenseClient, googleAnalyticsId]);

  return null;
}
