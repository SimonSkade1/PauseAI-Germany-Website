import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Public — all press items, newest first.
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pressItems")
      .withIndex("by_published")
      .order("desc")
      .collect();
  },
});

export const insert = mutation({
  args: {
    title: v.string(),
    source: v.string(),
    url: v.string(),
    language: v.union(v.literal("de"), v.literal("en")),
    category: v.union(
      v.literal("entlassung"),
      v.literal("studie"),
      v.literal("video"),
      v.literal("auswirkung"),
      v.literal("missbrauch"),
      v.literal("jugend"),
    ),
    publishedAt: v.number(),
    excerpt: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.url.startsWith("https://")) {
      throw new Error("URL muss mit https:// beginnen.");
    }
    const id = await ctx.db.insert("pressItems", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});
