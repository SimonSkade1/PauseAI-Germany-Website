"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import EmailTemplateViewer from "./EmailTemplateViewer";

type Row = Record<string, string>;
type WizardStep = 1 | 2 | 3 | 4;
type Chamber = "bundestag" | "europarl";
type Coord = { lat: number; lon: number };
type CoordMap = Record<string, Coord>;
type RowInfo = {
  first: string;
  last: string;
  full: string;
  birthYear: string;
  party: string;
  bundesland: string;
  district: string;
  email: string;
  title: string;
  anrede: string;
  region: string;
  city: string;
  postalCode: string;
};

function parseCSV(text: string): { headers: string[]; rows: Row[] } {
  // Basic CSV parser that handles quoted fields with commas and newlines.
  const rows: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        // Preserve escaped quotes for the cell-level parser.
        cur += '""';
        i++;
      } else {
        inQuotes = !inQuotes;
        cur += ch;
      }
    } else if (ch === "\n" && !inQuotes) {
      rows.push(cur.replace(/\r$/, ""));
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.length) rows.push(cur.replace(/\r$/, ""));

  if (rows.length === 0) return { headers: [], rows: [] };

  const headerLine = rows.shift()!;
  const headers = splitCSVLine(headerLine);

  const dataRows = rows.map((r) => {
    const cols = splitCSVLine(r);
    const obj: Row = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] ?? "";
    });
    return obj;
  });

  return { headers, rows: dataRows };
}

function splitCSVLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells.map((c) => c.trim());
}

