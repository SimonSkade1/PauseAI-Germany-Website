// Static fallback for the jobloss.ai counter and chart.
// The /api/jobloss-count route uses this when the upstream is unreachable.

export const JOBLOSS_FALLBACK_COUNT = 128648;
export const JOBLOSS_FALLBACK_DATE = "2026-04-15";

// 90-day daily layoff series (deterministic synthetic data — replace with real
// jobloss.ai feed when the upstream API is wired). Values trend up with weekly
// noise to read like a plausible activity series.
function makeDaily(): Array<{ date: string; value: number }> {
  const start = new Date("2026-01-30T00:00:00.000Z").getTime();
  const out: Array<{ date: string; value: number }> = [];
  for (let i = 0; i < 90; i++) {
    const d = new Date(start + i * 86400000);
    const date = d.toISOString().slice(0, 10);
    const trend = 600 + i * 12;
    const wave = Math.round(Math.sin(i / 7) * 220);
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6 ? -180 : 0;
    out.push({ date, value: Math.max(0, trend + wave + weekend) });
  }
  return out;
}

export const JOBLOSS_FALLBACK_DAILY = makeDaily();

// Sectoral breakdown for the secondary chart.
export const JOBLOSS_FALLBACK_SECTORS: Array<{ sector: string; value: number }> = [
  { sector: "Software & Tech", value: 38420 },
  { sector: "Medien & Inhalte", value: 19840 },
  { sector: "Kundendienst", value: 17120 },
  { sector: "Finanzdienstleistungen", value: 14260 },
  { sector: "Verwaltung", value: 12880 },
  { sector: "Bildung", value: 9540 },
  { sector: "Sonstige", value: 16588 },
];
