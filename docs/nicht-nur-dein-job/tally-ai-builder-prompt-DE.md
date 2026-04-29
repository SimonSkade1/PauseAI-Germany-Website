# Tally AI-Builder Prompt (DE)

Wenn dein Tally-Plan den **AI form builder** beinhaltet (Tally → Create form → "Build with AI"), kopiere den folgenden Prompt **exakt wie unten** (zwischen den Trennlinien). Die KI baut daraus ein Form-Skelett, das du nur noch finetunen musst.

> **Achtung:** AI-Builder produzieren oft inkonsistente Helper-Texte und vergessen "Required"-Markierungen. **Vergleiche das Ergebnis Frage für Frage mit `tally-form-DE.md`** und korrigiere Abweichungen, bevor du veröffentlichst. Der ausführliche Spec ist die Quelle der Wahrheit; das hier ist nur der Speed-Hack.

---

```
Erstelle eine deutschsprachige Tally-Umfrage mit Titel "Erzähl uns deine Geschichte" für die Kampagne "Nicht nur dein Job" von PauseAI Deutschland. Die Sprache durchgehend in der Du-Form. Primärfarbe #FF9416, Hintergrund weiß, Progress-Bar sichtbar.

Einleitungstext: "Fortgeschrittene KI verändert ganze Branchen – die Risiken sind real. PauseAI Deutschland sammelt Stimmen aus dem Alltag, um den politischen Druck zu erhöhen. Deine Geschichte hilft uns, das Bild zusammenzusetzen."

Felder in dieser Reihenfolge:

1. Short answer (Pflicht): Label "Vollständiger Name". Helper "Den Namen, unter dem du zitiert werden möchtest – Pseudonyme sind ok." Maximal 120 Zeichen.

2. Email (Pflicht): Label "E-Mail-Adresse". Helper "Wir kontaktieren dich nur, wenn du es weiter unten erlaubst."

3. Dropdown (Pflicht): Label "Wohnsitzland". Optionen: "Deutschland", "Österreich", "Schweiz", "Andere".

4. Long answer (Pflicht): Label "Deine Geschichte". Helper "Wie verändert KI deinen Beruf, dein Leben, dein Bild der Zukunft? Was beunruhigt dich, was hoffst du? Mehr Details helfen uns, deine Stimme im richtigen Kontext zu zeigen." Min 80, Max 5000 Zeichen.

5. File upload (optional): Label "Fotos (optional)". Helper "Nur Fotos von dir selbst. Max. 3 Dateien à 10 MB. JPG, PNG, HEIC."

6. File upload (optional): Label "Video (optional)". Helper "Nur Videos, in denen du selbst zu sehen bist. Max. 1 Datei à 100 MB. MP4 oder MOV."

7. Multiple choice single answer (Pflicht): Label "Wie dürfen wir deine Eingabe verwenden?". Helper "Wichtig für Pressearbeit, Social Media und die Kampagnenseite. Du kannst diese Einwilligung jederzeit per E-Mail widerrufen." Optionen:
   - "Ja — meine Geschichte, mein Name, Fotos und Videos dürfen öffentlich verwendet werden (Website, Social Media, Presse)."
   - "Ja — aber nur anonymisiert. Keine Namen, keine Fotos, keine Videos."
   - "Nein — bitte keine öffentliche Verwendung. Nur für interne Auswertung."

8. Multiple choice single answer (Pflicht): Label "Möchtest du mehr über PauseAI Deutschland erfahren?". Optionen:
   - "Ja — leite mich nach dem Absenden direkt zur Mitmach-Seite weiter."
   - "Ja — sende mir Informationen per E-Mail."
   - "Nein — bitte schick mir keine E-Mails."

9. Multiple choice single answer (Pflicht): Label "Möchtest du deine Geschichte an deine politischen Vertreter:innen weiterleiten?". Optionen:
   - "Ja — zeig mir, wie ich das selbst machen kann."
   - "Nein — aber teilt sie in meinem Namen mit Politiker:innen."
   - "Nein — bitte teilt meine Geschichte nicht weiter."

Thank-You-Screen Text: "Danke! Wir lesen jede Geschichte. Wenn du markiert hast, dass wir dich kontaktieren dürfen, melden wir uns – sonst bleibt deine Eingabe intern in unserer Auswertung." Mit zwei Buttons: "Andere Stimmen lesen" → https://pauseai.de/nicht-nur-dein-job#stimmen, und "Schreib deinem Abgeordneten" → https://pauseai.de/contactlawmakers.

Bei Frage 8 erste Option (Mitmach-Seite): nach dem Absenden weiterleiten zu https://pauseai.de/mitmachen.
```

---

## Falls dein Tally-Plan keinen AI-Builder hat

Nutze stattdessen `tally-form-DE.md` und lege die Felder von Hand an. Dauert 10–15 Minuten und ist fehlerfreier.
