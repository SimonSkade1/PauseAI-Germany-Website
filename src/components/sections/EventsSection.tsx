"use client";

import { useState, useEffect } from "react";

export type EventData = {
  name: string;
  start_at: string;
  end_at: string;
  timezone: string;
  url: string;
  cover_url: string | null;
  location_type: string;
  geo_address_info: { city?: string } | null;
  href?: string;
  description?: string;
  googleCalendarUrl?: string;
};

function getNextThursdayBerlin(): Date {
  const now = new Date();
  const tz = "Europe/Berlin";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const vals = Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, p.value]));
  const year = Number(vals.year), month = Number(vals.month), day = Number(vals.day);
  const hour = Number(vals.hour), minute = Number(vals.minute);
  const weekdayStr = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(now);
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const currentWeekday = weekdayMap[weekdayStr];
  let daysAhead = (4 - currentWeekday + 7) % 7;
  if (daysAhead === 0 && hour * 60 + minute > 18 * 60) daysAhead = 7;
  const base = new Date(Date.UTC(year, month - 1, day));
  base.setUTCDate(base.getUTCDate() + daysAhead);
  const utcGuess = Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), 18, 0, 0);
  const zonePart = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, timeZoneName: "shortOffset", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(utcGuess)).find(p => p.type === "timeZoneName")?.value ?? "GMT+0";
  const m = zonePart.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  const offsetMs = m ? (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0)) * 60000 : 0;
  return new Date(utcGuess - offsetMs);
}

function formatIcsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function downloadWeeklyIcs(event: EventData): void {
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);
  const icsContent = [
    "BEGIN:VCALENDAR", "VERSION:2.0",
    "PRODID:-//PauseAI Deutschland//Community-Treffen//DE",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:${start.getTime()}-weekly@pauseai.info`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`, `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${event.name}`,
    `DESCRIPTION:${event.description ?? ""}\\n\\nDiscord: ${event.href ?? ""}`,
    `LOCATION:${event.href ?? ""}`,
    "RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=TH",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pauseai-community-treffen.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function createWeeklyMeetingEvent(): EventData {
  const start = getNextThursdayBerlin();
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const discordUrl = "https://discord.gg/e2Wh4WFwKm";
  const name = "Wöchentliches Community-Treffen";
  const description = "Spannende Themen, gemeinsame Aktionen, News von PauseAI, Diskussion und Austausch. Jede:r ist willkommen!";
  const gcalParams = new URLSearchParams({
    action: "TEMPLATE", text: name,
    dates: `${formatIcsDate(start)}/${formatIcsDate(end)}`,
    details: `${description}\n\nDiscord: ${discordUrl}`,
    location: discordUrl,
    recur: "RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=TH",
  });
  return {
    name, start_at: start.toISOString(), end_at: end.toISOString(),
    timezone: "Europe/Berlin", url: "", cover_url: null,
    location_type: "meet", geo_address_info: null, href: discordUrl, description,
    googleCalendarUrl: `https://calendar.google.com/calendar/render?${gcalParams.toString()}`,
  };
}

function EventCard({ event }: { event: EventData }) {
  const start = new Date(event.start_at);
  const tz = event.timezone || "Europe/Berlin";
  const dateFmt = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", timeZone: tz }).format(start).replace(/\.$/, "");
  const weekday = new Intl.DateTimeFormat("de-DE", { weekday: "short", timeZone: tz }).format(start).replace(".", "");
  const time = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(start);
  const isOnline = event.location_type === "meet" || event.location_type === "virtual";
  const locationLabel = isOnline ? "Online · Discord" : event.geo_address_info?.city || "Vor Ort";
  const hasActions = !!event.googleCalendarUrl;

  const dateBlock = (
    <>
      <div className="flex md:hidden items-center gap-3 bg-[#1a1a1a] text-white px-4 py-3">
        <span className="font-body text-base text-white/50 uppercase tracking-widest">{weekday}</span>
        <span className="font-headline text-xl leading-none">{dateFmt}</span>
        <span className="font-body text-lg text-white/70">{time}</span>
      </div>
      <div className="hidden md:flex flex-col items-center justify-center w-32 flex-shrink-0 bg-[#1a1a1a] text-white py-6">
        <span className="font-body text-base text-white/50 uppercase tracking-widest mb-1">{weekday}</span>
        <span className="font-headline text-3xl leading-none">{dateFmt}</span>
        <span className="font-body text-lg text-white/70 mt-2">{time}</span>
      </div>
    </>
  );

  const body = (
    <div className="flex-1 flex flex-col justify-center p-4 md:p-6 min-w-0">
      <h3 className="font-section text-base md:text-lg text-pause-black leading-snug group-hover:text-[#FF9416] transition-colors">{event.name}</h3>
      <div className="flex items-center gap-3 mt-2 font-body text-sm text-pause-black/60">
        <span>{locationLabel}</span>
      </div>
      {event.description && (
        <p className="font-body text-sm text-pause-black/60 mt-2 leading-relaxed">{event.description}</p>
      )}
      {hasActions && (
        <div className="flex flex-wrap gap-2 mt-4">
          <a href={event.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]">
            Beitreten
          </a>
          <a href={event.googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FFFAF5]">
            Google Kalender
          </a>
          <button type="button" onClick={() => downloadWeeklyIcs(event)} className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FFFAF5] cursor-pointer">
            Standardkalender
          </button>
        </div>
      )}
    </div>
  );

  if (hasActions) {
    return (
      <div className="flex flex-col md:flex-row bg-white border border-[#1a1a1a] md:border-2">
        {dateBlock}
        {body}
      </div>
    );
  }

  return (
    <a href={`https://lu.ma/${event.url}`} target="_blank" rel="noopener noreferrer" className="group flex flex-col md:flex-row bg-white border border-[#1a1a1a] md:border-2 cursor-pointer hover:bg-[#FFFAF5] transition-colors">
      {dateBlock}
      {body}
      <div className="hidden md:flex items-center pr-6 text-[#FF9416] text-2xl transition-transform group-hover:translate-x-2">→</div>
    </a>
  );
}

export default function EventsSection() {
  const [lumaEvents, setLumaEvents] = useState<EventData[]>([]);
  useEffect(() => {
    fetch("/api/events").then((res) => res.json()).then((data) => { if (Array.isArray(data)) setLumaEvents(data); }).catch(() => {});
  }, []);

  const weeklyEvent = createWeeklyMeetingEvent();
  const events = [weeklyEvent, ...lumaEvents];

  return (
    <section id="veranstaltungen" className="bg-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="font-headline text-2xl text-pause-black text-center mb-12 md:text-4xl lg:text-5xl">Veranstaltungen</h2>
        <div className="space-y-4">{events.map((event, i) => <EventCard key={event.href ?? event.url ?? i} event={event} />)}</div>
        <div className="mt-8 flex justify-center">
          <a href="/veranstaltung-vorschlagen" className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-6 py-3 font-section text-sm tracking-wider text-black transition-colors hover:bg-[#FFFAF5]">
            Themen vorschlagen und abstimmen →
          </a>
        </div>
      </div>
    </section>
  );
}
