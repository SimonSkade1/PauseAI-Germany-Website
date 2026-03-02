"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useMemo } from "react";

const JITSI_ONBOARDING_URL = "https://meet.jit.si/PauseAI-Deutschland-Kennenlernen";
const DISCORD_URL = "https://discord.gg/pvZ5PmRX4R";
const CALENDLY_URL = "";
const ONBOARDING_DURATION_MS = 60 * 60 * 1000;
const BERLIN_TIMEZONE = "Europe/Berlin";

type Slot = {
  key: "sunday" | "monday";
  label: string;
  weekday: number;
  hour: number;
  minute: number;
};

const SLOTS: Slot[] = [
  { key: "sunday", label: "Sonntag 16:00", weekday: 0, hour: 16, minute: 0 },
  { key: "monday", label: "Montag 19:00", weekday: 1, hour: 19, minute: 0 },
];

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

function getNextSlotDate(slot: Slot, referenceDate: Date = new Date()): Date {
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
    weekday: "long",
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

function buildGoogleCalendarUrl(slotLabel: string, start: Date): string {
  const end = new Date(start.getTime() + ONBOARDING_DURATION_MS);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `PauseAI Deutschland Onboarding (${slotLabel})`,
    dates: `${formatUtcForCalendar(start)}/${formatUtcForCalendar(end)}`,
    details: `Onboarding mit Hauke (Dauer: 1 Stunde).\n\nJitsi: ${JITSI_ONBOARDING_URL}`,
    location: JITSI_ONBOARDING_URL,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs(slotLabel: string, start: Date): void {
  const end = new Date(start.getTime() + ONBOARDING_DURATION_MS);
  const stamp = formatUtcForCalendar(new Date());
  const uid = `${start.getTime()}-${slotLabel.replace(/\s+/g, "-").toLowerCase()}@pauseai.info`;
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PauseAI Deutschland//Onboarding//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatUtcForCalendar(start)}`,
    `DTEND:${formatUtcForCalendar(end)}`,
    `SUMMARY:PauseAI Deutschland Onboarding (${slotLabel})`,
    `DESCRIPTION:Onboarding mit Hauke (Dauer: 1 Stunde).\\n\\nJitsi: ${JITSI_ONBOARDING_URL}`,
    `LOCATION:${JITSI_ONBOARDING_URL}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `pauseai-onboarding-${slotLabel.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function OnboardingPage() {
  const nextDates = useMemo<Record<Slot["key"], Date>>(
    () => ({
      sunday: getNextSlotDate(SLOTS[0]),
      monday: getNextSlotDate(SLOTS[1]),
    }),
    [],
  );

  const calendlyConfigured = useMemo(() => CALENDLY_URL.trim().length > 0, []);

  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        <section className="mx-auto max-w-5xl px-6 pb-12 pt-10 md:px-10 md:pt-14">
          <div className="mb-10">
            <p className="font-section text-sm text-[#FF9416]">Onboarding</p>
            <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
              Wähle deinen Einstieg
            </h1>
            <p className="mt-4 max-w-3xl font-body text-lg text-pause-black/85">
              Wir bieten zwei offene Onboarding-Termine pro Woche an. Die Meetings dauern 1 Stunde,
              laufen über Jitsi und werden persönlich von Hauke begleitet.
            </p>
            <p className="mt-3 font-body text-pause-black/80">
              Zeitzone: <span className="font-body-bold">Europe/Berlin</span> (automatische Sommer-/Winterzeit)
            </p>
          </div>

          <div className="space-y-6">
            {SLOTS.map((slot) => {
              const nextStart = nextDates[slot.key];
              const googleCalendarUrl = buildGoogleCalendarUrl(slot.label, nextStart);

              return (
                <article
                  key={slot.key}
                  className="rounded-sm border-2 border-[#1a1a1a] bg-white p-6 md:p-8"
                >
                  <h2 className="font-section text-xl text-pause-black md:text-2xl">{slot.label}</h2>
                  <p className="mt-3 font-body text-pause-black/85">
                    Nächster Termin:{" "}
                    <span className="font-body-bold">
                      {formatGermanDate(nextStart)}
                    </span>
                  </p>
                  <p className="mt-2 font-body text-pause-black/85">
                    Ort:{" "}
                    <a
                      href={JITSI_ONBOARDING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="orange-link font-body-bold"
                    >
                      {JITSI_ONBOARDING_URL}
                    </a>
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center border border-[#1a1a1a] px-4 py-2 font-section text-xs tracking-wider transition-colors ${
                        "bg-[#FF9416] text-black hover:bg-[#e88510]"
                      }`}
                    >
                      In Google Kalender
                    </a>
                    <button
                      type="button"
                      onClick={() => downloadIcs(slot.label, nextStart)}
                      className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FFFAF5] disabled:cursor-not-allowed disabled:text-gray-500"
                    >
                      ICS herunterladen
                    </button>
                  </div>
                </article>
              );
            })}

            <article className="rounded-sm border-2 border-[#1a1a1a] bg-white p-6 md:p-8">
              <h2 className="font-section text-xl text-pause-black md:text-2xl">Anderer Termin (1:1)</h2>
              <p className="mt-3 font-body text-pause-black/85">
                Wenn Sonntag oder Montag für dich nicht passen, kannst du ein persönliches 1:1 mit Hauke buchen.
              </p>
              <div className="mt-5">
                {calendlyConfigured ? (
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
                  >
                    1:1 über Calendly buchen
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
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
          <div className="rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl">Discord Community</h2>
            <p className="mt-3 font-body text-pause-black/85">
              Das meiste inhaltliche Arbeiten findet bei uns auf Discord statt. Komm gern dazu und lerne die Community kennen.
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
          <p className="mt-8 font-body text-sm text-pause-black/70">
            Zurück zur Startseite:{" "}
            <Link href="/" className="orange-link font-body-bold">
              pauseai-germany.info
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
