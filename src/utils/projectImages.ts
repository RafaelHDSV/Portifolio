import { projectsConfig } from '../constants/projects.config'

const PLACEHOLDER = '/icon.png'

export function resolveProjectImage (
  repoName: string,
  configImage?: string
): { src: string; pending: boolean } {
  if (configImage && configImage !== PLACEHOLDER) {
    return { src: configImage, pending: false }
  }

  const config = projectsConfig.find(
    (p) => p.repoName?.toLowerCase() === repoName.toLowerCase()
  )

  if (config?.image && config.image !== PLACEHOLDER) {
    return { src: config.image, pending: false }
  }

  return { src: PLACEHOLDER, pending: true }
}
