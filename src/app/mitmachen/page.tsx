"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Info } from "lucide-react";
import { useMemo } from "react";

const DISCORD_WEEKLY_URL = "https://discord.gg/e2Wh4WFwKm";
const DISCORD_URL = "https://discord.gg/pvZ5PmRX4R";
const WHATSAPP_URL = "https://chat.whatsapp.com/Kzq9UKXb82z3jAT1DTHtX4";
const CALENDLY_URL = "https://calendly.com/hauke-h-posteo/neues-meeting";
const WEEKLY_MEETING_DURATION_MS = 60 * 60 * 1000;
const BERLIN_TIMEZONE = "Europe/Berlin";
const WEEKLY_MEETING_LABEL = "Donnerstag 18:00";
const WEEKLY_MEETING_TITLE = "PauseAI Deutschland Community-Treffen";
const WEEKLY_MEETING_DESCRIPTION = "Wöchentliches PauseAI Deutschland Community-Treffen.";
const DENKPAUSE_DURATION_MS = 2 * 60 * 60 * 1000;
const DENKPAUSE_TITLE = "PauseAI Deutschland Denkpause";
const DENKPAUSE_DESCRIPTION = "Offene Gesprächsrunde auf Discord. Keine Agenda, einfach vorbeikommen, Fragen stellen, über aktuelle KI-News reden, diskutieren, quatschen. Komm wann du willst, bleib so lange du magst.";
const DISCORD_INFO_TEXT = "Unser wöchentliches virtuelles Treffen findet per Discord statt. Du brauchst einen Account um teilzunehmen.";

function getBerlinWeekday(date: Date): number {
  const weekdayText = new Intl.DateTimeFormat("en-US", {
    timeZone: BERLIN_TIMEZONE,
    weekday: "short",
  }).format(date);

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return weekdayMap[weekdayText];
}

function getBerlinDateParts(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BERLIN_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
  };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const zonePart = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+0";
  const match = zonePart.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!match) return 0;

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? "0");
  return sign * (hours * 60 + minutes) * 60 * 1000;
}

function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const utcGuessMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offsetMs = getTimeZoneOffsetMs(new Date(utcGuessMs), timeZone);
  return new Date(utcGuessMs - offsetMs);
}

function getNextSlotDate(slot: { label: string; weekday: number; hour: number; minute: number }, referenceDate: Date = new Date()): Date {
  const currentBerlin = getBerlinDateParts(referenceDate);
  const currentWeekday = getBerlinWeekday(referenceDate);
  const currentMinutes = currentBerlin.hour * 60 + currentBerlin.minute;
  const slotMinutes = slot.hour * 60 + slot.minute;

  let daysAhead = (slot.weekday - currentWeekday + 7) % 7;
  if (daysAhead === 0 && currentMinutes > slotMinutes) {
    daysAhead = 7;
  }

  const berlinDateAsUtc = new Date(Date.UTC(currentBerlin.year, currentBerlin.month - 1, currentBerlin.day));
  berlinDateAsUtc.setUTCDate(berlinDateAsUtc.getUTCDate() + daysAhead);

  return zonedDateTimeToUtc(
    berlinDateAsUtc.getUTCFullYear(),
    berlinDateAsUtc.getUTCMonth() + 1,
    berlinDateAsUtc.getUTCDate(),
    slot.hour,
    slot.minute,
    BERLIN_TIMEZONE,
  );
}

