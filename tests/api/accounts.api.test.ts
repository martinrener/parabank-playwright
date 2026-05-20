import { test, expect } from '../../fixtures';

const USERNAME = process.env.TEST_USERNAME ?? 'john';
const PASSWORD = process.env.TEST_PASSWORD ?? 'demo';

test.describe('Accounts API', () => {
  test(
    'ACC-001 > Accounts > Customer accounts list returns at least one account',
    { annotation: { type: 'id', description: 'ACC-001' } },
    async ({ api }) => {
      // Arrange
      const { id } = await api.login(USERNAME, PASSWORD);

      // Act
      const accounts = await api.getAccounts(String(id));

      // Assert
      expect(accounts.length).toBeGreaterThan(0);
    },
  );
});
