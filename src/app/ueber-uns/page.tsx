import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemberBlurb from "@/components/MemberBlurb";
import PauseIconLattice from "@/components/PauseIconLattice";
import AnimatedGradientHero from "@/components/AnimatedGradientHero";
import members from "@/data/members.json";

function HeroSection() {
  return (
    <AnimatedGradientHero className="relative min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* Hero Image */}
        <div className="w-full rounded-2xl overflow-hidden mb-8">
          <Image
            src="/img_gruendung.jpg"
            alt="PauseAI Germany Gründung"
            width={1200}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-black text-center">
          Wer Wir Sind
        </h1>
      </div>
    </AnimatedGradientHero>
  );
}

function ContentSection() {
  const highlightStyle = {
    backgroundColor: '#FF6B9D',
    color: 'white',
    padding: '0.15em 0.5em',
    borderRadius: '0.25em',
    fontSize: '1.2em',
    display: 'inline-block',
  };

  const keyPointBaseStyle = {
    padding: '1.5rem 1.75rem',
    margin: '1rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.6,
    color: '#0a0a0a',
  };

  const keyPointOrangeStyle = {
    ...keyPointBaseStyle,
    backgroundColor: '#FFB347',
  };

  const keyPointPeachStyle = {
    ...keyPointBaseStyle,
    backgroundColor: '#FFAB76',
  };

  const keyPointPinkStyle = {
    ...keyPointBaseStyle,
    backgroundColor: '#FF85A2',
  };

  return (
    <section className="bg-pause-gray-light py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* Unser Ziel */}
        <h2 className="font-headline text-2xl md:text-3xl text-black mb-4">
          Unser Ziel:
          <br />
          <span className="flex justify-center">
            <span style={highlightStyle}>KI-Kontrollverlust verhindern</span>
          </span>
        </h2>
        <p className="text-content">
          Aktuell wird weltweit an KI-Systemen geforscht, die intelligenter sind als jeder Mensch. Aktuell lässt sich nicht abschätzen, wie weit wir davon entfernt sind, dass bei Experimenten, die bessere KI-Systeme entwickeln sollen, Systeme entstehen, die komplett eigenständig agieren können und deren Fähigkeiten ausreichen, um jeden Versuch, sie unter Kontrolle zu behalten, außer Kraft setzen können. Unser Ziel ist, Experimente, die den KI-Kontrollverlust riskieren, zu stoppen. Wir unterstützen die Forderung des Machinen Intelligence Research Institutes (MIRI), dass Maßnahmen enthält, um die Weiterentwicklung von KI weltweit zu pausieren:
          Report (englisch)
          Treaty-Draft (englisch)
        </p>

        {/* Unser Ansatz */}
        <h2 className="font-headline text-2xl md:text-3xl text-black mb-4 mt-16">
          Unser Ansatz:
          <br />
          <span className="flex justify-center">
            <span style={highlightStyle}>Klarheit schaffen</span>
          </span>
        </h2>
        <p className="text-content mb-6">
          Das Risiko ist unberechenbar, denn wir wissen weder, wie schnell KI-Entwicklung tatsächlich fortschreiten wird, noch wissen wir, was nach der Entstehung unkontrollierbarer KI-Systeme als nächstes passiert. Um so wichtiger ist es, in den Punkten, in denen es möglich ist, Klarheit zu schaffen:
        </p>

        {/* Key Points as colored boxes */}
        <div className="space-y-4">
          <div style={keyPointOrangeStyle}>
            Jeder Schritt in Richtung eigenständig handelnder Systeme erhöht das Risiko eines Kontrollverlusts.
          </div>
          <div style={keyPointPeachStyle}>
            Solange die Kontrolle über KI bei Menschen liegt, haben wir eine Chance sie zu behalten.
          </div>
          <div style={keyPointPinkStyle}>
            Unsere Existenz ist es wert, geschützt zu werden.
          </div>
        </div>

        <p className="text-content mt-6">
          Künstliche Intelligenz hat bereits alles von Krebsforschung bis Kriegsführung verändert, bei diesem breiten Spektrum von Anwendungsbereichen gerät schnell das wesentliche aus dem Fokus: Den KI-Kontrollverlust zu verhindern ist die Grundvorrausetzung, um spezifische Probleme im Umgang mit KI nachhaltig anzugehen und das positive Potenzial der Technologie zu nutzen. Nur wer das größte Problem nicht verdrängt hat die Chance, sich wirksam davor zu schützen.
        </p>

        {/* Wie Du helfen kannst */}
        <h2 className="font-headline text-2xl md:text-3xl text-black mb-4 mt-16">
          Wie Du helfen kannst:
          <br />
          <span className="flex justify-center">
            <span style={highlightStyle}>Verantwortung annehmen</span>
          </span>
        </h2>
        <p className="text-content">
          Das Risiko, bereits in den nächsten fünf Jahren die Kontrolle zu verlieren, ist real. Sobald sich KI-Systeme menschlicher Kontrolle entziehen, lässt sich die Entwicklung nicht rückgängig machen. Solange die relevanten Entscheidungen noch von Menschen getroffen werden, hat gesellschaftlicher Druck einen Entscheidenden Einfluss darauf, was passiert. Gesellschaftliche Veränderung setzt sich aus den Entscheidungen unzähliger Individuen zusammen. Jeder kann einen kleinen Beitrag dazu leisten, unsere Existenz zu schützen.
        </p>

        {/* Was wir tun */}
        <h2 className="font-headline text-2xl md:text-3xl text-black mb-4 mt-16">Was wir tun</h2>
        <p className="text-content">
          Wir möchten möglichst viele Menschen erreichen, um den Spalt zwischen öffentlicher Debatte und Warnungen von Experten zu schließen. Wir halten öffentliche Vorträge, reden mit Politikern, stellen Informationsmaterial bereit und können Verbindungen zwischen Entscheidungsträgern und renommierten KI-Experten herstellen. Zu vergangenen Aktionen zählen auch Proteste, Tabling und Flyering.
        </p>

        {/* Wie wir uns organisieren */}
        <h2 className="font-headline text-2xl md:text-3xl text-black mb-4 mt-16">Wie wir uns organisieren</h2>
        <p className="text-content">
          PauseAI Germany ist Teil einer internationalen Bewegung. Aktuell organisieren wir uns im Wesentlichen über unseren Discord-Server. Dort gibt es Kanäle zu verschiedenen Projekten. Dort findet auch jeden Donnerstag um 18 Uhr ein Videomeeting statt, bei dem alle Interessenten herzlich eingeladen sind. Darüber hinaus treffen wir uns in einigen Städten regelmäßig in Person. (Infos zu einzelnen Städten folgen.)
        </p>
      </div>
    </section>
  );
}

function MembersSection() {
  const highlightStyle = {
    backgroundColor: '#FF6B9D',
    color: 'white',
    padding: '0.15em 0.5em',
    borderRadius: '0.25em',
    fontSize: '1.2em',
    display: 'inline-block',
  };

  return (
    <section className="relative">
      <PauseIconLattice className="absolute inset-0" />

      <div className="relative z-10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <h2 className="font-headline text-2xl md:text-3xl text-black mb-4 text-center">
            Unser Wunsch:
            <br />
            <span className="flex justify-center">
              <span style={highlightStyle}>Eine menschliche Zukunft</span>
            </span>
          </h2>
        </div>

        <div className="w-full px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
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
        <ContentSection />
        <MembersSection />
      </main>
      <Footer />
    </>
  );
}
