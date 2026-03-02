"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "appell", label: "Appell" },
  { id: "zitate", label: "Zitate" },
  { id: "unterzeichnende", label: "Unterzeichnende" },
  { id: "hintergrund", label: "Kontext" },
  { id: "faq", label: "FAQ" },
  { id: "experten", label: "Expert:innen" },
  { id: "petition", label: "Petition" },
  { id: "medien", label: "Presse" },
];

export default function JumpBar() {
  const [activeSection, setActiveSection] = useState("appell");

  useEffect(() => {
    // Scroll-spy using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that's most visible and intersects
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Get the first visible section (topmost on page)
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const firstVisible = visibleEntries[0];
          const id = firstVisible.target.id;
          if (id) {
            setActiveSection(id);
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is near top of viewport
        threshold: 0,
      }
    );

    // Observe all sections
    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="appell-jump-bar"
      aria-label="Sprungnavigation"
    >
      <ul className="appell-jump-list">
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`appell-jump-link ${
                activeSection === id ? "appell-jump-link-active" : ""
              }`}
              aria-current={activeSection === id ? "true" : undefined}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
