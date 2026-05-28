import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Automatically start both servers before running tests.
  // Playwright will wait until each URL responds before launching tests.
  webServer: [
    {
      command: 'pnpm --filter @color-bet/backend dev',
      url: 'http://localhost:3001/health',
      reuseExistingServer: true, // if already running, don't start a second one
      timeout: 15_000,
    },
    {
      command: 'pnpm --filter @color-bet/frontend dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 15_000,
    },
  ],
});
