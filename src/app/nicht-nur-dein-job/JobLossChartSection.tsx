"use client";

import { useEffect, useState } from "react";
import { JOBLOSS_FALLBACK_SECTORS } from "@/data/jobloss";
import SectionAnchor from "./SectionAnchor";

const NUM = new Intl.NumberFormat("de-DE");

export default function JobLossChartSection() {
  const [sectors, setSectors] = useState(JOBLOSS_FALLBACK_SECTORS);

  useEffect(() => {
    fetch("/api/jobloss-count")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.sectors) && d.sectors.length > 0) setSectors(d.sectors);
      })
      .catch(() => {});
  }, []);

  const max = Math.max(...sectors.map((s) => s.value));

  return (
    <section id="chart" data-section-id="chart" className="bg-[#FF9416] py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left */}
        <div>
          <div className="group/section flex items-start mb-6 md:mb-8">
          <h2 className="font-section font-black normal-case text-black text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.02] scroll-mt-24">
            Wo KI <span className="underline underline-offset-4 decoration-2">zuerst</span> zuschlägt.
          </h2>
          <SectionAnchor id="chart" dark={false} />
          </div>
          <p className="font-bold text-black/80 text-sm md:text-base leading-relaxed mb-3">
            Auszug aus{" "}
            <a href="https://jobloss.ai" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black">
              jobloss.ai
            </a>{" "}
            · KI-bedingte Entlassungen weltweit nach Branche, seit Januar 2025.
          </p>
          <p className="font-bold text-black/80 text-sm md:text-base leading-relaxed">
            Was die Daten <em>nicht</em> zeigen: Stille Verluste — wer gar nicht erst eingestellt wurde.
          </p>
        </div>

        {/* Right: bars */}
        <div className="space-y-4 md:space-y-5">
          {sectors.map((s) => {
            const pct = (s.value / max) * 100;
            return (
              <div key={s.sector}>
                <div className="flex justify-between items-baseline gap-2 mb-1.5">
                  <span className="font-bold text-black text-xs md:text-sm leading-snug">{s.sector}</span>
                  <span className="font-section font-black text-black tabular-nums text-base md:text-lg flex-shrink-0">
                    {NUM.format(s.value)}
                  </span>
                </div>
                <div className="h-2 bg-black/15 overflow-hidden">
                  <div
                    className="h-full bg-black"
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(pct)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${s.sector}: ${NUM.format(s.value)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
