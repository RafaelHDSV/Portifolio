import type { Page, Route } from '@playwright/test'
import {
  buildLanguagesGraphqlResponse,
  buildPinnedGraphqlResponse,
  MOCK_LANGUAGES,
  MOCK_REPOS
} from '../fixtures/github/repos'

const OWNER = 'RafaelHDSV'

function extractRepoNamesFromGraphql (body: string): string[] {
  const names: string[] = []
  const regex = /repository\(owner: \$owner, name: "([^"]+)"\)/g
  let match = regex.exec(body)

  while (match) {
    names.push(match[1])
    match = regex.exec(body)
  }

  return names
}

async function fulfillJson (route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body)
  })
}

export async function setupGitHubMocks (page: Page): Promise<void> {
  await page.route('**/api.github.com/**', async (route) => {
    const url = route.request().url()
    const method = route.request().method()

    if (url.includes('/graphql') && method === 'POST') {
      const postData = route.request().postData() ?? ''

      if (postData.includes('pinnedItems')) {
        await fulfillJson(route, buildPinnedGraphqlResponse())
        return
      }

      if (postData.includes('languages(first:') || postData.includes('BatchRepoLanguages')) {
        const repoNames = extractRepoNamesFromGraphql(postData)
        await fulfillJson(route, buildLanguagesGraphqlResponse(repoNames))
        return
      }

      await fulfillJson(route, { data: {} })
      return
    }

    if (url.includes(`/users/${OWNER}/repos`) && method === 'GET') {
      await fulfillJson(route, MOCK_REPOS)
      return
    }

    if (url.includes('/user/repos') && method === 'GET') {
      await fulfillJson(route, MOCK_REPOS)
      return
    }

    if (url.includes('/contributors') && method === 'GET') {
      await fulfillJson(route, [{ avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' }])
      return
    }

    if (url.match(/\/repos\/[^/]+\/[^/]+\/languages$/) && method === 'GET') {
      const segments = url.split('/')
      const repoName = segments[segments.indexOf('repos') + 2]
      const langs = MOCK_LANGUAGES[repoName] ?? []
      const payload = Object.fromEntries(
        langs.map((lang, index) => [lang, 1000 - index * 100])
      )
      await fulfillJson(route, payload)
      return
    }

    if (url.includes('/readme') || url.includes('/contents/')) {
      await route.fulfill({ status: 404, body: 'Not Found' })
      return
    }

    if (url.includes('/user') && method === 'GET') {
      await fulfillJson(route, {
        login: OWNER,
        name: 'Rafael Vieira',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        public_repos: MOCK_REPOS.length,
        followers: 10,
        following: 5,
        location: 'Sorocaba, SP',
        company: 'AGX Software',
        created_at: '2020-01-01T00:00:00Z',
        total_private_repos: 0
      })
      return
    }

    await fulfillJson(route, [])
  })
}
