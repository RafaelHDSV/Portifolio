import { expect, test } from '@playwright/test'
import { setupGitHubMocks } from './helpers/githubMocks'
import { resetAppStorage } from './helpers/storage'

async function mockTouchDevice (page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const original = window.matchMedia.bind(window)

    window.matchMedia = (query: string) => {
      if (query === '(hover: hover)') {
        return {
          media: query,
          matches: false,
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
          onchange: null
        } as MediaQueryList
      }

      return original(query)
    }
  })
}

test.describe('Stats touch nos cards', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
    await setupGitHubMocks(page)
  })

  test('botao Ver stats revela metricas em viewport touch', async ({ page }) => {
    test.setTimeout(90_000)

    await mockTouchDevice(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/?lang=pt')

    const section = page.locator('#projects')
    await section.scrollIntoViewIfNeeded()
    await expect(
      section.getByRole('heading', { level: 3, name: 'repo-react-ts' })
    ).toBeVisible({ timeout: 45_000 })

    const card = section.getByRole('article').first()
    await expect(card.getByRole('heading', { level: 3, name: 'repo-react-ts' })).toBeVisible()

    const statsGroup = card.getByRole('group', {
      name: 'Estatisticas do GitHub de repo-react-ts'
    })
    await expect(statsGroup).not.toBeVisible()

    await card.getByRole('button', { name: 'Ver stats' }).click()
    await expect(statsGroup).toBeVisible()
    await expect(statsGroup.getByText('12', { exact: true })).toBeVisible()
  })

  test('botao Ver stats oculto em viewport desktop', async ({ page }) => {
    test.setTimeout(90_000)

    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/?lang=pt')

    const section = page.locator('#projects')
    await section.scrollIntoViewIfNeeded()
    await expect(
      section.getByRole('heading', { level: 3, name: 'repo-react-ts' })
    ).toBeVisible({ timeout: 45_000 })

    await expect(section.getByRole('button', { name: 'Ver stats' })).toHaveCount(0)
  })
})
