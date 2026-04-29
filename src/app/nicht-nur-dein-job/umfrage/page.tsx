import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "Umfrage — Nicht nur dein Job | PauseAI Deutschland",
  description: "Erzähl uns, wie KI deinen Beruf verändert.",
  alternates: { canonical: "https://pauseai.de/nicht-nur-dein-job/umfrage" },
  robots: { index: true, follow: true },
};

export default function UmfragePage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-[#1a1a1a] text-white pt-28 pb-12 md:pt-36 md:pb-16">
          <div className="max-w-2xl mx-auto px-6">
            <p className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-3">
              Die große Umfrage
            </p>
            <h1 className="font-display text-4xl md:text-5xl mb-4">Erzähl deine Geschichte</h1>
            <p className="font-body text-white/80 text-lg leading-relaxed">
              Anonym oder mit Namen — wie du willst. Deine Geschichte hilft uns, das Bild
              zusammenzusetzen.
            </p>
          </div>
        </section>
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-2xl mx-auto px-6">
            <SurveyForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
