"use client";

import { useEffect, useRef } from "react";
import GamePlayer, { type GamePlayerHandle } from "../game-player/GamePlayer";
import type { GamePlayerModel } from "../../lib/games/game-player-model";
import { getFriendQuizBridge } from "../../lib/games/friend-quiz-browser";

export default function FriendQuizPlayer({ model }: { model: GamePlayerModel }) {
  const player = useRef<GamePlayerHandle>(null);
  const started = useRef(false);

  useEffect(() => {
    const bridge = getFriendQuizBridge();
    function openSharedLink() {
      if (!bridge?.hasSharedLink()) return;
      if (!started.current) {
        const active = document.querySelector('[data-game-id="friend-block-test"] [data-player-activated="true"]');
        if (!active) player.current?.activateOrReload();
        started.current = true;
      }
      document.getElementById("game-player")?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    // Start after the mount/cleanup cycle so React Strict Mode cannot cancel
    // the shared player's pending adapter paint while leaving it activated.
    const startFrame = window.requestAnimationFrame(openSharedLink);
    const unsubscribe = bridge?.subscribe(openSharedLink);
    return () => { window.cancelAnimationFrame(startFrame); unsubscribe?.(); };
  }, []);

  return <GamePlayer ref={player} model={model} />;
}
