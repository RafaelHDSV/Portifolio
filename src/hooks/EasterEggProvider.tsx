import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EasterEggContext } from './EasterEggContext'
import { EasterEggId, SECTION_TOUR_IDS, TOTAL_EGGS } from './useEasterEgg.types'

const STORAGE_KEY = 'eggs-unlocked'

function loadUnlocked (): Set<EasterEggId> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    const migrated = parsed.map((id) =>
      id === 'scroll-explorer' ? 'section-tour' : id
    )
    const valid: EasterEggId[] = [
      'konami',
      'logo-clicks',
      'section-tour',
      'rocket-email',
      'space-mode',
      'theme-hunter',
      'arrow-hint'
    ]
    return new Set(migrated.filter((id): id is EasterEggId => valid.includes(id as EasterEggId)))
  } catch {
    return new Set()
  }
}

function saveUnlocked (set: Set<EasterEggId>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA'
]

export function EasterEggProvider ({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<Set<EasterEggId>>(loadUnlocked)
  const [showExplorerBadge, setShowExplorerBadge] = useState(false)
  const [explorerMessage, setExplorerMessage] = useState<string | null>(null)
  const [catalogRevealAll, setCatalogRevealAll] = useState(false)
  const logoClicksRef = useRef(0)
  const logoTimerRef = useRef<number | null>(null)
  const arrowClicksRef = useRef(0)
  const arrowTimerRef = useRef<number | null>(null)
  const themeTogglesRef = useRef(0)
  const themeTimerRef = useRef<number | null>(null)
  const visitedSectionsRef = useRef<Set<string>>(new Set())

  const showToast = useCallback((messageKey: string, duration = 5000) => {
    setExplorerMessage(messageKey)
    setShowExplorerBadge(true)
    window.setTimeout(() => {
      setShowExplorerBadge(false)
      setExplorerMessage(null)
    }, duration)
  }, [])

  const unlock = useCallback((id: EasterEggId) => {
    setUnlocked((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      saveUnlocked(next)
      return next
    })
  }, [])

  const isUnlocked = useCallback(
    (id: EasterEggId) => unlocked.has(id),
    [unlocked]
  )

  const incrementLogoClick = useCallback(() => {
    if (logoTimerRef.current) window.clearTimeout(logoTimerRef.current)
    logoClicksRef.current += 1
    if (logoClicksRef.current >= 5) {
      unlock('logo-clicks')
      console.log(
        '%c RV Secret %c https://github.com/RafaelHDSV/Plann.er ',
        'background:var(--color-accent);color:#0a0a0b;padding:4px 8px;border-radius:4px;font-weight:bold',
        'color:#a1a1aa'
      )
      logoClicksRef.current = 0
    }
    logoTimerRef.current = window.setTimeout(() => {
      logoClicksRef.current = 0
    }, 2000)
  }, [unlock])

  const incrementArrowClick = useCallback(() => {
    if (arrowTimerRef.current) window.clearTimeout(arrowTimerRef.current)
    arrowClicksRef.current += 1
    if (arrowClicksRef.current >= 3) {
      unlock('arrow-hint')
      showToast('easterEgg.arrowHint', 4000)
      arrowClicksRef.current = 0
    }
    arrowTimerRef.current = window.setTimeout(() => {
      arrowClicksRef.current = 0
    }, 1500)
  }, [unlock, showToast])

  const registerThemeToggle = useCallback(() => {
    if (themeTimerRef.current) window.clearTimeout(themeTimerRef.current)
    themeTogglesRef.current += 1
    if (themeTogglesRef.current >= 5) {
      unlock('theme-hunter')
      showToast('easterEgg.themeHunter', 4000)
      themeTogglesRef.current = 0
    }
    themeTimerRef.current = window.setTimeout(() => {
      themeTogglesRef.current = 0
    }, 3000)
  }, [unlock, showToast])

  const registerSectionVisit = useCallback((sectionId: string) => {
    if (unlocked.has('section-tour')) return
    if (!SECTION_TOUR_IDS.includes(sectionId as (typeof SECTION_TOUR_IDS)[number])) {
      return
    }

    visitedSectionsRef.current.add(sectionId)

    if (visitedSectionsRef.current.size >= SECTION_TOUR_IDS.length) {
      unlock('section-tour')
      showToast('easterEgg.sectionTourDesc', 5000)
    }
  }, [unlock, unlocked, showToast])

  const revealAllInCatalog = useCallback(() => {
    setCatalogRevealAll(true)
  }, [])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') === 'space') {
      unlock('space-mode')
      console.info('Space mode: extra stars enabled (?mode=space)')
    }
  }, [unlock])

  useEffect(() => {
    let konamiIndex = 0
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === KONAMI[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === KONAMI.length) {
          unlock('konami')
          if (!reducedMotion) {
            document.documentElement.classList.add('easter-egg-accent')
            window.dispatchEvent(new CustomEvent('accent-theme-change'))
            window.setTimeout(() => {
              document.documentElement.classList.remove('easter-egg-accent')
              window.dispatchEvent(new CustomEvent('accent-theme-change'))
            }, 30000)
          }
          konamiIndex = 0
        }
      } else {
        konamiIndex = 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [unlock])

  const value = useMemo(
    () => ({
      unlocked,
      unlock,
      isUnlocked,
      totalUnlocked: unlocked.size,
      totalEggs: TOTAL_EGGS,
      showExplorerBadge,
      explorerMessage,
      catalogRevealAll,
      incrementLogoClick,
      incrementArrowClick,
      registerThemeToggle,
      registerSectionVisit,
      revealAllInCatalog
    }),
    [
      unlocked,
      unlock,
      isUnlocked,
      showExplorerBadge,
      explorerMessage,
      catalogRevealAll,
      incrementLogoClick,
      incrementArrowClick,
      registerThemeToggle,
      registerSectionVisit,
      revealAllInCatalog
    ]
  )

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  )
}
