import { AxiosRequestConfig } from 'axios'
import { githubApi } from '../services/gitHub'
import { gitHubToken } from '../utils/environment'
import {
  IGithubResponseRepo,
  IGithubResponseUser,
  IUser
} from '../types/IGithub'
import { filterReposForPortfolio } from '../utils/repoFilters'
import {
  getCachedRepoLanguages,
  setCachedRepoLanguages
} from '../utils/githubLanguagesCache'

function mapRepo (repo: IGithubResponseRepo): IGithubResponseRepo {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    open_issues_count: repo.open_issues_count,
    size: repo.size,
    homepage: repo.homepage,
    html_url: repo.html_url,
    updated_at: repo.updated_at,
    topics: repo.topics,
    fork: repo.fork,
    private: repo.private
  }
}

const PINNED_REPO_FIELDS = `
  databaseId
  name
  description
  homepageUrl
  url
  updatedAt
  stargazersCount
  forkCount
  diskUsage
  issues(states: OPEN) { totalCount }
  isFork
  isPrivate
  primaryLanguage { name }
  repositoryTopics(first: 10) {
    nodes { topic { name } }
  }
`

type PinnedNode = {
  databaseId: number
  name: string
  description: string | null
  homepageUrl: string | null
  url: string
  updatedAt: string
  stargazersCount: number
  forkCount: number
  diskUsage: number
  issues?: { totalCount: number }
  isFork: boolean
  isPrivate: boolean
  primaryLanguage?: { name: string } | null
  repositoryTopics?: {
    nodes?: Array<{ topic: { name: string } }>
  }
}

function mapPinnedNode (node: PinnedNode): IGithubResponseRepo {
  return {
    id: node.databaseId,
    name: node.name,
    description: node.description ?? undefined,
    homepage: node.homepageUrl,
    html_url: node.url,
    updated_at: node.updatedAt,
    stargazers_count: node.stargazersCount,
    forks_count: node.forkCount,
    size: node.diskUsage,
    open_issues_count: node.issues?.totalCount ?? 0,
    language: node.primaryLanguage?.name,
    topics: node.repositoryTopics?.nodes?.map((n) => n.topic.name),
    fork: node.isFork,
    private: node.isPrivate
  }
}

