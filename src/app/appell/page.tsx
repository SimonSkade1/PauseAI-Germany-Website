import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TableOfContents from "./TableOfContents";
import AppellSection from "./AppellSection";
import ZitateSection from "./ZitateSection";
import UnterzeichnendeSection from "./UnterzeichnendeSection";
import type { Signatory } from "./UnterzeichnendeSection";
import HintergrundSection from "./HintergrundSection";
import FAQSection from "./FAQSection";
import ExpertenSection from "./ExpertenSection";
import PetitionSection from "./PetitionSection";
import MedienSection from "./MedienSection";
import { sections } from "./sections";
import "./appell.css";

export const metadata: Metadata = {
  title: "Appell zum KI-Gipfel 2026",
  description: "Wir fordern die deutsche Delegation des bevorstehenden KI-Gipfels auf, sich öffentlich für ein globales Abkommen auszusprechen, das klare rote Linien und verbindliche Sicherheitsstandards verankert.",
};

const APPELL_PASSWORD = "ki_appell";
const APPELL_ACCESS_COOKIE = "appell_access";

function parseCsvLine(line: string): string[] {
  return line
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((value) => value.trim().replace(/^"(.*)"$/, "$1").replace(/""/g, '"'));
}

function getLastName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? "";
}

async function loadSignatories(): Promise<Signatory[]> {
  const csvPath = path.join(
    process.cwd(),
    "scripts",
    "signatories_websearch_checked_cleaned.csv"
  );
  const csv = await readFile(csvPath, "utf8");
  const lines = csv.split(/\r?\n/).filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return [];
  }

  const [header, ...rows] = lines;
  const columns = parseCsvLine(header);
  const nameIndex = columns.indexOf("normalized_name");
  const positionIndex = columns.indexOf("final_position");

  if (nameIndex === -1 || positionIndex === -1) {
    return [];
  }

  return rows
    .map((row) => parseCsvLine(row))
    .map((columnsInRow) => ({
      name: columnsInRow[nameIndex] ?? "",
      chair: columnsInRow[positionIndex] ?? "",
    }))
    .filter((entry) => entry.name !== "" && entry.chair !== "")
    .sort((a, b) => {
      const lastNameComparison = getLastName(a.name).localeCompare(
        getLastName(b.name),
        "de"
      );
      if (lastNameComparison !== 0) {
        return lastNameComparison;
      }
      return a.name.localeCompare(b.name, "de");
    });
}

export default async function AppellPage() {
  async function unlockAppell(formData: FormData) {
    "use server";

    const password = formData.get("password");
    if (typeof password === "string" && password === APPELL_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set(APPELL_ACCESS_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/appell",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    redirect("/appell");
  }

  const cookieStore = await cookies();
  const hasAccess = cookieStore.get(APPELL_ACCESS_COOKIE)?.value === "1";

  if (!hasAccess) {
    return (
      <>
        <Header />
        <div className="appell-layout">
          <main className="appell-main">
            <article className="appell-content-wrapper">
              <section className="appell-section">
                <div className="appell-content">
                  <h1 className="appell-headline">Geschuetzter Bereich</h1>
                  <p className="appell-paragraph">
                    Bitte Passwort eingeben, um den Appell zu sehen.
                  </p>
                  <form action={unlockAppell} className="appell-password-form">
                    <input
                      className="appell-password-input"
                      type="password"
                      name="password"
                      placeholder="Passwort"
                      autoComplete="current-password"
                      required
                    />
                    <button className="appell-btn-primary" type="submit">
                      Freischalten
                    </button>
                  </form>
                </div>
              </section>
            </article>
          </main>
        </div>
        <Footer />
      </>
    );
  }

  const signatories = await loadSignatories();

  return (
    <>
      <Header />
      <div className="appell-layout">
        {/* Mobile TOC toggle and overlay */}
        <TableOfContents sections={sections} />

        {/* Desktop sidebar table of contents */}
        <aside className="appell-sidebar">
          <TableOfContents sections={sections} desktopOnly={true} />
        </aside>

        {/* Main content area */}
        <main className="appell-main">
          <article className="appell-content-wrapper">

            <section id="appell" className="appell-section">
              <AppellSection professorCount={signatories.length} />
            </section>

            <section id="zitate" className="appell-section">
              <ZitateSection />
            </section>

            <section id="unterzeichnende" className="appell-section">
              <UnterzeichnendeSection signatories={signatories} />
            </section>

            <section id="hintergrund" className="appell-section">
              <HintergrundSection />
            </section>

            <section id="faq" className="appell-section">
              <FAQSection />
            </section>

            <section id="experten" className="appell-section">
              <ExpertenSection />
            </section>

            <section id="petition" className="appell-section">
              <PetitionSection />
            </section>

            <section id="medien" className="appell-section">
              <MedienSection />
            </section>

          </article>
        </main>
      </div>
      <Footer />
    </>
  );
}
