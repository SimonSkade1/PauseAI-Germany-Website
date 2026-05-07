"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "./sections";

export default function JumpBar() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const id = (visible[0].target as HTMLElement).dataset.sectionId;
          if (id) setActive(id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    SECTIONS.forEach((s) => {
      const el = document.querySelector(`[data-section-id="${s.id}"]`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Seitennavigation"
      className="sticky top-[64px] z-30 bg-[#1a1a1a]/95 backdrop-blur border-b border-white/10"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-12 overflow-x-auto">
        <ul className="flex gap-1 md:gap-2 py-3 whitespace-nowrap">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`inline-block font-section text-xs md:text-sm tracking-wider uppercase px-3 py-2 transition-colors rounded-sm ${
                  active === s.id
                    ? "text-[#FF9416] bg-white/[0.04]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
