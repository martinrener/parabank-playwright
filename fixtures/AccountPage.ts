import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  static readonly URL = '/parabank/openaccount.htm';

  constructor(page: Page) {
    super(page);
  }

  async goToOpenAccount() {
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

    await this.goToOverview();
    await this.getByRole('link', { name: 'Open New Account' }).click();
  }

  async selectAccountType(type: string) {
    // Option values are '0' (CHECKING) and '1' (SAVINGS) — select by visible label
    await this.locator('#type').selectOption({ label: type });
  }

  async selectFromAccount() {
    // Poll until #fromAccountId has options (populated by the intercepted AJAX call above)
    await this.waitForFunction(
      () => document.querySelector<HTMLSelectElement>('#fromAccountId')!.options.length > 0,
    );
    await this.locator('#fromAccountId').selectOption({ index: 0 });
  }

  async submit() {
    await this.getByRole('button', { name: 'Open New Account' }).click();
  }

  confirmationHeading() {
    return this.getByRole('heading', { name: 'Account Opened!' });
  }

  async getNewAccountNumber() {
    return (await this.locator('#openAccountResult a').first().textContent())!.trim();
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
