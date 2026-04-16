import { NextResponse } from "next/server";

const LUMA_API = "https://api.lu.ma/calendar/get-items?calendar_api_id=cal-zalx0j0ZcHpAlEB&period=future";

// Set to a Luma event URL slug to feature a specific event below the next event.
// Set to null to only show the next upcoming event.
// Example: "az774jm3" for the Connor Leahy Q&A
const FEATURED_EVENT_SLUG: string | null = "az774jm3";

function pickEvent(entries: { event: { name: string; start_at: string; timezone: string; url: string } }[], slug: string) {
  const entry = entries.find((e) => e.event.url === slug);
  if (!entry) return null;
  const ev = entry.event;
  return { name: ev.name, start_at: ev.start_at, timezone: ev.timezone, url: ev.url };
}

export async function GET() {
  const res = await fetch(LUMA_API, { next: { revalidate: 3600 } });
  if (!res.ok) {
    return NextResponse.json({ next: null, featured: null }, { status: 502 });
  }
  const data = await res.json();
  const entries = data?.entries;
  if (!entries || entries.length === 0) {
    return NextResponse.json({ next: null, featured: null });
  }

  const first = entries[0].event;
  const next = { name: first.name, start_at: first.start_at, timezone: first.timezone, url: first.url };

  let featured = null;
  if (FEATURED_EVENT_SLUG && FEATURED_EVENT_SLUG !== first.url) {
    featured = pickEvent(entries, FEATURED_EVENT_SLUG);
  }

  return NextResponse.json({ next, featured });
}
