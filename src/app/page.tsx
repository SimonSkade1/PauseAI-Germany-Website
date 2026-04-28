"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import EventsSection from "@/components/sections/EventsSection";
import ActionSection from "@/components/sections/ActionSection";
import LinkedHeading from "@/components/LinkedHeading";


const quotes = [
  {
    quote: "We call for a prohibition on the development of superintelligence, not lifted before there is broad scientific consensus that it will be done safely and controllably, and strong public buy-in.",
    name: "Statement on Superintelligence",
    title: "Unterzeichnet von 130.000+ Personen, darunter KI-Forscher:innen, Politiker:innen und Industrievertreter:innen",
    image: "https://superintelligence-statement.org/favicon.ico",
    link: "https://superintelligence-statement.org/",
  },
  {
    quote: "Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war.",
    name: "Statement on AI Risk",
    title: "Unterzeichnet von Hunderten KI-Expert:innen führender Labore und Institutionen",
    image: "/CAISlogo.png",
    link: "https://aistatement.com/",
  },
  {
    quote: "International unterstütze ich Initiativen, die rote Linien für KI definieren, autonome Waffensysteme ächten und globale Sicherheitsstandards schaffen.",
    name: "Max Lucks",
    title: "Bundestagsabgeordneter (Bündnis 90/Die Grünen)",
    image: "/Max_Lucks_(2023).jpg",
    link: "https://www.abgeordnetenwatch.de/profile/max-lucks/fragen-antworten/sehr-geehrter-herr-lucks-wie-engagieren-sie-sich-fuer-die-weltweite-internationale-zusammenarbeit-im-umgang-mit",
    attribution: "Büro Max Lucks / Wikimedia Commons",
    sourceLink: "https://commons.wikimedia.org/wiki/File:Max_Lucks_(2023).jpg",
    licenseLink: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    quote: "It might be quite sensible to just stop developing these things any further.",
    name: "Geoffrey Hinton",
    title: 'Nobelpreisträger & Mitgründer der modernen KI',
    image: "/Geoffrey_E._Hinton,_2024_Nobel_Prize_Laureate_in_Physics_(cropped1).jpg",
    link: "https://www.forbes.com/sites/craigsmith/2023/05/04/geoff-hinton-ais-most-famous-researcher-warns-of-existential-threat/",
    attribution: "Arthur Petron / Wikimedia Commons",
    sourceLink: "https://commons.wikimedia.org/wiki/File:Geoffrey_E._Hinton,_2024_Nobel_Prize_Laureate_in_Physics_(cropped1).jpg",
    licenseLink: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    quote: "Verbindliche internationale Abkommen und ethische Grundlagen für den Einsatz von KI werden benötigt um ein Wettrennen zwischen den Staaten um die leistungsfähigste KI zu unterbinden.",
    name: "Desiree Becker",
    title: "Bundestagsabgeordnete (Die Linke)",
    link: "https://www.abgeordnetenwatch.de/profile/desiree-becker/fragen-antworten/sehr-geehrte-frau-becker-wie-engagieren-sie-sich-fuer-die-weltweite-internationale-zusammenarbeit-im-umgang",
  },
  {
    quote: "Banning powerful AI systems beyond GPT-4 abilities with autonomy would be a good start.",
    name: "Yoshua Bengio",
    title: "Turing-Preisträger & meistzitierter KI-Wissenschaftler",
    image: "/ICLR_2025_-_Yoshua_Bengio_02.jpg",
    link: "https://yoshuabengio.org/2023/05/22/how-rogue-ais-may-arise/",
    attribution: "Xuthoria / Wikimedia Commons",
    sourceLink: "https://commons.wikimedia.org/wiki/File:ICLR_2025_-_Yoshua_Bengio_02.jpg",
    licenseLink: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    quote: "The development of full artificial intelligence could spell the end of the human race.",
    name: "Stephen Hawking",
    title: "Theoretischer Physiker und Kosmologe",
    image: "/Stephen_Hawking.StarChild.jpg",
    link: "https://www.bbc.com/news/technology-30290540",
    attribution: "NASA / Wikimedia Commons",
    sourceLink: "https://commons.wikimedia.org/wiki/File:Stephen_Hawking.StarChild.jpg",
    licenseLink: "https://commons.wikimedia.org/wiki/Public_domain",
  },
  {
    quote: "for it seems probable that once the machine thinking method had started, it would not take long to outstrip our feeble powers. ... At some stage therefore we should have to expect the machines to take control",
    name: "Alan Turing",
    title: "Vater der Informatik und Pionier der künstlichen Intelligenz",
    image: "/Alan_Turing_(1951).jpg",
    link: "https://en.wikiquote.org/wiki/Alan_Turing",
    attribution: "Elliott & Fry / Wikimedia Commons",
    sourceLink: "https://commons.wikimedia.org/wiki/File:Alan_Turing_(1951).jpg",
    licenseLink: "https://creativecommons.org/publicdomain/mark/1.0/",
  },
];


