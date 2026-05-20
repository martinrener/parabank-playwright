import { test, expect } from '../../fixtures';

test.describe('Transactions', () => {
  test(
    'TRN-001 > Transactions > Account activity page shows transaction table with entries',
    { annotation: { type: 'id', description: 'TRN-001' } },
    async ({ accountPage, activityPage, page }) => {
      // Arrange
      await accountPage.goToOverview();

      // Act
      await accountPage.firstAccountLink().click();

      // Assert
      await expect(page).toHaveURL(/activity\.htm/);
      await expect(activityPage.getTable()).toBeVisible();
      await expect(activityPage.getTransactionRows().first()).toBeVisible();
    },
  );
});
