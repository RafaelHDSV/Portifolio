import { projectsConfig } from '../constants/projects.config'
import { IProjectConfig, DemoPriority } from '../types/IProject'

export function findProjectConfig (repoName: string): IProjectConfig | undefined {
  const normalized = repoName.trim().toLowerCase()
  if (!normalized) return undefined

  return projectsConfig.find(
    (project) => project.repoName?.toLowerCase() === normalized
  )
}

export function isProjectForceExcluded (config?: IProjectConfig): boolean {
  if (!config) return false
  return Boolean(config.forceExclude || config.hidden)
}

export function isProjectForceIncluded (config?: IProjectConfig): boolean {
  if (!config) return false
  return Boolean(config.forceInclude)
}

export function resolveDemoPriority (config?: IProjectConfig): DemoPriority {
  return config?.demoPriority ?? 'config'
}

export function listForceIncludeConfigs (): IProjectConfig[] {
  return projectsConfig.filter(
    (project) =>
      isProjectForceIncluded(project) && !isProjectForceExcluded(project)
  )
}
