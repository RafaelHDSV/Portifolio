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
        id,
        avatar_url,
        name,
        company,
        location,
        bio,
        public_repos,
        followers,
        following,
        created_at
      } = response.data

      const filteredUser: IUser = {
        id,
        avatar_url,
        name,
        company,
        location,
        bio,
        public_repos,
        followers,
        following,
        created_at
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
