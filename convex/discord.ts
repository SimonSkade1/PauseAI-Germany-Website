import { action } from "./_generated/server";
import { v } from "convex/values";

// Role thresholds
const ROLE_THRESHOLDS = [
  { xp: 150, level: 2 },
  { xp: 400, level: 3 },
];

// Get role name for XP
function getRoleForXp(xp: number): string {
  if (xp >= 400) return "Aktivist";
  if (xp >= 150) return "Engagierter Bürger";
  return "Besorgter Bürger";
}

// Notify Discord about task completion
export const notifyTaskComplete = action({
  args: {
    discordId: v.string(),
    discordName: v.string(),
    taskName: v.string(),
    xp: v.number(),
    totalXp: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (_, args) => {
    const channelId = process.env.DID_A_THING_CHANNEL_ID;
    const botToken = process.env.DISCORD_TOKEN;

    if (!channelId || !botToken) {
      console.error("Missing Discord credentials");
      return { success: false, error: "Missing credentials" };
    }

    // Build embed fields
    const fields: Array<{ name: string; value: string; inline: boolean }> = [
      { name: "Mitglied", value: `<@${args.discordId}>`, inline: true },
      { name: "XP", value: `+${args.xp}`, inline: true },
      { name: "Gesamt", value: `${args.totalXp} XP`, inline: true },
      { name: "Aufgabe", value: args.taskName, inline: false },
    ];

    if (args.comment) {
      fields.push({ name: "Kommentar", value: args.comment, inline: false });
    }

    // Post message to Discord
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: "✅ Aufgabe erledigt!",
              color: 0xff6b35, // PauseAI Orange
              fields,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Discord API error:", error);
      return { success: false, error };
    }

    return { success: true };
  },
});

// Assign Discord role based on XP threshold
export const assignRole = action({
  args: {
    discordId: v.string(),
    oldXp: v.number(),
    newXp: v.number(),
  },
  handler: async (_, args) => {
    const guildId = process.env.GUILD_ID;
    const botToken = process.env.DISCORD_TOKEN;

    if (!guildId || !botToken) {
      console.error("Missing Discord credentials for role assignment");
      return { success: false, error: "Missing credentials" };
    }

    const roleIds = {
      2: process.env.ROLE_LEVEL_2,
      3: process.env.ROLE_LEVEL_3,
    };

    // Check if user crossed any threshold
    for (const threshold of ROLE_THRESHOLDS) {
      if (args.newXp >= threshold.xp && args.oldXp < threshold.xp) {
        const roleId = roleIds[threshold.level as keyof typeof roleIds];
        if (!roleId) {
          console.error(`Missing ROLE_LEVEL_${threshold.level}`);
          continue;
        }

        // Assign role via Discord API
        const response = await fetch(
          `https://discord.com/api/v10/guilds/${guildId}/members/${args.discordId}/roles/${roleId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bot ${botToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const error = await response.text();
          console.error("Discord role assignment error:", error);
          return { success: false, error: "Failed to assign role" };
        }

        const roleName = getRoleForXp(args.newXp);

        // Send notification about new role
        const channelId = process.env.DID_A_THING_CHANNEL_ID;
        if (channelId) {
          await fetch(
            `https://discord.com/api/v10/channels/${channelId}/messages`,
            {
              method: "POST",
              headers: {
                Authorization: `Bot ${botToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: `🎉 <@${args.discordId}> hat ${args.newXp} XP erreicht und die Rolle **${roleName}** erhalten!`,
              }),
            }
          );
        }

        return { success: true, roleAssigned: threshold.level, roleName };
      }
    }

    return { success: true, roleAssigned: null };
  },
});
