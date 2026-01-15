"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSet8gf61pTqCYv4Fa1OAKGt6BizTKBaeyTTqIyhdlbaoOf5iw/formResponse";
const GOOGLE_FORM_EMAIL_ENTRY = "entry.1229172991";

function NewsletterForm({ variant = "orange" }: { variant?: "orange" }) {
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
      <p className="font-body text-black">
        Danke für deine Anmeldung!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-Mail-Adresse"
        className="newsletter-input-orange flex-1 px-4 py-2 text-sm rounded-lg font-body"
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-black text-white hover:bg-gray-800 px-4 py-2 text-xs rounded-lg font-section tracking-wider whitespace-nowrap disabled:opacity-50 transition-colors"
      >
        {status === "loading" ? "..." : "Abonnieren"}
      </button>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#FF9416] py-12 md:py-16">
      <div className="px-8 md:px-16 lg:px-24">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10 xl:gap-12">
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
