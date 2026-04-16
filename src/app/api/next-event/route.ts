import { NextResponse } from "next/server";

const LUMA_API = "https://api.lu.ma/calendar/get-items?calendar_api_id=cal-zalx0j0ZcHpAlEB&period=future";

export async function GET() {
  const res = await fetch(LUMA_API, { next: { revalidate: 3600 } });
  if (!res.ok) {
    return NextResponse.json(null, { status: 502 });
  }
  const data = await res.json();
  const entries = data?.entries;
  if (!entries || entries.length === 0) {
    return NextResponse.json(null);
  }

  const ev = entries[0].event;
  return NextResponse.json({
    name: ev.name,
    start_at: ev.start_at,
    timezone: ev.timezone,
    url: ev.url,
  });
}
