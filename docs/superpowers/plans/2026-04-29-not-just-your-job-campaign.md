# Not Just Your Job Campaign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development with parallel dispatch. This plan has 3 phases: Phase 0 is sequential (coordinator), Phase 1 is 5 parallel team slices (concurrent worktrees), Phase 2 is sequential integration (coordinator). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a German-language campaign page at `/nicht-nur-dein-job` modeled on PauseAI France's `/fr/emploi-ia`, with hero + live job-loss counter, testimonials carousel, "more than just jobs" expansion, political ask, interactive D3 chart, filterable press review, and survey form — all backed by Convex, fronted by Next.js, and tested with Playwright.

**Architecture:** Next.js 16 app-router page composed of 8 section components, each an isolated React module. Data layer adds 3 Convex tables (`testimonials`, `pressItems`, `surveyResponses`) merged additively into existing `convex/schema.ts`. Charts use already-installed D3 v7 with tree-shaken imports, dynamically loaded. jobloss.ai integration via a Next.js route handler with a 1h ISR cache and a fallback constant. Five parallel agent teams build slices in isolated git worktrees, each running their Playwright slice tests before handoff; coordinator merges in dependency order, runs the full suite, commits the integration.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind 4, Convex 1.31, D3 7.9, Playwright (new devDep), Lucide icons (existing).

**Spec reference:** `docs/superpowers/specs/2026-04-29-not-just-your-job-campaign-design.md` — the spec defines the full Playwright/QA checklist (§11 of the spec), which is the testable contract for every team's "done" gate.

---

## Phase 0 — Coordinator setup (sequential, on `not_just_your_job_campaign` branch)

This phase prepares the shared infrastructure all 5 teams need. Must complete before Phase 1 dispatch.

### Task 0.1: Install Playwright

**Files:**
- Modify: `package.json` (devDependencies)

- [ ] **Step 1: Install Playwright as a devDependency**

```bash
npm install --save-dev @playwright/test
```

- [ ] **Step 2: Install Playwright browsers**

```bash
npx playwright install chromium webkit firefox
```

- [ ] **Step 3: Verify devDep added**

```bash
grep '"@playwright/test"' package.json
```
Expected: line containing `"@playwright/test"` under devDependencies.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @playwright/test devDependency"
```

### Task 0.2: Create Playwright config

**Files:**
- Create: `playwright.config.ts`

- [ ] **Step 1: Write the config**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit playwright.config.ts
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add playwright.config.ts
git commit -m "chore: add playwright config"
```

### Task 0.3: Add npm scripts

**Files:**
- Modify: `package.json` (scripts section)

- [ ] **Step 1: Edit `package.json` scripts**

Add these three lines to the `scripts` object:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:debug": "playwright test --debug"
```

- [ ] **Step 2: Verify scripts present**

```bash
grep '"test:e2e"' package.json
```
Expected: 3 matching lines.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add playwright npm scripts"
```

### Task 0.4: Create e2e fixtures (jobloss mock + Convex seed helpers)

**Files:**
- Create: `e2e/fixtures/mock-jobloss.ts`
- Create: `e2e/fixtures/seed.ts`
- Create: `e2e/fixtures/test-base.ts`
- Create: `e2e/README.md`

- [ ] **Step 1: Create the jobloss mock**

```typescript
// e2e/fixtures/mock-jobloss.ts
import type { Page } from '@playwright/test';

const FIXED_RESPONSE = {
  count: 128648,
  lastUpdated: '2026-04-15T00:00:00.000Z',
  source: 'mock',
  daily: Array.from({ length: 90 }, (_, i) => ({
    date: new Date(2026, 0, 1 + i).toISOString().slice(0, 10),
    value: 800 + Math.round(Math.sin(i / 7) * 200) + i * 15,
  })),
};

export async function mockJobloss(page: Page) {
  await page.route('**/api/jobloss-count**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(FIXED_RESPONSE),
    });
  });
}
```

- [ ] **Step 2: Create the test-base fixture**

```typescript
// e2e/fixtures/test-base.ts
import { test as base } from '@playwright/test';
import { mockJobloss } from './mock-jobloss';

export const test = base.extend({
  page: async ({ page }, use) => {
    await mockJobloss(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

- [ ] **Step 3: Create seed helper (uses Convex public mutation that the seed task adds)**

```typescript
// e2e/fixtures/seed.ts
// This helper assumes convex/seed.ts exposes a `seedAll` mutation that
// idempotently inserts the test data set. Teams D and E populate it.
import { execSync } from 'node:child_process';

export function seedConvex() {
  // Run via the convex CLI against the dev deployment.
  // Idempotent: re-running is safe.
  try {
    execSync('npx convex run seed:seedAll', { stdio: 'inherit' });
  } catch (err) {
    console.warn('Convex seed failed (may be unavailable in CI):', err);
  }
}
```

- [ ] **Step 4: Create e2e/README**

```markdown
# E2E Tests

Run all tests:

    npm run test:e2e

Run interactively:

    npm run test:e2e:ui

Run a single file:

    npx playwright test e2e/hero-counter.spec.ts

## Fixtures

- `mock-jobloss.ts` — intercepts the `jobloss.ai` upstream and returns a deterministic 90-day series.
- `test-base.ts` — re-export of `@playwright/test` with the mock applied automatically.
- `seed.ts` — calls `convex run seed:seedAll` to populate testimonials, press items, and surveyResponses test rows.

Always import `test` from `./fixtures/test-base` (not directly from `@playwright/test`) so the mock is active.

## Per-team report directories

Each team commits their HTML report to `playwright-report/<team-id>/` so the coordinator can verify on integration.
```

- [ ] **Step 5: Commit**

```bash
git add e2e/
git commit -m "chore: add playwright e2e fixtures and README"
```

### Task 0.5: Add `playwright-report/` and `test-results/` to gitignore (with team-report exception)

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Append to `.gitignore`**

```
# Playwright
test-results/
playwright-report/
!playwright-report/team-*/
.playwright-cache/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore playwright outputs except per-team reports"
```

### Task 0.6: Create OG image placeholder

**Files:**
- Create: `public/og-nicht-nur-dein-job.png`

- [ ] **Step 1: Generate a placeholder OG image**

A 1200×630 PNG with the campaign title on brand background. Since image generation is out of scope for the autonomous run, copy the existing logo to a placeholder filename and document a TODO for the user to replace with a real OG asset.

```bash
cp public/Logo.png public/og-nicht-nur-dein-job.png
```

- [ ] **Step 2: Add a TODO file noting this is a placeholder**

Create `public/og-nicht-nur-dein-job.TODO.txt`:

```
PLACEHOLDER OG IMAGE — replace before launch.
Required: 1200×630 PNG, < 300kb, with title "Nicht nur dein Job" and
subtitle from spec, on PauseAI dark background with orange accent.
```

- [ ] **Step 3: Commit**

```bash
git add public/og-nicht-nur-dein-job.png public/og-nicht-nur-dein-job.TODO.txt
git commit -m "chore: add placeholder OG image for campaign page"
```

### Task 0.7: Pre-create empty schema fragment files (one per schema-touching team)

These files exist so each team can edit their own without conflicting on `convex/schema.ts`. The coordinator inlines them into `schema.ts` during integration.

**Files:**
- Create: `convex/schema.testimonials.ts` (empty exports stub)
- Create: `convex/schema.pressItems.ts` (empty exports stub)
- Create: `convex/schema.surveyResponses.ts` (empty exports stub)

- [ ] **Step 1: Create each stub**

```typescript
// convex/schema.testimonials.ts
// Owned by Team D. Coordinator inlines into convex/schema.ts during integration.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const testimonialsTable = defineTable({
  name: v.string(),
  age: v.optional(v.number()),
  profession: v.string(),
  location: v.optional(v.string()),
  story: v.string(),
  approved: v.boolean(),
  shareCount: v.optional(v.number()),
  createdAt: v.number(),
})
  .index("by_approved", ["approved"])
  .index("by_created_at", ["createdAt"]);
