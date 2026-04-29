import { NextResponse } from "next/server";
import { JOBLOSS_FALLBACK_COUNT, JOBLOSS_FALLBACK_DAILY, JOBLOSS_FALLBACK_DATE } from "@/data/jobloss";

export const revalidate = 3600;

const FALLBACK = parseInt(process.env.NEXT_PUBLIC_JOBLOSS_FALLBACK ?? String(JOBLOSS_FALLBACK_COUNT), 10);
const UPSTREAM = process.env.JOBLOSS_API_URL ?? "https://jobloss.ai/api/count";

interface Daily {
  date: string;
  value: number;
}

interface Payload {
  count: number;
  lastUpdated: string;
  source: "upstream" | "fallback" | "mock";
  daily: Daily[];
}

export async function GET(): Promise<NextResponse<Payload>> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 5000);
  try {
    const r = await fetch(UPSTREAM, {
      signal: ac.signal,
      next: { revalidate: 3600 },
    });
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const data = (await r.json()) as Partial<Payload>;
    return NextResponse.json({
      count: typeof data.count === "number" ? data.count : FALLBACK,
      lastUpdated: data.lastUpdated ?? new Date().toISOString(),
      source: "upstream",
      daily: Array.isArray(data.daily) && data.daily.length > 0 ? data.daily : JOBLOSS_FALLBACK_DAILY,
    });
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
