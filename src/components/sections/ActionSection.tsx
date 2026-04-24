"use client";

import Link from "next/link";

export default function ActionSection() {
  const cardClass = "group flex bg-white p-6 md:p-8 border border-[#1a1a1a] md:border-2 cursor-pointer hover:bg-[#FFFAF5] transition-colors min-h-[190px]";

  return (
    <section id="was-du-tun-kannst" className="bg-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="font-headline text-2xl text-pause-black text-center mb-12 md:text-4xl lg:text-5xl">Was du tun kannst</h2>
        <div className="space-y-6">
          <Link href="/mitmachen" className={cardClass}>
            <div className="flex items-start md:gap-4 flex-1">
              <span className="hidden md:block text-[#FF9416] text-4xl md:text-5xl flex-shrink-0 leading-none mt-[-0.32em] transition-transform group-hover:translate-x-2">→</span>
              <div className="flex-1 flex flex-col h-full">
                <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">Werde Teil der <span className="text-[#FF9416] border-b-2 border-transparent group-hover:border-[#FF9416] transition-colors">Bewegung</span></h3>
                <p className="font-body text-pause-black/80 text-base mt-auto text-right">Lerne uns kennen und erfahre, wie du mitmachen kannst.</p>
              </div>
            </div>
          </Link>

          <a href="/aktionen" className={cardClass}>
            <div className="flex items-start md:gap-4 flex-1">
              <span className="hidden md:block text-[#FF9416] text-4xl md:text-5xl flex-shrink-0 leading-none mt-[-0.32em] transition-transform group-hover:translate-x-2">→</span>
              <div className="flex-1 flex flex-col h-full">
                <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">Werde jetzt <span className="text-[#FF9416] border-b-2 border-transparent group-hover:border-[#FF9416] transition-colors">aktiv</span></h3>
                <p className="font-body text-pause-black/80 text-base mt-auto text-right">Erledige sofort kleine oder große Aktionen.</p>
              </div>
            </div>
          </a>

          <Link href="/contactlawmakers" className={cardClass}>
            <div className="flex items-start md:gap-4 flex-1">
              <span className="hidden md:block text-[#FF9416] text-4xl md:text-5xl flex-shrink-0 leading-none mt-[-0.32em] transition-transform group-hover:translate-x-2">→</span>
              <div className="flex-1 flex flex-col h-full">
                <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">Kontaktiere deine:n <span className="text-[#FF9416] border-b-2 border-transparent group-hover:border-[#FF9416] transition-colors">Abgeordnete:n</span></h3>
                <p className="font-body text-pause-black/80 text-base mt-auto text-right">Finde deine:n Abgeordnete:n mit unserem Tool und nutze unsere Mailvorlage.</p>
              </div>
            </div>
          </Link>

          <a href="mailto:germany@pauseai.info" className={cardClass}>
            <div className="flex items-start md:gap-4 flex-1">
              <span className="hidden md:block text-[#FF9416] text-4xl md:text-5xl flex-shrink-0 leading-none mt-[-0.32em] transition-transform group-hover:translate-x-2">→</span>
              <div className="flex-1 flex flex-col h-full">
                <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">Spenden</h3>
                <p className="font-body text-pause-black/80 text-base mt-auto text-right">
                  Deine Spende bringt uns weiter. Bei Interesse kontaktiere{" "}
                  <span className="text-[#FF9416] border-b-2 border-transparent group-hover:border-[#FF9416] transition-colors font-body-bold">germany@pauseai.info</span>
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
