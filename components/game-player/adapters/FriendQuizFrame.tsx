"use client";

import { useEffect, useRef, useState } from "react";
import { FRIEND_QUIZ_ENTRY } from "../../../lib/games/friend-quiz-policy";
import type { AdapterStatusHandler } from "./adapter-types";

export default function FriendQuizFrame({ onStatusChange }: { readonly onStatusChange: AdapterStatusHandler }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [fragment, setFragment] = useState<string | null>(null);
  const [height, setHeight] = useState(640);
  const ready = useRef(false);

  useEffect(() => {
    const sync = () => { ready.current = false; setFragment(window.location.hash === "#game-player" ? "" : window.location.hash); };
    sync();
    window.addEventListener("hashchange", sync);
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "friend-quiz:size" && Number.isFinite(event.data.height)) {
        setHeight(Math.max(520, Math.min(3000, Math.ceil(event.data.height))));
        if (!ready.current) { ready.current = true; onStatusChange({ state: "ready", message: "Friend Block Test is ready. Your quiz stays in your browser." }); }
      } else if (event.data?.type === "friend-quiz:reset") {
        window.history.replaceState(null, "", window.location.pathname);
      } else if (event.data?.type === "friend-quiz:focus") {
        const top = frame.current?.getBoundingClientRect().top ?? 0;
        if (top < 0) frame.current?.scrollIntoView({ block: "start", behavior: "instant" });
      }
    };
    window.addEventListener("message", receive);
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener("message", receive); };
  }, [onStatusChange]);

  useEffect(() => {
    if (fragment === null) return;
    onStatusChange({ state: "loading", message: "Opening your friend quiz…" });
    const timer = window.setTimeout(() => {
      if (!ready.current) onStatusChange({ state: "error", message: "The quiz could not start. Reload to try again." });
    }, 15000);
    return () => window.clearTimeout(timer);
  }, [fragment, onStatusChange]);

  return fragment === null ? null : (
    <iframe ref={frame} className="friend-quiz-frame" data-player-adapter="HTML5"
      src={`${FRIEND_QUIZ_ENTRY}${fragment}`} title="Friend Block Test HTML5 game"
      height={height} allow="fullscreen; clipboard-write" referrerPolicy="no-referrer"
      onError={() => onStatusChange({ state: "error", message: "The quiz could not start. Reload to try again." })} />
  );
}
