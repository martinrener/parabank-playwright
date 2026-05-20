import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // GET /parabank/login.htm returns an empty page — the login form lives on the index page
  static readonly URL = '/parabank/index.htm';

  async goToLogin() {
    await this.goto(LoginPage.URL);
  }

  async login(username: string, password: string) {
    // ParaBank uses <b> tags as visual labels, not proper <label> elements
    await this.locator('input[name="username"]').fill(username);
    await this.locator('input[name="password"]').fill(password);
    await this.getByRole('button', { name: 'Log In' }).click();
  }

  async expectOverview() {
    await expect(this.page).toHaveURL(/\/overview\.htm/);
  }

  async expectLoginUrl() {
    await expect(this.page).toHaveURL(/\/parabank\/login\.htm/);
  }

  async expectLoginForm() {
    await expect(this.locator('input[name="username"]')).toBeVisible();
  }

  async expectError() {
    await expect(
      this.getByText('The username and password could not be verified.'),
    ).toBeVisible();
  }
}