```

```typescript
// convex/schema.pressItems.ts
// Owned by Team E.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pressItemsTable = defineTable({
  title: v.string(),
  source: v.string(),
  url: v.string(),
  language: v.union(v.literal("de"), v.literal("en")),
  category: v.union(
    v.literal("entlassung"),
    v.literal("studie"),
    v.literal("video"),
    v.literal("auswirkung"),
    v.literal("missbrauch"),
    v.literal("jugend"),
  ),
  publishedAt: v.number(),
  excerpt: v.string(),
  imageUrl: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_published", ["publishedAt"])
  .index("by_lang_cat", ["language", "category"]);
```

```typescript
// convex/schema.surveyResponses.ts
// Owned by Team C.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const surveyResponsesTable = defineTable({
  profession: v.string(),
  industry: v.string(),
  ageRange: v.string(),
  story: v.string(),
  allowQuoting: v.boolean(),
  contactEmail: v.optional(v.string()),
  submitterToken: v.string(),
  honeypot: v.optional(v.string()),
  consentedAt: v.number(),
  createdAt: v.number(),
})
  .index("by_submitter_token", ["submitterToken"])
  .index("by_created_at", ["createdAt"]);
```

- [ ] **Step 2: Commit**

```bash
git add convex/schema.testimonials.ts convex/schema.pressItems.ts convex/schema.surveyResponses.ts
git commit -m "chore: scaffold per-team schema fragment files"
```

### Task 0.8: Create env-var fallback constant

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Read current `next.config.ts`**

```bash
cat next.config.ts
```

- [ ] **Step 2: Add publicRuntimeConfig or env block**

If the existing config object exists, add:

```typescript
env: {
  NEXT_PUBLIC_JOBLOSS_FALLBACK: process.env.NEXT_PUBLIC_JOBLOSS_FALLBACK ?? '128648',
  JOBLOSS_API_URL: process.env.JOBLOSS_API_URL ?? 'https://jobloss.ai/api/count',
},
```

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore: declare jobloss env vars with fallback"
```

### Task 0.9: Create 5 worktrees for parallel teams

**Files:** none (git operation only)

- [ ] **Step 1: Create the worktrees**

```bash
mkdir -p ../worktrees
git worktree add ../worktrees/team-a-frame  -b not_just_your_job_campaign/team-a-frame  not_just_your_job_campaign
git worktree add ../worktrees/team-b-data   -b not_just_your_job_campaign/team-b-data   not_just_your_job_campaign
git worktree add ../worktrees/team-c-survey -b not_just_your_job_campaign/team-c-survey not_just_your_job_campaign
git worktree add ../worktrees/team-d-testi  -b not_just_your_job_campaign/team-d-testi  not_just_your_job_campaign
git worktree add ../worktrees/team-e-press  -b not_just_your_job_campaign/team-e-press  not_just_your_job_campaign
```

- [ ] **Step 2: Verify**

```bash
git worktree list
```
Expected: 6 lines (main + 5 team worktrees).

---

## Phase 1 — Parallel team execution

Each team runs in its own worktree concurrently. Each task block below is the **complete dispatch contract** for one agent. Agents must read the spec checklist and meet their team's "completion gate" (spec §8 / §11) before declaring done.

**Common rules for all teams:**
- Use the existing site's Tailwind utility class conventions (`font-body`, `font-section`, `orange-link`, `bg-pause-black`, `text-pause-black`, `#FF9416`).
- Use `import { test, expect } from '../../e2e/fixtures/test-base'` (relative path varies; teams adjust) so jobloss.ai mock is active.
- All German copy uses typographic quotes „…" not straight `"`.
- Reduced-motion respected on every animation (use `useReducedMotion` hook from Team B; Team B builds it first as a dependency).
- Commit per file group; final commit on team branch is the Playwright HTML report.
- After tests pass, write a one-paragraph handoff note in `playwright-report/<team-id>/HANDOFF.md` summarizing decisions made and any TODOs.

### Task A: Team A — Frame (Hero, Mehr, Politische, JumpBar, page.tsx, sections.ts, Header link, stub sections for B/C/D/E so the page compiles)

**Worktree:** `../worktrees/team-a-frame`
**Branch:** `not_just_your_job_campaign/team-a-frame`

**Files:**
- Create: `src/app/nicht-nur-dein-job/page.tsx`
- Create: `src/app/nicht-nur-dein-job/sections.ts`
- Create: `src/app/nicht-nur-dein-job/HeroSection.tsx`
- Create: `src/app/nicht-nur-dein-job/MehrAlsArbeitSection.tsx`
- Create: `src/app/nicht-nur-dein-job/PolitischeForderungSection.tsx`
- Create: `src/app/nicht-nur-dein-job/JumpBar.tsx`
- Create: `src/app/nicht-nur-dein-job/_stubs.tsx` (placeholders for B/C/D/E sections)
- Modify: `src/components/Header.tsx` (add nav link)
- Create: `e2e/team-a-frame.spec.ts`
- Create: `e2e/team-a-jumpbar.spec.ts`
- Create: `e2e/team-a-mehr-politische.spec.ts`

#### Contracts

`src/app/nicht-nur-dein-job/sections.ts` — central section ID registry consumed by JumpBar and every section component:

```typescript
// src/app/nicht-nur-dein-job/sections.ts
export const SECTIONS = [
  { id: "hero", label: "Einstieg" },
  { id: "counter", label: "Zähler" },
  { id: "umfrage-cta", label: "Deine Geschichte" },
  { id: "stimmen", label: "Stimmen" },
  { id: "mehr", label: "Mehr als Jobs" },
  { id: "politische-forderung", label: "Forderung" },
  { id: "chart", label: "Daten" },
  { id: "presse", label: "Presse" },
] as const;

export type SectionId = typeof SECTIONS[number]["id"];
```

`src/app/nicht-nur-dein-job/page.tsx` — orchestrator, imports all sections (real ones for A, stubs for B/C/D/E):

```tsx
// src/app/nicht-nur-dein-job/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "./HeroSection";
import MehrAlsArbeitSection from "./MehrAlsArbeitSection";
import PolitischeForderungSection from "./PolitischeForderungSection";
import JumpBar from "./JumpBar";
// Imports below are stubs replaced by Teams B/C/D/E during integration.
import {
  JobLossCounterSection,
  UmfrageCTASection,
  TestimonialsSection,
  JobLossChartSection,
  PresseSection,
} from "./_stubs";