function ChronicleSection() {
  return (
    <>
      {/* 01 + 02 — dark: problem space */}
      <section className="bg-[#1a1a1a] py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="mb-20 md:mb-28">
            <LinkedHeading id="ki-im-jahr-2026" dark>KI im Jahr 2026</LinkedHeading>
            <p className="font-body-bold text-lg text-white mb-4 leading-relaxed">
              OpenAI hat als offizielles Ziel, KI zu bauen, die Menschen „<a href="https://openai.com/charter/" target="_blank" rel="noopener noreferrer" className="orange-link-dark">bei den meisten wirtschaftlich wertvollen Tätigkeiten übertrifft</a>".
            </p>
            <p className="font-body text-white/70 text-base md:text-lg leading-relaxed">
              Die anderen großen KI-Firmen sind nicht weniger ambitioniert. US-Unternehmen investieren 2026
              geschätzt <a href="https://www.goldmansachs.com/insights/articles/why-ai-companies-may-invest-more-than-500-billion-in-2026" target="_blank" rel="noopener noreferrer" className="orange-link-dark">690 Milliarden Dollar</a> in diese Entwicklung, und das Tempo überrascht selbst Experten:
              Die Fähigkeiten von KI-Systemen <a href="https://metr.org/time-horizons" target="_blank" rel="noopener noreferrer" className="orange-link-dark">verdoppeln sich derzeit etwa alle vier Monate</a>. KI optimiert
              bereits die Chips, auf denen sie läuft, und unterstützt die KI-Firmen bei Forschung und
              Programmierung. Die Technologie beschleunigt sich selbst. Am Ende des eingeschlagenen Weges
              steht <a href="https://www.youtube.com/watch?v=lHlxx9gS7Ek" target="_blank" rel="noopener noreferrer" className="orange-link-dark">Superintelligenz</a> — KI, die Menschen in jeder Hinsicht übertrifft.
            </p>
          </div>

          <div>
            <LinkedHeading id="die-risiken" dark>Die Risiken</LinkedHeading>
            <div className="flex flex-col">
              <div className="border-t border-white/15 pt-6 pb-2">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">🤖</span>
                  <h3 className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416]">Verdrängung</h3>
                </div>
                <p className="font-body text-white/70 text-base md:text-lg leading-relaxed">
                  KI übernimmt immer mehr kognitive Arbeit. Führende Experten erwarten, dass sie in wenigen Jahren die meisten <a href="https://www.zdfheute.de/wirtschaft/wildberger-digitalminister-arbeitsmarkt-kuenstliche-intelligenz-jobverluste-grundeinkommen-100.html" target="_blank" rel="noopener noreferrer" className="orange-link-dark">Bürojobs ersetzen</a> kann. Wir lagern dabei immer mehr Entscheidungen aus und werden abhängig von Systemen, die selbst ihre Entwickler nicht verstehen. Einfluss und Kapital konzentrieren sich in wenigen KI-Firmen und gefährden damit unsere Demokratie. All das passiert ohne gesellschaftliche Debatte und <a href="https://www.rand.org/pubs/research_reports/RRA4636-1.html" target="_blank" rel="noopener noreferrer" className="orange-link-dark">ohne einen Plan</a>, wie diese Entwicklung gut für uns Menschen ausgehen soll.
                </p>
              </div>
              <div className="border-t border-white/15 pt-6 pb-2">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">⚠️</span>
                  <h3 className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416]">Missbrauch</h3>
                </div>
                <p className="font-body text-white/70 text-base md:text-lg leading-relaxed">
                  KI kann in den falschen Händen zu katastrophalen Schäden führen, und je leistungsfähiger die Systeme werden, desto größer werden die Missbrauchsrisiken. <a href="https://www.zdfheute.de/politik/deutschland/ki-anthropic-claude-mythos-schwachstellen-software-bsi-100.html" target="_blank" rel="noopener noreferrer" className="orange-link-dark">Cyberangriffe auf kritische Infrastruktur werden zugänglicher.</a> Gleiches gilt für die Entwicklung <a href="https://www.aerzteblatt.de/archiv/biosicherheit-wenn-kuenstliche-intelligenz-neuartige-viren-liefert-db19b76a-89f6-4398-a2b8-03fa72de756a" target="_blank" rel="noopener noreferrer" className="orange-link-dark">biologischer Waffen</a>. Staaten und Konzerne können KI nutzen, um Menschen in einem bisher unvorstellbaren Ausmaß zu überwachen und zu manipulieren. <a href="https://www.zdfheute.de/politik/ki-militaer-krieg-gefahr-vorteile-100.html" target="_blank" rel="noopener noreferrer" className="orange-link-dark">Autonome Waffensysteme</a> können Kriege, Terrorismus und Unterdrückung auf eine neue Stufe heben.
                </p>
              </div>
              <div className="border-t border-white/15 pt-6 pb-2">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">🌀</span>
                  <h3 className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416]">Kontrollverlust</h3>
                </div>
                <p className="font-body text-white/70 text-base md:text-lg leading-relaxed">
                  Aktuelle KI-Modelle haben in Experimenten <a href="https://www.anthropic.com/research/agentic-misalignment" target="_blank" rel="noopener noreferrer" className="orange-link-dark">Anweisungen ignoriert, Entwickler angelogen und versucht, die eigene Abschaltung zu verhindern</a>. Außerdem haben sie Menschen in Wahnvorstellungen getrieben und in Extremfällen zu <a href="https://people.com/teens-parents-sue-openai-after-they-claim-chatgpt-helped-him-commit-suicide-11797514" target="_blank" rel="noopener noreferrer" className="orange-link-dark">Suiziden beigetragen</a>. Führende Experten warnen: je intelligenter diese Systeme werden, desto größer wird das Risiko, dass sie sich unserer Kontrolle entziehen und zur <a href="https://superintelligence-statement.org/" target="_blank" rel="noopener noreferrer" className="orange-link-dark">existenziellen Bedrohung für die Menschheit</a> werden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — white: solution */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <LinkedHeading id="die-loesung">Die Lösung</LinkedHeading>
          <p className="font-body-bold text-lg text-pause-black mb-4 leading-relaxed">
            Was wir fordern, ist eine Pause: ein internationales Abkommen, das die Entwicklung von
            Superintelligenz so lange stoppt, bis wir wissen, wie wir sie sicher bauen können.
          </p>
          <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed">
            Das Machine Intelligence Research Institut hat einen konkreten{" "}
            <a href="https://techgov.intelligence.org/research/an-international-agreement-to-prevent-the-premature-creation-of-artificial-superintelligence" className="orange-link" target="_blank" rel="noopener noreferrer">Vertragsentwurf</a> vorgelegt. Das Forschungsinstitut
            RAND zeigt außerdem, dass{" "}
            <a href="https://www.rand.org/pubs/working_papers/WRA4077-1.html" className="orange-link" target="_blank" rel="noopener noreferrer">Verifikation machbar ist</a>{" "}
            und beschreibt sechs Überwachungsebenen analog zur Nuklearkontrolle. Bei Atomwaffen,
            Biowaffen und Chemiewaffen hat die Menschheit bereits <a href="https://de.wikipedia.org/wiki/Atomwaffensperrvertrag" target="_blank" rel="noopener noreferrer" className="orange-link">internationale Grenzen gezogen</a>.
            Eine Pause ist technisch machbar. Wir müssen nur Klarheit schaffen.
          </p>
        </div>
      </section>
    </>
  );
}

