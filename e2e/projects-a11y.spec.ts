import { expect, test } from '@playwright/test'
import { setupGitHubMocks } from './helpers/githubMocks'
import { resetAppStorage } from './helpers/storage'

test.describe('A11y cards de projetos', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppStorage(page)
    await setupGitHubMocks(page)
    await page.goto('/?lang=pt')
  })

  test('link GitHub do card tem aria-label com nome do repo', async ({ page }) => {
    test.setTimeout(90_000)

    const section = page.locator('#projects')
    await section.scrollIntoViewIfNeeded()
    await expect(
      section.getByRole('heading', { level: 3, name: 'repo-react-ts' })
    ).toBeVisible({ timeout: 45_000 })

    const githubLink = section.getByRole('link', {
      name: 'Abrir repo-react-ts no GitHub'
    })
    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/RafaelHDSV/repo-react-ts'
    )
  })
})
