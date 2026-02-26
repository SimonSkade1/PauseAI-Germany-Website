"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import EmailTemplateViewer from "./EmailTemplateViewer";

type Row = Record<string, string>;
type WizardStep = 1 | 2 | 3 | 4;
type Chamber = "bundestag" | "europarl";

function parseCSV(text: string): { headers: string[]; rows: Row[] } {
  // Basic CSV parser that handles quoted fields with commas and newlines.
  const rows: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      // peek ahead for escaped quote
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++; // skip escaped
      } else {
        inQuotes = !inQuotes;
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
  const [plzWkNumbers, setPlzWkNumbers] = useState<string[] | null>(null);
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
    // Prefer processed CSV with headers, fallback to raw CSV
    (async () => {
      try {
        const tryPaths = ['/BTAbgeordnete_with_bundesland.csv', '/BTAbgeordnete.csv'];
        for (const p of tryPaths) {
          const r = await fetch(p);
          if (!r.ok) continue;
          const text = await r.text();
          if (!mounted) return;
          const parsed = parseCSV(text);
          // parsed.headers are real headers; parsed.rows are objects keyed by header
          setHeaders(parsed.headers);
          setAllRows(parsed.rows);
          break;
        }
      } catch (err) {
        console.error('Failed to load CSV:', err);
        setAllRows([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [onSelect]);

  // Load PLZ -> Wahlkreis mapping (public CSV)
  useEffect(() => {
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
  }, []);

  // Treat a numeric 4-5 digit `search` as a PLZ lookup and set matching Wahlkreis numbers.
  useEffect(() => {
    const s = search.trim().replace(/\s+/g, '');
    if (/^\d{4,5}$/.test(s)) {
      const wks = plzMapping[s] ?? [];
      setPlzWkNumbers(wks.length ? wks : []);
    } else {
      setPlzWkNumbers(null);
    }
  }, [search, plzMapping]);

  // compute possible filter fields: choose fields with reasonably small unique values
  const filterableFields = useMemo(() => {
    if (!allRows) return [] as string[];
    // Use normalized fields (from extractRowInfo) for filtering instead of raw columns
    const sample = allRows[0];
    if (!sample) return [] as string[];
    const normKeys = ["first", "last", "full", "birthYear", "party", "district", "email"];
    const fields: string[] = [];
    normKeys.forEach((k) => {
      const set = new Set(allRows.map((r) => {
        try {
          return (extractRowInfo(r) as any)[k] || "";
        } catch (err) {
          return "";
        }
      }).filter(Boolean));
      if (set.size > 0 && set.size <= 40) fields.push(k);
    });
    return fields;
  }, [allRows, headers]);

  // extractRowInfo: header-aware mapping to normalized fields
  function extractRowInfo(r: Row) {
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
    const party = get(['Partei', 'party', 'Party']);
    const district = get(['Wahlkreis', 'district', 'Wahlkreisnummer', 'WahlkreisNummer']);
    const email = get(['Email', 'email', 'E-Mail', 'E_MAIL']);
    const bundesland = get(['Bundesland', 'bundesland']);
    const title = get(['Title', 'title']);
    const anrede = get(['Anrede', 'anrede', 'Anrede/Geschlecht', 'Geschlecht']);

    return { first, last, full, birthYear, party, bundesland, district, email, title, anrede };
  }

  const uniqueValues = useMemo(() => {
    const res: Record<string, string[]> = {};
    if (!allRows) return res;
    // Build unique values from normalized fields using extractRowInfo
    filterableFields.forEach((f) => {
      const set = new Set(allRows.map((r) => {
        try {
          return (extractRowInfo(r) as any)[f] || "";
        } catch (err) {
          return "";
        }
      }).filter(Boolean));
      res[f] = Array.from(set).sort();
    });
    return res;
  }, [allRows, filterableFields]);

  const filtered = useMemo(() => {
    if (!allRows) return [] as Row[];
    const rawSearch = search.trim().replace(/\s+/g, '');
    const numericPlz = /^\d{4,5}$/.test(rawSearch);
    const q = search.trim().toLowerCase();

    // If user entered a numeric PLZ but we have no matching wk numbers,
    // return empty result set immediately.
    if (numericPlz && Array.isArray(plzWkNumbers) && plzWkNumbers.length === 0) return [] as Row[];

    return allRows.filter((r) => {
      // filters (based on normalized fields)
      for (const k of Object.keys(filters)) {
        if (!filters[k]) continue;
        try {
          const val = (extractRowInfo(r) as any)[k] || "";
          if (val !== filters[k]) return false;
        } catch (err) {
          // fallback to raw field check
          if ((r[k] || "") !== filters[k]) return false;
        }
      }

      // PLZ-based filter using mapped Wahlkreis numbers
      if (plzWkNumbers && plzWkNumbers.length > 0) {
        try {
          const info = extractRowInfo(r);
          const d = (info.district || "").toString();
          const wkRaw = d.match(/\d+/)?.[0] ?? d;
          const wk = Number.isNaN(parseInt(wkRaw, 10)) ? wkRaw : String(parseInt(wkRaw, 10));
          if (!plzWkNumbers.includes(wk)) return false;
        } catch (err) {
          // fallback to raw header lookup
          const rawHdr = headers.find((h) => /wahlkreis|district|wahlkreisnummer/i.test(h));
          const rawVal = rawHdr ? (r[rawHdr] || "") : "";
          const wkRaw = rawVal.toString().match(/\d+/)?.[0] ?? rawVal.toString();
          const wk = Number.isNaN(parseInt(wkRaw, 10)) ? wkRaw : String(parseInt(wkRaw, 10));
          if (!plzWkNumbers.includes(wk)) return false;
        }
      }

      // If this is a numeric PLZ search, we've already applied the PLZ-based
      // filtering above; include the row (it passed the PLZ check).
      if (numericPlz) return true;

      if (!q) return true;

      // Use extractRowInfo to get normalized fields and search across them.
      try {
        const info = extractRowInfo(r);
        for (const val of Object.values(info)) {
          if (!val) continue;
          if ((val as string).toString().toLowerCase().includes(q)) return true;
        }
      } catch (err) {
        // fallback to raw search across columns
        for (const h of headers) {
          if ((r[h] || "").toLowerCase().includes(q)) return true;
        }
      }

      return false;
    });
  }, [allRows, search, filters, headers, plzWkNumbers]);

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
    if (up.includes("LINKE") || up.includes("DIE LINKE")) return "#7C3AED"; // purple
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

  return (
    <div className="w-full">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2" aria-label="Fortschritt">
          {stepItems.map((label, idx) => {
            const stepNumber = idx + 1;
            const isActive = stepNumber === step;
            const isCompleted = stepNumber < step;
            return (
              <div
                key={label}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  isActive
                    ? "border-orange-400 bg-orange-500 text-white"
                    : isCompleted
                    ? "border-orange-200 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isCompleted
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </span>
                <span>{label}</span>
              </div>
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
                  setChamber("bundestag");
                  setStep(2);
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
                  setChamber("europarl");
                  setSelected(null);
                  onSelect?.(null);
                  setStep(2);
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
            {chamber === "europarl" ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-700">
                  Die Auswahl für Mitglieder des Europarlaments ist noch nicht verfügbar.
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-sm cursor-pointer"
                >
                  Zurück
                </button>
              </div>
            ) : !allRows ? (
              <div>Lade Abgeordnete…</div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Suche nach Name, Partei, PLZ, Stadt..."
                    className="flex-1 px-3 py-2 border border-gray-200"
                  />
                </div>

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
                    <div className="p-3 text-sm text-gray-600">Keine Einträge gefunden.</div>
                  ) : (
                    <ul>
                      {filtered.slice(0, 200).map((r, idx) => {
                        const info = extractRowInfo(r);
                        const email = info.email || (r[headers.find((h) => /email/i.test(h)) ?? ""] || "").trim();
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
                              setStep(3);
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
                              {email && <div className="text-xs text-gray-600 mt-0.5">{email}</div>}
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
                    onClick={() => setStep(1)}
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
                onClick={() => setStep(2)}
                className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-sm cursor-pointer"
              >
                Zurück
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
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
              onClick={() => setStep(3)}
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
