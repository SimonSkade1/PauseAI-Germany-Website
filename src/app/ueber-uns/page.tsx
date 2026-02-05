"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemberBlurb from "@/components/MemberBlurb";
import MemberCarousel from "@/components/MemberCarousel";
import TitleTextBlock from "@/components/TitleTextBlock";
import members from "@/data/members.json";

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger the sweep animation after component mounts
    setIsLoaded(true);
  }, []);

  const infoText = (
    <>
      PauseAI Deutschland ist Teil einer <a href="https://pauseai.info" className="orange-link font-bold" target="_blank" rel="noopener noreferrer">internationalen Bewegung</a>, die sich gegen die Entwicklung gefährlicher KI-Systeme einsetzt. Wir sind parteipolitisch unabhängig, aber nicht wertneutral.
      Unser Maßstab sind wissenschaftliche Erkenntnisse, demokratische Grundwerte und die Souveränität der Menschheit.
    </>
  );

  return (
    <section className="bg-[#1a1a1a] min-h-screen lg:h-screen pt-20">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 px-6 sm:px-10 lg:px-16 h-full lg:justify-items-center lg:justify-center pt-6 lg:pt-8 pb-10 lg:pb-24">
        {/* Left column: Hero Image + Description (on narrow two-column) */}
        <div className="flex flex-col w-full sm:max-lg:flex-row sm:max-lg:flex-wrap lg:max-w-[min(calc(50vw-6rem),700px)] lg:self-start">
          {/* Hero Image */}
          <div className="relative overflow-hidden w-full sm:max-lg:w-1/2 sm:max-lg:float-right sm:max-lg:ml-auto aspect-[1193/889]">
            {/* Color image (bottom layer) */}
            <Image
              src="/img_gruendung.jpg"
              alt="PauseAI Germany Gründung"
              width={1193}
              height={889}
              className="w-full h-full object-contain"
              priority
            />
            
            {/* Grayscale image overlay with clip-path animation */}
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
            
            {/* White bar at the grayscale/color edge */}
            <div 
              className="absolute inset-y-0 z-[2] w-1 bg-white transition-[left] duration-[1500ms]"
              style={{
                left: isLoaded ? '100%' : '0%'
              }}
            />
          </div>

          {/* Info text below image - only visible on two-column layout below hero-wide (1446px) */}
          <p className="hero-info-left text-base sm:text-lg lg:text-lg text-gray-300 text-left mt-6">
            {infoText}
          </p>
        </div>

        {/* Right column: Title + Description (on wide/single-column) + Links */}
        <div className="flex flex-col items-start w-full lg:flex-none lg:aspect-[1193/889] lg:max-w-[min(calc(50vw-6rem),700px)] lg:overflow-hidden lg:self-end lg:justify-end">
          <h1 className="font-headline text-4xl sm:text-[2.5rem] lg:text-5xl text-white text-left leading-none mt-[-0.41em]">
            Wer Wir Sind
          </h1>

          
          {/* Info text below title - visible on single-column (< lg) AND on wide screens (>= 1446px) */}
          <p className="hero-info-right text-base sm:text-lg lg:text-lg text-gray-300 mt-4 text-left">
            {infoText}
          </p>
          
          {/* Navigation Boxes - hidden on small mobile, shown on tablet (sm) and up */}
          <div className="hidden sm:grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 w-full flex-1">
            <a href="#unser-ziel" className="group border-2 border-[#FF9416] px-4 py-2 sm:py-3 relative hover:bg-[#FF9416]/10 transition-all">
              <span className="font-headline text-lg sm:text-lg 3xl:text-xl text-white">Unser Ziel</span>
              <span className="text-[#FF9416] transition-transform group-hover:translate-y-1 absolute bottom-2 right-2 text-xl sm:text-xl 3xl:text-2xl">↓</span>
            </a>
            <a href="#unser-ansatz" className="group border-2 border-[#FF9416] px-4 py-2 sm:py-3 relative hover:bg-[#FF9416]/10 transition-all">
              <span className="font-headline text-lg sm:text-lg 3xl:text-xl text-white">Unser Ansatz</span>
              <span className="text-[#FF9416] transition-transform group-hover:translate-y-1 absolute bottom-2 right-2 text-xl sm:text-xl 3xl:text-2xl">↓</span>
            </a>
            <a href="#was-wir-tun" className="group border-2 border-[#FF9416] px-4 py-2 sm:py-3 relative hover:bg-[#FF9416]/10 transition-all">
              <span className="font-headline text-lg sm:text-lg 3xl:text-xl text-white">Was wir tun</span>
              <span className="text-[#FF9416] transition-transform group-hover:translate-y-1 absolute bottom-2 right-2 text-xl sm:text-xl 3xl:text-2xl">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function UebersichtSection() {
  return (
    <section className="sm:hidden bg-[#1a1a1a] py-8 px-6">
      <h2 className="font-headline text-2xl text-white mb-6">Übersicht</h2>
      <div className="flex flex-col gap-4">
        <a href="#unser-ziel" className="group border border-[#FF9416] px-4 py-3 relative hover:bg-[#FF9416]/10 transition-all">
          <span className="font-headline text-lg text-white">Unser Ziel</span>
          <span className="text-[#FF9416] transition-transform group-hover:translate-y-1 absolute bottom-2 right-2 text-xl">↓</span>
        </a>
        <a href="#unser-ansatz" className="group border border-[#FF9416] px-4 py-3 relative hover:bg-[#FF9416]/10 transition-all">
          <span className="font-headline text-lg text-white">Unser Ansatz</span>
          <span className="text-[#FF9416] transition-transform group-hover:translate-y-1 absolute bottom-2 right-2 text-xl">↓</span>
        </a>
        <a href="#was-wir-tun" className="group border border-[#FF9416] px-4 py-3 relative hover:bg-[#FF9416]/10 transition-all">
          <span className="font-headline text-lg text-white">Was wir tun</span>
          <span className="text-[#FF9416] transition-transform group-hover:translate-y-1 absolute bottom-2 right-2 text-xl">↓</span>
        </a>
      </div>
    </section>
  );
}

function ContentSection() {
  return (
    <section className="bg-white py-16 sm:py-24 md:py-40">
      <div className="px-6 sm:px-10 md:px-16 lg:px-16 space-y-20 sm:space-y-32 md:space-y-48">
        {/* Unser Ziel */}
        <TitleTextBlock
          id="unser-ziel"
          smallHeading="Unser Ziel"
          largeHeading="Kontrollverlust verhindern"
          text={
            <>
            Milliardeninvestitionen fließen in den Wettlauf um die erste künstliche Intelligenz, die alle menschlichen Fähigkeiten übertrifft. Weltweit anerkannte KI-Experten  warnen, dass dies zur Auslöschung der Menschheit führen könnte. Selbst wenn der schlimmste Fall nicht eintreten sollte, birgt KI katastrophale Risiken.
            <br />
            <br />
            Unser Ziel ist ein internationales Abkommen, das die unkontrollierte Weiterentwicklung von künstlicher Intelligenz weltweit pausiert, bis angemessene Sicherheitsvorkehrungen implementiert wurden. Wir unterstützen die Etablierung verbindlicher <a href="https://red-lines.ai/" target="_blank" rel="noopener noreferrer" className="orange-link font-body-bold">roter Linien</a>, etwa bei der Entwicklung von Systemen, die sich eigenständig selbst verbessern können. Der <a href="https://ifanyonebuildsit.com/treaty" target="_blank" rel="noopener noreferrer" className="orange-link font-body-bold">Entwurf</a> des Machine Intelligence Research Institutes zeigt, wie dieses Abkommen aussehen könnte.
            </>
          }
          className="scroll-mt-24"

        />

        {/* Unser Ansatz */}
        <TitleTextBlock
          id="unser-ansatz"
          smallHeading="Unser Ansatz"
          largeHeading="Schutzinteressen bündeln"
          text={
            <>
              Sobald KI sich nicht mehr von Menschen kontrollieren lässt, ist das eine Gefahr für uns alle. Das bedeutet, dass jedes Land sich nur durch internationale Kooperation schützen kann. Für dieses gemeinsame Interesse möchten wir das Bewusstsein wecken. 
              <br />
              <br />

              Die fortschreitende KI-Entwicklung verschärft zahlreiche Probleme von der Verdrängung sozialer Beziehungen bis hin zu vollautomatischer Kriegsführung, Totalüberwachung und extremer Ungleichheit. Wir unterstützen jede vernünftige Initiative, die den Schaden, der schon heute durch KI entsteht, begrenzen möchte – aber unser Fokus bleibt. KI unter menschlicher Kontrolle zu behalten, ist die Voraussetzung, um echte Lösungen für alle weiteren Probleme zu finden.
              <br />
              <br />

              Solange die relevanten Entscheidungen noch von Menschen getroffen werden, hat gesellschaftlicher Druck einen entscheidenden Einfluss auf das Weltgeschehen - deshalb sind wir hier! 

            </>
          }
          className="scroll-mt-24"
        />

        {/* Was wir tun */}
        <TitleTextBlock
          id="was-wir-tun"
          smallHeading="Was wir tun"
          largeHeading="Klarheit schaffen"
          text={
          <>
          Wir wollen den Spalt zwischen den dramatischen Warnungen von KI-Experten und der öffentlichen Debatte schließen. Unser wirksamstes Mittel ist, sachlich und lösungsorientiert über die Risiken von KI-Entwicklung aufzuklären. Immer mehr Freiwillige tragen etwa mit Vorträgen oder Flyeraktionen dazu bei,  die kollektive Schockstarre zu überwinden.
          <br />
          <br />
          Auf unserem <a href="https://discord.gg/pvZ5PmRX4R" target="_blank" rel="noopener noreferrer" className="orange-link font-body-bold">Discord-Server</a> erfährst Du mehr über aktuell laufende Projekte. Dort treffen wir uns jeden Donnerstag um 18 Uhr für ein Videomeeting, zu dem Du herzlich eingeladen bist!
          </>}
          className="scroll-mt-24"
        />
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
        <div className="hidden md:grid md:grid-cols-2 2xl:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {members.map((member) => (
            <MemberBlurb
              key={member.id}
              name={member.name}
              description={member.description}
              quote={member.quote}
              image={member.image}
            />
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
        <UebersichtSection />
        <ContentSection />
        <MembersSection />
      </main>
      <Footer />
    </>
  );
}
