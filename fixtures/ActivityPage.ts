import { type Page, expect } from '@playwright/test';
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

  getDateCells() {
    return this.getTransactionRows().locator('td:nth-child(1)');
  }

  getDebitCells() {
    return this.getTransactionRows().locator('td:nth-child(3)');
  }

  getCreditCells() {
    return this.getTransactionRows().locator('td:nth-child(4)');
  }

  async filterActivity(period: string, type: string) {
    // ParaBank activity filter uses ID attributes without <label> elements — role/label selectors unavailable
    await this.locator('#month').selectOption(period);
    await this.selectOption('#transactionType', type);
    await this.getByRole('button', { name: 'Go' }).click();
  }

  async expectActivityUrl() {
    await expect(this.page).toHaveURL(/activity\.htm/);
  }
}
