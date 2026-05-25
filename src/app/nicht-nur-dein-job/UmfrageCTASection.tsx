"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import SectionAnchor from "./SectionAnchor";

const SHARE_URL = "https://pause-ai.de/nicht-nur-dein-job";
const SHARE_TEXT =
  "Nicht nur dein Job – wenn wir die Kontrolle über KI verlieren, steht weit mehr auf dem Spiel: unsere Selbstbestimmung, unsere Demokratie, unsere Existenz. Aber diese Entwicklung ist nicht unvermeidlich! Erfahre mehr und erzähle deine Geschichte:";

export default function UmfrageCTASection() {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SHARE_TEXT + "\n" + SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    await navigator.share({ title: "Nicht nur dein Job | PauseAI Deutschland", text: SHARE_TEXT, url: SHARE_URL });
  };

  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT + "\n" + SHARE_URL)}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + "\n" + SHARE_URL)}`;
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`;

  return (
    <section id="umfrage-cta" data-section-id="umfrage-cta" className="bg-[#FF9416] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="group/section flex items-start mb-10">
        <h2 className="font-section font-black uppercase text-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] scroll-mt-24">
          Erzähl uns<br />
          <span className="text-white">deine</span> Geschichte.
        </h2>
        <SectionAnchor id="umfrage-cta" dark={false} />
        </div>

        {/* Body */}
        <p className="font-bold text-black/80 text-base md:text-lg leading-relaxed max-w-lg mb-3">
          Wir sammeln Geschichten aus ganz Deutschland: Angestellte, Selbstständige,
          Arbeitsuchende, Azubis, Student:innen, Schüler:innen, Eltern, Rentner:innen.
          Was passiert gerade bei <em>dir</em>?
        </p>


        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/nicht-nur-dein-job/umfrage"
            className="inline-flex items-center justify-center bg-[#1a1a1a] text-white px-8 py-4 min-h-[52px] font-section font-bold text-base tracking-wide transition-colors hover:bg-black"
          >
            Erzähl deine Geschichte →
          </Link>
          <a
            href="https://www.pause-ai.de/#was-du-tun-kannst"
            className="inline-flex items-center justify-center border-2 border-black/30 px-8 py-4 font-section font-bold text-base tracking-wide text-black transition-colors hover:bg-black/10"
          >
            Erfahre was du sonst tun kannst →
          </a>
        </div>

        {/* Share */}
        <div className="border-t border-black/15 pt-10">
          <p className="font-bold text-black/80 text-base leading-relaxed max-w-lg mb-5">
            Je mehr Menschen verstehen, was auf dem Spiel steht, desto mehr können wir gemeinsam
            bewegen. Teile diese Seite mit Freunden, Familie und Kollegen.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {canNativeShare && (
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center gap-2 border border-black/20 px-5 py-3.5 min-h-[52px] font-section text-sm tracking-wider text-black hover:bg-black/10 transition-colors w-full sm:w-auto"
              >
                <Share2 size={16} />
                Instagram & mehr
              </button>
            )}
            <a href={xUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-black/20 px-5 py-3.5 min-h-[52px] font-section text-sm tracking-wider text-black hover:bg-black/10 transition-colors w-full sm:w-auto">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.75l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Auf X teilen
            </a>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-black/20 px-5 py-3.5 min-h-[52px] font-section text-sm tracking-wider text-black hover:bg-black/10 transition-colors w-full sm:w-auto">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Per WhatsApp
            </a>
            <a href={tgUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-black/20 px-5 py-3.5 min-h-[52px] font-section text-sm tracking-wider text-black hover:bg-black/10 transition-colors w-full sm:w-auto">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Per Telegram
            </a>
            <button onClick={handleCopy}
              className="inline-flex items-center gap-2 border border-black/20 px-5 py-3.5 min-h-[52px] font-section text-sm tracking-wider text-black hover:bg-black/10 transition-colors w-full sm:w-auto">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
