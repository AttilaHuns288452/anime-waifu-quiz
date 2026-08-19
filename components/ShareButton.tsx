"use client";
import { useState } from "react";

export function ShareButton({ title, text, url }: { title: string; text: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const onShare = async () => {
    const shareData: ShareData = { title, text, url };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button onClick={onShare} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400">
      {copied ? "✓ Copied!" : "📤 Share"}
    </button>
  );
}
