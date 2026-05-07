"use client";

import { useEffect, useId, useRef, useState } from "react";
import DankeSection from "./DankeSection";

const TOKEN_KEY = "njdj_token";
const STORY_MAX = 5000;

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const;
type AgeRange = typeof AGE_RANGES[number];

interface FieldError {
  profession?: string;
  industry?: string;
  ageRange?: string;
  story?: string;
  consent?: string;
  contactEmail?: string;
}

function getOrCreateToken(): string {
  if (typeof window === "undefined") return "";
  let t = window.localStorage.getItem(TOKEN_KEY);
  if (!t) {
    t = (typeof crypto !== "undefined" && "randomUUID" in crypto)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(TOKEN_KEY, t);
  }
  return t;
}

export default function SurveyForm() {
  const ids = {
    profession: useId(),
    industry: useId(),
    ageRange: useId(),
    story: useId(),
    contactEmail: useId(),
    consent: useId(),
    quote: useId(),
    honeypot: useId(),
  };

  const [profession, setProfession] = useState("");
  const [industry, setIndustry] = useState("");
  const [ageRange, setAgeRange] = useState<AgeRange | "">("");
  const [story, setStory] = useState("");
  const [allowQuoting, setAllowQuoting] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // bots fill this; humans don't see it
  const [errors, setErrors] = useState<FieldError>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Pre-create token so it exists before submit.
    getOrCreateToken();
  }, []);

  const validate = (): FieldError => {
    const e: FieldError = {};
    if (!profession.trim()) e.profession = "Bitte gib deinen Beruf an.";
    if (!industry.trim()) e.industry = "Bitte gib deine Branche an.";
    if (!ageRange) e.ageRange = "Bitte wähle deine Altersgruppe.";
    if (!story.trim()) e.story = "Bitte erzähl uns deine Geschichte.";
    if (story.length > STORY_MAX) e.story = `Maximal ${STORY_MAX.toLocaleString("de-DE")} Zeichen.`;
    if (!consent) e.consent = "Ohne deine Einwilligung dürfen wir die Daten nicht speichern.";
    if (allowQuoting && contactEmail) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
      if (!ok) e.contactEmail = "Bitte eine gültige E-Mail-Adresse oder leer lassen.";
    }
    return e;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // Focus first invalid field
      const firstKey = Object.keys(e)[0];
      const firstId = (ids as Record<string, string>)[firstKey];
      if (firstId) document.getElementById(firstId)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch("/api/survey-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profession: profession.trim(),
          industry: industry.trim(),
          ageRange,
          story: story.trim(),
          allowQuoting,
          contactEmail: allowQuoting && contactEmail ? contactEmail.trim() : undefined,
          submitterToken: getOrCreateToken(),
          honeypot: honeypot || undefined,
          consentedAt: Date.now(),
        }),
      });
      if (!r.ok) {
        const data = (await r.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Server-Fehler (${r.status}).`);
      }
      setDone(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Übermittlung fehlgeschlagen.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <DankeSection />;

  const charCount = story.length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      {/* Honeypot — visually hidden but available to bots */}
      <div aria-hidden style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={ids.honeypot}>Wenn du das siehst, lass es leer:</label>
        <input
          id={ids.honeypot}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor={ids.profession} className="block font-section text-sm tracking-wider uppercase text-pause-black/70 mb-2">
          Beruf <span aria-hidden className="text-[#FF9416]">*</span>
        </label>
        <input
          id={ids.profession}
          name="profession"
          type="text"
          required
          autoComplete="organization-title"
          maxLength={120}
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          aria-invalid={!!errors.profession}
          aria-describedby={errors.profession ? `${ids.profession}-err` : undefined}
          className="w-full font-body text-pause-black border border-pause-black/20 px-4 py-3 focus:border-[#FF9416] focus:outline-none"
        />
        {errors.profession && (
          <p id={`${ids.profession}-err`} role="alert" className="font-body text-sm text-red-700 mt-2">
            {errors.profession}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={ids.industry} className="block font-section text-sm tracking-wider uppercase text-pause-black/70 mb-2">
          Branche <span aria-hidden className="text-[#FF9416]">*</span>
        </label>
        <input
          id={ids.industry}
          name="industry"
          type="text"
          required
          maxLength={120}
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          aria-invalid={!!errors.industry}
          aria-describedby={errors.industry ? `${ids.industry}-err` : undefined}
          className="w-full font-body text-pause-black border border-pause-black/20 px-4 py-3 focus:border-[#FF9416] focus:outline-none"
        />
        {errors.industry && (
          <p id={`${ids.industry}-err`} role="alert" className="font-body text-sm text-red-700 mt-2">
            {errors.industry}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={ids.ageRange} className="block font-section text-sm tracking-wider uppercase text-pause-black/70 mb-2">
          Altersgruppe <span aria-hidden className="text-[#FF9416]">*</span>
        </label>
        <select
          id={ids.ageRange}
          name="ageRange"
          required
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value as AgeRange)}
          aria-invalid={!!errors.ageRange}
          aria-describedby={errors.ageRange ? `${ids.ageRange}-err` : undefined}
          className="w-full font-body text-pause-black border border-pause-black/20 px-4 py-3 bg-white focus:border-[#FF9416] focus:outline-none"
        >
          <option value="" disabled>
            Bitte wählen
          </option>
          {AGE_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.ageRange && (
          <p id={`${ids.ageRange}-err`} role="alert" className="font-body text-sm text-red-700 mt-2">
            {errors.ageRange}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={ids.story} className="block font-section text-sm tracking-wider uppercase text-pause-black/70 mb-2">
          Deine Geschichte <span aria-hidden className="text-[#FF9416]">*</span>
        </label>
        <textarea
          id={ids.story}
          name="story"
          required
          rows={8}
          maxLength={STORY_MAX}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          aria-invalid={!!errors.story}
          aria-describedby={`${ids.story}-help${errors.story ? ` ${ids.story}-err` : ""}`}
          placeholder="Wie verändert KI deine Arbeit, dein Berufsbild, deine Aussichten?"
          className="w-full font-body text-pause-black border border-pause-black/20 px-4 py-3 focus:border-[#FF9416] focus:outline-none resize-y"
        />
        <div id={`${ids.story}-help`} className="flex justify-between mt-2">
          <p className="font-body text-xs text-pause-black/60">
            Anonym oder mit Namen — wie du willst.
          </p>
          <p className="font-body text-xs text-pause-black/60 tabular-nums" aria-live="polite">
            {charCount.toLocaleString("de-DE")} / {STORY_MAX.toLocaleString("de-DE")}
          </p>
        </div>
        {errors.story && (
          <p id={`${ids.story}-err`} role="alert" className="font-body text-sm text-red-700 mt-2">
            {errors.story}
          </p>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-pause-black/10">
        <div>
          <label className="flex gap-3 items-start cursor-pointer group" htmlFor={ids.quote}>
            <input
              id={ids.quote}
              type="checkbox"
              checked={allowQuoting}
              onChange={(e) => setAllowQuoting(e.target.checked)}
              className="mt-1 h-5 w-5 accent-[#FF9416]"
            />
            <span className="font-body text-pause-black/85 leading-relaxed">
              Ich bin damit einverstanden, anonym oder mit Vornamen zitiert zu werden – z.B. auf
              dieser Seite oder in Pressearbeit.
            </span>
          </label>
        </div>

        {allowQuoting && (
          <div>
            <label htmlFor={ids.contactEmail} className="block font-section text-sm tracking-wider uppercase text-pause-black/70 mb-2">
              E-Mail (optional, falls wir nachfragen wollen)
            </label>
            <input
              id={ids.contactEmail}
              name="contactEmail"
              type="email"
              autoComplete="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              aria-invalid={!!errors.contactEmail}
              aria-describedby={errors.contactEmail ? `${ids.contactEmail}-err` : undefined}
              className="w-full font-body text-pause-black border border-pause-black/20 px-4 py-3 focus:border-[#FF9416] focus:outline-none"
            />
            {errors.contactEmail && (
              <p id={`${ids.contactEmail}-err`} role="alert" className="font-body text-sm text-red-700 mt-2">
                {errors.contactEmail}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="flex gap-3 items-start cursor-pointer" htmlFor={ids.consent}>
            <input
              id={ids.consent}
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? `${ids.consent}-err` : undefined}
              className="mt-1 h-5 w-5 accent-[#FF9416]"
            />
            <span className="font-body text-pause-black/85 leading-relaxed">
              Ich willige ein, dass meine Angaben für die Auswertung dieser Kampagne gespeichert
              werden. Mehr in der{" "}
              <a href="/datenschutz" className="orange-link">
                Datenschutzerklärung
              </a>
              . <span aria-hidden className="text-[#FF9416]">*</span>
            </span>
          </label>
          {errors.consent && (
            <p id={`${ids.consent}-err`} role="alert" className="font-body text-sm text-red-700 mt-2">
              {errors.consent}
            </p>
          )}
        </div>
      </div>

      {serverError && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 font-body">
          {serverError}
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center bg-[#FF9416] disabled:bg-[#FF9416]/50 disabled:cursor-not-allowed px-8 py-4 font-section text-base tracking-wider text-black transition-colors hover:bg-[#e88510]"
        >
          {submitting ? "Wird gesendet …" : "Geschichte absenden →"}
        </button>
      </div>
    </form>
  );
}
