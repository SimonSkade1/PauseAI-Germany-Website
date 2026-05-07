import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { LocalGroup } from "@/lib/local-group-types";
import LocalGroupsClient from "./LocalGroupsClient";
import LocalGroupSignupForm from "./LocalGroupSignupForm";

const SHEET_ID = "1PN3uxPjiViTTSIYQj9xj5pcBce28Z-UCY5PkOOoo200";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
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
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

async function fetchGroups(): Promise<LocalGroup[]> {
  const res = await fetch(CSV_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch groups: ${res.status}`);
  const text = (await res.text()).replace(/\r/g, "");
  const lines = text.trim().split("\n").slice(1); // skip header row
  if (process.env.NODE_ENV === "development") {
    console.log("[lokalgruppen] CSV columns:", parseCSVLine(text.split("\n")[0]));
  }
  return lines
    .map((line) => {
      const f = parseCSVLine(line).map((v) => v.replace(/\r/g, ""));
      return {
        id: f[0],
        city: f[1],
        lat: parseFloat(f[2]),
        lng: parseFloat(f[3]),
        contact: { name: f[4], email: f[5] },
        description: f[6] || undefined,
        website: f[7] || "",
        links: {
          whatsapp: f[8] || undefined,
          signal: f[9] || undefined,
          telegram: f[10] || undefined,
        },
        lumaUrl: f[11] || undefined,
      } satisfies LocalGroup;
    })
    .filter((g) => g.id && g.city)
    .sort((a, b) => a.city.localeCompare(b.city, "de"));
}

export default async function LokalGruppenPage() {
  const groups = await fetchGroups();

  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-4 pt-10 md:px-10 md:pt-14">
          <p className="font-section text-sm text-[#FF9416]">Lokalgruppen</p>
          <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
            Finde deine Lokalgruppe in Deutschland
          </h1>
          <p className="mt-6 max-w-3xl font-body text-pause-black/85">
            PauseAI lebt vor Ort. Unsere Lokalgruppen organisieren Infoabende,
            Stammtische und gemeinsame Aktionen in ganz Deutschland. Finde eine
            Gruppe in deiner Nähe und werde Teil der Bewegung.
          </p>
        </section>

        <LocalGroupsClient groups={groups} />

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
          <div className="rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl">
              Keine Gruppe in deiner Nähe?
            </h2>
            <p className="mt-3 max-w-2xl font-body text-pause-black/85">
              Trag dich ein — wir melden uns, sobald sich genug Interessierte in deiner Region gefunden haben.
            </p>
            <LocalGroupSignupForm />
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
