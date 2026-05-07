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

  // Curated stories used on the /nicht-nur-dein-job campaign page.
  // Read publicly when approved=true; mutations are admin-only via the dashboard.
  testimonials: defineTable({
    name: v.string(),
    age: v.optional(v.number()),
    profession: v.string(),
    location: v.optional(v.string()),
    story: v.string(),
    approved: v.boolean(),
    shareCount: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_approved", ["approved"])
    .index("by_created_at", ["createdAt"]),

  // Curated press review entries for the /nicht-nur-dein-job campaign page.
  pressItems: defineTable({
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
    createdAt: v.number(),
  })
    .index("by_published", ["publishedAt"])
    .index("by_lang_cat", ["language", "category"]),

  // User-submitted survey responses from /nicht-nur-dein-job/umfrage.
  // GDPR-aware: contactEmail only stored when allowQuoting is true.
  // Rate limited by submitterToken (UUID stored client-side in localStorage).
  surveyResponses: defineTable({
    profession: v.string(),
    industry: v.string(),
    ageRange: v.string(),
    story: v.string(),
    allowQuoting: v.boolean(),
    contactEmail: v.optional(v.string()),
    submitterToken: v.string(),
    consentedAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_submitter_token", ["submitterToken"])
    .index("by_created_at", ["createdAt"]),
});
