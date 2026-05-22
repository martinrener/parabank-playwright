import { test, expect } from '../../fixtures';

test.describe('Visual', () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  test(
    'VIS-001 > Visual > overview matches snapshot',
    { annotation: { type: 'id', description: 'VIS-001' } },
    async ({ accountsPage }) => {
      // Arrange

      // Act
      await accountsPage.goToOverview();

      // Assert
      await expect(accountsPage).toHaveScreenshot('overview.png');
    },
  );

  test(
    'VIS-002 > Visual > login page matches snapshot',
    { annotation: { type: 'id', description: 'VIS-002' } },
    async ({ loginPage }) => {
      // Act
      await loginPage.goToLogin();

      // Assert
      await expect(loginPage).toHaveScreenshot('login.png');
    },
  );

  test(
    'VIS-003 > Visual > transfer page matches snapshot',
    { annotation: { type: 'id', description: 'VIS-003' } },
    async ({ transferPage }) => {
      // Act
      await transferPage.goToTransfer();

      // Assert
      await expect(transferPage).toHaveScreenshot('transfer-confirmation.png');
    },
  );
});
