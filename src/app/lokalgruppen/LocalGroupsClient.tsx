"use client";

import { useState, useRef, useMemo } from "react";
import { MessageCircle, Globe } from "lucide-react";
import dynamic from "next/dynamic";
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

export default function LocalGroupsClient({ groups }: { groups: LocalGroup[] }) {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<LocalGroup | null>(null);
  const mapRef = useRef<LocalGroupMapHandle>(null);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const term = search.toLowerCase();
    return groups.filter((g) => g.city.toLowerCase().includes(term));
  }, [search, groups]);

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
    window.scrollTo({ top: 300, behavior: "smooth" });
  }

  return (
    <>
      {/* Search */}
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-4 md:px-10">
        <div className="max-w-md">
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
        <div className="isolate overflow-hidden rounded-sm border-2 border-[#1a1a1a]">
          <LocalGroupMap ref={mapRef} groups={groups} activeGroup={activeGroup} />
        </div>
      </section>

      {/* Group cards */}
      <section className="mx-auto max-w-5xl px-6 pb-12 md:px-10">
        <h2 className="font-section mb-6 text-lg text-pause-black md:text-xl">
          Alle Lokalgruppen
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-sm border-2 border-[#1a1a1a] bg-white p-4 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-section text-lg text-pause-black">
                  {group.city}
                </h3>
                <div className="flex shrink-0 items-center gap-1.5">
                  {group.links.whatsapp && (
                    <a
                      href={group.links.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-80"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
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
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#3A76F0] text-white transition-opacity hover:opacity-80"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  )}
                  {group.links.telegram && (
                    <a
                      href={group.links.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Telegram"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0088cc] text-white transition-opacity hover:opacity-80"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </a>
                  )}
                  {group.website && (
                    <a
                      href={group.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Webseite"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#1a1a1a] bg-white text-pause-black transition-opacity hover:opacity-70"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              {group.description && (
                <p className="mt-2 font-body text-sm text-pause-black/70">
                  {group.description}
                </p>
              )}

              <div className="mt-3 border-t border-[#1a1a1a]/10 pt-3 font-body text-sm text-pause-black/80">
                <span className="font-body-bold">Kontakt:</span>{" "}
                {group.contact.name}
                {" · "}
                <a href={`mailto:${group.contact.email}`} className="orange-link">
                  {group.contact.email}
                </a>
              </div>

              {group.lumaUrl && (
                <div className="mt-3">
                  <a
                    href={group.lumaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-3 py-1.5 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
                  >
                    Nächstes Event
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleCardClick(group)}
                className="mt-3 inline-flex items-center gap-1.5 font-body text-xs text-pause-black/50 transition-colors hover:text-pause-black"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    </>
  );
}
