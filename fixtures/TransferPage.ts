import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransferPage extends BasePage {
  static readonly URL = '/parabank/transfer.htm';

  async goToTransfer() {
    await this.goto(TransferPage.URL);
  }

  async transfer(fromId: string, toId: string, amount: string) {
    await this.locator('#amount').fill(amount);
    await this.locator('#fromAccountId').selectOption({ value: fromId });
    await this.locator('#toAccountId').selectOption({ value: toId });
    await this.getByRole('button', { name: 'Transfer' }).click();
  }

  async expectSuccess(amount: string, fromId: string, toId: string) {
    await expect(this.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible();
    await expect(
      this.getByText(`$${parseFloat(amount).toFixed(2)} has been transferred from account #${fromId} to account #${toId}.`)
    ).toBeVisible();
  }
}
