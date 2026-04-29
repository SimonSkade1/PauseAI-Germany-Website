import { test, expect } from './fixtures/test-base';

test('homepage still renders', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  // Homepage uses headline class, not necessarily an h1 with specific text — check it loads
  await expect(page.locator('header').first()).toBeVisible();
});

test('homepage header includes new "Nicht nur dein Job" sublink', async ({ page }) => {
  await page.goto('/');
  // The desktop nav has a hover-to-reveal submenu; the link href is in the DOM regardless of hover.
  const link = page.locator('a[href="/nicht-nur-dein-job"]').first();
  await expect(link).toBeAttached();
});