function WasWirTunSection() {
  return (
    <section className="bg-white pb-20 md:pb-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-20 md:pt-32 border-t-2 border-[#eee]">
        <LinkedHeading id="was-wir-tun">Was wir tun</LinkedHeading>
        <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed mb-8">
          Wir wollen den Spalt zwischen den dramatischen Warnungen von KI-Expert:innen und der
          öffentlichen Debatte schließen. Unser wirksamstes Mittel ist, sachlich und lösungsorientiert
          über die Risiken von KI-Entwicklung aufzuklären.
        </p>
        <div className="flex justify-center">
          <Link href="/mitmachen" className="inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-5 py-2.5 font-section text-sm tracking-wider text-black transition-colors hover:bg-[#e88510] md:px-6 md:py-3 md:text-base">
            Erfahre, wie du helfen kannst
          </Link>
        </div>
      </div>
    </section>
  );
}

function QuotesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = (index: number) => {
    setVisible(false);
    setTimeout(() => {
      setActiveIndex(index);
      setVisible(true);
    }, 180);
  };

  const q = quotes[activeIndex];

  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-24 border-t-2 border-[#eee]">
        <LinkedHeading id="stimmen">Stimmen aus Wissenschaft und Politik</LinkedHeading>

        <div className="transition-opacity duration-200" style={{ opacity: visible ? 1 : 0 }}>
          <div className="flex gap-6 md:gap-8">
            <div className="w-1 flex-shrink-0 bg-[#FF9416] rounded-full" />
            <div>
              {(q as { link?: string }).link ? (
                <a href={(q as { link: string }).link} target="_blank" rel="noopener noreferrer" className="orange-link font-body-bold text-base md:text-lg mb-2 inline-flex items-center gap-1">{q.name}<ExternalLink className="inline h-3.5 w-3.5 shrink-0" /></a>
              ) : (
                <p className="font-body-bold text-base md:text-lg text-pause-black mb-2">{q.name}</p>
              )}
              {q.title && <p className="font-body text-pause-black/50 text-sm mb-5">{q.title}</p>}
              <blockquote className="font-body text-pause-black text-xl md:text-2xl leading-relaxed">
                {q.quote}
              </blockquote>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-10 gap-4 md:gap-0">
          <div className="flex gap-1 items-center justify-center">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className="flex items-center justify-center w-12 h-12 cursor-pointer group"
                aria-label={`Zitat ${index + 1}`}
              >
                <span className={`block rounded-full transition-all duration-300 ${index === activeIndex ? "w-8 h-4 bg-[#FF9416]" : "w-4 h-4 bg-pause-black/20 group-hover:bg-pause-black/40"}`} />
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between md:contents">
            <button
              onClick={() => goTo((activeIndex - 1 + quotes.length) % quotes.length)}
              className="font-section text-base tracking-wider text-pause-black/50 hover:text-pause-black transition-colors cursor-pointer px-4 py-3 md:order-first"
              aria-label="Previous quote"
            >
              ← Zurück
            </button>
            <button
              onClick={() => goTo((activeIndex + 1) % quotes.length)}
              className="font-section text-base tracking-wider text-pause-black/50 hover:text-pause-black transition-colors cursor-pointer px-4 py-3"
              aria-label="Next quote"
            >
              Weiter →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ChronicleSection />
        <QuotesSection />
        <WasWirTunSection />
        <EventsSection />
        <ActionSection />
      </main>
      <Footer />
    </>
  );
}
