import { test as base } from '@playwright/test';
import { mockJobloss } from './mock-jobloss';

export const test = base.extend({
  page: async ({ page }, use) => {
    await mockJobloss(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
