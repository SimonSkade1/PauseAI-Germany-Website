import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TableOfContents from "./TableOfContents";
import AppellSection from "./AppellSection";
import ZitateSection from "./ZitateSection";
import UnterzeichnendeSection from "./UnterzeichnendeSection";
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

export default function AppellPage() {
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
              <AppellSection />
            </section>

            <section id="zitate" className="appell-section">
              <ZitateSection />
            </section>

            <section id="unterzeichnende" className="appell-section">
              <UnterzeichnendeSection />
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
