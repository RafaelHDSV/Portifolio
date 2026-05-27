import { GithubRepository } from '../repository/GithubRepository'

import { DemoPriority } from '../types/IProject'

import { parseReadmeMedia, ReadmeMedia } from './readmeMedia'

import {

  findProjectConfig,

  resolveDemoPriority

} from './projectConfigLookup'

import {

  getSessionCachedMedia,

  setSessionCachedMedia

} from './repoMediaSessionCache'



/** Tempo de vida do cache de midia por repo (5 min). */

export const MEDIA_CACHE_TTL_MS = 5 * 60 * 1000



/** Bump ao mudar heuristica de selecao (invalida cache antigo). */

export const MEDIA_CACHE_VERSION = 4



function buildCacheKey (owner: string, repoName: string): string {

  return `v${MEDIA_CACHE_VERSION}/${owner}/${repoName}`

}



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

  value: ReadmeMedia | 'placeholder',

  owner?: string,

  repo?: string

): void {

  mediaCache.set(cacheKey, {

    value,

    expiresAt: Date.now() + MEDIA_CACHE_TTL_MS

  })



  if (owner && repo) {

    setSessionCachedMedia(owner, repo, value)

  }

}



function getCachedMediaWithSession(

  cacheKey: string,

  owner: string,

  repo: string

): ReadmeMedia | 'placeholder' | undefined {

  const memory = getCachedMedia(cacheKey)

  if (memory !== undefined) return memory



  const session = getSessionCachedMedia(owner, repo)

  if (session === undefined) return undefined



  mediaCache.set(cacheKey, {

    value: session,

    expiresAt: Date.now() + MEDIA_CACHE_TTL_MS

  })



  return session

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



type MediaSource = DemoPriority



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

  const config = findProjectConfig(repoName)



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



function demoPriorityChain(priority: DemoPriority): MediaSource[] {

  switch (priority) {

    case 'root':

      return ['root', 'config', 'readme']

    case 'readme':

      return ['readme', 'config', 'root']

    default:

      return ['config', 'root', 'readme']

  }

}



async function resolveMediaSource(

  source: MediaSource,

  owner: string,

  repoName: string

): Promise<ReadmeMedia | null> {

  if (source === 'config') {

    return findConfigMedia(repoName)

  }



  if (source === 'readme') {

    return resolveReadmeMedia(owner, repoName)

  }



  const rootMedia = await resolveRootDemoMedia(owner, repoName)

  if (rootMedia) return rootMedia



  return resolveCommonPathMedia(owner, repoName)

}



export async function resolveRepoMedia(

  owner: string,

  repoName: string

): Promise<ReadmeMedia | 'placeholder'> {

  const cacheKey = buildCacheKey(owner, repoName)

  const cached = getCachedMediaWithSession(cacheKey, owner, repoName)

  if (cached !== undefined) {

    return cached

  }



  const config = findProjectConfig(repoName)

  if (import.meta.env.DEV && config?.forceInclude && config?.forceExclude) {

    console.warn(

      `[resolveRepoMedia] ${repoName}: forceInclude e forceExclude juntos — repo excluido.`

    )

  }



  const chain = demoPriorityChain(resolveDemoPriority(config))



  for (const source of chain) {

    const media = await resolveMediaSource(source, owner, repoName)

    if (media) {

      setCachedMedia(cacheKey, media, owner, repoName)

      return media

    }

  }



  setCachedMedia(cacheKey, 'placeholder', owner, repoName)

  return 'placeholder'

}



/** Expoe lookup de config image para testes e Card fallback. */

export function resolveConfigMediaForRepo(repoName: string): ReadmeMedia | null {

  return findConfigMedia(repoName)

}



/** Limpa cache in-memory (testes). */

export function clearRepoMediaCacheForTests(): void {

  mediaCache.clear()

}


