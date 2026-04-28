# Not Just Your Job — Campaign Page Design

**Date:** 2026-04-29
**Branch:** `not_just_your_job_campaign`
**Status:** approved by user, ready for implementation planning
**Inspiration:** PauseAI France `/fr/emploi-ia` (the *L'IA ne détruira pas QUE votre emploi* campaign)

## 1. Summary

A new campaign page on the German PauseAI site, modeled on the French chapter's *emploi-ia* page but reframed for the German movement. Positions AI's threat to employment as the gateway to the larger story: control loss and existential risk. The page hosts a hero with a live job-loss counter, a German testimonial carousel, a "more than just jobs" expansion, a concrete political ask, an interactive D3 chart of layoff trends, and a filterable press review. Built by 5 parallel agent teams in isolated git worktrees, integrated by a coordinator.

## 2. Goals

- Ship a polished, German-language campaign page at `/nicht-nur-dein-job` that converts visitors to one of: reading testimonials, submitting their own story via the survey, clicking through to `/contactlawmakers`, or sharing on social.
- Validate the parallel-agent worktree workflow on a real, multi-team feature.
- Build reusable infrastructure (D3 chart components, Convex tables for testimonials/press/survey, Playwright test setup) that future campaign pages can adopt.

## 3. Non-goals

- No CI integration this iteration — Playwright runs locally, reports committed per team.
- No bespoke Convex admin UI; content authors use the Convex dashboard.
- No multilingual fork; German only.
- No A/B testing framework.
- No new newsletter signup component (Footer already handles signups).
- No Vercel preview / production deploy in this branch — final deploy is the user's call after waking and reviewing.

## 4. Campaign frame (locked)

| Item | Value |
|---|---|
| Title | **Nicht nur dein Job** |
| Subtitle | *Wenn wir die Kontrolle über KI verlieren, ist alles, was wir wertschätzen, in Gefahr – Arbeit, Demokratie, Leben.* |
| Slug | `/nicht-nur-dein-job` |
| Survey subroute | `/nicht-nur-dein-job/umfrage` |
| Header nav label | **Nicht nur dein Job** (placed alphabetically or after "Mitmachen" — coordinator confirms during integration) |
| Brand palette | unchanged — orange `#FF9416` on `#1a1a1a` and `#fff` |

## 5. Page architecture

```
src/app/nicht-nur-dein-job/
  page.tsx                       — orchestrates sections + JumpBar + metadata
  sections.ts                    — section IDs/labels for JumpBar/TOC
  HeroSection.tsx                — title, sub, animated counter, CTA
  JobLossCounterSection.tsx      — full counter card with sparkline + jobloss.ai link
  UmfrageCTASection.tsx          — "Erzähl deine Geschichte" → /umfrage
  TestimonialsSection.tsx        — Convex-backed carousel
  MehrAlsArbeitSection.tsx       — "Es geht um mehr als deinen Job"
  PolitischeForderungSection.tsx — concrete political demand + CTA to /contactlawmakers
  JobLossChartSection.tsx        — interactive D3 line chart, sectoral breakdown
  PresseSection.tsx              — filterable press cards
  JumpBar.tsx                    — sticky in-page nav (port of /appell pattern)
  umfrage/
    page.tsx                     — full survey form
    SurveyForm.tsx               — client component with validation + optimistic UI
    DankeSection.tsx             — thank-you state after submit

src/components/charts/           — NEW reusable D3 primitives
  Sparkline.tsx
  LineChart.tsx
  StackedBarChart.tsx (optional)
  useReducedMotion.ts            — shared hook

convex/
  schema.ts                      — additive: testimonials, pressItems, surveyResponses
  testimonials.ts                — public query getApproved + admin mutations
  press.ts                       — public query list + filter
  survey.ts                      — guarded mutation submit + rate-limit by submitterToken
  seed.ts                        — seed function (8 testimonials, 12 press items)

src/app/api/jobloss-count/
  route.ts                       — server route, 1h ISR, fallback constant

e2e/                             — NEW Playwright tests
  smoke.spec.ts
  hero-counter.spec.ts
  jumpbar.spec.ts
  survey.spec.ts
  testimonials.spec.ts
  mehr-und-politische.spec.ts
  chart.spec.ts
  presse.spec.ts
  a11y.spec.ts
  responsive.spec.ts
  regression.spec.ts             — homepage, /appell, /contactlawmakers still work

playwright.config.ts             — Chromium + WebKit + Firefox, baseURL=http://localhost:3000
```

## 6. Data layer

### 6.1 Convex schemas (additive — coordinator merges)

```ts
// additions to convex/schema.ts (existing tables untouched)
testimonials: defineTable({
  name: v.string(),                    // first name only or pseudonym
  age: v.optional(v.number()),
  profession: v.string(),              // e.g. "Lehrerin", "Softwareentwickler"
  location: v.optional(v.string()),    // city / region
  story: v.string(),                   // 200–2000 chars
  approved: v.boolean(),
  shareCount: v.optional(v.number()),
  createdAt: v.number(),
}).index("by_approved", ["approved"])
  .index("by_created_at", ["createdAt"]),

pressItems: defineTable({
  title: v.string(),
  source: v.string(),                  // outlet name
  url: v.string(),                     // must be https
  language: v.union(v.literal("de"), v.literal("en")),
  category: v.union(
    v.literal("entlassung"),
    v.literal("studie"),
    v.literal("video"),
    v.literal("auswirkung"),
    v.literal("missbrauch"),
    v.literal("jugend"),
  ),
  publishedAt: v.number(),             // epoch ms
  excerpt: v.string(),                 // 100–400 chars
  imageUrl: v.optional(v.string()),
  createdAt: v.number(),
}).index("by_published", ["publishedAt"])
  .index("by_lang_cat", ["language", "category"]),

surveyResponses: defineTable({
  profession: v.string(),
  industry: v.string(),
  ageRange: v.string(),                // "18-24", "25-34", "35-44", "45-54", "55+"
  story: v.string(),                   // max 5000 chars
  allowQuoting: v.boolean(),
  contactEmail: v.optional(v.string()), // only if allowQuoting=true
  submitterToken: v.string(),          // UUID from localStorage, mirrors eventSuggestions
  honeypot: v.optional(v.string()),    // discarded server-side; presence = drop
  consentedAt: v.number(),             // GDPR audit trail
  createdAt: v.number(),
}).index("by_submitter_token", ["submitterToken"])
  .index("by_created_at", ["createdAt"]),
```

### 6.2 Seed data

`convex/seed.ts` exports a callable mutation that idempotently inserts:
- **8 hand-written German testimonials** — coordinator drafts these (placeholders allowed in initial dispatch; coordinator finalizes copy).
- **12 press items** — 7 DE, 5 EN, mixed categories. URLs verified `https`. No paywalled-only sources.

### 6.3 jobloss.ai integration

`src/app/api/jobloss-count/route.ts` is a Next.js route handler with `revalidate = 3600` (1 hour).

- Attempts `GET https://jobloss.ai/api/count` (or whatever the actual endpoint turns out to be — Team B investigates first).
- 5 second timeout via `AbortController`.
- On any failure: returns `{ count: <NEXT_PUBLIC_JOBLOSS_FALLBACK as number>, lastUpdated: <ISO date>, source: "fallback" }`.
- Response includes `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.
- Counter component fetches client-side after mount (so SSR uses fallback and never mismatches).

If jobloss.ai has no public API, Team B documents the finding in their handoff and we ship with the fallback constant only — refreshed manually weekly.

## 7. Inventions on top of the French page

1. **Animated count-up** on first viewport entry (IntersectionObserver, single trigger).
2. **Sparkline** under the hero counter — last 90 days of layoffs (D3 line, no axes, brand orange).
3. **Sticky in-page TOC** ported from `/appell`, with active-section highlighting.
4. **Filter chips** in press review with smooth count-update animation.
5. **Share-this-story** buttons on each testimonial: X, WhatsApp, copy-link.
6. **Sectoral D3 chart** with hover and keyboard tooltips, German number/date formatting.
7. **Optimistic UI** on survey submit (instant thank-you, mutation runs in background, reverts on error).
8. **Reduced-motion respect** on every animation in the page.

## 8. Parallel team decomposition

5 agent teams, each working in an isolated git worktree branched off `not_just_your_job_campaign`. Branch naming: `not_just_your_job_campaign/<team-id>`.

| Team | Owns | Files (creates unless noted) | Internal completion gate (must pass before handoff) |
|---|---|---|---|
| **A — Frame** | Page scaffold, Hero, Mehr, Politische, JumpBar, header nav link | `src/app/nicht-nur-dein-job/page.tsx`, `HeroSection.tsx`, `MehrAlsArbeitSection.tsx`, `PolitischeForderungSection.tsx`, `JumpBar.tsx`, `sections.ts`; **edits** `src/components/Header.tsx` | Playwright: page loads, JumpBar smooth-scrolls, header link active on this page, mobile readable, no console errors |
| **B — Live data** | jobloss.ai API route, counter, sparkline, sectoral chart | `src/app/api/jobloss-count/route.ts`, `JobLossCounterSection.tsx`, `JobLossChartSection.tsx`, `src/components/charts/Sparkline.tsx`, `src/components/charts/LineChart.tsx`, `src/components/charts/useReducedMotion.ts` | Playwright: counter renders ≥ fallback, sparkline svg present, chart tooltip works, source link target=_blank, reduced-motion respected |
| **C — Survey** | Convex `surveyResponses` schema fragment + functions, survey page, form, validation, thank-you | `convex/survey.ts`, `convex/seed.ts` (partial), `src/app/nicht-nur-dein-job/umfrage/page.tsx`, `SurveyForm.tsx`, `DankeSection.tsx`, `src/app/nicht-nur-dein-job/UmfrageCTASection.tsx`; **submits** schema additions to coordinator | Playwright: empty submit shows errors, valid submit triggers thank-you, Convex row exists, GDPR enforced, honeypot drops bot submits, double-submit prevented |
| **D — Testimonials** | Convex `testimonials` schema fragment + functions, carousel, share buttons, seed entries | `convex/testimonials.ts`, `convex/seed.ts` (partial), `src/app/nicht-nur-dein-job/TestimonialsSection.tsx`; submits schema additions to coordinator | Playwright: carousel cycles forward+back, dots clickable, keyboard arrows advance, only `approved=true` shown, share buttons open correct URLs, single-item edge case handled |
| **E — Press** | Convex `pressItems` schema fragment + functions, filter chips, cards, seed entries | `convex/press.ts`, `convex/seed.ts` (partial), `src/app/nicht-nur-dein-job/PresseSection.tsx`; submits schema additions to coordinator | Playwright: filters narrow visible items, "Alle" resets, language and category combine, empty state renders, broken image fallback works, dates DE-formatted |

**Coordinator (the orchestrator agent):** owns `convex/schema.ts` final merge (3 teams contribute additively), Playwright config + test infra, full-page Playwright run on integrated branch, accessibility audit (axe-core inside Playwright), copy/voice polish across all sections, OG image asset, header nav label decision, status report.

## 9. Worktree workflow

1. Coordinator creates 5 worktrees from `not_just_your_job_campaign`:
   ```bash
   git worktree add ../worktrees/team-a-frame      not_just_your_job_campaign/team-a-frame
   git worktree add ../worktrees/team-b-data       not_just_your_job_campaign/team-b-data
   git worktree add ../worktrees/team-c-survey     not_just_your_job_campaign/team-c-survey
   git worktree add ../worktrees/team-d-testi      not_just_your_job_campaign/team-d-testi
   git worktree add ../worktrees/team-e-press      not_just_your_job_campaign/team-e-press
   ```
2. Each team works only in its assigned files (see §8 table). Teams that touch `convex/schema.ts` write their additions into a separate file `convex/schema.<team>.ts` that the coordinator inlines into `schema.ts` during integration — this prevents merge conflicts on the central schema file.
3. Each team commits work + Playwright HTML report (`playwright-report/<team-id>/`) before declaring done.
4. Coordinator merges teams in order: **A → B → D → E → C** (frame first, then independent feature teams, survey last because it depends on the frame's CTA section).
5. After integration, coordinator runs the full Playwright suite on the integrated branch, fixes any cross-team issues, commits final state.
6. Final commit on `not_just_your_job_campaign`. **Do not push, do not merge to main.**

## 10. Test infrastructure setup

Coordinator does this **before** dispatching teams so each team can write tests immediately:

- `npm i -D @playwright/test && npx playwright install`
- Create `playwright.config.ts` with three browsers (chromium, webkit, firefox), `baseURL: 'http://localhost:3000'`, `webServer: { command: 'npm run dev', port: 3000, reuseExistingServer: true }`, `retries: 1`, `reporter: [['html'], ['list']]`.
- Add scripts to `package.json`:
  - `"test:e2e": "playwright test"`
  - `"test:e2e:ui": "playwright test --ui"`
  - `"test:e2e:debug": "playwright test --debug"`
- Create `e2e/fixtures/seed.ts` to seed Convex test data deterministically before each `test.beforeAll`.
- Create `e2e/fixtures/mock-jobloss.ts` to intercept `https://jobloss.ai/**` via `page.route()` and return a fixed payload.
- Add `playwright-report/` and `test-results/` to `.gitignore` **except** for `playwright-report/<team>/` paths that teams commit explicitly as part of their handoff.
- Document in `e2e/README.md` how to run, what's seeded, how to add new tests.

## 11. Playwright / QA checklist (the contract)

The integrated branch must pass **every item below**. Per-team subsets are derived from the §8 table.

### A. Smoke / routing
- [ ] `/nicht-nur-dein-job` returns 200 and renders hero title
- [ ] `/nicht-nur-dein-job/umfrage` returns 200 standalone; refresh works
- [ ] No client-side redirect; deep-linking works
- [ ] Header has new link to the campaign; active state on this page
- [ ] Footer renders unchanged
- [ ] No console errors or React warnings on initial load

### B. SEO & social (entirely new)
- [ ] Per-page `export const metadata` overrides title to "Nicht nur dein Job | PauseAI Deutschland"
- [ ] Description present, < 160 chars
- [ ] Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type=article`
- [ ] `twitter:card=summary_large_image`
- [ ] Canonical URL tag
- [ ] OG image asset committed at `public/og-nicht-nur-dein-job.png` (1200×630, < 300kb)

### C. Hero & live counter
- [ ] Title and subtitle visible above the fold at 375px and 1024px+
- [ ] Counter formatted with German thousand separators (`128.648`)
- [ ] Counter animates count-up on viewport enter (IntersectionObserver, single trigger)
- [ ] `prefers-reduced-motion: reduce` → counter shows final value immediately
- [ ] Counter has `aria-live="polite"`
- [ ] Source attribution links to jobloss.ai with `target="_blank" rel="noopener noreferrer"`
- [ ] Sparkline SVG renders with ≥ 30 points; respects reduced-motion
- [ ] Loading: skeleton while fetching, no CLS when number arrives
- [ ] Failure mode: API timeout (5s) → fallback value + "Stand: <date>" line
- [ ] No SSR/hydration mismatch

### D. JumpBar / TOC
- [ ] Every section ID in `sections.ts` resolves to a real anchor in the DOM
- [ ] Click each entry → smooth scroll; reduced-motion → jump-cut
- [ ] Active section highlights as user scrolls (IntersectionObserver)
- [ ] Sticky after hero on desktop; collapses or becomes dropdown on mobile
- [ ] Keyboard tab order: TOC reachable before page body

### E. Survey form (`/umfrage`)
- [ ] CTA "Erzähl deine Geschichte" → `/nicht-nur-dein-job/umfrage`
- [ ] Empty submit blocks with field-level errors via `aria-describedby`, field gets `aria-invalid="true"`
- [ ] Email field optional; if filled, must validate
- [ ] GDPR checkbox required to submit
- [ ] "Allow quoting" optional checkbox
- [ ] Honeypot field present, server discards if filled
- [ ] Rate-limit at Convex layer (2 per `submitterToken` per hour)
- [ ] Optimistic UI: thank-you immediate, mutation in background
- [ ] On mutation error: thank-you reverts + retry banner
- [ ] `surveyResponses` Convex row contains expected fields
- [ ] `submitterToken` UUID stored in localStorage
- [ ] Submit button disabled while in-flight
- [ ] Browser back from thank-you doesn't re-submit
- [ ] `maxlength` enforced both client and server (5000 on story)
- [ ] No PII in URL or browser history

### F. Testimonials carousel
- [ ] Renders only `approved=true` items
- [ ] ≥ 5 seeded testimonials present at first load
- [ ] Arrows + dots navigate; reduced-motion → instant swap
- [ ] Keyboard: ArrowLeft/ArrowRight advance when carousel has focus
- [ ] `aria-live="polite"` announces "Geschichte X von Y"
- [ ] Touch swipe works on mobile
- [ ] Share buttons: X intent URL, WhatsApp `wa.me`, copy-link via Clipboard API
- [ ] Copy-link fallback for non-secure contexts (text-select prompt)
- [ ] Single-testimonial edge case: arrows + dots hidden
- [ ] Empty state: if Convex returns 0, fall back to static seed

### G. Mehr & Politische sections
- [ ] Body copy renders; all external links use `noopener noreferrer`
- [ ] CTA links to `/contactlawmakers`
- [ ] Heading hierarchy: section h2, subsection h3, no skips

### H. D3 chart section
- [ ] SVG renders with dimensions; no D3 console warnings
- [ ] Hover and keyboard focus on data points show tooltip in German format (`28.04.2026`, `1.234`)
- [ ] Sectoral filter (if shipped) updates chart with smooth transition; reduced-motion → instant
- [ ] Chart code dynamic-imported (`next/dynamic`) so it doesn't bloat hero bundle
- [ ] Empty data → neutral "Keine Daten" message, not broken axes
- [ ] "Mehr Daten auf jobloss.ai" opens in new tab

### I. Press review
- [ ] ≥ 10 items render: image, source, date, title, excerpt, category badge
- [ ] Filter by language narrows; filter by category narrows; two filters intersect
- [ ] "Alle" resets each axis
- [ ] Empty state: "Keine Artikel passen zu deinen Filtern"
- [ ] Cards open in new tab with `noopener noreferrer`
- [ ] Filter chips: `role="group"`, selected via `aria-pressed`
- [ ] Date formatting in DE locale
- [ ] Broken image fallback (Next/Image with `onError`)

### J. Cross-cutting accessibility
- [ ] One h1 per page; hierarchy preserved
- [ ] Visible focus rings on every interactive element
- [ ] All images: meaningful alt or `alt=""` if decorative
- [ ] Color contrast ≥ 4.5:1 body, ≥ 3:1 large text/UI (verify orange `#FF9416` vs both bg colors)
- [ ] Tap targets ≥ 44×44 px on mobile
- [ ] Whole page keyboard-operable end-to-end
- [ ] axe-core run via Playwright shows 0 serious violations
- [ ] Lighthouse a11y ≥ 95

### K. Performance
- [ ] Lighthouse performance ≥ 85 (mobile profile)
- [ ] LCP < 2.5s, CLS < 0.1
- [ ] D3 chart dynamic-imported
- [ ] Press images lazy-loaded
- [ ] JS payload on this route < 150kb gzipped (target)
- [ ] Convex queries called in parallel where independent

### L. Mobile / responsive
- [ ] 375px: no horizontal scroll, all CTAs tappable, JumpBar collapses
- [ ] 768px: layout reflows
- [ ] 1440px: max-width respected
- [ ] Safe-area-insets respected on iOS notch
- [ ] Carousel touch swipe works; filter chips wrap

### M. Security & privacy
- [ ] No PII stored in `surveyResponses` unless explicitly opted in
- [ ] IP not logged (Convex default)
- [ ] Press item URLs validated as `https://` before render
- [ ] User-submitted testimonials rendered as text (never `dangerouslySetInnerHTML`)
- [ ] Honeypot + rate limit on survey
- [ ] `submitterToken` UUID, no fingerprinting

### N. Resilience & error states
- [ ] jobloss.ai timeout (5s) → fallback constant + last-updated date
- [ ] Convex offline → static seed for testimonials/press; survey shows "kommt bald" banner
- [ ] No infinite loading spinners — every fetcher has a timeout

### O. Localization & copy quality
- [ ] All copy in German, no English fallbacks visible
- [ ] German typographic quotes „…" not straight `"`
- [ ] DE date format `28.04.2026`
- [ ] DE number format `128.648`
- [ ] No untranslated `aria-label` or tooltip
- [ ] Voice/tone consistent (coordinator final pass)

### P. Test infrastructure (entirely new)
- [ ] `@playwright/test` added as devDep
- [ ] `playwright.config.ts` with Chromium + WebKit + Firefox
- [ ] `npm run test:e2e` script in `package.json`
- [ ] Tests run against local dev server with seeded Convex test data
- [ ] `fetch` interception mocks jobloss.ai for deterministic counter tests
- [ ] One visual-regression snapshot of hero (gated, not strict)
- [ ] Run command + seed flow documented in `e2e/README.md`

### Q. Regression on existing site
- [ ] Homepage (`/`) still renders unchanged
- [ ] `/appell` still works (Header changes shouldn't break it)
- [ ] `/contactlawmakers` flow still works (we link to it)
- [ ] Convex schema additions are additive; no existing query breaks

### R. Deployment readiness (documentation only — actual deploy is user's call)
- [ ] Convex schema migration applied to dev before merge
- [ ] Deploy order documented: Convex push → Next deploy
- [ ] Env vars documented: `JOBLOSS_API_URL`, `NEXT_PUBLIC_JOBLOSS_FALLBACK`
- [ ] Page indexable in `robots.txt`
- [ ] Sitemap entry suggested if a sitemap exists in repo

## 12. Risks & mitigations

| Risk | Mitigation |
|---|---|
| jobloss.ai may not have a public API | Fallback constant from env var; Team B investigates first thing and documents the finding |
| Schema additions across 3 teams collide on `convex/schema.ts` | Each schema-touching team writes their addition to `convex/schema.<team>.ts` (a side file); coordinator inlines centrally during integration |
| `Header.tsx` collision between Team A and any future header touch | Only Team A edits `Header.tsx`; other teams link to anchors in their own components |
| Worktree disk space | Coordinator removes worktrees after merge with `git worktree remove` |
| Test flake from network calls to real jobloss.ai | Playwright `page.route()` mock for jobloss.ai in every test |
| Convex production push failing mid-flight | This branch does not push to prod; user reviews before merging to main |
| Copy quality drift across 5 teams | Coordinator does a final voice pass across every section before final commit |
| Long-running agent gets stuck | Coordinator has a 30-minute hard timeout per team; on timeout, coordinator inspects state, completes work or marks the team's slice as a follow-up |

## 13. Deployment order (for user, post-review)

1. `npx convex deploy` (dev or prod) — applies schema additions and registers new functions.
2. Confirm seed data populated via Convex dashboard or rerun seed mutation.
3. Set env vars on hosting: `JOBLOSS_API_URL`, `NEXT_PUBLIC_JOBLOSS_FALLBACK`.
4. Merge `not_just_your_job_campaign` to `main`.
5. Vercel/host deploys.
6. Header link goes live; smoke-test prod.

## 14. Open questions resolved during implementation

These are explicitly delegated to teams during execution; the coordinator documents the answers in the final status report:

- jobloss.ai data source: API or scrape — Team B investigates first and reports.
- OG image asset — coordinator creates or assigns a placeholder.
- Header nav label exact wording — coordinator picks during integration.
- Initial 8 testimonials — coordinator writes placeholders that are clearly marked TBD for later real-stories replacement.
- Whether to ship sectoral chart in v1 or defer — Team B's call based on jobloss.ai data shape.

## 15. Success criteria

The branch is ready for user review when:

1. Every item in §11 has a passing Playwright assertion or a documented manual verification.
2. `npm run lint` passes.
3. `npm run build` succeeds.
4. `npm run test:e2e` passes locally on Chromium (WebKit/Firefox parity is best-effort; failures documented).
5. Final integration commit message summarizes what was built.
6. Status report in `STATUS.md` (gitignored, in working tree) documents what was done, what's blocked, and what needs human attention.
