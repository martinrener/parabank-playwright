import type { BaseAPI } from '../fixtures/BaseAPI';
import type { Account } from '../types/parabank';

export async function getAccounts(api: BaseAPI, customerId: string): Promise<Account[]> {
  return api.getAccounts(customerId);
}

export async function openAccount(api: BaseAPI, customerId: string, type: string, fromId: string): Promise<string> {
  const account = await api.createAccount(customerId, type, fromId);
  return String(account.id);
}

export async function getBalance(api: BaseAPI, accountId: string): Promise<number> {
  const account = await api.getAccount(accountId);
  return account.balance;
}
