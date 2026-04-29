import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 2;
const STORY_MAX = 5000;

// Public mutation: anyone can submit a survey response. GDPR-aware:
// contactEmail only persisted when allowQuoting is true. Honeypot
// silently discards bot submissions. Rate limit by submitterToken.
export const submit = mutation({
  args: {
    profession: v.string(),
    industry: v.string(),
    ageRange: v.string(),
    story: v.string(),
    allowQuoting: v.boolean(),
    contactEmail: v.optional(v.string()),
    submitterToken: v.string(),
    honeypot: v.optional(v.string()),
    consentedAt: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.honeypot && args.honeypot.length > 0) {
      // Bot — silently accept and discard.
      return { ok: true, simulated: true };
    }
    if (!args.profession.trim() || !args.industry.trim() || !args.ageRange.trim() || !args.story.trim()) {
      throw new Error("Bitte alle Pflichtfelder ausfüllen.");
    }
    if (args.story.length > STORY_MAX) {
      throw new Error(`Geschichte ist zu lang (max. ${STORY_MAX} Zeichen).`);
    }
    if (!args.submitterToken.trim()) {
      throw new Error("Token fehlt.");
    }
    const now = Date.now();
    const recent = await ctx.db
      .query("surveyResponses")
      .withIndex("by_submitter_token", (q) => q.eq("submitterToken", args.submitterToken))
      .filter((q) => q.gt(q.field("createdAt"), now - RATE_WINDOW_MS))
      .collect();
    if (recent.length >= RATE_MAX) {
      throw new Error("Du hast bereits eine Geschichte eingereicht. Danke!");
    }
    const contactEmail = args.allowQuoting ? args.contactEmail : undefined;
    await ctx.db.insert("surveyResponses", {
      profession: args.profession,
      industry: args.industry,
      ageRange: args.ageRange,
      story: args.story,
      allowQuoting: args.allowQuoting,
      contactEmail,
      submitterToken: args.submitterToken,
      consentedAt: args.consentedAt,
      createdAt: now,
    });
    return { ok: true };
  },
});

// Admin-only when wired to Convex auth; query summary stats.
export const summary = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("surveyResponses").collect();
    const total = all.length;
    const allowQuotingCount = all.filter((r) => r.allowQuoting).length;
    const byAge: Record<string, number> = {};
    for (const r of all) byAge[r.ageRange] = (byAge[r.ageRange] ?? 0) + 1;
    return { total, allowQuotingCount, byAge };
  },
});
