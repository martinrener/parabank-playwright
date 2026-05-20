import { test as base, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { AccountsPage } from './AccountsPage';
import { ActivityPage } from './ActivityPage';
import { TransferPage } from './TransferPage';
import { getCustomer } from '../functions/auth';

const USERNAME = process.env.TEST_USERNAME ?? 'john';
const PASSWORD = process.env.TEST_PASSWORD ?? 'demo';

type PageObjects = {
  loginPage: LoginPage;
  accountsPage: AccountsPage;
  activityPage: ActivityPage;
  transferPage: TransferPage;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountsPage: async ({ page }, use) => {
    await use(new AccountsPage(page));
  },
  activityPage: async ({ page, request }, use) => {
    const { id } = await getCustomer(request, USERNAME, PASSWORD);
    const response = await request.get(
      `${process.env.API_BASE_URL}/customers/${id}/accounts`,
      { headers: { Accept: 'application/json' } },
    );
    const [firstAccount] = await response.json();
    await use(new ActivityPage(page, String(firstAccount.id)));
  },
  transferPage: async ({ page }, use) => {
    await use(new TransferPage(page));
  },
});

export { expect };
