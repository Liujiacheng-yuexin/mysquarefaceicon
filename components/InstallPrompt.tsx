"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function registerServiceWorker() {
      if (!("serviceWorker" in navigator)) return;

      const register = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      };

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(register, { timeout: 4000 });
        return;
      }

      globalThis.setTimeout(register, 2500);
    }

    if (document.readyState === "complete") {
      registerServiceWorker();
    } else {
      window.addEventListener("load", registerServiceWorker, { once: true });
    }

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      const installEvent = event as BeforeInstallPromptEvent;
      setPromptEvent(installEvent);
      if (!window.localStorage.getItem("msfi-install-dismissed")) {
        setVisible(true);
      }
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("load", registerServiceWorker);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  if (!visible || !promptEvent) return null;

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    setVisible(false);
  }

  function dismiss() {
    window.localStorage.setItem("msfi-install-dismissed", "true");
    setVisible(false);
  }

  return (
    <div className="install-prompt" role="dialog" aria-label="Install app prompt">
      <div>
        <strong>Install My Square Face Icon</strong>
        <span>Add the generator to your home screen.</span>
      </div>
      <button className="tool-button primary" type="button" onClick={install}>
        <Download aria-hidden="true" size={18} />
        Install
      </button>
      <button className="icon-button" type="button" onClick={dismiss} aria-label="Dismiss install prompt">
        <X aria-hidden="true" size={18} />
      </button>
    </div>
  );
}
