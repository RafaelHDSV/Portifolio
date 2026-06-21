import { expect, test } from '@playwright/test'
import { CV_URL } from '../src/constants/cv'
import { resetAppStorage } from './helpers/storage'

test.describe('Links externos', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
    await page.goto('/?lang=pt')
  })

  test('link CV na navbar aponta para PDF publico', async ({ page }) => {
    const cvLink = page.getByRole('navigation').getByRole('link', { name: 'CV' })
    await expect(cvLink).toHaveAttribute('href', CV_URL)
  })

  test('link CV no hero aponta para PDF publico', async ({ page }) => {
    const cvLink = page.getByRole('link', { name: 'Baixar CV' }).first()
    await expect(cvLink).toHaveAttribute('href', CV_URL)
  })

  test('CV responde 200 no GitHub raw', async ({ request }) => {
    const response = await request.head(CV_URL)
    expect(response.status()).toBe(200)
    const contentType = response.headers()['content-type'] ?? ''
    expect(contentType).toMatch(/pdf|octet-stream/)
  })

  test('card GitHub na secao contato aponta para perfil', async ({ page }) => {
    const githubLink = page.getByRole('link', { name: 'GitHub' }).first()
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/RafaelHDSV')
  })
})
