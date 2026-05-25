"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export default function SectionAnchor({ id, dark = true }: { id: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Link zu diesem Abschnitt kopieren"
      className="sm:opacity-0 sm:group-hover/section:opacity-100 opacity-100 transition-opacity inline-flex items-center justify-center self-start mt-2 ml-3 min-w-[44px] min-h-[44px] cursor-pointer"
    >
      {copied
        ? <Check size={22} className="text-[#FF9416]" />
        : <Link2 size={22} className={dark ? "text-white/40 hover:text-white/80" : "text-black/30 hover:text-black/60"} />
      }
    </button>
  );
}
