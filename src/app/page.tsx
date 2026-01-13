"use client";

import Image from "next/image";
import React, { useState, useEffect, FormEvent } from "react";
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
        className={`${inputClass} flex-1 ${sizeClass} rounded-lg font-body`}
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`${buttonClass} ${buttonSizeClass} rounded-lg font-section tracking-wider whitespace-nowrap disabled:opacity-50 transition-colors`}
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
      "It might be quite sensible to just stop developing these things any further.",
    name: "Geoffrey Hinton",
    title: 'Nobel Prize winner & "Godfather of AI"',
    image: "https://pauseai.info/_app/immutable/assets/hinton.CATQdHCu.jpeg",
  },
  {
    quote:
      "The development of full artificial intelligence could spell the end of the human race.",
    name: "Stephen Hawking",
    title: "Theoretical physicist and cosmologist",
    image: "https://pauseai.info/_app/immutable/assets/hawking.CjUk02YF.jpeg",
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
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-20">
      {/* Background image - pre-processed with Oklab hue-based selective saturation (±5° orange tolerance) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/demo_amsterdam_front_orange.jpeg"
          alt="PauseAI Demo Amsterdam"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content with glass blur box - single div with backdrop blur */}
      <div className="relative z-10 inline-block mt-16 px-6 py-6 md:px-12 md:py-10 text-center rounded-2xl pause-orange/40 backdrop-blur-sm">
        <h1 className="font-headline text-3xl text-white mb-6 md:text-5xl lg:text-5xl xl:text-6xl animate-fade-in-up">
          Wir können den <br />KI-Kontrollverlust <br /> noch verhindern
        </h1>
        <p className="font-body text-lg text-white/90 max-w-3xl mx-auto md:text-xl lg:text-2xl justify-left animate-fade-in-up delay-200">
          Niemand profitiert von der Entwicklung unkontrollierbarer Systeme. <br /> Hilf mit, jetzt Klarheit zu schaffen!
        </p>
      </div>
    </section>
  );
}

function QuotesSection() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  // Auto-advance every 8 seconds, resets when resetKey changes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [resetKey]);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
    setResetKey((k) => k + 1);
  };

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
    setResetKey((k) => k + 1);
  };

  const goToQuote = (index: number) => {
    setCurrentQuote(index);
    setResetKey((k) => k + 1);
  };

  const q = quotes[currentQuote];

  return (
    <section className="bg-pause-gray-dark py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={prevQuote}
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF9416] transition-colors mr-1 md:mr-2"
            aria-label="Previous quote"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Quote Card */}
          <div
            key={currentQuote}
            className="quote-card flex-1 rounded-2xl p-6 md:p-8 animate-slide-in"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#FF9416] bg-white">
                <Image
                  src={q.image}
                  alt={q.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-body-bold text-white text-base md:text-lg">
                  {(q as { link?: string }).link ? (
                    <a href={(q as { link?: string }).link} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9416] transition-colors">
                      {q.name}
                    </a>
                  ) : (
                    q.name
                  )}
                </h3>
                <p className="font-body text-white/60 text-xs md:text-sm">{q.title}</p>
              </div>
            </div>
            <blockquote className="font-body text-white/90 text-base md:text-lg leading-relaxed italic text-justify">
              &ldquo;{q.quote}&rdquo;
            </blockquote>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextQuote}
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF9416] transition-colors ml-2 md:ml-3"
            aria-label="Next quote"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuote(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentQuote ? "bg-[#FF9416]" : "bg-white/30"
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSolutionSection() {
  return (
    <section className="bg-[#FFA033] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem Card - White text on black */}
          <div className="card-hover bg-pause-black rounded-2xl p-8 md:p-10">
            <h2 className="font-section text-2xl text-white mb-6 md:text-3xl">
              Das Problem
            </h2>
            <p className="font-body text-white/90 text-lg leading-relaxed text-justify">
              KI-Labore arbeiten auf eine künstliche Superintelligenz hin –
              jedoch weiß niemand, wie diese kontrolliert werden kann. Viele
              Forscher warnen, dass dies zur Auslöschung der Menschheit führen
              könnte.
            </p>
          </div>

          {/* Solution Card - Black text on white */}
          <div className="card-hover bg-white rounded-2xl p-8 md:p-10">
            <h2 className="font-section text-2xl text-pause-black mb-6 md:text-3xl">
              Die Lösung
            </h2>
            <p className="font-body text-pause-black/80 text-lg leading-relaxed text-justify">
              Ein internationales Abkommen, das die Entwicklung von
              superintelligenter KI stoppt, bis diese sicher möglich ist. Eine
              mögliche Lösung ist der {" "}
              <a
                href="https://ifanyonebuildsit.com/treaty"
                target="_blank"
                rel="noopener noreferrer"
                className="orange-link font-body-bold"
              >
                Entwurf
              </a>{" "}
              des Machine Intelligence Research Instituts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionSection() {
  return (
    <section
      id="was-du-tun-kannst"
      className="bg-pause-gray-light py-16 md:py-24"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="font-headline text-3xl text-pause-black text-center mb-12 md:text-5xl lg:text-6xl">
          Was du tun kannst
        </h2>

        <div className="space-y-10">
          {/* Newsletter */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">
              Folge unserem Newsletter.
            </h3>
            <div className="mb-4">
              <NewsletterForm variant="light" />
            </div>
            <p className="font-body text-pause-black/60 text-base">
              Damit du über wichtige Neuigkeiten und Events informiert bleibst.
            </p>
          </div>

          {/* Contact Lawmakers (link to contact page) */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-section text-lg text-pause-black mb-1 md:text-xl">
                  Kontaktiere Abgeordnete
                </h3>
                <p className="font-body text-pause-black/80 text-base">
                  Schreibe an Abgeordnete mit Vorlagen, Tipps und aktuellem Kontaktformular.
                </p>
              </div>

              <div className="mt-2 md:mt-0">
                <Link href="/contactlawmakers" className="btn-orange inline-flex items-center gap-2 px-4 py-2 rounded-lg font-section">
                  <span>Zur Kontaktseite</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Discord */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">
              Tritt unserem{" "}
              <a
                href="https://discord.gg/pvZ5PmRX4R"
                target="_blank"
                rel="noopener noreferrer"
                className="orange-link"
              >
                Discord
              </a>{" "}
              bei
            </h3>
            <p className="font-body text-pause-black/80 text-base">
              Werde Teil unserer Community und hilf mit.
            </p>
          </div>

          {/* Microcommit */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">
              Tritt{" "}
              <a
                href="https://microcommit.io"
                target="_blank"
                rel="noopener noreferrer"
                className="orange-link"
              >
                Microcommit.io
              </a>{" "}
              bei
            </h3>
            <p className="font-body text-pause-black/80 text-base">
              5min/Woche Aufwand die dennoch viel bewegen. Deutsche Version kommt bald.
              {/* Wenn du dich registriert hast, gehe auf "Profile", scroll zu "Organizations You Follow", und folge "Pause AI Germany". */}
            </p>
          </div>

          {/* Spenden */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-section text-lg text-pause-black mb-3 md:text-xl">
              Spenden
            </h3>
            <p className="font-body text-pause-black/80 text-base">
              Deine Spende bringt uns weiter. Bei Interesse kontaktiere:{" "}
              <a
                href="mailto:germany@pauseai.info"
                className="orange-link font-body-bold"
              >
                germany@pauseai.info
              </a>
            </p>
          </div>
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
