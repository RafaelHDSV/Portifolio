export type DemoPriority = 'root' | 'config' | 'readme'

export interface IProjectConfig {
  key: string
  repoName?: string
  name: string
  image: string
  description: { pt: string; en: string }
  languages: string[]
  urlProject?: string
  urlGitHub: string
  featured?: boolean
  /** @deprecated Prefer forceExclude */
  hidden?: boolean
  forceInclude?: boolean
  forceExclude?: boolean
  demoPriority?: DemoPriority
  order?: number
}

export interface IProject extends IProjectConfig {
  descriptionText: string
}
