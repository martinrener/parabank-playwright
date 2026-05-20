import { test, expect } from '../../fixtures';

const USERNAME = process.env.TEST_USERNAME ?? 'john';
const PASSWORD = process.env.TEST_PASSWORD ?? 'demo';

test.describe('Auth', () => {
  test(
    'AUTH-001 > Login > Valid credentials redirects to account overview',
    { annotation: { type: 'id', description: 'AUTH-001' } },
    async ({ loginPage, page }) => {
      // Arrange
      await loginPage.goToLogin();
      await loginPage.fillCredentials(USERNAME, PASSWORD);

      // Act
      await loginPage.submit();

      // Assert
      await expect(page).toHaveURL(/\/parabank\/overview\.htm/);
      await expect(page.getByText('Welcome John Smith')).toBeVisible();
    },
  );

  test(
    'AUTH-002 > Login > Invalid credentials shows error and stays on login',
    { annotation: { type: 'id', description: 'AUTH-002' } },
    async ({ loginPage, page }) => {
      // Arrange
      await loginPage.goToLogin();
      await loginPage.fillCredentials('invalid_user', 'invalid_pass');

      // Act
      await loginPage.submit();

      // Assert
      await expect(page).toHaveURL(/\/parabank\/login\.htm/);
      await expect(
        page.getByText('The username and password could not be verified.'),
      ).toBeVisible();
    },
  );

  test(
    'AUTH-003 > Login > Unauthenticated access to overview shows customer login form',
    { annotation: { type: 'id', description: 'AUTH-003' } },
    async ({ loginPage, page }) => {
      // Act
      await loginPage.goToOverview();

      // Assert
      // ParaBank does not redirect to /login.htm — it renders the page in a
      // logged-out state with the customer login form visible in the sidebar
      await expect(page.locator('input[name="username"]')).toBeVisible();
    },
  );
});
