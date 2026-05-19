import { test, expect } from '../../fixtures';

test.describe('Accounts', () => {
  test(
    'ACC-002 > Open Account > New CHECKING account shows confirmation',
    { annotation: { type: 'id', description: 'ACC-002' } },
    async ({ accountPage, page }) => {
      await accountPage.goToOpenAccount();
      await accountPage.selectAccountType('CHECKING');
      await accountPage.selectFromAccount();
      await accountPage.submit();

      await expect(page.getByRole('heading', { name: 'Account Opened!' })).toBeVisible();
    },
  );
});
