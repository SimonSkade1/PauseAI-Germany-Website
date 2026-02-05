"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSet8gf61pTqCYv4Fa1OAKGt6BizTKBaeyTTqIyhdlbaoOf5iw/formResponse";
const GOOGLE_FORM_EMAIL_ENTRY = "entry.1229172991";

function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" | "orange" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      // Submit to Google Forms using no-cors mode
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          [GOOGLE_FORM_EMAIL_ENTRY]: email,
        }),
      });

      // With no-cors we can't read the response, but if no error was thrown, assume success
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className={`font-body ${variant === "light" ? "text-pause-black" : variant === "orange" ? "text-black" : "text-white"}`}>
        Danke für deine Anmeldung!
      </p>
    );
  }

  const inputClass = variant === "light" ? "newsletter-input-light" : variant === "orange" ? "newsletter-input-orange" : "newsletter-input";
  const sizeClass = variant === "light" ? "px-4 py-3 text-base" : "px-4 py-2 text-sm";
  const buttonSizeClass = variant === "light" ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs";
  const buttonClass = variant === "orange" ? "bg-black text-white hover:bg-gray-800" : "btn-orange";

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row ${variant === "light" ? "gap-3" : "gap-2"}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={variant === "light" ? "Deine E-Mail-Adresse" : "E-Mail-Adresse"}
        className={`${inputClass} flex-1 min-w-0 w-full ${sizeClass} font-body`}
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`${buttonClass} ${buttonSizeClass} font-section tracking-wider whitespace-nowrap disabled:opacity-50 transition-colors`}
      >
        {status === "loading" ? "..." : "Abonnieren"}
      </button>
    </form>
  );
}

