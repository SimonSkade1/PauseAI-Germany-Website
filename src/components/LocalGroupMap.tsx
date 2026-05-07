"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { MessageCircle, Globe } from "lucide-react";
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
            <Popup maxWidth={260} minWidth={200}>
              <div className="popup-content">
                <h3 className="font-section text-base text-[#1a1a1a] mb-2">
                  {group.city}
                </h3>

                {group.description && (
                  <p className="font-body text-sm text-[#1a1a1a]/70 mb-2">{group.description}</p>
                )}

                <div className="font-body text-sm text-[#1a1a1a]/80 mb-2">
                  <strong>Kontakt:</strong> {group.contact.name}{" "}
                  <a
                    href={`mailto:${group.contact.email}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {group.contact.email}
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {group.links.whatsapp && (
                    <a
                      href={group.links.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] !text-white no-underline transition-opacity hover:opacity-80"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
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
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#3A76F0] !text-white no-underline transition-opacity hover:opacity-80"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {group.links.telegram && (
                    <a
                      href={group.links.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Telegram"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0088cc] !text-white no-underline transition-opacity hover:opacity-80"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </a>
                  )}
                  {group.lumaUrl && (
                    <a
                      href={group.lumaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-2.5 py-1 font-section text-[10px] tracking-wider !text-black no-underline transition-colors hover:bg-[#e88510]"
                    >
                      Nächster Termin
                    </a>
                  )}
                  {group.website && (
                    <a
                      href={group.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Webseite"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#1a1a1a] bg-white !text-pause-black no-underline transition-opacity hover:opacity-70"
                    >
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  )}
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
