import { AxiosRequestConfig } from 'axios'
import { IGithubRepo, IGithubUser } from '../interfaces/IGithub'
import { githubApi } from '../services/gitHub'

class GithubRepositoryClass {
  /**
   * Obtém todos os repositórios de um usuário
   * @param username Nome do usuário no GitHub
   * @param config Configurações opcionais do Axios
   * @returns Promise com array de repositórios
   */
  async getUserDetails(config?: AxiosRequestConfig): Promise<IGithubUser> {
    try {
      const response = await githubApi.get<IGithubUser>('/user', config)

      const filteredUser = {
        id: response.data.id,
        avatar_url: response.data.avatar_url,
        name: response.data.name,
        company: response.data.company,
        location: response.data.location,
        bio: response.data.bio,
        public_repos: response.data.public_repos,
        followers: response.data.followers,
        following: response.data.following,
        created_at: response.data.created_at
      }

      return filteredUser
    } catch (error) {
      throw new Error(`Failed to fetch repositories for user: ${error}`)
    }
  }

  /**
   * Obtém apenas repositórios públicos de um usuário
   * @param username Nome do usuário no GitHub
   * @param config Configurações opcionais do Axios
   * @returns Promise com array de repositórios públicos
   */
  async getRepos(config?: AxiosRequestConfig): Promise<IGithubRepo[]> {
    try {
      const params = {
        sort: 'updated',
        per_page: '100'
      }

      const response = await githubApi.get<IGithubRepo[]>('/user/repos', {
        params,
        ...config
      })

      const filteredRepos = response.data.map((repo: IGithubRepo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count
      }))

      return filteredRepos
    } catch (error) {
      throw new Error(`Failed to fetch public repositories for user: ${error}`)
    }
  }
}

export const GithubRepository = new GithubRepositoryClass()
