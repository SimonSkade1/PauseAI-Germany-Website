"use client";

import React, { useEffect, useMemo, useState } from "react";
import EmailTemplateViewer from "./EmailTemplateViewer";

type Row = Record<string, string>;

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

  useEffect(() => {
    let mounted = true;
    fetch("/BTAbgeordnete.csv")
      .then((r) => r.text())
      .then((text) => {
        if (!mounted) return;
        const parsed = parseCSV(text);
        // Treat CSV as headerless: create generic column keys (col0, col1, ...)
        const colCount = parsed.headers.length;
        const finalHeaders = Array.from({ length: colCount }, (_, i) => `col${i}`);
        // The parser returned the first line as `headers`, so include it as the first row.
        const firstRowArray = parsed.headers.slice();
        const otherRowsArrays = parsed.rows.map((r) => parsed.headers.map((h) => r[h] ?? ""));
        const allArrays = [firstRowArray, ...otherRowsArrays];
        const finalRows = allArrays.map((arr) => {
          const obj: Row = {};
          finalHeaders.forEach((hh, i) => {
            obj[hh] = arr[i] ?? "";
          });
          return obj;
        });

        setHeaders(finalHeaders);
        setAllRows(finalRows);
        // default random selection
        if (finalRows.length) {
          const rand = finalRows[Math.floor(Math.random() * finalRows.length)];
          setSelected(rand);
          onSelect?.(rand);
        }
      })
      .catch((err) => {
        console.error("Failed to load CSV:", err);
        setAllRows([]);
      });
    return () => {
      mounted = false;
    };
  }, [onSelect]);

  // compute possible filter fields: choose fields with reasonably small unique values
  const filterableFields = useMemo(() => {
    if (!allRows) return [] as string[];
    // Use normalized fields (from extractRowInfo) for filtering instead of raw columns
    const sample = allRows[0];
    if (!sample) return [] as string[];
    const normKeys = ["first", "last", "full", "birthYear", "party", "district", "bundesland", "email"];
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

  // extractRowInfo moved up so filtering can use it safely
  function extractRowInfo(r: Row) {
    const raw = (r[headers[0]] || "").toString().trim();

    let first = (r[headers[1]] ?? "").toString().trim();
    let last = (r[headers[0]] ?? "").toString().trim();
    let full = "";
    if (first && last) {
      full = [first, last].filter(Boolean).join(" ");
    }

    const birthYear = (r[headers[2]] ?? "").toString().trim();
    const party = (r[headers[3]] ?? "").toString().trim();
    const district = (r[headers[4]] ?? "").toString().trim();
    const email = (r[headers[5]] ?? "").toString().trim();

    let bundesland = (r[headers[6]] ?? "").toString().trim();

    return {
      first,
      last,
      full,
      birthYear,
      party,
      bundesland,
      district,
      email,
    };
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
    const q = search.trim().toLowerCase();
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
  }, [allRows, search, filters, headers]);

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
      case "bundesland":
        return "Bundesländer";
      case "email":
        return "E‑Mail";
      default:
        return f;
    }
  };

  // Map German Bundesland names to Wikimedia Commons SVG URLs (hotlinked).
  const bundeslandWappen: Record<string, string> = {
    "Berlin": "https://upload.wikimedia.org/wikipedia/commons/8/8c/DEU_Berlin_COA.svg",
    "Nordrhein-Westfalen": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Coat_of_arms_of_North_Rhine-Westphalia.svg",
    "Schleswig-Holstein": "https://upload.wikimedia.org/wikipedia/commons/6/60/Coat_of_arms_of_Schleswig-Holstein.svg",
    "Thüringen": "https://upload.wikimedia.org/wikipedia/commons/0/08/Coat_of_arms_of_Thuringia.svg",
    "Bayern": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Coat_of_arms_of_Bavaria.svg",
    "Hessen": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Coat_of_arms_of_Hesse.svg",
    "Hamburg": "https://upload.wikimedia.org/wikipedia/commons/5/5d/DEU_Hamburg_COA.svg",
    "Sachsen": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Coat_of_arms_of_Saxony.svg",
    "Niedersachsen": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Coat_of_arms_of_Lower_Saxony.svg",
    "Rheinland-Pfalz": "https://upload.wikimedia.org/wikipedia/commons/8/89/Coat_of_arms_of_Rhineland-Palatinate.svg",
    "Baden-Württemberg": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Lesser_coat_of_arms_of_Baden-W%C3%BCrttemberg.svg",
    "Mecklenburg-Vorpommern": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Coat_of_arms_of_Mecklenburg-Western_Pomerania_%28small%29.svg",
    "Saarland": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Wappen_des_Saarlands.svg",
    "Brandenburg": "https://upload.wikimedia.org/wikipedia/commons/a/a2/DEU_Brandenburg_COA.svg",
  };

  const getBundeslandWappen = (land?: string) => {
    if (!land) return undefined;
    return bundeslandWappen[land] ?? undefined;
  };

  return (
    <div className="w-full">
  <label className="block text-sm font-section mb-2 text-pause-black">Abgeordneten wählen</label>
      {!allRows ? (
        <div className="p-4 bg-white rounded">Lade Abgeordnete…</div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche nach Name, Partei, Ort, ..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                // random select
                if (!allRows || allRows.length === 0) return;
                const rand = allRows[Math.floor(Math.random() * allRows.length)];
                setSelected(rand);
                onSelect?.(rand);
              }}
              className="px-3 cursor-pointer py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50 flex items-center gap-2"
              title="Zufälligen Abgeordneten wählen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-black-600" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="3" ry="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="8.5" cy="8.5" r="0.9" fill="currentColor" />
                <circle cx="15.5" cy="8.5" r="0.9" fill="currentColor" />
                <circle cx="8.5" cy="15.5" r="0.9" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="0.9" fill="currentColor" />
              </svg>
              <span>Zufall</span>
            </button>
          </div>

          {filterableFields.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {filterableFields.map((f) => (
                <select
                  key={f}
                  value={filters[f] ?? ""}
                  onChange={(e) => setFilters((s) => ({ ...s, [f]: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-md text-sm"
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

          <div className="max-h-64 overflow-auto border border-gray-200 rounded-md bg-white">
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
                      className={`px-3 py-2 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${selected === r ? "bg-gray-100" : ""}`}
                      onClick={() => {
                        setSelected(r);
                        onSelect?.(r);
                      }}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">
                             {info.full}
                          </div>
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
                          {info.bundesland && (
                            <div className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded flex items-center gap-2">
                              {getBundeslandWappen(info.bundesland) ? (
                                <img src={getBundeslandWappen(info.bundesland)} alt={`${info.bundesland} Wappen`} className="w-3 h-3 object-contain rounded-sm" />
                              ) : (
                                <span className="w-4 h-4 inline-flex items-center justify-center bg-gray-200 text-[10px] rounded-sm">{(info.bundesland || "").split("-")[0]?.slice(0,2)}</span>
                              )}
                              <span>{info.bundesland}</span>
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

          {selected && (
            <div className="">
              {/* Embedded email template editor/preview prefilled with selected recipient */}
              <div className="">
                {(() => {
                  const info = extractRowInfo(selected);
                  return (
                    <EmailTemplateViewer
                      initialRecipientName={info.last}
                      initialRecipientEmail={info.email}
                    />
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
