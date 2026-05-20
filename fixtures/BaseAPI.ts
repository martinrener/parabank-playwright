import { type APIRequestContext } from '@playwright/test';
import type { Customer, Account, Transaction } from '../types/parabank';

type FetchOptions = Parameters<APIRequestContext['fetch']>[1];

export class BaseAPI {
  private readonly baseUrl: string;

  constructor(private readonly context: APIRequestContext) {
    this.baseUrl = process.env.API_BASE_URL ?? '';
  }

  private async request(method: string, path: string, options?: FetchOptions) {
    return this.context.fetch(`${this.baseUrl}${path}`, {
      ...options,
      method,
      headers: { Accept: 'application/json', ...options?.headers },
    });
  }

  protected async get(path: string) {
    return this.request('GET', path);
  }

  protected async post(path: string, options?: FetchOptions) {
    return this.request('POST', path, options);
  }

  async login(username: string, password: string): Promise<Customer> {
    const response = await this.get(`/login/${username}/${password}`);
    return response.json();
  }

  async getAccounts(customerId: string): Promise<Account[]> {
    const response = await this.get(`/customers/${customerId}/accounts`);
    return response.json();
  }

  async getAccount(accountId: string): Promise<Account> {
    const response = await this.get(`/accounts/${accountId}`);
    return response.json();
  }

  async getTransactions(accountId: string): Promise<Transaction[]> {
    const response = await this.get(`/accounts/${accountId}/transactions`);
    return response.json();
  }

  async transfer(fromAccountId: string, toAccountId: string, amount: number): Promise<void> {
    await this.post('/transfer', { params: { fromAccountId, toAccountId, amount } });
  }

  async createAccount(customerId: string, accountType: string, fromAccountId: string): Promise<Account> {
    const response = await this.post(`/customers/${customerId}/createAccount`, {
      params: { accountType, fromAccountId },
    });
    return response.json();
  }
}
