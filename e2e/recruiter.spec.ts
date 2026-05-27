import { expect, test } from '@playwright/test'
import { setupGitHubMocks } from './helpers/githubMocks'
import { resetAppStorage } from './helpers/storage'

test.describe('Modo recrutador', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
    await setupGitHubMocks(page)
    await page.goto('/?lang=pt')
  })

  test('ativa, persiste apos reload e volta para home', async ({ page }) => {
    await page.getByRole('button', { name: 'Recrutador' }).click()

    await expect(page.getByRole('heading', { name: 'Rafael Vieira' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Voltar à exibição normal' })).toBeVisible()

    await expect.poll(async () =>
      page.evaluate(() => localStorage.getItem('recruiter-mode'))
    ).toBe('true')

    await page.reload()
    await expect(page.getByRole('button', { name: 'Voltar à exibição normal' })).toBeVisible()

    await page.getByRole('button', { name: 'Voltar à exibição normal' }).click()
    await expect(page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Sobre' })).toBeVisible()
    await expect.poll(async () =>
      page.evaluate(() => localStorage.getItem('recruiter-mode'))
    ).toBeNull()
  })
})
