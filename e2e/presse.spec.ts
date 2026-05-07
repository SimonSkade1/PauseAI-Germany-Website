import { test, expect } from './fixtures/test-base';

test('press section renders at least 10 articles', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  const cards = page.locator('section[data-section-id="presse"] article');
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThanOrEqual(10);
});

test('language filter narrows visible cards', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  const cards = page.locator('section[data-section-id="presse"] article');
  const allCount = await cards.count();
  const langGroup = page.getByRole('group', { name: /Sprache filtern/i });
  await langGroup.getByRole('button', { name: /^Deutsch$/i }).click();
  await page.waitForTimeout(150);
  const dCount = await cards.count();
  expect(dCount).toBeLessThanOrEqual(allCount);
  expect(dCount).toBeGreaterThan(0);
});

test('two filters combine (language + category)', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  const langGroup = page.getByRole('group', { name: /Sprache filtern/i });
  const catGroup = page.getByRole('group', { name: /Kategorie filtern/i });
  await langGroup.getByRole('button', { name: /^Deutsch$/i }).click();
  await catGroup.getByRole('button', { name: /^Entlassung$/i }).click();
  await page.waitForTimeout(150);
  const cards = page.locator('section[data-section-id="presse"] article');
  // Should still have at least one match given the seed data
  expect(await cards.count()).toBeGreaterThan(0);
});

test('Alle resets each axis', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  const cards = page.locator('section[data-section-id="presse"] article');
  const all = await cards.count();
  const langGroup = page.getByRole('group', { name: /Sprache filtern/i });
  await langGroup.getByRole('button', { name: /^Deutsch$/i }).click();
  await page.waitForTimeout(150);
  await langGroup.getByRole('button', { name: /^Alle$/i }).first().click();
  await page.waitForTimeout(150);
  expect(await cards.count()).toBe(all);
});

test('cards open in a new tab with noopener', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  const link = page.locator('section[data-section-id="presse"] article a').first();
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
});

test('filter chips expose aria-pressed state', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#presse');
  const langGroup = page.getByRole('group', { name: /Sprache filtern/i });
  const allBtn = langGroup.getByRole('button', { name: /^Alle$/i });
  await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  const deBtn = langGroup.getByRole('button', { name: /^Deutsch$/i });
  await expect(deBtn).toHaveAttribute('aria-pressed', 'false');
});
