import { action } from "./_generated/server";
import { v } from "convex/values";

const ROLE_THRESHOLDS = [
  { xp: 30, level: 1, name: "Neuling" },
  { xp: 200, level: 2, name: "Lehrling" },
  { xp: 600, level: 3, name: "Aufklärer:in" },
  { xp: 2000, level: 4, name: "Aktivist:in" },
  { xp: 6000, level: 5, name: "Pionier:in" },
  { xp: 20000, level: 6, name: "Meister:in" },
] as const;

function getHighestRankForXp(karma: number) {
  let highest: { xp: number; level: number; name: string } = { xp: 0, level: 0, name: "Kein Rang" };
  for (const threshold of ROLE_THRESHOLDS) {
    if (karma >= threshold.xp) {
      highest = threshold;
    } else {
      break;
    }
  }
  return highest;
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

    const currentRank = getHighestRankForXp(args.totalXp);

    const fields: Array<{ name: string; value: string; inline: boolean }> = [
      { name: "Aufgabe", value: args.taskName, inline: false },
    ];

    if (args.comment) {
      fields.push({ name: "Kommentar", value: args.comment, inline: false });
    }
    fields.push({ name: "Karma", value: `${args.totalXp} (+${args.xp})`, inline: true });
    fields.push({ name: "Rolle", value: currentRank.name, inline: true });

    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `<@${args.discordId}> war aktiv! 💪`,
          allowed_mentions: { users: [args.discordId] },
          embeds: [
            {
              color: 0xff6b35,
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

export const notifyManualKarma = action({
  args: {
    targetDiscordId: v.string(),
    awardedByDiscordId: v.string(),
    awardedByDiscordName: v.string(),
    amount: v.number(),
    totalXp: v.number(),
    reason: v.string(),
    sourceMessageId: v.string(),
    sourceChannelId: v.string(),
  },
  handler: async (_, args) => {
    const channelId = process.env.DID_A_THING_CHANNEL_ID;
    const botToken = process.env.DISCORD_TOKEN;

    if (!channelId || !botToken) {
      console.error("Missing Discord credentials");
      return { success: false, error: "Missing credentials" };
    }

    const currentRank = getHighestRankForXp(args.totalXp);
    const messageLink = `https://discord.com/channels/${process.env.GUILD_ID}/${args.sourceChannelId}/${args.sourceMessageId}`;

    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `🧑‍⚖️ <@${args.awardedByDiscordId}> hat Karma vergeben.`,
          allowed_mentions: { users: [args.awardedByDiscordId, args.targetDiscordId] },
          embeds: [
            {
              color: 0x2ecc71,
              fields: [
                { name: "Empfänger", value: `<@${args.targetDiscordId}>`, inline: true },
                { name: "Karma", value: `+${args.amount} (gesamt: ${args.totalXp})`, inline: true },
                { name: "Rolle", value: currentRank.name, inline: true },
                { name: "Grund", value: args.reason, inline: false },
                { name: "Quelle", value: `[Originale Nachricht](${messageLink})`, inline: false },
              ],
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

// Assign exactly one Discord role based on highest Karma threshold
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
      1: process.env.ROLE_LEVEL_1,
      2: process.env.ROLE_LEVEL_2,
      3: process.env.ROLE_LEVEL_3,
      4: process.env.ROLE_LEVEL_4,
      5: process.env.ROLE_LEVEL_5,
      6: process.env.ROLE_LEVEL_6,
    } as const;

    const newRank = getHighestRankForXp(args.newXp);
    const oldRank = getHighestRankForXp(args.oldXp);

    const applyRoleChange = async (roleId: string, method: "PUT" | "DELETE") => {
      const response = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${args.discordId}/roles/${roleId}`,
        {
          method,
          headers: {
            Authorization: `Bot ${botToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("Discord role assignment error:", {
          discordId: args.discordId,
          guildId,
          roleId,
          method,
          status: response.status,
          error,
        });
        return {
          ok: false,
          status: response.status,
          error,
        };
      }

      return { ok: true, status: response.status };
    };

    try {
      const nonCriticalFailures: Array<{
        level: number;
        roleId: string;
        method: "PUT" | "DELETE";
        status: number;
        error: string;
      }> = [];

      for (let level = 1; level <= 6; level++) {
        const roleId = roleIds[level as keyof typeof roleIds];
        if (!roleId) {
          console.error(`Missing ROLE_LEVEL_${level}`);
          continue;
        }

        if (level === newRank.level) {
          const result = await applyRoleChange(roleId, "PUT");
          if (!result.ok) {
            return {
              success: false,
              error: `Failed to assign target role ${roleId} (level ${level}): HTTP ${result.status}`,
            };
          }
        } else {
          const result = await applyRoleChange(roleId, "DELETE");
          if (!result.ok) {
            nonCriticalFailures.push({
              level,
              roleId,
              method: "DELETE",
              status: result.status,
              error: result.error || "Unknown error",
            });
          }
        }
      }

      if (nonCriticalFailures.length > 0) {
        console.warn("Discord role cleanup had non-critical failures:", nonCriticalFailures);
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to assign role" };
    }

    if (newRank.level > oldRank.level && newRank.level > 0) {
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
              content: `🎉 <@${args.discordId}> hat ${args.newXp} Karma erreicht und ist jetzt **${newRank.name}**!`,
            }),
          }
        );
      }
    }

    return {
      success: true,
      roleAssigned: newRank.level > 0 ? newRank.level : null,
      roleName: newRank.level > 0 ? newRank.name : null,
    };
  },
});
