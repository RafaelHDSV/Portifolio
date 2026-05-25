import { ProjectCardData } from '../components/Card/Card'
import { projectsConfig } from '../constants/projects.config'
import { IGithubResponseRepo } from '../types/IGithub'
import { resolveProjectImage } from './projectImages'

function mapLanguageToFilter (language?: string | null): string[] {
  if (!language) return []
  const map: Record<string, string> = {
    TypeScript: 'Typescript',
    JavaScript: 'Javascript',
    HTML: 'HTML',
    CSS: 'CSS'
  }
  return [map[language] ?? language]
}

function repoToCard (
  repo: IGithubResponseRepo,
  locale: 'pt' | 'en',
  pinned: boolean
): ProjectCardData {
  const repoName = repo.name ?? ''
  const config = projectsConfig.find(
    (p) => p.repoName?.toLowerCase() === repoName.toLowerCase()
  )

  const description = config
    ? config.description[locale]
    : repo.description ?? ''

  const { src, pending } = resolveProjectImage(repoName, config?.image)

  return {
    id: config?.key ?? repoName,
    name: config?.name ?? repoName,
    image: src,
    imagePending: pending,
    description,
    languages: config?.languages ?? mapLanguageToFilter(repo.language),
    urlProject: repo.homepage ?? config?.urlProject,
    urlGitHub: config?.urlGitHub ?? repo.html_url ?? '',
    pinned
  }
}

export function mergeGitHubProjects (
  pinned: IGithubResponseRepo[],
  recent: IGithubResponseRepo[],
  locale: 'pt' | 'en'
): ProjectCardData[] {
  const pinnedNames = new Set(
    pinned.map((r) => r.name?.toLowerCase()).filter(Boolean)
  )

  const ordered: IGithubResponseRepo[] = [
    ...pinned,
    ...recent.filter((r) => !pinnedNames.has(r.name?.toLowerCase() ?? ''))
  ]

  const seen = new Set<string>()
  const cards: ProjectCardData[] = []

  for (const repo of ordered) {
    const key = repo.name?.toLowerCase() ?? ''
    if (!key || seen.has(key)) continue
    seen.add(key)
    cards.push(repoToCard(repo, locale, pinnedNames.has(key)))
  }

  if (cards.length === 0) {
    return projectsConfig
      .filter((p) => !p.hidden)
      .map((p) => {
        const { src, pending } = resolveProjectImage(p.repoName ?? p.key, p.image)
        return {
          id: p.key,
          name: p.name,
          image: src,
          imagePending: pending,
          description: p.description[locale],
          languages: p.languages,
          urlProject: p.urlProject,
          urlGitHub: p.urlGitHub,
          pinned: p.featured ?? false
        }
      })
  }

  return cards
}

export const PROJECT_FILTER_OPTIONS = [
  'React',
  'Typescript',
  'Javascript',
  'Node',
  'API',
  'CSS',
  'HTML'
] as const

export type ProjectFilterOption = (typeof PROJECT_FILTER_OPTIONS)[number]

export function filterProjectsMulti (
  projects: ProjectCardData[],
  selected: string[]
): ProjectCardData[] {
  if (selected.length === 0) return projects

  return projects.filter((p) =>
    selected.every((filter) =>
      p.languages.some((lang) =>
        lang.toLowerCase().includes(filter.toLowerCase())
      )
    )
  )
}

export function collectAvailableFilters (
  projects: ProjectCardData[]
): string[] {
  const set = new Set<string>()
  for (const p of projects) {
    for (const lang of p.languages) {
      const normalized = PROJECT_FILTER_OPTIONS.find(
        (f) => f.toLowerCase() === lang.toLowerCase()
      )
      if (normalized) set.add(normalized)
    }
  }
  return PROJECT_FILTER_OPTIONS.filter((f) => set.has(f))
}
