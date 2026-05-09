"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LinkedHeading from "@/components/LinkedHeading";
import { JOBLOSS_FALLBACK_DAILY, JOBLOSS_FALLBACK_SECTORS } from "@/data/jobloss";
import type { LinePoint } from "@/components/charts/LineChart";

const LineChart = dynamic(() => import("@/components/charts/LineChart"), {
  ssr: false,
  loading: () => (
    <div className="h-72 bg-pause-black/[0.03] border border-pause-black/10 animate-pulse" aria-hidden />
  ),
});

const NUM = new Intl.NumberFormat("de-DE");

function toCumulative(points: LinePoint[]): LinePoint[] {
  let running = 0;
  return points.map((p) => { running += p.value; return { date: p.date, value: running }; });
}

export default function JobLossChartSection() {
  const [data, setData] = useState<LinePoint[]>(() => toCumulative(JOBLOSS_FALLBACK_DAILY));

  useEffect(() => {
    fetch("/api/jobloss-count")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.daily) && d.daily.length > 0) setData(toCumulative(d.daily));
      })
      .catch(() => {
        // already set to fallback
      });
  }, []);

  const totalSectors = JOBLOSS_FALLBACK_SECTORS.reduce((s, x) => s + x.value, 0);

  return (
    <section data-section-id="chart" className="bg-white py-20 md:py-32 border-t border-pause-black/10">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <LinkedHeading id="chart">Entwicklung der KI-bedingten Entlassungen</LinkedHeading>
        <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
          Die Plattform jobloss.ai erfasst Entlassungsmeldungen, in denen Unternehmen KI oder
          Automatisierung als Begründung nennen. Quellen: Pressemitteilungen, Konzernmitteilungen
          und seriöse Medienberichte.
        </p>

        <LineChart data={data} yLabel="Stellenstreichungen kumulativ" />

        <div className="mt-16 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-6">
              Nach Branche
            </h3>
            <ul className="space-y-3">
              {JOBLOSS_FALLBACK_SECTORS.map((s) => {
                const pct = (s.value / totalSectors) * 100;
                return (
                  <li key={s.sector}>
                    <div className="flex justify-between text-sm font-body text-pause-black mb-1">
                      <span>{s.sector}</span>
                      <span className="tabular-nums text-pause-black/60">
                        {NUM.format(s.value)}
                      </span>
                    </div>
                    <div className="h-2 bg-pause-black/[0.06] overflow-hidden rounded-sm">
                      <div
                        className="h-full bg-[#FF9416]"
                        style={{ width: `${pct}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(pct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${s.sector}: ${pct.toFixed(0)} Prozent`}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-6">
              Was die Daten nicht zeigen
            </h3>
            <p className="font-body text-pause-black/75 leading-relaxed mb-4">
              Die offiziellen Zahlen sind eine Untergrenze. Sie erfassen Entlassungen, in denen
              Unternehmen KI explizit als Grund nennen – nicht jene, in denen die Begründung
              umformuliert wird.
            </p>
            <p className="font-body text-pause-black/75 leading-relaxed">
              Sie erfassen auch nicht, wer gar nicht erst eingestellt wird, weil eine Software
              das im nächsten Jahr tun können wird. Diese {"„"}stillen{"“"} Verluste werden in
              keinem Dashboard auftauchen.
            </p>
          </div>
        </div>

        <p className="font-body text-sm text-pause-black/60 mt-10">
          <a
            href="https://jobloss.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="orange-link font-body-bold"
          >
            Mehr Daten auf jobloss.ai →
          </a>
        </p>
      </div>
    </section>
  );
}
