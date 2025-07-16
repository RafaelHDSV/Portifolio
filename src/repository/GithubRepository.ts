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
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count
      }))

      return filteredRepos
    } catch (err) {
      console.error(err)
      throw new Error(`Failed to fetch public repositories for user: ${err}`)
    }
  }
}

export const GithubRepository = new GithubRepositoryClass()
