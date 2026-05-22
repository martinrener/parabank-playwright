import { test, expect, login, getAccounts, transfer, getBalance, getTransactions } from '../../fixtures';
import { openAccount } from '../../helpers/accounts';
import { getEnvVar } from '../../functions/common';

const USERNAME = getEnvVar('TEST_USERNAME');
const PASSWORD = getEnvVar('TEST_PASSWORD');
const CHECKING_ACCOUNT = '0';
const SAVINGS_ACCOUNT = '1';

test.describe('Accounts API', () => {
  // API tests run serially: ParaBank has no delete endpoints, parallel runs cause account state conflicts.
  test.describe.configure({ mode: 'serial' });
  // Generous timeout: serial chain of account creation + transfer ops can be slow on ParaBank's shared server
  test.setTimeout(60000);

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

      // Assert
      expect(await getBalance(api, sourceId)).toBe(oldBalanceSource - amount);
      expect(await getBalance(api, destId)).toBe(oldBalanceDest + amount);
      // Cleanup — N/A: ParaBank API has no delete endpoint; DB reset via beforeAll handles isolation
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

      // Assert
      expect(await getBalance(api, sourceId)).toBe(oldBalanceSource - amount);
      expect(await getBalance(api, destId)).toBe(oldBalanceDest + amount);
      // Cleanup — N/A: ParaBank API has no delete endpoint; DB reset via beforeAll handles isolation
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

      // Assert — ParaBank accepts negative amounts; source gains 50, dest loses 50
      expect(await getBalance(api, sourceId)).toBe(oldBalanceSource - amount);
      expect(await getBalance(api, destId)).toBe(oldBalanceDest + amount);
      // Cleanup — N/A: ParaBank API has no delete endpoint; DB reset via beforeAll handles isolation
    },
  );

});

test.describe('Transactions API', () => {
  test(
    'TRN-004 > Transactions > first transaction matches Transaction interface shape',
    { annotation: { type: 'id', description: 'TRN-004' } },
    async ({ api }) => {
      // Arrange
      const customerId = await login(api, USERNAME, PASSWORD);
      const accounts = await getAccounts(api, customerId);

      // Act
      const transactions = await getTransactions(api, String(accounts[0].id));

      // Assert
      const tx = transactions[0];
      expect(typeof tx.id).toBe('number');
      expect(typeof tx.accountId).toBe('number');
      expect(typeof tx.type).toBe('string');
      expect(typeof tx.date).toBe('number');
      expect(typeof tx.amount).toBe('number');
      expect(typeof tx.description).toBe('string');
    },
  );
});
