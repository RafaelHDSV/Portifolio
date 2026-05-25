import { GithubRepository } from '../repository/GithubRepository'
import { projectsConfig } from '../constants/projects.config'
import {
  githubOpenGraphImage,
  parseReadmeMedia,
  ReadmeMedia
} from './readmeMedia'

const mediaCache = new Map<string, ReadmeMedia | 'placeholder'>()

function configImageToMedia (url: string): ReadmeMedia {
  return {
    type: url.toLowerCase().includes('.gif') ? 'gif' : 'image',
    url
  }
}

export async function resolveRepoMedia (
  owner: string,
  repoName: string
): Promise<ReadmeMedia | 'placeholder'> {
  const cacheKey = `${owner}/${repoName}`
  if (mediaCache.has(cacheKey)) {
    return mediaCache.get(cacheKey)!
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

  const config = projectsConfig.find(
    (p) => p.repoName?.toLowerCase() === repoName.toLowerCase()
  )

  if (config?.image && !config.image.endsWith('/icon.png')) {
    const media = configImageToMedia(config.image)
    mediaCache.set(cacheKey, media)
    return media
  }

  const og = githubOpenGraphImage(owner, repoName)
  const media: ReadmeMedia = { type: 'image', url: og }
  mediaCache.set(cacheKey, media)
  return media
}
