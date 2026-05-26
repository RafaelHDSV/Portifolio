const CACHE_PREFIX = 'portifolio:github-langs:v1'

interface LanguagesCachePayload {
  schemaVersion: 1
  owner: string
  repoKey: string
  data: Record<string, string[]>
}

function buildRepoKey (repoNames: string[]): string {
  return [...new Set(repoNames.map((name) => name.trim().toLowerCase()).filter(Boolean))]
    .sort()
    .join('|')
}

function readStorage (key: string): LanguagesCachePayload | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null

    const parsed = JSON.parse(raw) as LanguagesCachePayload
    if (parsed.schemaVersion !== 1) return null

    return parsed
  } catch {
    return null
  }
}

export function getCachedRepoLanguages (
  owner: string,
  repoNames: string[]
): Map<string, string[]> | null {
  const repoKey = buildRepoKey(repoNames)
  if (!repoKey) return null

  const storageKey = `${CACHE_PREFIX}:${owner.toLowerCase()}:${repoKey}`
  const payload = readStorage(storageKey)
  if (!payload) return null
  if (payload.owner.toLowerCase() !== owner.toLowerCase()) return null
  if (payload.repoKey !== repoKey) return null

  return new Map(
    Object.entries(payload.data).map(([name, langs]) => [name.toLowerCase(), langs])
  )
}

export function setCachedRepoLanguages (
  owner: string,
  repoNames: string[],
  data: Map<string, string[]>
): void {
  const repoKey = buildRepoKey(repoNames)
  if (!repoKey) return

  const storageKey = `${CACHE_PREFIX}:${owner.toLowerCase()}:${repoKey}`
  const payload: LanguagesCachePayload = {
    schemaVersion: 1,
    owner,
    repoKey,
    data: Object.fromEntries(data.entries())
  }

  try {
    sessionStorage.setItem(storageKey, JSON.stringify(payload))
  } catch {
    // quota exceeded or private mode
  }
}
