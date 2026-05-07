"use client";

import { useState, useMemo } from "react";
import LinkedHeading from "@/components/LinkedHeading";
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
      className={`font-section text-xs md:text-sm tracking-wider uppercase px-3.5 py-2 border transition-colors ${
        active
          ? "border-[#FF9416] bg-[#FF9416] text-black"
          : "border-pause-black/15 text-pause-black/70 hover:border-pause-black/40 hover:text-pause-black"
      }`}
    >
      {label}
    </button>
  );
}

function PressCard({ item }: { item: PressItem }) {
  return (
    <article className="border border-pause-black/10 hover:border-pause-black/30 transition-colors bg-white">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6 h-full"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="font-section text-xs tracking-wider uppercase text-[#FF9416]">
            {CATEGORY_LABELS[item.category]}
          </span>
          <span className="text-pause-black/30">·</span>
          <span className="font-body text-xs text-pause-black/50 uppercase">
            {item.language}
          </span>
          <span className="text-pause-black/30">·</span>
          <time className="font-body text-xs text-pause-black/50 tabular-nums" dateTime={item.publishedAt}>
            {DATE_FMT.format(new Date(item.publishedAt))}
          </time>
        </div>
        <h3 className="font-body-bold text-lg leading-tight text-pause-black mb-2">
          {item.title}
        </h3>
        <p className="font-body text-sm text-pause-black/70 leading-relaxed mb-3">
          {item.excerpt}
        </p>
        <p className="font-section text-xs uppercase tracking-wider text-pause-black/50">
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
    <section data-section-id="presse" className="bg-[#fafafa] py-20 md:py-32 border-t border-pause-black/10">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <LinkedHeading id="presse">Presse: bleib informiert</LinkedHeading>
        <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
          Eine Auswahl von Berichten zu KI und Arbeitsmarkt aus deutschen und internationalen
          Quellen.
        </p>

        <div className="space-y-4 mb-10">
          <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Sprache filtern">
            <span className="font-section text-xs uppercase tracking-wider text-pause-black/50 mr-1 self-center">
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
            <span className="font-section text-xs uppercase tracking-wider text-pause-black/50 mr-1 self-center">
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

        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white border border-pause-black/10">
            <p className="font-body text-pause-black/60">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <PressCard key={p.url} item={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
