import { type APIRequestContext } from '@playwright/test';
import { BaseAPI } from '../fixtures/BaseAPI';
import { login } from '../helpers/auth';

export async function getCustomer(
  request: APIRequestContext,
  username: string,
  password: string,
): Promise<string> {
  return login(new BaseAPI(request), username, password);
}
