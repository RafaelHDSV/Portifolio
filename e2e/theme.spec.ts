import { expect, test } from '@playwright/test'
import { readStorageKey, resetAppStorage } from './helpers/storage'

test.describe('Toggle de tema', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
    await page.goto('/?lang=pt')
  })

  test('persiste preferencia apos reload', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: 'Mudar para tema claro' })
    await themeButton.click()

    await expect.poll(async () => readStorageKey(page, 'theme')).toBe('light')
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await page.reload()

    await expect.poll(async () => readStorageKey(page, 'theme')).toBe('light')
    await expect(page.getByRole('button', { name: 'Mudar para tema escuro' })).toBeVisible()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })
})
