"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  TALLY_NICHT_NUR_DEIN_JOB_STORY,
  tallyEmbedSrc,
} from "@/data/tally";

export default function UmfrageEmbed() {
  const [submitted, setSubmitted] = useState(true);
  const thankYouRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== "https://tally.so") return;
      if (typeof event.data !== "string") return;
      if (!event.data.includes("Tally.FormSubmitted")) return;
      try {
        const parsed = JSON.parse(event.data) as { event?: string };
        if (parsed.event === "Tally.FormSubmitted") {
          setSubmitted(true);
        }
      } catch {
        // ignore malformed messages
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (submitted && thankYouRef.current) {
      thankYouRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [submitted]);

  if (submitted) {
    return (
      <div
        ref={thankYouRef}
        data-testid="tally-thank-you"
        className="border-t border-pause-black/10 pt-12"
      >
        <h2 className="font-display text-3xl md:text-5xl text-pause-black leading-tight mb-6">
          Danke, dass du deine Geschichte mit uns geteilt hast! 🙏 🎉
        </h2>
        <p className="font-body text-pause-black/75 text-lg leading-relaxed mb-10 max-w-2xl">
          Mit dir gemeinsam bauen wir den Druck auf, der eine menschliche Zukunft möglich macht.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a
            href="https://www.pause-ai.de/#was-du-tun-kannst"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#FF9416] px-6 py-3 font-section text-base tracking-wider text-black transition-colors hover:bg-[#e88510]"
          >
            Mach den nächsten Schritt →
          </a>
          <a
            href="https://www.pause-ai.de/nicht-nur-dein-job"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-pause-black/20 px-6 py-3 font-section text-base tracking-wider text-pause-black transition-colors hover:bg-pause-black/[0.03]"
          >
            Zurück zur Kampagne
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <iframe
        data-tally-src={tallyEmbedSrc(TALLY_NICHT_NUR_DEIN_JOB_STORY)}
        loading="lazy"
        width="100%"
        height="700"
        frameBorder={0}
        title="Erzähl deine Geschichte – PauseAI"
        data-testid="tally-iframe"
        className="block w-full min-h-[700px] border-0"
      />
      <noscript>
        <p className="font-body text-pause-black/75 text-base leading-relaxed mt-6">
          Diese Form benötigt JavaScript.{" "}
          <a
            href={`https://tally.so/r/${TALLY_NICHT_NUR_DEIN_JOB_STORY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="orange-link"
          >
            Direkt bei Tally öffnen →
          </a>
        </p>
      </noscript>
      <p className="font-body text-xs text-pause-black/50 mt-8">
        Form-Anbieter: Tally (EU). Mit dem Absenden willigst du in die Verarbeitung deiner
        Angaben durch PauseAI Deutschland und Tally als Auftragsverarbeiter ein. Mehr in der{" "}
        <Link href="/datenschutz" className="orange-link">
          Datenschutzerklärung
        </Link>
        .
      </p>
    </>
  );
}
