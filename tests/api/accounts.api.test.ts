import { test, expect } from '../../fixtures';
import { getCustomer } from '../../functions/auth';

const USERNAME = process.env.TEST_USERNAME ?? 'john';
const PASSWORD = process.env.TEST_PASSWORD ?? 'demo';

test.describe('Accounts API', () => {
  test(
    'ACC-001 > Accounts > Customer accounts list returns at least one account',
    { annotation: { type: 'id', description: 'ACC-001' } },
    async ({ request }) => {
      // Arrange
      const { id } = await getCustomer(request, USERNAME, PASSWORD);

      // Act
      const response = await request.get(
        `${process.env.API_BASE_URL}/customers/${id}/accounts`,
        { headers: { Accept: 'application/json' } },
      );

      // Assert
      expect(response.ok()).toBeTruthy();
      const accounts = await response.json();
      expect(accounts.length).toBeGreaterThan(0);
    },
  );
});
