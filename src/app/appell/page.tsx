import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TableOfContents from "./TableOfContents";
import AppellSection from "./AppellSection";
import ZitateSection from "./ZitateSection";
import "./appell.css";

export const metadata: Metadata = {
  title: "Appell zum KI-Gipfel 2026",
  description: "Wir fordern die deutsche Delegation des bevorstehenden KI-Gipfels auf, sich öffentlich für ein globales Abkommen auszusprechen, das klare rote Linien und verbindliche Sicherheitsstandards verankert.",
};

const sections = [
  { id: "appell", label: "Appell" },
  { id: "zitate", label: "Zitate" },
  { id: "unterzeichnende", label: "Unterzeichnende" },
  { id: "hintergrund", label: "Hintergrund" },
  { id: "faq", label: "FAQ" },
  { id: "experten", label: "Experten" },
  { id: "petition", label: "Petition" },
  { id: "medien", label: "Presse" },
];

export default function AppellPage() {
  return (
    <>
      <Header />
      <div className="appell-layout">
        {/* Sidebar table of contents */}
        <aside className="appell-sidebar">
          <TableOfContents sections={sections} />
        </aside>

        {/* Main content area */}
        <main className="appell-main">
          <article className="appell-content-wrapper">

            <section id="appell" className="appell-section">
              <AppellSection />
            </section>

            <section id="zitate" className="appell-section">
              <ZitateSection />
            </section>

            <section id="unterzeichnende" className="appell-section">
              {/* Unterzeichnende content */}
            </section>

            <section id="hintergrund" className="appell-section">
              {/* Hintergrund content */}
            </section>

            <section id="faq" className="appell-section">
              {/* FAQ content */}
            </section>

            <section id="experten" className="appell-section">
              {/* Experten content */}
            </section>

            <section id="petition" className="appell-section">
              {/* Petition content */}
            </section>

            <section id="medien" className="appell-section">
              {/* Medien content */}
            </section>

          </article>
        </main>
      </div>
      <Footer />
    </>
  );
}
