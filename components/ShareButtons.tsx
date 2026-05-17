"use client";

import { Copy, MessageSquareText, Share2 } from "lucide-react";
import { useState } from "react";
import type { LocaleContent } from "@/lib/locales";

type ShareButtonsProps = {
  share: LocaleContent["share"];
  url: string;
  title: string;
};

export default function ShareButtons({ share, url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const caption = `I made a cute square face icon with ${title}. Try the free generator: ${url}`;

  async function copyText(text: string, success: () => void, fallbackLabel: string) {
    try {
      await navigator.clipboard.writeText(text);
      success();
    } catch {
      window.prompt(fallbackLabel, text);
    }
  }

  async function copyLink() {
    await copyText(url, () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }, share.copy);
  }

  async function copyCaption() {
    await copyText(caption, () => {
      setCaptionCopied(true);
      window.setTimeout(() => setCaptionCopied(false), 1800);
    }, "Copy this caption");
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }

    await copyLink();
  }

  return (
    <div className="share-panel" aria-label={share.label}>
      <span>{share.label}</span>
      <button className="tool-button secondary" type="button" onClick={nativeShare}>
        <Share2 aria-hidden="true" size={18} />
        {share.native}
      </button>
      <button className="tool-button secondary" type="button" onClick={copyLink}>
        <Copy aria-hidden="true" size={18} />
        {copied ? share.copied : share.copy}
      </button>
      <button className="tool-button secondary" type="button" onClick={copyCaption}>
        <MessageSquareText aria-hidden="true" size={18} />
        {captionCopied ? "Caption copied" : "Copy caption"}
      </button>
    </div>
  );
}
