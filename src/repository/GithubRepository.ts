import { AxiosRequestConfig } from 'axios'
import { githubApi } from '../services/gitHub'
import {
  IGithubResponseRepo,
  IGithubResponseUser,
  IUser
} from '../types/IGithub'
import { filterReposForPortfolio } from '../utils/repoFilters'

function mapRepo (repo: IGithubResponseRepo): IGithubResponseRepo {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    homepage: repo.homepage,
    html_url: repo.html_url,
    updated_at: repo.updated_at,
    topics: repo.topics,
    fork: repo.fork,
    private: repo.private
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
        public_repos
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
        public_repos
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

  async getRecentRepos (
    username: string,
    limit = 10
  ): Promise<IGithubResponseRepo[]> {
    try {
      const response = await githubApi.get<IGithubResponseRepo[]>('/user/repos', {
        params: {
          sort: 'updated',
          per_page: '100',
          affiliation: 'owner'
        }
      })

      const filtered = filterReposForPortfolio(
        response.data.map(mapRepo),
        username
      )

      const recentSlice = filtered.slice(0, limit)
      const recentNames = new Set(recentSlice.map((r) => r.name?.toLowerCase()))

      const privateExtras = filtered.filter(
        (r) =>
          r.private &&
          !recentNames.has(r.name?.toLowerCase() ?? '')
      )

      return [...recentSlice, ...privateExtras]
    } catch (err) {
      console.warn('Authenticated repos failed, falling back to public:', err)

      const response = await githubApi.get<IGithubResponseRepo[]>(
        `/users/${username}/repos`,
        { params: { sort: 'updated', per_page: '100' } }
      )

      const filtered = filterReposForPortfolio(
        response.data.map(mapRepo),
        username
      )

      const recentSlice = filtered.slice(0, limit)
      const recentNames = new Set(recentSlice.map((r) => r.name?.toLowerCase()))

      const privateExtras = filtered.filter(
        (r) =>
          r.private &&
          !recentNames.has(r.name?.toLowerCase() ?? '')
      )

      return [...recentSlice, ...privateExtras]
    }
  }

  async getPinnedRepos (username: string): Promise<IGithubResponseRepo[]> {
    const query = `
      query($login: String!) {
        user(login: $login) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                databaseId
                name
                description
                homepageUrl
                url
                updatedAt
                stargazersCount
                isFork
                isPrivate
                primaryLanguage { name }
                repositoryTopics(first: 10) {
                  nodes { topic { name } }
                }
              }
            }
          }
        }
      }
    `

    try {
      const response = await githubApi.post<{
        data?: {
          user?: {
            pinnedItems?: {
              nodes?: Array<{
                databaseId: number
                name: string
                description: string | null
                homepageUrl: string | null
                url: string
                updatedAt: string
                stargazersCount: number
                isFork: boolean
                isPrivate: boolean
                primaryLanguage?: { name: string } | null
                repositoryTopics?: {
                  nodes?: Array<{ topic: { name: string } }>
                }
              }>
            }
          }
        }
        errors?: Array<{ message: string }>
      }>('/graphql', {
        query,
        variables: { login: username }
      })

      if (response.data?.errors?.length) {
        console.error('GraphQL pinned repos:', response.data.errors)
      }

      const nodes = response.data?.data?.user?.pinnedItems?.nodes ?? []

      const repos = nodes
        .filter((node) => !node.isFork)
        .map((node) => ({
          id: node.databaseId,
          name: node.name,
          description: node.description ?? undefined,
          homepage: node.homepageUrl,
          html_url: node.url,
          updated_at: node.updatedAt,
          stargazers_count: node.stargazersCount,
          language: node.primaryLanguage?.name,
          topics: node.repositoryTopics?.nodes?.map((n) => n.topic.name),
          fork: false,
          private: node.isPrivate
        }))

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
}

export const GithubRepository = new GithubRepositoryClass()
