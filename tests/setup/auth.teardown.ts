import { test as teardown } from '@playwright/test';
import { BasePage } from '../../fixtures/BasePage';

teardown('logout', async ({ page }) => {
  await new BasePage(page).logout();
});
