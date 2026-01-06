"use client";

import Image from "next/image";
import React from "react";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-[#FF9416] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {/* Logo & Description */}
          <div>
            <Image
              src="/Logo Outlined.png"
              alt="PauseAI Logo"
              width={140}
              height={40}
              className="h-10 w-auto mb-4"
            />
            <p className="font-body text-black/70 text-sm">
              Wir klären über KI-Risiken auf und setzen uns für sichere
              KI-Entwicklung ein.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-section text-sm text-black mb-4 tracking-wider">
              Newsletter
            </h4>
            <NewsletterForm variant="orange" />
          </div>

          {/* Links */}
          <div>
            <h4 className="font-section text-sm text-black mb-4 tracking-wider">
              Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/impressum"
                  className="font-body text-black/70 text-sm hover:text-white transition-colors"
                >
                  Impressum
                </a>
              </li>
              {/* Easy to add more links here */}
            </ul>
          </div>
        </div>

        <div className="border-t border-black/10 mt-10 pt-8 text-center">
          <p className="font-body text-black/50 text-sm">
            &copy; {new Date().getFullYear()} PauseAI Germany. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
