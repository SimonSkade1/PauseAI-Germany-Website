import aiosqlite
import os
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "database.sqlite"

TASKS = [
    # ONBOARDING
    {"id": "on1", "name": "Stelle dich im #welcome Channel vor", "path": "onboarding", "level": 0, "xp": 10, "repeatable": False, "icon": "player"},
    {"id": "on2", "name": "Lies das Onboarding-Dokument", "path": "onboarding", "level": 0, "xp": 15, "repeatable": False, "icon": "book"},
    {"id": "on3", "name": "Nimm an einem Welcome-Call teil", "path": "onboarding", "level": 0, "xp": 20, "repeatable": False, "icon": "conversation"},
    
    # OUTREACH
    {"id": "o1", "name": "Teile ein PauseAI-Video mit einem Freund", "path": "outreach", "level": 1, "xp": 10, "repeatable": True, "icon": "share"},
    {"id": "o2", "name": "Poste über AI-Risiken auf Social Media", "path": "outreach", "level": 1, "xp": 15, "repeatable": True, "icon": "smartphone"},
    {"id": "o3", "name": "Erkläre einer Person das Konzept von AGI-Risiken", "path": "outreach", "level": 1, "xp": 20, "repeatable": True, "icon": "talk"},
    {"id": "o4", "name": "Bringe ein neues Mitglied auf den Discord", "path": "outreach", "level": 2, "xp": 50, "repeatable": False, "icon": "person-add"},
    {"id": "o5", "name": "Organisiere ein lokales Meetup", "path": "outreach", "level": 2, "xp": 80, "repeatable": False, "icon": "round-table"},
    {"id": "o6", "name": "Halte einen Vortrag über AI-Sicherheit", "path": "outreach", "level": 3, "xp": 120, "repeatable": False, "icon": "podium"},
    
    # LOBBYING
    {"id": "l1", "name": "Unterschreibe eine Petition", "path": "lobbying", "level": 1, "xp": 10, "repeatable": False, "icon": "scroll-signed"},
    {"id": "l2", "name": "Schreibe eine E-Mail an einen Abgeordneten", "path": "lobbying", "level": 1, "xp": 25, "repeatable": True, "icon": "envelope"},
    {"id": "l3", "name": "Nimm am Weekly Meeting teil", "path": "lobbying", "level": 1, "xp": 15, "repeatable": True, "icon": "video-conference"},
    {"id": "l4", "name": "Besuche eine politische Veranstaltung zum Thema AI", "path": "lobbying", "level": 2, "xp": 40, "repeatable": True, "icon": "capitol"},
    {"id": "l5", "name": "Triff dich persönlich mit einem Politiker/Mitarbeiter", "path": "lobbying", "level": 2, "xp": 100, "repeatable": False, "icon": "handshake"},
    {"id": "l6", "name": "Verfasse einen Meinungsartikel/Leserbrief", "path": "lobbying", "level": 3, "xp": 80, "repeatable": False, "icon": "newspaper"},
    
    # SPECIAL
    {"id": "s1", "name": "Kleiner Beitrag", "path": "special", "level": 1, "xp": 30, "repeatable": True, "icon": "star"},
    {"id": "s2", "name": "Mittlerer Beitrag", "path": "special", "level": 1, "xp": 75, "repeatable": True, "icon": "double-star"},
    {"id": "s3", "name": "Großer Beitrag", "path": "special", "level": 1, "xp": 150, "repeatable": True, "icon": "triple-star"},
]

