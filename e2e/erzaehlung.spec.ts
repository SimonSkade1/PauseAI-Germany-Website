import { test, expect } from './fixtures/test-base';

test('erzaehlung page returns 200 and renders hero heading', async ({ page }) => {
  const response = await page.goto('/nicht-nur-dein-job/erzaehlung');
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole('heading', { level: 1, name: /Erzähl deine ganze Geschichte/ }),
  ).toBeVisible();
});

test('Tally iframe is present with the correct form ID', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/erzaehlung');
  const iframe = page.getByTestId('tally-iframe');
  await expect(iframe).toBeAttached();
  // The iframe carries data-tally-src until embed.js converts it to src.
  // Either attribute is acceptable as long as the form ID is referenced.
  const dataSrc = await iframe.getAttribute('data-tally-src');
  const src = await iframe.getAttribute('src');
  const reference = dataSrc ?? src ?? '';
  expect(reference).toContain('q4Y2Ok');
  expect(reference).toContain('hideTitle=1');
  expect(reference).toContain('dynamicHeight=1');
});

test('Tally embed script tag is requested', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/erzaehlung');
  // Wait for lazy-loaded scripts to attach
  await page.waitForLoadState('networkidle');
  const script = page.locator('script[src="https://tally.so/widgets/embed.js"]');
  await expect(script).toBeAttached();
});

test('GDPR / Tally provider note is visible', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/erzaehlung');
  await expect(page.getByText(/Form-Anbieter: Tally/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Datenschutzerklärung/ })).toBeVisible();
});

test('hero links back to the quick umfrage', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/erzaehlung');
  const link = page.getByRole('link', { name: 'Umfrage', exact: true });
  await expect(link).toHaveAttribute('href', '/nicht-nur-dein-job/umfrage');
});

test('Danke screen offers CTA to the deeper Tally form', async ({ page }) => {
  await page.goto('/nicht-nur-dein-job/umfrage');
  await page.getByLabel('Beruf').fill('Lehrerin');
  await page.getByLabel('Branche').fill('Bildung');
  await page.getByLabel('Altersgruppe').selectOption('35-44');
  await page.getByLabel('Deine Geschichte').fill('Eine Test-Geschichte mit ausreichend Inhalt.');
  await page.getByLabel(/Datenschutzerklärung/i).check();
  await page.getByRole('button', { name: /Geschichte absenden/i }).click();
  await expect(page.getByTestId('danke')).toBeVisible({ timeout: 5000 });
  const cta = page.getByRole('link', { name: /Zur ausführlichen Geschichte/ });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', '/nicht-nur-dein-job/erzaehlung');
});
