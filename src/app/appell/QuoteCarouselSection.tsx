"use client";

import { useRef, useState } from "react";

export type QuoteCarouselItem = {
  text: string;
  name: string;
  subtitle: string;
};

type QuoteCarouselSectionProps = {
  heading: string;
  quotes: QuoteCarouselItem[];
  dotsAriaLabel: string;
};

export default function QuoteCarouselSection({
  heading,
  quotes,
  dotsAriaLabel,
}: QuoteCarouselSectionProps) {
  const [activeQuote, setActiveQuote] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const quote = quotes[activeQuote];

  const showPrev = () => {
    setActiveQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const showNext = () => {
    setActiveQuote((prev) => (prev + 1) % quotes.length);
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
      <h2 className="appell-section-heading">{heading}</h2>

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
            <span className="appell-quote-chair">{quote.subtitle}</span>
          </footer>
        </blockquote>

        <div className="appell-quote-controls">
          <button type="button" className="appell-quote-nav-btn" onClick={showPrev} aria-label="Vorheriges Zitat">
            ‹
          </button>

          <div className="appell-quote-dots" role="tablist" aria-label={dotsAriaLabel}>
            {quotes.map((item, index) => (
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
        {quotes.map((item) => (
          <blockquote className="appell-quote-editorial appell-quote-editorial-print" key={`print-${item.name}`}>
            <span className="appell-quote-accent" aria-hidden="true"></span>
            <p className="appell-quote-text">
              &ldquo;{item.text}&rdquo;
            </p>
            <footer className="appell-quote-attribution">
              <cite className="appell-quote-name">{item.name}</cite>
              <span className="appell-quote-chair">{item.subtitle}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
