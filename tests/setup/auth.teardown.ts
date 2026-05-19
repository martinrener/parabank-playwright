import { test as teardown } from '@playwright/test';

teardown('logout', async ({ page }) => {
  await page.goto('/parabank/logout.htm');
});
