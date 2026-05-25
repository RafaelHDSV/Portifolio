import { ProjectCardData } from '../components/Card/Card'
import { projectsConfig } from '../constants/projects.config'
import { GITHUB_USERNAME } from '../constants/cv'
import { IGithubResponseRepo } from '../types/IGithub'
import { ReadmeMedia } from './readmeMedia'
import { filterReposForPortfolio } from './repoFilters'

export const PINNED_PROJECT_LIMIT = 6
export const PROJECT_DISPLAY_LIMIT = 18

function githubOgImage (repoName: string): string {
  return `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${encodeURIComponent(repoName)}`
}

function repoGithubStats (repo: IGithubResponseRepo, repoName: string) {
  return {
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    openIssues: repo.open_issues_count ?? 0,
    ogImage: githubOgImage(repoName)
  }
}

export function sortReposByStarsSizeThenRecent (
  a: IGithubResponseRepo,
  b: IGithubResponseRepo
): number {
  const starDiff = (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0)
  if (starDiff !== 0) return starDiff

  const sizeDiff = (b.size ?? 0) - (a.size ?? 0)
  if (sizeDiff !== 0) return sizeDiff

  const dateA = new Date(a.updated_at ?? 0).getTime()
  const dateB = new Date(b.updated_at ?? 0).getTime()
  return dateB - dateA
}

function mapLanguageToFilter (language?: string | null): string[] {
  if (!language) return []
  const map: Record<string, string> = {
    TypeScript: 'Typescript',
    JavaScript: 'Javascript',
    HTML: 'HTML',
    CSS: 'CSS',
    SCSS: 'Sass',
    Sass: 'Sass',
    'C#': 'C#',
    PowerShell: 'PowerShell'
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

  const languages = config?.languages ?? mapLanguageToFilter(repo.language)

  if (media) {
    const fields = mediaToCardFields(media)
    return {
      id: config?.key ?? repoName,
      repoName,
      name: config?.name ?? repoName,
      description,
      languages,
      urlProject: repo.homepage ?? config?.urlProject,
      urlGitHub: config?.urlGitHub ?? repo.html_url ?? '',
      pinned,
      private: repo.private,
      github: repoGithubStats(repo, repoName),
      ...fields
    }
  }

  const fallbackImage =
    config?.image && !config.image.includes('icon.png') ? config.image : ''

  return {
    id: config?.key ?? repoName,
    repoName,
    name: config?.name ?? repoName,
    image: fallbackImage,
    usesPlaceholder: !fallbackImage,
    description,
    languages,
    urlProject: repo.homepage ?? config?.urlProject,
    urlGitHub: config?.urlGitHub ?? repo.html_url ?? '',
    pinned,
    private: repo.private,
    github: repoGithubStats(repo, repoName)
  }
}

export function mergeGitHubProjects (
  pinned: IGithubResponseRepo[],
  recent: IGithubResponseRepo[],
  locale: 'pt' | 'en'
): ProjectCardData[] {
  const pinnedFiltered = filterReposForPortfolio(pinned, GITHUB_USERNAME).slice(
    0,
    PINNED_PROJECT_LIMIT
  )
  const pinnedNames = new Set(
    pinnedFiltered.map((r) => r.name?.toLowerCase()).filter(Boolean)
  )

  const repoByName = new Map<string, IGithubResponseRepo>()

  for (const repo of filterReposForPortfolio(recent, GITHUB_USERNAME)) {
    const key = repo.name?.toLowerCase() ?? ''
    if (!key) continue
    repoByName.set(key, repo)
  }

  for (const repo of pinnedFiltered) {
    const key = repo.name?.toLowerCase() ?? ''
    if (!key) continue
    repoByName.set(key, { ...repoByName.get(key), ...repo })
  }

  const sorted = [...repoByName.values()]
    .sort(sortReposByStarsSizeThenRecent)
    .slice(0, PROJECT_DISPLAY_LIMIT)

  const cards = sorted.map((repo) => {
    const key = repo.name?.toLowerCase() ?? ''
    return repoToCard(repo, locale, pinnedNames.has(key))
  })

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
  if (media === 'placeholder') {
    if (card.image && !card.usesPlaceholder) return card
    return { ...card, image: '', usesPlaceholder: true }
  }

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
  'HTML',
  'Sass',
  'C#',
  'PowerShell'
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
      set.add(lang)
    }
  }

  const known = PROJECT_FILTER_OPTIONS.filter((f) =>
    [...set].some((lang) => lang.toLowerCase() === f.toLowerCase())
  )
  const extra = [...set]
    .filter(
      (lang) =>
        !PROJECT_FILTER_OPTIONS.some(
          (f) => f.toLowerCase() === lang.toLowerCase()
        )
    )
    .sort((a, b) => a.localeCompare(b))

  return [...known, ...extra]
}
