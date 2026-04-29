import { test, expect } from './fixtures/test-base';

test('Mehr section renders the three pillars', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#mehr');
  await expect(page.getByRole('heading', { name: /mehr als deinen Job/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Demokratie$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Abhängigkeit$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Kontrollverlust$/i })).toBeVisible();
});

test('Politische Forderung CTA links to /contactlawmakers', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#politische-forderung');
  const cta = page.getByRole('link', { name: /Schreib deinem Abgeordneten/i });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', '/contactlawmakers');
});

test('Politische Forderung also links to /appell', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#politische-forderung');
  const link = page.getByRole('link', { name: /Den Appell unterzeichnen/i });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/appell');
});
