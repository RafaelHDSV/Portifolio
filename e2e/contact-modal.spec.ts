import { expect, test } from '@playwright/test'
import { setupGitHubMocks } from './helpers/githubMocks'
import { resetAppStorage } from './helpers/storage'

test.describe('Modal de contato', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
    await setupGitHubMocks(page)
    await page.goto('/?lang=pt')
  })

  test('abre modal com campos obrigatorios', async ({ page }) => {
    await page.getByRole('button', { name: 'Enviar mensagem' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Enviar mensagem' })).toBeVisible()

    await expect(page.locator('#contact-name')).toHaveAttribute('required', '')
    await expect(page.locator('#contact-email')).toHaveAttribute('required', '')
    await expect(page.locator('#contact-message')).toHaveAttribute('required', '')
  })

  test('envia formulario valido com EmailJS mockado', async ({ page }) => {
    await page.route('**/api.emailjs.com/**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' })
    })

    await page.getByRole('button', { name: 'Enviar mensagem' }).click()

    const dialog = page.getByRole('dialog')
    await dialog.locator('#contact-name').fill('Teste E2E')
    await dialog.locator('#contact-email').fill('e2e@example.com')
    await dialog.locator('#contact-message').fill('Mensagem de teste Playwright')
    await dialog.getByRole('button', { name: 'Enviar' }).click()

    await expect(dialog).toBeHidden({ timeout: 10_000 })
  })
})
