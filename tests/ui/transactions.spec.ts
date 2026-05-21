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

  test(
    'TRN-002 > Transactions > filter by period shows at least one transaction row',
    { annotation: { type: 'id', description: 'TRN-002' } },
    async ({ activityPage }) => {
      // Arrange
      await activityPage.goToActivity();

      // Act
      await activityPage.filterActivity('May', 'All');

      // Assert
      await expect(activityPage.getTransactionRows().first()).toBeVisible();
    },
  );

  test(
    'TRN-003 > Transactions > filter by Credit type shows credit values and empty debit column',
    { annotation: { type: 'id', description: 'TRN-003' } },
    async ({ activityPage }) => {
      // Arrange
      await activityPage.goToActivity();

      // Act
      await activityPage.filterActivity('All', 'Credit');

      // Assert
      await expect(activityPage.getTransactionRows().first()).toBeVisible();
      await expect(activityPage.getCreditCells().first()).not.toBeEmpty();
      await expect(activityPage.getDebitCells().first()).toBeEmpty();
    },
  );
});
