import { expect, test } from '@playwright/test'
import { resetAppStorage } from './helpers/storage'

test.describe('Home PT e EN', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
  })

  test('carrega navegacao em portugues', async ({ page }) => {
    await page.goto('/?lang=pt')
    await expect(page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Sobre' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: 'Rafael Vieira' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ver projetos' })).toBeVisible()
  })

  test('carrega navegacao em ingles', async ({ page }) => {
    await page.goto('/?lang=en')
    await expect(page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'About' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'View projects' })).toBeVisible()
  })
})
