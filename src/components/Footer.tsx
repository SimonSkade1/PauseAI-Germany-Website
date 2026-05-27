import Image from "next/image";
import Link from "next/link";

function NewsletterForm() {
  return (
    <a
      href="https://pauseaide.substack.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-black text-white hover:bg-gray-800 px-4 py-2 text-xs font-section tracking-wider rounded-lg transition-colors"
    >
      Zum Newsletter
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#FF9416] py-12 md:py-16">
      <div className="px-8 md:px-16 lg:px-24">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-12">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="inline-block mb-4" aria-label="Zur Startseite">
              <Image
                src="/logos/logo-wordmark-DE-orange-bg.png"
                alt="PauseAI Logo"
                width={198}
                height={40}
              />
            </Link>
            <p className="font-body text-black font-medium text-sm">
              Wir klären über KI-Risiken auf und setzen uns für sichere
              KI-Entwicklung ein.
              Wir wollen nicht heutige KI abschaffen, sondern fordern ein globales Abkommen, das die Entwicklung unkontrollierbarer KI-Systeme verhindert.
              PauseAI Deutschland ist Teil einer <a href="https://pauseai.info" className="font-bold underline hover:text-[#7a3f00] transition-colors inline-flex items-center gap-0.5" target="_blank" rel="noopener noreferrer">internationalen Bewegung<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg></a>.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-section text-sm text-black mb-4 tracking-wider">
              Newsletter
            </h4>
            <NewsletterForm />
          </div>

          {/* Links */}
          <div>
            <h4 className="font-section text-sm text-black mb-4 tracking-wider">
              Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/kontakt"
                  className="font-body text-black font-medium text-sm underline hover:text-[#7a3f00] transition-colors"
                >
                  Kontakt
                </a>
              </li>
              <li>
                <a
                  href="/datenschutz"
                  className="font-body text-black font-medium text-sm underline hover:text-[#7a3f00] transition-colors"
                >
                  Datenschutz
                </a>
              </li>
              <li>
                <a
                  href="/impressum"
                  className="font-body text-black font-medium text-sm underline hover:text-[#7a3f00] transition-colors"
                >
                  Impressum
                </a>
              </li>
              <li>
                <a
                  href="/presse"
                  className="font-body text-black font-medium text-sm underline hover:text-[#7a3f00] transition-colors"
                >
                  Presse/Media
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-section text-sm text-black mb-4 tracking-wider">
              Social Media
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.instagram.com/pauseai_de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-black font-medium text-sm underline hover:text-[#7a3f00] transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/pauseai_de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-black font-medium text-sm underline hover:text-[#7a3f00] transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@pauseai_de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-black font-medium text-sm underline hover:text-[#7a3f00] transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                  </svg>
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/pauseai-de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-black font-medium text-sm underline hover:text-[#7a3f00] transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@PauseAI_DE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-black font-medium text-sm underline hover:text-[#7a3f00] transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/10 mt-10 pt-8 text-center">
          <p className="font-body text-black/70 font-medium text-sm">
            &copy; {new Date().getFullYear()} PauseAI Deutschland. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
