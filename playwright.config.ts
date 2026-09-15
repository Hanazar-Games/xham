import { defineConfig } from '@playwright/test'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export default defineConfig({
  testDir: './tests',
  testMatch: '*.e2e.ts',
  outputDir: join(tmpdir(), 'quizpop-playwright'),
  fullyParallel: true,
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:4175', browserName: 'chromium' },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4175 --strictPort',
    url: 'http://127.0.0.1:4175',
  },
})
