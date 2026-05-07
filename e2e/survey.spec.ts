import { test, expect } from './fixtures/test-base';

test('hero CTA navigates to /umfrage', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job');
  await page.getByRole('link', { name: /Erzähl deine Geschichte/ }).first().click();
  await expect(page).toHaveURL(/\/nicht-nur-dein-job\/umfrage$/);
  await expect(page.getByRole('heading', { level: 1, name: /Erzähl deine Geschichte/ })).toBeVisible();
});

test('umfrage CTA section also navigates to /umfrage', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job#umfrage-cta');
  const cta = page.getByRole('link', { name: /Zur Umfrage/ });
  await expect(cta).toHaveAttribute('href', '/nicht-nur-dein-job/umfrage');
});

test('empty submit blocks with field-level errors', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/umfrage');
  await page.getByRole('button', { name: /Geschichte absenden/i }).click();
  // First invalid field announced; check at least one aria-invalid="true"
  const invalid = page.locator('[aria-invalid="true"]');
  await expect(invalid.first()).toBeVisible({ timeout: 2000 });
});

test('GDPR consent is required', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/umfrage');
  await page.getByLabel('Beruf').fill('Lehrerin');
  await page.getByLabel('Branche').fill('Bildung');
  await page.getByLabel('Altersgruppe').selectOption('35-44');
  await page.getByLabel('Deine Geschichte').fill('Eine Test-Geschichte mit ausreichend Inhalt.');
  // Do NOT check the consent checkbox
  await page.getByRole('button', { name: /Geschichte absenden/i }).click();
  // Should remain on form with consent error
  await expect(page.getByText(/Ohne deine Einwilligung/i)).toBeVisible({ timeout: 2000 });
});

test('valid submit shows the Danke screen', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/umfrage');
  await page.getByLabel('Beruf').fill('Lehrerin');
  await page.getByLabel('Branche').fill('Bildung');
  await page.getByLabel('Altersgruppe').selectOption('35-44');
  await page.getByLabel('Deine Geschichte').fill('Eine Test-Geschichte mit ausreichend Inhalt.');
  await page.getByLabel(/Datenschutzerklärung/i).check();
  await page.getByRole('button', { name: /Geschichte absenden/i }).click();
  await expect(page.getByTestId('danke')).toBeVisible({ timeout: 5000 });
});

test('character counter increments as user types', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/umfrage');
  const story = page.getByLabel('Deine Geschichte');
  await story.fill('Hallo Welt');
  await expect(page.getByText(/10\s*\/\s*5\.000/)).toBeVisible();
});
