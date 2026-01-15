"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemberBlurb from "@/components/MemberBlurb";
import TitleTextBlock from "@/components/TitleTextBlock";
import members from "@/data/members.json";

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger the sweep animation after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <section className="bg-[#1a1a1a] h-screen pt-20">
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 px-8 md:px-16 lg:px-24 h-full md:justify-items-center pt-6 md:pt-8 pb-10 md:pb-24">
        {/* Hero Image - full width on mobile, 50% on desktop */}
        <div className="relative overflow-hidden w-full aspect-[1193/889] md:max-w-[calc(50vw-6rem)] md:self-start">
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

        {/* Title - full width on mobile, 50% on desktop */}
        <div className="flex flex-col items-start w-full flex-1 md:flex-none md:aspect-[1193/889] md:max-w-[calc(50vw-6rem)] md:overflow-hidden md:self-end md:justify-end">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white text-left leading-none">
            Wer Wir Sind
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mt-4 text-left">
            PauseAI Deutschland ist Teil einer <a href="https://pauseai.info" className="orange-link font-bold" target="_blank" rel="noopener noreferrer">internationalen Bewegung</a>, die sich gegen die Entwicklung gefährlicher KI-Systeme einsetzt. Wir sind parteipolitisch unabhängig, aber nicht wertneutral.
Unser Maßstab sind wissenschaftliche Erkenntnisse, demokratische Grundwerte und die Souveränität der Menschheit.
          </p>
          
          {/* Navigation Boxes */}
          <div className="grid grid-cols-1 gap-8 mt-8 w-full flex-1">
            <a href="#unser-ziel" className="group border-2 border-[#FF9416] px-4 py-3 relative hover:bg-[#FF9416]/10 transition-all">
              <span className="font-headline text-xl text-white">Unser Ziel</span>
              <span className="text-[#FF9416] transition-transform group-hover:translate-y-1 absolute bottom-2 right-2 text-2xl">↓</span>
            </a>
            <a href="#unser-ansatz" className="group border-2 border-[#FF9416] px-4 py-3 relative hover:bg-[#FF9416]/10 transition-all">
              <span className="font-headline text-xl text-white">Unser Ansatz</span>
              <span className="text-[#FF9416] transition-transform group-hover:translate-y-1 absolute bottom-2 right-2 text-2xl">↓</span>
            </a>
            <a href="#was-wir-tun" className="group border-2 border-[#FF9416] px-4 py-3 relative hover:bg-[#FF9416]/10 transition-all">
              <span className="font-headline text-xl text-white">Was wir tun</span>
              <span className="text-[#FF9416] transition-transform group-hover:translate-y-1 absolute bottom-2 right-2 text-2xl">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentSection() {
  return (
    <section className="bg-white py-24 md:py-40">
      <div className="px-8 md:px-16 lg:px-24 space-y-32 md:space-y-48">
        {/* Unser Ziel */}
        <TitleTextBlock
          id="unser-ziel"
          smallHeading="Unser Ziel"
          largeHeading="Kontrollverlust verhindern"
          text={
            <>
            Hunderte Milliarden fließen in den Wettlauf um die erste künstliche Intelligenz, die alle menschlichen Fähigkeiten übertrifft. Viele Forscher warnen, dass dies zur Auslöschung der Menschheit führen könnte. Auch wenn der schlimmste Fall nicht eintreten sollte, birgt KI katastrophale Risiken.
            <br />
            <br />
            Unser Ziel ist ein internationales Abkommen, dass die unkontrollierte Weiterentwicklung von künstlicher Intelligenz weltweit pausiert. Wir unterstützen die Etablierung verbindlicher <a href="https://red-lines.ai/" target="_blank" rel="noopener noreferrer" className="orange-link font-body-bold">roter Linien</a>, etwa bei der Entwicklung von Systemen, die sich eigenständig selbst verbessern können. Der <a href="https://ifanyonebuildsit.com/treaty" target="_blank" rel="noopener noreferrer" className="orange-link font-body-bold">Entwurf</a> des Machine Intelligence Research Institutes zeigt, wie dieses Abkommen aussehen könnte.
            </>
          }
          className="scroll-mt-24"

        />

        {/* Unser Ansatz */}
        <TitleTextBlock
          id="unser-ansatz"
          smallHeading="Unser Ansatz"
          largeHeading="Gemeinschaft wecken"
          text={
            <>
              Die größten Risiken, die von KI ausgehen, bedrohen uns alle gleichermaßen. Sobald KI sich nicht mehr von Menschen kontrollieren lässt, ist das eine Gefahr für uns alle. Das bedeutet, dass jedes Land sich nur durch internationale Kooperation schützen kann. Wir möchten das Bewusstsein für dieses gemeinsame Interesse wecken. Nur so können wir globalen Zusammenhalt erreichen.
              <br />
              <br />
              Wir sehen eine Entwicklungspause als pragmatischen ersten Schritt, um den KI-Kontrollverlust langfristig zu verhindern. Die Probleme, die durch fortschreitende KI-Entwicklung verschärft werden, reichen von der Verdrängung sozialer Beziehungen bis hin zu vollautomatischer Kriegsführung, Totalüberwachung und extremer sozialer Ungleichheit. Wir unterstützen jede vernünftige Initiative, die den Schaden, der schon heute durch KI entsteht, begrenzen möchte, verlieren aber nicht den Fokus: den KI-Kontrollverlust zu verhindern. KI langfristig unter menschlicher Kontrolle zu halten ist die Grundvorrasusetzung für nachhaltig wirksame KI-Regulierung.
            </>
          }
          className="scroll-mt-24"
        />

        {/* Was wir tun */}
        <TitleTextBlock
          id="was-wir-tun"
          smallHeading="Was wir tun"
          largeHeading="Klarheit bringen"
          text={
          <>
          Wir wollen den Spalt zwischen den dramatischen Warnungen von KI-Experten und der öffentlichen Debatte schließen. Unser wirksamstes Mittel ist, sachlich und lösungsorientiert über die Risiken von KI-Entwicklung aufzuklären. Immer mehr Mitglieder unterstützen uns aktiv bei der Organisation von Vorträgen und Flyeraktionen und zeigen damit, dass die kollektive Schockstarre durch Weitsicht und Pragmatismus durchbrochen werden kann. 
          <br />
          <br />
          Auf unserem <a href="https://discord.gg/pvZ5PmRX4R" target="_blank" rel="noopener noreferrer" className="orange-link font-body-bold">Discord-Server</a> erfährst Du mehr über aktuell laufende Projekte. Dort veranstalten wir auch jeden Donnerstag um 18 Uhr ein Videomeeting, zu dem Du herzlich eingeladen bist!
          </>}
          className="scroll-mt-24"
        />
      </div>
    </section>
  );
}

function MembersSection() {
  return (
    <section className="bg-white py-24 md:py-40">
      <div className="px-8 md:px-16 lg:px-24">
        <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl text-black text-left mb-12">
          Wir wünschen uns eine Menschliche Zukunft
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
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
        <MembersSection />
        <ContentSection />
      </main>
      <Footer />
    </>
  );
}
