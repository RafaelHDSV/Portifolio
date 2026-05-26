import { projectsConfig } from '../constants/projects.config'
import { GithubRepository } from '../repository/GithubRepository'
import { parseReadmeMedia, ReadmeMedia } from './readmeMedia'

/** Tempo de vida do cache de midia por repo (5 min). */
export const MEDIA_CACHE_TTL_MS = 5 * 60 * 1000

interface MediaCacheEntry {
  value: ReadmeMedia | 'placeholder'
  expiresAt: number
}

const mediaCache = new Map<string, MediaCacheEntry>()

function getCachedMedia(
  cacheKey: string
): ReadmeMedia | 'placeholder' | undefined {
  const entry = mediaCache.get(cacheKey)
  if (!entry) return undefined

  if (Date.now() >= entry.expiresAt) {
    mediaCache.delete(cacheKey)
    return undefined
  }

  return entry.value
}

function setCachedMedia(
  cacheKey: string,
  value: ReadmeMedia | 'placeholder'
): void {
  mediaCache.set(cacheKey, {
    value,
    expiresAt: Date.now() + MEDIA_CACHE_TTL_MS
  })
}

const ROOT_VIDEO_FILES = ['demo.mp4', 'demo.webm', 'demo.mov'] as const
const ROOT_IMAGE_FILES = [
  'demo.png',
  'demo.jpg',
  'demo.jpeg',
  'demo.webp',
  'demo.gif',
  'desktop.png',
  'desktop.jpg',
  'desktop.jpeg',
  'desktop.webp',
  'mobile.png',
  'preview.png',
  'screenshot.png'
] as const

function rawFileUrl(owner: string, repo: string, file: string): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${file}`
}

function configImageToMedia(url: string): ReadmeMedia {
  return {
    type: url.toLowerCase().includes('.gif') ? 'gif' : 'image',
    url
  }
}

function findConfigMedia(repoName: string): ReadmeMedia | null {
  const config = projectsConfig.find(
    (p) => p.repoName?.toLowerCase() === repoName.toLowerCase()
  )

  if (config?.image && !config.image.endsWith('/icon.png')) {
    return configImageToMedia(config.image)
  }

  return null
}

async function rawFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

async function resolveRootDemoMedia(
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

export async function resolveRepoMedia(
  owner: string,
  repoName: string
): Promise<ReadmeMedia | 'placeholder'> {
  const cacheKey = `${owner}/${repoName}`
  const cached = getCachedMedia(cacheKey)
  if (cached !== undefined) {
    return cached
  }

  const rootMedia = await resolveRootDemoMedia(owner, repoName)
  if (rootMedia) {
    setCachedMedia(cacheKey, rootMedia)
    return rootMedia
  }

  const configMedia = findConfigMedia(repoName)
  if (configMedia) {
    setCachedMedia(cacheKey, configMedia)
    return configMedia
  }

  try {
    const readme = await GithubRepository.getReadme(owner, repoName)
    const parsed = parseReadmeMedia(readme, owner, repoName)
    if (parsed) {
      setCachedMedia(cacheKey, parsed)
      return parsed
    }
  } catch {
    // fallback below
  }

  setCachedMedia(cacheKey, 'placeholder')
  return 'placeholder'
}
