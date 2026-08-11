import { FORCE_EXCLUDED_REPO_NAMES } from '../constants/projects.config'
import { IGithubResponseRepo } from '../types/IGithub'
import { IProjectConfig } from '../types/IProject'
import {
  findProjectConfig,
  isProjectForceExcluded,
  isProjectForceIncluded
} from './projectConfigLookup'

const MARKUP_ONLY_LANGUAGES = new Set([
  'html',
  'css',
  'scss',
  'sass',
  'less'
])

function isForceExcludedByName (repoName: string): boolean {
  const normalized = repoName.trim().toLowerCase()
  if (!normalized) return false

  return FORCE_EXCLUDED_REPO_NAMES.some(
    (excluded) => excluded.trim().toLowerCase() === normalized
  )
}

function hasDemoUrl (repo: IGithubResponseRepo, config?: IProjectConfig): boolean {
  const homepage = repo.homepage?.trim()
  if (homepage) return true
  const configUrl = config?.urlProject?.trim()
  return Boolean(configUrl)
}

function isMarkupOnlyLanguage (language?: string | null): boolean {
  if (!language) return false
  return MARKUP_ONLY_LANGUAGES.has(language.trim().toLowerCase())
}

export function shouldIncludeRepo (
  repo: IGithubResponseRepo,
  username: string
): boolean {
  const name = repo.name?.toLowerCase() ?? ''

  if (isForceExcludedByName(name)) return false

  const config = findProjectConfig(name)

  if (isProjectForceExcluded(config)) return false

  if (isProjectForceIncluded(config)) return true

  if (repo.fork) return false
  if (!name) return false
  if (name === username.toLowerCase()) return false
  if (name.startsWith('estudo') || name.startsWith('curso')) return false

  return true
}

/** Soft filter for GitHub pins: only explicit excludes + forks + profile README. */
export function shouldIncludePinnedRepo (
  repo: IGithubResponseRepo,
  username: string
): boolean {
  const name = repo.name?.toLowerCase() ?? ''

  if (!name) return false
  if (isForceExcludedByName(name)) return false

  const config = findProjectConfig(name)
  if (isProjectForceExcluded(config)) return false

  if (repo.fork) return false
  if (name === username.toLowerCase()) return false

  return true
}

export function filterReposForPortfolio (
  repos: IGithubResponseRepo[],
  username: string
): IGithubResponseRepo[] {
  return repos.filter((repo) => shouldIncludeRepo(repo, username))
}

export function filterPinnedReposForPortfolio (
  repos: IGithubResponseRepo[],
  username: string
): IGithubResponseRepo[] {
  return repos.filter((repo) => shouldIncludePinnedRepo(repo, username))
}

function isFrontendMentorChallenge (repo: IGithubResponseRepo): boolean {
  const haystack = `${repo.name ?? ''} ${repo.description ?? ''}`
  return /frontend\s*mentor/i.test(haystack)
}

/** Frontend Mentor ou landing/challenge markup-only — elegível, mas ordenado por último. */
export function isLowPriorityPortfolioRepo (repo: IGithubResponseRepo): boolean {
  if (isFrontendMentorChallenge(repo)) return true
  if (isMarkupOnlyLanguage(repo.language)) return true
  return false
}

export function isFrontendMentorRepo (repo: IGithubResponseRepo): boolean {
  return isLowPriorityPortfolioRepo(repo)
}

/**
 * Quality gate for non-pin fill slots.
 * projectsConfig only supplies metadata — it does NOT grant eligibility.
 * Bypass: forceInclude only.
 * Otherwise requires a demo URL. Markup-only / Frontend Mentor stay eligible
 * but are sorted with low priority in merge.
 */
export function isEligibleNonPinnedRepo (repo: IGithubResponseRepo): boolean {
  const name = repo.name?.toLowerCase() ?? ''
  if (!name) return false

  const config = findProjectConfig(name)

  if (isProjectForceExcluded(config)) return false
  if (isForceExcludedByName(name)) return false

  if (isProjectForceIncluded(config)) return true

  return hasDemoUrl(repo, config)
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
