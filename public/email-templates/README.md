
# Vorlagen (E-Mail-Templates)

Dieses Verzeichnis enthält die E‑Mail‑Vorlagen, die in der Kontakt‑Seite auswählbar sind.
Die Vorlagen sind einfache Textdateien (.txt) mit optionaler Betreff‑Zeile und Platzhaltern.

Ziel dieser Anleitung: Schritt‑für‑Schritt erklären, wie auch nicht‑technische Nutzer*innen neue Vorlagen hinzufügen können.

---

## Kurzfassung (kurze Schritte)

1. Erstelle eine neue Textdatei im Ordner `public/email-templates/`, z. B. `meine-vorlage.txt`.
2. Schreibe optional eine Betreffzeile oben im Format `Subject: Dein Betreff` gefolgt von einer Leerzeile.
3. Benutze Platzhalter wie `{{senderName}}`, `{{senderEmail}}`, `{{recipientName}}`, `{{message}}` im Text.
4. Falls vorhanden, füge einen Eintrag in `index.json` hinzu (siehe unten). Wenn `index.json` fehlt, verwendet die Seite automatisch `ID.txt`-Dateinamen (siehe Hinweise).
5. Speichere die Datei und lade/commit/push sie hoch (oder deploye die Seite). Die Vorlage sollte dann im Template‑Auswahlfeld erscheinen.

---

## Beispielvorlage (Datei: `meine-vorlage.txt`)

```
Subject: Kurze Anfrage an {{recipientName}}

Hallo {{recipientName}},

{{message}}

Viele Grüße,
{{senderName}}

Diese Nachricht wurde gesendet von {{senderName}} ({{senderEmail}})
```

Notiz: `{{message}}` wird durch die im UI eingegebene Nachricht ersetzt (oder durch eine Standardnachricht, falls nichts eingegeben wurde).

---

## Manifest: `index.json` (erklärung & Beispiel)

Die Datei `public/email-templates/index.json` ist eine kleine Liste aller verfügbaren Vorlagen. Sie sieht so aus:

```json
[
	{
		"id": "greeting",
		"label": "Gruß (Standard)",
		"file": "greeting.txt"
	},
	{
		"id": "meine-vorlage",
		"label": "Meine Vorlage",
		"file": "meine-vorlage.txt"
	}
]
```

- `id`: eine kurze Kennung (nur Buchstaben, Zahlen, Bindestrich/Unterstrich), wird intern benutzt.
- `label`: der Text, der im Auswahlfeld (Dropdown) angezeigt wird — frei wählbar.
- `file`: der Dateiname der Vorlage im aktuellen Ordner.

Wenn `index.json` nicht existiert, versucht die Webseite, die Datei `{id}.txt` zu laden (z. B. `greeting.txt` für `greeting`). Das Manifest ist empfohlen, weil es ein leserliches Label ermöglicht.

---

## Platzhalter (welche Variablen du nutzen kannst)

- `{{senderName}}` — Name der absendenden Person (aus dem Formular)
- `{{senderEmail}}` — E‑Mail der absendenden Person (aus dem Formular)
- `{{recipientName}}` — Name des ausgewählten Abgeordneten
- `{{message}}` — die eigentliche Nachricht/der Textkörper (wird aus dem Formular eingesetzt)

Hinweis: Alle eingebauten Werte werden sicher escaped, damit Sonderzeichen keine Probleme verursachen. Deine Vorlagen sollten als reiner Text bleiben (kein HTML erforderlich).