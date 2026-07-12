import { useEffect } from 'react'

const NAVBAR_OFFSET_PX = 88
const HOME_SECTION_IDS = new Set([
  'home',
  'about',
  'languages',
  'projects',
  'linkedin-posts',
  'contact'
])

export function isHomeAnchorHash (hash: string): boolean {
  const id = hash.replace(/^#/, '').trim().toLowerCase()
  return HOME_SECTION_IDS.has(id)
}

function scrollToSection (hash: string, behavior: ScrollBehavior = 'smooth'): boolean {
  const id = hash.replace(/^#/, '').trim()
  if (!id) return false

  const element = document.getElementById(id)
  if (!element) return false

  const top = element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET_PX
  window.scrollTo({ top: Math.max(top, 0), behavior })
  return true
}

export function useHashScroll (enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return

    let retryTimer: number | undefined
    let stopTimer: number | undefined

    const clearTimers = () => {
      if (retryTimer !== undefined) window.clearInterval(retryTimer)
      if (stopTimer !== undefined) window.clearTimeout(stopTimer)
      retryTimer = undefined
      stopTimer = undefined
    }

    const ensureScroll = (behavior: ScrollBehavior = 'auto') => {
      const hash = window.location.hash
      if (!hash || !isHomeAnchorHash(hash)) return

      if (scrollToSection(hash, behavior)) {
        clearTimers()
        return
      }

      if (retryTimer !== undefined) return

      let attempts = 0
      retryTimer = window.setInterval(() => {
        attempts += 1

        if (scrollToSection(hash, behavior) || attempts >= 40) {
          clearTimers()
        }
      }, 150)

      stopTimer = window.setTimeout(() => clearTimers(), 8000)
    }

    const onHashChange = () => ensureScroll('smooth')

    ensureScroll('auto')
    window.addEventListener('hashchange', onHashChange)

    return () => {
      clearTimers()
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [enabled])
}
