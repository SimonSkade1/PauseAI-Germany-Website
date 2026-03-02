"use client";

import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import { sections as defaultSections, type Section } from "./sections";

interface Props {
  sections: Section[];
  desktopOnly?: boolean;
}

export default function TableOfContents({ sections, desktopOnly }: Props) {
  const tocSections = sections.length > 0 ? sections : defaultSections;
  const [activeSection, setActiveSection] = useState(tocSections[0]?.id || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const firstVisible = visibleEntries[0];
          const id = firstVisible.target.id;
          if (id) {
            setActiveSection(id);
          }
        }
      },
      {
        rootMargin: "-10% 0px -70% 0px",
        threshold: 0,
      }
    );

    tocSections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocSections]);

  // Desktop only - just render the sidebar TOC
  if (desktopOnly) {
    return (
      <nav className="appell-toc">
        <h2 className="appell-toc-title">Inhalt</h2>
        <ul className="appell-toc-list">
          {tocSections.map(({ id, label }) => (
            <li key={id}>
              <a
                  href={`#${id}`}
                  className={`appell-toc-link ${
                    activeSection === id ? "appell-toc-link-active" : ""
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

  // Mobile version - floating button with menu
  return (
    <>
      {/* Backdrop overlay */}
      {isMenuOpen && (
        <div
          className="appell-toc-backdrop"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Bottom menu panel */}
      <div className={`appell-toc-menu ${isMenuOpen ? "appell-toc-menu-open" : ""}`}>
        <div className="appell-toc-menu-header">
          <span className="appell-toc-menu-title">Auf dieser Seite</span>
          <button
            className="appell-toc-menu-close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Schließen"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="appell-toc-menu-nav">
          {tocSections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`appell-toc-menu-link ${
                activeSection === id ? "appell-toc-menu-link-active" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* Floating FAB button - toggles menu */}
      <button
        className="appell-toc-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Auf dieser Seite"
        aria-expanded={isMenuOpen}
      >
        <FileText size={24} />
      </button>
    </>
  );
}
