import Link from "next/link";

export default function DankeSection() {
  return (
    <div className="py-12 md:py-16" data-testid="danke">
      <div className="text-center">
        <p className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-4">
          Eingegangen
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-pause-black mb-4">Danke!</h2>
        <p className="font-body text-pause-black/75 text-lg mb-10 max-w-md mx-auto">
          Wir lesen jede Geschichte. Wenn du kontaktiert werden möchtest, melden wir uns.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-pause-black/[0.03] border border-pause-black/10 p-6 md:p-8 mb-10">
        <p className="font-section text-xs tracking-[0.18em] uppercase text-[#FF9416] mb-3">
          Magst du tiefer gehen?
        </p>
        <h3 className="font-body-bold text-lg md:text-xl text-pause-black mb-3 leading-tight">
          Erzähl deine ganze Geschichte – mit Foto, Video und Pressefreigabe.
        </h3>
        <p className="font-body text-pause-black/75 text-base leading-relaxed mb-5">
          Die kurze Umfrage gibt uns Eckdaten. Im längeren Format gehen die Geschichten in die
          globale PauseAI-Sammlung und können – mit deiner Freigabe – in Pressearbeit, Social
          Media und Gesprächen mit Politiker:innen verwendet werden.
        </p>
        <Link
          href="/nicht-nur-dein-job/erzaehlung"
          className="inline-flex items-center justify-center bg-[#1a1a1a] text-white px-5 py-2.5 font-section text-sm tracking-wider transition-colors hover:bg-black"
        >
          Zur ausführlichen Geschichte →
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/nicht-nur-dein-job#stimmen"
          className="inline-flex items-center justify-center bg-[#FF9416] px-6 py-3 font-section text-base tracking-wider text-black transition-colors hover:bg-[#e88510]"
        >
          Andere Stimmen lesen →
        </Link>
        <Link
          href="/contactlawmakers"
          className="inline-flex items-center justify-center border border-pause-black/20 px-6 py-3 font-section text-base tracking-wider text-pause-black transition-colors hover:bg-pause-black/[0.03]"
        >
          Schreib deinem Abgeordneten
        </Link>
      </div>
    </div>
  );
}
