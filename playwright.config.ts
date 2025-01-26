import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 10000,
  retries: 0,
  use: {
    headless: true,
    baseURL: 'https://automationintesting.online',
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    video: 'on',
    screenshot: 'on'
  },
  reporter: [['list'], ['html', { outputFolder: 'reports' }]]
});