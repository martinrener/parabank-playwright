import { type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountsPage extends BasePage {
  static readonly URL = '/parabank/openaccount.htm';

  constructor(page: Page) {
    super(page);
  }

  async openNewAccount(type: string, fromId?: string) {
    await this.interceptAccountsProxy();
    await this.navigateToOpenAccountForm();
    await this.selectAccountType(type);
    await this.selectFromAccount(fromId);
    await this.submitOpenAccountForm();
  }

  private async interceptAccountsProxy() {
    // The page calls services_proxy which returns [] for accounts — the direct services
    // endpoint returns the correct data, so intercept and re-issue against it
    await this.route('**/services_proxy/bank/customers/*/accounts*', async (route) => {
      const fixedUrl = route.request().url().replace('services_proxy', 'services');
      const response = await this.request.get(fixedUrl, {
        headers: { Accept: 'application/json' },
      });
      await route.fulfill({
        status: response.status(),
        contentType: 'application/json',
        body: await response.body(),
      });
    });
  }

  private async navigateToOpenAccountForm() {
    await this.goToOverview();
    await this.getByRole('link', { name: 'Open New Account' }).click();
  }

  private async selectAccountType(type: string) {
    // Option values are '0' (CHECKING) and '1' (SAVINGS) — select by visible label
    await this.locator('#type').selectOption({ label: type });
  }

  private async selectFromAccount(fromId?: string) {
    // Poll until #fromAccountId has options (populated by the intercepted AJAX call above)
    await this.waitForFunction(
      () => document.querySelector<HTMLSelectElement>('#fromAccountId')!.options.length > 0,
    );
    await this.locator('#fromAccountId').selectOption(
      fromId ? { value: fromId } : { index: 0 },
    );
  }

  private async submitOpenAccountForm() {
    await this.getByRole('button', { name: 'Open New Account' }).click();
  }

  confirmationHeading() {
    return this.getByRole('heading', { name: 'Account Opened!' });
  }

  async getNewAccountNumber() {
    return (await this.locator('#openAccountResult a').first().textContent())!.trim();
  }

  async expectAccountList() {
    await expect(this.locator('#accountTable')).toBeVisible();
  }

  async clickAccount(id: string) {
    const link = await this.accountInOverviewTable(id);
    await link.click();
  }

  async clickFirstAccount() {
    await this.locator('#accountTable tbody').getByRole('link').first().click();
  }

  firstAccountLink() {
    return this.locator('#accountTable tbody').getByRole('link').first();
  }

  async accountInOverviewTable(accountNumber: string) {
    const headers = this.locator('#accountTable th');
    const count = await headers.count();
    for (let i = 0; i < count; i++) {
      if ((await headers.nth(i).textContent())?.trim() === 'Account') {
        return this.locator(`#accountTable tbody tr td:nth-child(${i + 1})`)
          .getByRole('link', { name: accountNumber, exact: true });
      }
    }
    throw new Error('Account column not found in accounts table');
  }
}
