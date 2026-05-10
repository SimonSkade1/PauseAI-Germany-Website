import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UmfrageEmbed from "./UmfrageEmbed";

export const metadata: Metadata = {
  title: "Umfrage — Nicht nur dein Job | PauseAI Deutschland",
  description: "Erzähl uns, wie KI deinen Beruf verändert.",
  alternates: { canonical: "https://pause-ai.de/nicht-nur-dein-job/umfrage" },
  robots: { index: true, follow: true },
};

export default function UmfragePage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative bg-[#1a1a1a] text-white pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div
            aria-hidden
            className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] -translate-y-1/3 translate-x-1/4 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,148,22,0.18), rgba(255,148,22,0.04) 60%, transparent 80%)",
            }}
          />
          <div className="relative max-w-4xl mx-auto px-6 md:px-12">
            <p className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-6">
              Aktuelle Kampagne
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] mb-8">
              Erzähl deine Geschichte.
            </h1>
            <p className="font-body text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl">
              Anonym oder mit Namen – deine Geschichte zeigt der Politik, wie KI den Alltag
              tatsächlich verändert.
            </p>
          </div>
        </section>
        <section className="bg-white py-12 md:py-16" data-testid="tally-embed-section">
          <div className="max-w-2xl mx-auto px-6">
            <UmfrageEmbed />
          </div>
        </section>
      </main>
      <Footer />

      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="lazyOnload"
        id="tally-embed-script"
      />
    </>
  );
}