function NewsletterFormWithRef({ 
  variant = "light", 
  inputRef,
  glowing,
  cardHovered = false
}: { 
  variant?: "light" | "dark" | "orange";
  inputRef: React.RefObject<HTMLInputElement | null>;
  glowing: boolean;
  cardHovered?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          [GOOGLE_FORM_EMAIL_ENTRY]: email,
        }),
      });

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className={`font-body ${variant === "light" ? "text-pause-black" : variant === "orange" ? "text-black" : "text-white"}`}>
        Danke für deine Anmeldung!
      </p>
    );
  }

  const inputClass = variant === "light" ? "newsletter-input-light" : variant === "orange" ? "newsletter-input-orange" : "newsletter-input";
  const sizeClass = variant === "light" ? "px-4 py-3 text-base" : "px-4 py-2 text-sm";
  const buttonSizeClass = variant === "light" ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs";
  const buttonClass = variant === "orange" ? "bg-black text-white hover:bg-gray-800" : "btn-orange";

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row ${variant === "light" ? "gap-3" : "gap-2"}`}>
      <input
        ref={inputRef}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={variant === "light" ? "Deine E-Mail-Adresse" : "E-Mail-Adresse"}
        className={`${inputClass} flex-1 min-w-0 w-full ${sizeClass} font-body transition-all duration-300 ${
          glowing ? "ring-2 ring-[#FF9416] ring-offset-2" : ""
        }`}
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`${buttonClass} ${buttonSizeClass} font-section tracking-wider whitespace-nowrap disabled:opacity-50 transition-colors ${cardHovered ? "bg-[#e88510]" : ""}`}
      >
        {status === "loading" ? "..." : "Abonnieren"}
      </button>
    </form>
  );
}

const quotes = [
  {
    quote:
      "We call for a prohibition on the development of superintelligence, not lifted before there is broad scientific consensus that it will be done safely and controllably, and strong public buy-in.",
    name: "Statement on Superintelligence",
    title: "Signed by 130,000+ including AI researchers, political leaders, and industry figures",
    image: "https://superintelligence-statement.org/favicon.ico",
    link: "https://superintelligence-statement.org/",
  },
  {
    quote:
      "Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war.",
    name: "Statement on AI Risk",
    title: "Signed by hundreds of AI experts from leading labs and institutions",
    image: "/CAISlogo.png",
    link: "https://aistatement.com/",
  },
  {
    quote:
      "Ich halte es für notwendig, auf europäischer und globaler Ebene rote Linien für Anwendungen [von KI] zu ziehen, die fundamentale Sicherheits- oder Menschenrechtsrisiken erzeugen – etwa autonome Waffensysteme ohne echte menschliche Kontrolle, KI zur massiven Verhaltensmanipulation oder nicht kontrollierbare Systemarchitekturen.",
    name: "Diana Herbstreuth",
    title: "Bundestagsabgeordnete (CDU)",
    image: "/neutral_profile_pic.png",
    link: "https://www.abgeordnetenwatch.de/profile/diana-herbstreuth",
  },
  {
    quote:
      "It might be quite sensible to just stop developing these things any further.",
    name: "Geoffrey Hinton",
    title: 'Nobel Prize winner & "Godfather of AI"',
    image: "https://pauseai.info/_app/immutable/assets/hinton.CATQdHCu.jpeg",
  },
  {
    quote:
      "Verbindliche internationale Abkommen und ethische Grundlagen für den Einsatz von KI werden benötigt um ein Wettrennen zwischen den Staaten um die leistungsfähigste KI zu unterbinden.",
    name: "Desiree Becker",
    title: "Bundestagsabgeordnete (Die Linke)",
    image: "/07_Desiree_Becker-nah-M.jpg",
    link: "https://www.abgeordnetenwatch.de/profile/desiree-becker",
  },
  {
    quote:
      "The development of full artificial intelligence could spell the end of the human race.",
    name: "Stephen Hawking",
    title: "Theoretical physicist and cosmologist",
    image: "https://pauseai.info/_app/immutable/assets/hawking.CjUk02YF.jpeg",
  },
  {
    quote:
      "International unterstütze ich Initiativen, die rote Linien für KI definieren, autonome Waffensysteme ächten und globale Sicherheitsstandards schaffen. Deutschland kann dabei gemeinsam mit europäischen Partnern wichtige Impulse setzen, etwa durch stärkere Forschung zu Sicherheit und Kontrollierbarkeit sowie internationale Transparenzregeln für besonders leistungsfähige Modelle.",
    name: "Max Lucks",
    title: "Bundestagsabgeordneter (Bündnis 90/Die Grünen)",
    image: "/MaxLucks_credit_FinnKantus_07.jpg",
    link: "https://www.abgeordnetenwatch.de/profile/max-lucks",
  },
  {
    quote: "We should have to expect the machines to take control.",
    name: "Alan Turing",
    title: "Inventor of the modern computer",
    image: "https://pauseai.info/_app/immutable/assets/turing.CU9lsOWi.jpeg",
  },
  {
    quote:
      "Banning powerful AI systems beyond GPT-4 abilities with autonomy would be a good start.",
    name: "Yoshua Bengio",
    title: "AI Turing Award winner",
    image: "https://pauseai.info/_app/immutable/assets/bengio.CI8A1hfU.jpeg",
  },
];


function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-start overflow-hidden pt-20">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/earth-europe.png"
          alt="Earth from space showing Europe"
          fill
          sizes="100vw"
          className="object-cover object-[25%_center] md:object-center"
          priority
          unoptimized
        />
      </div>

      {/* Content: right-aligned on all screen sizes, positioned at ~1/3 from top */}
      <div className="relative z-10 w-full flex justify-end px-6 md:px-12 lg:px-20 xl:px-32 pt-[5vh] md:pt-[30vh]">
        <div className="text-right">
          <h1 className="font-headline text-2xl text-white mb-6 md:text-5xl lg:text-5xl xl:text-6xl animate-fade-in-up">
            Wir können den <br />KI-Kontrollverlust<br /> noch verhindern
          </h1>
          <p className="font-body-bold text-lg text-white/90 md:text-xl lg:text-2xl animate-fade-in-up delay-200">
            Hilf mit, jetzt Klarheit zu schaffen!
          </p>
        </div>
      </div>
    </section>
  );
}

function QuotesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll to update active index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance every 8 seconds
  useEffect(() => {
    const startAutoAdvance = () => {
      autoAdvanceRef.current = setInterval(() => {
        scrollToIndex((activeIndex + 1) % quotes.length);
      }, 8000);
    };

    startAutoAdvance();
    return () => {
      if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    };
  }, [activeIndex]);

  // Scroll to specific quote with animation
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const itemWidth = container.offsetWidth;
    const targetScroll = index * itemWidth;
    const startScroll = container.scrollLeft;
    const distance = targetScroll - startScroll;
    const duration = 300;
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      container.scrollLeft = startScroll + distance * easeOut;
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const nextQuote = () => {
    scrollToIndex((activeIndex + 1) % quotes.length);
  };

  const prevQuote = () => {
    scrollToIndex((activeIndex - 1 + quotes.length) % quotes.length);
  };

  const q = quotes[activeIndex];

  return (
    <section 
      className="bg-pause-gray-dark py-8 md:py-12 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Logo/Photo and Name - left aligned */}
      <div className="flex items-start gap-6 md:gap-8 mb-6 md:mb-8 px-6 md:px-12 min-h-[150px] md:min-h-[100px]">
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden bg-white">
          <Image
            src={q.image}
            alt={q.name}
            fill
            sizes="(max-width: 768px) 64px, 80px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center flex-1 min-h-[80px] md:min-h-[80px]">
          <h3 className="font-headline text-white text-xl md:text-2xl lg:text-3xl leading-tight">
            {(q as { link?: string }).link ? (
              <a href={(q as { link?: string }).link} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9416] transition-colors">
                {q.name}
              </a>
            ) : (
              q.name
            )}
          </h3>
          <p className="font-body text-white/70 text-sm md:text-base mt-1 leading-relaxed">{q.title}</p>
        </div>
      </div>

      {/* Centered container for quote, arrows, and dots */}
      <div className="flex justify-center px-10 md:px-12">
        <div className="relative w-full" style={{ maxWidth: 'calc(60ch + 8rem)' }}>
          {/* Quote row with arrows */}
          <div className="flex items-center justify-center">
            {/* Left Arrow - hidden on mobile, visible on hover on desktop */}
            <button
              onClick={prevQuote}
              className={`hidden md:flex absolute left-0 flex-shrink-0 w-10 h-10 items-center justify-center transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Previous quote"
            >
              <svg className="w-8 h-8 text-white hover:text-[#FF9416] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Scrollable quote container */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 md:mx-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", maxWidth: '60ch' }}
            >
              {quotes.map((quote, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full px-6 md:px-0 snap-center flex justify-center items-center"
                  style={{ 
                    scrollSnapStop: "always", 
                    minHeight: 'calc(4 * 1.625em)',
                    width: '100%',
                    maxWidth: '60ch'
                  }}
                >
                  <blockquote 
                    className="font-body text-white text-lg md:text-xl lg:text-2xl leading-relaxed text-center"
                  >
                    &quot;{quote.quote}&quot;
                  </blockquote>
                </div>
              ))}
            </div>

            {/* Right Arrow - hidden on mobile, visible on hover on desktop */}
            <button
              onClick={nextQuote}
              className={`hidden md:flex absolute right-0 flex-shrink-0 w-10 h-10 items-center justify-center transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Next quote"
            >
              <svg className="w-8 h-8 text-white hover:text-[#FF9416] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Square Dots Indicator - aligned with quote max-width */}
          <div className="flex justify-between items-center h-6 mt-12 md:mt-16 mx-6 md:mx-0" style={{ maxWidth: '60ch', margin: '3rem auto 0' }}>
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2.5 h-2.5 transition-all duration-150 ${
                  index === activeIndex ? "bg-[#FF9416]" : "bg-white/40"
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSolutionSection() {
  return (
    <section className="bg-white py-20 md:py-32">
      {/* Single orange dividing line */}
      <div className="w-full flex justify-center mb-12 md:mb-16">
        <div className="w-24 h-1 bg-[#FF9416]"></div>
      </div>

      {/* Two-column layout container */}
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
          {/* Problem Box - Black filled, clickable */}
          <a
            href="https://pauseai.info/xrisk"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-[#1a1a1a] p-8 md:p-10 lg:p-12 hover:bg-[#2a2a2a] transition-colors cursor-pointer block"
          >
            <h2 className="font-section text-2xl text-white mb-6 md:text-3xl">
              Das Problem
            </h2>
            <p className="font-body text-white/90 text-lg leading-relaxed text-justify">
              KI-Labore arbeiten auf eine künstliche Superintelligenz hin –
              jedoch weiß niemand, wie diese kontrolliert werden kann. Viele
              Forscher warnen, dass dies zur Auslöschung der Menschheit führen
              könnte.
            </p>
            {/* Orange arrow moved slightly left */}
            <div className="absolute bottom-4 right-6 text-[#FF9416] text-2xl transition-transform group-hover:translate-x-2">
              →
            </div>
          </a>

          {/* Solution Box - White with dark grey border, clickable */}
          <div
            onClick={() => window.open("https://pauseai.info/proposal", "_blank")}
            className="group relative bg-white border-2 border-[#4a4a4a] p-8 md:p-10 lg:p-12 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <h2 className="font-section text-2xl text-pause-black mb-6 md:text-3xl">
              Die Lösung
            </h2>
            <p className="font-body text-pause-black/80 text-lg leading-relaxed text-justify">
              Ein internationales Abkommen, das die Entwicklung von
              superintelligenter KI stoppt, bis diese sicher möglich ist. Eine
              mögliche Lösung ist der{" "}
              <a
                href="https://ifanyonebuildsit.com/treaty"
                target="_blank"
                rel="noopener noreferrer"
                className="orange-link font-body-bold"
                onClick={(e) => e.stopPropagation()}
              >
                Entwurf
              </a>{" "}
              des Machine Intelligence Research Instituts.
            </p>
            {/* Orange arrow moved slightly left */}
            <div className="absolute bottom-4 right-6 text-[#FF9416] text-2xl transition-transform group-hover:translate-x-2">
              →
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionSection() {
  const newsletterInputRef = useRef<HTMLInputElement>(null);
  const [newsletterGlow, setNewsletterGlow] = useState(false);
  const [newsletterHovered, setNewsletterHovered] = useState(false);

  const handleNewsletterCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on the input or button
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    if (newsletterInputRef.current) {
      newsletterInputRef.current.focus();
      setNewsletterGlow(true);
      setTimeout(() => setNewsletterGlow(false), 1000);
    }
  };

  return (
    <section
      id="was-du-tun-kannst"
      className="bg-white py-16 md:py-24"
    >
      <div className="max-w-[75vw] mx-auto px-0 md:px-12">
        <h2 className="font-headline text-3xl text-pause-black text-left mb-12 md:text-5xl lg:text-6xl">
          Was du tun kannst
        </h2>

        <div className="space-y-6">
          {/* Newsletter */}
          <div 
            onClick={handleNewsletterCardClick}
            onMouseEnter={() => setNewsletterHovered(true)}
            onMouseLeave={() => setNewsletterHovered(false)}
            className="group flex bg-white p-6 md:p-8 border border-[#1a1a1a] md:border-2 cursor-pointer hover:bg-[#FFFAF5] transition-colors min-h-[190px]"
          >
            <div className="flex items-start md:gap-4 flex-1">
              <span className="hidden md:block text-[#FF9416] text-4xl md:text-5xl flex-shrink-0 leading-none mt-[-0.32em] transition-transform group-hover:translate-x-2">
                →
              </span>
              <div className="flex-1 flex flex-col h-full">
                <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">
                  Folge unserem Newsletter
                </h3>
                <div className="mb-4">
                  <NewsletterFormWithRef 
                    variant="light" 
                    inputRef={newsletterInputRef}
                    glowing={newsletterGlow}
                    cardHovered={newsletterHovered}
                  />
                </div>
                <p className="font-body text-pause-black/80 text-base mt-auto text-right">
                  Damit du über wichtige Neuigkeiten und Events informiert bleibst.
                </p>
              </div>
            </div>
          </div>

          {/* Discord */}
          <a 
            href="https://discord.gg/pvZ5PmRX4R"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex bg-white p-6 md:p-8 border border-[#1a1a1a] md:border-2 cursor-pointer hover:bg-[#FFFAF5] transition-colors min-h-[190px]"
          >
            <div className="flex items-start md:gap-4 flex-1">
              <span className="hidden md:block text-[#FF9416] text-4xl md:text-5xl flex-shrink-0 leading-none mt-[-0.32em] transition-transform group-hover:translate-x-2">
                →
              </span>
              <div className="flex-1 flex flex-col h-full">
                <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">
                  Tritt unserem <span className="text-[#FF9416] border-b-2 border-transparent group-hover:border-[#FF9416] transition-colors">Discord</span> bei
                </h3>
                <p className="font-body text-pause-black/80 text-base mt-auto text-right">
                  Werde Teil unserer Community und hilf mit.
                </p>
              </div>
            </div>
          </a>

          {/* Werde jetzt aktiv */}
          <a
            href="/action"
            className="group flex bg-white p-6 md:p-8 border border-[#1a1a1a] md:border-2 cursor-pointer hover:bg-[#FFFAF5] transition-colors min-h-[190px]"
          >
            <div className="flex items-start md:gap-4 flex-1">
              <span className="hidden md:block text-[#FF9416] text-4xl md:text-5xl flex-shrink-0 leading-none mt-[-0.32em] transition-transform group-hover:translate-x-2">
                →
              </span>
              <div className="flex-1 flex flex-col h-full">
                <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">
                  Werde jetzt <span className="text-[#FF9416] border-b-2 border-transparent group-hover:border-[#FF9416] transition-colors">aktiv</span>
                </h3>
                <p className="font-body text-pause-black/80 text-base mt-auto text-right">
                  Erledige sofort kleine oder große Aufgaben.
                </p>
              </div>
            </div>
          </a>


          {/* Microcommit */}
          <a 
            href="https://microcommit.io"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex bg-white p-6 md:p-8 border border-[#1a1a1a] md:border-2 cursor-pointer hover:bg-[#FFFAF5] transition-colors min-h-[190px]"
          >
            <div className="flex items-start md:gap-4 flex-1">
              <span className="hidden md:block text-[#FF9416] text-4xl md:text-5xl flex-shrink-0 leading-none mt-[-0.32em] transition-transform group-hover:translate-x-2">
                →
              </span>
              <div className="flex-1 flex flex-col h-full">
                <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">
                  Tritt <span className="text-[#FF9416] border-b-2 border-transparent group-hover:border-[#FF9416] transition-colors">Microcommit.io</span> bei
                </h3>
                <p className="font-body text-pause-black/80 text-base mt-auto text-right">
                  5min/Woche Aufwand die dennoch viel bewegen. Deutsche Version kommt bald.
                </p>
              </div>
            </div>
          </a>

          {/* Spenden */}
          <a 
            href="mailto:germany@pauseai.info"
            className="group flex bg-white p-6 md:p-8 border border-[#1a1a1a] md:border-2 cursor-pointer hover:bg-[#FFFAF5] transition-colors min-h-[190px]"
          >
            <div className="flex items-start md:gap-4 flex-1">
              <span className="hidden md:block text-[#FF9416] text-4xl md:text-5xl flex-shrink-0 leading-none mt-[-0.32em] transition-transform group-hover:translate-x-2">
                →
              </span>
              <div className="flex-1 flex flex-col h-full">
                <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">
                  Spenden
                </h3>
                <p className="font-body text-pause-black/80 text-base mt-auto text-right">
                  Deine Spende bringt uns weiter. Bei Interesse kontaktiere{" "}
                  <span className="text-[#FF9416] border-b-2 border-transparent group-hover:border-[#FF9416] transition-colors font-body-bold">
                    germany@pauseai.info
                  </span>
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <QuotesSection />
        <ActionSection />
      </main>
      <Footer />
    </>
  );
}
