import { expect, test } from '@playwright/test'
import { resetAppStorage } from './helpers/storage'

const CORRECTION_WINDOW_MS = 1500

async function goToAnchorAndWaitArrival (
  page: import('@playwright/test').Page
): Promise<number> {
  await page.goto('/#about')
  await page.waitForFunction(() => window.scrollY > 100)
  return page.evaluate(() => window.scrollY)
}

test.describe('Scroll por ancora', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
  })

  test('mantem o scroll manual para baixo apos redirect por hash', async ({
    page
  }) => {
    const arrival = await goToAnchorAndWaitArrival(page)

    await page.mouse.wheel(0, 1500)
    await page.waitForTimeout(CORRECTION_WINDOW_MS)

    const current = await page.evaluate(() => window.scrollY)
    expect(current).toBeGreaterThan(arrival + 300)
  })

  test('mantem o scroll manual para cima apos redirect por hash', async ({
    page
  }) => {
    const arrival = await goToAnchorAndWaitArrival(page)

    await page.mouse.wheel(0, -600)
    await page.waitForTimeout(CORRECTION_WINDOW_MS)

    const current = await page.evaluate(() => window.scrollY)
    expect(current).toBeLessThan(arrival - 200)
  })

  test('navega para outra secao pela navbar depois do scroll manual', async ({
    page
  }) => {
    await goToAnchorAndWaitArrival(page)

    await page.mouse.wheel(0, 800)
    await page.waitForTimeout(400)

    await page
      .getByRole('navigation', { name: 'Navegação principal' })
      .getByRole('link', { name: 'Contato' })
      .click()

    await expect
      .poll(
        async () =>
          page.evaluate(
            () =>
              document.getElementById('contact')?.getBoundingClientRect().top ??
              Number.NaN
          ),
        { timeout: 10_000 }
      )
      .toBeLessThan(120)
  })
})