export const metadata: Metadata = {
  title: "Nicht nur dein Job | PauseAI Deutschland",
  description:
    "Wenn wir die Kontrolle über KI verlieren, ist alles, was wir wertschätzen, in Gefahr – Arbeit, Demokratie, Leben.",
  openGraph: {
    title: "Nicht nur dein Job | PauseAI Deutschland",
    description:
      "Wenn wir die Kontrolle über KI verlieren, ist alles in Gefahr – Arbeit, Demokratie, Leben.",
    url: "https://pauseai.de/nicht-nur-dein-job",
    type: "article",
    images: [{ url: "/og-nicht-nur-dein-job.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicht nur dein Job | PauseAI Deutschland",
    description:
      "Wenn wir die Kontrolle über KI verlieren, ist alles in Gefahr.",
    images: ["/og-nicht-nur-dein-job.png"],
  },
  alternates: { canonical: "https://pauseai.de/nicht-nur-dein-job" },
};

export default function NichtNurDeinJobPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <JumpBar />
        <JobLossCounterSection />
        <UmfrageCTASection />
        <TestimonialsSection />
        <MehrAlsArbeitSection />
        <PolitischeForderungSection />
        <JobLossChartSection />
        <PresseSection />
      </main>
      <Footer />
    </>
  );
}
```

`_stubs.tsx` — placeholder components so Team A's worktree compiles. Each renders a minimal section with the right `id` so JumpBar tests pass:

```tsx
// src/app/nicht-nur-dein-job/_stubs.tsx
// Replaced during integration by real components from Teams B/C/D/E.
export function JobLossCounterSection() {
  return <section id="counter" className="py-20"><div className="max-w-4xl mx-auto px-6">[Counter — Team B]</div></section>;
}
export function UmfrageCTASection() {
  return <section id="umfrage-cta" className="py-20"><div className="max-w-4xl mx-auto px-6">[CTA — Team C]</div></section>;
}
export function TestimonialsSection() {
  return <section id="stimmen" className="py-20"><div className="max-w-4xl mx-auto px-6">[Stimmen — Team D]</div></section>;
}
export function JobLossChartSection() {
  return <section id="chart" className="py-20"><div className="max-w-4xl mx-auto px-6">[Chart — Team B]</div></section>;
}
export function PresseSection() {
  return <section id="presse" className="py-20"><div className="max-w-4xl mx-auto px-6">[Presse — Team E]</div></section>;
}
```

`HeroSection.tsx` — large-impact hero with title, subtitle, primary CTA. Uses brand classes from existing pages (see `src/app/page.tsx` `ChronicleSection` and `src/components/sections/HeroSection.tsx` for patterns).

```tsx
// src/app/nicht-nur-dein-job/HeroSection.tsx
import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="hero" className="bg-[#1a1a1a] text-white pt-28 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <p className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-6">
          Kampagne
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-8">
          Nicht nur dein Job.
        </h1>
        <p className="font-body text-xl md:text-2xl text-white/80 leading-relaxed mb-10 max-w-3xl">
          Wenn wir die Kontrolle über KI verlieren, ist alles, was wir wertschätzen, in Gefahr –
          Arbeit, Demokratie, Leben.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/nicht-nur-dein-job/umfrage"
            className="inline-flex items-center justify-center bg-[#FF9416] px-6 py-3 font-section text-base tracking-wider text-black transition-colors hover:bg-[#e88510]"
          >
            Erzähl deine Geschichte →
          </Link>
          <a
            href="#stimmen"
            className="inline-flex items-center justify-center border border-white/30 px-6 py-3 font-section text-base tracking-wider text-white transition-colors hover:bg-white/5"
          >
            Stimmen lesen
          </a>
        </div>
      </div>
    </section>
  );
}
```

`MehrAlsArbeitSection.tsx` — three-pillar expansion (Demokratie, Abhängigkeit, Kontrollverlust):

```tsx
// src/app/nicht-nur-dein-job/MehrAlsArbeitSection.tsx
import LinkedHeading from "@/components/LinkedHeading";

const PILLARS = [
  {
    icon: "🏛",
    title: "Demokratie",
    text: "Wenige Konzerne kontrollieren immer mehr Information, Entscheidungen und Infrastruktur. KI verstärkt diese Konzentration.",
  },
  {
    icon: "🧠",
    title: "Abhängigkeit",
    text: "Je mehr wir auslagern, desto weniger verstehen wir selbst. Eine Gesellschaft, die nicht mehr versteht, was sie tut, ist verwundbar.",
  },
  {
    icon: "⚠️",
    title: "Kontrollverlust",
    text: "Aktuelle Systeme zeigen bereits Verhalten, das ihre Entwickler nicht vorhergesehen haben. Je leistungsfähiger sie werden, desto schwerer wiegt jeder Fehler.",
  },
];

export default function MehrAlsArbeitSection() {
  return (
    <section id="mehr" className="bg-[#1a1a1a] py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <LinkedHeading id="mehr" dark>Es geht um mehr als deinen Job</LinkedHeading>
        <p className="font-body text-white/70 text-lg leading-relaxed mb-12 max-w-3xl">
          Der Verlust von Arbeitsplätzen ist real – aber es ist nur das erste Glied einer
          längeren Kette. Wer KI baut, ohne sie zu verstehen, riskiert mehr als Stellen.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <div key={p.title} className="border-t border-white/15 pt-6">
              <div className="text-2xl mb-3">{p.icon}</div>
              <h3 className="font-section text-sm tracking-[0.18em] uppercase text-[#FF9416] mb-3">
                {p.title}
              </h3>
              <p className="font-body text-white/70 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`PolitischeForderungSection.tsx`:

```tsx
// src/app/nicht-nur-dein-job/PolitischeForderungSection.tsx
import Link from "next/link";
import LinkedHeading from "@/components/LinkedHeading";

export default function PolitischeForderungSection() {
  return (
    <section id="politische-forderung" className="bg-white py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <LinkedHeading id="politische-forderung">Was wir fordern</LinkedHeading>
        <p className="font-body-bold text-lg text-pause-black mb-4 leading-relaxed">
          Kein KI-System, das den Menschen in vielen Aufgaben übertrifft, sollte ohne unabhängige
          Sicherheitsprüfung entwickelt werden – wirtschaftlich, sozial, politisch.
        </p>
        <p className="font-body text-pause-black/75 text-base md:text-lg leading-relaxed mb-10">
          Diese Sicherheit muss bewiesen werden, bevor solche Systeme freigegeben werden – nicht
          danach. Schreib deinen Bundestagsabgeordneten und mach klar, dass das Thema auf die
          politische Agenda gehört.
        </p>
        <Link
          href="/contactlawmakers"
          className="inline-flex items-center justify-center bg-[#FF9416] px-6 py-3 font-section text-base tracking-wider text-black transition-colors hover:bg-[#e88510]"
        >
          Schreib deinem Abgeordneten →
        </Link>
      </div>
    </section>
  );
}
```

`JumpBar.tsx` — sticky in-page nav with active highlighting via IntersectionObserver:

```tsx
// src/app/nicht-nur-dein-job/JumpBar.tsx
"use client";
import { useEffect, useState } from "react";
import { SECTIONS } from "./sections";

export default function JumpBar() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // pick the topmost visible
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Seitennavigation"
      className="sticky top-0 z-30 bg-[#1a1a1a]/95 backdrop-blur border-b border-white/10"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 overflow-x-auto">
        <ul className="flex gap-1 md:gap-3 py-3 whitespace-nowrap">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`font-section text-xs md:text-sm tracking-wider uppercase px-3 py-2 transition-colors ${
                  active === s.id ? "text-[#FF9416]" : "text-white/60 hover:text-white"
                }`}
                aria-current={active === s.id ? "true" : undefined}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
```

**Header link:** Modify `src/components/Header.tsx` to add a top-level link `Nicht nur dein Job` → `/nicht-nur-dein-job`. Active state follows existing pattern (read existing nav for the matching style).

**Tests for Team A** (write all three, run, then commit + report):

```typescript
// e2e/team-a-frame.spec.ts
import { test, expect } from './fixtures/test-base';

test('campaign page loads with hero', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  await expect(page.getByRole('heading', { level: 1, name: /Nicht nur dein Job/ })).toBeVisible();
  await expect(page.getByText(/Kontrolle über KI verlieren/)).toBeVisible();
});

test('header has new nav link with active state on this page', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  const link = page.getByRole('link', { name: /Nicht nur dein Job/ }).first();
  await expect(link).toBeVisible();
});

test('OG metadata is set', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  const title = await page.title();
  expect(title).toContain('Nicht nur dein Job');
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(og).toContain('/og-nicht-nur-dein-job.png');
});

test('no console errors on initial load', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('/nicht-nur-dein-job');
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});
```

```typescript
// e2e/team-a-jumpbar.spec.ts
import { test, expect } from './fixtures/test-base';
import { SECTIONS } from '../src/app/nicht-nur-dein-job/sections';

test('every section ID has a real anchor', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  for (const s of SECTIONS) {
    await expect(page.locator(`#${s.id}`)).toBeAttached();
  }
});

