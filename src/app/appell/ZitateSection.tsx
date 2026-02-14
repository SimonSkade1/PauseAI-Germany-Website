"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

const QUOTES = [
  {
    text: "Bereits jetzt halte ich den Einfluss von KI für stark negativ: Auf die Menschheit, auf die Demokratie, auf den Planeten.",
    name: "Peter Scholze",
    chair: "Fields-Medaillen-Träger (2018), Direktor am Max-Planck-Institut für Mathematik in Bonn",
  },
  {
    text: "Mit KI erschaffen wir eine neue intelligente Spezies, und wir tun dies häufig nicht mit der nötigen Sorgfalt, sondern in einem Wettlauf darum, wer es am schnellsten schafft. KI bietet viele Möglichkeiten, aber ohne internationale Sicherheitsstandards riskieren wir, von intellektuell überlegenen KIs verdrängt zu werden.",
    name: "Andrzej J. Buras",
    chair: "Max-Planck-Medaillen-Träger (2020), Professor emeritus für Theoretische Physik an der TU München",
  },
  {
    text: "Als Dekan für Mathematik und Informatik habe ich die Begeisterung über KI-Fortschritte jeden Tag erlebt. Nicht zuletzt durch die intensive Auseinandersetzung im Rahmen unserer Vortragsreihe 'KI und Ethik', habe ich aber aber auch eine Vielzahl offener Sicherheitsbedenken und ethischer Fragestellungen erkannt, die mit jedem Fähigkeitssprung drängender werden. Ein internationaler Ordnungsrahmen ist daher längst überfällig.",
    name: "Otmar Venjakob",
    chair: "Professor für Mathematik an der Universität Heidelberg"
  },
];

const AUTO_SWITCH_MS = 10000;

export default function ZitateSection() {
  const [activeQuote, setActiveQuote] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveQuote((prev) => (prev + 1) % QUOTES.length);
    }, AUTO_SWITCH_MS);

    return () => window.clearTimeout(timer);
  }, [activeQuote]);

  const quote = QUOTES[activeQuote];

  const showPrev = () => {
    setActiveQuote((prev) => (prev - 1 + QUOTES.length) % QUOTES.length);
  };

  const showNext = () => {
    setActiveQuote((prev) => (prev + 1) % QUOTES.length);
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
      <h2 className="appell-section-heading">Zitate</h2>

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
            <span className="appell-quote-chair">{quote.chair}</span>
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

          <div className="appell-quote-dots" role="tablist" aria-label="Zitat auswählen">
            {QUOTES.map((item, index) => (
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
        {QUOTES.map((item) => (
          <blockquote className="appell-quote-editorial appell-quote-editorial-print" key={`print-${item.name}`}>
            <span className="appell-quote-accent" aria-hidden="true"></span>
            <p className="appell-quote-text">
              &ldquo;{item.text}&rdquo;
            </p>
            <footer className="appell-quote-attribution">
              <cite className="appell-quote-name">{item.name}</cite>
              <span className="appell-quote-chair">{item.chair}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
