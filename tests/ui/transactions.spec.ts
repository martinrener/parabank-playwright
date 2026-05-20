import { test, expect } from '../../fixtures';

test.describe('Transactions', () => {
  test(
    'TRN-001 > Transactions > Account activity page shows transaction table with entries',
    { annotation: { type: 'id', description: 'TRN-001' } },
    async ({ accountsPage, activityPage }) => {
      // Arrange
      await accountsPage.goToOverview();

      // Act
      await accountsPage.clickFirstAccount();

      // Assert
      await activityPage.expectActivityUrl();
      await expect(activityPage.getTable()).toBeVisible();
      await expect(activityPage.getTransactionRows().first()).toBeVisible();
    },
  );
});
