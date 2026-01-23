"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const CORRECT_PASSWORD = "frog!Pirat";
const AUTH_KEY = "petition-auth";

function PasswordModal({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      onSuccess();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6">
      <div className="bg-pause-gray-dark border border-white/10 rounded-2xl p-8 max-w-md w-full">
        <h2 className="font-headline text-2xl text-white text-center mb-2">
          Geschützter Bereich
        </h2>
        <p className="font-body text-white/60 text-center mb-6">
          Diese Seite ist noch nicht öffentlich.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Passwort eingeben"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-body placeholder:text-white/40 focus:outline-none focus:border-[#FF9416]"
            autoFocus
          />
          {error && (
            <p className="font-body text-red-400 text-sm">
              Falsches Passwort. Bitte erneut versuchen.
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-[#FF9416] hover:bg-[#e88510] text-black font-section text-sm tracking-wider py-3 rounded-lg transition-colors"
          >
            Zugang
          </button>
        </form>
      </div>
    </div>
  );
}

// Signatory data
const featuredSignatories = [
  {
    name: "Connor Leahy",
    role: "CEO, Conjecture",
    image: "/petition-pics/connor-leahy.jpg",
  },
  {
    name: "NAME",
    role: "TITEL/INSTITUTION",
    image: "",
  },
  {
    name: "NAME",
    role: "TITEL/INSTITUTION",
    image: "",
  },
];

const scientistSignatories = [
  {
    name: "Simon Skade",
    role: "Kognitionswissenschaftler, Universität Osnabrück",
    image: "/petition-pics/simon.png",
  },
  {
    name: "NAME",
    role: "TITEL/INSTITUTION",
    image: "",
  },
  {
    name: "NAME",
    role: "TITEL/INSTITUTION",
    image: "",
  },
];

const politicianSignatories = [
  {
    name: "NAME",
    role: "TITEL/INSTITUTION",
    image: "",
  },
  {
    name: "NAME",
    role: "TITEL/INSTITUTION",
    image: "",
  },
  {
    name: "NAME",
    role: "TITEL/INSTITUTION",
    image: "",
  },
];

function SignatoryCard({
  name,
  role,
  image,
  variant = "light",
}: {
  name: string;
  role: string;
  image: string;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  const hasImage = image && image.length > 0;

  return (
    <div className={`group flex flex-col items-center text-center transition-all duration-300 ${isDark ? 'hover:scale-105' : ''}`}>
      <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden mb-4
        ${isDark
          ? 'ring-2 ring-white/20 group-hover:ring-[#FF9416] group-hover:ring-4'
          : 'ring-2 ring-black/10 group-hover:ring-[#FF9416] group-hover:ring-4'
        } transition-all duration-300`}>
        {hasImage ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 112px, 128px"
            className="object-cover"
          />
        ) : (
          <div className={`absolute inset-0 ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center`}>
            <svg className={`w-12 h-12 ${isDark ? 'text-white/30' : 'text-black/20'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
      </div>
      <h4 className={`font-body-bold text-sm md:text-base ${isDark ? 'text-white' : 'text-black'}`}>
        {name}
      </h4>
      <p className={`font-body text-xs md:text-sm mt-1 ${isDark ? 'text-white/70' : 'text-black/60'}`}>
        {role}
      </p>
    </div>
  );
}

function ExpertQuote({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <blockquote className="relative bg-black/30 backdrop-blur-sm border-l-4 border-[#FF9416] p-6 md:p-8 rounded-r-xl">
      <div className="absolute -top-2 -left-1 text-[#FF9416] text-6xl font-serif leading-none opacity-50">&ldquo;</div>
      <p className="font-body text-white/90 text-base md:text-lg leading-relaxed italic pl-4 text-justify">
        {quote}
      </p>
      <footer className="mt-4 pl-4">
        <cite className="font-body-bold text-white not-italic">{author}</cite>
        <p className="font-body text-white/60 text-sm">{role}</p>
      </footer>
    </blockquote>
  );
}

export default function Petition() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!isAuthenticated) {
    return <PasswordModal onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      {/* Header - Same as other pages */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FF9416]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Logo Outlined.png"
              alt="PauseAI Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <nav>
            <Link
              href="/#was-du-tun-kannst"
              className="font-section text-sm tracking-wider text-black transition-colors hover:text-white md:text-base"
            >
              Hilf mit
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO - The Declaration */}
        <section className="min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden" style={{ backgroundColor: '#78400D' }}>
          <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
            {/* Main Title */}
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl text-white text-center mb-12 animate-fade-in-up">
              Appell zum KI-Gipfel 2026
            </h1>

            {/* The Statement - Clean Card */}
            <div className="bg-pause-black rounded-2xl p-8 md:p-12 lg:p-16 animate-fade-in-up delay-200">
              <div className="max-w-4xl mx-auto space-y-6 font-body text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
                <p className="text-justify">
                  KI-Gipfel müssen Sicherheit wieder ernst nehmen. Wir fordern die deutsche Delegation auf,
                  sich beim bevorstehenden AI Impact Summit öffentlich für die folgenden Prioritäten auszusprechen:
                </p>

                <p className="text-justify pl-6 md:pl-8">
                  <span className="font-body-bold text-white">1. Verbindliche Sicherheitsstandards.</span>{" "}
                  Freiwillige Selbstregulierung schafft keine echte Sicherheit.
                  Wir brauchen unabhängige Regeln, die überprüfbar und durchsetzbar sind.
                </p>

                <p className="text-justify pl-6 md:pl-8">
                  <span className="font-body-bold text-white">2. Rote Linien.</span>{" "}
                  KI braucht klare Grenzen: Welche Risiken sind unvertretbar?
                  Wann muss die Entwicklung gestoppt werden?
                  Solche Schranken können nur international durchgesetzt werden.
                </p>

                <p className="text-justify">
                  Technischer Fortschritt ist kein Selbstzweck, sondern muss verantwortungsvoll
                  im Interesse der Menschheit gestaltet sein.
                </p>
              </div>
            </div>

            {/* Signatory count */}
            <div className="mt-12 text-center animate-fade-in-up delay-300">
              <p className="font-body text-white/60 mb-2">Bereits unterzeichnet von</p>
              <p className="font-headline text-5xl md:text-6xl text-[#FF9416]">2</p>
              <p className="font-body text-white/60">Persönlichkeiten</p>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* SIGNATORIES - Featured */}
        <section className="bg-[#E07B0D] py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <h2 className="font-headline text-3xl md:text-4xl text-black text-center mb-4">
              Bekannte Unterstützer
            </h2>
            <p className="font-body text-black/70 text-center mb-12 max-w-2xl mx-auto">
              Prominente Persönlichkeiten aus Wissenschaft, Wirtschaft und Gesellschaft
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 justify-items-center">
              {featuredSignatories.map((person, index) => (
                <SignatoryCard key={index} {...person} variant="light" />
              ))}
            </div>
          </div>
        </section>

        {/* SIGNATORIES - Scientists */}
        <section className="bg-[#C96A08] py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <h2 className="font-headline text-3xl md:text-4xl text-black text-center mb-4">
              Wissenschaftler
            </h2>
            <p className="font-body text-black/70 text-center mb-12 max-w-2xl mx-auto">
              Forscher und Akademiker aus den Bereichen KI, Informatik und Ethik
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 justify-items-center">
              {scientistSignatories.map((person, index) => (
                <SignatoryCard key={index} {...person} variant="light" />
              ))}
            </div>
          </div>
        </section>

        {/* SIGNATORIES - Politicians */}
        <section className="bg-[#B45309] py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <h2 className="font-headline text-3xl md:text-4xl text-white text-center mb-4">
              Politiker
            </h2>
            <p className="font-body text-white/70 text-center mb-12 max-w-2xl mx-auto">
              Abgeordnete und politische Entscheidungsträger
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 justify-items-center">
              {politicianSignatories.map((person, index) => (
                <SignatoryCard key={index} {...person} variant="dark" />
              ))}
            </div>
          </div>
        </section>

        {/* BACKGROUND - Intro */}
        <section className="py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, #78400D 0%, rgb(10, 10, 10) 100%)' }}>
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <h2 className="font-headline text-3xl md:text-4xl text-white text-center mb-12">
              Hintergrund
            </h2>

            <div className="space-y-6 font-body text-white/85 text-lg leading-relaxed">
              <p className="text-justify">
                Die Risiken künstlicher Intelligenz wirken über alle Ländergrenzen hinaus.
                Warnungen weltweit anerkannter Experten machen deutlich: Nur gemeinsam bekommt
                die Welt Gefahren von Missbrauch bis Kontrollverlust in den Griff.{" "}
                <a href="https://aistatement.com/" target="_blank" rel="noopener noreferrer" className="text-[#FF9416] hover:underline">[1]</a>
              </p>

              <p className="text-justify">
                Beim ersten <span className="font-body-bold text-white">AI Safety Summit</span> (Bletchley 2023) warnte die Erklärung vor dem
                „Potenzial für schwerwiegende, sogar katastrophale Schäden", und die
                Unterzeichner beschlossen, gemeinsam sichere KI zu gewährleisten.{" "}
                <a href="https://www.gov.uk/government/publications/ai-safety-summit-2023-the-bletchley-declaration/the-bletchley-declaration-by-countries-attending-the-ai-safety-summit-1-2-november-2023" target="_blank" rel="noopener noreferrer" className="text-[#FF9416] hover:underline">[2]</a>
              </p>

              <p className="text-justify">
                Doch beim <span className="font-body-bold text-white">AI Action Summit</span> (Paris 2025) verschwand Sicherheit hinter
                Wirtschaftsinteressen. Professor Max Tegmark vom MIT sagte, „es fühlte sich
                fast so an, als würde man versuchen, Bletchley rückgängig zu machen," und
                nannte das Fehlen von Sicherheit in der Erklärung „ein Rezept für eine
                Katastrophe."{" "}
                <a href="https://time.com/7221384/ai-regulation-takes-backseat-paris-summit/" target="_blank" rel="noopener noreferrer" className="text-[#FF9416] hover:underline">[3]</a>
                <a href="https://fortune.com/2025/02/11/paris-ai-action-summit-ai-safety-sidelined-economic-opportunity-promoted/" target="_blank" rel="noopener noreferrer" className="text-[#FF9416] hover:underline">[4]</a>
              </p>

              <p className="text-justify">
                Nun steht der <span className="font-body-bold text-white">AI Impact Summit</span> (Delhi, 19.-20. Februar 2026) bevor, mit noch
                mehr teilnehmenden CEOs als in Paris.
              </p>

              <p className="text-justify">
                Von „Safety" zu „Action" zu „Impact": Sicherheit wird zunehmend in den
                Hintergrund gedrängt. Dabei ist sie Grundvoraussetzung für verantwortungsvolle
                Innovation, die Fortschritt zum Wohle aller ermöglicht.
              </p>
            </div>
          </div>
        </section>

        {/* BACKGROUND - Red Lines */}
        <section className="py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, #78400D 0%, rgb(10, 10, 10) 100%)' }}>
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <h2 className="font-headline text-2xl md:text-3xl text-white mb-8">
              Was sind rote Linien für KI?
            </h2>

            <p className="font-body text-white/85 text-lg leading-relaxed mb-8 text-justify">
              Rote Linien verbieten KI-Systeme, die ein unannehmbares Risiko für uns alle
              bedeuten würden. Darunter fallen Systeme, die:
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "sich unkontrolliert selbst verbessern,",
                "Menschen systematisch täuschen,",
                "oder katastrophalen Missbrauch wie die Entwicklung von Biowaffen zulassen."
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-[#FF9416]" />
                  <span className="font-body text-white/85 text-lg">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://red-lines.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-[#FF9416] hover:text-[#FFB347] transition-colors"
            >
              Mehr dazu (auf Englisch)
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </section>

        {/* BACKGROUND - International Agreement */}
        <section className="py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, #78400D 0%, rgb(10, 10, 10) 100%)' }}>
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <h2 className="font-headline text-2xl md:text-3xl text-white mb-8">
              Wie könnte ein internationales Abkommen durchgesetzt werden?
            </h2>

            <p className="font-body text-white/85 text-lg leading-relaxed mb-10 text-justify">
              Das Training fortschrittlicher KI-Systeme erfordert heute riesige Rechenzentren
              mit spezialisierten Computerchips. Diese Konzentration macht eine Regulierung
              gut umsetzbar.
            </p>

            <p className="font-body text-white/85 text-lg mb-8">
              Ein internationales Abkommen könnte auf drei Säulen basieren:
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Internationale Aufsicht",
                  desc: "Eine neue internationale Behörde überprüft die Einhaltung von Sicherheitsstandards in Zusammenarbeit mit nationalen Behörden. Whistleblower werden geschützt."
                },
                {
                  title: "Rechenleistung sichtbar machen",
                  desc: "Große Trainingsläufe werden registriert und beaufsichtigt. KI-Chips können technisch so gestaltet werden, dass ihre Nutzung nachvollziehbar wird."
                },
                {
                  title: "Konsequenzen bei Verstößen",
                  desc: "Staaten beschließen gemeinsame Sanktionen gegen Akteure, die rote Linien überschreiten, und entwickeln Strategien für den Umgang mit Krisen."
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 md:gap-6 p-6 bg-black/30 rounded-xl border border-white/10">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF9416]/20 flex items-center justify-center">
                    <span className="font-section text-sm text-[#FF9416]">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-body-bold text-white text-lg mb-2">{item.title}</h3>
                    <p className="font-body text-white/70 leading-relaxed text-justify">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BACKGROUND - Expert Quotes */}
        <section className="py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, #78400D 0%, rgb(10, 10, 10) 100%)' }}>
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <h2 className="font-headline text-2xl md:text-3xl text-white mb-12 text-center">
              Was Experten sagen
            </h2>

            <div className="space-y-8">
              <ExpertQuote
                quote="Die Minderung des Risikos eines Aussterbens durch KI sollte eine globale Priorität sein, gleichrangig mit anderen Risiken gesamtgesellschaftlichen Ausmaßes wie Pandemien und Atomkrieg."
                author="Statement on AI Risk"
                role="Unterzeichnet von Geoffrey Hinton, Yoshua Bengio und zahlreichen weiteren KI-Experten"
              />

              <ExpertQuote
                quote="Ich habe vier Jahre im Sicherheitsteam von OpenAI gearbeitet und kann Ihnen mit Gewissheit sagen: KI-Unternehmen nehmen Ihre Sicherheit nicht ernst genug, und sie sind nicht auf Kurs, kritische Sicherheitsprobleme zu lösen."
                author="Steven Adler"
                role="Ehemaliger Leiter der Dangerous Capability Evaluations bei OpenAI"
              />

              <ExpertQuote
                quote="Wir betonen: Einige KI-Systeme zeigen bereits heute die Fähigkeit und Neigung, die Sicherheits- und Kontrollbemühungen ihrer Entwickler zu untergraben."
                author="Konsens führender KI-Sicherheitsforscher"
                role="Darunter Stuart Russell und Andrew Yao. International Dialogues on AI Safety, Shanghai 2025"
              />
            </div>
          </div>
        </section>

        {/* SOURCES - Black */}
        <section className="bg-pause-black py-12 md:py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <h3 className="font-section text-sm text-white/50 mb-6 tracking-wider">Quellen</h3>
            <ol className="space-y-2 font-body text-sm text-white/60">
              <li>
                [1]{" "}
                <a href="https://aistatement.com/" target="_blank" rel="noopener noreferrer" className="text-[#FF9416] hover:underline">
                  CAIS Statement on AI Risk
                </a>
              </li>
              <li>
                [2]{" "}
                <a href="https://www.gov.uk/government/publications/ai-safety-summit-2023-the-bletchley-declaration/the-bletchley-declaration-by-countries-attending-the-ai-safety-summit-1-2-november-2023" target="_blank" rel="noopener noreferrer" className="text-[#FF9416] hover:underline">
                  Bletchley Declaration
                </a>
              </li>
              <li>
                [3]{" "}
                <a href="https://time.com/7221384/ai-regulation-takes-backseat-paris-summit/" target="_blank" rel="noopener noreferrer" className="text-[#FF9416] hover:underline">
                  TIME Magazine „AI Regulation Takes Backseat at Paris Summit" (2025)
                </a>
              </li>
              <li>
                [4]{" "}
                <a href="https://fortune.com/2025/02/11/paris-ai-action-summit-ai-safety-sidelined-economic-opportunity-promoted/" target="_blank" rel="noopener noreferrer" className="text-[#FF9416] hover:underline">
                  Fortune Magazine
                </a>
              </li>
            </ol>
          </div>
        </section>

        {/* LEARN MORE - Amber/Brown color */}
        <section className="py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, #78400D 0%, rgb(10, 10, 10) 100%)' }}>
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="font-headline text-2xl md:text-3xl text-white mb-6">
              Weitere Informationen
            </h2>
            <p className="font-body text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Laden Sie unser ausführliches Hintergrunddokument herunter, um mehr über
              die Risiken fortschrittlicher KI und mögliche Lösungsansätze zu erfahren.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-3 bg-[#FF9416] hover:bg-[#e88510] text-black font-section text-sm tracking-wider px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#FF9416]/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Hintergrunddokument herunterladen (PDF)
            </a>
          </div>
        </section>

        {/* HOW YOU CAN HELP */}
        <section className="py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, #78400D 0%, rgb(10, 10, 10) 100%)' }}>
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <h2 className="font-headline text-3xl md:text-4xl text-white text-center mb-6">
              So kannst du helfen
            </h2>
            <p className="font-body text-white/70 text-center mb-12 max-w-2xl mx-auto">
              Jede Stimme zählt. Kontaktiere deine Abgeordneten und fordere sie auf, sich für KI-Sicherheit einzusetzen.
            </p>

            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FF9416]/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#FF9416]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="font-section text-xl md:text-2xl text-white mb-4">
                Schreibe deinen Abgeordneten
              </h3>

              <p className="font-body text-white/80 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                Mit unserem Tool kannst du in wenigen Minuten eine personalisierte Nachricht an deine
                Bundestagsabgeordneten senden und sie auffordern, sich für verbindliche KI-Sicherheitsstandards einzusetzen.
              </p>

              <a
                href="#"
                className="inline-flex items-center gap-3 bg-[#FF9416] hover:bg-[#e88510] text-black font-section text-sm tracking-wider px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#FF9416]/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Tool kommt bald
              </a>

              <p className="font-body text-white/50 text-sm mt-6">
                Das Tool befindet sich noch in Entwicklung. Trage dich in unseren Newsletter ein, um informiert zu werden.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#FF9416] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-body text-black/50 text-sm">
            © {new Date().getFullYear()} PauseAI Germany. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </>
  );
}
