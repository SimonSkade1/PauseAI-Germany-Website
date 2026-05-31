import React from "react";
import { Globe, ShieldCheck, Users } from "lucide-react";
import SectionAnchor from "./SectionAnchor";

const FORDERUNGEN = [
  {
    num: "01",
    icon: Globe,
    title: "Verbindliche internationale Sicherheitsabkommen",
    body: (<>Analog zu bestehenden Regeln für{" "}
      <a href="https://de.wikipedia.org/wiki/Atomwaffensperrvertrag" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Atomwaffen</a>,{" "}
      <a href="https://de.wikipedia.org/wiki/Biowaffenkonvention" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Biowaffen</a> und{" "}
      <a href="https://de.wikipedia.org/wiki/%C3%9Cbereinkommen_von_Paris" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Klimaschutz</a>{" "}
      muss die Entwicklung gefährlicher KI begrenzt werden.</>),
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Unabhängige Sicherheitsprüfung",
    body: "Dass diese Systeme sicher sind, bevor sie gebaut und eingesetzt werden. Nicht danach.",
  },
  {
    num: "03",
    icon: Users,
    title: "Demokratische Mitsprache",
    body: "Dass wir es entscheiden, ob wir solche Systeme überhaupt wollen, und welche Rolle sie in unserer Gesellschaft spielen sollen.",
  },
];

export default function PolitischeForderungSection() {
  return (
    <section id="politische-forderung" data-section-id="politische-forderung" className="bg-pause-gray-dark py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="group/section flex items-start mb-10 md:mb-16">
        <h2 className="font-section font-black uppercase text-white text-4xl sm:text-6xl md:text-8xl leading-[0.9] scroll-mt-24">
          Was wir<br />
          <span className="text-[#FF9416]">fordern.</span>
        </h2>
        <SectionAnchor id="politische-forderung" />
        </div>

        {/* Three demands */}
        <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10 mb-10 md:mb-16">
          {FORDERUNGEN.map(({ num, icon: Icon, title, body }) => (
            <div key={num} className="relative py-8 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0">
              {/* Icon + number */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[#FF9416]">
                  <Icon size={32} strokeWidth={1.5} />
                </span>
                <span className="font-section font-black text-white/20 text-3xl leading-none">{num}</span>
              </div>

              <h3 className="font-section font-black normal-case text-white text-xl leading-tight mb-3">
                {title}
              </h3>
              <p className="text-white/60 text-sm md:text-base leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Key statement */}
        <div className="border-l-4 border-[#FF9416] pl-6 py-1 mb-8">
          <p className="text-white font-bold text-lg md:text-xl leading-relaxed">
            <span className="text-[#FF9416]">Sicherheit</span> muss bewiesen werden, bevor solche
            Systeme gebaut werden. Nicht danach.
          </p>
        </div>

        {/* Body */}
        <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-3xl">
          Niemand darf ein Atomkraftwerk bauen, bei dem unklar ist, ob es explodiert.
          Medikamente brauchen Wirksamkeitsnachweise. Flugzeuge werden zertifiziert. Es gibt
          keinen Grund, warum es ausgerechnet bei der mächtigsten Technologie unserer Zeit
          anders sein sollte.
        </p>
      </div>
    </section>
  );
}
