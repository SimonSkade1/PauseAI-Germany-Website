import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Heart, MessageCircle, Check } from "lucide-react";

const MEMBERSHIP_TIERS = [
  {
    name: "Solidarisch",
    price: "2",
    annual: "24",
    description: "Für knappe Budgets und Studierende. Jede:r soll sich PauseAI leisten können.",
    highlight: false,
  },
  {
    name: "Unterstützung",
    price: "10",
    annual: "120",
    description: "Einstiegspunkt, um unsere Aktionen kontinuierlich zu unterstützen.",
    highlight: false,
  },
  {
    name: "Engagement 1% — Geringes Einkommen",
    price: "20",
    annual: "240",
    description: "Für alle, die sich mit 1% engagieren wollen, aber ein geringeres Einkommen haben.",
    highlight: false,
  },
  {
    name: "Engagement 1% — Mittleres Einkommen",
    price: "60",
    annual: "720",
    description: "Berechnet auf Basis eines Nettoeinkommens von ca. 2.000 € pro Monat.",
    highlight: true,
  },
  {
    name: "Engagement 1% — Höheres Einkommen",
    price: "90",
    annual: "1.080",
    description: "Berechnet auf Basis eines Nettoeinkommens von ca. 3.000 € pro Monat.",
    highlight: false,
  },
  {
    name: "Großspender:in",
    price: "150",
    annual: "1.800",
    description: "Maximale Unterstützung — ein Dutzend wie du, und wir könnten unsere:n erste:n Mitarbeiter:in einstellen.",
    highlight: false,
  },
];

const MEMBERSHIP_BENEFITS = [
  "Offizielles Vereinsmitglied",
  "Stimmrecht bei Mitgliederversammlungen",
  "Regelmäßige Updates per E-Mail",
  "Zugang zu internen Strategietreffen",
];

