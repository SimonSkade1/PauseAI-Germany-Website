import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Complete a task - store in completedTasks and update user XP
export const completeTask = mutation({
  args: {
    taskId: v.string(),
    discordId: v.string(),
    discordName: v.string(),
    xp: v.number(),
    comment: v.optional(v.string()),
    repeatable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Check if task is already completed
    const existing = await ctx.db
      .query("completedTasks")
      .withIndex("by_discord_id", (q) => q.eq("discordId", args.discordId))
      .filter((q) => q.eq(q.field("taskId"), args.taskId))
      .first();

    // Only throw error if task is not repeatable and already completed
    if (existing && !args.repeatable) {
      throw new Error("Task bereits erledigt");
    }

    // Insert completed task record (allow multiple for repeatable tasks)
    await ctx.db.insert("completedTasks", {
      discordId: args.discordId,
      taskId: args.taskId,
      xpEarned: args.xp,
      comment: args.comment,
      completedAt: Date.now(),
    });

    // Get or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_discord_id", (q) => q.eq("discordId", args.discordId))
      .first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        discordId: args.discordId,
        discordName: args.discordName,
        totalXp: 0,
      });
      user = await ctx.db.get(userId);
    }

    if (!user) {
      throw new Error("Failed to create user");
    }

    const oldXp = user.totalXp;
    const newXp = oldXp + args.xp;

    // Update user XP
    await ctx.db.patch(user._id, {
      totalXp: newXp,
    });

    return {
      success: true,
      xpEarned: args.xp,
      totalXp: newXp,
      oldXp,
      taskName: args.taskId,
    };
  },
});
