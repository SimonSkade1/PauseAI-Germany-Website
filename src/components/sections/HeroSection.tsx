import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-start overflow-hidden pt-32 md:pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/earth-europe.png"
          alt="Earth from space showing Europe"
          fill
          sizes="100vw"
          className="object-cover object-[25%_center] md:object-center"
          priority
          unoptimized
        />
      </div>
      <div className="relative z-10 w-full flex justify-center px-6 md:justify-end md:px-12 lg:px-20 xl:px-32 pt-[5vh] md:pt-[30vh]">
        <div className="text-center md:text-right">
          <h1 className="font-headline text-2xl text-white mb-6 md:text-5xl lg:text-5xl xl:text-6xl animate-fade-in-up">
            Wir können den <br />KI-Kontrollverlust<br /> noch verhindern
          </h1>
          <div className="animate-fade-in-up delay-200">
            <Link
              href="/mitmachen"
              className="inline-flex items-center justify-center border border-white bg-[#FF9416] px-5 py-2.5 font-section text-sm tracking-wider text-black transition-colors hover:bg-[#e88510] md:px-6 md:py-3 md:text-base"
            >
              Erfahre, wie du helfen kannst
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