async def init_db():
    os.makedirs(DB_PATH.parent, exist_ok=True)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                discord_id TEXT PRIMARY KEY,
                discord_name TEXT,
                total_xp INTEGER DEFAULT 0
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS completed_tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                discord_id TEXT,
                task_id TEXT,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                xp_earned INTEGER,
                comment TEXT,
                FOREIGN KEY (discord_id) REFERENCES users(discord_id)
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS awarded_reactions (
                message_id TEXT NOT NULL,
                emoji TEXT NOT NULL,
                awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (message_id, emoji)
            )
        """)
        await db.commit()

async def get_or_create_user(discord_id: str, discord_name: str):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT discord_id, discord_name, total_xp FROM users WHERE discord_id = ?",
            (discord_id,)
        )
        row = await cursor.fetchone()
        if row:
            return {"discord_id": row[0], "discord_name": row[1], "total_xp": row[2]}
        
        await db.execute(
            "INSERT INTO users (discord_id, discord_name, total_xp) VALUES (?, ?, 0)",
            (discord_id, discord_name)
        )
        await db.commit()
        return {"discord_id": discord_id, "discord_name": discord_name, "total_xp": 0}

async def get_user_completed_tasks(discord_id: str):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT task_id FROM completed_tasks WHERE discord_id = ?",
            (discord_id,)
        )
        rows = await cursor.fetchall()
        return [row[0] for row in rows]

async def complete_task(discord_id: str, discord_name: str, task_id: str, comment: str = ""):
    task = next((t for t in TASKS if t["id"] == task_id), None)
    if not task:
        return {"success": False, "error": "Task nicht gefunden"}
    
    if task["path"] == "special":
        return {"success": False, "error": "Special Tasks können nur von Moderatoren vergeben werden"}
    
    await get_or_create_user(discord_id, discord_name)
    completed = await get_user_completed_tasks(discord_id)
    
    if not task["repeatable"] and task_id in completed:
        return {"success": False, "error": "Task bereits erledigt"}
    
    # Onboarding-Check für Haupt-Pfade
    if task["path"] in ["outreach", "lobbying"] and task["level"] >= 1:
        onboarding_completed = len([t for t in completed if t.startswith("on")])
        if onboarding_completed < 2:
            return {"success": False, "error": "Schließe zuerst mindestens 2 Onboarding-Aufgaben ab"}
    
    # Level-Check
    if task["level"] > 1:
        path = task["path"]
        required_level = task["level"] - 1
        required_count = 3 if task["level"] == 2 else 2
        
        completed_in_path = [
            t_id for t_id in completed
            if any(t["id"] == t_id and t["path"] == path and t["level"] == required_level for t in TASKS)
        ]
        unique_completed = len(set(completed_in_path))
        
        if unique_completed < required_count:
            return {
                "success": False, 
                "error": f"Du brauchst erst {required_count} verschiedene Level-{required_level}-Tasks im Bereich {path}"
            }
    
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO completed_tasks (discord_id, task_id, xp_earned, comment) VALUES (?, ?, ?, ?)",
            (discord_id, task_id, task["xp"], comment)
        )
        await db.execute(
            "UPDATE users SET total_xp = total_xp + ? WHERE discord_id = ?",
            (task["xp"], discord_id)
        )
        await db.commit()
    
    user = await get_or_create_user(discord_id, discord_name)
    return {"success": True, "xp_earned": task["xp"], "total_xp": user["total_xp"], "task": task}

async def add_special_xp(discord_id: str, discord_name: str, task_id: str, comment: str = ""):
    if task_id not in ["s1", "s2", "s3"]:
        return {"success": False, "error": "Ungültige Special-Task ID (s1, s2, s3)"}
    
    task = next((t for t in TASKS if t["id"] == task_id), None)
    await get_or_create_user(discord_id, discord_name)
    
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO completed_tasks (discord_id, task_id, xp_earned, comment) VALUES (?, ?, ?, ?)",
            (discord_id, task_id, task["xp"], comment)
        )
        await db.execute(
            "UPDATE users SET total_xp = total_xp + ? WHERE discord_id = ?",
            (task["xp"], discord_id)
        )
        await db.commit()
    
    user = await get_or_create_user(discord_id, discord_name)
    return {"success": True, "xp_earned": task["xp"], "total_xp": user["total_xp"], "task": task}

async def get_leaderboard():
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT discord_id, discord_name, total_xp FROM users ORDER BY total_xp DESC"
        )
        rows = await cursor.fetchall()
        return [{"discord_id": r[0], "discord_name": r[1], "total_xp": r[2]} for r in rows]

async def get_user_xp(discord_id: str):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT total_xp FROM users WHERE discord_id = ?",
            (discord_id,)
        )
        row = await cursor.fetchone()
        return row[0] if row else 0

def get_task_by_id(task_id: str):
    return next((t for t in TASKS if t["id"] == task_id), None)

def get_all_tasks():
    return TASKS

def get_role_for_xp(xp: int):
    if xp >= 400:
        return 3
    elif xp >= 150:
        return 2
    else:
        return 1

async def is_message_already_awarded(message_id: str, emoji: str):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT 1 FROM awarded_reactions WHERE message_id = ? AND emoji = ?",
            (message_id, emoji)
        )
        return await cursor.fetchone() is not None

async def mark_message_as_awarded(message_id: str, emoji: str):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT OR IGNORE INTO awarded_reactions (message_id, emoji) VALUES (?, ?)",
            (message_id, emoji)
        )
        await db.commit()