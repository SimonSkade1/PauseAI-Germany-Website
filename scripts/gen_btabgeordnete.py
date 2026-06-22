#!/usr/bin/env python3
"""Generate public/data/BTAbgeordnete.csv from the official Bundestag master
data file public/data/MDB_STAMMDATEN.XML.

- Filters to the current electoral term (WP 21).
- Excludes AfD (editorial decision); includes everyone else, incl. fraktionslos.
- Derives Anrede (from Geschlecht), Wahlkreis string, Bundesland (full name),
  and the deterministic firstname.lastname@bundestag.de email (umlaut
  transliteration: ae/oe/ue/ss).

The XML is the source of truth; the CSV is a generated build artifact consumed
client-side by src/components/AbgeordneteSelect.tsx.

Usage: python3 scripts/gen_btabgeordnete.py
"""
import csv
import os
import unicodedata
import xml.etree.ElementTree as ET

WP = "21"
EXCLUDE_PARTIES = {"AfD"}

# Known email exceptions the firstname.lastname rule cannot reproduce because the
# official address does not follow the XML's VORNAME/NACHNAME split. Keyed by
# (first given name lower, NACHNAME lower) -> full email.
EMAIL_OVERRIDES = {
    ("kassem", "saleh"): "kassem.tahersaleh@bundestag.de",
}

# Manual corrections applied AFTER parsing the XML, for membership changes the
# official open-data export has not yet reflected. Re-check and clean these out
# whenever a fresh MDB_STAMMDATEN.XML is downloaded.
#
# MANUAL_REMOVE: set of (first given name lower, NACHNAME lower) to drop.
MANUAL_REMOVE = {
    # Ausgeschieden; Nachfolger Stefan Glaser (s.u.). Austritt noch nicht im Export.
    ("andreas", "jung"),
    # Ausgeschieden; Nachfolger Michael Breilmann (s.u.). Noch nicht im Export.
    ("ansgar", "heveling"),
}
# MANUAL_ADD: list of dicts with the same keys as HEADER (Bundesland included).
MANUAL_ADD = [
    # Christoph Naser (CDU), Direktmandat WK 290 Tübingen. Won the seat after the
    # predecessor left; the open-data export had not yet added him as of 04/2026.
    {
        "Name": "Christoph Naser", "Anrede": "Herr", "Wahlkreis": "290 - Tübingen",
        "Email": "christoph.naser@bundestag.de", "Partei": "CDU",
        "WahlkreisNummer": "290", "Title": "", "FirstName": "Christoph",
        "LastName": "Naser", "Bundesland": "Baden-Württemberg",
    },
    # Stefan Glaser (CDU), Nachrücker für Andreas Jung, Mandatsbeginn 27.05.2026,
    # WK 282 Lörrach – Müllheim. Noch nicht im offiziellen Export.
    {
        "Name": "Stefan Glaser", "Anrede": "Herr",
        "Wahlkreis": "282 - Lörrach – Müllheim",
        "Email": "stefan.glaser@bundestag.de", "Partei": "CDU",
        "WahlkreisNummer": "282", "Title": "", "FirstName": "Stefan",
        "LastName": "Glaser", "Bundesland": "Baden-Württemberg",
    },
    # Michael Breilmann (CDU), Nachrücker für Ansgar Heveling, Mandatsbeginn
    # 01.06.2026, über Landesliste NRW (Kandidatur-WK 120 Recklinghausen I).
    # Noch nicht im offiziellen Export.
    {
        "Name": "Michael Breilmann", "Anrede": "Herr",
        "Wahlkreis": "120 - Recklinghausen I",
        "Email": "michael.breilmann@bundestag.de", "Partei": "CDU",
        "WahlkreisNummer": "120", "Title": "", "FirstName": "Michael",
        "LastName": "Breilmann", "Bundesland": "Nordrhein-Westfalen",
    },
]

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "public", "data")
XML_PATH = os.path.join(DATA, "MDB_STAMMDATEN.XML")
OUT_PATH = os.path.join(DATA, "BTAbgeordnete.csv")

HEADER = ["Name", "Anrede", "Wahlkreis", "Email", "Partei",
          "WahlkreisNummer", "Title", "FirstName", "LastName", "Bundesland"]

PARTY_NORMALIZE = {
    "BÜNDNIS 90/DIE GRÜNEN": "GRÜNE",
    "DIE LINKE.": "DIE LINKE",
    "Plos": "fraktionslos",
}

