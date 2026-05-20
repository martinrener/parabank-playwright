import { type APIRequestContext } from '@playwright/test';
import { BaseAPI } from '../fixtures/BaseAPI';
import type { Customer } from '../types/parabank';

export type { Customer };

export async function getCustomer(
  request: APIRequestContext,
  username: string,
  password: string,
): Promise<Customer> {
  return new BaseAPI(request).login(username, password);
}
