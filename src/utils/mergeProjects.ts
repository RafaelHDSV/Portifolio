import { ProjectCardData } from '../components/Card/Card'
import { projectsConfig } from '../constants/projects.config'
import { IGithubResponseRepo } from '../types/IGithub'

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

export function mergeProjects (
  repos: IGithubResponseRepo[],
  locale: 'pt' | 'en'
): ProjectCardData[] {
  const configByRepo = new Map(
    projectsConfig
      .filter((p) => p.repoName)
      .map((p) => [p.repoName!.toLowerCase(), p])
  )

  const apiProjects: ProjectCardData[] = repos
    .filter((repo) => {
      const name = repo.name?.toLowerCase() ?? ''
      const config = configByRepo.get(name)
      if (config?.hidden) return false
      return Boolean(repo.homepage) || config?.featured
    })
    .map((repo) => {
      const config = configByRepo.get(repo.name?.toLowerCase() ?? '')
      const description = config
        ? config.description[locale]
        : repo.description ?? ''

      return {
        id: config?.key ?? String(repo.id),
        name: config?.name ?? repo.name ?? 'Project',
        image: config?.image ?? '/icon.png',
        description,
        languages: config?.languages ?? mapLanguageToFilter(repo.language),
        urlProject: repo.homepage ?? config?.urlProject,
        urlGitHub: config?.urlGitHub ?? repo.html_url ?? '',
        featured: config?.featured ?? false
      }
    })

  const staticProjects: ProjectCardData[] = projectsConfig
    .filter((p) => !p.hidden)
    .map((p) => ({
      id: p.key,
      name: p.name,
      image: p.image,
      description: p.description[locale],
      languages: p.languages,
      urlProject: p.urlProject,
      urlGitHub: p.urlGitHub,
      featured: p.featured ?? false
    }))

  const merged = new Map<string, ProjectCardData>()

  for (const project of staticProjects) {
    merged.set(project.id, project)
  }

  for (const project of apiProjects) {
    const existing = merged.get(project.id)
    if (existing) {
      merged.set(project.id, {
        ...existing,
        urlProject: project.urlProject ?? existing.urlProject,
        description: existing.description || project.description
      })
    } else {
      merged.set(project.id, project)
    }
  }

  const configOrder = new Map(
    projectsConfig.map((p, i) => [p.key, p.order ?? i])
  )

  return Array.from(merged.values()).sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return (configOrder.get(a.id) ?? 99) - (configOrder.get(b.id) ?? 99)
  })
}

export function filterProjects (
  projects: ProjectCardData[],
  filter: string
): ProjectCardData[] {
  if (filter === 'all') return projects
  return projects.filter((p) =>
    p.languages.some((lang) => lang.toLowerCase().includes(filter.toLowerCase()))
  )
}