BUNDESLAND = {
    "BW": "Baden-Württemberg", "BY": "Bayern", "BE": "Berlin",
    "BB": "Brandenburg", "HB": "Bremen", "HH": "Hamburg", "HE": "Hessen",
    "MV": "Mecklenburg-Vorpommern", "NI": "Niedersachsen",
    "NW": "Nordrhein-Westfalen", "RP": "Rheinland-Pfalz", "SL": "Saarland",
    "SN": "Sachsen", "ST": "Sachsen-Anhalt", "SH": "Schleswig-Holstein",
    "TH": "Thüringen",
}

# "Herr"/"Frau" get the "Sehr geehrte/r {Anrede} {Name}" treatment in the mail
# viewer; the gender-neutral form is a full salutation used verbatim.
NEUTRAL_ANREDE = "Sehr geehrte*r"
ANREDE = {"männlich": "Herr", "weiblich": "Frau", "divers": NEUTRAL_ANREDE}


def txt(el, path):
    if el is None:
        return ""
    v = el.findtext(path)
    return (v or "").strip()


def transliterate(s):
    # German umlauts expand to two ASCII letters; everything else is folded to
    # its base ASCII letter (e.g. ć->c, ğ->g, ž->z), matching bundestag.de.
    s = (s.lower()
         .replace("ä", "ae").replace("ö", "oe").replace("ü", "ue")
         .replace("ß", "ss")
         .replace("ł", "l").replace("đ", "d"))  # not decomposable via NFKD
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.encode("ascii", "ignore").decode("ascii")


def make_email(vorname, nachname):
    first_token = vorname.split()[0] if vorname.split() else ""
    override = EMAIL_OVERRIDES.get((first_token.lower(), nachname.lower()))
    if override:
        return override
    first = transliterate(first_token)
    last = transliterate(nachname).replace(" ", "")
    if not first or not last:
        return ""
    return f"{first}.{last}@bundestag.de"


def join_parts(*parts):
    return " ".join(p for p in parts if p)


def main():
    tree = ET.parse(XML_PATH)
    root = tree.getroot()

    rows = []
    for mdb in root.findall("MDB"):
        wahlperioden = [w for w in mdb.findall("WAHLPERIODEN/WAHLPERIODE")
                        if w.findtext("WP") == WP]
        if not wahlperioden:
            continue
        w = wahlperioden[-1]  # most recent WP21 mandate

        bio = mdb.find("BIOGRAFISCHE_ANGABEN")
        party_raw = txt(bio, "PARTEI_KURZ")
        if party_raw in EXCLUDE_PARTIES:
            continue
        party = PARTY_NORMALIZE.get(party_raw, party_raw)

        name_el = mdb.find("NAMEN/NAME")
        vorname = txt(name_el, "VORNAME")
        nachname = txt(name_el, "NACHNAME")
        adel = txt(name_el, "ADEL")
        praefix = txt(name_el, "PRAEFIX")
        title = txt(name_el, "ANREDE_TITEL")

        first_name = join_parts(vorname, adel, praefix)
        last_name = nachname
        full_name = join_parts(title, first_name, last_name)

        anrede = ANREDE.get(txt(bio, "GESCHLECHT"), NEUTRAL_ANREDE)
        email = make_email(vorname, nachname)

        wk_nummer = txt(w, "WKR_NUMMER")
        wk_name = txt(w, "WKR_NAME")
        wahlkreis = f"{wk_nummer} - {wk_name}" if wk_nummer and wk_name else (wk_nummer or "")

        land_code = txt(w, "WKR_LAND") or txt(w, "LISTE")
        bundesland = BUNDESLAND.get(land_code, land_code)

        rows.append({
            "Name": full_name, "Anrede": anrede, "Wahlkreis": wahlkreis,
            "Email": email, "Partei": party, "WahlkreisNummer": wk_nummer,
            "Title": title, "FirstName": first_name, "LastName": last_name,
            "Bundesland": bundesland,
        })

    # Apply manual patches for changes not yet in the official export.
    if MANUAL_REMOVE:
        rows = [r for r in rows
                if (r["FirstName"].split()[0].lower() if r["FirstName"] else "",
                    r["LastName"].lower()) not in MANUAL_REMOVE]
    rows.extend(MANUAL_ADD)

    rows.sort(key=lambda r: (r["LastName"].lower(), r["FirstName"].lower()))

    with open(OUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=HEADER)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} members to {OUT_PATH}")

    # --- Sanity diff against the previous CSV (git HEAD) for email correctness ---
    return rows


if __name__ == "__main__":
    main()
