import { test, expect } from './fixtures/test-base';

test('chart section renders an svg', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#chart');
  const svg = page.locator('section[data-section-id="chart"] svg').first();
  await expect(svg).toBeVisible({ timeout: 10_000 });
});

test('sectoral breakdown lists at least 5 sectors', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#chart');
  const items = page.locator('section[data-section-id="chart"] ul > li');
  expect(await items.count()).toBeGreaterThanOrEqual(5);
});

test('chart link to jobloss.ai opens in a new tab', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#chart');
  const link = page.getByRole('link', { name: /Mehr Daten auf jobloss\.ai/i });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
});
