import Image from "next/image";
import Link from "next/link";

export default function Kontakt() {
  return (
    <>
      {/* Header */}
      <header className="bg-[#FF9416] py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6">
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

      <main className="bg-pause-gray-light min-h-screen py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h1 className="font-headline text-4xl text-pause-black mb-12 md:text-5xl">
            Kontakt
          </h1>

          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm space-y-8">
            {/* Intro */}
            <section>
              <p className="font-body text-pause-black/80 text-lg leading-relaxed">
                Wir freuen uns darauf, mit dir ins Gespräch zu kommen. Egal ob
                du Politiker:in, besorgte Bürger:in oder Journalist:in bist –
                wir stehen für Fragen und Austausch zur Verfügung.
              </p>
            </section>

            {/* Kontakt */}
            <section>
              <h2 className="font-section text-lg text-pause-black mb-4">
                Schreib uns
              </h2>
              <div className="font-body text-pause-black/80">
                <p className="mb-4">
                  Mit folgenden Themen kannst du dich gerne an uns wenden:
                </p>
                <ul className="list-disc list-inside space-y-1 mb-6 text-pause-black/70">
                  <li>Allgemeine Fragen zu KI-Risiken</li>
                  <li>Politische Gespräche</li>
                  <li>Presseanfragen und Interviews</li>
                  <li>Kooperationsanfragen</li>
                </ul>
                <p className="text-lg">
                  E-Mail:{" "}
                  <a
                    href="mailto:germany@pauseai.info"
                    className="orange-link font-body-bold"
                  >
                    germany@pauseai.info
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="font-body text-pause-black/60 hover:text-[#FF9416] transition-colors"
            >
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#FF9416] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-body text-black/50 text-sm">
            © {new Date().getFullYear()} PauseAI Germany. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </footer>
    </>
  );
}
