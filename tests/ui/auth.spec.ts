import { test } from '../../fixtures';
import { getEnvVar } from '../../functions/common'

const USERNAME = getEnvVar('TEST_USERNAME')
const PASSWORD = getEnvVar('TEST_PASSWORD')

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
      await loginPage.expectWelcome();
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
      // Arrange — N/A: no setup required

      // Act
      await loginPage.goToOverview();

      // Assert
      await loginPage.expectLoginForm();
    },
  );
});
