#!/usr/bin/env python3
"""
Send personalized initial outreach emails through Gmail SMTP.

What it does
------------
- Reads a CSV of contacts (columns: email, name, salutation, personalization).
- Builds each email as:
      <salutation>,
      <personalization>          <- per person, written by Claude
      <STANDARD_BODY>            <- the same for everyone, written by YOU
      <SIGNATURE>
- Sends through Gmail with an App Password. This is NOT your normal Google
  password, and NOT the Claude Gmail connector — it is a separate 16-character
  password you generate in your Google account (see the guide).
- Paces the sends (one every SEND_INTERVAL_SECONDS) to stay well under Gmail's
  sending limits and look less like a blast.
- TEST_MODE sends a couple of emails to your own address so you can check first.

How to use
----------
1. Fill in the CONFIG block below, locally. Never paste the app password into a
   chat with Claude — only into this file on your own machine.
2. Keep TEST_MODE = True and run:   python3 send_outreach.py
3. Check the test emails that land in your own inbox.
4. Set TEST_MODE = False and run again to send for real.

Requires only the Python standard library (Python 3.8+).
"""

import csv
import smtplib
import ssl
import time
from email.message import EmailMessage

# ============================ CONFIG — fill these in ============================

SENDER_EMAIL = ""          # the address you send from, e.g. you@pauseai.info
APP_PASSWORD = ""          # 16-char Gmail App Password (see the guide). Keep secret.
SENDER_NAME = "Your Name"  # display name shown as the sender

SUBJECT = "Briefing on AI risks"
CSV_PATH = "outreach.csv"  # columns: email, name, salutation, personalization

# The main body of YOUR email — the same for everyone. Write a good one (see the
# example in the guide). It goes after the per-person personalization line.
STANDARD_BODY = """\
[Write your standard pitch here: a short, credible introduction of who you are,
the core point about where AI is heading and why it matters, and a concrete ask
for a short (e.g. 30 minute) meeting, with a scheduling link. See the example
email in the guide. Add any lobbying-register disclosure your country requires.]
"""

SIGNATURE = """\
Kind regards,
Your Name
PauseAI [Country]
+00 000 0000000"""

# Pacing / batching
SEND_INTERVAL_SECONDS = 6   # delay between emails
START_INDEX = 0             # skip the first N contacts (use to resume a run)
MAX_TO_SEND = None          # e.g. 60 = only the next 60 contacts; None = all

# Test mode
TEST_MODE = True           # True = send to yourself, not to the real recipients
TEST_RECIPIENT = ""        # your own address (used only in test mode)
TEST_COUNT = 2             # how many test emails to send to yourself

# ==============================================================================

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587


def build_message(row):
    body = (
        f'{row["salutation"].strip()},\n\n'
        f'{row["personalization"].strip()}\n\n'
        f"{STANDARD_BODY.strip()}\n\n"
        f"{SIGNATURE.strip()}\n"
    )
    msg = EmailMessage()
    msg["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
    msg["Subject"] = SUBJECT
    msg.set_content(body)
    return msg


def main():
    if not SENDER_EMAIL or not APP_PASSWORD:
        raise SystemExit("Set SENDER_EMAIL and APP_PASSWORD at the top first.")

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        rows = [r for r in csv.DictReader(f) if r.get("email", "").strip()]

    rows = rows[START_INDEX:]
    if MAX_TO_SEND is not None:
        rows = rows[:MAX_TO_SEND]

    if TEST_MODE:
        if not TEST_RECIPIENT:
            raise SystemExit("TEST_MODE is on — set TEST_RECIPIENT to your own address.")
        rows = rows[:TEST_COUNT]
        print(f"TEST MODE: sending {len(rows)} email(s) to {TEST_RECIPIENT}.")
    else:
        print(f"LIVE: about to send {len(rows)} email(s) to real recipients.")
        if input('Type "SEND" to continue: ').strip() != "SEND":
            raise SystemExit("Aborted.")

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(SENDER_EMAIL, APP_PASSWORD)

        for i, row in enumerate(rows, start=1):
            msg = build_message(row)
            msg["To"] = TEST_RECIPIENT if TEST_MODE else row["email"].strip()
            server.send_message(msg)
            who = row.get("name") or row["email"]
            print(f'[{i}/{len(rows)}] sent -> {msg["To"]}  ({who})')
            if i < len(rows):
                time.sleep(SEND_INTERVAL_SECONDS)

    print("Done.")


if __name__ == "__main__":
    main()
