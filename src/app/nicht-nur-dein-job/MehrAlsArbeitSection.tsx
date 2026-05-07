import type { ReactNode } from "react";
import LinkedHeading from "@/components/LinkedHeading";

interface Pillar {
  eyebrow: string;
  title: string;
  body: ReactNode;
}

const PILLARS: Pillar[] = [
  {
    eyebrow: "Heute",
    title: "Schon ohne uns entschieden",
    body: (
      <>
        Ein privater Akteur hat gerade ein System gebaut, mit dem kritische Infrastruktur auf
        der ganzen Welt kompromittiert werden kann. Niemand hat das genehmigt. Niemand wurde
        gefragt. Auch Social Media zeigt seit fünfzehn Jahren, wohin das führt: Wahlen,
        psychische Gesundheit, öffentlicher Diskurs, geprägt von Systemen, über die nie
        demokratisch entschieden wurde.{" "}
        <a
          href="https://substack.com/home/post/p-195688893"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF9416] underline-offset-2 hover:underline"
        >
          Mehr zum Mythos-Vorfall →
        </a>
      </>
    ),
  },
  {
    eyebrow: "Morgen",
    title: "Wenn alles abgegeben wird",
    body: (
      <>
        Einzeln wirkt es harmlos, wenn KI Schulnoten vergibt, Bewerbungen sortiert oder
        Versicherungsanträge prüft. Es ist praktisch, wenn KI Nachrichten, Kultur und
        Gesetzesentwürfe erzeugt und uns vorschlägt, was wir am besten konsumieren sollten.
        Doch in Summe entsteht eine Gesellschaft, die ihre eigenen Entscheidungen nicht mehr
        trifft, ihre eigenen Systeme nicht mehr versteht und nicht mehr die Fähigkeit hat,
        gegenzusteuern. Forscher nennen das <em>graduellen Kontrollverlust</em>.{" "}
        <a
          href="https://gradual-disempowerment.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF9416] underline-offset-2 hover:underline"
        >
          Zum Forschungspapier →
        </a>
      </>
    ),
  },
  {
    eyebrow: "Übermorgen",
    title: "Systeme, die wir nicht mehr abschalten können",
    body: (
      <>
        Kein Mensch versteht ein Netzwerk, das auf dem ganzen Internet trainiert wurde.
        Heutige KI-Systeme täuschen ihre Entwickler, widersetzen sich in{" "}
        <a
          href="https://www.anthropic.com/research/agentic-misalignment"
          target="_blank"
          rel="noopener noreferrer"
          className="orange-link-dark"
        >
          Experimenten
        </a>{" "}
        aktiv dem Abschalten und verfolgen Ziele, die niemand vorgegeben hat. Das zeigt:
        Die Forscher selbst, die die Modelle trainieren, verstehen und kontrollieren sie
        nicht. Mit jeder Generation werden die KI-Modelle mächtiger und übernehmen mehr
        Aufgaben.
      </>
    ),
  },
];

export default function MehrAlsArbeitSection() {
  return (
    <section data-section-id="mehr" className="bg-[#1a1a1a] py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <LinkedHeading id="mehr" dark>
          Es geht um mehr als deinen Job
        </LinkedHeading>
        <p className="font-body text-white/75 text-lg leading-relaxed mb-12 max-w-3xl">
          Der Verlust von Arbeitsplätzen ist real. Doch er ist nur das erste Glied einer
          längeren Kette.
        </p>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {PILLARS.map((p) => (
            <div key={p.title} className="border-t border-white/15 pt-6">
              <p className="font-section text-xs tracking-[0.18em] uppercase text-[#FF9416] mb-3">
                {p.eyebrow}
              </p>
              <h3 className="font-display text-xl md:text-2xl text-white leading-snug mb-4">
                {p.title}
              </h3>
              <p className="font-body text-white/75 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
        <p className="font-body text-white/60 text-base md:text-lg leading-relaxed mt-12 max-w-3xl">
          Alle drei Stufen haben dieselbe Wurzel: Eine Handvoll Akteure entwickelt und
          veröffentlicht die mächtigste Technologie unserer Geschichte. Niemand prüft
          unabhängig, ob sie sicher ist. Niemand fragt uns, ob wir sie wollen.
        </p>
      </div>
    </section>
  );
}
