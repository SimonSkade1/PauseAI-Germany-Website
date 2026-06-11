import React from "react";
import { Eye, BellOff, Layers } from "lucide-react";
import SectionAnchor from "./SectionAnchor";

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
    {children}
  </a>
);

const WAVES = [
  {
    num: "01",
    icon: Eye,
    time: "Heute",
    title: "Direkte Entlassungen",
    body: (
      <>
        <A href="https://www.euronews.com/business/2025/05/14/microsoft-slashes-6000-jobs-as-it-clears-the-way-for-ai-investments">Microsoft kündigt 6.000 Stellen</A> mit Verweis auf KI-Investitionen.{" "}
        <A href="https://thenextweb.com/news/meta-layoffs-8000-zuckerberg-ai-reality-may-2026">Meta entlässt 8.000 Mitarbeiter</A>; Zuckerberg sagt, Aufgaben für ganze Teams würden heute von einer einzigen Person erledigt.{" "}
        <A href="https://www.cnbc.com/2026/04/15/snap-stock-layoffs-16-percent-workforce.html">Snap kürzt 16 % der Belegschaft</A>, weil 65 % des neuen Codes intern bereits von KI geschrieben wird.
      </>
    ),
    quote: "Wer kann, schreibt KI als Grund nicht mehr in die offizielle Begründung.",
    pad: "md:pr-10",
  },
  {
    num: "02",
    icon: BellOff,
    time: "Morgen",
    title: "Wer gar nicht erst eingestellt wird",
    body: "Berufseinstieg, Praktika, Trainee-Stellen, Junior-Positionen: genau die Aufgaben, an denen man früher gelernt hat, übernimmt jetzt ein Modell. Eine ganze Generation steht vor verschlossenen Türen, ohne dass das je offiziell kommuniziert wurde.",
    quote: (
      <>
        Nur <A href="https://www.forschung-und-lehre.de/zeitfragen/jugend-in-deutschland-2026-ein-fuenftel-will-auswandern-7606">32 % der jungen Menschen</A> glauben, ein Studium sichere bessere Berufschancen.
      </>
    ),
    pad: "md:px-10",
  },
  {
    num: "03",
    icon: Layers,
    time: "Übermorgen",
    title: "Was bleibt, verändert sich",
    body: "Auch wer seinen Job behält, arbeitet zunehmend als Aufsicht einer Maschine: überwacht KI-Output, korrigiert Fehler, trägt die Verantwortung für Entscheidungen, die andere getroffen haben. Die eigene Kompetenz verkümmert.",
    quote: "Und wenn dein Job morgen anders aussieht als heute: Wer trägt das Risiko? Du.",
    pad: "md:pl-10",
  },
];

export default function ArbeitsmarktSection() {
  return (
    <section id="arbeitsmarkt" data-section-id="arbeitsmarkt" className="bg-pause-gray-dark py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="group/section flex items-start mb-16">
        <h2 id="arbeitsmarkt-heading" className="font-section font-black normal-case text-white text-4xl md:text-5xl leading-[1.08] max-w-3xl scroll-mt-24">
          Der Arbeitsmarkt verändert sich{" "}
          <span className="text-[#FF9416]">auf drei Ebenen</span>{" "}
          gleichzeitig.
        </h2>
        <SectionAnchor id="arbeitsmarkt" />
        </div>

        {/* Three columns */}
        <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {WAVES.map(({ num, icon: Icon, time, title, body, quote, pad }) => (
            <div key={num} className={`relative ${pad} py-12 md:py-0`}>
              {/* Icon + time label */}
              <div className="relative flex items-center gap-3 mb-6">
                <span className="text-[#FF9416] relative z-10">
                  <Icon size={40} strokeWidth={1.2} />
                </span>
                <span className="font-section text-xs tracking-[0.2em] uppercase text-white/50 relative z-10">
                  {time}
                </span>
                <span
                  aria-hidden
                  className="absolute right-0 top-1/2 -translate-y-1/2 font-section font-black text-[6rem] leading-none text-white/[0.03] select-none pointer-events-none whitespace-nowrap"
                >
                  {num}
                </span>
              </div>
              <h3 className="font-section font-black normal-case text-white text-2xl md:text-3xl leading-tight mb-5">
                {title}
              </h3>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6">
                {body}
              </p>
              <p className="text-white font-bold text-base leading-relaxed border-l-2 border-[#FF9416] pl-4">
                {quote}
              </p>
            </div>
          ))}
        </div>

        {/* Footer stat — centered */}
        <p className="text-white/60 text-base md:text-lg leading-relaxed mt-16 text-center max-w-3xl mx-auto">
          Und das ist konservativ gerechnet. Bundesdigitalminister{" "}
          <a href="https://www.zdfheute.de/wirtschaft/wildberger-digitalminister-arbeitsmarkt-kuenstliche-intelligenz-jobverluste-grundeinkommen-100.html" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Wildberger</a>{" "}
          warnt offen vor Jobverlusten „auch in hochqualifizierten Berufen wie
          Informatik und Mathematik". Das{" "}
          <a href="https://www.ifo.de/en/facts/2026-04-29/job-cuts-intensify-germany-april-2026" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">ifo-Beschäftigungsbarometer</a>{" "}
          ist auf dem tiefsten Stand seit Mai 2020 gefallen.{" "}
          <strong className="text-white">
            <a href="https://www.iwkoeln.de/presse/pressemitteilungen/michael-groemling-jedes-dritte-unternehmen-plant-2026-stellen-abzubauen.html" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">36 %</a> der deutschen Unternehmen planen 2026 Stellenabbau
          </strong>{" "}
          In der Industrie sogar 41 %.
        </p>
      </div>
    </section>
  );
}
