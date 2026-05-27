import { useEffect } from 'react'

const ROBOTS_SELECTOR = 'meta[name="robots"]'
const NOINDEX_CONTENT = 'noindex, nofollow'

export function useRecruiterNoIndex (active: boolean): void {
  useEffect(() => {
    if (!active) return

    let meta = document.querySelector(ROBOTS_SELECTOR) as HTMLMetaElement | null
    const hadMeta = Boolean(meta)
    const previousContent = meta?.getAttribute('content')

    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'robots'
      document.head.appendChild(meta)
    }

    meta.content = NOINDEX_CONTENT

    return () => {
      if (!meta) return

      if (hadMeta && previousContent) {
        meta.content = previousContent
      } else {
        meta.remove()
      }
    }
  }, [active])
}
