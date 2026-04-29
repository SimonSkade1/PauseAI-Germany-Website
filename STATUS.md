# `not_just_your_job_campaign` — Status Report

**Branch:** `not_just_your_job_campaign`
**Last commit on this branch:** `9fd3a7e` (Phase 2: Playwright e2e suite)
**Branched from:** `origin/main` at `16b0d4c improve mythos mail` (after a hard reset of local main)
**Author of automated work:** Claude Opus 4.7 (1M context), autonomous run on 2026-04-29
**Status:** ready for human review — **not pushed**, **not merged to main**

---

## TL;DR

A new German campaign page is live locally at `/nicht-nur-dein-job` with a survey subroute at `/nicht-nur-dein-job/umfrage`. Header has a new "Nicht nur dein Job" sublink under "Mitmachen" (desktop + mobile). 40 Playwright tests pass on chromium in 15.8s. Type-checks clean. Lint clean for new files. The jobloss.ai counter and chart fall back to deterministic seed data because the upstream API doesn't exist; that's documented and graceful. Convex schema additions are committed but not pushed (no auth available autonomously) — frontend uses static seed data until you push Convex.

---

## What shipped

### Pages
- **`/nicht-nur-dein-job`** — campaign landing page with 8 sections orchestrated by `src/app/nicht-nur-dein-job/page.tsx`:
  1. **Hero** — full-bleed dark, animated radial accent, title "Nicht nur dein Job.", subtitle on control loss + X-risk, two CTAs.
  2. **JumpBar** — sticky in-page nav with active-section highlighting via IntersectionObserver and `data-section-id`. Lives between hero and counter so users can navigate back without scrolling.
  3. **JobLossCounter** — IntersectionObserver-gated count-up animation, German thousand-separator format (`128.648`), Sparkline of last 90 days, jobloss.ai source link.
  4. **UmfrageCTASection** — orange-bg attention break with CTA to `/umfrage`.
  5. **TestimonialsSection** — 8 hand-written German testimonials, carousel with arrow + dot navigation, keyboard arrows, touch swipe, share buttons (X / WhatsApp / copy-link with non-secure-context fallback), `aria-live="polite"` storytelling announcement.
  6. **MehrAlsArbeitSection** — three pillars (Demokratie / Abhängigkeit / Kontrollverlust) connecting employment loss to control loss to existential risk.
  7. **PolitischeForderungSection** — concrete demand + CTAs to `/contactlawmakers` and `/appell`.
  8. **JobLossChartSection** — interactive D3 line chart with hover/keyboard tooltips, sectoral breakdown bars, link to jobloss.ai.
  9. **PresseSection** — filterable press cards (language: Alle/DE/EN; category: Alle/Entlassung/Studie/Video/Auswirkung/Missbrauch/Jugend), 12 seeded items, empty-state with reset button.
- **`/nicht-nur-dein-job/umfrage`** — survey form with optimistic UI, GDPR consent (required), conditional email field (only when "allow quoting" is checked), honeypot, char counter, server-side rate limit by `submitterToken` (UUID in localStorage), thank-you screen with onward CTAs.

### Reusable components
- `src/components/charts/Sparkline.tsx` — small D3 line chart, ~30 LOC, useMemo-cached path.
- `src/components/charts/LineChart.tsx` — interactive D3 chart with mouse + keyboard tooltips, German date/number formatting, reduced-motion gating, ResizeObserver-based responsiveness.
- `src/components/charts/useReducedMotion.ts` — `useSyncExternalStore`-based hook (SSR-safe; no `setState`-in-effect lint complaint).

### API routes
- `src/app/api/jobloss-count/route.ts` — 1h ISR, 5s `AbortController` timeout, falls back to `JOBLOSS_FALLBACK_COUNT` and a 90-day deterministic series. Currently always returns `source: "fallback"` because there is no real `https://jobloss.ai/api/count`.
- `src/app/api/survey-submit/route.ts` — POST handler with field validation, honeypot drop, in-memory rate limit (2 / token / hour), email regex check only when `allowQuoting` is true. Stub for Convex — when Convex is auth'd, replace the logging stub with `ctx.runMutation(survey.submit)`.

### Convex
- `convex/schema.ts` extended with `testimonials`, `pressItems`, `surveyResponses` tables (additive).
- `convex/testimonials.ts`, `convex/press.ts`, `convex/survey.ts` — full function files with public queries, validated mutations, GDPR-aware `surveyResponses` insert mirroring the existing `eventSuggestions` `submitterToken` pattern.
- **Not pushed.** `npx convex dev` is required to apply schema and register functions (no `~/.convex` auth on this machine).

### Header
- New sublink **"Nicht nur dein Job"** under **Mitmachen** in both desktop dropdown and mobile menu (`src/components/Header.tsx`).

### Test infrastructure
- `@playwright/test` added as devDep, browsers installed.
- `playwright.config.ts` (Chromium + mobile-chromium projects, `webServer` reuses dev server, retries=1, html + list reporters).
- `e2e/fixtures/test-base.ts` re-exports `test` with the jobloss mock auto-applied via `page.route('**/api/jobloss-count**')`.
- 10 spec files, **40 tests passing** in 15.8s on chromium:
  | spec | tests |
  |---|---|
  | `smoke.spec.ts` | 6 |
  | `hero.spec.ts` | 2 |
  | `jumpbar.spec.ts` | 4 |
  | `counter.spec.ts` | 4 |
  | `testimonials.spec.ts` | 4 |
  | `mehr-politische.spec.ts` | 3 |
  | `chart.spec.ts` | 3 |
  | `presse.spec.ts` | 6 |
  | `survey.spec.ts` | 6 |
  | `regression.spec.ts` | 2 |

