import { GithubRepository } from '../repository/GithubRepository'
import { projectsConfig } from '../constants/projects.config'
import {
  parseReadmeMedia,
  ReadmeMedia
} from './readmeMedia'

const mediaCache = new Map<string, ReadmeMedia | 'placeholder'>()

const ROOT_VIDEO_FILES = ['demo.mp4', 'demo.webm', 'demo.mov'] as const
const ROOT_IMAGE_FILES = ['demo.png', 'demo.jpg', 'demo.jpeg', 'demo.webp', 'demo.gif'] as const

function rawFileUrl (owner: string, repo: string, file: string): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${file}`
}

function configImageToMedia (url: string): ReadmeMedia {
  return {
    type: url.toLowerCase().includes('.gif') ? 'gif' : 'image',
    url
  }
}

function findConfigMedia (repoName: string): ReadmeMedia | null {
  const config = projectsConfig.find(
    (p) => p.repoName?.toLowerCase() === repoName.toLowerCase()
  )

  if (config?.image && !config.image.endsWith('/icon.png')) {
    return configImageToMedia(config.image)
  }

  return null
}

async function rawFileExists (url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

async function resolveRootDemoMedia (
  owner: string,
  repo: string
): Promise<ReadmeMedia | null> {
  let poster: string | undefined

  for (const file of ROOT_IMAGE_FILES) {
    const url = rawFileUrl(owner, repo, file)
    if (
      (await GithubRepository.repoFileExists(owner, repo, file)) ||
      (await rawFileExists(url))
    ) {
      poster = url
      break
    }
  }

  for (const file of ROOT_VIDEO_FILES) {
    const url = rawFileUrl(owner, repo, file)
    if (
      (await GithubRepository.repoFileExists(owner, repo, file)) ||
      (await rawFileExists(url))
    ) {
      return {
        type: 'video',
        url,
        poster
      }
    }
  }

  if (poster) {
    return {
      type: poster.includes('.gif') ? 'gif' : 'image',
      url: poster
    }
  }

  return null
}

export async function resolveRepoMedia (
  owner: string,
  repoName: string
): Promise<ReadmeMedia | 'placeholder'> {
  const cacheKey = `${owner}/${repoName}`
  if (mediaCache.has(cacheKey)) {
    return mediaCache.get(cacheKey)!
  }

  const rootMedia = await resolveRootDemoMedia(owner, repoName)
  if (rootMedia) {
    mediaCache.set(cacheKey, rootMedia)
    return rootMedia
  }

  const configMedia = findConfigMedia(repoName)
  if (configMedia) {
    mediaCache.set(cacheKey, configMedia)
    return configMedia
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

  mediaCache.set(cacheKey, 'placeholder')
  return 'placeholder'
}
