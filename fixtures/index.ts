import { test as base, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

type PageObjects = {
  loginPage: LoginPage;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect };
