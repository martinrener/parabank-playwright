import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  static readonly URL = '/parabank/login.htm';
  static readonly OVERVIEW_URL = '/parabank/overview.htm';

  constructor(page: Page) {
    super(page);
  }

  async goToLogin() {
    await this.page.goto(LoginPage.URL);
  }

  async goToOverview() {
    await this.page.goto(LoginPage.OVERVIEW_URL);
  }

  async fillCredentials(username: string, password: string) {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Log In' }).click();
  }
}
