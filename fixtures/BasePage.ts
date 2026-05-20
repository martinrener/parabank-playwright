import { type Page } from '@playwright/test';

export class BasePage {
  static readonly OVERVIEW_URL = '/parabank/overview.htm';
  static readonly LOGOUT_URL = '/parabank/logout.htm';

  constructor(protected readonly page: Page) {}

  async goToOverview() {
    await this.page.goto(BasePage.OVERVIEW_URL);
  }

  async logout() {
    await this.page.goto(BasePage.LOGOUT_URL);
  }

  async navigateHome() {
    await this.page.getByRole('link', { name: 'home' }).click();
  }

  async navigateAbout() {
    await this.page.getByRole('link', { name: 'About Us' }).click();
  }

  async navigateContact() {
    await this.page.getByRole('link', { name: 'Contact' }).click();
  }

  async navigateAdmin() {
    await this.page.getByRole('link', { name: 'Admin Page' }).click();
  }
}
