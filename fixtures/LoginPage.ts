import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // GET /parabank/login.htm returns an empty page — the login form lives on the index page
  static readonly URL = '/parabank/index.htm';
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
    // ParaBank uses <b> tags as visual labels, not proper <label> elements
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Log In' }).click();
  }
}
