import { fetchAction, fetchMutation } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { createPublicKey, verify } from "crypto";
import { api } from "@/convex/_generated/api";

export const runtime = "nodejs";

type DiscordInteraction = {
  id: string;
  type: number;
  token: string;
  guild_id?: string;
  channel_id?: string;
  member?: {
    roles?: string[];
    user?: {
      id: string;
      username: string;
      global_name?: string | null;
    };
  };
  data?: {
    type?: number;
    name?: string;
    target_id?: string;
    custom_id?: string;
    components?: Array<{
      components?: Array<{
        custom_id?: string;
        value?: string;
      }>;
    }>;
    resolved?: {
      messages?: Record<string, { author?: { id?: string; username?: string } }>;
    };
  };
};

const PING = 1;
const APPLICATION_COMMAND = 2;
const MODAL_SUBMIT = 5;

const PONG_RESPONSE = { type: 1 };
const MODAL_RESPONSE_TYPE = 9;
const CHANNEL_MESSAGE_RESPONSE_TYPE = 4;

function parseModeratorRoleIds(): string[] {
  return (process.env.DISCORD_MOD_ROLE_IDS || "")
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

function hasModeratorRole(interaction: DiscordInteraction) {
  const moderatorRoleIds = parseModeratorRoleIds();
  if (moderatorRoleIds.length === 0) {
    return false;
  }
  const userRoles = interaction.member?.roles || [];
  return moderatorRoleIds.some((roleId) => userRoles.includes(roleId));
}

function ephemeralError(message: string) {
  return NextResponse.json({
    type: CHANNEL_MESSAGE_RESPONSE_TYPE,
    data: {
      content: message,
      flags: 64,
    },
  });
}

function parseModalField(
  interaction: DiscordInteraction,
  fieldId: string
): string {
  const components = interaction.data?.components || [];
  for (const row of components) {
    for (const component of row.components || []) {
      if (component.custom_id === fieldId) {
        return component.value?.trim() || "";
      }
    }
  }
  return "";
}

function makeSpkiForEd25519(rawPublicKeyHex: string): Buffer {
  const normalizedHex = rawPublicKeyHex.trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(normalizedHex)) {
    throw new Error("DISCORD_PUBLIC_KEY must be a 64-char hex string");
  }

  const rawKey = Buffer.from(normalizedHex, "hex");
  if (rawKey.length !== 32) {
    throw new Error("Invalid DISCORD_PUBLIC_KEY length");
  }

  // Ed25519 SubjectPublicKeyInfo prefix (RFC 8410):
  // 30 2a 30 05 06 03 2b 65 70 03 21 00
  const spkiPrefix = Buffer.from("302a300506032b6570032100", "hex");
  return Buffer.concat([spkiPrefix, rawKey]);
}

