import type { BaseAPI } from '../fixtures/BaseAPI';
import type { Transaction } from '../types/parabank';

export async function transfer(api: BaseAPI, fromId: string, toId: string, amount: number): Promise<void> {
  await api.transfer(fromId, toId, amount);
}

export async function getTransactions(api: BaseAPI, accountId: string): Promise<Transaction[]> {
  return api.getTransactions(accountId);
}
