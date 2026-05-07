import { test, expect } from './fixtures/test-base';

test('testimonials carousel renders a story', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#stimmen');
  const blockquote = page.locator('section[data-section-id="stimmen"] blockquote');
  await expect(blockquote).toBeVisible();
});

test('Weiter button advances the story', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#stimmen');
  const blockquote = page.locator('section[data-section-id="stimmen"] blockquote');
  const first = (await blockquote.innerText()).trim();
  await page.getByRole('button', { name: /Nächste Stimme/i }).click();
  // tolerate the fade transition
  await page.waitForTimeout(300);
  const second = (await blockquote.innerText()).trim();
  expect(second).not.toEqual(first);
});

test('share buttons present and X intent points to twitter', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#stimmen');
  const xLink = page.getByRole('link', { name: /Auf X teilen/i });
  await expect(xLink).toBeVisible();
  await expect(xLink).toHaveAttribute('href', /x\.com\/intent\/tweet/);

  const wa = page.getByRole('link', { name: /WhatsApp/i });
  await expect(wa).toBeVisible();
  await expect(wa).toHaveAttribute('href', /wa\.me/);

  const copy = page.getByRole('button', { name: /Link kopieren/i });
  await expect(copy).toBeVisible();
});

test('dot navigation jumps to specific story', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#stimmen');
  const dotsGroup = page.getByRole('group', { name: /Stimme auswählen/i });
  const buttons = dotsGroup.getByRole('button');
  const count = await buttons.count();
  expect(count).toBeGreaterThan(1);
  // First dot is pressed initially
  const blockquote = page.locator('section[data-section-id="stimmen"] blockquote');
  const first = (await blockquote.innerText()).trim();
  await buttons.nth(2).click();
  await page.waitForTimeout(300);
  const after = (await blockquote.innerText()).trim();
  expect(after).not.toEqual(first);
});
