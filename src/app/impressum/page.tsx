import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Impressum() {
  return (
    <>
      <Header />

      <main className="bg-pause-gray-light min-h-screen pt-24 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h1 className="font-headline text-4xl text-pause-black mb-12 md:text-5xl">
            Impressum
          </h1>

          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm space-y-8">
            {/* Angaben gemäß § 5 TMG */}
            <section>
              <h2 className="font-section text-lg text-pause-black mb-4">
                Angaben gemäß § 5 TMG
              </h2>
              <div className="font-body text-pause-black/80 space-y-1">
                <p className="font-body-bold">PauseAI Deutschland e.V. i.G.</p>
                <p>(Verein in Gründung)</p>
                <p className="mt-4">Burgemeisterstraße 30</p>
                <p>c/o Coordes</p>
                <p>12103 Berlin</p>
              </div>
            </section>

            {/* Vertreten durch */}
            <section>
              <h2 className="font-section text-lg text-pause-black mb-4">
                Vertreten durch den Vorstand
              </h2>
              <ul className="font-body text-pause-black/80 space-y-1">
                <li>Benjamin Schmidt</li>
                <li>Simon Skade</li>
                <li>Evander Hammer</li>
                <li>Amir Benjamin Balde</li>
                <li>Karen Ihrke</li>
                <li>Hauke Harders</li>
                <li>Adrian Glubrecht</li>
              </ul>
            </section>

            {/* Kontakt */}
            <section>
              <h2 className="font-section text-lg text-pause-black mb-4">
                Kontakt
              </h2>
              <div className="font-body text-pause-black/80">
                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:germany@pauseai.info"
                    className="orange-link"
                  >
                    germany@pauseai.info
                  </a>
                </p>
              </div>
            </section>

            {/* Registereintrag */}
            <section>
              <h2 className="font-section text-lg text-pause-black mb-4">
                Registereintrag
              </h2>
              <p className="font-body text-pause-black/80">
                Der Verein befindet sich derzeit im Gründungsprozess. Die
                Eintragung in das Vereinsregister ist beantragt.
              </p>
            </section>

            {/* Verantwortlich für den Inhalt */}
            <section>
              <h2 className="font-section text-lg text-pause-black mb-4">
                Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
              </h2>
              <p className="font-body text-pause-black/80">Benjamin Schmidt</p>
            </section>

            {/* Haftungsausschluss */}
            <section>
              <h2 className="font-section text-lg text-pause-black mb-4">
                Haftungsausschluss
              </h2>

              <h3 className="font-body-bold text-pause-black mt-4 mb-2">
                Haftung für Inhalte
              </h3>
              <p className="font-body text-pause-black/80">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
                Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
                können wir jedoch keine Gewähr übernehmen.
              </p>

              <h3 className="font-body-bold text-pause-black mt-4 mb-2">
                Haftung für Links
              </h3>
              <p className="font-body text-pause-black/80">
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich.
              </p>

              <h3 className="font-body-bold text-pause-black mt-4 mb-2">
                Urheberrecht
              </h3>
              <p className="font-body text-pause-black/80">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
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
