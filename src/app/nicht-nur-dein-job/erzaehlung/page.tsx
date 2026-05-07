import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  TALLY_NICHT_NUR_DEIN_JOB_STORY,
  tallyEmbedSrc,
} from "@/data/tally";

const TITLE = "Erzähl deine ganze Geschichte | PauseAI Deutschland";
const DESCRIPTION =
  "Die ausführliche Geschichte zum Thema KI und Arbeit – mit Foto, Video und Freigaben für Presse und Politik.";
const URL = "https://pauseai.de/nicht-nur-dein-job/erzaehlung";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "PauseAI Deutschland",
    type: "article",
    locale: "de_DE",
    images: [{ url: "/og-nicht-nur-dein-job.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-nicht-nur-dein-job.png"],
  },
  alternates: { canonical: URL },
};

export default function ErzaehlungPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-[#1a1a1a] text-white pt-28 pb-12 md:pt-36 md:pb-16">
          <div className="max-w-3xl mx-auto px-6">
            <p className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-3">
              Die ganze Geschichte
            </p>
            <h1 className="font-display text-4xl md:text-5xl mb-6">
              Erzähl deine ganze Geschichte
            </h1>
            <p className="font-body text-white/80 text-lg leading-relaxed mb-3">
              Die kurze{" "}
              <Link href="/nicht-nur-dein-job/umfrage" className="orange-link-dark">
                Umfrage
              </Link>{" "}
              hat uns die Eckdaten gegeben – hier kannst du erzählen, was dich wirklich bewegt.
              Mit Foto, Video und Freigaben dafür, wie wir deine Stimme verwenden dürfen.
            </p>
            <p className="font-body text-white/65 text-base leading-relaxed">
              Diese Geschichten gehen in die globale PauseAI-Sammlung – sie prägen die politische
              Debatte über die deutsche Chapter hinaus.
            </p>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16" data-testid="tally-embed-section">
          <div className="max-w-3xl mx-auto px-6">
            <iframe
              data-tally-src={tallyEmbedSrc(TALLY_NICHT_NUR_DEIN_JOB_STORY)}
              loading="lazy"
              width="100%"
              height="700"
              frameBorder={0}
              title="Erzähl deine Geschichte – PauseAI"
              data-testid="tally-iframe"
              className="block w-full min-h-[700px] border-0"
            />
            <noscript>
              <p className="font-body text-pause-black/75 text-base leading-relaxed mt-6">
                Diese Form benötigt JavaScript.{" "}
                <a
                  href={`https://tally.so/r/${TALLY_NICHT_NUR_DEIN_JOB_STORY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="orange-link"
                >
                  Direkt bei Tally öffnen →
                </a>
              </p>
            </noscript>
            <p className="font-body text-xs text-pause-black/50 mt-8">
              Form-Anbieter: Tally (EU). Mit dem Absenden willigst du in die Verarbeitung deiner
              Angaben durch PauseAI Deutschland und Tally als Auftragsverarbeiter ein. Mehr in der{" "}
              <Link href="/datenschutz" className="orange-link">
                Datenschutzerklärung
              </Link>
              .
            </p>
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
