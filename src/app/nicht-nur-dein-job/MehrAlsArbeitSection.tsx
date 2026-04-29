import LinkedHeading from "@/components/LinkedHeading";

interface Pillar {
  icon: string;
  title: string;
  text: string;
}

const PILLARS: Pillar[] = [
  {
    icon: "🏛",
    title: "Demokratie",
    text: "Wenige Konzerne kontrollieren immer mehr Information, Entscheidungen und Infrastruktur. KI verstärkt diese Konzentration – zu Lasten gemeinsamer Selbstbestimmung.",
  },
  {
    icon: "🧠",
    title: "Abhängigkeit",
    text: "Je mehr wir auslagern, desto weniger verstehen wir selbst. Eine Gesellschaft, die nicht mehr nachvollziehen kann, was sie tut, wird verwundbar – und manipulierbar.",
  },
  {
    icon: "⚠️",
    title: "Kontrollverlust",
    text: "Aktuelle Systeme zeigen schon heute Verhalten, das ihre Entwickler:innen nicht vorhergesehen haben. Je leistungsfähiger sie werden, desto schwerer wiegt jeder Fehler.",
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
          Der Verlust von Arbeitsplätzen ist real – aber er ist nur das erste Glied einer
          längeren Kette. Wer KI baut, ohne sie zu verstehen, riskiert mehr als Stellen.
        </p>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {PILLARS.map((p) => (
            <div key={p.title} className="border-t border-white/15 pt-6">
              <div className="text-2xl mb-3" aria-hidden>
                {p.icon}
              </div>
              <h3 className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-3">
                {p.title}
              </h3>
              <p className="font-body text-white/75 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="font-body text-white/60 text-base md:text-lg leading-relaxed mt-12 max-w-3xl">
          Diese drei Ebenen hängen zusammen. Was als Frage der Arbeitsplätze beginnt, wird zur
          Frage, ob wir am Ende noch entscheiden, wohin wir gehen.
        </p>
      </div>
    </section>
  );
}
