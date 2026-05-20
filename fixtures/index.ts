import { test as base, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { AccountPage } from './AccountPage';
import { ActivityPage } from './ActivityPage';
import { getCustomer } from '../functions/auth';

const USERNAME = process.env.TEST_USERNAME ?? 'john';
const PASSWORD = process.env.TEST_PASSWORD ?? 'demo';

type PageObjects = {
  loginPage: LoginPage;
  accountPage: AccountPage;
  activityPage: ActivityPage;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
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
});

export { expect };
