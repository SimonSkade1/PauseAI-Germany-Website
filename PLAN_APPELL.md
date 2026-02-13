Below is the final implementation checklist, ordered strictly top → bottom so you can execute it sequentially inside the Next.js project.

---

1. Create the route

* Add `app/appell/page.tsx` (server component).
* Define metadata inside the file:

  * clear factual title (not slogan-style)
  * one-sentence description summarizing the professor statement
  * OpenGraph title + description (for journalists sharing links)
* Do not create a special layout unless you actually need different structure than the rest of the site.

---

2. Establish global page constraints (do this before building sections)

Add a dedicated CSS module or global classes for this page.

Define:

* a centered readable column (`max-width ~720–760px`)
* serif text style for long reading
* sans-serif for UI (tabs, nav, labels)
* generous vertical spacing between sections
* dark gray body text (not black)
* white background

Define an orange accent variable and use it only for:

* links
* active tab underline
* small heading accent
* petition button

Add `scroll-behavior: smooth` to `html`.

---

3. Define section anchors and scroll offset

Create fixed section IDs:

`appell`
`zitate`
`unterzeichnende`
`hintergrund`
`faq`
`experten`
`petition`
`medien`

Add `scroll-margin-top` to every section wrapper equal to:
(global navbar height + section jump bar height)

This prevents anchor links from landing under the navbar.

---

4. Implement the in-page jump bar

Directly below the Appell paragraph:

* Horizontal list of anchor links to all sections
* Sticky positioning (`position: sticky`)
* Top offset = global navbar height
* Active item highlighted via orange underline
* Simple text links only (no pills, no boxes)

Scroll-spy highlighting is optional; if implemented, keep it a small client component using `IntersectionObserver`.

---

5. Create structured content source

Create `app/appell/content.ts` and store everything statically.

Export:

* `appell: { headline, paragraph }`
* `quotesDE: [{ quote, name, chair }]` (3)
* `universities: [{ key, label, signatories: [{ name, chair }] }]`
* `faq: [{ q, a }]` (2)
* `experts: [{ quote, name, role, orgOrCountry, sourceUrl? }]`
* `petition: { url, label, note? }`
* `media: { email, contactName?, note? }`

No runtime fetching.

---

6. Build Appell section (hero + statement merged)

Render:

* H1 headline
* paragraph
* credibility line:
  “Unterzeichnet von X Professorinnen und Professoren”

Compute `X` by summing all signatories in `universities`.

Add a thin divider line below and then the jump bar.

No hero background, no CTA, no large color blocks.

---

7. Implement Zitate (3 main professor quotes)

Design as editorial quotes:

Each quote:

* larger serif text
* generous spacing
* subtle light gray background OR thin left border
* small orange accent mark

Attribution:
Name (bold)
Chair (smaller gray)

This section should visually stand out more than any later quote section.

---

8. Implement Unterzeichnende (SEO-safe tabs)

Requirements:
All names must exist in the HTML (not client-only rendering).

Implementation:

* Render all universities and all signatories server-side.
* Add a row of tab buttons (each university + “Alle”).
* Tabs only toggle visibility using CSS classes.

Default view: “Alle anzeigen”.

Structure:

When “Alle” active:
University heading
list of professors below it

List item format:
Name
Chair

Single column only. No grids, no cards, no icons.

Add subtle separators or vertical spacing between entries.

Make tabs keyboard focusable and mark active tab (`aria-pressed` or `aria-current`).

---

9. Hintergrund section

Add heading and placeholder text (“Wird ergänzt”).

Keep spacing and typography identical to final article style so you won’t need layout changes later.

---

10. FAQ section

Use native disclosure:

`<details>`
`<summary>Frage</summary>`
Antwort text

No cards, no shadows.

---

11. International expert quotes

Render similar to Zitate but visually weaker:

* normal body size
* no background block
* simple attribution: Name · Role · Organization/Country
* optional “Quelle” external link

This section supports credibility but should not compete with the professor quotes.

---

12. Petition section

Short explanatory paragraph.

One orange external button linking to Change.org:
`target="_blank" rel="noopener noreferrer"`

No counters and no other calls to action earlier on the page.

---

13. Media contact section

Plain informational block:

Heading “Pressekontakt”
Email mailto link
Optional contact person name
Optional note about interviews/background talks

Keep minimal and highly readable.

---

14. Print stylesheet (very important)

Add `@media print` rules:

* hide global navbar and sticky jump bar
* show all universities and all signatories
* disable tab hiding
* expand FAQ answers
* remove large paddings
* ensure readable font sizes

Journalists must be able to print the full signatory list.

---

15. Accessibility and behavior checks

* anchor links land correctly below navbar
* tabs navigable via keyboard
* visible focus outlines
* external links labeled clearly
* no JavaScript: entire signatory list still readable

---

16. Final QA

* mobile readability of professor list
* share link to `#unterzeichnende` works
* metadata previews correctly in messengers
* headings follow H1 → H2 structure
* no layout shift on load

After this, only content updates remain (adding professors, replacing Hintergrund placeholder).

