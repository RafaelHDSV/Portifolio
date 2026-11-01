const RELOAD_FLAG = 'vieira:stale-asset-reload'

const STALE_ASSET_RE =
  /Unable to preload CSS|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i

export type FlagStorage = Pick<Storage, 'getItem' | 'setItem'>

export function isStaleAssetError(error: unknown): boolean {
  if (!error) return false
  const message = error instanceof Error ? error.message : String(error)
  return STALE_ASSET_RE.test(message)
}

function defaultReload(): void {
  window.location.reload()
}

function defaultStorage(): FlagStorage | null {
  try {
    return sessionStorage
  } catch {
    return null
  }
}

export function installStaleAssetRecovery(reload: () => void = defaultReload): void {
  if (typeof window === 'undefined') return

  window.addEventListener('vite:preloadError', (event: Event) => {
    event.preventDefault()
    recoverFromStaleAsset(reload)
  })
}

export function recoverFromStaleAsset(
  reload: () => void = defaultReload,
  storage: FlagStorage | null = defaultStorage()
): boolean {
  if (storage) {
    try {
      if (storage.getItem(RELOAD_FLAG)) return false
      storage.setItem(RELOAD_FLAG, '1')
    } catch {
      // storage indisponível: tenta um reload mesmo assim
    }
  }
  reload()
  return true
}
