import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // GET /parabank/login.htm returns an empty page — the login form lives on the index page
  static readonly URL = '/parabank/index.htm';

  constructor(page: Page) {
    super(page);
  }

  async goToLogin() {
    await this.goto(LoginPage.URL);
  }

  async fillCredentials(username: string, password: string) {
    // ParaBank uses <b> tags as visual labels, not proper <label> elements
    await this.locator('input[name="username"]').fill(username);
    await this.locator('input[name="password"]').fill(password);
  }

  async submit() {
    await this.getByRole('button', { name: 'Log In' }).click();
  }
}
