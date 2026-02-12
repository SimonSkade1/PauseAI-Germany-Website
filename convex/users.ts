import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user with completed tasks
export const getMe = query({
  args: {
    discordId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_discord_id", (q) => q.eq("discordId", args.discordId))
      .first();

    if (!user) {
      return null;
    }

    // Get completed tasks
    const completed = await ctx.db
      .query("completedTasks")
      .withIndex("by_discord_id", (q) => q.eq("discordId", args.discordId))
      .collect();

    // Build completion count map (taskId -> count)
    const completionCounts: Record<string, number> = {};
    for (const c of completed) {
      completionCounts[c.taskId] = (completionCounts[c.taskId] || 0) + 1;
    }

    return {
      discord_id: user.discordId,
      discord_name: user.discordName,
      total_xp: user.totalXp,
      completed_tasks: completed.map((c) => c.taskId),
      completion_counts: completionCounts,
    };
  },
});

// Ensure user exists (create if not)
export const ensureUser = mutation({
  args: {
    discordId: v.string(),
    discordName: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_discord_id", (q) => q.eq("discordId", args.discordId))
      .first();

    if (existing) {
      // Update name if it changed
      if (existing.discordName !== args.discordName) {
        await ctx.db.patch(existing._id, {
          discordName: args.discordName,
        });
      }
      return existing;
    }

    const userId = await ctx.db.insert("users", {
      discordId: args.discordId,
      discordName: args.discordName,
      totalXp: 0,
    });

    return await ctx.db.get(userId);
  },
});
