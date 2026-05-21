import { test as setup } from '@playwright/test';
import { LoginPage } from '../../fixtures';
import { initializeDatabase } from '../../functions/admin';
import { getEnvVar } from '../../functions/common'

const USERNAME = getEnvVar('TEST_USERNAME')
const PASSWORD = getEnvVar('TEST_PASSWORD')

setup('authenticate', async ({ page, request }) => {
  await initializeDatabase(request);

  const loginPage = new LoginPage(page);
  await loginPage.goToLogin();
  await loginPage.login(USERNAME, PASSWORD);
  await page.waitForURL(/\/parabank\/overview\.htm/);
  await page.context().storageState({ path: '.auth/user.json' });
});