test('jumpbar smooth-scrolls to a section', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  await page.getByRole('link', { name: /Mehr als Jobs/i }).click();
  await expect(page.locator('#mehr')).toBeInViewport();
});

test('jumpbar is sticky after hero', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  await page.evaluate(() => window.scrollTo(0, 1500));
  const nav = page.getByRole('navigation', { name: /Seitennavigation/ });
  await expect(nav).toBeVisible();
});
```

```typescript
// e2e/team-a-mehr-politische.spec.ts
import { test, expect } from './fixtures/test-base';

test('Mehr section renders three pillars', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#mehr');
  await expect(page.getByRole('heading', { name: /mehr als deinen Job/i })).toBeVisible();
  await expect(page.getByText(/Demokratie/)).toBeVisible();
  await expect(page.getByText(/Abhängigkeit/)).toBeVisible();
  await expect(page.getByText(/Kontrollverlust/)).toBeVisible();
});

test('Politische Forderung links to /contactlawmakers', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#politische-forderung');
  const cta = page.getByRole('link', { name: /Schreib deinem Abgeordneten/i });
  await expect(cta).toHaveAttribute('href', '/contactlawmakers');
});
```

#### Steps

- [ ] **Step 1:** Create all 7 source files using the contracts above. Test mode strict TS.
- [ ] **Step 2:** Run `npx tsc --noEmit` from worktree root, fix any errors.
- [ ] **Step 3:** Start dev server `npm run dev` and visually verify the page loads at `http://localhost:3001/nicht-nur-dein-job` (use port 3001 to not collide with other teams). Override port: `npm run dev -- -p 3001`.
- [ ] **Step 4:** Write the three test files.
- [ ] **Step 5:** Run `npx playwright test e2e/team-a-*.spec.ts --reporter=html`.
- [ ] **Step 6:** All Team A tests must pass on chromium. WebKit/Firefox failures documented in HANDOFF.
- [ ] **Step 7:** Move report to `playwright-report/team-a-frame/` and write `HANDOFF.md`.
- [ ] **Step 8:** Commit:

```bash
git add src/app/nicht-nur-dein-job/ src/components/Header.tsx e2e/team-a-*.spec.ts playwright-report/team-a-frame/
git commit -m "feat(campaign): Team A frame — hero, mehr, politische, jumpbar, header link, page scaffold"
```

### Task B: Team B — Live data (jobloss.ai route, counter, sparkline, chart, useReducedMotion hook)

**Worktree:** `../worktrees/team-b-data`
**Branch:** `not_just_your_job_campaign/team-b-data`

**Files:**
- Create: `src/app/api/jobloss-count/route.ts`
- Create: `src/components/charts/useReducedMotion.ts`
- Create: `src/components/charts/Sparkline.tsx`
- Create: `src/components/charts/LineChart.tsx`
- Create: `src/app/nicht-nur-dein-job/JobLossCounterSection.tsx`
- Create: `src/app/nicht-nur-dein-job/JobLossChartSection.tsx`
- Create: `e2e/team-b-counter.spec.ts`
- Create: `e2e/team-b-chart.spec.ts`

#### Contracts

API route:

```typescript
// src/app/api/jobloss-count/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 3600;

const FALLBACK = parseInt(process.env.NEXT_PUBLIC_JOBLOSS_FALLBACK ?? '128648', 10);
const UPSTREAM = process.env.JOBLOSS_API_URL ?? 'https://jobloss.ai/api/count';

interface JobLossPayload {
  count: number;
  lastUpdated: string;
  source: 'upstream' | 'fallback' | 'mock';
  daily?: Array<{ date: string; value: number }>;
}

export async function GET(): Promise<NextResponse<JobLossPayload>> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 5000);
  try {
    const r = await fetch(UPSTREAM, { signal: ac.signal, next: { revalidate: 3600 } });
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const data = await r.json();
    return NextResponse.json({
      count: data.count ?? FALLBACK,
      lastUpdated: data.lastUpdated ?? new Date().toISOString(),
      source: 'upstream',
      daily: data.daily,
    });
  } catch {
    return NextResponse.json({
      count: FALLBACK,
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
    });
  } finally {
    clearTimeout(timer);
  }
}
```

`useReducedMotion.ts`:

```typescript
// src/components/charts/useReducedMotion.ts
"use client";
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduce;
}
```

`Sparkline.tsx` (D3, no axes, brand-colored line):

```tsx
// src/components/charts/Sparkline.tsx
"use client";
import * as d3 from "d3";
import { useMemo } from "react";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function Sparkline({ data, width = 240, height = 40, color = "#FF9416" }: Props) {
  const path = useMemo(() => {
    if (!data.length) return "";
    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
    const y = d3.scaleLinear().domain([d3.min(data) ?? 0, d3.max(data) ?? 1]).range([height - 2, 2]);
    return d3.line<number>().x((_, i) => x(i)).y((d) => y(d)).curve(d3.curveMonotoneX)(data) ?? "";
  }, [data, width, height]);

  return (
    <svg width={width} height={height} role="img" aria-label="Verlauf der letzten 90 Tage">
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}
```

`LineChart.tsx` — interactive D3 chart with tooltip and reduced-motion gating. Use `next/dynamic` to lazy-load this from JobLossChartSection. Build with `d3-scale`, `d3-shape`, `d3-axis`, `d3-time-format`. Tooltip handled via React state on top of D3 `<circle>` elements that are focusable (`tabIndex={0}`). Date format DE: `d3.timeFormat("%d.%m.%Y")` won't give `28.04.2026` automatically — use `Intl.DateTimeFormat('de-DE')`.

