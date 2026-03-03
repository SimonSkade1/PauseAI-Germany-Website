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
});
