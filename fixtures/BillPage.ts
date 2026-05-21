import { type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BillPage extends BasePage {
  static readonly URL = '/parabank/billpay.htm';

  constructor(page: Page) {
    super(page);
  }

  async goToBillPay() {
    await this.goto(BillPage.URL);
  }

  async payBill(payeeName: string, amount: string) {
    await this.locator('[name="payee.name"]').fill(payeeName);
    await this.locator('[name="payee.address.street"]').fill('123 Main St');
    await this.locator('[name="payee.address.city"]').fill('Boston');
    await this.locator('[name="payee.address.state"]').fill('MA');
    await this.locator('[name="payee.address.zipCode"]').fill('12345');
    await this.locator('[name="payee.phoneNumber"]').fill('555-1234');
    await this.locator('[name="payee.accountNumber"]').fill('12345');
    await this.locator('[name="verifyAccount"]').fill('12345');
    await this.locator('[name="amount"]').fill(amount);
    await this.getByRole('button', { name: 'Send Payment' }).click();
  }

  async expectPaymentComplete() {
    await expect(this.getByRole('heading', { name: 'Bill Payment Complete' })).toBeVisible();
  }

  async submitEmpty() {
    await this.getByRole('button', { name: 'Send Payment' }).click();
  }

  async expectValidationError() {
    await expect(this.locator('.error').first()).toBeVisible();
  }
}
