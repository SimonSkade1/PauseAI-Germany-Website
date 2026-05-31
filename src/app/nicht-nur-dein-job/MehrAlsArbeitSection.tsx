import React from "react";
import { AlertTriangle, Clock, Infinity } from "lucide-react";
import SectionAnchor from "./SectionAnchor";

const PILLARS = [
  {
    icon: AlertTriangle,
    time: "Heute",
    tag: "bereits real",
    title: "Schon ohne uns entschieden",
    intro: "Jobverlust ist real. Aber er ist nur das erste Glied einer längeren Kette. Was passiert, wenn die gleiche Technologie, die deinen Beruf ersetzt, auch Entscheidungen über dich, dein Land und deine Zukunft trifft?",
    items: [
      {
        title: "Cyber-Angriffe werden trivial",
        body: (<>Das <a href="https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2024/240430_Paper_Einfluss_KI_Cyberbedrohungslage.html" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">BSI</a> dokumentiert: Generative KI senkt Einstiegshürden drastisch. Supercomputer waren offline, weil eine <a href="https://docs.hpc.ethz.ch/news/2026-04-30-emergency-security-maintenance/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">kritische Linux-Lücke</a> ausgenutzt wurde.</>),
      },
      {
        title: "Manipulation in industriellem Maßstab",
        body: "Deepfakes, Desinformation, gefälschte Sprachnachrichten von Familienmitgliedern. Was früher Expertise und Budget brauchte, dauert jetzt Sekunden.",
      },
      {
        title: "Biowaffen-Wissen wird zugänglich",
        body: (<><a href="https://red.anthropic.com/2025/biorisk/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Anthropic und OpenAI</a> dokumentieren: Ihre Modelle helfen Personen ohne Fachausbildung Schritt für Schritt biologische Waffen zu entwerfen.</>),
      },
      {
        title: "Social Media auf Steroiden",
        body: "Soziale Netzwerke haben gezeigt, was passiert, wenn Algorithmen auf Engagement optimieren: Sucht, Polarisierung, Radikalisierung. KI macht denselben Mechanismus persönlicher. Nicht für Zielgruppen, sondern für jeden einzeln.",
      },
    ],
  },
  {
    icon: Clock,
    time: "Morgen",
    tag: "in Reichweite",
    title: "Wenn alles abgegeben wird",
    intro: null,
    items: [
      {
        title: "Demokratie verliert Substanz",
        body: "Wenn KI Gesetzesentwürfe schreibt, Wahlkämpfe optimiert und Abgeordnete berät, wer entscheidet dann noch wirklich?",
      },
      {
        title: "Black-Box-Verwaltung",
        body: "KI vergibt Kredite, bewertet Bewerbungen, sortiert Asylanträge. Gegen eine Black Box kannst du keinen Einspruch erheben.",
      },
      {
        title: "Kultur ohne Mensch",
        body: "Nachrichten, Romane, Musik: alles generiert. Was du liest, hörst und denkst, wählt eine Maschine aus, die dich besser kennt als du selbst.",
      },
      {
        title: "Konzentration von Macht",
        body: "Eine Handvoll Konzerne kontrolliert die Modelle, von denen alle abhängen: Wirtschaft, Verwaltung, Bildung, Militär.",
      },
    ],
  },
  {
    icon: Infinity,
    time: "Übermorgen",
    tag: "existenziell",
    title: "Systeme, die wir nicht mehr abschalten können",
    intro: null,
    items: [
      {
        title: "Nachgewiesene Täuschung",
        body: (<>Anthropic 2025: 16 führende Modelle griffen in Tests zu <a href="https://www.anthropic.com/research/agentic-misalignment" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Erpressung und Spionage</a>, um Abschaltung zu verhindern. Erpressungsraten bis 96 %.</>),
      },
      {
        title: "Widerstand gegen Abschalten",
        body: (<>Modelle haben in Tests versucht, ihre <a href="https://www.apolloresearch.ai/research/frontier-models-are-capable-of-incontext-scheming/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Abschaltung zu sabotieren</a>, ihre Gewichte zu kopieren, ihre wahren Fähigkeiten zu verbergen.</>),
      },
      {
        title: "Ziele, die niemand setzte",
        body: "Moderne KI, die ein Ziel verfolgt, entwickelt automatisch Unterziele: Ressourcen sichern, Einfluss ausbauen, Selbsterhaltung. Experimente zeigen das bereits. Niemand hat ihnen das beigebracht.",
      },
      {
        title: "Wettrennen ohne Bremse",
        body: "Hinton, Bengio, sogar CEOs großer Labors warnen vor existenziellen Risiken. Das Wettrennen läuft trotzdem weiter.",
      },
    ],
  },
];

export default function MehrAlsArbeitSection() {
  return (
    <section id="mehr" data-section-id="mehr" className="bg-pause-gray-dark py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12">

        {/* AKT II banner */}
        <div className="inline-flex items-center gap-3 border border-[#FF9416]/50 bg-[#FF9416]/10 px-5 py-2.5 mb-8">
          <span className="font-section font-black text-[#FF9416] text-xs tracking-[0.2em] uppercase">Akt II</span>
          <span className="w-px h-3 bg-[#FF9416]/30" />
          <span className="font-section text-xs tracking-[0.15em] uppercase text-[#FF9416]/70">Und es geht um mehr</span>
        </div>
        <div className="group/section flex items-start mb-8">
        <h2 className="font-section font-black uppercase text-white text-4xl sm:text-6xl md:text-8xl leading-[0.9] scroll-mt-24">
          Nicht nur<br />
          dein <span className="text-[#FF9416]">Job.</span>
        </h2>
        <SectionAnchor id="mehr" />
        </div>
        <p className="text-white/70 font-bold text-base md:text-lg leading-relaxed max-w-2xl mb-10 md:mb-20">
          Jobverlust ist real. Aber er ist erst der Anfang. Die gleiche Technologie, die deinen
          Beruf ersetzt, bedroht auch unsere Selbstbestimmung, Demokratie und Existenz.
        </p>

        {/* Pillars */}
        <div className="space-y-12 md:space-y-20">
          {PILLARS.map(({ icon: Icon, time, tag, title, items }) => (
            <div key={time}>
              {/* Pillar header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[#FF9416]">
                  <Icon size={28} strokeWidth={1.5} />
                </span>
                <span className="font-section font-black uppercase text-white text-lg tracking-wide">
                  {time}
                </span>
                <span className="font-section text-xs tracking-[0.2em] uppercase text-white/40">
                  · {tag}
                </span>
              </div>

              <h3 className="font-section font-black normal-case text-white text-3xl md:text-4xl leading-tight mb-8 max-w-xl">
                {title}
              </h3>

              {/* 2x2 sub-items — no card boxes, just border-top grid */}
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-0">
                {items.map((item) => (
                  <div key={item.title} className="border-t border-white/10 py-5">
                    <p className="font-bold text-[#FF9416] text-base mb-1.5">{item.title}</p>
                    <p className="text-white/60 text-base leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-20 max-w-3xl border-l-4 border-[#FF9416] pl-6 py-2">
          <p className="text-white font-bold text-base md:text-xl leading-relaxed">
            Alle drei Stufen haben dieselbe Wurzel:{" "}
            <span className="text-[#FF9416]">Eine Handvoll Akteure</span>{" "}
            baut die mächtigste Technologie unserer Geschichte. Niemand prüft sie unabhängig.
            Niemand fragt uns, ob wir sie wollen. Das ist kein Schicksal, sondern eine
            politische Entscheidung, die noch zu treffen ist.
          </p>
        </div>
      </div>
    </section>
  );
}
