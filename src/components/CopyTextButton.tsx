"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyTextButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable; ignore */
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded border border-pause-black/15 bg-white px-2.5 py-1 font-section text-[11px] tracking-wider text-pause-black/70 transition-colors hover:text-pause-orange"
      aria-label={`${label} to clipboard`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 shrink-0" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 shrink-0" /> {label}
        </>
      )}
    </button>
  );
}
