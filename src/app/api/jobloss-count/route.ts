import { NextResponse } from "next/server";
import { JOBLOSS_FALLBACK_COUNT, JOBLOSS_FALLBACK_DAILY, JOBLOSS_FALLBACK_DATE } from "@/data/jobloss";

// Re-fetch upstream at most once per minute on the edge.
export const revalidate = 60;

const FALLBACK = parseInt(process.env.NEXT_PUBLIC_JOBLOSS_FALLBACK ?? String(JOBLOSS_FALLBACK_COUNT), 10);
const UPSTREAM = process.env.JOBLOSS_API_URL ?? "https://jobloss.ai/api/reports";

interface Daily {
  date: string;
  value: number;
}

interface Payload {
  count: number;
  lastUpdated: string;
  source: "upstream" | "fallback";
  daily: Daily[];
}

interface UpstreamReport {
  date?: string;
  jobsLost?: number;
}

interface UpstreamPayload {
  ok?: boolean;
  reports?: UpstreamReport[];
}

export async function GET(): Promise<NextResponse<Payload>> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 5000);
  try {
    const r = await fetch(UPSTREAM, {
      signal: ac.signal,
      next: { revalidate: 60 },
    });
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const data = (await r.json()) as UpstreamPayload;
    const reports = Array.isArray(data?.reports) ? data.reports : [];
    if (reports.length === 0) throw new Error("no reports");

    let total = 0;
    let latestDate = "";
    const byDate = new Map<string, number>();
    for (const rep of reports) {
      const v = typeof rep.jobsLost === "number" ? rep.jobsLost : 0;
      total += v;
      if (rep.date) {
        byDate.set(rep.date, (byDate.get(rep.date) ?? 0) + v);
        if (rep.date > latestDate) latestDate = rep.date;
      }
    }
    const daily: Daily[] = [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, value }));

    return NextResponse.json(
      {
        count: total,
        lastUpdated: latestDate
          ? new Date(`${latestDate}T00:00:00.000Z`).toISOString()
          : new Date().toISOString(),
        source: "upstream",
        daily,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch {
    return NextResponse.json({
      count: FALLBACK,
      lastUpdated: new Date(JOBLOSS_FALLBACK_DATE).toISOString(),
      source: "fallback",
      daily: JOBLOSS_FALLBACK_DAILY,
    });
  } finally {
    clearTimeout(timer);
  }
}
