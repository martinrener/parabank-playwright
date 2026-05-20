import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ActivityPage extends BasePage {
  static readonly URL = '/parabank/activity.htm';

  constructor(
    page: Page,
    private readonly accountId: string,
  ) {
    super(page);
  }

  async goToActivity() {
    await this.goto(`${ActivityPage.URL}?id=${this.accountId}`);
  }

  getTable() {
    return this.locator('#transactionTable');
  }

  getTransactionRows() {
    return this.getTable().locator('tbody tr');
  }
}
