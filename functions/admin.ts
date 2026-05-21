import { type APIRequestContext } from '@playwright/test';
import { getEnvVar } from './common'

const API_BASE_URL = getEnvVar('API_BASE_URL')

export async function initializeDatabase(request: APIRequestContext) {
  await request.post(`${API_BASE_URL}/initializeDB`);
}
