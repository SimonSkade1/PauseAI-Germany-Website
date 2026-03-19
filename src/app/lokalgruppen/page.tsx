"use client";

import { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import localGroupsData from "@/data/local-groups.json";
import type { LocalGroup } from "@/lib/local-group-types";
import type { LocalGroupMapHandle } from "@/components/LocalGroupMap";

const LocalGroupMap = dynamic(() => import("@/components/LocalGroupMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[350px] w-full items-center justify-center bg-gray-100 md:h-[500px]">
      <p className="font-body text-sm text-[#1a1a1a]/50">Karte wird geladen...</p>
    </div>
  ),
});

const groups: LocalGroup[] = localGroupsData;

export default function LokalGruppenPage() {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<LocalGroup | null>(null);
  const mapRef = useRef<LocalGroupMapHandle>(null);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const term = search.toLowerCase();
    return groups.filter((g) => g.city.toLowerCase().includes(term));
  }, [search]);

  function handleSearch(value: string) {
    setSearch(value);
    const term = value.toLowerCase().trim();
    if (!term) {
      setActiveGroup(null);
      return;
    }
    const match = groups.find((g) => g.city.toLowerCase().includes(term));
    if (match) {
      setActiveGroup(match);
      mapRef.current?.flyToGroup(match);
    } else {
      setActiveGroup(null);
    }
  }

  function handleCardClick(group: LocalGroup) {
    setActiveGroup(group);
    mapRef.current?.flyToGroup(group);
    // Scroll to map
    window.scrollTo({ top: 300, behavior: "smooth" });
  }

  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-8 pt-10 md:px-10 md:pt-14">
          <div className="mb-4">
            <p className="font-section text-sm text-[#FF9416]">Lokalgruppen</p>
            <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
              Finde deine Lokalgruppe in Deutschland
            </h1>
            <p className="mt-6 max-w-3xl font-body text-pause-black/85">
              PauseAI lebt vor Ort. Unsere Lokalgruppen organisieren Infoabende,
              Stammtische und gemeinsame Aktionen in ganz Deutschland. Finde eine
              Gruppe in deiner Nähe und werde Teil der Bewegung.
            </p>
          </div>

          {/* Search */}
          <div className="mt-6 max-w-md">
            <label
              htmlFor="group-search"
              className="mb-2 block font-section text-xs tracking-wider text-pause-black"
            >
              Stadt suchen
            </label>
            <input
              id="group-search"
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="z.B. Freiburg, Leipzig, Bonn..."
              className="w-full border border-[#1a1a1a] bg-white px-4 py-2 font-body text-sm text-pause-black outline-none transition-colors focus:border-[#FF9416]"
            />
          </div>
        </section>

        {/* Map */}
        <section className="mx-auto max-w-5xl px-6 pb-12 md:px-10">
          <div className="overflow-hidden rounded-sm border-2 border-[#1a1a1a]">
            <LocalGroupMap
              ref={mapRef}
              groups={groups}
              activeGroup={activeGroup}
            />
          </div>
        </section>

        {/* Group cards */}
        <section className="mx-auto max-w-5xl px-6 pb-12 md:px-10">
          <h2 className="font-section mb-6 text-lg text-pause-black md:text-xl">
            Alle Lokalgruppen
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-sm border-2 border-[#1a1a1a] bg-white p-6 transition-shadow hover:shadow-lg"
              >
                {/* City name */}
                <h3 className="font-section text-xl text-pause-black">
                  {group.city}
                </h3>

                {/* Description */}
                <p className="mt-2 font-body text-sm text-pause-black/80">
                  {group.description}
                </p>

                {/* Meeting schedule */}
                <div className="mt-3 flex items-center gap-2">
                  <svg
                    className="h-4 w-4 shrink-0 text-[#FF9416]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="font-body text-sm text-pause-black/80">
                    {group.meetingSchedule}
                  </span>
                </div>

                {/* Chat links */}
                <div className="mt-4 flex items-center gap-2">
                  {group.links.whatsapp && (
                    <a
                      href={group.links.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-80"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                  )}
                  {group.links.signal && (
                    <a
                      href={group.links.signal}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Signal"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#3A76F0] text-white transition-opacity hover:opacity-80"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </a>
                  )}
                  {group.links.telegram && (
                    <a
                      href={group.links.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Telegram"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0088cc] text-white transition-opacity hover:opacity-80"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.013-1.252-.242-1.865-.44-.751-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Luma button */}
                <a
                  href={group.lumaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
                >
                  Termine ansehen
                </a>

                {/* Contact */}
                <div className="mt-4 border-t border-[#1a1a1a]/10 pt-3">
                  <p className="font-body text-xs text-pause-black/60">
                    <span className="font-body-bold">Kontakt:</span>{" "}
                    {group.contact.name}
                  </p>
                  <p className="font-body text-xs text-pause-black/60">
                    <a
                      href={`mailto:${group.contact.email}`}
                      className="text-[#FF9416] transition-colors hover:text-[#e88510]"
                    >
                      {group.contact.email}
                    </a>
                    {" | "}
                    <a
                      href={`tel:${group.contact.phone}`}
                      className="text-[#FF9416] transition-colors hover:text-[#e88510]"
                    >
                      {group.contact.phone}
                    </a>
                  </p>
                </div>

                {/* Show on map button */}
                <button
                  type="button"
                  onClick={() => handleCardClick(group)}
                  className="mt-3 inline-flex items-center gap-1.5 font-body text-xs text-[#FF9416] transition-colors hover:text-[#e88510]"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Auf Karte anzeigen
                </button>
              </div>
            ))}
          </div>

          {filteredGroups.length === 0 && search.trim() && (
            <div className="mt-6 rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6 text-center">
              <p className="font-body text-pause-black/80">
                Keine Gruppe für &bdquo;{search}&ldquo; gefunden.
              </p>
            </div>
          )}
        </section>

        {/* CTA: Start a new group */}
        <section className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
          <div className="rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl">
              Keine Gruppe in deiner Nähe?
            </h2>
            <p className="mt-3 max-w-2xl font-body text-pause-black/85">
              Gründe deine eigene Lokalgruppe! Wir unterstützen dich mit
              Materialien, Erfahrung und einer aktiven Community. Melde dich
              einfach bei uns und wir helfen dir beim Aufbau.
            </p>
            <a
              href="mailto:germany@pauseai.info?subject=Lokalgruppe%20gr%C3%BCnden"
              className="mt-5 inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
            >
              Lokalgruppe gründen
            </a>
          </div>
          <div className="mt-6 rounded-sm border border-[#1a1a1a] bg-white p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl">
              Internationale Gruppen
            </h2>
            <p className="mt-3 max-w-2xl font-body text-pause-black/85">
              PauseAI ist eine globale Bewegung mit Gruppen in vielen Ländern.
              Finde Lokalgruppen weltweit auf der internationalen PauseAI-Seite.
            </p>
            <a
              href="https://pauseai.info/communities"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FF9416]"
            >
              Globale Gruppen ansehen
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
