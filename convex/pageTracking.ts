import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Record one page view. Called from the PageViewTracker client component on
// every route mount + client navigation. No personal data is stored.
//
// source must be one of: "direct" | "internal" | "search" | "social" | "external".
// The mutation does not validate the set — any string is accepted — so that
// future categories can be added without a schema migration. Unknown values
// will just show up as new buckets in the aggregation queries.
export const recordPageView = mutation({
  args: {
    path: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pageViews", {
      path: args.path,
      source: args.source,
      viewedAt: Date.now(),
    });
    return { success: true };
  },
});

// Aggregate page views grouped by path. Returns a plain object like
//   { "/": 4123, "/contactlawmakers": 887, "/appell": 412 }
// so callers can render it directly without post-processing.
export const countByPath = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("pageViews").collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.path] = (counts[row.path] ?? 0) + 1;
    }
    return counts;
  },
});

// Aggregate page views grouped by source category across the whole site.
// Useful for answering "where are visitors coming from?" at a glance.
export const countBySource = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("pageViews").collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.source] = (counts[row.source] ?? 0) + 1;
    }
    return counts;
  },
});

// Source breakdown for a single path. Useful for "how do people actually
// discover /appell vs /contactlawmakers?" comparisons.
export const countBySourceForPath = query({
  args: { path: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("pageViews")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.source] = (counts[row.source] ?? 0) + 1;
    }
    return counts;
  },
});

// Daily page view totals in YYYY-MM-DD format (UTC buckets). Limited to the
// last `days` days so we don't scan the full table for campaigns-over-time
// charts. Default 30 days.
export const countByDay = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const rows = await ctx.db
      .query("pageViews")
      .withIndex("by_viewed_at", (q) => q.gte("viewedAt", cutoff))
      .collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      const day = new Date(row.viewedAt).toISOString().slice(0, 10);
      counts[day] = (counts[day] ?? 0) + 1;
    }
    return counts;
  },
});
