import { expect, test } from '@playwright/test'
import { setupGitHubMocks } from './helpers/githubMocks'
import { resetAppStorage } from './helpers/storage'

async function projectCards (page: import('@playwright/test').Page) {
  const section = page.locator('#projects')
  await section.scrollIntoViewIfNeeded()
  await expect(section.getByRole('heading', { level: 3, name: 'repo-react-ts' })).toBeVisible({
    timeout: 15_000
  })
  return section.locator('article')
}

test.describe('Filtros multi AND', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
    await setupGitHubMocks(page)
    await page.goto('/?lang=pt')
  })

  test('aplica intersecao React + TypeScript', async ({ page }) => {
    test.setTimeout(90_000)

    const cards = await projectCards(page)
    await expect(cards).toHaveCount(3)

    const filters = page.locator('#projects').getByRole('group', { name: 'Filtros' })
    const reactFilter = filters.getByRole('button', { name: 'React', exact: true })
    const tsFilter = filters.getByRole('button', { name: 'TypeScript', exact: true })

    await expect(reactFilter).toBeVisible({ timeout: 45_000 })
    await reactFilter.click()
    await tsFilter.click()

    await expect(cards).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 3, name: 'repo-react-ts' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: 'repo-react-only' })).toHaveCount(0)

    await filters.getByRole('button', { name: 'Limpar filtros' }).click()
    await expect(cards).toHaveCount(3)
  })

  test('alterna filtro ao clicar na linguagem do card', async ({ page }) => {
    test.setTimeout(90_000)

    const cards = await projectCards(page)
    await expect(cards).toHaveCount(3)

    const filters = page.locator('#projects').getByRole('group', { name: 'Filtros' })
    const reactFilter = filters.getByRole('button', { name: 'React', exact: true })

    await expect(reactFilter).toBeVisible({ timeout: 45_000 })

    const reactCard = page.getByRole('heading', { level: 3, name: 'repo-react-only' })
    await reactCard.scrollIntoViewIfNeeded()
    const reactBadge = reactCard
      .locator('xpath=ancestor::article')
      .getByRole('button', { name: 'Filtrar projetos por React' })

    await reactBadge.click()

    await expect(reactFilter).toHaveAttribute('aria-pressed', 'true')
    await expect(cards).toHaveCount(2)

    await reactBadge.click()

    await expect(reactFilter).toHaveAttribute('aria-pressed', 'false')
    await expect(cards).toHaveCount(3)
  })

  test('exibe empty state e limpa filtros pelo CTA', async ({ page }) => {
    test.setTimeout(90_000)

    const cards = await projectCards(page)
    await expect(cards).toHaveCount(3)

    const filters = page.locator('#projects').getByRole('group', { name: 'Filtros' })
    await expect(filters.getByRole('button', { name: 'React', exact: true })).toBeVisible({
      timeout: 45_000
    })

    await filters.getByRole('button', { name: 'React', exact: true }).click()
    await filters.getByRole('button', { name: 'TypeScript', exact: true }).click()
    await filters.getByRole('button', { name: 'JavaScript', exact: true }).click()

    await expect(cards).toHaveCount(0)
    await expect(
      page.getByRole('status').getByText('Nenhum projeto corresponde a esses filtros')
    ).toBeVisible()

    await page
      .getByRole('status')
      .getByRole('button', { name: 'Limpar filtros' })
      .click()

    await expect(cards).toHaveCount(3)
  })
})
