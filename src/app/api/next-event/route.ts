import { NextResponse } from "next/server";
import { fetchAllEvents } from "@/lib/luma";

// Set to a Luma event URL slug to feature a specific event below the next event.
// Set to null to only show the next upcoming event.
// Example: "az774jm3" for the Connor Leahy Q&A
const FEATURED_EVENT_SLUG: string | null = "az774jm3";

export async function GET() {
  const events = await fetchAllEvents();
  if (events.length === 0) {
    return NextResponse.json({ next: null, featured: null });
  }

  const first = events[0];
  const next = { name: first.name, start_at: first.start_at, timezone: first.timezone, url: first.url };

  let featured = null;
  if (FEATURED_EVENT_SLUG && FEATURED_EVENT_SLUG !== first.url) {
    const match = events.find((e) => e.url === FEATURED_EVENT_SLUG);
    if (match) {
      featured = { name: match.name, start_at: match.start_at, timezone: match.timezone, url: match.url };
    }
  }

  return NextResponse.json({ next, featured });
}
