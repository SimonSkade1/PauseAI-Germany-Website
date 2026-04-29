import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Public — only approved testimonials.
export const listApproved = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("testimonials")
      .withIndex("by_approved", (q) => q.eq("approved", true))
      .order("desc")
      .collect();
  },
});

// Admin-only when wired to Convex auth; for now, internal-only mutation
// invoked via the Convex dashboard or a seed script.
export const insert = mutation({
  args: {
    name: v.string(),
    age: v.optional(v.number()),
    profession: v.string(),
    location: v.optional(v.string()),
    story: v.string(),
    approved: v.boolean(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("testimonials", {
      ...args,
      shareCount: 0,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const incrementShareCount = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (!doc) return;
    await ctx.db.patch(id, { shareCount: (doc.shareCount ?? 0) + 1 });
  },
});