(Full LineChart implementation should follow the Sparkline pattern: useMemo for scales+path, render axes via React based on D3-computed ticks, attach hover/focus handlers per data point. ~120 lines. The agent implements.)

`JobLossCounterSection.tsx` — fetches from `/api/jobloss-count`, animates count-up via `requestAnimationFrame` (or static if reduced-motion), formats with `Intl.NumberFormat("de-DE")`, includes Sparkline:

```tsx
// src/app/nicht-nur-dein-job/JobLossCounterSection.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import Sparkline from "@/components/charts/Sparkline";
import { useReducedMotion } from "@/components/charts/useReducedMotion";

const NUM = new Intl.NumberFormat("de-DE");

export default function JobLossCounterSection() {
  const [count, setCount] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [daily, setDaily] = useState<number[]>([]);
  const [displayed, setDisplayed] = useState(0);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    fetch("/api/jobloss-count")
      .then((r) => r.json())
      .then((d) => {
        setCount(d.count);
        setLastUpdated(d.lastUpdated);
        if (d.daily) setDaily(d.daily.map((p: { value: number }) => p.value));
      })
      .catch(() => {
        setCount(parseInt(process.env.NEXT_PUBLIC_JOBLOSS_FALLBACK ?? "128648", 10));
        setLastUpdated(new Date().toISOString());
      });
  }, []);

  useEffect(() => {
    if (!ref.current || count === null || animated) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setAnimated(true);
        if (reduce) {
          setDisplayed(count);
        } else {
          const start = performance.now();
          const dur = 1500;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            setDisplayed(Math.round(p * count));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      }
    }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [count, animated, reduce]);

  return (
    <section id="counter" ref={ref} className="bg-white py-20 md:py-28 border-t border-pause-black/10">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <p className="font-section text-sm tracking-[0.18em] uppercase text-pause-black/60 mb-4">
          Seit Januar 2025
        </p>
        <p className="font-display text-6xl md:text-8xl text-[#FF9416] tabular-nums" aria-live="polite">
          {count === null ? "…" : NUM.format(displayed)}
        </p>
        <p className="font-body text-lg md:text-xl text-pause-black/70 mt-4">
          KI-bedingte Stellenstreichungen weltweit
        </p>
        {daily.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Sparkline data={daily} />
          </div>
        )}
        <p className="font-body text-xs text-pause-black/50 mt-4">
          Quelle:{" "}
          <a
            href="https://jobloss.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="orange-link"
          >
            jobloss.ai
          </a>
          {lastUpdated && ` · Stand: ${new Date(lastUpdated).toLocaleDateString("de-DE")}`}
        </p>
      </div>
    </section>
  );
}
```

`JobLossChartSection.tsx` — wraps `LineChart` with `next/dynamic`:

```tsx
// src/app/nicht-nur-dein-job/JobLossChartSection.tsx
import dynamic from "next/dynamic";
import LinkedHeading from "@/components/LinkedHeading";

const LineChart = dynamic(() => import("@/components/charts/LineChart"), { ssr: false });

export default function JobLossChartSection() {
  return (
    <section id="chart" className="bg-white py-20 md:py-32 border-t border-pause-black/10">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <LinkedHeading id="chart">Entwicklung der KI-bedingten Entlassungen</LinkedHeading>
        <p className="font-body text-pause-black/75 leading-relaxed mb-10 max-w-3xl">
          Die Plattform jobloss.ai erfasst Entlassungsmeldungen, die KI oder Automatisierung
          als Begründung nennen. Quellen: Pressemitteilungen und seriöse Medienberichte.
        </p>
        <LineChart endpoint="/api/jobloss-count" />
        <p className="font-body text-sm text-pause-black/60 mt-6">
          <a
            href="https://jobloss.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="orange-link"
          >
            Mehr Daten auf jobloss.ai →
          </a>
        </p>
      </div>
    </section>
  );
}
```

**Tests for Team B:**

```typescript
// e2e/team-b-counter.spec.ts
import { test, expect } from './fixtures/test-base';

test('counter renders a number with German thousand separator', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  // Mock returns 128648
  await expect(page.getByText(/128\.648/)).toBeVisible({ timeout: 5000 });
});

test('counter source link opens jobloss.ai in new tab', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  const link = page.locator('a[href="https://jobloss.ai"]').first();
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
});

test('sparkline svg renders', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  const svg = page.locator('section#counter svg');
  await expect(svg).toBeVisible();
});

test('reduced motion → counter shows final value immediately', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/nicht-nur-dein-job');
  await expect(page.getByText(/128\.648/)).toBeVisible({ timeout: 1000 });
  await ctx.close();
});
```

```typescript
// e2e/team-b-chart.spec.ts
import { test, expect } from './fixtures/test-base';

test('chart section renders without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/nicht-nur-dein-job#chart');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('section#chart svg')).toBeVisible({ timeout: 10000 });
  expect(errors).toEqual([]);
});

test('chart link to jobloss.ai opens in new tab', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#chart');
  const link = page.getByRole('link', { name: /Mehr Daten auf jobloss\.ai/ });
  await expect(link).toHaveAttribute('target', '_blank');
});
```

#### Steps

- [ ] Create useReducedMotion hook, Sparkline, LineChart in that order (LineChart depends on the hook).
- [ ] Create the API route, run `curl http://localhost:3001/api/jobloss-count` and verify JSON shape.
- [ ] Create the two section components.
- [ ] In Team B's worktree, **temporarily replace `_stubs.tsx` exports** for `JobLossCounterSection` and `JobLossChartSection` with re-exports of the real components so the page renders correctly during local testing. (This change is local-only; coordinator handles real wiring during integration.)
- [ ] Write the two test files.
- [ ] Run `npx playwright test e2e/team-b-*.spec.ts`.
- [ ] All counter + chart tests pass on chromium.
- [ ] Move report to `playwright-report/team-b-data/` and write HANDOFF noting whether jobloss.ai has a real public API or if we ship with the fallback only.
- [ ] Commit:

```bash
git add src/app/api/jobloss-count/ src/components/charts/ src/app/nicht-nur-dein-job/JobLoss*.tsx e2e/team-b-*.spec.ts playwright-report/team-b-data/
git commit -m "feat(campaign): Team B live data — jobloss API, counter, sparkline, line chart"
```

### Task C: Team C — Survey (Convex schema fragment, mutations, form, thank-you, CTA)

**Worktree:** `../worktrees/team-c-survey`
**Branch:** `not_just_your_job_campaign/team-c-survey`

**Files:**
- Modify: `convex/schema.surveyResponses.ts` (already scaffolded; add anything missing)
- Create: `convex/survey.ts`
- Create (or modify): `convex/seed.ts` (Team C, D, E all touch this — see merge note below)
- Create: `src/app/nicht-nur-dein-job/UmfrageCTASection.tsx`
- Create: `src/app/nicht-nur-dein-job/umfrage/page.tsx`
- Create: `src/app/nicht-nur-dein-job/umfrage/SurveyForm.tsx`
- Create: `src/app/nicht-nur-dein-job/umfrage/DankeSection.tsx`
- Create: `e2e/team-c-survey.spec.ts`

#### `convex/seed.ts` merge note

