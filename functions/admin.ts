import { type APIRequestContext } from '@playwright/test';

export async function initializeDatabase(request: APIRequestContext) {
  await request.post(`${process.env.BASE_URL}/parabank/admin.htm`, {
    form: { action: 'INIT' },
  });
}
