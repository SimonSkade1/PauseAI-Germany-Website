"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import LinkedHeading from "@/components/LinkedHeading";
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
    <section data-section-id="stimmen" className="bg-white py-20 md:py-32 border-t border-pause-black/10">
      <div className="max-w-4xl mx-auto px-6 md:px-12" ref={sectionRef} tabIndex={-1}>
        <LinkedHeading id="stimmen">Stimmen aus dem Arbeitsalltag</LinkedHeading>
        <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
          Echte Geschichten von Menschen, deren Leben sich gerade verändert. Anonymisiert auf
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
              </p>
              {t.location && (
                <p className="font-body text-pause-black/60 text-sm mb-5">{t.location}</p>
              )}
              <blockquote className="font-body text-pause-black text-lg md:text-2xl leading-relaxed space-y-5">
                {(() => {
                  const paragraphs = t.story.split(/\n\n+/);
                  return paragraphs.map((para, i) => {
                    const isFirst = i === 0;
                    const isLast = i === paragraphs.length - 1;
                    const emphasised = isLast && paragraphs.length > 1;
                    return (
                      <p key={i} className={emphasised ? "font-body-bold" : undefined}>
                        {isFirst && "„"}
                        {para}
                        {isLast && "“"}
                      </p>
                    );
                  });
                })()}
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
            Geschichte teilen:
          </span>
          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-2 border border-pause-black/15 px-3 py-2 font-section text-sm tracking-wider text-pause-black hover:border-pause-black/40 transition-colors"
              aria-label="Teilen"
            >
              <Share2 size={15} />
              Teilen
            </button>
          )}
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Auf X teilen"
            className="inline-flex items-center gap-2 border border-pause-black/15 px-3 py-2 font-section text-sm tracking-wider text-pause-black hover:border-pause-black/40 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.75l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Auf X teilen
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Über WhatsApp teilen"
            className="inline-flex items-center gap-2 border border-pause-black/15 px-3 py-2 font-section text-sm tracking-wider text-pause-black hover:border-pause-black/40 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Per WhatsApp
          </a>
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Über Telegram teilen"
            className="inline-flex items-center gap-2 border border-pause-black/15 px-3 py-2 font-section text-sm tracking-wider text-pause-black hover:border-pause-black/40 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Per Telegram
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Kopieren"
            className="inline-flex items-center gap-2 border border-pause-black/15 px-3 py-2 font-section text-sm tracking-wider text-pause-black hover:border-pause-black/40 transition-colors"
          >
            {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
            {copied ? "Kopiert!" : "Kopieren"}
          </button>
        </div>
      </div>
    </section>
  );
}