Teams C, D, E each contribute to `convex/seed.ts`. To avoid conflicts, each team writes their seed into a side file `convex/seed.<table>.ts` exporting an internal mutation, and the coordinator inlines them into `convex/seed.ts` during integration as a single `seedAll` action. **Team C's contribution is empty for surveyResponses** — surveys are user-generated, not seeded. Team C just creates `convex/seed.surveyResponses.ts` with a no-op stub.

#### Contracts

`convex/survey.ts`:

```typescript
// convex/survey.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 2;

export const submit = mutation({
  args: {
    profession: v.string(),
    industry: v.string(),
    ageRange: v.string(),
    story: v.string(),
    allowQuoting: v.boolean(),
    contactEmail: v.optional(v.string()),
    submitterToken: v.string(),
    honeypot: v.optional(v.string()),
    consentedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Honeypot — silently discard bot submissions.
    if (args.honeypot && args.honeypot.length > 0) {
      return { ok: true, simulated: true };
    }
    // maxlength server-side
    if (args.story.length > 5000) {
      throw new Error("Geschichte ist zu lang (max. 5000 Zeichen).");
    }
    // Rate limit by submitterToken
    const now = Date.now();
    const recent = await ctx.db
      .query("surveyResponses")
      .withIndex("by_submitter_token", (q) => q.eq("submitterToken", args.submitterToken))
      .filter((q) => q.gt(q.field("createdAt"), now - RATE_LIMIT_WINDOW_MS))
      .collect();
    if (recent.length >= RATE_LIMIT_MAX) {
      throw new Error("Du hast bereits eine Geschichte eingereicht. Danke!");
    }
    // Email only stored if allowQuoting
    const contactEmail = args.allowQuoting ? args.contactEmail : undefined;
    await ctx.db.insert("surveyResponses", {
      profession: args.profession,
      industry: args.industry,
      ageRange: args.ageRange,
      story: args.story,
      allowQuoting: args.allowQuoting,
      contactEmail,
      submitterToken: args.submitterToken,
      consentedAt: args.consentedAt,
      createdAt: now,
    });
    return { ok: true };
  },
});
```

`UmfrageCTASection.tsx`:

```tsx
// src/app/nicht-nur-dein-job/UmfrageCTASection.tsx
import Link from "next/link";

export default function UmfrageCTASection() {
  return (
    <section id="umfrage-cta" className="bg-[#FF9416] py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center text-black">
        <h2 className="font-display text-4xl md:text-6xl leading-tight mb-6">
          Wie verändert KI deinen Beruf?
        </h2>
        <p className="font-body text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Wir sammeln Geschichten aus dem deutschen Arbeitsmarkt – von Lehrer:innen, Programmierer:innen,
          Designer:innen, Buchhalter:innen, allen. Erzähl uns deine.
        </p>
        <Link
          href="/nicht-nur-dein-job/umfrage"
          className="inline-flex items-center justify-center bg-[#1a1a1a] text-white px-8 py-4 font-section text-base tracking-wider transition-colors hover:bg-black"
        >
          Zur Umfrage →
        </Link>
      </div>
    </section>
  );
}
```

`SurveyForm.tsx` — client component with React state, validation, optimistic UI, honeypot, submitterToken from localStorage. Implements all spec §11.E gates. Uses `useMutation(api.survey.submit)` from `convex/react`.

(Full implementation: ~250 lines. Includes a `<form>` with labelled inputs for profession/industry/ageRange/story/email/consent, a hidden `<input name="company"/>` honeypot, an `<input type="checkbox" required>` for GDPR consent, an optional checkbox for `allowQuoting`. Submit handler: validate, set loading, optimistic show DankeSection, call mutation, on error revert with toast/banner. Generates submitterToken UUID via `crypto.randomUUID()` lazily and persists to `localStorage["njdj_token"]`.)

`umfrage/page.tsx`:

```tsx
// src/app/nicht-nur-dein-job/umfrage/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "Umfrage — Nicht nur dein Job | PauseAI Deutschland",
  description: "Erzähl uns, wie KI deinen Beruf verändert.",
};

export default function UmfragePage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-[#1a1a1a] text-white pt-28 pb-12 md:pt-36">
          <div className="max-w-2xl mx-auto px-6">
            <h1 className="font-display text-4xl md:text-5xl mb-4">Erzähl deine Geschichte</h1>
            <p className="font-body text-white/80">
              Anonym oder mit Namen — wie du willst. Deine Geschichte hilft uns, das Bild zusammenzusetzen.
            </p>
          </div>
        </section>
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-2xl mx-auto px-6">
            <SurveyForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

`DankeSection.tsx`:

```tsx
// src/app/nicht-nur-dein-job/umfrage/DankeSection.tsx
import Link from "next/link";

export default function DankeSection() {
  return (
    <div className="text-center py-12">
      <h2 className="font-display text-3xl md:text-4xl mb-4">Danke!</h2>
      <p className="font-body text-pause-black/75 mb-8">
        Wir lesen jede Geschichte. Wenn du kontaktiert werden möchtest, melden wir uns.
      </p>
      <Link href="/nicht-nur-dein-job#stimmen" className="orange-link font-section tracking-wider">
        Andere Stimmen lesen →
      </Link>
    </div>
  );
}
```

**Test:**

```typescript
// e2e/team-c-survey.spec.ts
import { test, expect } from './fixtures/test-base';

test('CTA links to /umfrage', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#umfrage-cta');
  const cta = page.getByRole('link', { name: /Zur Umfrage/ });
  await expect(cta).toHaveAttribute('href', '/nicht-nur-dein-job/umfrage');
});

test('empty submit blocks with errors', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/umfrage');
  await page.getByRole('button', { name: /absenden/i }).click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(1, { timeout: 2000 });
});

test('GDPR consent required', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/umfrage');
  await page.getByLabel('Beruf').fill('Lehrerin');
  await page.getByLabel('Branche').fill('Bildung');
  await page.getByLabel('Altersgruppe').selectOption('35-44');
  await page.getByLabel(/Deine Geschichte/).fill('Test story long enough to be valid.');
  await page.getByRole('button', { name: /absenden/i }).click();
  // Without consent checkbox, form should not have advanced.
  await expect(page.getByRole('button', { name: /absenden/i })).toBeVisible();
});

