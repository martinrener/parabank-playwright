import { test, expect, login, getAccounts, transfer, getBalance } from '../../fixtures';
import { openAccount } from '../../helpers/accounts';
import { getEnvVar } from '../../functions/common'

const USERNAME = getEnvVar('TEST_USERNAME')
const PASSWORD = getEnvVar('TEST_PASSWORD')
const CHECKING_ACCOUNT = '0'

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

  test(
    'ACC-003 > Accounts > transfer funds between accounts, both balances updated correctly',
    { annotation: { type: 'id', description: 'ACC-003' } },
    async ({ api }) => {
      // Arrange — create isolated accounts so parallel tests don't interfere
      const customerId = await login(api, USERNAME, PASSWORD);
      const accounts = await getAccounts(api, customerId);
      const seedId = String(accounts[0].id);
      const sourceId = await openAccount(api, customerId, CHECKING_ACCOUNT, seedId);
      const destId = await openAccount(api, customerId, CHECKING_ACCOUNT, seedId);
      const oldBalanceSource = await getBalance(api, sourceId);
      const oldBalanceDest = await getBalance(api, destId);
      const amount = 100;

      // Act
      await transfer(api, sourceId, destId, amount);

      // Assert
      expect(await getBalance(api, sourceId)).toBe(oldBalanceSource - amount);
      expect(await getBalance(api, destId)).toBe(oldBalanceDest + amount);
    },
  );

  test(
    'ACC-004 > Accounts > transfer funds exceed balance, ParaBank accepts overdraft',
    { annotation: { type: 'id', description: 'ACC-004' } },
    async ({ api }) => {
      // Arrange — create isolated accounts so parallel tests don't interfere
      const customerId = await login(api, USERNAME, PASSWORD);
      const accounts = await getAccounts(api, customerId);
      const seedId = String(accounts[0].id);
      const sourceId = await openAccount(api, customerId, CHECKING_ACCOUNT, seedId);
      const destId = await openAccount(api, customerId, CHECKING_ACCOUNT, seedId);
      const oldBalanceSource = await getBalance(api, sourceId);
      const oldBalanceDest = await getBalance(api, destId);
      const amount = oldBalanceSource + 100; // intentionally exceeds balance

      // Act — ParaBank does not enforce balance limits; overdraft is accepted
      await transfer(api, sourceId, destId, amount);

      // Assert
      expect(await getBalance(api, sourceId)).toBe(oldBalanceSource - amount);
      expect(await getBalance(api, destId)).toBe(oldBalanceDest + amount);
    },
  );
});
