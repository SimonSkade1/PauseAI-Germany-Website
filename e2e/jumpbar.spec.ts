import { test, expect } from './fixtures/test-base';

const SECTION_IDS = ['hero', 'counter', 'umfrage-cta', 'stimmen', 'mehr', 'politische-forderung', 'chart', 'presse'];

test('every section in sections.ts has an anchor in the DOM', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  for (const id of SECTION_IDS) {
    const el = page.locator(`[data-section-id="${id}"]`);
    await expect(el).toBeAttached();
  }
});

test('jumpbar exposes a navigation landmark with all 8 entries', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  const nav = page.getByRole('navigation', { name: /Seitennavigation/ });
  await expect(nav).toBeVisible();
  const links = nav.locator('a');
  await expect(links).toHaveCount(SECTION_IDS.length);
});

test('clicking a jumpbar entry navigates to the right anchor', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  const nav = page.getByRole('navigation', { name: /Seitennavigation/ });
  await nav.getByRole('link', { name: /Mehr als Jobs/i }).click();
  await expect(page).toHaveURL(/#mehr/);
  await expect(page.locator('[data-section-id="mehr"]')).toBeInViewport({ ratio: 0.05 });
});

test('jumpbar remains visible after scrolling past hero', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(200);
  const nav = page.getByRole('navigation', { name: /Seitennavigation/ });
  await expect(nav).toBeVisible();
});
