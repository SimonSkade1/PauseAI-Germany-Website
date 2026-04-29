"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import LinkedHeading from "@/components/LinkedHeading";
import { useReducedMotion } from "@/components/charts/useReducedMotion";
import { STATIC_TESTIMONIALS, type Testimonial } from "@/data/testimonials";

const SHARE_TEXT = (t: Testimonial) =>
  `„${t.story.length > 180 ? t.story.slice(0, 180) + "…" : t.story}" — ${t.name}, ${t.profession}`;

const SHARE_URL = "https://pauseai.de/nicht-nur-dein-job#stimmen";

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = STATIC_TESTIMONIALS.filter((t) => t.approved);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
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
      <section data-section-id="stimmen" className="bg-white py-20 md:py-32 border-t border-pause-black/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center text-pause-black/60 font-body">
          Noch keine Stimmen verfügbar.
        </div>
      </section>
    );
  }

  const t = testimonials[activeIndex];
  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT(t))}&url=${encodeURIComponent(SHARE_URL)}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT(t) + "\n" + SHARE_URL)}`;

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
    <section id="stimmen" className="bg-white py-20 md:py-32 border-t border-pause-black/10">
      <div className="max-w-4xl mx-auto px-6 md:px-12" ref={sectionRef} tabIndex={-1}>
        <LinkedHeading id="stimmen">Stimmen aus dem Arbeitsalltag</LinkedHeading>
        <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
          Echte Geschichten von Menschen, deren Berufsleben sich gerade verändert. Anonymisiert auf
          Wunsch. Erzählt von ihnen selbst.
        </p>

        <div
          className="transition-opacity duration-200"
          style={{ opacity: visible ? 1 : 0 }}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex gap-6 md:gap-8">
            <div className="w-1 flex-shrink-0 bg-[#FF9416] rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="font-body-bold text-base md:text-lg text-pause-black mb-1">
                {t.name}
                {typeof t.age === "number" && <span className="font-body text-pause-black/60">, {t.age}</span>}
              </p>
              <p className="font-body text-pause-black/60 text-sm mb-5">
                {t.profession}
                {t.location ? ` · ${t.location}` : ""}
              </p>
              <blockquote className="font-body text-pause-black text-lg md:text-2xl leading-relaxed">
                {"„"}
                {t.story}
                {"“"}
              </blockquote>
              <span className="sr-only">{`Geschichte ${activeIndex + 1} von ${total}`}</span>
            </div>
          </div>
        </div>

        {total > 1 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-10 gap-6">
            <div className="flex gap-1 items-center justify-center" role="group" aria-label="Stimme auswählen">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  className="flex items-center justify-center w-12 h-12 cursor-pointer group"
                  aria-label={`Stimme ${index + 1}`}
                  aria-pressed={index === activeIndex}
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-8 h-4 bg-[#FF9416]"
                        : "w-4 h-4 bg-pause-black/20 group-hover:bg-pause-black/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between md:contents">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="font-section text-base tracking-wider text-pause-black/50 hover:text-pause-black transition-colors cursor-pointer px-4 py-3 md:order-first"
                aria-label="Vorherige Stimme"
              >
                ← Zurück
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="font-section text-base tracking-wider text-pause-black/50 hover:text-pause-black transition-colors cursor-pointer px-4 py-3"
                aria-label="Nächste Stimme"
              >
                Weiter →
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-pause-black/10">
          <span className="font-section text-xs uppercase tracking-wider text-pause-black/50 self-center mr-1">
            Teilen:
          </span>
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Auf X teilen"
            className="font-section text-sm tracking-wider px-3 py-2 border border-pause-black/15 hover:border-pause-black/40 transition-colors"
          >
            X
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Über WhatsApp teilen"
            className="font-section text-sm tracking-wider px-3 py-2 border border-pause-black/15 hover:border-pause-black/40 transition-colors"
          >
            WhatsApp
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Link kopieren"
            className="font-section text-sm tracking-wider px-3 py-2 border border-pause-black/15 hover:border-pause-black/40 transition-colors inline-flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Kopiert
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Link kopieren
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
