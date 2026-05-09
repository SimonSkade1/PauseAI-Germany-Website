import LinkedHeading from "@/components/LinkedHeading";

export default function PolitischeForderungSection() {
  return (
    <section data-section-id="politische-forderung" className="bg-white py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <LinkedHeading id="politische-forderung">Was wir fordern</LinkedHeading>
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
        <p className="font-body-bold text-base md:text-lg text-pause-black mb-10 leading-relaxed">
          Diese Entwicklung ist nicht unvermeidlich. Wir setzen uns auf der ganzen Welt dagegen
          ein.
        </p>
      </div>
    </section>
  );
}
