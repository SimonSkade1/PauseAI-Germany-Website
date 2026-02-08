import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    id: v.string(), // e.g., "on1", "o1"
    name: v.string(),
    path: v.string(), // "onboarding", "outreach", "lobbying", "special"
    level: v.number(), // 0-3
    xp: v.number(),
    icon: v.string(),
    repeatable: v.boolean(),
  }).index("by_task_id", ["id"]),

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
