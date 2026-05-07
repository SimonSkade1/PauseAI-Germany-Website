import { NextResponse } from "next/server";

// In-memory rate limit window (per process). Replaced by Convex when wired.
const recent = new Map<string, number[]>();
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 2;

interface Body {
  profession: string;
  industry: string;
  ageRange: string;
  story: string;
  allowQuoting: boolean;
  contactEmail?: string;
  submitterToken: string;
  honeypot?: string;
  consentedAt: number;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Honeypot — silently accept and discard.
  if (body.honeypot && body.honeypot.length > 0) {
    return NextResponse.json({ ok: true, simulated: true });
  }

  // Validation
  if (!body.profession?.trim() || !body.industry?.trim() || !body.ageRange?.trim() || !body.story?.trim()) {
    return NextResponse.json({ error: "Bitte alle Pflichtfelder ausfüllen." }, { status: 400 });
  }
  if (body.story.length > 5000) {
    return NextResponse.json({ error: "Geschichte ist zu lang (max. 5.000 Zeichen)." }, { status: 400 });
  }
  if (!body.submitterToken?.trim()) {
    return NextResponse.json({ error: "Token fehlt." }, { status: 400 });
  }
  if (typeof body.consentedAt !== "number") {
    return NextResponse.json({ error: "Einwilligung fehlt." }, { status: 400 });
  }
  if (body.allowQuoting && body.contactEmail) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contactEmail);
    if (!ok) return NextResponse.json({ error: "E-Mail-Adresse ist ungültig." }, { status: 400 });
  }

  // Rate limit
  const now = Date.now();
  const arr = (recent.get(body.submitterToken) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) {
    return NextResponse.json({ error: "Du hast bereits eine Geschichte eingereicht. Danke!" }, { status: 429 });
  }
  arr.push(now);
  recent.set(body.submitterToken, arr);

  // Persist: stub. When Convex is wired, replace with mutation call.
  // For now, log for observability and return ok.
  console.log("[survey-submit]", {
    profession: body.profession,
    industry: body.industry,
    ageRange: body.ageRange,
    storyChars: body.story.length,
    allowQuoting: body.allowQuoting,
    hasEmail: !!body.contactEmail,
    submitterToken: body.submitterToken.slice(0, 8) + "…",
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
