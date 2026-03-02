export type Row = Record<string, string>;
export type WizardStep = 1 | 2 | 3 | 4;
export type Chamber = "bundestag" | "europarl";
export type Coord = { lat: number; lon: number };
export type CoordMap = Record<string, Coord>;
export type RowInfo = {
  first: string;
  last: string;
  full: string;
  birthYear: string;
  party: string;
  bundesland: string;
  district: string;
  email: string;
  anrede: string;
  region: string;
  city: string;
  postalCode: string;
};
export type RowWithInfo = { row: Row; info: RowInfo };
export type FilterField = "first" | "last" | "full" | "birthYear" | "party" | "district" | "email";

export const CSV_PATH_BY_CHAMBER: Record<Chamber, string> = {
  bundestag: "/BTAbgeordnete_with_bundesland.csv",
  europarl: "/EUAbgeordnete.csv",
};

export const FILTER_FIELDS_BY_CHAMBER: Record<Chamber, FilterField[]> = {
  bundestag: ["first", "last", "full", "birthYear", "party", "district", "email"],
  europarl: ["party"],
};

const FILTER_FIELD_LABELS: Record<FilterField, string> = {
  first: "Vorname",
  last: "Nachname",
  full: "Name",
  birthYear: "Geburtsjahr",
  party: "Parteien",
  district: "Wahlkreis",
  email: "E-Mail",
};

const ROW_INFO_KEYS: Record<Exclude<keyof RowInfo, "full">, string[]> = {
  first: ["FirstName", "Vorname", "first", "firstname", "given_name"],
  last: ["LastName", "Nachname", "last", "lastname", "family_name"],
  birthYear: ["BirthYear", "birthYear", "geburtsjahr"],
  party: ["Partei", "party", "Party", "partei"],
  bundesland: ["Bundesland", "bundesland"],
  district: ["Wahlkreis", "district", "Wahlkreisnummer", "WahlkreisNummer"],
  email: ["Email", "email", "E-Mail", "E_MAIL", "mail"],
  anrede: ["Anrede", "anrede", "Anrede/Geschlecht", "Geschlecht", "geschlecht", "gender"],
  region: ["zuständige bundesländer", "zustaendige bundeslaender", "region"],
  city: ["büro in deutschland stadt", "buero in deutschland stadt", "stadt", "city"],
  postalCode: ["büro in deutschland plz", "buero in deutschland plz", "plz", "postalcode"],
};

const FULL_NAME_KEYS = ["Name", "FullName", "full", "name"];

export const STEP_ITEMS = ["Parlament", "Empfänger:in", "Dein Name", "Mail"];
export const WIZARD_STEP_KEY = "__contactWizardStep";

export function parseCSV(text: string): { headers: string[]; rows: Row[] } {
  const lines: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '""';
        i++;
      } else {
        inQuotes = !inQuotes;
        current += ch;
      }
    } else if (ch === "\n" && !inQuotes) {
      lines.push(current.replace(/\r$/, ""));
      current = "";
    } else {
      current += ch;
    }
  }

  if (current.length) lines.push(current.replace(/\r$/, ""));
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = splitCSVLine(lines.shift()!);
  const rows = lines.map((line) => {
    const cols = splitCSVLine(line);
    const row: Row = {};
    headers.forEach((header, i) => {
      row[header] = cols[i] ?? "";
    });
    return row;
  });

  return { headers, rows };
}

function splitCSVLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  cells.push(current);
  return cells.map((c) => c.trim());
}

function getRowValue(row: Row, keys: string[]): string {
  for (const key of keys) {
    if (!key) continue;
    const exact = row[key];
    if (exact != null && String(exact).trim() !== "") return String(exact).trim();

    const foundKey = Object.keys(row).find((header) => header.toLowerCase() === key.toLowerCase());
    if (!foundKey) continue;
    const value = row[foundKey];
    if (value != null && String(value).trim() !== "") return String(value).trim();
  }
  return "";
}

export function extractRowInfo(row: Row): RowInfo {
  const base = {} as Omit<RowInfo, "full">;
  (Object.keys(ROW_INFO_KEYS) as Array<keyof Omit<RowInfo, "full">>).forEach((field) => {
    base[field] = getRowValue(row, ROW_INFO_KEYS[field]);
  });

  const full =
    getRowValue(row, FULL_NAME_KEYS) ||
    [base.first, base.last].filter(Boolean).join(" ");

  return { ...base, full };
}

export function parseLatLong(value: string): Coord | null {
  const parts = value.split(",").map((part) => part.trim());
  if (parts.length !== 2) return null;
  const lat = Number.parseFloat(parts[0]);
  const lon = Number.parseFloat(parts[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

export function haversineKm(a: Coord, b: Coord): number {
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

export function valueForFilterField(info: RowInfo, key: string): string {
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
}

export function labelForField(field: string): string {
  if (field in FILTER_FIELD_LABELS) {
    return FILTER_FIELD_LABELS[field as FilterField];
  }
  return field;
}

export function partyColor(p?: string): string {
  if (!p) return "#9CA3AF";
  const up = p.toUpperCase();
  if (up.includes("SPD")) return "#EF4444";
  if (up.includes("CDU")) return "#111827";
  if (up.includes("CSU")) return "#1E40AF";
  if (up.includes("GRUENE") || up.includes("GRÜNE") || up.includes("GRU")) return "#16A34A";
  if (up.includes("FDP")) return "#FBBF24";
  if (up.includes("LINKE") || up.includes("DIE LINKE")) return "#DC2626";
  if (up.includes("BSW")) return "#7C3AED";
  if (up.includes("VOLT")) return "#5B21B6";
  if (up.includes("FREIE W")) return "#F97316";
  if (up.includes("PARTEI")) return "#DC2626";
  if (up.includes("TIERSCHUTZ")) return "#10B981";
  if (up.includes("FAMILIEN")) return "#EA580C";
  if (up.includes("ÖDP") || up.includes("OEDP")) return "#D97706";
  if (up.includes("FORTSCHRITT")) return "#2563EB";
  if (up.includes("SSW")) return "#0EA5A4";
  return "#9CA3AF";
}

export function bundestagSubtitle(info: RowInfo): string {
  return [info.bundesland, info.district ? `Wahlkreis: ${info.district}` : ""]
    .filter(Boolean)
    .join(" • ");
}

export function europarlSubtitle(info: RowInfo): string {
  return [info.region, info.city ? `Büro in ${info.city}` : ""]
    .filter(Boolean)
    .join(" • ");
}

export function displayNameWithoutTitle(info: RowInfo): string {
  const baseName = info.first ? `${info.first} ${info.last}`.trim() : info.full;
  return baseName
    .replace(/^(?:prof\\.?\\s*)?(?:dr\\.?\\s*)+/i, "")
    .replace(/^(?:professor\\s+)+/i, "")
    .trim();
}
