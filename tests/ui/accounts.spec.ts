import { test, expect } from '../../fixtures';

test.describe('Accounts', () => {
  test(
    'ACC-002 > Open Account > New CHECKING account shows confirmation',
    { annotation: { type: 'id', description: 'ACC-002' } },
    async ({ accountPage }) => {
      await accountPage.goToOpenAccount();
      await accountPage.selectAccountType('CHECKING');
      await accountPage.selectFromAccount();
      await accountPage.submit();

      await expect(accountPage.confirmationHeading()).toBeVisible();

      const newAccountNumber = await accountPage.getNewAccountNumber();

      await accountPage.goToOverview();

      await expect(await accountPage.accountInOverviewTable(newAccountNumber)).toBeVisible();
    },
  );
});
