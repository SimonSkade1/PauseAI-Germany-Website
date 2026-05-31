"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import SectionAnchor from "./SectionAnchor";
import { useReducedMotion } from "@/components/charts/useReducedMotion";
import { STATIC_TESTIMONIALS, type Testimonial } from "@/data/testimonials";

const SHARE_TEXT = (t: Testimonial) =>
  `„${t.story.length > 180 ? t.story.slice(0, 180) + "…" : t.story}" — ${t.name}${t.location ? `, ${t.location}` : ""}`;

const SHARE_URL = "https://pause-ai.de/nicht-nur-dein-job#stimmen";

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = STATIC_TESTIMONIALS.filter((t) => t.approved);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);
  const total = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % total) + total) % total;
      if (reduce) {
        setActiveIndex(next);
        return;
      }
      setVisible(false);
      setTimeout(() => {
        setActiveIndex(next);
        setVisible(true);
      }, 180);
    },
    [total, reduce],
  );

  // Keyboard navigation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo]);

  // Touch swipe (basic)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let startX = 0;
    let active = false;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      active = true;
    };
    const onEnd = (e: TouchEvent) => {
      if (!active) return;
      const dx = (e.changedTouches[0]?.clientX ?? startX) - startX;
      if (Math.abs(dx) > 60) {
        if (dx < 0) goTo(activeIndex + 1);
        else goTo(activeIndex - 1);
      }
      active = false;
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [activeIndex, goTo]);

  if (total === 0) {
    return (
      <section data-section-id="stimmen" className="bg-pause-gray-dark py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center text-white/40 font-body">
          Noch keine Stimmen verfügbar.
        </div>
      </section>
    );
  }

  const t = testimonials[activeIndex];
  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT(t))}&url=${encodeURIComponent(SHARE_URL)}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT(t) + "\n" + SHARE_URL)}`;
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT(t))}`;

  const handleNativeShare = async () => {
    await navigator.share({ title: "Nicht nur dein Job | PauseAI Deutschland", text: SHARE_TEXT(t), url: SHARE_URL });
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(`${SHARE_TEXT(t)}\n${SHARE_URL}`);
      } else {
        const ta = document.createElement("textarea");
        ta.value = `${SHARE_TEXT(t)}\n${SHARE_URL}`;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section data-section-id="stimmen" className="bg-pause-gray-dark py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12" ref={sectionRef} tabIndex={-1}>
        {/* Heading */}
        <div className="group/section flex items-start mb-14">
        <h2 id="stimmen" className="font-section font-black normal-case text-white text-4xl md:text-5xl leading-[1.08] scroll-mt-24">
          Echte Stimmen.{" "}
          <span className="text-[#FF9416]">Echte Menschen.</span>
        </h2>
        <SectionAnchor id="stimmen" />
        </div>

        {/* Quote */}
        <div
          className="transition-opacity duration-200"
          style={{ opacity: visible ? 1 : 0 }}
          aria-live="polite"
          aria-atomic="true"
        >
          <blockquote className="text-white text-lg md:text-xl leading-relaxed space-y-5 mb-10">
            {(() => {
              const paragraphs = t.story.split(/\n\n+/);
              return paragraphs.map((para, i) => {
                const isFirst = i === 0;
                const isLast = i === paragraphs.length - 1;
                const emphasised = isLast && paragraphs.length > 1;
                return (
                  <p key={i} className={emphasised ? "font-bold" : "text-white/80"}>
                    {isFirst && <span className="text-[#FF9416] text-4xl leading-none mr-1 font-serif">„</span>}
                    {para}
                    {isLast && ""}
                  </p>
                );
              });
            })()}
          </blockquote>

          {/* Attribution */}
          <div className="border-l-2 border-[#FF9416] pl-4">
            <p className="font-section font-black text-white text-lg">{t.name}</p>
            {t.location && (
              <p className="text-white/50 text-sm mt-0.5">{t.location}</p>
            )}
          </div>
          <span className="sr-only">{`Stimme ${activeIndex + 1} von ${total}`}</span>
        </div>

        {/* Nav + share row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-10 pt-6 border-t border-white/10 gap-6">
          {/* Share links */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-section text-xs uppercase tracking-wider text-white/40 mr-1">
              Teilen:
            </span>
            {canNativeShare && (
              <button type="button" onClick={handleNativeShare} className="text-white/60 hover:text-white text-sm transition-colors" aria-label="Teilen">
                <Share2 size={15} />
              </button>
            )}
            <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-sm font-section tracking-wide transition-colors">X</a>
            <span className="text-white/60"> | </span>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-sm font-section tracking-wide transition-colors">WhatsApp</a>
            <span className="text-white/60"> | </span>
            <a href={tgUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-sm font-section tracking-wide transition-colors">Telegram</a>
            <span className="text-white/60"> | </span>
            <button type="button" onClick={handleCopy} className="text-white/60 hover:text-white text-sm font-section tracking-wide transition-colors">
              {copied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>

          {/* Pagination */}
          {total > 1 && (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="w-24 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors cursor-pointer text-lg"
                aria-label="Vorherige Stimme"
              >
                ←
              </button>
              <div className="flex gap-2 items-center" role="group" aria-label="Stimme auswählen">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goTo(index)}
                    className="flex items-center justify-center cursor-pointer py-2"
                    aria-label={`Stimme ${index + 1}`}
                    aria-pressed={index === activeIndex}
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? "w-6 h-3 bg-[#FF9416]"
                          : "w-3 h-3 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="w-24 h-10 flex items-center justify-center bg-[#FF9416] text-black hover:bg-[#e88510] transition-colors cursor-pointer text-lg"
                aria-label="Nächste Stimme"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
