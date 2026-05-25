import Link from "next/link";
import Image from "next/image";

export default function HeroSection({ description }: { description: string }) {
  return (
    <section
      id="hero"
      data-section-id="hero"
      className="relative bg-[#FF9416] overflow-hidden md:min-h-screen"
    >
      {/* Image — absolute right side on all screens, overlaps content */}
      <div className="absolute top-32 right-0 w-[48%] md:top-0 md:w-1/2 h-full">
        <Image
          src="/images/campaing-people-banner.png"
          alt="Menschen, die ihren Job durch KI verloren haben"
          fill
          priority
          className="object-contain object-top grayscale"
          sizes="(max-width: 768px) 48vw, 50vw"
        />
      </div>

      {/* Content — sits in front of image */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="md:w-1/2 pt-20 pb-10 md:pt-44 md:pb-20">

          {/* Akt I badge */}
          <div className="inline-flex items-center gap-3 bg-[#1a1a1a] px-4 py-2 mb-4 md:mb-8">
            <span className="font-section font-black text-[#FF9416] text-xs tracking-[0.2em] uppercase">Akt I</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="font-section text-xs tracking-[0.15em] uppercase text-white/60">Du bist nicht allein</span>
          </div>

          {/* Title — full width on mobile, left half on desktop */}
          <h1 className="font-section text-[clamp(4.2rem,12vw,7.5rem)] leading-[0.88] font-black uppercase text-[#1a1a1a] tracking-tight mb-4 md:mb-6">
            Nicht<br />
            nur<br />
            <span className="text-white">dein</span><br />
            Job.
          </h1>

          <p className="font-bold text-[#1a1a1a] text-sm md:text-lg leading-relaxed max-w-lg mb-2 md:mb-3">
            Überall in Deutschland verlieren Menschen gerade ihre Arbeit an KI —
            und das ist erst der Anfang einer Welle, die durch jedes Berufsfeld läuft.
          </p>

          <p className="font-bold text-[#1a1a1a] text-sm md:text-lg leading-relaxed max-w-lg mb-2 md:mb-4">
            Wenn wir die Kontrolle über KI verlieren, steht weit mehr auf dem
            Spiel als unsere Jobs: unsere Selbstbestimmung, unsere Demokratie, unsere Existenz.
          </p>

          <p className="font-black text-[#1a1a1a] text-sm md:text-lg mb-5 md:mb-10">
            Du bist nicht allein. Und du bist nicht machtlos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              href="/nicht-nur-dein-job/umfrage"
              className="inline-flex items-center justify-center bg-[#1a1a1a] text-white px-7 py-3.5 md:py-4 text-base font-bold tracking-wide hover:bg-black transition-colors"
            >
              Erzähl deine Geschichte →
            </Link>
            <Link
              href="#counter"
              className="inline-flex items-center justify-center border-2 border-[#1a1a1a] text-[#1a1a1a] px-7 py-3.5 md:py-4 text-base font-bold tracking-wide hover:bg-[#1a1a1a]/10 transition-colors"
            >
              Was steht auf dem Spiel ↓
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
