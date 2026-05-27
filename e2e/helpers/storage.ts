import type { Page } from '@playwright/test'

const BOOTSTRAP_KEY = '__e2e_bootstrapped'

export async function resetAppStorage (page: Page): Promise<void> {
  await page.addInitScript((bootstrapKey) => {
    if (sessionStorage.getItem(bootstrapKey) === '1') return
    localStorage.clear()
    sessionStorage.clear()
    sessionStorage.setItem(bootstrapKey, '1')
  }, BOOTSTRAP_KEY)
}

export async function readStorageKey (
  page: Page,
  key: string
): Promise<string | null> {
  return page.evaluate((storageKey) => localStorage.getItem(storageKey), key)
}

export async function getEggCounterText (page: Page): Promise<string> {
  const counter = page.getByRole('button', { name: /Easter egg:/i })
  return (await counter.textContent()) ?? ''
}

export function parseEggCount (text: string): number {
  const match = text.match(/(\d+)\/(\d+)/)
  return match ? Number(match[1]) : 0
}