function derToPemSpki(der: Buffer): string {
  const base64 = der.toString("base64");
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN PUBLIC KEY-----\n${lines.join("\n")}\n-----END PUBLIC KEY-----`;
}

function verifyDiscordRequest({
  signature,
  timestamp,
  rawBody,
}: {
  signature: string;
  timestamp: string;
  rawBody: string;
}): boolean {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("Missing DISCORD_PUBLIC_KEY");
  }

  const message = Buffer.from(timestamp + rawBody, "utf8");
  const signatureBuffer = Buffer.from(signature, "hex");
  const spkiDer = makeSpkiForEd25519(publicKey);
  const pem = derToPemSpki(spkiDer);
  const key = createPublicKey(pem);

  return verify(null, message, key, signatureBuffer);
}

function makeModalCustomId(payload: {
  targetDiscordId: string;
  sourceMessageId: string;
  sourceChannelId: string;
}) {
  return [
    "award_karma",
    payload.targetDiscordId,
    payload.sourceMessageId,
    payload.sourceChannelId,
  ].join(":");
}

function parseModalCustomId(customId: string | undefined) {
  if (!customId) {
    return null;
  }

  const parts = customId.split(":");
  if (parts.length !== 4 || parts[0] !== "award_karma") {
    return null;
  }

  return {
    targetDiscordId: parts[1],
    sourceMessageId: parts[2],
    sourceChannelId: parts[3],
  };
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature-ed25519");
  const timestamp = req.headers.get("x-signature-timestamp");

  if (!signature || !timestamp) {
    return new NextResponse("Missing Discord signature headers", { status: 401 });
  }

  const rawBody = await req.text();

  try {
    const isValid = verifyDiscordRequest({ signature, timestamp, rawBody });
    if (!isValid) {
      return new NextResponse("Invalid request signature", { status: 401 });
    }
  } catch (error) {
    console.error("Discord signature verification failed:", error);
    return new NextResponse("Signature verification failed", { status: 401 });
  }

  const interaction = JSON.parse(rawBody) as DiscordInteraction;

  if (interaction.type === PING) {
    return NextResponse.json(PONG_RESPONSE);
  }

  if (!hasModeratorRole(interaction)) {
    return ephemeralError("You are not allowed to award karma.");
  }

  if (interaction.type === APPLICATION_COMMAND) {
    const commandType = interaction.data?.type;
    const commandName = interaction.data?.name;

    // Message context menu command
    if (commandType !== 3) {
      return ephemeralError("Unsupported command type.");
    }
    if (commandName !== "Award Karma") {
      return ephemeralError("Unsupported command name.");
    }

    const targetMessageId = interaction.data?.target_id;
    const sourceChannelId = interaction.channel_id;
    const targetMessage =
      targetMessageId && interaction.data?.resolved?.messages
        ? interaction.data.resolved.messages[targetMessageId]
        : undefined;

    const targetDiscordId = targetMessage?.author?.id;

    if (!targetMessageId || !sourceChannelId || !targetDiscordId) {
      return ephemeralError("Could not resolve message author.");
    }

    const customId = makeModalCustomId({
      targetDiscordId,
      sourceMessageId: targetMessageId,
      sourceChannelId,
    });

    return NextResponse.json({
      type: MODAL_RESPONSE_TYPE,
      data: {
        custom_id: customId,
        title: "Award Karma",
        components: [
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: "karma_amount",
                label: "Karma amount",
                style: 1,
                min_length: 1,
                max_length: 4,
                required: true,
                placeholder: "e.g. 10",
              },
            ],
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: "karma_reason",
                label: "Reason",
                style: 2,
                min_length: 3,
                max_length: 300,
                required: true,
                placeholder: "What did they do?",
              },
            ],
          },
        ],
      },
    });
  }

  if (interaction.type === MODAL_SUBMIT) {
    const parsed = parseModalCustomId(interaction.data?.custom_id);
    if (!parsed) {
      return ephemeralError("Invalid modal payload.");
    }

    const amountRaw = parseModalField(interaction, "karma_amount");
    const reason = parseModalField(interaction, "karma_reason");
    const amount = Number.parseInt(amountRaw, 10);

    if (!Number.isInteger(amount) || amount <= 0 || amount > 5000) {
      return ephemeralError("Karma amount must be an integer between 1 and 5000.");
    }

    const moderatorId = interaction.member?.user?.id;
    const moderatorName =
      interaction.member?.user?.global_name || interaction.member?.user?.username || "Unknown Moderator";

    if (!moderatorId) {
      return ephemeralError("Could not resolve moderator identity.");
    }

    try {
      const result = await fetchMutation(api.completions.grantManualKarma, {
        targetDiscordId: parsed.targetDiscordId,
        targetDiscordName: `discord-${parsed.targetDiscordId}`,
        awardedByDiscordId: moderatorId,
        awardedByDiscordName: moderatorName,
        amount,
        reason,
        sourceMessageId: parsed.sourceMessageId,
        sourceChannelId: parsed.sourceChannelId,
        sourceGuildId: interaction.guild_id,
        idempotencyKey: interaction.id,
      });

      if (!result.duplicate) {
        await Promise.all([
          fetchAction(api.discord.assignRole, {
            discordId: parsed.targetDiscordId,
            oldXp: result.oldXp,
            newXp: result.totalXp,
          }),
          fetchAction(api.discord.notifyManualKarma, {
            targetDiscordId: parsed.targetDiscordId,
            awardedByDiscordId: moderatorId,
            awardedByDiscordName: moderatorName,
            amount,
            totalXp: result.totalXp,
            reason,
            sourceMessageId: parsed.sourceMessageId,
            sourceChannelId: parsed.sourceChannelId,
          }),
        ]);
      }

      return NextResponse.json({
        type: CHANNEL_MESSAGE_RESPONSE_TYPE,
        data: {
          content: result.duplicate
            ? "This karma award was already processed."
            : `Awarded +${amount} karma to <@${parsed.targetDiscordId}>. New total: ${result.totalXp}.`,
          flags: 64,
        },
      });
    } catch (error) {
      console.error("Failed to process manual karma award:", error);
      return ephemeralError("Failed to award karma. Please try again.");
    }
  }

  return ephemeralError("Unsupported interaction type.");
}
