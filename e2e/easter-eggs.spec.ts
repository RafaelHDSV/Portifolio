import { expect, test } from '@playwright/test'
import { setupGitHubMocks } from './helpers/githubMocks'
import {
  getEggCounterText,
  parseEggCount,
  resetAppStorage
} from './helpers/storage'

async function readUnlockedEggs (page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('eggs-unlocked') ?? '[]') as string[]
    } catch {
      return []
    }
  })
}

test.describe('Easter eggs basicos', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
  })

  test('vieira-mode desbloqueia via query param', async ({ page }) => {
    await page.goto('/?lang=pt&mode=vieira')

    await expect.poll(async () => readUnlockedEggs(page)).toContain('vieira-mode')

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const counterText = await getEggCounterText(page)
    expect(parseEggCount(counterText)).toBeGreaterThanOrEqual(1)
  })

  test('theme-hunter desbloqueia apos 5 toggles de tema', async ({ page }) => {
    await page.goto('/?lang=pt')

    const themeButton = page.getByRole('button', { name: /Mudar para tema/ })

    for (let i = 0; i < 5; i += 1) {
      await themeButton.click()
    }

    await expect.poll(async () => readUnlockedEggs(page)).toContain('theme-hunter')
  })

  test('locale-hopper desbloqueia apos 4 toggles de idioma', async ({ page }) => {
    await page.goto('/?lang=pt')

    const localeButton = page.locator('.localeToggle').first()

    for (let i = 0; i < 4; i += 1) {
      await localeButton.click()
    }

    await expect.poll(async () => readUnlockedEggs(page)).toContain('locale-hopper')
  })

  test('filter-ninja desbloqueia com 3 filtros AND', async ({ page }) => {
    await setupGitHubMocks(page)
    await page.goto('/?lang=pt')

    const section = page.locator('#projects')
    await section.scrollIntoViewIfNeeded()

    const filters = section.getByRole('group', { name: 'Filtros' })
    await expect(filters.getByRole('button', { name: 'React', exact: true })).toBeVisible({
      timeout: 45_000
    })

    await filters.getByRole('button', { name: 'React', exact: true }).click()
    await filters.getByRole('button', { name: 'TypeScript', exact: true }).click()
    await filters.getByRole('button', { name: 'JavaScript', exact: true }).click()

    await expect.poll(async () => readUnlockedEggs(page)).toContain('filter-ninja')
  })
})
