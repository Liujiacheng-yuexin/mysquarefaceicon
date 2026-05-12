"use client";

import { Copy, Share2 } from "lucide-react";
import { useState } from "react";
import type { LocaleContent } from "@/lib/locales";

type ShareButtonsProps = {
  share: LocaleContent["share"];
  url: string;
  title: string;
};

export default function ShareButtons({ share, url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(share.copy, url);
    }
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
    </div>
  );
}
