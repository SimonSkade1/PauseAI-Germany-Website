"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Counts = Record<string, number>;

// Calls Convex's public HTTP query endpoint. Returns null if Convex is not
// configured or the request fails.
async function queryConvex(path: string, args: Record<string, unknown> = {}): Promise<Counts | null> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  try {
    const res = await fetch(`${url}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, args, format: "json" }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.value ?? data) as Counts;
  } catch {
    return null;
  }
}

// Sort entries by count descending, then by key ascending as tiebreaker.
function sortedEntries(counts: Counts): [string, number][] {
  return Object.entries(counts).sort(([aKey, aVal], [bKey, bVal]) =>
    bVal !== aVal ? bVal - aVal : aKey.localeCompare(bKey),
  );
}

// Sort date entries chronologically (ascending).
function sortedDateEntries(counts: Counts): [string, number][] {
  return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
}

function StatsTable({
  title,
  keyLabel,
  valueLabel,
  data,
  loading,
  sortByDate,
}: {
  title: string;
  keyLabel: string;
  valueLabel: string;
  data: Counts | null;
  loading: boolean;
  sortByDate?: boolean;
}) {
  const convexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexConfigured) {
    return (
      <div className="border border-zinc-200 bg-white p-4">
        <h2 className="font-section text-lg text-pause-black mb-2">{title}</h2>
        <p className="text-sm text-pause-black/60">
          Convex ist nicht konfiguriert (NEXT_PUBLIC_CONVEX_URL fehlt). Tracking-Daten werden
          erst verfügbar, wenn Convex eingerichtet ist.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border border-zinc-200 bg-white p-4">
        <h2 className="font-section text-lg text-pause-black mb-2">{title}</h2>
        <p className="text-sm text-pause-black/60">Lade Daten...</p>
      </div>
    );
  }

  const entries = data
    ? sortByDate
      ? sortedDateEntries(data)
      : sortedEntries(data)
    : [];
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-section text-lg text-pause-black">{title}</h2>
        {total > 0 && (
          <span className="text-xs font-section text-pause-black/50">
            Gesamt: {total.toLocaleString("de-DE")}
          </span>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-pause-black/60">Noch keine Daten vorhanden.</p>
      ) : (
        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left">
                <th className="py-2 pr-4 font-section text-pause-black/70">{keyLabel}</th>
                <th className="py-2 text-right font-section text-pause-black/70">{valueLabel}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([key, count]) => (
                <tr key={key} className="border-b border-zinc-100 last:border-b-0">
                  <td className="py-1.5 pr-4 text-pause-black">{key}</td>
                  <td className="py-1.5 text-right tabular-nums text-pause-black">
                    {count.toLocaleString("de-DE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminStatsPage() {
  const [pageViewsByPath, setPageViewsByPath] = useState<Counts | null>(null);
  const [pageViewsBySource, setPageViewsBySource] = useState<Counts | null>(null);
  const [pageViewsByDay, setPageViewsByDay] = useState<Counts | null>(null);
  const [emailClicksByTemplate, setEmailClicksByTemplate] = useState<Counts | null>(null);
  const [emailClicksByChamber, setEmailClicksByChamber] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [byPath, bySource, byDay, byTemplate, byChamber] = await Promise.all([
      queryConvex("pageTracking:countByPath"),
      queryConvex("pageTracking:countBySource"),
      queryConvex("pageTracking:countByDay", { days: 30 }),
      queryConvex("emailTracking:countByTemplate"),
      queryConvex("emailTracking:countByChamber"),
    ]);
    setPageViewsByPath(byPath);
    setPageViewsBySource(bySource);
    setPageViewsByDay(byDay);
    setEmailClicksByTemplate(byTemplate);
    setEmailClicksByChamber(byChamber);
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const SOURCE_LABELS: Record<string, string> = {
    direct: "Direkt (URL, Lesezeichen, App)",
    internal: "Intern (Seitennavigation)",
    search: "Suchmaschine",
    social: "Soziale Medien",
    external: "Externe Webseite",
  };

  return (
    <>
      <Header />
      <main className="pt-18">
        <section className="bg-pause-gray-light py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-headline text-3xl md:text-4xl text-pause-black mb-1">
                  Tracking Dashboard
                </h1>
                {lastRefresh && (
                  <p className="text-xs text-pause-black/50 font-section">
                    Zuletzt aktualisiert: {lastRefresh.toLocaleTimeString("de-DE")}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="border-2 border-zinc-800 bg-white px-4 py-2 text-sm font-section text-zinc-900 cursor-pointer transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Lade..." : "Aktualisieren"}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <StatsTable
                title="Seitenaufrufe nach Pfad"
                keyLabel="Seite"
                valueLabel="Aufrufe"
                data={pageViewsByPath}
                loading={loading}
              />
              <StatsTable
                title="Seitenaufrufe nach Quelle"
                keyLabel="Quelle"
                valueLabel="Aufrufe"
                data={
                  pageViewsBySource
                    ? Object.fromEntries(
                        Object.entries(pageViewsBySource).map(([k, v]) => [
                          SOURCE_LABELS[k] ?? k,
                          v,
                        ]),
                      )
                    : null
                }
                loading={loading}
              />
              <StatsTable
                title="E-Mail-Klicks nach Vorlage"
                keyLabel="Vorlage"
                valueLabel="Klicks"
                data={emailClicksByTemplate}
                loading={loading}
              />
              <StatsTable
                title="E-Mail-Klicks nach Kammer"
                keyLabel="Kammer"
                valueLabel="Klicks"
                data={emailClicksByChamber}
                loading={loading}
              />
              <div className="md:col-span-2">
                <StatsTable
                  title="Seitenaufrufe pro Tag (letzte 30 Tage)"
                  keyLabel="Datum"
                  valueLabel="Aufrufe"
                  data={pageViewsByDay}
                  loading={loading}
                  sortByDate
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
