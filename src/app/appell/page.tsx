import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JumpBar from "./JumpBar";
import AppellSection from "./AppellSection";
import ZitateSection from "./ZitateSection";
import "./appell.css";

export const metadata: Metadata = {
  title: "Appell zum KI-Gipfel 2026",
  description: "Wir fordern die deutsche Delegation des bevorstehenden KI-Gipfels auf, sich öffentlich für ein globales Abkommen auszusprechen, das klare rote Linien und verbindliche Sicherheitsstandards verankert.",
};

export default function AppellPage() {
  return (
    <>
      <Header />
      <main className="appell-page">
        {/* Section wrappers with IDs for anchor linking */}
        {/* Each has scroll-margin-top to prevent landing under navbar */}

        <section id="appell" className="appell-section-wrapper">
          <div className="appell-section">
            <AppellSection />
          </div>
        </section>

        {/* Thin divider line */}
        <hr className="appell-divider" />

        {/* Jump bar - sticky navigation to all sections */}
        <JumpBar />

        <section id="zitate" className="appell-section-wrapper">
          <div className="appell-section">
            <ZitateSection />
          </div>
        </section>

        <section id="unterzeichnende" className="appell-section-wrapper">
          <div className="appell-section">
            {/* Unterzeichnende content */}
          </div>
        </section>

        <section id="hintergrund" className="appell-section-wrapper">
          <div className="appell-section">
            {/* Hintergrund content */}
          </div>
        </section>

        <section id="faq" className="appell-section-wrapper">
          <div className="appell-section">
            {/* FAQ content */}
          </div>
        </section>

        <section id="experten" className="appell-section-wrapper">
          <div className="appell-section">
            {/* Experten content */}
          </div>
        </section>

        <section id="petition" className="appell-section-wrapper">
          <div className="appell-section">
            {/* Petition content */}
          </div>
        </section>

        <section id="medien" className="appell-section-wrapper">
          <div className="appell-section">
            {/* Medien content */}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
