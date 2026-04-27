import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getSuggestions = query({
  args: { voterToken: v.string() },
  handler: async (ctx, { voterToken }) => {
    const suggestions = await ctx.db.query("eventSuggestions").collect();

    const withVotes = await Promise.all(
      suggestions.map(async (s) => {
        const votes = await ctx.db
          .query("eventVotes")
          .withIndex("by_suggestion_id", (q) => q.eq("suggestionId", s._id))
          .collect();

        const upvotes = votes.filter((v) => v.vote === "up").length;
        const downvotes = votes.filter((v) => v.vote === "down").length;
        const myVote = votes.find((v) => v.voterToken === voterToken)?.vote ?? null;

        return { ...s, upvotes, downvotes, myVote, isOwner: s.submitterToken === voterToken };
      })
    );

    return withVotes.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes));
  },
});

export const submitSuggestion = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    submitterName: v.optional(v.string()),
    submitterContact: v.optional(v.string()),
    submitterToken: v.string(),
  },
  handler: async (ctx, { title, description, submitterName, submitterContact, submitterToken }) => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recent = await ctx.db
      .query("eventSuggestions")
      .withIndex("by_created_at", (q) => q.gt("createdAt", oneDayAgo))
      .collect();

    const submitterRecent = recent.filter((s) => s.submitterToken === submitterToken);
    if (submitterRecent.length >= 10) {
      throw new Error("Zu viele Vorschläge in den letzten 24 Stunden.");
    }

    await ctx.db.insert("eventSuggestions", {
      title: title.trim(),
      description: description?.trim(),
      submitterName: submitterName?.trim(),
      submitterContact: submitterContact?.trim(),
      submitterToken,
      createdAt: Date.now(),
    });
  },
});

export const deleteSuggestion = mutation({
  args: {
    suggestionId: v.id("eventSuggestions"),
    submitterToken: v.string(),
  },
  handler: async (ctx, { suggestionId, submitterToken }) => {
    const suggestion = await ctx.db.get(suggestionId);
    if (!suggestion || suggestion.submitterToken !== submitterToken) {
      throw new Error("Nicht berechtigt.");
    }
    const votes = await ctx.db
      .query("eventVotes")
      .withIndex("by_suggestion_id", (q) => q.eq("suggestionId", suggestionId))
      .collect();
    await Promise.all(votes.map((v) => ctx.db.delete(v._id)));
    await ctx.db.delete(suggestionId);
  },
});

export const castVote = mutation({
  args: {
    suggestionId: v.id("eventSuggestions"),
    voterToken: v.string(),
    vote: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, { suggestionId, voterToken, vote }) => {
    const existing = await ctx.db
      .query("eventVotes")
      .withIndex("by_suggestion_and_voter", (q) =>
        q.eq("suggestionId", suggestionId).eq("voterToken", voterToken)
      )
      .unique();

    if (existing) {
      if (existing.vote === vote) {
        await ctx.db.delete(existing._id);
      } else {
        await ctx.db.patch(existing._id, { vote, createdAt: Date.now() });
      }
    } else {
      await ctx.db.insert("eventVotes", { suggestionId, voterToken, vote, createdAt: Date.now() });
    }
  },
});
