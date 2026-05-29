"use client";

import { useState } from "react";
import { Copy, Check, X } from "lucide-react";

type Status = "idle" | "copied" | "error";

export default function CopyPromptButton({ src }: { src: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleCopy() {
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3500);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 border border-[#1a1a1a] bg-white px-4 py-2.5 font-section text-xs tracking-wider text-black transition-colors hover:bg-pause-gray-light"
      aria-label="Copy the setup prompt to your clipboard"
    >
      {status === "copied" ? (
        <>
          <Check className="h-4 w-4 shrink-0" /> Copied to clipboard
        </>
      ) : status === "error" ? (
        <>
          <X className="h-4 w-4 shrink-0" /> Copy failed — use download
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 shrink-0" /> Copy prompt
        </>
      )}
    </button>
  );
}