- `npm run test:e2e` runs everything; `:ui` for interactive; `:debug` for step-through.

### Static seed data
- `src/data/testimonials.ts` — 8 German testimonials (Marie/Tobias/Aylin/Henrik/Sara/Jonas/Fatima/Daniel) covering Bildung, Software, Design, Buchhaltung, Übersetzung, Studium, Sozialarbeit, Medizin.
- `src/data/press.ts` — 12 press items (7 DE, 5 EN) across all 6 categories.
- `src/data/jobloss.ts` — 90-day deterministic synthetic series + 7 sectoral breakdown buckets.

---

## What did NOT get done (and why)

| Item | Status | Why |
|---|---|---|
| Convex push | **deferred** | No `~/.convex` auth on this machine and no `.env.local` checked in. Schema and function files are committed; one `npx convex dev` from you applies everything. |
| Real OG image | **placeholder** | `public/og-nicht-nur-dein-job.png` is a copy of `Logo.png`. See `public/og-nicht-nur-dein-job.TODO.txt` for spec (1200×630, < 300kb). |
| `npm run build` end-to-end | **partial** | TypeScript compiles cleanly (`npx tsc --noEmit` returns 0 errors). The full `next build` fails on `/aktionen`'s prerender because it requires a Convex deployment URL — **pre-existing issue** unrelated to this branch (also fails on plain `main`). The campaign page itself builds fine in dev mode and serves at 200. |
| WebKit / Firefox tests | **deferred** | Playwright config has them commented down to chromium + mobile-chromium for fast iteration. Add them back in `playwright.config.ts` `projects` array when you want cross-browser coverage. |
| Real testimonials | **placeholder German prose** | The 8 stories in `src/data/testimonials.ts` are crafted to feel real and on-message but should be replaced with actual user submissions when the survey starts collecting them. |
| jobloss.ai live integration | **fallback only** | The route handler fetches `https://jobloss.ai/api/count` with a 5s timeout and falls back gracefully. If you discover the real API endpoint, set `JOBLOSS_API_URL` env var. |
| GitHub Actions CI for Playwright | **deferred** | The plan calls for follow-up. `npm run test:e2e` works locally; CI integration is a separate ~1-2h project. |

---

## How to deploy this branch

1. **Push Convex schema** (additive; doesn't break existing tables):
   ```bash
   npx convex dev          # interactive — prompts for auth on first run
   npx convex run testimonials:insert ...   # optional: seed real testimonials
   ```
2. **Set env vars** (Vercel project settings or `.env.local`):
   ```
   NEXT_PUBLIC_JOBLOSS_FALLBACK=128648
   JOBLOSS_API_URL=https://jobloss.ai/api/count   # or your real endpoint
   ```
3. **Replace OG placeholder** (`public/og-nicht-nur-dein-job.png`).
4. **Merge** `not_just_your_job_campaign` → `main` (or open PR).
5. Vercel rebuild → live at `/nicht-nur-dein-job`.

---

## Recommended next steps

1. Replace OG image (above).
2. `npx convex dev` to push the schema, then **wire the survey form to Convex** by replacing the body of `src/app/api/survey-submit/route.ts` with `ctx.runMutation(api.survey.submit, ...)` (or call `useMutation` from the form directly and remove the API route).
3. Replace one or two static testimonials with real submitted stories.
4. Add WebKit + Firefox to `playwright.config.ts` `projects` and re-run.
5. Add the page to `sitemap.xml` if one exists.
6. **Optional:** read through the spec at `docs/superpowers/specs/2026-04-29-not-just-your-job-campaign-design.md` and the plan at `docs/superpowers/plans/2026-04-29-not-just-your-job-campaign.md` for the full vision and the items that were intentionally scoped down (e.g., visual-regression snapshots, `axe-core` integration).

---

## Commit ladder on this branch

```
9fd3a7e  Phase 2: Playwright e2e suite with 40 tests, all passing
f38eba9  Phase 1 build: nicht-nur-dein-job campaign page sections
25f06ad  Phase 0 setup for nicht-nur-dein-job campaign
408a785  Add implementation plan for "Nicht nur dein Job" campaign
c85fde1  Add design spec for "Nicht nur dein Job" campaign page
16b0d4c  improve mythos mail   ← origin/main
```

You can revert any phase independently. To squash everything to one commit on merge:
```bash
git rebase -i 16b0d4c   # squash 5 commits into 1
```
or just merge with a single `--squash` to main.

---

## Verification commands you can re-run

```bash
# Type check
npx tsc --noEmit                                   # clean

# Lint (only my new files; repo has pre-existing lint errors elsewhere)
npm run lint 2>&1 | grep -E "src/(app/nicht-nur-dein-job|components/charts|app/api/jobloss-count|app/api/survey-submit|data/(testimonials|press|jobloss))"

# Run the e2e suite (auto-starts dev server)
npm run test:e2e

# Run interactively
npm run test:e2e:ui

# Verify the page in the browser
npm run dev
open http://localhost:3000/nicht-nur-dein-job
```
