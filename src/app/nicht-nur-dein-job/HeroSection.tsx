import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="hero"
      data-section-id="hero"
      className="relative bg-[#1a1a1a] text-white pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      {/* Subtle radial accent */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] -translate-y-1/3 translate-x-1/4 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,148,22,0.18), rgba(255,148,22,0.04) 60%, transparent 80%)",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-6 md:px-12">
        <p className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-6">
          Kampagne · Frühjahr 2026
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] mb-8">
          Nicht nur dein Job.
        </h1>
        <p className="font-body text-xl md:text-2xl text-white/80 leading-relaxed mb-10 max-w-3xl">
          Wenn wir die Kontrolle über KI verlieren, steht weit mehr auf dem Spiel als unsere Jobs:
          unsere Demokratie, unsere Selbstbestimmung, unsere Existenz.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/nicht-nur-dein-job/umfrage"
            className="inline-flex items-center justify-center bg-[#FF9416] px-6 py-3 font-section text-base tracking-wider text-black transition-colors hover:bg-[#e88510]"
          >
            Erzähl deine Geschichte →
          </Link>
          <a
            href="#stimmen"
            className="inline-flex items-center justify-center border border-white/30 px-6 py-3 font-section text-base tracking-wider text-white transition-colors hover:bg-white/5"
          >
            Stimmen lesen
          </a>
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
