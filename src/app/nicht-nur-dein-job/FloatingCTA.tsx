"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sections = ['[data-section-id="hero"]', '[data-section-id="umfrage-cta"]']
      .map((sel) => document.querySelector(sel))
      .filter(Boolean) as Element[];
    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? intersecting.add(e.target) : intersecting.delete(e.target)));
        setVisible(intersecting.size === 0);
      },
      { threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Link
        href="/nicht-nur-dein-job/umfrage"
        className="inline-flex items-center justify-center bg-[#FF9416] px-5 py-3 font-section text-sm tracking-wider text-black shadow-lg transition-colors hover:bg-[#e88510]"
      >
        Erzähl deine Geschichte →
      </Link>
    </div>
  );
}
