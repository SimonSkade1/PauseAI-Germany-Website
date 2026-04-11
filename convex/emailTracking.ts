import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Record a click on the "Mail öffnen" button. This is a proxy for "an email
// was sent" — the actual send happens in a third-party mail client, which we
// cannot observe. No personal data is stored: just which template/chamber was
// used and which compose target the user picked.
export const recordEmailSendClick = mutation({
  args: {
    templateFile: v.string(),
    chamber: v.string(),
    mailTarget: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emailSendClicks", {
      templateFile: args.templateFile,
      chamber: args.chamber,
      mailTarget: args.mailTarget,
      clickedAt: Date.now(),
    });
    return { success: true };
  },
});

// Aggregate click counts grouped by template file. Returns a plain object so
// consumers can render it directly without extra plumbing.
export const countByTemplate = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("emailSendClicks").collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.templateFile] = (counts[row.templateFile] ?? 0) + 1;
    }
    return counts;
  },
});

// Aggregate click counts grouped by chamber. Separate from countByTemplate so
// callers can choose the dimension they care about without post-processing.
export const countByChamber = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("emailSendClicks").collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.chamber] = (counts[row.chamber] ?? 0) + 1;
    }
    return counts;
  },
});
