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
  'main.png',
  'desktop.png',
  'desktop.jpg',
  'desktop.jpeg',
  'desktop.webp',
  'mobile.png',
  'preview.png',
  'screenshot.png'
] as const

/** Caminhos frequentes em READMEs (public/, images/, media/). */
const COMMON_MEDIA_PATHS = [
  'public/main.png',
  'public/desktop.png',
  'public/mobile.png',
  'public/assets/header.png',
  'public/assets/full-project.png',
  'images/main.png',
  'images/desktop.png',
  'images/mobile.png',
  'media/demo.gif'
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

async function resolveCommonPathMedia(
  owner: string,
  repo: string
): Promise<ReadmeMedia | null> {
  for (const file of COMMON_MEDIA_PATHS) {
    const url = rawFileUrl(owner, repo, file)
    if (
      (await GithubRepository.repoFileExists(owner, repo, file)) ||
      (await rawFileExists(url))
    ) {
      return {
        type: file.includes('.gif') ? 'gif' : 'image',
        url
      }
    }
  }

  return null
}

async function fetchReadmeContent(
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    return await GithubRepository.getReadme(owner, repo)
  } catch {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`
      )
      if (!response.ok) return null
      return await response.text()
    } catch {
      return null
    }
  }
}

async function resolveReadmeMedia(
  owner: string,
  repo: string
): Promise<ReadmeMedia | null> {
  const readme = await fetchReadmeContent(owner, repo)
  if (!readme) return null
  return parseReadmeMedia(readme, owner, repo)
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

  const configMedia = findConfigMedia(repoName)
  if (configMedia) {
    setCachedMedia(cacheKey, configMedia)
    return configMedia
  }

  const readmeMedia = await resolveReadmeMedia(owner, repoName)
  if (readmeMedia) {
    setCachedMedia(cacheKey, readmeMedia)
    return readmeMedia
  }

  const commonMedia = await resolveCommonPathMedia(owner, repoName)
  if (commonMedia) {
    setCachedMedia(cacheKey, commonMedia)
    return commonMedia
  }

  const rootMedia = await resolveRootDemoMedia(owner, repoName)
  if (rootMedia) {
    setCachedMedia(cacheKey, rootMedia)
    return rootMedia
  }

  setCachedMedia(cacheKey, 'placeholder')
  return 'placeholder'
}
