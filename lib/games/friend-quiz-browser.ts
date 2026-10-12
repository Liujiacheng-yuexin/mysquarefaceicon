export type FriendQuizBridge = {
  hasSharedLink(): boolean;
  connect(frame: HTMLIFrameElement): void;
  reset(): void;
  subscribe(listener: () => void): () => void;
};

declare global {
  interface Window {
    __MSFI_FRIEND_QUIZ__?: FriendQuizBridge;
  }
}

export function getFriendQuizBridge(): FriendQuizBridge | undefined {
  return window.__MSFI_FRIEND_QUIZ__;
}
