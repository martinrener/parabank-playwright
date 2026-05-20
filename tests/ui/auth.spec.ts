import { test, expect } from '../../fixtures';

const USERNAME = process.env.TEST_USERNAME ?? 'john';
const PASSWORD = process.env.TEST_PASSWORD ?? 'demo';

test.describe('Auth', () => {
  test(
    'AUTH-001 > Login > Valid credentials redirects to account overview',
    { annotation: { type: 'id', description: 'AUTH-001' } },
    async ({ loginPage }) => {
      // Arrange
      await loginPage.goToLogin();

      // Act
      await loginPage.login(USERNAME, PASSWORD);

      // Assert
      await loginPage.expectOverview();
      await expect(loginPage.getByText('Welcome John Smith')).toBeVisible();
    },
  );

  test(
    'AUTH-002 > Login > Invalid credentials shows error and stays on login',
    { annotation: { type: 'id', description: 'AUTH-002' } },
    async ({ loginPage }) => {
      // Arrange
      await loginPage.goToLogin();

      // Act
      await loginPage.login('invalid_user', 'invalid_pass');

      // Assert
      await loginPage.expectLoginUrl();
      await loginPage.expectError();
    },
  );

  test(
    'AUTH-003 > Login > Unauthenticated access to overview shows customer login form',
    { annotation: { type: 'id', description: 'AUTH-003' } },
    async ({ loginPage }) => {
      // Act
      await loginPage.goToOverview();

      // Assert
      await loginPage.expectLoginForm();
    },
  );
});
