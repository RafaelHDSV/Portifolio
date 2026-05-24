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
  hidden?: boolean
  order?: number
}

export interface IProject extends IProjectConfig {
  descriptionText: string
}
