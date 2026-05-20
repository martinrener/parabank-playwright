import { test, expect, login, getAccounts } from '../../fixtures';

const USERNAME = process.env.TEST_USERNAME ?? 'john';
const PASSWORD = process.env.TEST_PASSWORD ?? 'demo';

test.describe('Accounts API', () => {
  test(
    'ACC-001 > Accounts > Customer accounts list returns at least one account',
    { annotation: { type: 'id', description: 'ACC-001' } },
    async ({ api }) => {
      // Arrange
      const customerId = await login(api, USERNAME, PASSWORD);

      // Act
      const accounts = await getAccounts(api, customerId);

      // Assert
      expect(accounts.length).toBeGreaterThan(0);
    },
  );
});
