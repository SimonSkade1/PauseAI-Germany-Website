import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Kontakt() {
  return (
    <>
      <Header />

      <main className="bg-pause-gray-light min-h-screen pt-24 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h1 className="font-headline text-3xl text-pause-black mb-12 md:text-4xl">
            Kontakt und Austausch
          </h1>

          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm space-y-8">
            {/* Intro */}
            <section>
              <p className="font-body text-pause-black/80 text-lg leading-relaxed">
                Wir beantworten Fragen, geben Hintergrundinformationen und stehen für Gespräche zur Verfügung. Bürger:innen, politische Entscheidungsträger:innen und Journalist:innen können sich jederzeit an uns wenden.
              </p>
            </section>

            {/* Kontakt */}
            <section>
              <h2 className="font-section text-lg text-pause-black mb-4">
                Anliegen und Themen
              </h2>
              <div className="font-body text-pause-black/80">
                <p className="mb-4">
                  Mit folgenden Themen kannst du dich gerne an uns wenden:
                </p>
                <ul className="list-disc list-inside space-y-1 mb-6 text-pause-black/70">
                  <li>Fragen zu Risiken fortgeschrittener KI-Systeme</li>
                  <li>Gespräche mit politischen Akteur:innen</li>
                  <li>Presseanfragen und Interviews</li>
                  <li>Kooperationsanfragen und gemeinsame Projekte</li>
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

      <Footer />
    </>
  );
}
