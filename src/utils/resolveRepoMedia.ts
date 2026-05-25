import { GithubRepository } from '../repository/GithubRepository'
import { projectsConfig } from '../constants/projects.config'
import {
  githubOpenGraphImage,
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

async function resolveRootDemoMedia (
  owner: string,
  repo: string
): Promise<ReadmeMedia | null> {
  let poster: string | undefined

  for (const file of ROOT_IMAGE_FILES) {
    if (await GithubRepository.repoFileExists(owner, repo, file)) {
      poster = rawFileUrl(owner, repo, file)
      break
    }
  }

  for (const file of ROOT_VIDEO_FILES) {
    if (await GithubRepository.repoFileExists(owner, repo, file)) {
      return {
        type: 'video',
        url: rawFileUrl(owner, repo, file),
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
