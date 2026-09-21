import { expect, test } from '@playwright/test'
import { resetAppStorage } from './helpers/storage'

const FORBIDDEN_MARKERS = [
  'C6',
  'Pine',
  'Afinz',
  'Conexia',
  'ConeXia',
  'Bevi',
  'Indiky',
  'Play Store',
  '6k',
  '1.500',
  '1500'
]

test.describe('Secao Experiencia', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
  })

  test('mostra intro, quatro blocos e nota de confidencialidade em PT', async ({
    page
  }) => {
    await page.goto('/?lang=pt')

    const section = page.locator('#experience')
    await expect(section.getByRole('heading', { level: 2, name: 'Experiência' })).toBeVisible()
    await expect(section.getByText(/As entregas abaixo são do time/)).toBeVisible()
    await expect(section.getByRole('heading', { name: 'Plataforma como produto (SaaS)' })).toBeVisible()
    await expect(section.getByRole('heading', { name: 'Jornadas de crédito em correspondente' })).toBeVisible()
    await expect(section.getByRole('heading', { name: 'Consórcio e simulação em produção' })).toBeVisible()
    await expect(section.getByRole('heading', { name: 'Liderança e fila de tickets' })).toBeVisible()
    await expect(
      section.getByText('Nomes de clientes, bancos e repositórios internos omitidos por confidencialidade.')
    ).toBeVisible()
  })

  test('mostra heading Experience em EN', async ({ page }) => {
    await page.goto('/?lang=en')

    await expect(
      page.locator('#experience').getByRole('heading', { level: 2, name: 'Experience' })
    ).toBeVisible()
  })

  test('nao cita clientes, bancos nem metricas da plataforma', async ({ page }) => {
    await page.goto('/?lang=pt')

    const html = (await page.locator('#experience').innerHTML()) ?? ''
    for (const marker of FORBIDDEN_MARKERS) {
      expect(html, `marcador proibido: ${marker}`).not.toContain(marker)
    }
  })

  test('navbar leva a secao experiencia', async ({ page }) => {
    await page.goto('/?lang=pt')

    await page
      .getByRole('navigation', { name: 'Navegação principal' })
      .getByRole('link', { name: 'Experiência' })
      .click()

    await expect
      .poll(
        async () =>
          page.evaluate(
            () =>
              document.getElementById('experience')?.getBoundingClientRect().top ??
              Number.NaN
          ),
        { timeout: 10_000 }
      )
      .toBeLessThan(120)
  })
})
