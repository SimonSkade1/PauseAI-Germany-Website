# E2E Tests

End-to-end tests for the PauseAI Deutschland site, primarily covering the `/nicht-nur-dein-job` campaign page.

## Run

```bash
npm run test:e2e            # headless, all browsers configured
npm run test:e2e:ui         # interactive UI mode
npm run test:e2e:debug      # step-through debugger
```

Run a single file:

```bash
npx playwright test e2e/hero-counter.spec.ts
```

## Fixtures

- `fixtures/mock-jobloss.ts` — intercepts `**/api/jobloss-count**` and returns a deterministic 90-day series. The hero counter and chart use this in tests so neither flakes on real upstream availability.
- `fixtures/test-base.ts` — wrapped `test` re-export. **Always import `test` from this file** so the jobloss mock is active automatically.

## Conventions

- Tests assume the dev server is running on `http://localhost:3000`. Playwright's `webServer` config starts it via `npm run dev` and reuses an existing instance.
- All tests target chromium + mobile-chromium projects by default. WebKit/Firefox can be added back to `playwright.config.ts` once core suite is green.
- Reduced-motion behavior tested via `browser.newContext({ reducedMotion: 'reduce' })`.