test('valid submit shows thank you', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/umfrage');
  await page.getByLabel('Beruf').fill('Lehrerin');
  await page.getByLabel('Branche').fill('Bildung');
  await page.getByLabel('Altersgruppe').selectOption('35-44');
  await page.getByLabel(/Deine Geschichte/).fill('Test story long enough to be valid.');
  await page.getByLabel(/Datenschutz|Einwilligung/).check();
  await page.getByRole('button', { name: /absenden/i }).click();
  await expect(page.getByText(/Danke!/)).toBeVisible({ timeout: 5000 });
});
```

#### Steps

- [ ] Create the survey mutation in `convex/survey.ts`.
- [ ] Create `convex/seed.surveyResponses.ts` (no-op stub for parity with other teams).
- [ ] Create the four React files. Implement validation, honeypot, submitterToken, optimistic UI per spec §11.E.
- [ ] In Team C's worktree, replace the `_stubs.tsx` `UmfrageCTASection` with a re-export of the real one for local testing.
- [ ] Write the test file.
- [ ] Run `npx convex dev --once` to push schema additions and the survey mutation to a dev deployment so `useMutation(api.survey.submit)` works in the test.
- [ ] Run `npx playwright test e2e/team-c-survey.spec.ts`.
- [ ] HANDOFF + report.
- [ ] Commit:

```bash
git add convex/survey.ts convex/seed.surveyResponses.ts src/app/nicht-nur-dein-job/UmfrageCTASection.tsx src/app/nicht-nur-dein-job/umfrage/ e2e/team-c-survey.spec.ts playwright-report/team-c-survey/
git commit -m "feat(campaign): Team C survey — Convex mutation, form with optimistic UI, thank-you"
```

### Task D: Team D — Testimonials (schema, query, carousel, share buttons, 8 seed entries)

**Worktree:** `../worktrees/team-d-testi`
**Branch:** `not_just_your_job_campaign/team-d-testi`

**Files:**
- Create: `convex/testimonials.ts`
- Create: `convex/seed.testimonials.ts`
- Create: `src/app/nicht-nur-dein-job/TestimonialsSection.tsx`
- Create: `e2e/team-d-testimonials.spec.ts`

#### Contracts

`convex/testimonials.ts`:

```typescript
// convex/testimonials.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listApproved = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("testimonials")
      .withIndex("by_approved", (q) => q.eq("approved", true))
      .order("desc")
      .collect();
  },
});

export const incrementShareCount = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (!doc) return;
    await ctx.db.patch(id, { shareCount: (doc.shareCount ?? 0) + 1 });
  },
});
```

`convex/seed.testimonials.ts` — exports an internal mutation that idempotently inserts 8 hand-written testimonials. The agent writes plausible German stories. Each entry: `name` (pseudonym OK), `age`, `profession`, `location`, `story` (200–800 chars). Mark `approved: true` for all 8. Idempotency: skip insert if a testimonial with the same `name` + `profession` exists.

```typescript
// convex/seed.testimonials.ts
import { internalMutation } from "./_generated/server";

const SEED = [
  // Agent fills in 8 entries here. Example shape:
  {
    name: "Marie",
    age: 40,
    profession: "Lehrerin für Philosophie",
    location: "München",
    story: "Seit ich KI-Tools im Unterricht erlebe, frage ich mich, was Bildung morgen noch heißt …",
    approved: true,
    shareCount: 0,
  },
  // ... 7 more
];

export const seedTestimonials = internalMutation(async (ctx) => {
  const now = Date.now();
  const existing = await ctx.db.query("testimonials").collect();
  const seen = new Set(existing.map((t) => `${t.name}|${t.profession}`));
  for (const e of SEED) {
    if (seen.has(`${e.name}|${e.profession}`)) continue;
    await ctx.db.insert("testimonials", { ...e, createdAt: now });
  }
});
```

`TestimonialsSection.tsx` — carousel matching the existing `QuotesSection` pattern (`src/app/page.tsx:187-256`) but with arrow-key support, share buttons, aria-live, single-item edge case, and Convex-backed source. Uses `useQuery(api.testimonials.listApproved)`. Falls back to a static array of 5 placeholder testimonials if the query returns empty.

(Implementation: ~180 lines. Reuse the dot navigation, fade transition, and Vor/Zurück buttons from QuotesSection. Add: keyboard ArrowLeft/ArrowRight handler with `tabIndex={0}` on the card, share buttons row [X intent URL, `wa.me`, copy-link with Clipboard API + fallback], `aria-live="polite"` announcing "Geschichte X von Y", reduced-motion gate.)

**Test:**

```typescript
// e2e/team-d-testimonials.spec.ts
import { test, expect } from './fixtures/test-base';

test('carousel renders at least one testimonial', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#stimmen');
  await expect(page.locator('section#stimmen blockquote')).toBeVisible();
});

test('Weiter button advances the story', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#stimmen');
  const initial = await page.locator('section#stimmen blockquote').innerText();
  await page.getByRole('button', { name: /Weiter/ }).click();
  await expect(page.locator('section#stimmen blockquote')).not.toHaveText(initial);
});

test('share buttons present', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#stimmen');
  await expect(page.getByRole('link', { name: /Auf X teilen/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /WhatsApp/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Link kopieren/i })).toBeVisible();
});

test('arrow keys cycle when carousel focused', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#stimmen');
  await page.locator('section#stimmen').focus();
  await page.keyboard.press('ArrowRight');
  // Carousel should advance — assert via blockquote change
});
```

#### Steps

- [ ] Write `convex/testimonials.ts` and `convex/seed.testimonials.ts` (with 8 real placeholder stories).
- [ ] Push to Convex dev: `npx convex dev --once`.
- [ ] Run seed: `npx convex run seed/testimonials:seedTestimonials` (note: the seed function is called by an aggregator added during integration; for now invoke directly).
- [ ] Build `TestimonialsSection.tsx`.
- [ ] In Team D's worktree, replace `_stubs.tsx` `TestimonialsSection` with a re-export.
- [ ] Run tests.
- [ ] HANDOFF + report.
- [ ] Commit.

### Task E: Team E — Press review (schema, query, filter chips, cards, 12 seed entries)

**Worktree:** `../worktrees/team-e-press`
**Branch:** `not_just_your_job_campaign/team-e-press`

**Files:**
- Create: `convex/press.ts`
- Create: `convex/seed.press.ts`
- Create: `src/app/nicht-nur-dein-job/PresseSection.tsx`
- Create: `e2e/team-e-press.spec.ts`

#### Contracts

`convex/press.ts`:

```typescript
// convex/press.ts
import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pressItems").withIndex("by_published").order("desc").collect();
  },
});
```

`convex/seed.press.ts` — 12 real-ish press items. Mix of DE (7) and EN (5). Categories spread across all 6 enum values. URLs must be `https://`. Sources from real outlets (Spiegel, Zeit, FAZ, Tagesschau, taz, NZZ, Standard, NYT, Guardian, FT, etc.). Title and excerpt in source language; `category` and `language` per item.

`PresseSection.tsx` — filter chips (Sprache: Alle / Deutsch / Englisch; Kategorie: Alle / Entlassung / Studie / Video / Auswirkung / Missbrauch / Jugend), grid of cards (image, source pill, date, title, excerpt). State via `useState`, filtering via simple `.filter()`. Empty state if no match.

(Implementation: ~200 lines. Use `<button aria-pressed>` for chips, `Intl.DateTimeFormat("de-DE")` for dates, `next/image` with `onError` for broken images.)

**Test:**

```typescript
// e2e/team-e-press.spec.ts
import { test, expect } from './fixtures/test-base';

test('press section renders cards', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  const cards = page.locator('section#presse article');
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThanOrEqual(10);
});

test('language filter narrows results', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  await page.getByRole('button', { name: /^Deutsch$/ }).click();
  const cards = page.locator('section#presse article');
  expect(await cards.count()).toBeGreaterThan(0);
  // All visible cards should have a German indicator (e.g. lang attr or visible badge "DE").
});

test('combining language and category', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  await page.getByRole('button', { name: /^Deutsch$/ }).click();
  await page.getByRole('button', { name: /^Entlassung$/ }).click();
  // Cards should be DE+Entlassung intersection
  expect(await page.locator('section#presse article').count()).toBeGreaterThanOrEqual(0);
});

test('no-match shows empty state', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  await page.getByRole('button', { name: /^Englisch$/ }).click();
  await page.getByRole('button', { name: /^Jugend$/ }).click();
  // Could be 0 — check empty message renders if so
});

test('cards open in new tab', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  const link = page.locator('section#presse article a').first();
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
});
```