function formatGermanDate(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: BERLIN_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function formatUtcForCalendar(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function buildWeeklyMeetingGoogleCalendarUrl(start: Date): string {
  const end = new Date(start.getTime() + WEEKLY_MEETING_DURATION_MS);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${WEEKLY_MEETING_TITLE}`,
    dates: `${formatUtcForCalendar(start)}/${formatUtcForCalendar(end)}`,
    details: `${WEEKLY_MEETING_DESCRIPTION}\n\n${DISCORD_INFO_TEXT}\n\nDiscord: ${DISCORD_WEEKLY_URL}`,
    location: DISCORD_WEEKLY_URL,
    recur: "RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=TH",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildDenkpauseGoogleCalendarUrl(start: Date): string {
  const end = new Date(start.getTime() + DENKPAUSE_DURATION_MS);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: DENKPAUSE_TITLE,
    dates: `${formatUtcForCalendar(start)}/${formatUtcForCalendar(end)}`,
    details: `${DENKPAUSE_DESCRIPTION}\n\nDiscord: ${DISCORD_URL}`,
    location: DISCORD_URL,
    recur: "RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=WE",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadDenkpauseIcs(start: Date): void {
  const end = new Date(start.getTime() + DENKPAUSE_DURATION_MS);
  const stamp = formatUtcForCalendar(new Date());
  const uid = `${start.getTime()}-denkpause@pauseai.info`;
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PauseAI Deutschland//Denkpause//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatUtcForCalendar(start)}`,
    `DTEND:${formatUtcForCalendar(end)}`,
    `SUMMARY:${DENKPAUSE_TITLE}`,
    `DESCRIPTION:${DENKPAUSE_DESCRIPTION}\\n\\nDiscord: ${DISCORD_URL}`,
    `LOCATION:${DISCORD_URL}`,
    "RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=WE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pauseai-denkpause.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function downloadWeeklyMeetingIcs(start: Date): void {
  const end = new Date(start.getTime() + WEEKLY_MEETING_DURATION_MS);
  const stamp = formatUtcForCalendar(new Date());
  const uid = `${start.getTime()}-weekly-meeting@pauseai.info`;
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PauseAI Deutschland//Weekly Meeting//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatUtcForCalendar(start)}`,
    `DTEND:${formatUtcForCalendar(end)}`,
    `SUMMARY:${WEEKLY_MEETING_TITLE}`,
    `DESCRIPTION:${WEEKLY_MEETING_DESCRIPTION}\\n\\n${DISCORD_INFO_TEXT}\\n\\nDiscord: ${DISCORD_WEEKLY_URL}`,
    `LOCATION:${DISCORD_WEEKLY_URL}`,
    "RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=TH",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pauseai-weekly-meeting.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function OnboardingPage() {
  const calendlyConfigured = useMemo(() => CALENDLY_URL.trim().length > 0, []);
  const whatsappConfigured = useMemo(() => WHATSAPP_URL.trim().length > 0, []);
  const nextWeeklyMeeting = useMemo(
    () => getNextSlotDate({ key: "sunday", label: WEEKLY_MEETING_LABEL, weekday: 4, hour: 18, minute: 0 }),
    [],
  );
  const weeklyMeetingGoogleCalendarUrl = useMemo(
    () => buildWeeklyMeetingGoogleCalendarUrl(nextWeeklyMeeting),
    [nextWeeklyMeeting],
  );
  const nextDenkpause = useMemo(
    () => getNextSlotDate({ key: "sunday", label: "Mittwoch 19:00", weekday: 3, hour: 19, minute: 0 }),
    [],
  );
  const denkpauseGoogleCalendarUrl = useMemo(
    () => buildDenkpauseGoogleCalendarUrl(nextDenkpause),
    [nextDenkpause],
  );

  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        <section className="mx-auto max-w-5xl px-6 pb-12 pt-10 md:px-10 md:pt-14">
          <div className="mb-10">
            <p className="font-section text-sm text-[#FF9416]">Mitmachen</p>
            <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
              Wir freuen uns, dich kennenzulernen!
            </h1>
            <div className="mt-6 flex items-center gap-4 rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-4">
              <Image
                src="/profile-pics/hauke.jpeg"
                alt="Hauke"
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
              <p className="font-body text-pause-black/85">
                Hi, ich bin Hauke. Ich erkläre dir, wer wir sind, was wir tun und wie du mitmachen kannst. Und beantworte alle Fragen, die du hast.
                Buch dir einfach einen Termin.
              </p>
            </div>
          </div>

          <article className="flex flex-col rounded-sm border-2 border-[#1a1a1a] bg-white p-6">
            <h2 className="font-section text-xl text-pause-black">1:1 Kennenlerngespräch</h2>
            <p className="mt-3 font-body text-pause-black/85">
              Such dir einen Termin aus, der dir passt. Der Call findet per Google Meet statt.
            </p>
            <div className="mt-5">
              {calendlyConfigured ? (
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
                >
                  Termin buchen
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center justify-center border border-[#1a1a1a] bg-gray-200 px-4 py-2 font-section text-xs tracking-wider text-gray-500"
                >
                  Calendly-Link folgt
                </button>
              )}
            </div>
          </article>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
          <div className="rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl">Unsere Discord-Community</h2>
            <p className="mt-3 font-body text-pause-black/85">
              Wir kommunizieren und arbeiten hauptsächlich über Discord. Komm rein und sag Hallo.
            </p>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FF9416]"
            >
              Zum Discord-Server
            </a>
          </div>
          <div className="mt-6 rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl">Unsere WhatsApp-Community</h2>
            <p className="mt-3 font-body text-pause-black/85">
              Trete unserer Gruppe bei, um dich mit anderen auszutauschen und über Neuigkeiten informiert zu werden.
            </p>
            {whatsappConfigured ? (
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FF9416]"
              >
                Zur WhatsApp-Gruppe
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-5 inline-flex cursor-not-allowed items-center justify-center border border-[#1a1a1a] bg-gray-200 px-4 py-2 font-section text-xs tracking-wider text-gray-500"
              >
                WhatsApp-Link folgt
              </button>
            )}
          </div>
          <div className="mt-6 rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl">Wöchentliches virtuelles Treffen</h2>
            <p className="mt-3 font-body text-pause-black/85">
              Wir beginnen mit einer Vorstellungsrunde und erzählen, was in der letzten Woche passiert ist und was demnächst ansteht.
              <br/>
              Der Hauptteil besteht meistens aus zwei Dingen: 
              Zuerst machen wir gemeinsam eine kleine Aktion, z.B. Politikern schreiben oder etwas auf Social-Media teilen.
              Danach gibt es einen Content-Teil, bei dem wir gemeinsam diskutieren, brainstormen oder in ein bestimmtes Thema tiefer eintauchen.
              Und zum Schluss gibt es natürlich immer die Möglichkeit, sich locker untereinander auszutauschen.
              <br/>
              Jeder ist willkommen, auch wenn du nur mal reinschnuppern möchtest.
              <br/>
              Jeden <span className="font-semibold">Donnerstag</span> um 18:00 Uhr auf Discord. Nächstes Treffen:{" "}
              <span className="font-body-bold">{formatGermanDate(nextWeeklyMeeting)}</span>
            </p>
            <p className="mt-2 font-body text-pause-black/85">
              <a
                href={DISCORD_WEEKLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="orange-link font-body-bold"
              >
                Zum Discord-Server
              </a>
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={weeklyMeetingGoogleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FF9416]"
              >
                Google Kalender
              </a>
              <button
                type="button"
                onClick={() => downloadWeeklyMeetingIcs(nextWeeklyMeeting)}
                className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FF9416]"
              >
                Standardkalender
              </button>
            </div>
          </div>
          <div className="mt-6 rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl">Die Denkpause 💭</h2>
            <p className="mt-3 font-body text-pause-black/85">
              Offene Gesprächsrunde auf Discord. Keine Agenda, einfach vorbeikommen, Fragen stellen, über aktuelle KI-News reden, diskutieren, quatschen. Komm wann du willst, bleib so lange du magst.
              <br/>
              Jeden <span className="font-semibold">Mittwoch</span> von 19 bis 21 Uhr im Hangout-Channel. Nächste Denkpause:{" "}
              <span className="font-body-bold">{formatGermanDate(nextDenkpause)}</span>
            </p>
            <p className="mt-2 font-body text-pause-black/85">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="orange-link font-body-bold"
              >
                Zum Discord-Server
              </a>
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={denkpauseGoogleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FF9416]"
              >
                Google Kalender
              </a>
              <button
                type="button"
                onClick={() => downloadDenkpauseIcs(nextDenkpause)}
                className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FF9416]"
              >
                Standardkalender
              </button>
            </div>
          </div>
          <div className="mt-6 rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl">Auf eigene Faust</h2>
            <p className="mt-3 font-body text-pause-black/85">
              Du willst lieber erstmal alleine loslegen und dich vielleicht später in die Community einbringen? Kein Problem! Auf unserer Aktionsseite findest du viele Möglichkeiten, direkt aktiv zu werden und etwas zu bewirken. Schau doch mal vorbei!
            </p>
            <a
              href="/aktionen"
              className="mt-5 inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FF9416]"
            >
              Zu den Aktionen
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
