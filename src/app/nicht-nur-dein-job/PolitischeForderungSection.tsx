import Link from "next/link";
import LinkedHeading from "@/components/LinkedHeading";

export default function PolitischeForderungSection() {
  return (
    <section data-section-id="politische-forderung" className="bg-white py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <LinkedHeading id="politische-forderung">Was wir fordern</LinkedHeading>
        <p className="font-body-bold text-lg md:text-xl text-pause-black mb-6 leading-relaxed">
          Kein KI-System, das den Menschen in vielen Aufgaben übertrifft, sollte ohne unabhängige
          Sicherheitsprüfung entwickelt werden – wirtschaftlich, sozial, politisch.
        </p>
        <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed mb-10">
          Sicherheit muss bewiesen werden, <em>bevor</em> solche Systeme freigegeben werden – nicht
          danach. Das ist bei Medikamenten selbstverständlich. Bei Atomkraft. Bei Flugzeugen. Es
          gibt keinen Grund, warum es bei der mächtigsten Technologie unserer Zeit anders sein
          sollte.
        </p>
        <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed mb-10">
          Schreib deinem Bundestagsabgeordneten und mach klar: Das gehört auf die politische
          Agenda. Wir haben einen Brief vorbereitet – du brauchst nur noch deine eigenen Worte
          dazuzufügen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contactlawmakers"
            className="inline-flex items-center justify-center bg-[#FF9416] px-6 py-3 font-section text-base tracking-wider text-black transition-colors hover:bg-[#e88510]"
          >
            Schreib deinem Abgeordneten →
          </Link>
          <Link
            href="/appell"
            className="inline-flex items-center justify-center border border-pause-black/20 px-6 py-3 font-section text-base tracking-wider text-pause-black transition-colors hover:bg-pause-black/[0.03]"
          >
            Den Appell unterzeichnen
          </Link>
        </div>
      </div>
    </section>
  );
}
