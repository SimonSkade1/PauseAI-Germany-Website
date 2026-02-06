import os
import discord
from discord.ext import commands
from dotenv import load_dotenv
import database as db

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

# Funktionen die von der API aufgerufen werden können
def get_bot():
    return bot

bot.run(TOKEN)