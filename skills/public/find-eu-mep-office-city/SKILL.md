---
name: find-eu-mep-office-city
description: Find the German office location for a Member of the European Parliament (MEP) and return `PLZ` and `Stadt` as separate values. Use for tasks like filling CSV columns such as `büro in deutschland plz` and `büro in deutschland stadt`, validating existing office locations, or resolving missing/ambiguous Germany office city values from web sources.
---

# Find EU MEP Office City

## Workflow

1. Identify the target person.
- Use full name and party if available.
- If the request comes from a CSV row, copy the exact spelling from the row.

2. Search web sources in this order.
- Official MEP site (personal/party page with contact section).
- Official European Parliament profile page.
- Official constituency/district office page.
- Reputable local party pages or press pages only as fallback.

3. Prefer a Germany office over Brussels/Strasbourg.
- Look for wording such as `Büro`, `Wahlkreisbüro`, `Bürgerbüro`, `Kontakt`, `Anschrift`.
- Ignore EU institution addresses unless no German office exists.

4. Extract and normalize the location.
- If a full address is available, keep only postal code and city.
- Output format must be two fields: `PLZ=12345`, `Stadt=Stadtname`.
- Do not include street, building, phone, or country text.

5. Handle ambiguity explicitly.
- If multiple German offices exist, prefer the office in the constituency/state linked to the task context.
- If still ambiguous, return the most official entry and note it as such.
- If no Germany office can be confirmed, return `Keine Angaben`.

6. Provide evidence.
- Include 1-2 source links used for the decision.
- Prefer primary sources over aggregators.

## Search Query Patterns

Use a few targeted queries and stop once evidence is sufficient:

- `<vorname nachname> MEP kontakt büro`
- `<vorname nachname> Europaparlament Kontakt Deutschland`
- `<vorname nachname> Wahlkreisbüro`
- `<vorname nachname> <partei> kontakt`

## Output Contract

When filling structured data (for example CSV):
- Write `PLZ` into `büro in deutschland plz`.
- Write city name into `büro in deutschland stadt`.
- Keep original encoding and delimiter style unchanged.
- Update only requested rows.

When answering in chat:
- First line: `PLZ: 12345` and second line `Stadt: Stadtname` (or `Keine Angaben` for both if unknown).
- Then list source links.

## Quality Checks

- Confirm `PLZ` is 5 digits and `Stadt` is non-empty text.
- Confirm the source actually belongs to the same person (name match).
- Avoid copying stale third-party directory entries when a primary source exists.