function parseLatLong(value: string): Coord | null {
  const parts = value.split(",").map((s) => s.trim());
  if (parts.length !== 2) return null;
  const lat = Number.parseFloat(parts[0]);
  const lon = Number.parseFloat(parts[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

function haversineKm(a: Coord, b: Coord): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const r = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}

export default function AbgeordneteSelect({
  onSelect,
}: {
  onSelect?: (row: Row | null) => void;
}) {
  const [allRows, setAllRows] = useState<Row[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Row | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [plzMapping, setPlzMapping] = useState<Record<string, string[]>>({});
  const [plzCoords, setPlzCoords] = useState<CoordMap>({});
  const [senderName, setSenderName] = useState("");
  const [step, setStep] = useState<WizardStep>(1);
  const [chamber, setChamber] = useState<Chamber | null>(null);
  const [mailDraft, setMailDraft] = useState({
    recipient: "",
  });
  const handleDraftChange = useCallback((draft: { recipient: string }) => {
    setMailDraft((prev) => {
      if (prev.recipient === draft.recipient) return prev;
      return { ...prev, recipient: draft.recipient };
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!chamber) {
      setAllRows(null);
      setHeaders([]);
      return () => {
        mounted = false;
      };
    }

    setAllRows(null);
    setHeaders([]);
    const path =
      chamber === "bundestag"
        ? "/BTAbgeordnete_with_bundesland.csv"
        : "/EUAbgeordnete.csv";

    (async () => {
      try {
        const r = await fetch(path);
        if (!r.ok) throw new Error(`Failed to load ${path}`);
        const text = await r.text();
        if (!mounted) return;
        const parsed = parseCSV(text);
        setHeaders(parsed.headers);
        setAllRows(parsed.rows);
      } catch (err) {
        console.error("Failed to load CSV:", err);
        setAllRows([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [chamber]);

  // Load PLZ -> Wahlkreis mapping (Bundestag only)
  useEffect(() => {
    if (chamber !== "bundestag") {
      setPlzMapping({});
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const r = await fetch('/plz_to_wahlkreis.csv');
        if (!r.ok) return;
        const text = await r.text();
        if (!mounted) return;
        const parsed = parseCSV(text);
        if (!parsed.rows || parsed.rows.length === 0) return;
        // heuristically detect column names
        const headers = parsed.headers;
        const plzKey = headers.find((h) => /plz|postleitzahl|postcode|postal/i.test(h)) ?? headers[0];
        const wkKey = headers.find((h) => /wahlkreis|wahlkreisnummer|wahlkreis_nr|wk/i.test(h)) ?? headers[1] ?? headers[0];
        const map: Record<string, string[]> = {};
        parsed.rows.forEach((row) => {
          const rawPlz = (row[plzKey] || "").toString().replace(/\s+/g, '').trim();
          const rawWk = (row[wkKey] || "").toString().trim();
          if (!rawPlz) return;
          // split possible multiple numbers inside a field
          const wks = rawWk.split(/[^0-9]+/).map((s) => s.trim()).filter(Boolean);
          if (!map[rawPlz]) map[rawPlz] = [];
          if (wks.length === 0 && rawWk) {
            const n = parseInt(rawWk, 10);
            if (!Number.isNaN(n)) {
              const nk = String(n);
              if (!map[rawPlz].includes(nk)) map[rawPlz].push(nk);
            } else {
              if (!map[rawPlz].includes(rawWk)) map[rawPlz].push(rawWk);
            }
          } else {
            wks.forEach((w) => {
              const n = parseInt(w, 10);
              const nk = Number.isNaN(n) ? w : String(n);
              if (!map[rawPlz].includes(nk)) map[rawPlz].push(nk);
            });
          }
        });
        setPlzMapping(map);
      } catch (err) {
        console.error('Failed to load PLZ mapping:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [chamber]);

  // Load DE PLZ -> lat/long mapping for nearest-Europarl lookup
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/DE_plz_latlong_dedup.csv");
        if (!r.ok) return;
        const text = await r.text();
        if (!mounted) return;
        const parsed = parseCSV(text);
        if (parsed.rows.length === 0) return;

        const plzKey =
          parsed.headers.find((h) => /^plz$/i.test(h.trim())) ?? parsed.headers[0];
        const latLongKey =
          parsed.headers.find((h) => /latlong/i.test(h.trim())) ??
          parsed.headers[1] ??
          parsed.headers[0];

        const coordMap: CoordMap = {};
        parsed.rows.forEach((row) => {
          const plz = (row[plzKey] || "").trim();
          const latLongRaw = (row[latLongKey] || "").trim();
          if (!/^\d{5}$/.test(plz) || !latLongRaw) return;
          const coord = parseLatLong(latLongRaw);
          if (!coord) return;
          coordMap[plz] = coord;
        });
        setPlzCoords(coordMap);
      } catch (err) {
        console.error("Failed to load DE PLZ coordinates:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const plzWkNumbers = useMemo(() => {
    if (chamber !== "bundestag") return null;
    const s = search.trim().replace(/\s+/g, "");
    if (!/^\d{4,5}$/.test(s)) return null;
    const wks = plzMapping[s] ?? [];
    return wks.length ? wks : [];
  }, [chamber, search, plzMapping]);

  // extractRowInfo: header-aware mapping to normalized fields
  function extractRowInfo(r: Row): RowInfo {
    const get = (keys: string[]) => {
      for (const k of keys) {
        if (!k) continue;
        // try exact key
        if (r[k] != null && String(r[k]).trim() !== '') return String(r[k]).trim();
        // try case-insensitive key
        const found = Object.keys(r).find((h) => h.toLowerCase() === k.toLowerCase());
        if (found && r[found] != null && String(r[found]).trim() !== '') return String(r[found]).trim();
      }
      return '';
    };

    const first = get(['FirstName', 'Vorname', 'first', 'firstname', 'given_name']);
    const last = get(['LastName', 'Nachname', 'last', 'lastname', 'family_name']);
    const full = get(['Name', 'FullName', 'full', 'name']) || [first, last].filter(Boolean).join(' ');
    const birthYear = get(['BirthYear', 'birthYear', 'geburtsjahr']);
    const party = get(['Partei', 'party', 'Party', 'partei']);
    const district = get(['Wahlkreis', 'district', 'Wahlkreisnummer', 'WahlkreisNummer']);
    const email = get(['Email', 'email', 'E-Mail', 'E_MAIL', 'mail']);
    const bundesland = get(['Bundesland', 'bundesland']);
    const title = get(['Title', 'title']);
    const anrede = get([
      'Anrede',
      'anrede',
      'Anrede/Geschlecht',
      'Geschlecht',
      'geschlecht',
      'gender',
    ]);
    const region = get(['zuständige bundesländer', 'zustaendige bundeslaender', 'region']);
    const city = get(['büro in deutschland stadt', 'buero in deutschland stadt', 'stadt', 'city']);
    const postalCode = get(['büro in deutschland plz', 'buero in deutschland plz', 'plz', 'postalcode']);

    return {
      first,
      last,
      full,
      birthYear,
      party,
      bundesland,
      district,
      email,
      title,
      anrede,
      region,
      city,
      postalCode,
    };
  }

  const valueForFilterField = (info: RowInfo, key: string): string => {
    switch (key) {
      case "first":
        return info.first;
      case "last":
        return info.last;
      case "full":
        return info.full;
      case "birthYear":
        return info.birthYear;
      case "party":
        return info.party;
      case "district":
        return info.district;
      case "email":
        return info.email;
      default:
        return "";
    }
  };

  // compute possible filter fields: choose fields with reasonably small unique values
  const filterableFields = useMemo(() => {
    if (!allRows || allRows.length === 0) return [] as string[];
    const normKeys =
      chamber === "europarl"
        ? ["party"]
        : ["first", "last", "full", "birthYear", "party", "district", "email"];
    const fields: string[] = [];
    normKeys.forEach((k) => {
      const set = new Set(
        allRows
          .map((r) => valueForFilterField(extractRowInfo(r), k))
          .filter(Boolean)
      );
      if (set.size > 0 && set.size <= 40) fields.push(k);
    });
    return fields;
  }, [allRows, chamber]);

  const uniqueValues = useMemo(() => {
    const res: Record<string, string[]> = {};
    if (!allRows) return res;
    filterableFields.forEach((f) => {
      const set = new Set(
        allRows
          .map((r) => valueForFilterField(extractRowInfo(r), f))
          .filter(Boolean)
      );
      res[f] = Array.from(set).sort();
    });
    return res;
  }, [allRows, filterableFields]);

  const normalizedSearch = search.trim().replace(/\s+/g, "");
  const isEuroparlPlzSearch =
    chamber === "europarl" && /^\d{5}$/.test(normalizedSearch);

  const nearestEuroparl = useMemo(() => {
    const empty = {
      rows: [] as Row[],
      distanceByRow: new Map<Row, number>(),
      inputPlzFound: true,
    };
    if (!allRows || !isEuroparlPlzSearch) return empty;

    const origin = plzCoords[normalizedSearch];
    if (!origin) return { ...empty, inputPlzFound: false };

    const candidates: Array<{ row: Row; distanceKm: number }> = [];
    allRows.forEach((r) => {
      const info = extractRowInfo(r);
      if (!/^\d{5}$/.test(info.postalCode)) return;
      const target = plzCoords[info.postalCode];
      if (!target) return;
      candidates.push({ row: r, distanceKm: haversineKm(origin, target) });
    });

    candidates.sort((a, b) => a.distanceKm - b.distanceKm);
    const top = candidates.slice(0, 5);
    return {
      rows: top.map((t) => t.row),
      distanceByRow: new Map(top.map((t) => [t.row, t.distanceKm] as const)),
      inputPlzFound: true,
    };
  }, [allRows, isEuroparlPlzSearch, normalizedSearch, plzCoords]);

  const filtered = useMemo(() => {
    if (!allRows) return [] as Row[];
    const numericPlz = chamber === "bundestag" && /^\d{4,5}$/.test(normalizedSearch);
    const q = search.trim().toLowerCase();

    if (isEuroparlPlzSearch) {
      if (!nearestEuroparl.inputPlzFound) return [];
      return nearestEuroparl.rows;
    }

    // If user entered a numeric PLZ but we have no matching wk numbers,
    // return empty result set immediately.
    if (numericPlz && Array.isArray(plzWkNumbers) && plzWkNumbers.length === 0) return [] as Row[];

    return allRows.filter((r) => {
      const info = extractRowInfo(r);
      // filters (based on normalized fields)
      for (const k of Object.keys(filters)) {
        if (!filters[k]) continue;
        const val = valueForFilterField(info, k);
        if (val !== filters[k]) return false;
      }

      // PLZ-based filter using mapped Wahlkreis numbers
      if (plzWkNumbers && plzWkNumbers.length > 0) {
        const d = info.district.toString();
        const wkRaw = d.match(/\d+/)?.[0] ?? d;
        const wk = Number.isNaN(parseInt(wkRaw, 10)) ? wkRaw : String(parseInt(wkRaw, 10));
        if (!plzWkNumbers.includes(wk)) return false;
      }

      // If this is a numeric PLZ search, we've already applied the PLZ-based
      // filtering above; include the row (it passed the PLZ check).
      if (numericPlz) return true;

      if (!q) return true;

      for (const val of Object.values(info)) {
        if (!val) continue;
        if (val.toLowerCase().includes(q)) return true;
      }

      if (headers.length > 0) {
        for (const h of headers) {
          if ((r[h] || "").toLowerCase().includes(q)) return true;
        }
      }

      return false;
    });
  }, [
    allRows,
    search,
    filters,
    headers,
    plzWkNumbers,
    chamber,
    isEuroparlPlzSearch,
    nearestEuroparl,
    normalizedSearch,
  ]);

  const displayLabel = (r: Row) => {
    const info = extractRowInfo(r);
    return info.first ? `${info.first} ${info.last}` : info.full;
  };

  const partyColor = (p?: string) => {
    if (!p) return "#9CA3AF"; // gray
    const up = p.toUpperCase();
    if (up.includes("SPD")) return "#EF4444"; // red
    if (up.includes("CDU")) return "#111827"; // nearly black
    if (up.includes("CSU")) return "#1E40AF"; // blue
    if (up.includes("GRUENE") || up.includes("GRÜNE") || up.includes("GRU")) return "#16A34A"; // green
    if (up.includes("FDP")) return "#FBBF24"; // yellow
    if (up.includes("LINKE") || up.includes("DIE LINKE")) return "#DC2626"; // red
    if (up.includes("BSW")) return "#7C3AED"; // purple
    if (up.includes("VOLT")) return "#5B21B6"; // violet
    if (up.includes("FREIE W")) return "#F97316"; // orange
    if (up.includes("PARTEI")) return "#DC2626"; // dark red
    if (up.includes("TIERSCHUTZ")) return "#10B981"; // green
    if (up.includes("FAMILIEN")) return "#EA580C"; // orange
    if (up.includes("ÖDP") || up.includes("OEDP")) return "#D97706"; // amber
    if (up.includes("FORTSCHRITT")) return "#2563EB"; // blue
    if (up.includes("SSW")) return "#0EA5A4"; // teal
    return "#9CA3AF";
  };

  const labelForField = (f: string) => {
    switch (f) {
      case "first":
        return "Vorname";
      case "last":
        return "Nachname";
      case "full":
        return "Name";
      case "birthYear":
        return "Geburtsjahr";
      case "party":
        return "Parteien";
      case "district":
        return "Wahlkreis";
      case "email":
        return "E‑Mail";
      default:
        return f;
    }
  };

  // bundesland support removed
  const selectedInfo = selected ? extractRowInfo(selected) : null;
  const stepItems = [
    "Parlament",
    "Person",
    "Dein Name",
    "Mail",
  ];
  const WIZARD_STEP_KEY = "__contactWizardStep";

  const pushStepToHistory = useCallback((nextStep: WizardStep) => {
    const currentState =
      typeof window.history.state === "object" && window.history.state !== null
        ? window.history.state
        : {};
    window.history.pushState({ ...currentState, [WIZARD_STEP_KEY]: nextStep }, "");
  }, []);

  useEffect(() => {
    const currentState =
      typeof window.history.state === "object" && window.history.state !== null
        ? window.history.state
        : {};
    window.history.replaceState({ ...currentState, [WIZARD_STEP_KEY]: 1 }, "");

    const handlePopState = (event: PopStateEvent) => {
      const nextStep = event.state?.[WIZARD_STEP_KEY];
      if (typeof nextStep === "number" && nextStep >= 1 && nextStep <= 4) {
        setStep(nextStep as WizardStep);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const canGoToStep = (targetStep: number) => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return chamber !== null;
    if (targetStep === 3) return chamber !== null && !!selected;
    if (targetStep === 4) return chamber !== null && !!selected && !!senderName.trim();
    return false;
  };
  const goToStep = (targetStep: number, options?: { ignoreGuards?: boolean }) => {
    if (!options?.ignoreGuards && !canGoToStep(targetStep)) return;
    if (targetStep === step) return;
    const nextStep = targetStep as WizardStep;
    pushStepToHistory(nextStep);
    setStep(nextStep);
  };

  return (
    <div className="w-full">
      <div className="space-y-3">
        <div className="flex gap-1 overflow-x-auto whitespace-nowrap pb-1" aria-label="Fortschritt">
          {stepItems.map((label, idx) => {
            const stepNumber = idx + 1;
            const isActive = stepNumber === step;
            const isCompleted = stepNumber < step;
            return (
              <button
                key={label}
                type="button"
                onClick={() => goToStep(stepNumber)}
                disabled={!canGoToStep(stepNumber)}
                className={`shrink-0 inline-flex items-center gap-1 border px-2 py-1 text-[10px] md:text-xs font-section tracking-wide ${
                  isActive
                    ? "btn-orange !text-black border-transparent"
                    : isCompleted
                    ? "border-orange-300 bg-orange-50 text-pause-black"
                    : "border-gray-200 bg-white text-gray-500"
                } ${canGoToStep(stepNumber) ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                    isActive
                      ? "bg-white/40 text-black"
                    : isCompleted
                      ? "bg-orange-200 text-pause-black"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {stepNumber}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {step === 1 && (
          <div className="bg-white border border-[#1a1a1a] shadow-sm p-4 space-y-3">
            <div className="text-sm font-semibold">1. Parlament auswählen</div>
            <div className="grid gap-2 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilters({});
                  setSelected(null);
                  setClickedIndex(null);
                  setSenderName("");
                  setMailDraft({ recipient: "" });
                  onSelect?.(null);
                  setChamber("bundestag");
                  goToStep(2, { ignoreGuards: true });
                }}
                className={`px-3 py-3 border text-left text-sm cursor-pointer hover:bg-gray-50 ${
                  chamber === "bundestag" ? "border-orange-400 bg-orange-50" : "border-gray-200"
                }`}
              >
                Mitglied des Bundestages
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilters({});
                  setChamber("europarl");
                  setSelected(null);
                  setClickedIndex(null);
                  setSenderName("");
                  setMailDraft({ recipient: "" });
                  onSelect?.(null);
                  goToStep(2, { ignoreGuards: true });
                }}
                className={`px-3 py-3 border text-left text-sm cursor-pointer hover:bg-gray-50 ${
                  chamber === "europarl" ? "border-orange-400 bg-orange-50" : "border-gray-200"
                }`}
              >
                Mitglied des Europarlaments
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border border-[#1a1a1a] shadow-sm p-4">
            <div className="text-sm font-semibold mb-3">2. Abgeordneten auswählen</div>
            {!allRows ? (
              <div>Lade Abgeordnete…</div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      chamber === "europarl"
                        ? "Suche nach Name, Partei, PLZ, Stadt oder Bundesland..."
                        : "Suche nach Name, Partei, PLZ, Stadt..."
                    }
                    className="flex-1 px-3 py-2 border border-gray-200"
                  />
                </div>

                {chamber === "europarl" && isEuroparlPlzSearch && (
                  <div className="text-xs text-gray-600">
                    {nearestEuroparl.inputPlzFound
                      ? "Nächste 5 Büros von Mitgliedern des Europarlaments zu dieser PLZ."
                      : "PLZ nicht gefunden."}
                  </div>
                )}

                {filterableFields.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {filterableFields.map((f) => (
                      <select
                        key={f}
                        value={filters[f] ?? ""}
                        onChange={(e) => setFilters((s) => ({ ...s, [f]: e.target.value }))}
                        className="px-3 py-2 border border-gray-200 text-sm cursor-pointer"
                      >
                        <option value="">Alle {labelForField(f)}</option>
                        {uniqueValues[f]?.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                )}

                <div className="max-h-64 overflow-auto border border-gray-200 bg-white">
                  {filtered.length === 0 ? (
                    <div className="p-3 text-sm text-gray-600">
                      {chamber === "europarl" && isEuroparlPlzSearch && !nearestEuroparl.inputPlzFound
                        ? "PLZ nicht gefunden."
                        : "Keine Einträge gefunden."}
                    </div>
                  ) : (
                    <ul>
                      {filtered.slice(0, 200).map((r, idx) => {
                        const info = extractRowInfo(r);
                        return (
                          <li
                            key={idx}
                            className={`px-3 py-2 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-transform duration-150 ${
                              selected === r ? "bg-orange-50" : ""
                            }`}
                            style={
                              clickedIndex === idx
                                ? { transform: "scale(0.99)", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", transition: "transform 120ms ease, box-shadow 120ms ease" }
                                : { transition: "transform 120ms ease, box-shadow 120ms ease" }
                            }
                            onClick={() => {
                              setSelected(r);
                              onSelect?.(r);
                              setMailDraft((prev) => ({ ...prev, recipient: info.email || "" }));
                              goToStep(3, { ignoreGuards: true });
                              setClickedIndex(idx);
                              window.setTimeout(() => setClickedIndex((cur) => (cur === idx ? null : cur)), 120);
                            }}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium">{info.full}</div>
                                {info.party && (
                                  <div className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded flex items-center gap-2">
                                    <span
                                      className="inline-block rounded-full"
                                      style={{ backgroundColor: partyColor(info.party), width: 6, height: 6 }}
                                      aria-hidden
                                    />
                                    <span>{info.party}</span>
                                  </div>
                                )}
                              </div>
                              {chamber === "europarl" && (
                                <div className="text-xs text-gray-600 mt-1">
                                  {[info.region, info.city ? `Büro in ${info.city}` : ""]
                                    .filter(Boolean)
                                    .join(" • ")}
                                  {nearestEuroparl.distanceByRow.has(r) && (
                                    <span className="ml-2">
                                      ({nearestEuroparl.distanceByRow.get(r)!.toFixed(1)} km)
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-sm cursor-pointer"
                  >
                    Zurück
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="bg-white border border-[#1a1a1a] shadow-sm p-4 space-y-4">
            <div>
              <div className="text-sm font-semibold mb-3">3. Deinen Namen eingeben</div>
              {selectedInfo && (
                <div className="text-xs text-gray-600 mb-3">
                  Ausgewählt: <span className="font-medium text-gray-800">{displayLabel(selected!)}</span>
                </div>
              )}
              <input
                type="text"
                id="senderName"
                name="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Dein Name"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-sm cursor-pointer"
              >
                Zurück
              </button>
              <button
                type="button"
                onClick={() => goToStep(4)}
                disabled={!senderName.trim() || !selected}
                className="px-3 py-2 btn-orange !text-black text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Weiter zur Mail
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white border border-[#1a1a1a] shadow-sm p-4 space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold">4. Mail bearbeiten und senden</div>
            </div>

            {selected && selectedInfo ? (
              <EmailTemplateViewer
                initialRecipientName={selectedInfo.last || selectedInfo.full}
                initialRecipientEmail={mailDraft.recipient || selectedInfo.email}
                initialRecipientTitle={selectedInfo.title}
                initialRecipientAnrede={selectedInfo.anrede}
                initialSenderName={senderName}
                onDraftChange={handleDraftChange}
              />
            ) : (
              <div className="text-sm text-gray-600">Bitte zuerst eine Person in der Liste auswählen.</div>
            )}

            <button
              type="button"
              onClick={() => goToStep(3)}
              className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-sm cursor-pointer"
            >
              Zurück
            </button>
          </div>
        )}

        {step > 2 && !selected && (
          <div className="text-sm text-gray-600">
            Bitte zuerst eine Person auswählen.
          </div>
        )}
      </div>
    </div>
  );
}
