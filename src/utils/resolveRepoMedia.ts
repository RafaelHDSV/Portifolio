import { GithubRepository } from '../repository/GithubRepository'
import { projectsConfig } from '../constants/projects.config'
import {
  githubOpenGraphImage,
  parseReadmeMedia,
  ReadmeMedia
} from './readmeMedia'

const mediaCache = new Map<string, ReadmeMedia | 'placeholder'>()

export async function resolveRepoMedia (
  owner: string,
  repoName: string,
  configImage?: string
): Promise<ReadmeMedia | 'placeholder'> {
  const cacheKey = `${owner}/${repoName}`
  if (mediaCache.has(cacheKey)) {
    return mediaCache.get(cacheKey)!
  }

  if (configImage && !configImage.endsWith('/icon.png')) {
    const media: ReadmeMedia = {
      type: configImage.toLowerCase().includes('.gif') ? 'gif' : 'image',
      url: configImage
    }
    mediaCache.set(cacheKey, media)
    return media
  }

  const config = projectsConfig.find(
    (p) => p.repoName?.toLowerCase() === repoName.toLowerCase()
  )

  if (config?.image && !config.image.endsWith('/icon.png')) {
    const media: ReadmeMedia = {
      type: config.image.toLowerCase().includes('.gif') ? 'gif' : 'image',
      url: config.image
    }
    mediaCache.set(cacheKey, media)
    return media
  }

  try {
    const readme = await GithubRepository.getReadme(owner, repoName)
    const parsed = parseReadmeMedia(readme, owner, repoName)
    if (parsed) {
      mediaCache.set(cacheKey, parsed)
      return parsed
    }
  } catch {
    // fallback below
  }

  const og = githubOpenGraphImage(owner, repoName)
  const media: ReadmeMedia = { type: 'image', url: og }
  mediaCache.set(cacheKey, media)
  return media
}
