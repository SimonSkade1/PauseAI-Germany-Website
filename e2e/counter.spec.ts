import { test, expect } from './fixtures/test-base';

test('counter shows the German-formatted mocked value', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  // Trigger the IntersectionObserver-gated count-up by scrolling to the counter.
  await page.locator('section[data-section-id="counter"]').scrollIntoViewIfNeeded();
  const value = page.getByTestId('counter-value');
  await expect(value).toBeVisible();
  await expect(value).toContainText('128.648', { timeout: 5000 });
});

test('source link points to jobloss.ai with target=_blank and rel=noopener', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#counter');
  const link = page.locator('section[data-section-id="counter"] a[href="https://jobloss.ai"]').first();
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
});

test('sparkline svg renders inside the counter section', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#counter');
  const svg = page.locator('section[data-section-id="counter"] svg').first();
  await expect(svg).toBeVisible({ timeout: 5000 });
});

test('reduced-motion users see the final number without animation', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  // Apply jobloss mock manually (test-base fixture only applies to page from base.extend)
  await page.route('**/api/jobloss-count**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        count: 128648,
        lastUpdated: '2026-04-15T00:00:00.000Z',
        source: 'mock',
        daily: [],
      }),
    }),
  );
  await page.goto('/nicht-nur-dein-job');
  await page.locator('section[data-section-id="counter"]').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('counter-value')).toContainText('128.648', { timeout: 5000 });
  await ctx.close();
});
