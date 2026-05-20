import { test, expect } from '../../fixtures';

test.describe('Transactions', () => {
  test(
    'TRN-001 > Transactions > Account activity page shows transaction table with entries',
    { annotation: { type: 'id', description: 'TRN-001' } },
    async ({ accountsPage, activityPage, page }) => {
      // Arrange
      await accountsPage.goToOverview();

      // Act
      await accountsPage.firstAccountLink().click();

      // Assert
      await expect(page).toHaveURL(/activity\.htm/);
      await expect(activityPage.getTable()).toBeVisible();
      await expect(activityPage.getTransactionRows().first()).toBeVisible();
    },
  );
});
