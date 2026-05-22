import { type APIRequestContext, type APIResponse } from '@playwright/test';
import type { Customer, Account, Transaction } from '../types/parabank';

type FetchOptions = Parameters<APIRequestContext['fetch']>[1];

export class BaseAPI {
  private readonly baseUrl: string;

  constructor(private readonly context: APIRequestContext) {
    this.baseUrl = process.env.API_BASE_URL ?? '';
  }

  private async request(method: string, path: string, options?: FetchOptions, attempt = 0): Promise<APIResponse> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const fetchPromise = this.context.fetch(`${this.baseUrl}${path}`, {
      ...options,
      method,
      headers: { Accept: 'application/json', ...options?.headers },
      timeout: 15000,
    });

    // Promise.race gives a hard 15 s ceiling regardless of Playwright's internal timeouts
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error(`Request timed out: ${method} ${path}`)),
        15000,
      );
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]).finally(() => {
      clearTimeout(timeoutId);
    });

    if (response.status() === 429 && attempt < 3) {
      const body = await response.json().catch(() => ({}));
      // Respect server-specified wait; fall back to exponential backoff when absent
      const retryAfter = body?.retry_after ?? Math.pow(2, attempt + 1);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return this.request(method, path, options, attempt + 1);
    }

    if (!response.ok()) {
      throw new Error(`HTTP ${response.status()} ${method} ${path}: ${await response.text()}`);
    }
    return response;
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
    const response = await this.post('/createAccount', {
      params: { customerId, newAccountType: accountType, fromAccountId },
    });
    return response.json();
  }
}
