from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from pydantic import BaseModel
import aiosqlite
import httpx
import jwt
import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv(Path(__file__).parent.parent / "bot" / ".env")

app = FastAPI()

DB_PATH = Path(__file__).parent.parent / "data" / "database.sqlite"
STATIC_PATH = Path(__file__).parent.parent / "static"

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/auth/callback"
JWT_SECRET = "dein-super-geheimer-key-aendern"

DISCORD_BOT_TOKEN = os.getenv("DISCORD_TOKEN")
DID_A_THING_CHANNEL_ID = os.getenv("DID_A_THING_CHANNEL_ID")

ROLE_NAMES = {
    1: "Besorgter Bürger",
    2: "Aktivist",
    3: "Beschützer der Menschheit"
}

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

def get_role_for_xp(xp: int):
    if xp >= 400:
        return 3
    elif xp >= 150:
        return 2
    else:
        return 1

def create_token(discord_id: str, discord_name: str):
    payload = {
        "discord_id": discord_id,
        "discord_name": discord_name,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except:
        return None

def get_current_user(request: Request):
    token = request.cookies.get("token")
    if not token:
        return None
    return verify_token(token)

async def post_to_discord(discord_id: str, discord_name: str, task_name: str, xp: int, comment: str, total_xp: int):
    embed = {
        "title": "✅ Aufgabe erledigt!",
        "color": 0xff6b35,  # PauseAI Orange
        "fields": [
            {"name": "Mitglied", "value": f"<@{discord_id}>", "inline": True},
            {"name": "XP", "value": f"+{xp}", "inline": True},
            {"name": "Gesamt", "value": f"{total_xp} XP", "inline": True},
            {"name": "Aufgabe", "value": task_name, "inline": False},
        ]
    }
    
    if comment:
        embed["fields"].append({"name": "Kommentar", "value": comment, "inline": False})
    
    async with httpx.AsyncClient() as client:
        await client.post(
            f"https://discord.com/api/v10/channels/{DID_A_THING_CHANNEL_ID}/messages",
            headers={
                "Authorization": f"Bot {DISCORD_BOT_TOKEN}",
                "Content-Type": "application/json"
            },
            json={"embeds": [embed]}
        )

async def get_user_completed_tasks(discord_id: str):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT task_id FROM completed_tasks WHERE discord_id = ?",
            (discord_id,)
        )
        rows = await cursor.fetchall()
        return [row[0] for row in rows]

class CompleteTaskRequest(BaseModel):
    task_id: str
    comment: str = ""

@app.get("/auth/login")
async def login():
    url = (
        f"https://discord.com/api/oauth2/authorize"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=identify"
    )
    return RedirectResponse(url)

@app.get("/auth/callback")
async def callback(code: str):
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://discord.com/api/oauth2/token",
            data={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": REDIRECT_URI,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        token_data = token_response.json()
        
        if "access_token" not in token_data:
            raise HTTPException(status_code=400, detail="OAuth fehlgeschlagen")
        
        user_response = await client.get(
            "https://discord.com/api/users/@me",
            headers={"Authorization": f"Bearer {token_data['access_token']}"}
        )
        user_data = user_response.json()
    
    discord_id = user_data["id"]
    discord_name = user_data.get("global_name") or user_data["username"]
    
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT discord_id FROM users WHERE discord_id = ?",
            (discord_id,)
        )
        if not await cursor.fetchone():
            await db.execute(
                "INSERT INTO users (discord_id, discord_name, total_xp) VALUES (?, ?, 0)",
                (discord_id, discord_name)
            )
            await db.commit()
    
    token = create_token(discord_id, discord_name)
    response = RedirectResponse(url="/tree")
    response.set_cookie(key="token", value=token, httponly=True, max_age=604800)
    return response

@app.get("/auth/logout")
async def logout():
    response = RedirectResponse(url="/")
    response.delete_cookie("token")
    return response

@app.get("/api/me")
async def get_me(request: Request):
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Nicht eingeloggt")
    
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT discord_id, discord_name, total_xp FROM users WHERE discord_id = ?",
            (user["discord_id"],)
        )
        row = await cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="User nicht gefunden")
        
        cursor = await db.execute(
            "SELECT task_id FROM completed_tasks WHERE discord_id = ?",
            (user["discord_id"],)
        )
        completed = [r[0] for r in await cursor.fetchall()]
    
    return {
        "discord_id": row[0],
        "discord_name": row[1],
        "total_xp": row[2],
        "role": ROLE_NAMES[get_role_for_xp(row[2])],
        "completed_tasks": completed
    }

@app.post("/api/complete-task")
async def complete_task(request: Request, body: CompleteTaskRequest):
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Nicht eingeloggt")
    
    task = next((t for t in TASKS if t["id"] == body.task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task nicht gefunden")
    
    if task["path"] == "special":
        raise HTTPException(status_code=403, detail="Special Tasks können nur von Moderatoren vergeben werden")
    
    discord_id = user["discord_id"]
    discord_name = user["discord_name"]
    
    completed = await get_user_completed_tasks(discord_id)
    
    if not task["repeatable"] and body.task_id in completed:
        raise HTTPException(status_code=400, detail="Task bereits erledigt")

    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO completed_tasks (discord_id, task_id, xp_earned, comment) VALUES (?, ?, ?, ?)",
            (discord_id, body.task_id, task["xp"], body.comment)
        )
        await db.execute(
            "UPDATE users SET total_xp = total_xp + ? WHERE discord_id = ?",
            (task["xp"], discord_id)
        )
        await db.commit()
        
        cursor = await db.execute(
            "SELECT total_xp FROM users WHERE discord_id = ?",
            (discord_id,)
        )
        row = await cursor.fetchone()
        total_xp = row[0]
    
    await post_to_discord(
        discord_id=discord_id,
        discord_name=discord_name,
        task_name=task["name"],
        xp=task["xp"],
        comment=body.comment,
        total_xp=total_xp
    )
    
    return {
        "success": True,
        "xp_earned": task["xp"],
        "total_xp": total_xp,
        "task": task
    }

@app.get("/api/leaderboard")
async def get_leaderboard():
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT discord_id, discord_name, total_xp FROM users ORDER BY total_xp DESC"
        )
        rows = await cursor.fetchall()
        
        return [
            {
                "discord_id": r[0],
                "discord_name": r[1],
                "total_xp": r[2],
                "role": ROLE_NAMES[get_role_for_xp(r[2])]
            }
            for r in rows
        ]

@app.get("/api/tasks")
async def get_tasks():
    return TASKS

app.mount("/css", StaticFiles(directory=STATIC_PATH / "css"), name="css")
app.mount("/js", StaticFiles(directory=STATIC_PATH / "js"), name="js")

@app.get("/")
async def root():
    return FileResponse(STATIC_PATH / "index.html")

@app.get("/tree")
async def tree_page():
    return FileResponse(STATIC_PATH / "tree.html")