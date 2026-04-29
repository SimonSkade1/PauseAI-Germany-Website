import Link from "next/link";

export default function UmfrageCTASection() {
  return (
    <section id="umfrage-cta" data-section-id="umfrage-cta" className="bg-[#FF9416] py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center text-black">
        <p className="font-section text-sm tracking-[0.18em] uppercase mb-4">
          Die große Umfrage
        </p>
        <h2 className="font-display text-4xl md:text-6xl leading-tight mb-6">
          Wie verändert KI deinen Beruf?
        </h2>
        <p className="font-body text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Wir sammeln Geschichten aus dem deutschen Arbeitsmarkt – von Lehrer:innen,
          Programmierer:innen, Designer:innen, Buchhalter:innen, allen. Erzähl uns deine.
        </p>
        <Link
          href="/nicht-nur-dein-job/umfrage"
          className="inline-flex items-center justify-center bg-[#1a1a1a] text-white px-8 py-4 font-section text-base tracking-wider transition-colors hover:bg-black"
        >
          Zur Umfrage →
        </Link>
      </div>
    </section>
  );
}
