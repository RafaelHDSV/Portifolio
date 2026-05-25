import { projectsConfig } from '../constants/projects.config'
import { IGithubResponseRepo } from '../types/IGithub'

export function shouldIncludeRepo (
  repo: IGithubResponseRepo,
  username: string
): boolean {
  if (repo.fork) return false

  const name = repo.name?.toLowerCase() ?? ''
  if (!name) return false

  if (name === username.toLowerCase()) return false

  const config = projectsConfig.find(
    (p) => p.repoName?.toLowerCase() === name
  )

  if (config?.hidden) return false

  return true
}

export function filterReposForPortfolio (
  repos: IGithubResponseRepo[],
  username: string
): IGithubResponseRepo[] {
  return repos.filter((repo) => shouldIncludeRepo(repo, username))
}
