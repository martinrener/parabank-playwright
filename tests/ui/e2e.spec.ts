import { test, expect } from '../../fixtures';

test.describe('E2E', () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  test(
    'E2E-001 > E2E > open checking account, verify in overview, transfer 100 to first account, verify transfer complete',
    { annotation: { type: 'id', description: 'E2E-001' } },
    async ({ accountsPage, transferPage, activityPage }) => {
      // Arrange — capture first account ID before opening the new one
      await activityPage.goToActivity();
      const firstAccountId = new URL(activityPage.page.url()).searchParams.get('id')!;

      // Act — open a new CHECKING account and get its number
      await accountsPage.openNewAccount('CHECKING');
      const newAccountId = await accountsPage.getNewAccountNumber();

      // Assert — new account appears in overview table
      await accountsPage.goToOverview();
      await accountsPage.expectAccountInOverviewTable(newAccountId);

      // Act — transfer 100 from new account to first account
      await transferPage.goToTransfer();
      await transferPage.transfer(newAccountId, firstAccountId, '100');

      // Assert — transfer complete confirms both balances updated
      await transferPage.expectSuccess('100', newAccountId, firstAccountId);
      // Cleanup — N/A: ParaBank API has no delete endpoint; DB reset via beforeAll handles isolation
    },
  );

  test(
    'E2E-002 > E2E > pay bill, assert payment complete, navigate to account activity, assert transaction visible',
    { annotation: { type: 'id', description: 'E2E-002' } },
    async ({ billPage, activityPage }) => {
      // Arrange
      await billPage.goToBillPay();

      // Act
      await billPage.payBill('E2E Payee', '50');

      // Assert — payment confirmed
      await billPage.expectPaymentComplete();

      // Assert — at least one transaction row is visible in account activity
      await activityPage.goToActivity();
      await expect(activityPage.getTransactionRows().first()).toBeVisible();
      // Cleanup — N/A: ParaBank API has no delete endpoint; DB reset via beforeAll handles isolation
    },
  );

  test(
    'E2E-003 > E2E > apply for loan, assert approved, navigate to overview, assert new account number in table',
    { annotation: { type: 'id', description: 'E2E-003' } },
    async ({ loanPage, accountsPage }) => {
      // Arrange
      await loanPage.goToLoan();

      // Act
      await loanPage.applyForLoan('1000', '100');

      // Assert — loan is approved and new account created
      await loanPage.expectApproved();
      const newAccountNumber = await loanPage.getNewAccountNumber();

      // Assert — new account number appears in the overview table
      await accountsPage.goToOverview();
      await accountsPage.expectAccountInOverviewTable(newAccountNumber!);
      // Cleanup — N/A: ParaBank API has no delete endpoint; DB reset via beforeAll handles isolation
    },
  );
});
