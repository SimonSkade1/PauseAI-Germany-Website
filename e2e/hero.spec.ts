import { test, expect } from './fixtures/test-base';

test('hero shows title, subtitle, and both CTAs', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');

  const h1 = page.getByRole('heading', { level: 1, name: /Nicht nur dein Job/ });
  await expect(h1).toBeVisible();

  await expect(page.getByText(/Wenn wir die Kontrolle über KI verlieren/)).toBeVisible();

  const primary = page.getByRole('link', { name: /Erzähl deine Geschichte/ }).first();
  await expect(primary).toBeVisible();
  await expect(primary).toHaveAttribute('href', '/nicht-nur-dein-job/umfrage');

  const secondary = page.getByRole('link', { name: /Stimmen lesen/ });
  await expect(secondary).toBeVisible();
  await expect(secondary).toHaveAttribute('href', '#stimmen');
});

test('hero is visible above the fold on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await page.goto('/nicht-nur-dein-job');
  const h1 = page.getByRole('heading', { level: 1, name: /Nicht nur dein Job/ });
  await expect(h1).toBeInViewport();
});
