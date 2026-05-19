import { test as base, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { AccountPage } from './AccountPage';

type PageObjects = {
  loginPage: LoginPage;
  accountPage: AccountPage;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
});

export { expect };
