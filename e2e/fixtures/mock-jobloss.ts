import type { Page } from '@playwright/test';

const FIXED_RESPONSE = {
  count: 128648,
  lastUpdated: '2026-04-15T00:00:00.000Z',
  source: 'mock' as const,
  daily: Array.from({ length: 90 }, (_, i) => ({
    date: new Date(2026, 0, 1 + i).toISOString().slice(0, 10),
    value: 800 + Math.round(Math.sin(i / 7) * 200) + i * 15,
  })),
};

export async function mockJobloss(page: Page) {
  await page.route('**/api/jobloss-count**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(FIXED_RESPONSE),
    });
  });
}
