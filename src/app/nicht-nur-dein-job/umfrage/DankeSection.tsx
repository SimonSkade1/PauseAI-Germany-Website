import Link from "next/link";

export default function DankeSection() {
  return (
    <div className="text-center py-12 md:py-16" data-testid="danke">
      <p className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-4">
        Eingegangen
      </p>
      <h2 className="font-display text-3xl md:text-5xl text-pause-black mb-4">Danke!</h2>
      <p className="font-body text-pause-black/75 text-lg mb-10 max-w-md mx-auto">
        Wir lesen jede Geschichte. Wenn du kontaktiert werden möchtest, melden wir uns.
      </p>
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
