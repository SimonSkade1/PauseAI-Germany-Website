import os
import discord
from discord.ext import commands
from dotenv import load_dotenv
import database as db
import asyncio

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")
GUILD_ID = int(os.getenv("GUILD_ID"))
DID_A_THING_CHANNEL_ID = int(os.getenv("DID_A_THING_CHANNEL_ID"))
ROLE_IDS = {
    1: int(os.getenv("ROLE_LEVEL_1")),
    2: int(os.getenv("ROLE_LEVEL_2")),
    3: int(os.getenv("ROLE_LEVEL_3")),
}

intents = discord.Intents.all()
bot = commands.Bot(command_prefix="!", intents=intents)

SPECIAL_EMOJIS = {
    "⭐": "s1",  # 30 XP - Kleiner Beitrag
    "🌟": "s2",  # 75 XP - Mittlerer Beitrag
    "💫": "s3",  # 150 XP - Großer Beitrag
}

async def update_user_role(discord_id: str, xp: int):
    guild = bot.get_guild(GUILD_ID)
    if not guild:
        return
    
    try:
        member = await guild.fetch_member(int(discord_id))
    except:
        return
    
    level = db.get_role_for_xp(xp)
    
    for role_id in ROLE_IDS.values():
        role = guild.get_role(role_id)
        if role and role in member.roles:
            await member.remove_roles(role)
    
    new_role = guild.get_role(ROLE_IDS[level])
    if new_role:
        await member.add_roles(new_role)

async def post_did_a_thing(discord_id: str, discord_name: str, task_name: str, xp: int, comment: str, total_xp: int):
    channel = bot.get_channel(DID_A_THING_CHANNEL_ID)
    if not channel:
        print(f"Channel {DID_A_THING_CHANNEL_ID} nicht gefunden")
        return
    
    embed = discord.Embed(
        title="✅ Aufgabe erledigt!",
        color=0x4caf50
    )
    embed.add_field(name="Mitglied", value=f"<@{discord_id}>", inline=True)
    embed.add_field(name="XP", value=f"+{xp}", inline=True)
    embed.add_field(name="Gesamt", value=f"{total_xp} XP", inline=True)
    embed.add_field(name="Aufgabe", value=task_name, inline=False)
    
    if comment:
        embed.add_field(name="Kommentar", value=comment, inline=False)
    
    await channel.send(embed=embed)

@bot.event
async def on_ready():
    await db.init_db()
    print(f"Bot ist online als {bot.user}")

@bot.event
async def on_raw_reaction_add(payload):
    # Only in did-a-thing channel
    if payload.channel_id != DID_A_THING_CHANNEL_ID:
        return

    # Ignore bot's own reactions
    if payload.user_id == bot.user.id:
        return

    # Only admins (manage_roles permission)
    guild = bot.get_guild(payload.guild_id)
    if not guild:
        return
    member = await guild.fetch_member(payload.user_id)
    if not member.guild_permissions.manage_roles:
        return

    # Only special emojis
    emoji = str(payload.emoji)
    if emoji not in SPECIAL_EMOJIS:
        return

    # Check if already awarded
    if await db.is_message_already_awarded(str(payload.message_id), emoji):
        return

    # Get message and author
    channel = bot.get_channel(payload.channel_id)
    if not channel:
        return
    message = await channel.fetch_message(payload.message_id)

    # Award XP
    task_id = SPECIAL_EMOJIS[emoji]
    comment = message.content[:100] + "..." if len(message.content) > 100 else message.content
    result = await db.add_special_xp(
        str(message.author.id),
        message.author.display_name,
        task_id,
        comment
    )

    if result["success"]:
        # Update role
        await update_user_role(str(message.author.id), result["total_xp"])

        # Send confirmation
        await channel.send(
            f"🎉 {message.author.mention} erhält **+{result['xp_earned']} XP** "
            f"für: {result['task']['name']}!"
        )

        # Mark as awarded
        await db.mark_message_as_awarded(str(payload.message_id), emoji)

@bot.command(name="addxp")
@commands.has_permissions(manage_roles=True)
async def add_xp(ctx, member: discord.Member, task_id: str):
    """Vergib Special-XP: !addxp @user <s1|s2|s3> (nur Moderatoren)"""
    result = await db.add_special_xp(
        str(member.id),
        member.display_name,
        task_id.lower()
    )
    
    if result["success"]:
        await ctx.send(
            f"✅ **{result['task']['name']}** für {member.mention} eingetragen!\n"
            f"+{result['xp_earned']} XP → Gesamt: **{result['total_xp']} XP**"
        )
        await update_user_role(str(member.id), result["total_xp"])
        await post_did_a_thing(
            str(member.id),
            member.display_name,
            result['task']['name'],
            result['xp_earned'],
            f"Vergeben von {ctx.author.display_name}",
            result['total_xp']
        )
    else:
        await ctx.send(f"❌ {result['error']}")

@add_xp.error
async def add_xp_error(ctx, error):
    if isinstance(error, commands.MissingPermissions):
        await ctx.send("❌ Du brauchst die Berechtigung 'Rollen verwalten' für diesen Befehl.")

# Funktionen die von der API aufgerufen werden können
def get_bot():
    return bot

bot.run(TOKEN)