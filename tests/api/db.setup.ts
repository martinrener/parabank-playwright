import { test } from '@playwright/test';
import { initializeDatabase } from '../../functions/admin';

test('Initialize database', async ({ request }) => {
  await initializeDatabase(request);
});
