"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import EmailTemplateViewer from "./EmailTemplateViewer";
import {
  bundestagSubtitle,
  CSV_PATH_BY_CHAMBER,
  displayNameWithoutTitle,
  europarlSubtitle,
  extractRowInfo,
  FILTER_FIELDS_BY_CHAMBER,
  haversineKm,
  labelForField,
  parseCSV,
  parseLatLong,
  partyColor,
  STEP_ITEMS,
  valueForFilterField,
  WIZARD_STEP_KEY,
  type Chamber,
  type CoordMap,
  type Row,
  type RowWithInfo,
  type WizardStep,
} from "./abgeordneteSelectHelpers";

type MailDraft = { recipient: string };

export default function AbgeordneteSelect({
  onSelect,
}: {
  onSelect?: (row: Row | null) => void;
}) {
  const [allRows, setAllRows] = useState<Row[] | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<RowWithInfo | null>(null);
  const [plzMapping, setPlzMapping] = useState<Record<string, string[]>>({});
  const [plzCoords, setPlzCoords] = useState<CoordMap>({});
  const [senderName, setSenderName] = useState("");
  const [step, setStep] = useState<WizardStep>(1);
  const [chamber, setChamber] = useState<Chamber | null>(null);
  const [mailDraft, setMailDraft] = useState<MailDraft>({ recipient: "" });

  const handleDraftChange = useCallback((draft: MailDraft) => {
    setMailDraft((prev) => {
      if (prev.recipient === draft.recipient) return prev;
      return { ...prev, recipient: draft.recipient };
    });
  }, []);

  const rowsWithInfo = useMemo<RowWithInfo[]>(() => {
    if (!allRows) return [];
    return allRows.map((row) => ({ row, info: extractRowInfo(row) }));
  }, [allRows]);

  useEffect(() => {
    let mounted = true;
    if (!chamber) {
      setAllRows(null);
      return () => {
        mounted = false;
      };
    }

    setAllRows(null);
    const path = CSV_PATH_BY_CHAMBER[chamber];

    (async () => {
      try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        const text = await response.text();
        if (!mounted) return;
        const parsed = parseCSV(text);
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
        const response = await fetch("/plz_to_wahlkreis.csv");
        if (!response.ok) return;
        const text = await response.text();
        if (!mounted) return;

        const parsed = parseCSV(text);
        if (!parsed.rows.length) return;

        const plzKey = parsed.headers.find((h) => /plz|postleitzahl|postcode|postal/i.test(h)) ?? parsed.headers[0];
        const wkKey =
          parsed.headers.find((h) => /wahlkreis|wahlkreisnummer|wahlkreis_nr|wk/i.test(h)) ??
          parsed.headers[1] ??
          parsed.headers[0];

        const map: Record<string, string[]> = {};
        parsed.rows.forEach((row) => {
          const rawPlz = (row[plzKey] || "").replace(/\s+/g, "").trim();
          const rawWk = (row[wkKey] || "").trim();
          if (!rawPlz) return;

          const extractedWk = rawWk
            .split(/[^0-9]+/)
            .map((s) => s.trim())
            .filter(Boolean);

          if (!map[rawPlz]) map[rawPlz] = [];

          if (extractedWk.length === 0 && rawWk) {
            const parsedWk = Number.parseInt(rawWk, 10);
            const wk = Number.isNaN(parsedWk) ? rawWk : String(parsedWk);
            if (!map[rawPlz].includes(wk)) map[rawPlz].push(wk);
            return;
          }

          extractedWk.forEach((wkValue) => {
            const parsedWk = Number.parseInt(wkValue, 10);
            const wk = Number.isNaN(parsedWk) ? wkValue : String(parsedWk);
            if (!map[rawPlz].includes(wk)) map[rawPlz].push(wk);
          });
        });

        setPlzMapping(map);
      } catch (err) {
        console.error("Failed to load PLZ mapping:", err);
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
        const response = await fetch("/DE_plz_latlong_dedup.csv");
        if (!response.ok) return;
        const text = await response.text();
        if (!mounted) return;

        const parsed = parseCSV(text);
        if (!parsed.rows.length) return;

        const plzKey = parsed.headers.find((h) => /^plz$/i.test(h.trim())) ?? parsed.headers[0];
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
    const value = search.trim().replace(/\s+/g, "");
    if (!/^\d{4,5}$/.test(value)) return null;
    const wahlkreise = plzMapping[value] ?? [];
    return wahlkreise.length ? wahlkreise : [];
  }, [chamber, search, plzMapping]);

  const filterableFields = useMemo(() => {
    if (!rowsWithInfo.length || !chamber) return [] as string[];

    const fields: string[] = [];
    FILTER_FIELDS_BY_CHAMBER[chamber].forEach((key) => {
      const values = new Set(rowsWithInfo.map(({ info }) => valueForFilterField(info, key)).filter(Boolean));
      if (values.size > 0 && values.size <= 40) fields.push(key);
    });

    return fields;
  }, [rowsWithInfo, chamber]);

  const uniqueValues = useMemo(() => {
    const result: Record<string, string[]> = {};
    filterableFields.forEach((field) => {
      const values = new Set(rowsWithInfo.map(({ info }) => valueForFilterField(info, field)).filter(Boolean));
      result[field] = Array.from(values).sort();
    });
    return result;
  }, [rowsWithInfo, filterableFields]);

  const normalizedSearch = search.trim().replace(/\s+/g, "");
  const isEuroparlPlzSearch = chamber === "europarl" && /^\d{5}$/.test(normalizedSearch);

  const nearestEuroparl = useMemo(() => {
    const empty = {
      rows: [] as RowWithInfo[],
      distanceByRow: new Map<Row, number>(),
      inputPlzFound: true,
    };

    if (!rowsWithInfo.length || !isEuroparlPlzSearch) return empty;

    const origin = plzCoords[normalizedSearch];
    if (!origin) return { ...empty, inputPlzFound: false };

    const candidates: Array<{ item: RowWithInfo; distanceKm: number }> = [];
    rowsWithInfo.forEach((item) => {
      if (!/^\d{5}$/.test(item.info.postalCode)) return;
      const target = plzCoords[item.info.postalCode];
      if (!target) return;
      candidates.push({ item, distanceKm: haversineKm(origin, target) });
    });

    candidates.sort((a, b) => a.distanceKm - b.distanceKm);
    const top = candidates.slice(0, 5);

    return {
      rows: top.map((entry) => entry.item),
      distanceByRow: new Map(top.map((entry) => [entry.item.row, entry.distanceKm] as const)),
      inputPlzFound: true,
    };
  }, [rowsWithInfo, isEuroparlPlzSearch, normalizedSearch, plzCoords]);

  const filtered = useMemo(() => {
    if (!rowsWithInfo.length) return [] as RowWithInfo[];

    const numericPlzSearch = chamber === "bundestag" && /^\d{4,5}$/.test(normalizedSearch);
    const query = search.trim().toLowerCase();

    if (isEuroparlPlzSearch) {
      if (!nearestEuroparl.inputPlzFound) return [];
      return nearestEuroparl.rows;
    }

    if (numericPlzSearch && Array.isArray(plzWkNumbers) && plzWkNumbers.length === 0) {
      return [];
    }

    return rowsWithInfo.filter((item) => {
      const { row, info } = item;

      for (const key of Object.keys(filters)) {
        const filterValue = filters[key];
        if (!filterValue) continue;
        if (valueForFilterField(info, key) !== filterValue) return false;
      }

      if (plzWkNumbers && plzWkNumbers.length > 0) {
        const wkRaw = info.district.match(/\d+/)?.[0] ?? info.district;
        const wkNum = Number.parseInt(wkRaw, 10);
        const wk = Number.isNaN(wkNum) ? wkRaw : String(wkNum);
        if (!plzWkNumbers.includes(wk)) return false;
      }

      if (numericPlzSearch) return true;
      if (!query) return true;

      const infoMatches = Object.values(info).some((value) => value && value.toLowerCase().includes(query));
      if (infoMatches) return true;

      return Object.values(row).some((value) => value && value.toLowerCase().includes(query));
    });
  }, [
    rowsWithInfo,
    chamber,
    normalizedSearch,
    search,
    isEuroparlPlzSearch,
    nearestEuroparl,
    plzWkNumbers,
    filters,
  ]);

  const selectedInfo = selected?.info ?? null;

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

  const canGoToStep = useCallback(
    (targetStep: number) => {
      if (targetStep === 1) return true;
      if (targetStep === 2) return chamber !== null;
      if (targetStep === 3) return chamber !== null && !!selected;
      if (targetStep === 4) return chamber !== null && !!selected && !!senderName.trim();
      return false;
    },
    [chamber, selected, senderName],
  );

  const goToStep = useCallback(
    (targetStep: number, options?: { ignoreGuards?: boolean }) => {
      if (!options?.ignoreGuards && !canGoToStep(targetStep)) return;
      if (targetStep === step) return;
      const nextStep = targetStep as WizardStep;
      pushStepToHistory(nextStep);
      setStep(nextStep);
    },
    [canGoToStep, pushStepToHistory, step],
  );

  const resetForChamberSwitch = useCallback(() => {
    setSearch("");
    setFilters({});
    setSelected(null);
    setSenderName("");
    setMailDraft({ recipient: "" });
    onSelect?.(null);
  }, [onSelect]);

  const handleChooseChamber = useCallback(
    (nextChamber: Chamber) => {
      resetForChamberSwitch();
      setChamber(nextChamber);
      goToStep(2, { ignoreGuards: true });
    },
    [goToStep, resetForChamberSwitch],
  );
  const canGoPrev = step > 1;
  const canGoNext = step < 4 && canGoToStep(step + 1);
  const currentStepLabel = STEP_ITEMS[step - 1];

  return (
    <div className="w-full">
      <div className="space-y-4 border border-zinc-200 bg-white p-4 shadow-sm md:p-5">
        <div
          className="border border-zinc-200 bg-zinc-50/70 p-2"
          aria-label="Fortschritt"
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => canGoPrev && goToStep(step - 1)}
              disabled={!canGoPrev}
              className="min-w-[80px] border-2 border-zinc-800 bg-white px-3 py-1.5 text-xs font-section text-zinc-900 cursor-pointer transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Zurück
            </button>
            <div className="min-w-0 text-center px-2">
              <div className="text-xs font-section text-gray-700">Schritt {step}/4</div>
              <div className="text-sm font-section text-pause-black truncate">{currentStepLabel}</div>
            </div>
            <button
              type="button"
              onClick={() => canGoNext && goToStep(step + 1)}
              disabled={!canGoNext}
              className="min-w-[80px] border-2 border-[#9f5500] bg-[#ff9416] px-3 py-1.5 text-xs font-section text-black cursor-pointer transition-colors hover:bg-[#e88510] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Weiter
            </button>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 bg-white p-2 md:p-3">
            <div className="grid gap-2 md:grid-cols-2">
              <button
                type="button"
                onClick={() => handleChooseChamber("bundestag")}
                className={`border px-3 py-3 text-left text-sm cursor-pointer transition-colors ${
                  chamber === "bundestag"
                    ? "border-[#ffbf73] bg-[#fff1de]"
                    : "border-zinc-300 bg-white hover:bg-[#fff7ec]"
                }`}
              >
                <div className="font-section text-xs text-pause-black mb-1">Bundestag</div>
              </button>
              <button
                type="button"
                onClick={() => handleChooseChamber("europarl")}
                className={`border px-3 py-3 text-left text-sm cursor-pointer transition-colors ${
                  chamber === "europarl"
                    ? "border-[#ffbf73] bg-[#fff1de]"
                    : "border-zinc-300 bg-white hover:bg-[#fff7ec]"
                }`}
              >
                <div className="font-section text-xs text-pause-black mb-1">EU-Parlament</div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-2 md:p-3">
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
                    className="flex-1 border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffbf73]"
                  />
                </div>

                {chamber === "europarl" && isEuroparlPlzSearch && (
                  <div className="text-xs text-pause-black border-l-4 border-[#ff9416] pl-2">
                    {nearestEuroparl.inputPlzFound
                      ? "Nächste 5 Büros von Mitgliedern des Europarlaments zu dieser PLZ."
                      : "PLZ nicht gefunden."}
                  </div>
                )}

                {filterableFields.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {filterableFields.map((field) => (
                      <select
                        key={field}
                        value={filters[field] ?? ""}
                        onChange={(e) => setFilters((state) => ({ ...state, [field]: e.target.value }))}
                        className="cursor-pointer border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffbf73]"
                      >
                        <option value="">Alle {labelForField(field)}</option>
                        {uniqueValues[field]?.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                )}

                <div className="max-h-72 overflow-auto border border-zinc-200 bg-white">
                  {filtered.length === 0 ? (
                    <div className="p-3 text-sm text-gray-600">
                      {chamber === "europarl" && isEuroparlPlzSearch && !nearestEuroparl.inputPlzFound
                        ? "PLZ nicht gefunden."
                        : "Keine Einträge gefunden."}
                    </div>
                  ) : (
                    <ul>
                      {filtered.slice(0, 200).map((item, idx) => (
                        <li
                          key={item.info.email || `${item.info.full}-${idx}`}
                          className={`cursor-pointer px-3 py-2 transition-colors border-b border-zinc-100 last:border-b-0 ${
                            selected?.row === item.row
                              ? "bg-[#fff1de] border-l-2 border-l-[#ff9416]"
                              : "hover:bg-zinc-50"
                          }`}
                          onClick={() => {
                            setSelected(item);
                            onSelect?.(item.row);
                            setMailDraft((prev) => ({ ...prev, recipient: item.info.email || "" }));
                            goToStep(3, { ignoreGuards: true });
                          }}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{displayNameWithoutTitle(item.info)}</div>
                              {item.info.party && (
                                <div className="flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-gray-700">
                                  <span
                                    className="inline-block"
                                    style={{ backgroundColor: partyColor(item.info.party), width: 7, height: 7 }}
                                    aria-hidden
                                  />
                                  <span>{item.info.party}</span>
                                </div>
                              )}
                            </div>
                            {chamber === "europarl" && (
                              <div className="text-xs text-gray-600 mt-1">
                                {europarlSubtitle(item.info)}
                                {nearestEuroparl.distanceByRow.has(item.row) && (
                                  <span className="ml-2">
                                    ({nearestEuroparl.distanceByRow.get(item.row)!.toFixed(1)} km)
                                  </span>
                                )}
                              </div>
                            )}
                            {chamber === "bundestag" &&
                              (item.info.bundesland || item.info.district) && (
                                <div className="text-xs text-gray-600 mt-1">
                                  {bundestagSubtitle(item.info)}
                                </div>
                              )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 bg-white p-2 md:p-3">
            <div>
              <input
                type="text"
                id="senderName"
                name="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full border border-zinc-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffbf73]"
                placeholder="Dein Name"
              />
            </div>

          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 bg-white p-2 md:p-3">
            {selected && selectedInfo ? (
              <EmailTemplateViewer
                templateFile={
                  chamber === "europarl"
                    ? "mail_mep_appell.txt"
                    : "mail_mdb_appell.txt"
                }
                initialRecipientName={selectedInfo.last || selectedInfo.full}
                initialRecipientEmail={mailDraft.recipient || selectedInfo.email}
                initialRecipientAnrede={selectedInfo.anrede}
                initialSenderName={senderName}
                onDraftChange={handleDraftChange}
              />
            ) : (
              <div className="text-sm text-gray-600">Bitte zuerst eine Person in der Liste auswählen.</div>
            )}

          </div>
        )}

        {step > 2 && !selected && (
          <div className="text-sm text-gray-600">Bitte zuerst eine Person auswählen.</div>
        )}
      </div>
    </div>
  );
}
