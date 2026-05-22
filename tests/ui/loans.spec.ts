import { test } from '../../fixtures';

test.describe('Loans', () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  test(
    'LOAN-001 > Loans > apply with valid amount and down payment, loan is approved',
    { annotation: { type: 'id', description: 'LOAN-001' } },
    async ({ loanPage }) => {
      // Arrange
      await loanPage.goToLoan();

      // Act
      await loanPage.applyForLoan('100', '90');

      // Assert
      await loanPage.expectApproved();
      // Cleanup — N/A: ParaBank API has no delete endpoint; DB reset via beforeAll handles isolation
    },
  );

  test(
    'LOAN-002 > Loans > apply with excessive amount and no down payment, loan is denied',
    { annotation: { type: 'id', description: 'LOAN-002' } },
    async ({ loanPage }) => {
      // Arrange
      await loanPage.goToLoan();

      // Act
      await loanPage.applyForLoan('100000', '0');

      // Assert
      await loanPage.expectDenied();
      // Cleanup — N/A: ParaBank API has no delete endpoint; DB reset via beforeAll handles isolation
    },
  );
});
