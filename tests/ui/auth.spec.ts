import { test, expect } from '../../fixtures';

const USERNAME = process.env.TEST_USERNAME ?? 'john';
const PASSWORD = process.env.TEST_PASSWORD ?? 'demo';

test.describe('Auth', () => {
  test(
    'AUTH-001 > Login > Valid credentials redirects to account overview',
    { annotation: { type: 'id', description: 'AUTH-001' } },
    async ({ loginPage, page }) => {
      await loginPage.goToLogin();
      await loginPage.fillCredentials(USERNAME, PASSWORD);
      await loginPage.submit();

      await expect(page).toHaveURL(/\/parabank\/overview\.htm/);
      await expect(page.getByText('Welcome John Smith')).toBeVisible();
    },
  );

  test(
    'AUTH-002 > Login > Invalid credentials shows error and stays on login',
    { annotation: { type: 'id', description: 'AUTH-002' } },
    async ({ loginPage, page }) => {
      await loginPage.goToLogin();
      await loginPage.fillCredentials('invalid_user', 'invalid_pass');
      await loginPage.submit();

      await expect(page).toHaveURL(/\/parabank\/login\.htm/);
      await expect(
        page.getByText('The username and password could not be verified.'),
      ).toBeVisible();
    },
  );

  test(
    'AUTH-003 > Login > Unauthenticated access to overview redirects to login',
    { annotation: { type: 'id', description: 'AUTH-003' } },
    async ({ loginPage, page }) => {
      await loginPage.goToOverview();

      await expect(page).toHaveURL(/\/parabank\/login\.htm/);
    },
  );
});
