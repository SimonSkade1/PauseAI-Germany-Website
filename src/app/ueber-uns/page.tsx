"use client";

import Image from "next/image";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemberBlurb from "@/components/MemberBlurb";
import MemberCarousel from "@/components/MemberCarousel";
import members from "@/data/members.json";

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  const infoText = (
    <>
      PauseAI Deutschland ist Teil einer <a href="https://pauseai.info" className="orange-link-dark font-bold" target="_blank" rel="noopener noreferrer">internationalen Bewegung</a>, die sich gegen die Entwicklung gefährlicher KI-Systeme einsetzt. Wir sind parteipolitisch unabhängig.
      Unser Maßstab sind wissenschaftliche Erkenntnisse, demokratische Grundwerte und die Souveränität der Menschheit.
      Wir wollen nicht heutige KI abschaffen, sondern fordern ein globales Abkommen, das die Entwicklung unkontrollierbarer KI-Systeme verhindert.
    </>
  );

  return (
    <section className="bg-[#1a1a1a] pt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-6 sm:px-10 lg:px-16 py-8 pb-16">
        {/* Left column: Image */}
        <div className="relative overflow-hidden aspect-[1193/889] w-full">
          <Image
            src="/img_gruendung.jpg"
            alt="PauseAI Deutschland Gründung"
            width={1193}
            height={889}
            className="w-full h-full object-contain"
            priority
            onLoad={() => setIsLoaded(true)}
          />
          <div
            className="absolute inset-0 transition-[clip-path] duration-[1500ms]"
            style={{
              clipPath: isLoaded ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0)'
            }}
          >
            <Image
              src="/img_gruendung.jpg"
              alt=""
              width={1193}
              height={889}
              className="w-full h-full object-contain grayscale"
              priority
            />
          </div>
          <div
            className="absolute inset-y-0 z-[2] w-1 bg-white transition-[left] duration-[1500ms]"
            style={{
              left: isLoaded ? '100%' : '0%'
            }}
          />
        </div>

        {/* Right column: Title + Text */}
        <div className="flex flex-col justify-end">
          <h1 className="font-headline text-4xl sm:text-[2.5rem] lg:text-5xl text-white text-left leading-none mb-4">
            Wer Wir Sind
          </h1>
          <p className="text-base sm:text-lg text-gray-300 text-left">
            {infoText}
          </p>
        </div>
      </div>
    </section>
  );
}



function MembersSection() {
  return (
    <section className="bg-white py-16 sm:py-24 md:py-40">
      <div className="px-6 sm:px-10 md:px-16 lg:px-16">
        <h2 className="font-headline text-xl sm:text-2xl md:text-4xl lg:text-4xl text-black text-left mb-8 md:mb-12">
          Wir wünschen uns eine Menschliche Zukunft
        </h2>
        
        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <MemberCarousel members={members} />
        </div>
        
        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-6 gap-8 md:gap-10 lg:gap-12">
          {members.map((member, index) => (
            <div
              key={member.id}
              className={
                index === 3
                  ? "md:col-span-2 md:col-start-2"
                  : index === 4
                    ? "md:col-span-2 md:col-start-4"
                    : "md:col-span-2"
              }
            >
              <MemberBlurb
                name={member.name}
                description={member.description}
                quote={member.quote}
                image={member.image}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function UeberUns() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <MembersSection />
      </main>
      <Footer />
    </>
  );
}
