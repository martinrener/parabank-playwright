import { test } from '../../fixtures';

test.describe('Accounts', () => {
  test(
    'ACC-002 > Accounts > Open new CHECKING account, confirmation is shown',
    { annotation: { type: 'id', description: 'ACC-002' } },
    async ({ accountsPage }) => {
      // Arrange — authenticated session via storageState

      // Act — open a new CHECKING account
      await accountsPage.openNewAccount('CHECKING');

      // Assert — confirmation is shown and account number is captured
      await accountsPage.expectConfirmationHeading();
      const newAccountNumber = await accountsPage.getNewAccountNumber();

      // Act — navigate to the accounts overview
      await accountsPage.goToOverview();

      // Assert — new account appears in the accounts list
      await accountsPage.expectAccountInOverviewTable(newAccountNumber);
      // Cleanup — N/A: ParaBank API does not support account deletion
    },
  );
});
