import { type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoanPage extends BasePage {
  static readonly URL = '/parabank/requestloan.htm';

  constructor(page: Page) {
    super(page);
  }

  async goToLoan() {
    await this.goto(LoanPage.URL);
  }

  async applyForLoan(amount: string, downPayment: string) {
    await this.locator('#amount').fill(amount);
    await this.locator('#downPayment').fill(downPayment);
    await this.getByRole('button', { name: 'Apply Now' }).click();
  }

  async expectApproved() {
    await expect(this.locator('#loanStatus')).toHaveText('Approved');
  }

  async expectDenied() {
    await expect(this.locator('#loanStatus')).toHaveText('Denied');
  }

  async getNewAccountNumber() {
    return this.getByText('Your new account number:').locator('..').getByRole('link').textContent();
  }
}
