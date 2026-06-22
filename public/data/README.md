# Bundestag-Abgeordnetendaten

## Quelle

Die Stammdaten aller Mitglieder des Deutschen Bundestages stammen aus dem
offiziellen Open-Data-Angebot des Bundestages:

**https://www.bundestag.de/services/opendata**

Dort die Datei **„Stammdaten aller Abgeordneten seit 1949 im XML-Format"**
herunterladen und als `MDB_STAMMDATEN.XML` in diesem Ordner ablegen.

## Dateien

| Datei | Beschreibung |
| --- | --- |
| `MDB_STAMMDATEN.XML` | Quelldatei (alle MdB seit 1949, ~15 MB). Wird **nicht** im Browser geladen. |
| `BTAbgeordnete.csv` | **Generiertes** Build-Artefakt: nur der aktuelle Bundestag. Wird vom Mailtool (`src/components/AbgeordneteSelect.tsx`) clientseitig geladen. |
| `plz_to_wahlkreis.csv` | PLZ → Wahlkreisnummer (Stand 2025er Neuzuschnitt). |

## `BTAbgeordnete.csv` neu generieren

```bash
python3 scripts/gen_btabgeordnete.py
```

Das Skript liest `MDB_STAMMDATEN.XML` und schreibt `BTAbgeordnete.csv`. Dabei:

- Filtert auf die **aktuelle Wahlperiode (WP 21)**.
- **Schließt die AfD aus** (redaktionelle Entscheidung), fraktionslose
  Abgeordnete sind enthalten.
- Leitet ab: `Anrede` (aus Geschlecht), `Wahlkreis`, `Bundesland` (ausgeschrieben)
  und die `Email` nach dem Muster `vorname.nachname@bundestag.de`
  (Umlaut-Transliteration ae/oe/ue/ss, Akzente werden auf ASCII reduziert).

Beim Wechsel der Wahlperiode in `scripts/gen_btabgeordnete.py` die Konstante
`WP` anpassen.

### Sonderfälle

- E-Mail-Adressen, die nicht aus dem XML-Namensfeld ableitbar sind, stehen als
  Override in `EMAIL_OVERRIDES` im Skript.
- **Manuelle Patches** für Mandatswechsel, die im offiziellen Export noch fehlen,
  stehen in `MANUAL_ADD` (hinzufügen) und `MANUAL_REMOVE` (entfernen) im Skript.
  Diese bei jedem neuen XML-Download prüfen und ggf. entfernen, sobald die Daten
  offiziell aktualisiert sind. (Aktuell: + Christoph Naser, CDU, WK 290 Tübingen;
  + Stefan Glaser, CDU, WK 282 Lörrach – Müllheim, für − Andreas Jung, CDU;
  + Michael Breilmann, CDU, Landesliste NRW (WK 120), für − Ansgar Heveling, CDU.)
- Nach dem Generieren empfiehlt sich ein Abgleich der E-Mails gegen die vorige
  CSV-Version (`git diff`), um Tippfehler/Sonderfälle zu erkennen.


Manuelle patches hier zu finden:
https://dip.bundestag.de/suche?f.deskriptor=Bundestagsabgeordneter%3A%20Nachtr%C3%A4glicher%20Eintritt%20in%20den%20Bundestag&rows=25
