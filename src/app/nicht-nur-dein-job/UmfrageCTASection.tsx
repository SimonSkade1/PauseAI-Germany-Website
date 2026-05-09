import Link from "next/link";

export default function UmfrageCTASection() {
  return (
    <section id="umfrage-cta" data-section-id="umfrage-cta" className="bg-[#FF9416] py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center text-black">
        <h2 className="font-display text-4xl md:text-6xl leading-tight mb-6">
          Wo trifft KI dein Leben?
        </h2>
        <p className="font-body text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Wir sammeln Geschichten aus ganz Deutschland: Programmierer:innen, Journalist:innen,
          Lehrer:innen, Schüler:innen, Eltern, alle. Erzähl uns deine.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/nicht-nur-dein-job/umfrage"
            className="inline-flex items-center justify-center bg-[#1a1a1a] text-white px-8 py-4 font-section text-base tracking-wider transition-colors hover:bg-black"
          >
            Erzähl deine Geschichte →
          </Link>
          <a
            href="https://www.pause-ai.de/#was-du-tun-kannst"
            className="inline-flex items-center justify-center border border-black/30 px-8 py-4 font-section text-base tracking-wider text-black transition-colors hover:bg-black/[0.06]"
          >
            Erfahre wie du sonst helfen kannst →
          </a>
        </div>
      </div>
    </section>
  );
}
