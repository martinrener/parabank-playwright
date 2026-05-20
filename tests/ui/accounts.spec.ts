import { test, expect } from '../../fixtures';

test.describe('Accounts', () => {
  test(
    'ACC-002 > Open Account > New CHECKING account shows confirmation',
    { annotation: { type: 'id', description: 'ACC-002' } },
    async ({ accountPage }) => {
      // Arrange
      await accountPage.goToOpenAccount();
      await accountPage.selectAccountType('CHECKING');
      await accountPage.selectFromAccount();

      // Act — submit the new account form
      await accountPage.submit();

      // Assert — confirmation is shown and account number is captured
      await expect(accountPage.confirmationHeading()).toBeVisible();
      const newAccountNumber = await accountPage.getNewAccountNumber();

      // Act — navigate to the accounts overview
      await accountPage.goToOverview();

      // Assert — new account appears in the accounts list
      await expect(await accountPage.accountInOverviewTable(newAccountNumber)).toBeVisible();
    },
  );
});
