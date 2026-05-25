import { ProjectCardData } from '../components/Card/Card'
import { projectsConfig } from '../constants/projects.config'
import { GITHUB_USERNAME } from '../constants/cv'
import { IGithubResponseRepo } from '../types/IGithub'
import { ReadmeMedia } from './readmeMedia'
import { filterReposForPortfolio } from './repoFilters'

function mapLanguageToFilter (language?: string | null): string[] {
  if (!language) return []
  const map: Record<string, string> = {
    TypeScript: 'Typescript',
    JavaScript: 'Javascript',
    HTML: 'HTML',
    CSS: 'CSS',
    'C#': 'API',
    PHP: 'API'
  }
  return [map[language] ?? language]
}

function mediaToCardFields (media: ReadmeMedia | 'placeholder') {
  if (media === 'placeholder') {
    return { image: '', usesPlaceholder: true as const }
  }

  if (media.type === 'video') {
    return {
      image: media.poster ?? '',
      media,
      usesPlaceholder: !media.poster
    }
  }

  return {
    image: media.url,
    media,
    usesPlaceholder: false as const
  }
}

function repoToCard (
  repo: IGithubResponseRepo,
  locale: 'pt' | 'en',
  pinned: boolean,
  media?: ReadmeMedia | 'placeholder'
): ProjectCardData {
  const repoName = repo.name ?? ''
  const config = projectsConfig.find(
    (p) => p.repoName?.toLowerCase() === repoName.toLowerCase()
  )

  const description = config
    ? config.description[locale]
    : repo.description ?? ''

  if (config?.image && !config.image.includes('icon.png')) {
    return {
      id: config?.key ?? repoName,
      repoName,
      name: config?.name ?? repoName,
      image: config.image,
      usesPlaceholder: false,
      description,
      languages: config?.languages ?? mapLanguageToFilter(repo.language),
      urlProject: repo.homepage ?? config?.urlProject,
      urlGitHub: config?.urlGitHub ?? repo.html_url ?? '',
      pinned,
      private: repo.private
    }
  }

  if (media) {
    const fields = mediaToCardFields(media)
    return {
      id: config?.key ?? repoName,
      repoName,
      name: config?.name ?? repoName,
      description,
      languages: config?.languages ?? mapLanguageToFilter(repo.language),
      urlProject: repo.homepage ?? config?.urlProject,
      urlGitHub: config?.urlGitHub ?? repo.html_url ?? '',
      pinned,
      private: repo.private,
      ...fields
    }
  }

  return {
    id: config?.key ?? repoName,
    repoName,
    name: config?.name ?? repoName,
    image: '',
    usesPlaceholder: true,
    description,
    languages: config?.languages ?? mapLanguageToFilter(repo.language),
    urlProject: repo.homepage ?? config?.urlProject,
    urlGitHub: config?.urlGitHub ?? repo.html_url ?? '',
    pinned,
    private: repo.private
  }
}

export function mergeGitHubProjects (
  pinned: IGithubResponseRepo[],
  recent: IGithubResponseRepo[],
  locale: 'pt' | 'en'
): ProjectCardData[] {
  const pinnedFiltered = filterReposForPortfolio(pinned, GITHUB_USERNAME)
  const pinnedNames = new Set(
    pinnedFiltered.map((r) => r.name?.toLowerCase()).filter(Boolean)
  )

  const recentFiltered = filterReposForPortfolio(recent, GITHUB_USERNAME).filter(
    (r) => !pinnedNames.has(r.name?.toLowerCase() ?? '')
  )

  const ordered: IGithubResponseRepo[] = [
    ...pinnedFiltered,
    ...recentFiltered
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
      .map((p) => ({
        id: p.key,
        repoName: p.repoName ?? p.name,
        name: p.name,
        image: p.image,
        usesPlaceholder: false,
        description: p.description[locale],
        languages: p.languages,
        urlProject: p.urlProject,
        urlGitHub: p.urlGitHub,
        pinned: p.featured ?? false
      }))
  }

  return cards
}

export function applyMediaToCard (
  card: ProjectCardData,
  media: ReadmeMedia | 'placeholder'
): ProjectCardData {
  const fields = mediaToCardFields(media)
  return { ...card, ...fields }
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