export default function MitgliedWerdenPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-12 pt-10 md:px-10 md:pt-14">
          <div className="mb-4">
            <p className="font-section text-sm text-[#FF9416]">Mitgliedschaft</p>
            <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
              Werde Mitglied bei PauseAI
            </h1>
            <p className="mt-6 font-body text-pause-black/85 max-w-3xl">
              Angesichts einer technologischen Entwicklung, die sich täglich beschleunigt, ist{" "}
              <strong>gemeinsames Handeln unsere größte Stärke</strong>.
              Jede Stimme, jede Stunde ehrenamtlicher Arbeit, jede Mitgliedschaft stärkt
              unsere Fähigkeit, die öffentliche Debatte zu beeinflussen und die Kontrolle
              über KI-Entwicklung zurückzugewinnen.
            </p>
          </div>
        </section>

        {/* What you get */}
        <section className="mx-auto max-w-5xl px-6 pb-10 md:px-10">
          <div className="rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl mb-4">
              Als Mitglied erhältst du
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {MEMBERSHIP_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 font-body text-pause-black/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FF9416]" strokeWidth={2.5} />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="mx-auto max-w-5xl px-6 pb-12 md:px-10">
          <h2 className="font-section text-lg text-pause-black md:text-xl mb-6">
            Wähle deinen Beitrag
          </h2>
          <div className="space-y-4">
            {MEMBERSHIP_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col gap-4 rounded-sm border-2 p-5 sm:flex-row sm:items-center sm:justify-between ${
                  tier.highlight
                    ? "border-[#FF9416] bg-[#FFFAF5]"
                    : "border-[#1a1a1a] bg-white"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-section text-sm text-pause-black md:text-base">
                      {tier.name}
                    </h3>
                    {tier.highlight && (
                      <span className="rounded-sm bg-[#FF9416] px-2 py-0.5 font-section text-[10px] tracking-wider text-black">
                        Empfohlen
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-body text-sm text-pause-black/70">{tier.description}</p>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right shrink-0">
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline text-2xl text-pause-black md:text-3xl">{tier.price}&nbsp;€</span>
                      <span className="font-body text-sm text-pause-black/60">/ Monat</span>
                    </div>
                    <p className="font-body text-xs text-pause-black/50">{tier.annual}&nbsp;€ / Jahr</p>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="shrink-0 inline-flex items-center justify-center border border-[#1a1a1a] bg-gray-200 px-4 py-2 font-section text-xs tracking-wider text-gray-500 cursor-not-allowed"
                  >
                    Kommt bald
                  </button>
                </div>
              </div>
            ))}

            {/* Free price annual */}
            <div className="flex flex-col gap-4 rounded-sm border-2 border-dashed border-[#1a1a1a] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="font-section text-sm text-pause-black md:text-base">
                  Jahresmitgliedschaft — Freier Betrag
                </h3>
                <p className="mt-1 font-body text-sm text-pause-black/70">
                  Wähle selbst, was du geben kannst. Ab 24&nbsp;€ pro Jahr.
                </p>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-right shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline text-2xl text-pause-black md:text-3xl">ab 24&nbsp;€</span>
                    <span className="font-body text-sm text-pause-black/60">/ Jahr</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="shrink-0 inline-flex items-center justify-center border border-[#1a1a1a] bg-gray-200 px-4 py-2 font-section text-xs tracking-wider text-gray-500 cursor-not-allowed"
                >
                  Kommt bald
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Community */}
        <section className="mx-auto max-w-5xl px-6 pb-12 md:px-10">
          <h2 className="font-section text-lg text-pause-black md:text-xl mb-6">
            Kostenlos mitmachen
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-sm border-2 border-[#1a1a1a] bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="h-6 w-6 text-[#FF9416]" strokeWidth={2} />
                <h3 className="font-section text-xl text-pause-black">Discord-Community</h3>
              </div>
              <p className="font-body text-pause-black/85">
                Tritt unserer Community auf Discord bei, um dich auszutauschen,
                dich zu informieren und aktiv zu werden. Keine Mitgliedschaft nötig.
              </p>
              <a
                href="https://discord.gg/pvZ5PmRX4R"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
              >
                Zum Discord-Server
              </a>
            </div>
            <div className="rounded-sm border-2 border-[#1a1a1a] bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-[#FF9416]" strokeWidth={2} />
                <h3 className="font-section text-xl text-pause-black">WhatsApp-Gruppe</h3>
              </div>
              <p className="font-body text-pause-black/85">
                Wenig Zeit, aber Lust zu handeln? Tritt unserer
                WhatsApp-Gruppe bei für schnelle Aktionen.
              </p>
              <a
                href="https://chat.whatsapp.com/C7p9cdH41IE1MQwPHQLWCX"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
              >
                Zur WhatsApp-Gruppe
              </a>
            </div>
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
                Was bedeutet &quot;Engagement 1%&quot;?
                <span className="ml-4 transition-transform group-open:rotate-180">&#9662;</span>
              </summary>
              <div className="px-5 pb-5 font-body text-pause-black/85">
                <p>
                  Die Idee ist einfach: 1% deines Nettoeinkommens für den Schutz
                  der Menschheit vor unkontrollierter KI-Entwicklung. Die
                  verschiedenen Stufen orientieren sich an typischen Einkommensniveaus
                  in Deutschland.
                </p>
              </div>
            </details>
            <details className="group rounded-sm border border-[#1a1a1a] bg-white">
              <summary className="flex cursor-pointer items-center justify-between p-5 font-section text-sm text-pause-black">
                Was ist der Unterschied zwischen Mitglied und Ehrenamtlichem?
                <span className="ml-4 transition-transform group-open:rotate-180">&#9662;</span>
              </summary>
              <div className="px-5 pb-5 font-body text-pause-black/85">
                <p>
                  <strong>Mitglieder</strong> unterstützen den Verein offiziell durch ihren
                  Beitrag und haben Stimmrecht bei Mitgliederversammlungen.
                </p>
                <p className="mt-2">
                  <strong>Ehrenamtliche</strong> engagieren sich aktiv in unseren Projekten
                  und Aktionen — eine Mitgliedschaft ist dafür nicht zwingend nötig.
                  Beides ist natürlich auch kombinierbar!
                </p>
              </div>
            </details>
            <details className="group rounded-sm border border-[#1a1a1a] bg-white">
              <summary className="flex cursor-pointer items-center justify-between p-5 font-section text-sm text-pause-black">
                Kann ich meinen Beitrag steuerlich absetzen?
                <span className="ml-4 transition-transform group-open:rotate-180">&#9662;</span>
              </summary>
              <div className="px-5 pb-5 font-body text-pause-black/85">
                <p>
                  Aktuell können wir leider keine steuerlich absetzbaren
                  Spendenquittungen ausstellen. Sobald unser Verein als
                  gemeinnützig anerkannt ist, wird dies möglich sein.
                </p>
              </div>
            </details>
            <details className="group rounded-sm border border-[#1a1a1a] bg-white">
              <summary className="flex cursor-pointer items-center justify-between p-5 font-section text-sm text-pause-black">
                Wie kann ich meine Mitgliedschaft kündigen?
                <span className="ml-4 transition-transform group-open:rotate-180">&#9662;</span>
              </summary>
              <div className="px-5 pb-5 font-body text-pause-black/85">
                <p>
                  Du kannst deine Mitgliedschaft jederzeit formlos per E-Mail
                  kündigen. Kontaktiere uns einfach unter{" "}
                  <a
                    href="mailto:pauseaideutschland@gmail.com"
                    className="orange-link font-body-bold"
                  >
                    pauseaideutschland@gmail.com
                  </a>
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
