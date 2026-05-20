import { test, expect } from '../../fixtures';

test.describe('Accounts', () => {
  test(
    'ACC-002 > Open Account > New CHECKING account shows confirmation',
    { annotation: { type: 'id', description: 'ACC-002' } },
    async ({ accountsPage }) => {
      // Act — open a new CHECKING account
      await accountsPage.openNewAccount('CHECKING');

      // Assert — confirmation is shown and account number is captured
      await expect(accountsPage.confirmationHeading()).toBeVisible();
      const newAccountNumber = await accountsPage.getNewAccountNumber();

      // Act — navigate to the accounts overview
      await accountsPage.goToOverview();

      // Assert — new account appears in the accounts list
      await expect(await accountsPage.accountInOverviewTable(newAccountNumber)).toBeVisible();
    },
  );
});
