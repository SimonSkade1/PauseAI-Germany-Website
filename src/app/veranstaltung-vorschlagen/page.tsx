"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function getOrCreateToken(): string {
  const key = "pauseai_voter_token";
  let token = localStorage.getItem(key);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(key, token);
  }
  return token;
}

type Suggestion = {
  _id: Id<"eventSuggestions">;
  title: string;
  description?: string;
  submitterName?: string;
  submitterContact?: string;
  createdAt: number;
  upvotes: number;
  downvotes: number;
  myVote: "up" | "down" | null;
  isOwner: boolean;
};

function SuggestionCard({ suggestion, onVote, onDelete }: { suggestion: Suggestion; onVote: (id: Id<"eventSuggestions">, vote: "up" | "down") => void; onDelete: (id: Id<"eventSuggestions">) => void }) {
  const score = suggestion.upvotes - suggestion.downvotes;
  return (
    <div className="bg-white border border-[#1a1a1a] md:border-2 p-5">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
          <button
            type="button"
            onClick={() => onVote(suggestion._id, "up")}
            className={`w-8 h-8 flex items-center justify-center border transition-colors cursor-pointer ${
              suggestion.myVote === "up"
                ? "bg-[#FF9416] border-[#FF9416] text-black"
                : "border-[#1a1a1a] bg-white hover:bg-[#FFFAF5]"
            }`}
            aria-label="Upvote"
          >
            ▲
          </button>
          <span className={`font-section text-sm font-bold ${score > 0 ? "text-[#FF9416]" : score < 0 ? "text-red-500" : "text-pause-black/50"}`}>
            {score}
          </span>
          <button
            type="button"
            onClick={() => onVote(suggestion._id, "down")}
            className={`w-8 h-8 flex items-center justify-center border transition-colors cursor-pointer ${
              suggestion.myVote === "down"
                ? "bg-red-500 border-red-500 text-white"
                : "border-[#1a1a1a] bg-white hover:bg-[#FFFAF5]"
            }`}
            aria-label="Downvote"
          >
            ▼
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-section text-base md:text-lg text-pause-black leading-snug">{suggestion.title}</h3>
          {suggestion.description && (
            <p className="font-body text-sm text-pause-black/60 mt-2 leading-relaxed">{suggestion.description}</p>
          )}
          <div className="flex items-center justify-between mt-3 gap-2">
            <div className="font-body text-xs text-pause-black/40 space-y-0.5">
              <p>
                {suggestion.submitterName ? `Vorgeschlagen von ${suggestion.submitterName}` : "Anonym vorgeschlagen"}
                {" am "}
                {new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(suggestion.createdAt))}
              </p>
              {suggestion.submitterContact && <p>Kontakt: {suggestion.submitterContact}</p>}
            </div>
            {suggestion.isOwner && (
              <button
                type="button"
                onClick={() => onDelete(suggestion._id)}
                className="font-body text-xs text-pause-black/30 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                aria-label="Vorschlag löschen"
              >
                Löschen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventSuggestPage() {
  const [token, setToken] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterContact, setSubmitterContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setToken(getOrCreateToken());
  }, []);

  const suggestions = useQuery(
    api.eventSuggestions.getSuggestions,
    token ? { voterToken: token } : "skip"
  ) as Suggestion[] | undefined;

  const submitMutation = useMutation(api.eventSuggestions.submitSuggestion);
  const voteMutation = useMutation(api.eventSuggestions.castVote);
  const deleteMutation = useMutation(api.eventSuggestions.deleteSuggestion);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitMutation({
        title: title.trim(),
        description: description.trim() || undefined,
        submitterName: submitterName.trim() || undefined,
        submitterContact: submitterContact.trim() || undefined,
        submitterToken: token,
      });
      setTitle("");
      setDescription("");
      setSubmitterName("");
      setSubmitterContact("");
      setSuccess(true);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Einreichen.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVote(id: Id<"eventSuggestions">, vote: "up" | "down") {
    if (!token) return;
    await voteMutation({ suggestionId: id, voterToken: token, vote });
  }

  async function handleDelete(id: Id<"eventSuggestions">) {
    if (!token) return;
    await deleteMutation({ suggestionId: id, submitterToken: token });
  }

  return (
    <>
      <Header />
      <main className="bg-[#FFFAF5] min-h-screen py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          <a href="/#veranstaltungen" className="inline-flex items-center gap-2 font-body text-sm text-pause-black/50 hover:text-pause-black mb-8 transition-colors">
            ← Zurück zu den Veranstaltungen
          </a>
          <h1 className="font-headline text-2xl md:text-4xl lg:text-5xl text-pause-black mb-4">
            Thema vorschlagen
          </h1>
          <p className="font-body text-pause-black/60 mb-10">
            Wir treffen uns jeden Donnerstag um 18 Uhr online und sprechen über verschiedene Themen rund um die Gefahren von KI und unsere Bewegung.
            Zum Beispiel hatten wir Vorträge zur Entwicklung von Superintelligenz, Diskussionsrunden zu häufigen Einwänden gegen KI-Sicherheit, Workshops zum anwenden der sokratischen Methode beim Argumentieren und vieles mehr. Meistens sind die Themen zwischen 30 und 45 Minuten lang, wir sind aber flexibel.
          </p>
          <p className="font-body text-pause-black/60 mb-10">
            Wenn du ein Thema hast, das dich interessiert oder das du vorstellen willst, dann schlage es gern hier vor.
            Außerdem kannst du auch für bestehende Vorschläge abstimmen, damit wir sehen, was die Community am meisten interessiert.
            Ansonsten kannst du uns auch eine Mail schreiben an: <a href="mailto:markus@pauseai.info" className="underline hover:text-pause-black"> markus@pauseai.info </a>
          </p>

          {success && (
            <div className="bg-[#FF9416]/10 border border-[#FF9416] px-5 py-4 mb-6 font-body text-sm text-pause-black">
              Danke! Dein Vorschlag wurde eingereicht.
            </div>
          )}

          {!showForm ? (
            <button
              type="button"
              onClick={() => { setShowForm(true); setSuccess(false); }}
              className="inline-flex items-center justify-center border-2 border-[#1a1a1a] bg-[#FF9416] px-6 py-3 font-section text-sm tracking-wider text-black transition-colors hover:bg-[#e88510] cursor-pointer mb-10"
            >
              + Neuen Vorschlag einreichen
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border-2 border-[#1a1a1a] p-6 mb-10 space-y-4">
              <h2 className="font-section text-base tracking-wider text-pause-black mb-2">Neuer Vorschlag</h2>
              <div>
                <label className="block font-body text-sm text-pause-black/70 mb-1">Titel *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={120}
                  placeholder="z.B. Wie funktioniert eine internationale Pause"
                  className="w-full border border-[#1a1a1a] px-3 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9416]"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-pause-black/70 mb-1">Beschreibung (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Beschreibe das Thema und die Art der Veranstaltung und ob du selbst das Thema vorstellen willst."
                  className="w-full border border-[#1a1a1a] px-3 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9416] resize-none"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-pause-black/70 mb-1">Name (optional)</label>
                <input
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  maxLength={60}
                  placeholder="z.B. Max"
                  className="w-full border border-[#1a1a1a] px-3 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9416]"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-pause-black/70 mb-1">Kontaktmöglichkeit (optional)</label>
                <input
                  type="text"
                  value={submitterContact}
                  onChange={(e) => setSubmitterContact(e.target.value)}
                  maxLength={120}
                  placeholder="z.B. E-Mail, Discord, Telefon …"
                  className="w-full border border-[#1a1a1a] px-3 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9416]"
                />
              </div>
              {error && <p className="font-body text-sm text-red-600">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !title.trim()}
                  className="inline-flex items-center justify-center border-2 border-[#1a1a1a] bg-[#FF9416] px-5 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510] disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Wird eingereicht…" : "Einreichen"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-5 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#FFFAF5] cursor-pointer"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {suggestions === undefined && (
              <p className="font-body text-sm text-pause-black/50 text-center py-8">Lädt…</p>
            )}
            {suggestions?.length === 0 && (
              <p className="font-body text-sm text-pause-black/50 text-center py-8">Derzeit keine Vorschläge.</p>
            )}
            {suggestions?.map((s) => (
              <SuggestionCard key={s._id} suggestion={s} onVote={handleVote} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
