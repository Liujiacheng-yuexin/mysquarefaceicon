"use client";

import { useEffect, useRef, useState } from "react";
import { FRIEND_QUIZ_ENTRY } from "../../../lib/games/friend-quiz-policy";
import { getFriendQuizBridge } from "../../../lib/games/friend-quiz-browser";
import type { AdapterStatusHandler } from "./adapter-types";

export default function FriendQuizFrame({ onStatusChange }: { readonly onStatusChange: AdapterStatusHandler }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(640);
  const ready = useRef(false);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "friend-quiz:size" && Number.isFinite(event.data.height)) {
        setHeight(Math.max(520, Math.min(3000, Math.ceil(event.data.height))));
        if (!ready.current) { ready.current = true; onStatusChange({ state: "ready", message: "Friend Block Test is ready. Your quiz stays in your browser." }); }
      } else if (event.data?.type === "friend-quiz:reset") {
        getFriendQuizBridge()?.reset();
      } else if (event.data?.type === "friend-quiz:focus") {
        const top = frame.current?.getBoundingClientRect().top ?? 0;
        if (top < 0) frame.current?.scrollIntoView({ block: "start", behavior: "instant" });
      }
    };
    window.addEventListener("message", receive);
    return () => { window.removeEventListener("message", receive); };
  }, [onStatusChange]);

  useEffect(() => {
    onStatusChange({ state: "loading", message: "Opening your friend quiz…" });
    const timer = window.setTimeout(() => {
      if (!ready.current) onStatusChange({ state: "error", message: "The quiz could not start. Reload to try again." });
    }, 15000);
    return () => window.clearTimeout(timer);
  }, [onStatusChange]);

  return (
    <iframe ref={frame} className="friend-quiz-frame" data-player-adapter="HTML5"
      src={FRIEND_QUIZ_ENTRY} title="Friend Block Test HTML5 game"
      height={height} allow="fullscreen; clipboard-write" referrerPolicy="no-referrer"
      onLoad={() => { if (frame.current) getFriendQuizBridge()?.connect(frame.current); }}
      onError={() => onStatusChange({ state: "error", message: "The quiz could not start. Reload to try again." })} />
  );
}
