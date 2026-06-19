import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Record one tracked action on a mail draft. A "draft" is a single selected
// recipient, identified by an anonymous random `draftId` minted on the client
// when the recipient is picked. All actions for the same draft — copying the
// recipient/subject/body and opening the mail composer — are folded into one
// row so a single mail is counted once, not once per button press.
//
// This is a proxy for "an email was sent": the actual send happens in a
// third-party mail client, which we cannot observe. No personal data is stored
// (no sender, recipient, or IP) — just which template/campaign/parliament/target
// was used and which actions happened.
export const recordEmailEngagement = mutation({
  args: {
    draftId: v.string(),
    templateFile: v.string(),
    campaign: v.string(),
    parliamentGroup: v.string(),
    action: v.union(
      v.literal("copy_recipient"),
      v.literal("copy_subject"),
      v.literal("copy_body"),
      v.literal("open"),
    ),
    mailTarget: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("emailEngagements")
      .withIndex("by_draft_id", (q) => q.eq("draftId", args.draftId))
      .first();

    const now = Date.now();

    const flagFor = {
      copy_recipient: "copiedRecipient",
      copy_subject: "copiedSubject",
      copy_body: "copiedBody",
      open: "openedComposer",
    } as const;
    const flag = flagFor[args.action];

    if (existing) {
      await ctx.db.patch(existing._id, {
        [flag]: true,
        ...(args.action === "open" && args.mailTarget !== undefined
          ? { mailTarget: args.mailTarget }
          : {}),
        updatedAt: now,
      });
      return { success: true };
    }

    await ctx.db.insert("emailEngagements", {
      draftId: args.draftId,
      templateFile: args.templateFile,
      campaign: args.campaign,
      parliamentGroup: args.parliamentGroup,
      mailTarget: args.action === "open" ? args.mailTarget : undefined,
      copiedRecipient: args.action === "copy_recipient",
      copiedSubject: args.action === "copy_subject",
      copiedBody: args.action === "copy_body",
      openedComposer: args.action === "open",
      createdAt: now,
      updatedAt: now,
    });
    return { success: true };
  },
});

// Deduped engagement counts grouped by template file. Each row already
// represents one mail draft, so counting rows counts mails.
export const countByTemplate = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("emailEngagements").collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.templateFile] = (counts[row.templateFile] ?? 0) + 1;
    }
    return counts;
  },
});

// Deduped engagement counts grouped by campaign (the specific email variant,
// e.g. "mdb_anthropic"). Separate from countByTemplate so callers can choose
// the dimension they care about without post-processing.
export const countByCampaign = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("emailEngagements").collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.campaign] = (counts[row.campaign] ?? 0) + 1;
    }
    return counts;
  },
});

// Deduped engagement counts rolled up to the parliament ("bundestag" |
// "europarl"). This is the high-level "Bundestag vs EU-Parlament" breakdown.
export const countByParliamentGroup = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("emailEngagements").collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.parliamentGroup] = (counts[row.parliamentGroup] ?? 0) + 1;
    }
    return counts;
  },
});

// Counts grouped by template, restricted to drafts that show the strongest
// send intent: the composer was opened or the body text was copied. Useful when
// `countByTemplate` (any action, including just copying the recipient address)
// feels too loose a proxy for an actual send.
export const countSendIntentByTemplate = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("emailEngagements").collect();
    const counts: Record<string, number> = {};
    for (const row of rows) {
      if (!row.openedComposer && !row.copiedBody) continue;
      counts[row.templateFile] = (counts[row.templateFile] ?? 0) + 1;
    }
    return counts;
  },
});
