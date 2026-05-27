import { IGithubResponseRepo } from '../types/IGithub'
import { IProjectConfig } from '../types/IProject'
import {
  findProjectConfig,
  isProjectForceExcluded,
  isProjectForceIncluded
} from './projectConfigLookup'

export function shouldIncludeRepo (
  repo: IGithubResponseRepo,
  username: string
): boolean {
  const name = repo.name?.toLowerCase() ?? ''
  const config = findProjectConfig(name)

  if (isProjectForceExcluded(config)) return false

  if (isProjectForceIncluded(config)) return true

  if (repo.fork) return false
  if (!name) return false
  if (name === username.toLowerCase()) return false
  if (name.startsWith('estudo') || name.startsWith('curso')) return false

  return true
}

export function filterReposForPortfolio (
  repos: IGithubResponseRepo[],
  username: string
): IGithubResponseRepo[] {
  return repos.filter((repo) => shouldIncludeRepo(repo, username))
}

export function configToSyntheticRepo (config: IProjectConfig): IGithubResponseRepo {
  const repoName = config.repoName ?? config.name
  const parsedId = Number.parseInt(config.key, 10)

  return {
    id: Number.isFinite(parsedId) ? parsedId : 0,
    name: repoName,
    full_name: `RafaelHDSV/${repoName}`,
    description: config.description.pt,
    homepage: config.urlProject,
    html_url: config.urlGitHub,
    language: config.languages[0],
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    size: 0,
    updated_at: new Date(0).toISOString(),
    fork: false,
    private: false
  }
}
