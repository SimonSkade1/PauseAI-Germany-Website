import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    discordId: v.string(),
    discordName: v.string(),
    totalXp: v.number(),
  }).index("by_discord_id", ["discordId"]),

  completedTasks: defineTable({
    discordId: v.string(),
    taskId: v.string(),
    xpEarned: v.number(),
    comment: v.optional(v.string()),
    completedAt: v.number(),
  }).index("by_discord_id", ["discordId"]),

  manualKarmaEvents: defineTable({
    targetDiscordId: v.string(),
    awardedByDiscordId: v.string(),
    awardedByDiscordName: v.string(),
    amount: v.number(),
    reason: v.string(),
    sourceMessageId: v.string(),
    sourceChannelId: v.string(),
    sourceGuildId: v.optional(v.string()),
    idempotencyKey: v.string(),
    totalXpAfter: v.number(),
    createdAt: v.number(),
  })
    .index("by_target_discord_id", ["targetDiscordId"])
    .index("by_idempotency_key", ["idempotencyKey"]),

  // Anonymous click counter for the "Mail öffnen" button in the contact-lawmakers
  // flow. Deliberately stores no personal data (no sender name, no recipient,
  // no IP) so that aggregate counts can be collected without GDPR consent.
  eventSuggestions: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    submitterName: v.optional(v.string()),
    submitterContact: v.optional(v.string()),
    submitterToken: v.string(),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),

  eventVotes: defineTable({
    suggestionId: v.id("eventSuggestions"),
    voterToken: v.string(),
    vote: v.union(v.literal("up"), v.literal("down")),
    createdAt: v.number(),
  })
    .index("by_suggestion_id", ["suggestionId"])
    .index("by_suggestion_and_voter", ["suggestionId", "voterToken"]),

  emailSendClicks: defineTable({
    templateFile: v.string(),
    chamber: v.string(),
    mailTarget: v.string(),
    clickedAt: v.number(),
  })
    .index("by_template", ["templateFile"])
    .index("by_clicked_at", ["clickedAt"]),
});
