"use client";

export default function FriendQuizStartButton() {
  function start() {
    const player = document.getElementById("game-player");
    // A #game-player anchor would replace the quiz/result fragment. An action
    // button preserves the incoming link and never restarts an active quiz.
    player?.querySelector<HTMLButtonElement>("button[data-player-preview]")?.click();
    player?.scrollIntoView({ block: "start" });
  }
  return <button type="button" className="mobile-start-link friend-quiz-start-button" onClick={start} aria-label="Play this friend quiz">Play</button>;
}
