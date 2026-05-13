"use client";

import { useState, useEffect } from "react";
import LinkedHeading from "@/components/LinkedHeading";

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
};

function EventCard({ event }: { event: EventData }) {
  const start = new Date(event.start_at);
  const tz = event.timezone || "Europe/Berlin";
  const dateFmt = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", timeZone: tz }).format(start).replace(/\.$/, "");
  const weekday = new Intl.DateTimeFormat("de-DE", { weekday: "short", timeZone: tz }).format(start).replace(".", "");
  const time = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(start);
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

  const lumaUrl = event.url ? `https://lu.ma/${event.url}` : null;

  const body = (
    <div className="flex-1 flex flex-col justify-center p-4 md:p-6 min-w-0">
      <h3 className="font-section text-base md:text-lg text-pause-black leading-snug">{event.name}</h3>
      {event.description && (
        <p className="font-body text-sm text-pause-black/60 mt-2 leading-relaxed">{event.description}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-4">
        {lumaUrl ? (
          <a href={lumaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]">
            Mehr Details →
          </a>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row bg-white border border-[#1a1a1a] md:border-2">
      {dateBlock}
      {body}
    </div>
  );
}

export default function EventsSection() {
  const [lumaEvents, setLumaEvents] = useState<EventData[]>([]);
  useEffect(() => {
    fetch("/api/events").then((res) => res.json()).then((data) => { if (Array.isArray(data)) setLumaEvents(data); }).catch(() => {});
  }, []);

  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-24 border-t-2 border-[#eee]">
        <LinkedHeading id="veranstaltungen">Veranstaltungen</LinkedHeading>
        <div className="space-y-4">{lumaEvents.map((event, i) => <EventCard key={event.href ?? event.url ?? i} event={event} />)}</div>
        <div className="mt-8 flex justify-center">
          <a href="/veranstaltung-vorschlagen" className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-6 py-3 font-section text-sm tracking-wider text-black transition-colors hover:bg-[#FFFAF5]">
            Themen vorschlagen und abstimmen →
          </a>
        </div>
      </div>
    </section>
  );
}
