"use client";

import { useState, useMemo } from "react";
import SectionAnchor from "./SectionAnchor";
import {
  STATIC_PRESS,
  CATEGORY_LABELS,
  LANGUAGE_LABELS,
  type PressLanguage,
  type PressCategory,
  type PressItem,
} from "@/data/press";

type LangFilter = "all" | PressLanguage;
type CatFilter = "all" | PressCategory;

const DATE_FMT = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
const CATEGORIES: CatFilter[] = ["all", "entlassung", "studie", "video", "auswirkung", "missbrauch", "jugend"];
const LANGUAGES: LangFilter[] = ["all", "de", "en"];

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`font-section text-xs tracking-wider uppercase px-3.5 py-2 border transition-colors ${
        active
          ? "border-[#FF9416] bg-[#FF9416] text-black"
          : "border-white/15 text-white/50 hover:border-white/40 hover:text-white/80"
      }`}
    >
      {label}
    </button>
  );
}

function PressCard({ item }: { item: PressItem }) {
  return (
    <article className="border-t border-white/10 pt-6 hover:border-white/25 transition-colors">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full group"
      >
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="font-section text-xs tracking-wider uppercase text-[#FF9416]">
            {CATEGORY_LABELS[item.category]}
          </span>
          <span className="text-white/20">·</span>
          <span className="font-section text-xs text-white/40 uppercase tracking-wider">
            {item.language}
          </span>
          <span className="text-white/20">·</span>
          <time className="font-section text-xs text-white/40 tabular-nums tracking-wider uppercase" dateTime={item.publishedAt}>
            {DATE_FMT.format(new Date(item.publishedAt))}
          </time>
        </div>
        <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-white/90">
          {item.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4">
          {item.excerpt}
        </p>
        <p className="font-section text-xs uppercase tracking-[0.15em] text-white/40 group-hover:text-[#FF9416] transition-colors">
          {item.source} →
        </p>
      </a>
    </article>
  );
}

export default function PresseSection() {
  const [lang, setLang] = useState<LangFilter>("all");
  const [cat, setCat] = useState<CatFilter>("all");

  const filtered = useMemo(() => {
    return STATIC_PRESS.filter((p) => {
      if (lang !== "all" && p.language !== lang) return false;
      if (cat !== "all" && p.category !== cat) return false;
      return true;
    }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [lang, cat]);

  return (
    <section id="presse" data-section-id="presse" className="bg-pause-gray-dark py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="group/section flex items-start mb-12">
        <h2 className="font-section font-black uppercase text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] scroll-mt-24">
          Presse:<br />
          <span className="text-[#FF9416]">Bleib informiert.</span>
        </h2>
        <SectionAnchor id="presse" />
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-12">
          <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Sprache filtern">
            <span className="font-section text-xs uppercase tracking-wider text-white/30 mr-1 self-center">
              Sprache:
            </span>
            {LANGUAGES.map((l) => (
              <FilterChip
                key={l}
                active={lang === l}
                label={l === "all" ? "Alle" : LANGUAGE_LABELS[l]}
                onClick={() => setLang(l)}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Kategorie filtern">
            <span className="font-section text-xs uppercase tracking-wider text-white/30 mr-1 self-center">
              Kategorie:
            </span>
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                active={cat === c}
                label={c === "all" ? "Alle" : CATEGORY_LABELS[c]}
                onClick={() => setCat(c)}
              />
            ))}
          </div>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="border-t border-white/10 pt-10 text-center">
            <p className="text-white/50">
              Keine Artikel passen zu deinen Filtern.
            </p>
            <button
              type="button"
              onClick={() => {
                setLang("all");
                setCat("all");
              }}
              className="font-section text-sm tracking-wider text-[#FF9416] mt-3 hover:underline"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {filtered.map((p) => (
              <PressCard key={p.url} item={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
