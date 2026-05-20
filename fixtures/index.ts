import { test as base, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { AccountsPage } from './AccountsPage';
import { ActivityPage } from './ActivityPage';
import { TransferPage } from './TransferPage';
import { BaseAPI } from './BaseAPI';

const USERNAME = process.env.TEST_USERNAME ?? 'john';
const PASSWORD = process.env.TEST_PASSWORD ?? 'demo';

type MyFixtures = {
  loginPage: LoginPage;
  accountsPage: AccountsPage;
  activityPage: ActivityPage;
  transferPage: TransferPage;
  api: BaseAPI;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountsPage: async ({ page }, use) => {
    await use(new AccountsPage(page));
  },
  activityPage: async ({ page, api }, use) => {
    const { id } = await api.login(USERNAME, PASSWORD);
    const [firstAccount] = await api.getAccounts(String(id));
    await use(new ActivityPage(page, String(firstAccount.id)));
  },
  transferPage: async ({ page }, use) => {
    await use(new TransferPage(page));
  },
  api: async ({ request }, use) => {
    await use(new BaseAPI(request));
  },
});

export { expect };