function escapeGraphqlString (value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function buildBatchLanguagesQuery (repoNames: string[]): string {
  const fields = repoNames
    .map((name, index) => {
      const safeName = escapeGraphqlString(name)
      return `
        r${index}: repository(owner: $owner, name: "${safeName}") {
          name
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges { node { name } }
          }
        }
      `
    })
    .join('\n')

  return `query BatchRepoLanguages($owner: String!) { ${fields} }`
}

type BatchLanguageNode = {
  name?: string
  languages?: {
    edges?: Array<{ node?: { name?: string } }>
  }
}

class GithubRepositoryClass {
  async getUserDetails (config?: AxiosRequestConfig): Promise<IUser> {
    try {
      const response = await githubApi.get<IGithubResponseUser>('/user', config)

      const {
        avatar_url,
        company,
        created_at,
        followers,
        following,
        location,
        login,
        name,
        public_repos,
        total_private_repos
      } = response.data

      return {
        avatar_url,
        company,
        created_at,
        followers,
        following,
        location,
        login,
        name,
        public_repos,
        total_private_repos
      }
    } catch (err) {
      console.error(err)
      throw new Error(`Failed to fetch user: ${err}`)
    }
  }

  async getRepos (config?: AxiosRequestConfig): Promise<IGithubResponseRepo[]> {
    try {
      const response = await githubApi.get<IGithubResponseRepo[]>('/user/repos', {
        params: {
          sort: 'updated',
          per_page: '100',
          affiliation: 'owner'
        },
        ...config
      })

      return response.data.map(mapRepo)
    } catch (err) {
      console.error(err)
      throw new Error(`Failed to fetch repositories: ${err}`)
    }
  }

  async getRecentRepos (username: string): Promise<IGithubResponseRepo[]> {
    try {
      const response = await githubApi.get<IGithubResponseRepo[]>('/user/repos', {
        params: {
          sort: 'updated',
          per_page: '100',
          affiliation: 'owner'
        }
      })

      return filterReposForPortfolio(
        response.data.map(mapRepo),
        username
      )
    } catch (err) {
      console.warn('Authenticated repos failed, falling back to public:', err)

      const response = await githubApi.get<IGithubResponseRepo[]>(
        `/users/${username}/repos`,
        { params: { sort: 'updated', per_page: '100' } }
      )

      return filterReposForPortfolio(
        response.data.map(mapRepo),
        username
      )
    }
  }

  async getPinnedRepos (username: string): Promise<IGithubResponseRepo[]> {
    const authenticated = Boolean(gitHubToken)

    const viewerQuery = `
      query {
        viewer {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                ${PINNED_REPO_FIELDS}
              }
            }
          }
        }
      }
    `

    const publicQuery = `
      query($login: String!) {
        user(login: $login) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                ${PINNED_REPO_FIELDS}
              }
            }
          }
        }
      }
    `

    try {
      const response = await githubApi.post<{
        data?: {
          viewer?: {
            pinnedItems?: { nodes?: PinnedNode[] }
          }
          user?: {
            pinnedItems?: { nodes?: PinnedNode[] }
          }
        }
        errors?: Array<{ message: string }>
      }>('/graphql', {
        query: authenticated ? viewerQuery : publicQuery,
        variables: authenticated ? undefined : { login: username }
      })

      if (response.data?.errors?.length) {
        console.error('GraphQL pinned repos:', response.data.errors)
      }

      const nodes = authenticated
        ? response.data?.data?.viewer?.pinnedItems?.nodes ?? []
        : response.data?.data?.user?.pinnedItems?.nodes ?? []

      const repos = nodes
        .filter((node) => !node.isFork)
        .map(mapPinnedNode)

      return filterReposForPortfolio(repos, username)
    } catch (err) {
      console.error('Failed to fetch pinned repos:', err)
      return []
    }
  }

  async getReadme (owner: string, repo: string): Promise<string> {
    const response = await githubApi.get<string>(
      `/repos/${owner}/${repo}/readme`,
      {
        headers: { Accept: 'application/vnd.github.raw' }
      }
    )
    return response.data
  }

  async getRepoLanguages (owner: string, repo: string): Promise<string[]> {
    try {
      const response = await githubApi.get<Record<string, number>>(
        `/repos/${owner}/${repo}/languages`
      )
      return Object.entries(response.data)
        .sort(([, a], [, b]) => b - a)
        .map(([lang]) => lang)
    } catch {
      return []
    }
  }

  private async fetchLanguagesGraphQL (
    owner: string,
    repoNames: string[]
  ): Promise<Map<string, string[]>> {
    const query = buildBatchLanguagesQuery(repoNames)
    const response = await githubApi.post<{
      data?: Record<string, BatchLanguageNode | null>
      errors?: Array<{ message: string }>
    }>('/graphql', {
      query,
      variables: { owner }
    })

    if (response.data?.errors?.length) {
      throw new Error(response.data.errors.map((error) => error.message).join('; '))
    }

    const map = new Map<string, string[]>()

    repoNames.forEach((name, index) => {
      const node = response.data?.data?.[`r${index}`]
      const langs =
        node?.languages?.edges
          ?.map((edge) => edge.node?.name)
          .filter((lang): lang is string => Boolean(lang)) ?? []

      if (langs.length > 0) {
        map.set(name.toLowerCase(), langs)
      }
    })

    return map
  }

  private async fetchLanguagesRestFallback (
    owner: string,
    repoNames: string[]
  ): Promise<Map<string, string[]>> {
    const entries = await Promise.all(
      repoNames.map(async (name) => {
        const langs = await this.getRepoLanguages(owner, name)
        return [name.toLowerCase(), langs] as const
      })
    )

    return new Map(entries)
  }

  async getRepoLanguagesBatch (
    owner: string,
    repoNames: string[]
  ): Promise<Map<string, string[]>> {
    const unique = [
      ...new Set(repoNames.map((name) => name.trim()).filter(Boolean))
    ]

    if (unique.length === 0) return new Map()

    const cached = getCachedRepoLanguages(owner, unique)
    if (cached) return cached

    let map = new Map<string, string[]>()

    try {
      map = await this.fetchLanguagesGraphQL(owner, unique)
    } catch (err) {
      console.warn('GraphQL languages batch failed, falling back to REST:', err)
    }

    const missing = unique.filter(
      (name) => (map.get(name.toLowerCase()) ?? []).length === 0
    )

    if (missing.length > 0) {
      const fallback = await this.fetchLanguagesRestFallback(owner, missing)
      for (const [name, langs] of fallback.entries()) {
        if (langs.length > 0) map.set(name, langs)
      }
    }

    if (map.size === 0) {
      map = await this.fetchLanguagesRestFallback(owner, unique)
    }

    setCachedRepoLanguages(owner, unique, map)
    return map
  }

  async getContributorAvatars (
    owner: string,
    repo: string,
    limit = 5
  ): Promise<string[]> {
    try {
      const response = await githubApi.get<Array<{ avatar_url: string }>>(
        `/repos/${owner}/${repo}/contributors`,
        { params: { per_page: limit, anon: 'false' } }
      )
      return response.data.map((c) => c.avatar_url)
    } catch {
      return []
    }
  }

  async getContributorCount (owner: string, repo: string): Promise<number> {
    try {
      let total = 0
      let page = 1

      while (page <= 10) {
        const response = await githubApi.get<unknown[]>(
          `/repos/${owner}/${repo}/contributors`,
          { params: { per_page: 100, page, anon: 'false' } }
        )

        total += response.data.length

        if (response.data.length < 100) return total

        const hasNext = String(response.headers.link ?? '').includes('rel="next"')
        if (!hasNext) return total

        page += 1
      }

      return total
    } catch {
      return 0
    }
  }

  async getContributorCounts (
    owner: string,
    repoNames: string[]
  ): Promise<Map<string, number>> {
    const unique = [...new Set(repoNames.map((name) => name.trim()).filter(Boolean))]
    const entries = await Promise.all(
      unique.map(async (name) => {
        const count = await this.getContributorCount(owner, name)
        return [name.toLowerCase(), count] as const
      })
    )

    return new Map(entries)
  }

  async repoFileExists (
    owner: string,
    repo: string,
    path: string
  ): Promise<boolean> {
    try {
      await githubApi.get(`/repos/${owner}/${repo}/contents/${path}`)
      return true
    } catch {
      return false
    }
  }
}

export const GithubRepository = new GithubRepositoryClass()
