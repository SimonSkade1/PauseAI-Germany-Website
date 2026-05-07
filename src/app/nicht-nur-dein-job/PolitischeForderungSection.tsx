import Link from "next/link";
import LinkedHeading from "@/components/LinkedHeading";

export default function PolitischeForderungSection() {
  return (
    <section data-section-id="politische-forderung" className="bg-white py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <LinkedHeading id="politische-forderung">Was wir fordern</LinkedHeading>
        <p className="font-body-bold text-xl md:text-2xl text-pause-black mb-8 leading-relaxed">
          Wir fordern einen internationalen Vertrag, der das Training der mächtigsten
          allgemeinen KI-Systeme stoppt – bis wir wissen, wie wir sie sicher bauen und unter
          demokratischer Kontrolle halten können.
        </p>
        <p className="font-body-bold text-lg md:text-xl text-pause-black mb-4 leading-relaxed">
          Konkret bedeutet das, bevor solche Systeme entwickelt werden:
        </p>
        <ol className="font-body-bold text-lg md:text-xl text-pause-black mb-10 leading-relaxed list-decimal pl-6 space-y-2">
          <li>Ein verbindliches internationales Abkommen, das gefährliche KI-Entwicklung begrenzt.</li>
          <li>Unabhängige Prüfung, dass sie sicher sind.</li>
          <li>Demokratische Mitsprache darüber, ob wir sie überhaupt wollen.</li>
        </ol>
        <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed mb-10">
          Sicherheit muss bewiesen werden, <em>bevor</em> solche Systeme gebaut werden, nicht
          danach. Niemand darf ein Atomkraftwerk bauen, bei dem unklar ist, ob es explodiert.
          Bei Medikamenten, Flugzeugen, sogar bei Fahrstühlen muss gezeigt werden, dass sie
          sicher sind. Es gibt keinen Grund, warum es bei der mächtigsten Technologie unserer
          Zeit anders sein sollte.
        </p>
        <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed mb-10">
          Schreib deinem Bundestagsabgeordneten und mach klar: Das gehört auf die politische
          Agenda. Wir haben einen Brief vorbereitet, du brauchst nur noch deine eigenen Worte
          dazuzufügen.
        </p>
        <p className="font-body-bold text-base md:text-lg text-pause-black mb-10 leading-relaxed">
          Diese Entwicklung ist nicht unvermeidlich. Wir setzen uns auf der ganzen Welt dagegen
          ein.
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
          <Link
            href="/#was-du-tun-kannst"
            className="inline-flex items-center justify-center bg-[#FF9416] px-6 py-3 font-section text-base tracking-wider text-black transition-colors hover:bg-[#e88510]"
          >
            Jetzt Handeln →
          </Link>
        </div>
      </div>
    </section>
  );
}
