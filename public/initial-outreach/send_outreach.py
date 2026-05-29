#!/usr/bin/env python3
"""
Send personalized initial outreach emails through Gmail SMTP.

What it does
------------
- Reads a CSV of contacts (columns: email, name, salutation, personalization).
- Builds each email from build_email() below: the salutation and the per-person
  personalization are filled in from the CSV; the rest of the email — your
  standard body and your signature — you write once inside build_email().
  (Claude can write that part for you.)
- Sends through Gmail with an App Password: a separate 16-character password,
  NOT your normal Google password and NOT the Claude Gmail connector. See the guide.
- Records every address it sends to in sent_emails.json and skips anyone already
  in that log. So you can send a limited batch now (--send --limit 60) and simply
  run it again later to continue with whoever is left. No one is emailed twice.
- Paces sends (DELAY_SECONDS apart) to stay well under Gmail's limits.

Usage
-----
  python3 send_outreach.py --preview          # write every email to preview.txt (sends nothing)
  python3 send_outreach.py --test             # send the first couple to TEST_RECIPIENT
  python3 send_outreach.py --send             # send to real recipients (asks you to confirm)
  python3 send_outreach.py --send --limit 60  # send the next 60 not-yet-sent, then stop

Run --send again any time to continue where you left off.
Requires only the Python standard library (Python 3.8+).
"""

import argparse
import csv
import json
import os
import smtplib
import ssl
import time
from datetime import datetime
from email.message import EmailMessage

# ============================ CONFIG — fill these in ============================

SENDER_EMAIL = ""          # the address you send from, e.g. you@pauseai.info
APP_PASSWORD = ""          # 16-char Gmail App Password (see the guide). Keep secret.
SENDER_NAME = "Your Name"  # display name shown as the sender

SUBJECT = "Briefing on AI risks"
CSV_PATH = "outreach.csv"        # columns: email, name, salutation, personalization
SENT_LOG = "sent_emails.json"    # who has already been emailed (created automatically)

TEST_RECIPIENT = ""        # your own address, used by --test
TEST_COUNT = 2             # how many emails --test sends to you
DELAY_SECONDS = 6          # pause between sends


def build_email(salutation, personalization):
    """The full email.

    `salutation` and `personalization` are filled per person from the CSV.
    Everything else — your standard body and your signature — you write here
    once (Claude can fill this in for you). See the example in the guide. Keep
    the signature as the last lines of this text; it is not a separate field.
    """
    return f"""{salutation}

{personalization}

[Your standard body goes here: a short, credible introduction of who you are; the
core point about where AI is heading and why it matters; and a concrete ask for a
short (e.g. 30 minute) meeting. Add any lobbying-register disclosure your country
requires.]

Kind regards,
{SENDER_NAME}
PauseAI [Country]"""

# ==============================================================================

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587


def load_sent():
    if os.path.exists(SENT_LOG):
        with open(SENT_LOG, encoding="utf-8") as f:
            return json.load(f)
    return []


def record_sent(email_addr, name):
    sent = load_sent()
    sent.append(
        {"email": email_addr, "name": name, "timestamp": datetime.now().isoformat()}
    )
    with open(SENT_LOG, "w", encoding="utf-8") as f:
        json.dump(sent, f, indent=2, ensure_ascii=False)


def load_rows():
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    # keep only rows that actually have an email and a personalization
    return [
        r
        for r in rows
        if r.get("email", "").strip() and r.get("personalization", "").strip()
    ]


def make_message(row, to_addr):
    msg = EmailMessage()
    msg["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
    msg["To"] = to_addr
    msg["Subject"] = SUBJECT
    msg.set_content(
        build_email(row["salutation"].strip(), row["personalization"].strip())
    )
    return msg


def preview(rows, path="preview.txt"):
    with open(path, "w", encoding="utf-8") as f:
        for i, r in enumerate(rows, 1):
            f.write(f"{'=' * 70}\n")
            f.write(f"EMAIL {i}: {r.get('name', '')} -> {r['email']}\n")
            f.write(f"Subject: {SUBJECT}\n")
            f.write(f"{'=' * 70}\n\n")
            f.write(
                build_email(r["salutation"].strip(), r["personalization"].strip())
            )
            f.write("\n\n")
    print(f"Wrote {len(rows)} emails to {path}. Review them, then run --test.")


def send(rows, test_mode, limit):
    if not SENDER_EMAIL or not APP_PASSWORD:
        raise SystemExit("Set SENDER_EMAIL and APP_PASSWORD at the top first.")

    if test_mode:
        if not TEST_RECIPIENT:
            raise SystemExit("Set TEST_RECIPIENT to your own address for --test.")
        queue = rows[:TEST_COUNT]
        print(f"TEST: sending {len(queue)} email(s) to {TEST_RECIPIENT}.")
    else:
        already = {e["email"] for e in load_sent()}
        pending = [r for r in rows if r["email"].strip() not in already]
        queue = pending[:limit] if limit is not None else pending
        print(
            f"LIVE: {len(rows)} contacts, {len(rows) - len(pending)} already sent, "
            f"sending {len(queue)} now, {len(pending) - len(queue)} left for later."
        )
        if not queue:
            print("Nothing to send — everyone in the CSV has already been emailed.")
            return
        for r in queue[:5]:
            print(f"  {r.get('name', '')} -> {r['email']}")
        if len(queue) > 5:
            print(f"  ... and {len(queue) - 5} more")
        if input('Type "SEND" to send these for real: ').strip() != "SEND":
            raise SystemExit("Aborted.")

    if not queue:
        print("Nothing to send.")
        return

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(SENDER_EMAIL, APP_PASSWORD)
        for i, r in enumerate(queue, 1):
            to_addr = TEST_RECIPIENT if test_mode else r["email"].strip()
            try:
                server.send_message(make_message(r, to_addr))
            except Exception as e:
                print(f"  ERROR sending to {r['email']}: {e}")
                print("  Stopping. Fix the issue and run --send again to continue.")
                break
            if not test_mode:
                record_sent(r["email"].strip(), r.get("name", ""))
            print(f"  [{i}/{len(queue)}] sent -> {to_addr}  ({r.get('name') or r['email']})")
            if i < len(queue):
                time.sleep(DELAY_SECONDS)

    print("Done.")


def main():
    parser = argparse.ArgumentParser(
        description="Send personalized outreach emails via Gmail."
    )
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument(
        "--preview", action="store_true", help="write all emails to preview.txt (sends nothing)"
    )
    mode.add_argument(
        "--test", action="store_true", help=f"send the first {TEST_COUNT} emails to TEST_RECIPIENT"
    )
    mode.add_argument(
        "--send", action="store_true", help="send to real recipients (skips already-sent)"
    )
    parser.add_argument(
        "--limit", type=int, default=None, help="with --send: send at most N this run, then stop"
    )
    args = parser.parse_args()

    rows = load_rows()
    print(f"Loaded {len(rows)} contacts from {CSV_PATH}.")

    if args.preview:
        preview(rows)
    elif args.test:
        send(rows, test_mode=True, limit=None)
    else:
        send(rows, test_mode=False, limit=args.limit)


if __name__ == "__main__":
    main()
