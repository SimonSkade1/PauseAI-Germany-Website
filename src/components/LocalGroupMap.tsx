"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocalGroup } from "@/lib/local-group-types";

const customIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to fly to a specific group when triggered
function FlyToGroup({ group }: { group: LocalGroup | null }) {
  const map = useMap();

  useEffect(() => {
    if (group) {
      map.flyTo([group.lat, group.lng], 11, { duration: 1.2 });
    }
  }, [group, map]);

  return null;
}

export interface LocalGroupMapHandle {
  flyToGroup: (group: LocalGroup) => void;
}

interface LocalGroupMapProps {
  groups: LocalGroup[];
  activeGroup: LocalGroup | null;
}

const LocalGroupMap = forwardRef<LocalGroupMapHandle, LocalGroupMapProps>(
  function LocalGroupMap({ groups, activeGroup }, ref) {
    const markerRefs = useRef<Record<string, L.Marker>>({});

    useImperativeHandle(ref, () => ({
      flyToGroup: (group: LocalGroup) => {
        const marker = markerRefs.current[group.id];
        if (marker) {
          setTimeout(() => marker.openPopup(), 1300);
        }
      },
    }));

    // Open popup when activeGroup changes
    useEffect(() => {
      if (activeGroup) {
        const marker = markerRefs.current[activeGroup.id];
        if (marker) {
          setTimeout(() => marker.openPopup(), 1300);
        }
      }
    }, [activeGroup]);

    return (
      <MapContainer
        center={[51.1657, 10.4515]}
        zoom={6}
        className="h-[350px] w-full md:h-[500px]"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToGroup group={activeGroup} />
        {groups.map((group) => (
          <Marker
            key={group.id}
            position={[group.lat, group.lng]}
            icon={customIcon}
            ref={(el) => {
              if (el) markerRefs.current[group.id] = el;
            }}
          >
            <Popup maxWidth={300} minWidth={240}>
              <div className="popup-content">
                <h3 className="font-section text-base text-[#1a1a1a] mb-1">
                  {group.city}
                </h3>
                <p className="font-body text-sm text-[#1a1a1a]/80 mb-2">
                  {group.description}
                </p>
                <div className="flex items-center gap-1.5 mb-2">
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
                  <span className="font-body text-sm text-[#1a1a1a]">
                    {group.meetingSchedule}
                  </span>
                </div>

                {/* Luma button */}
                <a
                  href={group.lumaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-3 py-1.5 font-section text-[10px] tracking-wider text-black no-underline transition-colors hover:bg-[#e88510]"
                >
                  Termine ansehen
                </a>

                {/* Chat links */}
                <div className="flex items-center gap-2 mb-3">
                  {group.links.whatsapp && (
                    <a
                      href={group.links.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white no-underline transition-opacity hover:opacity-80"
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
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#3A76F0] text-white no-underline transition-opacity hover:opacity-80"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
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
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0088cc] text-white no-underline transition-opacity hover:opacity-80"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.013-1.252-.242-1.865-.44-.751-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Contact */}
                <div className="font-body text-xs text-[#1a1a1a]/70">
                  <p className="mb-0.5">
                    <strong>Kontakt:</strong> {group.contact.name}
                  </p>
                  <p className="mb-0.5">
                    <a
                      href={`mailto:${group.contact.email}`}
                      className="text-[#FF9416] no-underline hover:underline"
                    >
                      {group.contact.email}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`tel:${group.contact.phone}`}
                      className="text-[#FF9416] no-underline hover:underline"
                    >
                      {group.contact.phone}
                    </a>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }
);

export default LocalGroupMap;
