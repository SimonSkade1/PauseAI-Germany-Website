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
          const id = (visible[0].target as HTMLElement).dataset.sectionId ?? (visible[0].target as HTMLElement).id;
          if (id) setActive(id === "counter" || id === "arbeitsmarkt" || id === "stimmen" || id === "chart" ? "hero" : id === "mehr" || id === "politische-forderung" || id === "umfrage-cta" || id === "presse" ? "mehr" : id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    const allIds = ["hero", "counter", "arbeitsmarkt", "stimmen", "chart", "mehr", "politische-forderung", "umfrage-cta", "presse"];
    allIds.forEach((id) => {
      const el = document.querySelector(`[data-section-id="${id}"], #${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Seitennavigation"
      className="sticky top-[64px] z-30 bg-pause-gray-dark/95 backdrop-blur border-b border-white/10"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-12">
        <ul className="flex justify-center gap-1 py-2">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`inline-block font-section font-black text-sm tracking-[0.15em] uppercase px-5 py-2 transition-colors ${
                  active === s.id
                    ? "text-[#FF9416]"
                    : "text-white/40 hover:text-white/80"
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
