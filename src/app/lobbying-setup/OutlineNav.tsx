"use client";

import { useEffect, useState } from "react";

type Item = { href: string; label: string };

export default function OutlineNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.href.slice(1) ?? "");

  useEffect(() => {
    const ids = items.map((i) => i.href.slice(1));

    function onScroll() {
      // The "current" section is the last one whose top has scrolled above this line.
      const line = 140;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) {
          current = id;
        } else {
          break;
        }
      }
      // At the very bottom, force the last section (handles short trailing sections).
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav className="sticky top-28 border-l border-pause-black/10 pl-5">
      <p className="mb-3 font-section text-xs tracking-wider text-pause-black/40">
        On this page
      </p>
      <ul className="space-y-2.5">
        {items.map((l) => {
          const isActive = l.href.slice(1) === active;
          return (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={isActive ? "true" : undefined}
                className={`font-body text-sm transition-colors hover:text-pause-orange ${
                  isActive
                    ? "text-pause-orange font-body-bold"
                    : "text-pause-black/70"
                }`}
              >
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
