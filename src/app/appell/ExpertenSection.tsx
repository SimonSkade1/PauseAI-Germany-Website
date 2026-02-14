"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

const EXPERT_QUOTES = [
  {
    text: "Die Minderung des Risikos eines Aussterbens durch KI sollte eine globale Priorität sein, gleichrangig mit anderen Risiken gesamtgesellschaftlichen Ausmaßes wie Pandemien und Atomkrieg.",
    name: "Statement on AI Risk",
    role: "unterzeichnet von den 2 meistzitierten KI-Wissenschaftlern und den CEOs führender KI-Unternehmen",
  },
  {
    text: "Ich habe vier Jahre im Sicherheitsteam von OpenAI gearbeitet und kann Ihnen mit Gewissheit sagen: KI-Unternehmen nehmen ihre Sicherheit nicht ernst genug, und sie sind nicht auf Kurs, kritische Sicherheitsprobleme zu lösen.",
    name: "Steven Adler",
    role: "ehemaliger Leiter der Dangerous Capability Evaluations bei OpenAI",
  },
  {
    text: "Wir betonen: Einige KI-Systeme zeigen bereits heute die Fähigkeit und Neigung, die Sicherheits- und Kontrollbemühungen ihrer Entwickler zu untergraben.",
    name: "Konsens führender KI-Sicherheitsforscher",
    role: "darunter Stuart Russell und Andrew Yao",
    org: "International Dialogues on AI Safety, Shanghai 2025",
  },
];

const AUTO_SWITCH_MS = 10000;

export default function ExpertenSection() {
  const [activeQuote, setActiveQuote] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveQuote((prev) => (prev + 1) % EXPERT_QUOTES.length);
    }, AUTO_SWITCH_MS);

    return () => window.clearTimeout(timer);
  }, [activeQuote]);

  const quote = EXPERT_QUOTES[activeQuote];

  const showPrev = () => {
    setActiveQuote((prev) => (prev - 1 + EXPERT_QUOTES.length) % EXPERT_QUOTES.length);
  };

  const showNext = () => {
    setActiveQuote((prev) => (prev + 1) % EXPERT_QUOTES.length);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0) {
      showNext();
      return;
    }

    showPrev();
  };

  return (
    <div className="appell-zitate-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">Internationale Experten</h2>

      <div className="appell-quotes-list" aria-live="polite">
        <blockquote
          className="appell-quote-editorial"
          key={quote.name}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <span className="appell-quote-accent" aria-hidden="true"></span>
          <p className="appell-quote-text">
            &ldquo;{quote.text}&rdquo;
          </p>
          <footer className="appell-quote-attribution">
            <cite className="appell-quote-name">{quote.name}</cite>
            <span className="appell-quote-chair">
              {quote.role}
              {quote.org ? ` · ${quote.org}` : ""}
            </span>
          </footer>
          <span
            className="appell-quote-progress-track"
            aria-hidden="true"
            style={{ "--appell-quote-duration": `${AUTO_SWITCH_MS}ms` } as CSSProperties}
          >
            <span key={activeQuote} className="appell-quote-progress-fill"></span>
          </span>
        </blockquote>

        <div className="appell-quote-controls">
          <button type="button" className="appell-quote-nav-btn" onClick={showPrev} aria-label="Vorheriges Zitat">
            ‹
          </button>

          <div className="appell-quote-dots" role="tablist" aria-label="Expertenzitat auswählen">
            {EXPERT_QUOTES.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={`appell-quote-dot ${index === activeQuote ? "appell-quote-dot-active" : ""}`}
                onClick={() => setActiveQuote(index)}
                aria-label={`Zitat von ${item.name} anzeigen`}
                aria-selected={index === activeQuote}
                role="tab"
              />
            ))}
          </div>

          <button type="button" className="appell-quote-nav-btn" onClick={showNext} aria-label="Nächstes Zitat">
            ›
          </button>
        </div>
      </div>

      <div className="appell-quotes-print-list">
        {EXPERT_QUOTES.map((item) => (
          <blockquote className="appell-quote-editorial appell-quote-editorial-print" key={`print-${item.name}`}>
            <span className="appell-quote-accent" aria-hidden="true"></span>
            <p className="appell-quote-text">
              &ldquo;{item.text}&rdquo;
            </p>
            <footer className="appell-quote-attribution">
              <cite className="appell-quote-name">{item.name}</cite>
              <span className="appell-quote-chair">
                {item.role}
                {item.org ? ` · ${item.org}` : ""}
              </span>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
