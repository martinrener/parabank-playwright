import { test as base, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { AccountsPage } from './AccountsPage';
import { ActivityPage } from './ActivityPage';
import { TransferPage } from './TransferPage';
import { BaseAPI } from './BaseAPI';
import { login } from '../helpers/auth';
import { getAccounts } from '../helpers/accounts';

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
    const customerId = await login(api, USERNAME, PASSWORD);
    const accounts = await getAccounts(api, customerId);
    if (accounts.length === 0) throw new Error('No accounts found for activityPage fixture');
    await use(new ActivityPage(page, String(accounts[0].id)));
  },
  transferPage: async ({ page }, use) => {
    await use(new TransferPage(page));
  },
  api: async ({ request }, use) => {
    await use(new BaseAPI(request));
  },
});

export { expect };
export { LoginPage };

export { login };
export { getAccounts, openAccount, getBalance } from '../helpers/accounts';
export { transfer, getTransactions } from '../helpers/transfers';
export { uniqueUsername, uniquePassword, buildRegistrationData, buildTransferPayload } from '../helpers/testData';
