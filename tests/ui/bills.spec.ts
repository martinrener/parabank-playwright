import { test } from '../../fixtures';

test.describe('Bills', () => {
  test(
    'BILL-001 > Bills > pay bill with valid payee and amount, payment complete heading is visible',
    { annotation: { type: 'id', description: 'BILL-001' } },
    async ({ billPage }) => {
      // Arrange
      await billPage.goToBillPay();

      // Act
      await billPage.payBill('Test Payee', '100');

      // Assert
      await billPage.expectPaymentComplete();
    },
  );

  test(
    'BILL-002 > Bills > submit bill pay without payee name, validation error is visible',
    { annotation: { type: 'id', description: 'BILL-002' } },
    async ({ billPage }) => {
      // Arrange
      await billPage.goToBillPay();

      // Act
      await billPage.getByRole('button', { name: 'Send Payment' }).click();

      // Assert
      await billPage.expectValidationError();
    },
  );
});
