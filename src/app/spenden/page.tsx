import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreditCard, Building2 } from "lucide-react";

export default function SpendenPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        <section className="mx-auto max-w-5xl px-6 pb-12 pt-10 md:px-10 md:pt-14">
          <div className="mb-10">
            <p className="font-section text-sm text-[#FF9416]">Spenden</p>
            <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
              Spende an PauseAI Deutschland
            </h1>
            <p className="mt-6 font-body text-pause-black/85 max-w-3xl">
              KI-Unternehmen befinden sich in einem rücksichtslosen Wettlauf um
              immer leistungsfähigere Systeme.{" "}
              <strong>
                Handeln wir jetzt, um KI unter Kontrolle zu halten
              </strong>
              , bevor es zu spät ist.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Card Payment */}
            <article className="flex h-full flex-col rounded-sm border-2 border-[#1a1a1a] bg-white p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-[#FF9416]" strokeWidth={2} />
                  <h2 className="font-section text-xl text-pause-black">Online-Spende</h2>
                </div>
                <span className="mt-2 inline-block rounded-sm bg-[#FF9416] px-3 py-1 font-section text-xs tracking-wider text-black">
                  Einfach & schnell
                </span>
              </div>
              <p className="font-body text-pause-black/85 flex-1">
                Wähle zwischen einer einmaligen oder monatlichen Spende.
                Sichere Zahlung per Karte oder PayPal.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full items-center justify-center border border-[#1a1a1a] bg-gray-200 px-4 py-2 font-section text-xs tracking-wider text-gray-500 cursor-not-allowed"
                >
                  Online spenden — Kommt bald
                </button>
                <p className="mt-2 font-body text-sm text-pause-black/60">
                  Einmalig oder monatlich.
                </p>
              </div>
            </article>

            {/* Bank Transfer */}
            <article className="flex h-full flex-col rounded-sm border-2 border-[#1a1a1a] bg-white p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-[#FF9416]" strokeWidth={2} />
                  <h2 className="font-section text-xl text-pause-black">Überweisung</h2>
                </div>
              </div>
              <p className="font-body text-pause-black/85 flex-1">
                Ideal für größere Beträge. Überweise direkt auf unser Vereinskonto.
              </p>
              <div className="mt-5 rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-4">
                <p className="font-body text-sm text-pause-black/60">
                  Bankverbindung wird nach Vereinsgründung hier veröffentlicht.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Impact Section */}
        <section className="mx-auto max-w-5xl px-6 pb-12 md:px-10">
          <div className="rounded-sm bg-[#FF9416] p-6 md:p-8">
            <h2 className="font-section text-lg text-black md:text-xl">
              Dein Beitrag zählt
            </h2>
            <p className="mt-3 font-body text-black/85">
              Jeder Tag zählt angesichts der Beschleunigung der KI-Entwicklung.
              Deine Spenden ermöglichen es uns, die Öffentlichkeit aufzuklären,
              Entscheidungsträger zu alarmieren und eine Bewegung aufzubauen,
              die dieses gefährliche Rennen verlangsamt.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
          <h2 className="font-section text-lg text-pause-black md:text-xl mb-6">
            Häufige Fragen
          </h2>
          <div className="space-y-4">
            <details className="group rounded-sm border border-[#1a1a1a] bg-white">
              <summary className="flex cursor-pointer items-center justify-between p-5 font-section text-sm text-pause-black">
                Wofür werden die Spenden verwendet?
                <span className="ml-4 transition-transform group-open:rotate-180">&#9662;</span>
              </summary>
              <div className="px-5 pb-5 font-body text-pause-black/85">
                <p>
                  Deine Spenden finanzieren unsere Aufklärungsarbeit, Kampagnen,
                  Veranstaltungen und die Infrastruktur unserer Bürgerbewegung.
                  Wir setzen uns dafür ein, dass KI-Risiken in der öffentlichen
                  Debatte und bei politischen Entscheidungen berücksichtigt werden.
                </p>
              </div>
            </details>
            <details className="group rounded-sm border border-[#1a1a1a] bg-white">
              <summary className="flex cursor-pointer items-center justify-between p-5 font-section text-sm text-pause-black">
                Kann ich eine Spendenquittung erhalten?
                <span className="ml-4 transition-transform group-open:rotate-180">&#9662;</span>
              </summary>
              <div className="px-5 pb-5 font-body text-pause-black/85">
                <p>
                  Aktuell können wir leider keine steuerlich absetzbaren
                  Spendenquittungen ausstellen. Sobald unser Verein als
                  gemeinnützig anerkannt ist, wird dies möglich sein.
                  Wir informieren dich, sobald es so weit ist.
                </p>
              </div>
            </details>
            <details className="group rounded-sm border border-[#1a1a1a] bg-white">
              <summary className="flex cursor-pointer items-center justify-between p-5 font-section text-sm text-pause-black">
                Was ist PauseAI Deutschland?
                <span className="ml-4 transition-transform group-open:rotate-180">&#9662;</span>
              </summary>
              <div className="px-5 pb-5 font-body text-pause-black/85">
                <p>
                  PauseAI Deutschland ist eine Bürgerbewegung, die sich für eine
                  verantwortungsvolle KI-Entwicklung einsetzt. Wir sind Teil des
                  internationalen PauseAI-Netzwerks und setzen uns für ein
                  Moratorium auf die Entwicklung gefährlicher KI-Systeme ein.
                </p>
              </div>
            </details>
            <details className="group rounded-sm border border-[#1a1a1a] bg-white">
              <summary className="flex cursor-pointer items-center justify-between p-5 font-section text-sm text-pause-black">
                Was ist der Zusammenhang mit PauseAI Global?
                <span className="ml-4 transition-transform group-open:rotate-180">&#9662;</span>
              </summary>
              <div className="px-5 pb-5 font-body text-pause-black/85">
                <p>
                  PauseAI Deutschland ist der deutsche Ableger von PauseAI, einer
                  internationalen Bewegung. Spenden an PauseAI Deutschland bleiben
                  in Deutschland und werden für lokale Aktivitäten verwendet.
                </p>
              </div>
            </details>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
