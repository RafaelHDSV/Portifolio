import { ReadmeMedia } from './readmeMedia'

const CACHE_PREFIX = 'portifolio:repo-media:v4'

type SessionMediaValue = ReadmeMedia | 'placeholder'

function storageKey (owner: string, repo: string): string {
  return `${CACHE_PREFIX}:${owner.toLowerCase()}/${repo.toLowerCase()}`
}

export function getSessionCachedMedia (
  owner: string,
  repo: string
): SessionMediaValue | undefined {
  try {
    const raw = sessionStorage.getItem(storageKey(owner, repo))
    if (!raw) return undefined

    return JSON.parse(raw) as SessionMediaValue
  } catch {
    return undefined
  }
}

export function setSessionCachedMedia (
  owner: string,
  repo: string,
  value: SessionMediaValue
): void {
  try {
    sessionStorage.setItem(storageKey(owner, repo), JSON.stringify(value))
  } catch {
    // quota exceeded or private mode
  }
}
