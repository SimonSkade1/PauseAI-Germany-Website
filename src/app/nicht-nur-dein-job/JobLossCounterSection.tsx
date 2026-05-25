"use client";

import { useEffect, useRef, useState } from "react";
import Sparkline from "@/components/charts/Sparkline";
import { useReducedMotion } from "@/components/charts/useReducedMotion";
import { JOBLOSS_FALLBACK_COUNT, JOBLOSS_FALLBACK_DATE, JOBLOSS_FALLBACK_DAILY } from "@/data/jobloss";

const NUM = new Intl.NumberFormat("de-DE");
const DATE = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" });

interface Payload {
  count: number;
  lastUpdated: string;
  source: string;
  daily?: Array<{ date: string; value: number }>;
}

export default function JobLossCounterSection() {
  const [count, setCount] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [daily, setDaily] = useState<number[]>([]);
  const [displayed, setDisplayed] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const displayedRef = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/jobloss-count")
      .then((r) => r.json() as Promise<Payload>)
      .then((d) => {
        if (cancelled) return;
        setCount(d.count);
        setLastUpdated(d.lastUpdated);
        if (d.daily?.length) setDaily(d.daily.map((p) => p.value));
        else setDaily(JOBLOSS_FALLBACK_DAILY.map((p) => p.value));
      })
      .catch(() => {
        if (cancelled) return;
        setCount((c) => c ?? JOBLOSS_FALLBACK_COUNT);
        setLastUpdated((d) => d ?? JOBLOSS_FALLBACK_DATE);
        setDaily((arr) => (arr.length ? arr : JOBLOSS_FALLBACK_DAILY.map((p) => p.value)));
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ref.current || revealed) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setRevealed(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [revealed]);

  useEffect(() => {
    if (count === null || !revealed) return;
    if (reduce) {
      displayedRef.current = count;
      setDisplayed(count);
      return;
    }
    const from = displayedRef.current;
    const to = count;
    if (from === to) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (to - from) * eased);
      displayedRef.current = v;
      setDisplayed(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, revealed, reduce]);

  return (
    <section
      id="counter"
      data-section-id="counter"
      ref={ref}
      className="bg-pause-gray-dark py-20 md:py-28"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <p className="inline-flex items-center gap-2 bg-white/10 text-white/60 text-xs tracking-widest uppercase px-3 py-1.5 mb-8">
          <a
            href="https://jobloss.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80 transition-colors"
          >
            jobloss.ai
          </a>
          {lastUpdated && (
            <>
              <span>·</span>
              <span>Stand: {DATE.format(new Date(lastUpdated))}</span>
            </>
          )}
        </p>
        <p
          className="font-display text-[clamp(4rem,14vw,10rem)] leading-none text-[#FF9416] tabular-nums"
          aria-live="polite"
          data-testid="counter-value"
        >
          {count === null ? "…" : NUM.format(displayed)}
        </p>
        <p className="font-display text-xl md:text-2xl lg:text-3xl font-black uppercase text-white tracking-wide mt-4">
          KI-bedingte Stellenstreichungen
        </p>
        <p className="font-body text-sm text-white/50 mt-2">
          Seit Januar 2025 weltweit.
        </p>
        {daily.length > 0 && (() => {
          let running = 0;
          const cumulative = daily.map((v) => (running += v));
          return (
            <div className="mt-10 flex justify-center">
              <Sparkline data={cumulative} width={360} height={72} yMin={0} ariaLabel="Kumulative KI-bedingte Stellenstreichungen" />
            </div>
          );
        })()}
      </div>
    </section>
  );
}
