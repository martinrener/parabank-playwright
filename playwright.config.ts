import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const authFile = '.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
      ['./reporter/reporter.ts'],
      ['html'],
      ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com',
    trace: 'on-first-retry',
  },

  projects: [
    // --- Auth lifecycle ---
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'teardown',
      testMatch: /auth\.teardown\.ts/,
      use: { storageState: authFile },
    },

    // --- Authenticated UI tests (all ui specs except auth) ---
    {
      name: 'chromium',
      dependencies: ['setup'],
      teardown: 'teardown',
      use: { ...devices['Desktop Chrome'], storageState: authFile },
      testMatch: /ui\/.*\.spec\.ts$/,
      testIgnore: /auth\.spec\.ts$/,
    },

    // --- Auth-specific UI tests (no stored session) ---
    {
      name: 'auth',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /auth\.spec\.ts$/,
    },

    // --- API setup: resets DB once before any api test runs ---
    {
      name: 'db-setup',
      testMatch: /db\.setup\.ts$/,
    },

    // --- API tests (no browser) ---
    {
      name: 'api',
      dependencies: ['db-setup'],
      testMatch: /\.api\.test\.ts$/,
    },
  ],
});
