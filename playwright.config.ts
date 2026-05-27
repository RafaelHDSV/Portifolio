import { defineConfig, devices } from '@playwright/test'

const previewPort = 4173
const previewHost = '127.0.0.1'
const baseURL = `http://${previewHost}:${previewPort}`

const e2eEnv = {
  VITE_EMAILJS_SERVICE_ID: 'e2e_service',
  VITE_EMAILJS_TEMPLATE_ID: 'e2e_template',
  VITE_EMAILJS_PUBLIC_KEY: 'e2e_public_key'
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    locale: 'pt-BR',
    viewport: { width: 1280, height: 720 }
  },
  webServer: {
    command: `yarn build && yarn preview --host ${previewHost} --port ${previewPort}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      ...process.env,
      ...e2eEnv
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
