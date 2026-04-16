// Add calendar IDs here as local groups create their own Luma calendars.
export const CALENDAR_IDS = [
  "cal-zalx0j0ZcHpAlEB", // PauseAI Germany (Markus)
];

export type LumaEvent = {
  name: string;
  start_at: string;
  end_at: string;
  timezone: string;
  url: string;
  cover_url: string | null;
  location_type: string;
  geo_address_info: { city?: string; full_address?: string } | null;
};

export async function fetchAllEvents(): Promise<LumaEvent[]> {
  const results = await Promise.all(
    CALENDAR_IDS.map((id) =>
      fetch(
        `https://api.lu.ma/calendar/get-items?calendar_api_id=${id}&period=future`,
        { next: { revalidate: 3600 } }
      )
        .then((res) => (res.ok ? res.json() : { entries: [] }))
        .catch(() => ({ entries: [] }))
    )
  );

  const allEntries = results.flatMap((r) => r.entries ?? []);
  allEntries.sort(
    (a: { start_at: string }, b: { start_at: string }) =>
      new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
  );

  return allEntries.map(
    (entry: {
      event: {
        name: string;
        start_at: string;
        end_at: string;
        timezone: string;
        url: string;
        cover_url: string | null;
        location_type: string;
        geo_address_info: { city?: string; full_address?: string } | null;
      };
    }) => ({
      name: entry.event.name,
      start_at: entry.event.start_at,
      end_at: entry.event.end_at,
      timezone: entry.event.timezone,
      url: entry.event.url,
      cover_url: entry.event.cover_url,
      location_type: entry.event.location_type,
      geo_address_info: entry.event.geo_address_info,
    })
  );
}
