"use client";

import { Link2 } from "lucide-react";

export default function LinkedHeading({ id, children, dark = false }: { id: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="group/heading relative flex justify-center mb-8">
      <a
        href={`#${id}`}
        className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/heading:opacity-100 transition-opacity"
        aria-label="Link zu diesem Abschnitt"
      >
        <Link2 className={`w-5 h-5 ${dark ? "text-white/40 hover:text-white/80" : "text-pause-black/30 hover:text-pause-black/70"}`} />
      </a>
      <h2
        id={id}
        className={`font-headline text-2xl md:text-4xl lg:text-5xl text-center scroll-mt-24 ${dark ? "text-white" : "text-pause-black"}`}
      >
        {children}
      </h2>
    </div>
  );
}
