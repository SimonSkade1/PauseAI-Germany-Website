import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Initial tasks data from Python backend
const INITIAL_TASKS = [
  // ONBOARDING
  {
    id: "on1",
    name: "Lies das Onboarding-Dokument",
    path: "onboarding",
    level: 0,
    xp: 15,
    repeatable: false,
    icon: "book",
    link: "https://pauseai.notion.site",
  },
  {
    id: "on2",
    name: "Stelle dich im #introductions Channel vor",
    path: "onboarding",
    level: 0,
    xp: 10,
    repeatable: false,
    icon: "player",
    link: undefined,
  },
  {
    id: "on3",
    name: "Vereinbare ein 1:1 Onboarding-Gespräch",
    path: "onboarding",
    level: 0,
    xp: 20,
    repeatable: false,
    icon: "conversation",
    link: undefined,
  },
  // OUTREACH
  {
    id: "o1",
    name: "Teile ein PauseAI-Video mit einem Freund",
    path: "outreach",
    level: 1,
    xp: 10,
    repeatable: true,
    icon: "share",
    link: "https://pauseai.notion.site",
  },
  {
    id: "o2",
    name: "Poste über AI-Risiken auf Social Media",
    path: "outreach",
    level: 1,
    xp: 15,
    repeatable: true,
    icon: "smartphone",
    link: "https://pauseai.notion.site",
  },
  {
    id: "o3",
    name: "Erkläre einer Person das Konzept von AGI-Risiken",
    path: "outreach",
    level: 1,
    xp: 20,
    repeatable: true,
    icon: "talk",
    link: "https://pauseai.notion.site",
  },
  {
    id: "o4",
    name: "Bringe ein neues Mitglied auf den Discord",
    path: "outreach",
    level: 2,
    xp: 50,
    repeatable: false,
    icon: "person-add",
    link: "https://pauseai.notion.site",
  },
  {
    id: "o5",
    name: "Organisiere ein lokales Meetup",
    path: "outreach",
    level: 2,
    xp: 80,
    repeatable: false,
    icon: "round-table",
    link: "https://pauseai.notion.site",
  },
  {
    id: "o6",
    name: "Halte einen Vortrag über AI-Sicherheit",
    path: "outreach",
    level: 3,
    xp: 120,
    repeatable: false,
    icon: "podium",
    link: "https://pauseai.notion.site",
  },
  // LOBBYING
  {
    id: "l1",
    name: "Unterschreibe eine Petition",
    path: "lobbying",
    level: 1,
    xp: 10,
    repeatable: false,
    icon: "scroll-signed",
    link: "https://pauseai.notion.site",
  },
  {
    id: "l2",
    name: "Schreibe eine E-Mail an einen Abgeordneten",
    path: "lobbying",
    level: 1,
    xp: 25,
    repeatable: true,
    icon: "envelope",
    link: "https://pauseai.notion.site",
  },
  {
    id: "l3",
    name: "Nimm am Weekly Meeting teil",
    path: "lobbying",
    level: 1,
    xp: 15,
    repeatable: true,
    icon: "video-conference",
    link: undefined,
  },
  {
    id: "l4",
    name: "Besuche eine politische Veranstaltung zum Thema AI",
    path: "lobbying",
    level: 2,
    xp: 40,
    repeatable: true,
    icon: "capitol",
    link: "https://pauseai.notion.site",
  },
  {
    id: "l5",
    name: "Triff dich persönlich mit einem Politiker/Mitarbeiter",
    path: "lobbying",
    level: 2,
    xp: 100,
    repeatable: false,
    icon: "handshake",
    link: "https://pauseai.notion.site",
  },
  {
    id: "l6",
    name: "Verfasse einen Meinungsartikel/Leserbrief",
    path: "lobbying",
    level: 3,
    xp: 80,
    repeatable: false,
    icon: "newspaper",
    link: "https://pauseai.notion.site",
  },
  // SPECIAL
  {
    id: "s1",
    name: "Kleiner Beitrag",
    path: "special",
    level: 1,
    xp: 30,
    repeatable: true,
    icon: "star",
    link: undefined,
  },
  {
    id: "s2",
    name: "Mittlerer Beitrag",
    path: "special",
    level: 1,
    xp: 75,
    repeatable: true,
    icon: "double-star",
    link: undefined,
  },
  {
    id: "s3",
    name: "Großer Beitrag",
    path: "special",
    level: 1,
    xp: 150,
    repeatable: true,
    icon: "triple-star",
    link: undefined,
  },
] as const;

// Get all tasks
export const list = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    return tasks;
  },
});

// Seed initial tasks (run once via dashboard)
export const seed = mutation({
  handler: async (ctx) => {
    // Check if tasks already exist
    const existing = await ctx.db.query("tasks").collect();
    if (existing.length > 0) {
      return { seeded: false, count: existing.length };
    }

    // Insert all tasks
    for (const task of INITIAL_TASKS) {
      await ctx.db.insert("tasks", task);
    }

    return { seeded: true, count: INITIAL_TASKS.length };
  },
});

// Reseed tasks - deletes all existing tasks and inserts fresh ones from INITIAL_TASKS
export const reseed = mutation({
  handler: async (ctx) => {
    // Delete all existing tasks
    const existing = await ctx.db.query("tasks").collect();
    for (const task of existing) {
      await ctx.db.delete(task._id);
    }

    // Insert all tasks from INITIAL_TASKS
    for (const task of INITIAL_TASKS) {
      await ctx.db.insert("tasks", task);
    }

    return { reseeded: true, deleted: existing.length, inserted: INITIAL_TASKS.length };
  },
});

// Complete a task
export const complete = mutation({
  args: {
    taskId: v.string(),
    discordId: v.string(),
    discordName: v.string(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the task
    const task = await ctx.db
      .query("tasks")
      .withIndex("by_task_id", (q) => q.eq("id", args.taskId))
      .first();

    if (!task) {
      throw new Error("Task not found");
    }

    // Check if special task (can only be assigned by moderators)
    if (task.path === "special") {
      throw new Error("Special Tasks können nur von Moderatoren vergeben werden");
    }

    // Check if task is already completed (for non-repeatable tasks)
    if (!task.repeatable) {
      const existing = await ctx.db
        .query("completedTasks")
        .withIndex("by_discord_id", (q) => q.eq("discordId", args.discordId))
        .filter((q) => q.eq(q.field("taskId"), args.taskId))
        .first();

      if (existing) {
        throw new Error("Task bereits erledigt");
      }
    }

    // Insert completed task record
    await ctx.db.insert("completedTasks", {
      discordId: args.discordId,
      taskId: args.taskId,
      xpEarned: task.xp,
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
    const newXp = oldXp + task.xp;

    // Update user XP
    await ctx.db.patch(user._id, {
      totalXp: newXp,
    });

    return {
      success: true,
      xpEarned: task.xp,
      totalXp: newXp,
      oldXp,
      taskName: task.name,
    };
  },
});
