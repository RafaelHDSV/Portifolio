import { useEffect } from 'react'

const HOME_SECTION_IDS = new Set([
  'home',
  'about',
  'languages',
  'projects',
  'linkedin-posts',
  'contact'
])

const ALIGNMENT_TOLERANCE_PX = 12
const STABLE_TICKS_REQUIRED = 3
const RETRY_INTERVAL_MS = 200
const MAX_ATTEMPTS = 40
const MAX_DURATION_MS = 8000

// Eventos de intenção de scroll do visitante. O evento `scroll` fica de fora
// de propósito: ele também dispara nas correções do próprio hook.
const USER_INTENT_EVENTS = [
  'wheel',
  'touchstart',
  'pointerdown',
  'keydown'
] as const

export function isHomeAnchorHash (hash: string): boolean {
  const id = hash.replace(/^#/, '').trim().toLowerCase()
  return HOME_SECTION_IDS.has(id)
}

function readScrollMarginTop (element: HTMLElement): number {
  const margin = parseFloat(getComputedStyle(element).scrollMarginTop)
  return Number.isFinite(margin) ? margin : 0
}

function isSectionAligned (element: HTMLElement): boolean {
  const expectedTop = readScrollMarginTop(element)
  const currentTop = element.getBoundingClientRect().top
  return Math.abs(currentTop - expectedTop) <= ALIGNMENT_TOLERANCE_PX
}

export function useHashScroll (enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return

    let retryTimer: number | undefined
    let stopTimer: number | undefined
    let stableTicks = 0
    let attempts = 0
    let userTookOver = false

    const clearTimers = () => {
      if (retryTimer !== undefined) window.clearInterval(retryTimer)
      if (stopTimer !== undefined) window.clearTimeout(stopTimer)
      retryTimer = undefined
      stopTimer = undefined
    }

    const releaseToUser = () => {
      userTookOver = true
      clearTimers()
    }

    const ensureScroll = (behavior: ScrollBehavior = 'auto') => {
      const hash = window.location.hash
      if (!hash || !isHomeAnchorHash(hash)) return
      if (userTookOver) return

      clearTimers()
      stableTicks = 0
      attempts = 0

      const tick = () => {
        attempts += 1
        const id = hash.replace(/^#/, '').trim()
        const element = document.getElementById(id)

        if (!element) {
          if (attempts >= MAX_ATTEMPTS) clearTimers()
          return
        }

        const tickBehavior = attempts === 1 ? behavior : 'auto'

        if (!isSectionAligned(element)) {
          element.scrollIntoView({ block: 'start', behavior: tickBehavior })
          stableTicks = 0
        } else {
          stableTicks += 1
        }

        if (stableTicks >= STABLE_TICKS_REQUIRED || attempts >= MAX_ATTEMPTS) {
          clearTimers()
        }
      }

      tick()
      retryTimer = window.setInterval(tick, RETRY_INTERVAL_MS)
      stopTimer = window.setTimeout(clearTimers, MAX_DURATION_MS)
    }

    // Uma nova âncora é intenção explícita de navegar: devolve o controle ao hook.
    const onHashChange = () => {
      userTookOver = false
      ensureScroll('smooth')
    }

    const onLoad = () => ensureScroll('auto')

    ensureScroll('auto')
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('load', onLoad)
    USER_INTENT_EVENTS.forEach((event) => {
      window.addEventListener(event, releaseToUser, { passive: true })
    })
    void document.fonts.ready.then(() => ensureScroll('auto'))

    return () => {
      clearTimers()
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('load', onLoad)
      USER_INTENT_EVENTS.forEach((event) => {
        window.removeEventListener(event, releaseToUser)
      })
    }
  }, [enabled])
}