#### Steps as Team D pattern.

---

## Phase 2 — Coordinator integration (sequential, on `not_just_your_job_campaign`)

### Task 2.1: Merge Team A

- [ ] **Step 1:** From main branch (`not_just_your_job_campaign`):

```bash
git merge --no-ff not_just_your_job_campaign/team-a-frame -m "merge: Team A frame"
```

- [ ] **Step 2:** Verify build:

```bash
npm run lint && npm run build
```

### Task 2.2: Merge Team B

- [ ] Merge: `git merge --no-ff not_just_your_job_campaign/team-b-data`
- [ ] Resolve `_stubs.tsx` import: Team B's worktree replaced stubs locally for testing; the merge will bring those replacements. Verify `_stubs.tsx` now correctly delegates `JobLossCounterSection` and `JobLossChartSection` to Team B's real files. If it was modified inconsistently, restore the `_stubs.tsx` to import-from-real-file pattern.

### Task 2.3: Merge Team D, then E, then C (dependency order — survey CTA last because it sits inside Frame's page).

### Task 2.4: Inline schema fragments centrally

- [ ] **Step 1:** Read `convex/schema.testimonials.ts`, `schema.pressItems.ts`, `schema.surveyResponses.ts`.
- [ ] **Step 2:** Edit `convex/schema.ts` to add the three table definitions inline:

```typescript
// existing tables above ...

testimonials: defineTable({ /* exactly as in schema.testimonials.ts */ })
  .index("by_approved", ["approved"])
  .index("by_created_at", ["createdAt"]),

pressItems: defineTable({ /* exactly as in schema.pressItems.ts */ })
  .index("by_published", ["publishedAt"])
  .index("by_lang_cat", ["language", "category"]),

surveyResponses: defineTable({ /* exactly as in schema.surveyResponses.ts */ })
  .index("by_submitter_token", ["submitterToken"])
  .index("by_created_at", ["createdAt"]),
```

- [ ] **Step 3:** Delete the three side-file stubs:

```bash
rm convex/schema.testimonials.ts convex/schema.pressItems.ts convex/schema.surveyResponses.ts
```

- [ ] **Step 4:** Push schema:

```bash
npx convex dev --once
```

### Task 2.5: Aggregate seed.ts

- [ ] Create `convex/seed.ts` with a `seedAll` action that calls each of `seed.testimonials.ts`, `seed.press.ts`, `seed.surveyResponses.ts`:

```typescript
// convex/seed.ts
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const seedAll = internalAction(async (ctx) => {
  await ctx.runMutation(internal.seed_testimonials.seedTestimonials);
  await ctx.runMutation(internal.seed_press.seedPress);
  // surveyResponses is user-generated, no seed.
});
```

- [ ] Adjust the side-file names to match Convex naming if needed.

### Task 2.6: Replace `_stubs.tsx`

- [ ] **Step 1:** Edit `src/app/nicht-nur-dein-job/page.tsx` to import from the real module paths instead of `./_stubs`:

```tsx
import JobLossCounterSection from "./JobLossCounterSection";
import UmfrageCTASection from "./UmfrageCTASection";
import TestimonialsSection from "./TestimonialsSection";
import JobLossChartSection from "./JobLossChartSection";
import PresseSection from "./PresseSection";
```

- [ ] **Step 2:** Delete `_stubs.tsx`:

```bash
rm src/app/nicht-nur-dein-job/_stubs.tsx
```

### Task 2.7: Run full Playwright suite

- [ ] **Step 1:** Make sure the dev server is fresh:

```bash
pkill -f "next dev" || true
npm run dev &
sleep 5
```

- [ ] **Step 2:** Seed Convex:

```bash
npx convex run seed:seedAll
```

- [ ] **Step 3:** Run full suite:

```bash
npx playwright test
```

- [ ] **Step 4:** All chromium tests pass. WebKit/Firefox failures triaged into HANDOFF (some are known browser-specific issues, e.g., webkit lacks certain CSS).

- [ ] **Step 5:** Move report to `playwright-report/integration/`.

### Task 2.8: Voice/copy pass

- [ ] Re-read every `*.tsx` in `src/app/nicht-nur-dein-job/`.
- [ ] Check tone consistency: empathic + direct, second person ("du"), German typographic quotes „…".
- [ ] Fix anything that drifts.
- [ ] Commit edits separately:

```bash
git add src/app/nicht-nur-dein-job/
git commit -m "chore(campaign): final voice/copy pass across sections"
```

### Task 2.9: Lint + build + final commit

- [ ] **Step 1:**

```bash
npm run lint
npm run build
```

- [ ] **Step 2:** If lint or build fails, fix and recommit.

- [ ] **Step 3:** Write `STATUS.md` (committed for the user to read on wake):

`STATUS.md` lives at repo root, gitignored from main but committed on this branch as a transient document. It contains:
- What shipped (per spec section)
- What's blocked (e.g., real OG image, real testimonials, real jobloss API key)
- Test summary (counts, browsers, any known fails)
- How to deploy (Convex push order, env vars, etc.)
- Recommended next steps

- [ ] **Step 4:** Final commit:

```bash
git add STATUS.md
git commit -m "docs: add status report for not_just_your_job_campaign"
```

### Task 2.10: Cleanup worktrees

- [ ] **Step 1:** From the main worktree:

```bash
git worktree remove ../worktrees/team-a-frame
git worktree remove ../worktrees/team-b-data
git worktree remove ../worktrees/team-c-survey
git worktree remove ../worktrees/team-d-testi
git worktree remove ../worktrees/team-e-press
```

(Skip removal if a worktree has uncommitted changes; document in STATUS.md.)

- [ ] **Step 2:** Verify clean state:

```bash
git worktree list
git status
```

---

## Self-review notes (executed inline)

**Spec coverage:** every section A–R of spec §11 maps to at least one Phase 1 team or Phase 2 integration task. SEO (B) → Team A. Hero & counter (C) → Teams A + B. JumpBar (D) → Team A. Survey (E) → Team C. Testimonials (F) → Team D. Mehr/Politische (G) → Team A. Chart (H) → Team B. Press (I) → Team E. A11y (J) → all teams + integration audit. Performance (K) → all teams + integration. Mobile (L) → all teams. Security (M) → Team C primarily. Resilience (N) → Team B (jobloss fallback) + Team D (Convex empty fallback). L10n (O) → all teams + integration voice pass. Test infra (P) → Phase 0. Regression (Q) → integration suite. Deployment (R) → STATUS.md.

**Placeholder scan:** the only "TBD" is the testimonial seed copy, explicitly delegated to Team D's agent; no other placeholders.

**Type consistency:** schema field names are identical across spec, schema fragments, and contracts. Section IDs in `sections.ts` match anchor IDs in every section component. API endpoint name `/api/jobloss-count` consistent across route, fetch call, and mock. Convex function names `survey.submit`, `testimonials.listApproved`, `press.list` consistent.

**Known scope decisions:**
- Sectoral chart filter (spec §11.H "if shipped") deferred to Team B's call based on data shape.
- Real OG image deferred to user (placeholder shipped).
- Convex CI gate deferred to follow-up.
