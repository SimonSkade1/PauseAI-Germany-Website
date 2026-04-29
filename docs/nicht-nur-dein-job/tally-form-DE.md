# Tally-Form (DE) — Spec für „Nicht nur dein Job"

**Vorlage:** PauseAI Global Form `Gxo8AQ` (https://tally.so/r/Gxo8AQ)
**Ziel-Form-ID:** wird beim Anlegen vergeben (z.B. `Hxo9BR`)
**Sprache:** Deutsch, du-Form (passend zur Tonalität von PauseAI Deutschland)
**Verwendung:** wird in `/nicht-nur-dein-job/erzaehlung` (oder `/umfrage`) per `<iframe>` eingebettet.

> **So nutzt du dieses Dokument:**
> 1. In Tally → "Create new form" → "Start from blank".
> 2. Felder von oben nach unten anlegen, Texte aus diesem Dokument kopieren.
> 3. Settings am Ende des Dokuments übernehmen (Thema, GDPR, Thank-you).
> 4. Form-ID kopieren und im Code an genau einer Stelle eintragen — siehe Abschnitt "Code-Integration" am Ende.

---

## Form-Metadaten

| Feld | Wert |
|---|---|
| Titel (intern) | `Nicht nur dein Job — PauseAI Deutschland` |
| Beschreibung (intern) | „Story-Kollektion für die Kampagne /nicht-nur-dein-job. Stand 2026-04." |
| Slug-URL | beliebig — wird im Embed nicht sichtbar |

### Sichtbare Form-Überschrift

```
Erzähl uns deine Geschichte
```

### Sichtbarer Einleitungstext

```
Fortgeschrittene KI verändert ganze Branchen – von Bildung über Software,
Design, Buchhaltung bis zur Pflege. Die Risiken sind real: nicht nur für
einzelne Berufe, sondern für unsere demokratische Selbstbestimmung.

PauseAI Deutschland sammelt Stimmen aus dem Alltag, um den politischen Druck
zu erhöhen: für unabhängige Sicherheitsprüfungen, bevor leistungsfähige
KI-Systeme freigegeben werden, für mehr Transparenz, wirksame Aufsicht und
durchsetzbare Standards.

Deine Geschichte hilft uns, das Bild zusammenzusetzen.
```

---

## Frage 1 — Vollständiger Name

| Feld | Wert |
|---|---|
| Tally-Type | **Short answer** |
| Label | `Vollständiger Name` |
| Helper | `Den Namen, unter dem du zitiert werden möchtest – falls du das willst. Pseudonyme sind ok.` |
| Required | **Ja** |
| Max length | 120 |

---

## Frage 2 — E-Mail-Adresse

| Feld | Wert |
|---|---|
| Tally-Type | **Email** |
| Label | `E-Mail-Adresse` |
| Helper | `Wir kontaktieren dich nur, wenn du es weiter unten erlaubst.` |
| Required | **Ja** |
| Validation | Standard E-Mail-Format |

---

## Frage 3 — Wohnsitzland

> **Abweichung von der globalen Form:** Im Original ein Freitextfeld. Für die deutsche Chapter-Form ergibt eine Dropdown mit DACH-Vorschlägen mehr Signal.

| Feld | Wert |
|---|---|
| Tally-Type | **Dropdown** (oder „Multiple choice — single answer" mit „Andere"-Eingabe) |
| Label | `Wohnsitzland` |
| Helper | (leer) |
| Required | **Ja** |
| Optionen | `Deutschland` · `Österreich` · `Schweiz` · `Andere (bitte angeben)` |

Falls Tally „Allow other"-Option für Dropdowns nicht unterstützt, stattdessen ein zweites *Conditional* Short-answer-Feld „Land (falls 'Andere')" anhängen, das nur erscheint, wenn die letzte Option gewählt wurde.

---

## Frage 4 — Deine Geschichte

| Feld | Wert |
|---|---|
| Tally-Type | **Long answer** (Textarea) |
| Label | `Deine Geschichte` |
| Helper | `Wie verändert KI deinen Beruf, dein Leben, dein Bild der Zukunft? Was beunruhigt dich, was hoffst du? Mehr Details — Hintergrund, Auswirkungen, Befürchtungen — helfen uns, deine Stimme im richtigen Kontext zu zeigen.` |
| Required | **Ja** |
| Max length | 5000 |
| Min length | 80 (optional, hält One-Liner draußen) |

---

## Frage 5 — Fotos

| Feld | Wert |
|---|---|
| Tally-Type | **File upload** |
| Label | `Fotos (optional)` |
| Helper | `Nur Fotos von dir selbst. Hilft uns, deine Geschichte mit einem Gesicht zu erzählen, falls du das willst. Maximal 3 Dateien, je < 10 MB. Erlaubt: JPG, PNG, HEIC.` |
| Required | **Nein** |
| Allowed types | `image/jpeg, image/png, image/heic` |
| Max files | 3 |
| Max size per file | 10 MB |

---

## Frage 6 — Video

| Feld | Wert |
|---|---|
| Tally-Type | **File upload** |
| Label | `Video (optional)` |
| Helper | `Nur Videos, in denen du selbst zu sehen bist. Maximale Wirkung — z.B. ein 30-Sekunden-Statement. Maximal 1 Datei, < 100 MB. Erlaubt: MP4, MOV.` |
| Required | **Nein** |
| Allowed types | `video/mp4, video/quicktime` |
| Max files | 1 |
| Max size per file | 100 MB (in Tally Pro ggf. höher) |

---

## Frage 7 — Veröffentlichungs-Einwilligung

| Feld | Wert |
|---|---|
| Tally-Type | **Multiple choice — single answer** |
| Label | `Wie dürfen wir deine Eingabe verwenden?` |
| Helper | `Wichtig für unsere Pressearbeit, Social Media und die Kampagnenseite. Du kannst diese Einwilligung jederzeit per E-Mail widerrufen.` |
| Required | **Ja** |
| Optionen | (siehe unten — Reihenfolge wichtig: maximale Zustimmung zuerst) |

**Optionen — wörtlich übernehmen:**

```
Ja — meine Geschichte, mein Name, Fotos und Videos dürfen öffentlich
verwendet werden (Website, Social Media, Presse).
```

```
Ja — aber nur anonymisiert. Keine Namen, keine Fotos, keine Videos.
```

```
Nein — bitte keine öffentliche Verwendung. Nur für interne Auswertung.
```

---

## Frage 8 — Mehr von PauseAI hören?

| Feld | Wert |
|---|---|
| Tally-Type | **Multiple choice — single answer** |
| Label | `Möchtest du mehr über PauseAI Deutschland erfahren?` |
| Helper | (leer) |
| Required | **Ja** |
| Optionen | (siehe unten) |

**Optionen:**

```
Ja — leite mich nach dem Absenden direkt zur Mitmach-Seite weiter.
```

```
Ja — sende mir Informationen per E-Mail.
```

```
Nein — bitte schick mir keine E-Mails.
```

> **Tally-Logik:** Bei der ersten Option setze in den Form-Settings → "After submission" einen Redirect auf `https://pauseai.de/mitmachen` als Conditional. Tally unterstützt conditional redirects per Field-Logic.

---

## Frage 9 — An Politik weiterleiten?

| Feld | Wert |
|---|---|
| Tally-Type | **Multiple choice — single answer** |
| Label | `Möchtest du deine Geschichte an deine politischen Vertreter:innen weiterleiten?` |
| Helper | (leer) |
| Required | **Ja** |
| Optionen | (siehe unten) |

**Optionen:**

```
Ja — zeig mir, wie ich das selbst machen kann.
```

```
Nein — aber teilt sie in meinem Namen mit Politiker:innen.
```

```
Nein — bitte teilt meine Geschichte nicht weiter.
```

> **Tally-Logik:** Bei „Ja, zeig mir wie" → optional einen zusätzlichen Thank-you-Block einblenden mit Link auf `/contactlawmakers`.

---

## Thank-You-Screen

```
Danke!

Wir lesen jede Geschichte. Wenn du markiert hast, dass wir dich
kontaktieren dürfen, melden wir uns – sonst bleibt deine Eingabe
intern in unserer Auswertung.

Andere Stimmen lesen → https://pauseai.de/nicht-nur-dein-job#stimmen

Schreib deinem Abgeordneten → https://pauseai.de/contactlawmakers
```

> **Tally:** Settings → "After submission" → "Show thank you message", den obigen Text einfügen, Links als Buttons formatieren.

---

## Tally-Settings (Form-Theme + Datenschutz)

| Setting | Wert |
|---|---|
| **Theme — Primary color** | `#FF9416` |
| **Theme — Background** | `#FFFFFF` (oder Transparent, wenn embedded) |
| **Theme — Font** | „Default" reicht; Tally rendert keine Custom Fonts auf der Free-Stufe — auf Pro: `Roboto Slab` body, `Saira Condensed` headings |
| **Page transition** | „Smooth" |
| **Show progress bar** | **Ja** (9 Fragen → spürbarer Fortschritt) |
| **Allow drafts** | **Ja** (Seite nicht versehentlich verlassen) |
| **Close form after first response** | **Nein** |
| **Submission notifications** | E-Mail an `kontakt@pauseai.de` (oder Team-Slack-Webhook, wenn vorhanden) |
| **GDPR — Data retention** | „Bis manuell gelöscht" (oder konkret: 24 Monate, je nach Datenschutzerklärung) |
| **GDPR — Workspace region** | **EU (Frankfurt)** — wichtig wegen Verarbeitung im EWR |
| **Webhooks** | optional, später für Convex-Sync |

---

## Embed-Optionen

Beim Einbetten in `/nicht-nur-dein-job/erzaehlung` (oder `/umfrage`) folgende Tally-URL-Parameter verwenden:

```
?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1
```

- `hideTitle=1` — Tally-Form-Titel ausblenden, weil unsere Seite einen eigenen `<h1>` hat.
- `transparentBackground=1` — Tally-Hintergrund transparent → unser Branding wirkt durch.
- `dynamicHeight=1` — Tally-Resize-Script setzt iframe-Höhe automatisch.
- `alignLeft=1` — links statt zentriert.

---

## Code-Integration (sobald Form-ID vorliegt)

In `src/app/nicht-nur-dein-job/erzaehlung/page.tsx` (neu anzulegen) oder als Ersatz für `umfrage/SurveyForm.tsx`:

```tsx
import Script from "next/script";

const TALLY_FORM_ID = "Hxo9BR"; // <-- echte ID einsetzen

export default function Page() {
  return (
    <>
      <iframe
        data-tally-src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        loading="lazy"
        width="100%"
        height="700"
        frameBorder={0}
        title="Erzähl deine Geschichte"
      />
      <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />
    </>
  );
}
```

`embed.js` ersetzt `data-tally-src` automatisch durch `src` und rezised iframes mit `dynamicHeight=1`. Vor dem Mounten des Scripts ist die iframe inert — kein Flash, kein Layout-Shift, weil wir eine `height="700"` Anfangs-Höhe setzen.

---

## Empfohlener Migrationspfad (für die Codebase)

Pfad **A — Tally ersetzt unsere Form** (wenn nur globale Story-Sammlung gewünscht):
1. `/nicht-nur-dein-job/umfrage/page.tsx` ersetzt den `<SurveyForm/>`-Block durch das obige iframe.
2. `SurveyForm.tsx`, `DankeSection.tsx` und `/api/survey-submit/` können entfernt werden.
3. E2E-Tests (`e2e/survey.spec.ts`) ersetzen mit zwei einfachen Smoke-Tests: iframe vorhanden, `data-tally-src` enthält Form-ID.

Pfad **B — Hybrid** (wenn Beruf/Branche/Altersgruppe wichtig bleiben):
1. Bestehende `/umfrage` bleibt bestehen.
2. Neue Route `/nicht-nur-dein-job/erzaehlung` mit Tally-Embed.
3. `DankeSection` nach Erfolg unserer Quick-Form bekommt Folge-CTA „Magst du deine ganze Geschichte erzählen?" → `/erzaehlung`.
4. `TestimonialsSection` Share-Zeile bekommt zusätzlichen Link „Erzähl deine ganze Geschichte → /erzaehlung".

Empfehlung weiterhin **Pfad B**: behält den arbeitsmarkt-spezifischen Datensignal (Beruf/Branche/Alter), gibt motivierten Erzähler:innen den globalen Tiefen-Pfad mit Foto/Video-Upload.

---

## Checkliste vor Veröffentlichung

- [ ] Form in Tally in EU-Region erstellt
- [ ] Alle 9 Fragen + Helper in du-Form übersetzt eingetragen
- [ ] Conditional Logic auf Frage 8 (Redirect zu /mitmachen) gesetzt
- [ ] Thank-You-Screen mit Folge-Links eingerichtet
- [ ] Theme auf `#FF9416` Primary
- [ ] GDPR-Einstellungen: Data retention, Region, Submission-Receivers konfiguriert
- [ ] Test-Submission gemacht, Daten in Tally-Dashboard sichtbar
- [ ] Form-ID im Code eingetragen, Build läuft (`npx tsc --noEmit && npm run test:e2e`)
- [ ] E-Mail-Benachrichtigungen kommen an
- [ ] Datenschutzerklärung der Website erwähnt Tally als Auftragsverarbeiter
