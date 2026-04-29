import { test, expect } from './fixtures/test-base';

test.describe('campaign page smoke', () => {
  test('campaign page returns 200 and renders hero title', async ({ page }) => {
    const response = await page.goto('/nicht-nur-dein-job');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: /Nicht nur dein Job/ })).toBeVisible();
  });

  test('umfrage subroute returns 200 and renders form heading', async ({ page }) => {
    const response = await page.goto('/nicht-nur-dein-job/umfrage');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: /Erzähl deine Geschichte/ })).toBeVisible();
  });

  test('per-page metadata overrides default site title', async ({ page }) => {
    await page.goto('/nicht-nur-dein-job');
    await expect(page).toHaveTitle(/Nicht nur dein Job \| PauseAI Deutschland/);
  });

  test('OG image meta points to placeholder asset', async ({ page }) => {
    await page.goto('/nicht-nur-dein-job');
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', /og-nicht-nur-dein-job\.png/);
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
  });

  test('canonical URL is set', async ({ page }) => {
    await page.goto('/nicht-nur-dein-job');
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/nicht-nur-dein-job$/);
  });

  test('no console errors on the campaign page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/nicht-nur-dein-job');
    await page.waitForLoadState('networkidle');
    // Allow only known-safe noise (none expected)
    expect(errors).toEqual([]);
  });
});
