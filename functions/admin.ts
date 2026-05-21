import { type APIRequestContext } from '@playwright/test';
import { getEnvVar } from './common'

const URL = getEnvVar('BASE_URL')

export async function initializeDatabase(request: APIRequestContext) {
  await request.post(`${URL}/parabank/admin.htm`, {
    form: { action: 'INIT' },
  });
}
