import { NextResponse } from "next/server";
import { fetchAllEvents } from "@/lib/luma";

export async function GET() {
  const events = await fetchAllEvents();
  return NextResponse.json(events);
}
