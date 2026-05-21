import { test, expect, login, getAccounts, transfer, getBalance } from '../../fixtures';
import { openAccount } from '../../helpers/accounts';
import { getEnvVar } from '../../functions/common';

const USERNAME = getEnvVar('TEST_USERNAME');
const PASSWORD = getEnvVar('TEST_PASSWORD');
const CHECKING_ACCOUNT = '0';
const SAVINGS_ACCOUNT = '1';

test.describe('Accounts API', () => {
  test.describe.configure({ mode: 'parallel' });

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
      // Arrange — each test creates its own isolated accounts
      const customerId = await login(api, USERNAME, PASSWORD);
      const accounts = await getAccounts(api, customerId);
      const seedId = String(accounts.reduce((best, a) => a.balance > best.balance ? a : best).id);
      const sourceId = await openAccount(api, customerId, CHECKING_ACCOUNT, seedId);
      const destId = await openAccount(api, customerId, CHECKING_ACCOUNT, seedId);
      const oldBalanceSource = await getBalance(api, sourceId);
      const oldBalanceDest = await getBalance(api, destId);
      const amount = 100;

      // Act
      await transfer(api, sourceId, destId, amount);

      try {
        // Assert
        expect(await getBalance(api, sourceId)).toBe(oldBalanceSource - amount);
        expect(await getBalance(api, destId)).toBe(oldBalanceDest + amount);
      } finally {
        // Cleanup: reverse the transfer so accounts stay in a neutral state
        await transfer(api, destId, sourceId, amount);
      }
    },
  );

  test(
    'ACC-004 > Accounts > transfer funds exceed balance, ParaBank accepts overdraft',
    { annotation: { type: 'id', description: 'ACC-004' } },
    async ({ api }) => {
      // Arrange — each test creates its own isolated accounts
      const customerId = await login(api, USERNAME, PASSWORD);
      const accounts = await getAccounts(api, customerId);
      const seedId = String(accounts.reduce((best, a) => a.balance > best.balance ? a : best).id);
      const sourceId = await openAccount(api, customerId, CHECKING_ACCOUNT, seedId);
      const destId = await openAccount(api, customerId, CHECKING_ACCOUNT, seedId);
      const oldBalanceSource = await getBalance(api, sourceId);
      const oldBalanceDest = await getBalance(api, destId);
      const amount = oldBalanceSource + 100; // intentionally exceeds balance

      // Act — ParaBank does not enforce balance limits; overdraft is accepted
      await transfer(api, sourceId, destId, amount);

      try {
        // Assert
        expect(await getBalance(api, sourceId)).toBe(oldBalanceSource - amount);
        expect(await getBalance(api, destId)).toBe(oldBalanceDest + amount);
      } finally {
        // Cleanup: reverse the transfer
        await transfer(api, destId, sourceId, amount);
      }
    },
  );

  test(
    'ACC-005 > Accounts > open new savings account, it shows correctly',
    { annotation: { type: 'id', description: 'ACC-005' } },
    async ({ api }) => {
      // Arrange
      const customerId = await login(api, USERNAME, PASSWORD);
      const accounts = await getAccounts(api, customerId);
      const seedId = String(accounts.reduce((best, a) => a.balance > best.balance ? a : best).id);

      // Act
      const newId = Number(await openAccount(api, customerId, SAVINGS_ACCOUNT, seedId));

      // Assert
      const allAccounts = await getAccounts(api, customerId);
      const newAccount = allAccounts.find(a => a.id === newId);
      expect(newAccount?.type).toBe('SAVINGS');
    },
  );

  test(
    'ACC-006 > Accounts > transfer negative funds, direction is reversed',
    { annotation: { type: 'id', description: 'ACC-006' } },
    async ({ api }) => {
      // Arrange — each test creates its own isolated accounts
      const customerId = await login(api, USERNAME, PASSWORD);
      const accounts = await getAccounts(api, customerId);
      const seedId = String(accounts.reduce((best, a) => a.balance > best.balance ? a : best).id);
      const sourceId = await openAccount(api, customerId, CHECKING_ACCOUNT, seedId);
      const destId = await openAccount(api, customerId, CHECKING_ACCOUNT, seedId);
      const oldBalanceSource = await getBalance(api, sourceId);
      const oldBalanceDest = await getBalance(api, destId);
      const amount = -50; // negative amount: source gains, dest loses

      // Act
      await transfer(api, sourceId, destId, amount);

      try {
        // Assert — ParaBank accepts negative amounts; source gains 50, dest loses 50
        expect(await getBalance(api, sourceId)).toBe(oldBalanceSource - amount);
        expect(await getBalance(api, destId)).toBe(oldBalanceDest + amount);
      } finally {
        // Cleanup: transfer(dest, source, amount) undoes transfer(source, dest, amount) for any amount
        await transfer(api, destId, sourceId, amount);
      }
    },
  );
});
