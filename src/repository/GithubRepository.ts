import { AxiosRequestConfig } from 'axios'
import { githubApi } from '../services/gitHub'
import {
  IGithubResponseRepo,
  IGithubResponseUser,
  IUser
} from '../types/IGithub'

class GithubRepositoryClass {
  /**
   * Obtém todos os repositórios de um usuário
   * @param username Nome do usuário no GitHub
   * @param config Configurações opcionais do Axios
   * @returns Promise com array de repositórios
   */
  async getUserDetails(config?: AxiosRequestConfig): Promise<IUser> {
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

      const filteredUser: IUser = {
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

      return filteredUser
    } catch (err) {
      console.error(err)
      throw new Error(`Failed to fetch repositories for user: ${err}`)
    }
  }

  /**
   * Obtém apenas repositórios públicos de um usuário
   * @param username Nome do usuário no GitHub
   * @param config Configurações opcionais do Axios
   * @returns Promise com array de repositórios públicos
   */
  async getRepos(config?: AxiosRequestConfig): Promise<IGithubResponseRepo[]> {
    try {
      const params = {
        sort: 'updated',
        per_page: '100'
      }

      const response = await githubApi.get<IGithubResponseRepo[]>(
        '/user/repos',
        {
          params,
          ...config
        }
      )

      const filteredRepos = response.data.map((repo: IGithubResponseRepo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        homepage: repo.homepage,
        html_url: repo.html_url,
        updated_at: repo.updated_at,
        topics: repo.topics
      }))

      return filteredRepos
    } catch (err) {
      console.error(err)
      throw new Error(`Failed to fetch public repositories for user: ${err}`)
    }
  }

  async getRecentRepos (
    username: string,
    limit = 10
  ): Promise<IGithubResponseRepo[]> {
    try {
      const response = await githubApi.get<IGithubResponseRepo[]>(
        `/users/${username}/repos`,
        {
          params: { sort: 'updated', per_page: String(limit) }
        }
      )

      return response.data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        homepage: repo.homepage,
        html_url: repo.html_url,
        updated_at: repo.updated_at,
        topics: repo.topics
      }))
    } catch (err) {
      console.error(err)
      throw new Error(`Failed to fetch recent repositories: ${err}`)
    }
  }

  async getPinnedRepos (username: string): Promise<IGithubResponseRepo[]> {
    const query = `
      query($login: String!) {
        user(login: $login) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                id
                name
                description
                homepageUrl
                url
                updatedAt
                stargazersCount
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
                id: string
                name: string
                description: string | null
                homepageUrl: string | null
                url: string
                updatedAt: string
                stargazersCount: number
                primaryLanguage?: { name: string } | null
                repositoryTopics?: {
                  nodes?: Array<{ topic: { name: string } }>
                }
              }>
            }
          }
        }
      }>('/graphql', {
        query,
        variables: { login: username }
      })

      const nodes = response.data?.data?.user?.pinnedItems?.nodes ?? []

      return nodes.map((node) => ({
        id: Number(node.id.replace(/\D/g, '').slice(0, 9)) || undefined,
        name: node.name,
        description: node.description ?? undefined,
        homepage: node.homepageUrl,
        html_url: node.url,
        updated_at: node.updatedAt,
        stargazers_count: node.stargazersCount,
        language: node.primaryLanguage?.name,
        topics: node.repositoryTopics?.nodes?.map((n) => n.topic.name) as
          | string[]
          | undefined
      }))
    } catch (err) {
      console.error(err)
      return []
    }
  }
}

export const GithubRepository = new GithubRepositoryClass()
