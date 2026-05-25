import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { EasterEggToastData } from '../components/EasterEggToast/EasterEggToast'
import { EasterEggContext, EasterEggToastOptions } from './EasterEggContext'
import { EasterEggId, SECTION_TOUR_IDS, TOTAL_EGGS } from './useEasterEgg.types'

const STORAGE_KEY = 'eggs-unlocked'
const SECTIONS_KEY = 'egg-sections-visited'

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

function loadVisitedSections (): Set<string> {
  try {
    const raw = sessionStorage.getItem(SECTIONS_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    return new Set(parsed.filter((id) => SECTION_TOUR_IDS.includes(id as typeof SECTION_TOUR_IDS[number])))
  } catch {
    return new Set()
  }
}

function saveUnlocked (set: Set<EasterEggId>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

function saveVisitedSections (set: Set<string>) {
  sessionStorage.setItem(SECTIONS_KEY, JSON.stringify([...set]))
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
  const [activeToast, setActiveToast] = useState<EasterEggToastData | null>(null)
  const [catalogRevealAll, setCatalogRevealAll] = useState(false)
  const unlockedRef = useRef(unlocked)
  const logoClicksRef = useRef(0)
  const logoTimerRef = useRef<number | null>(null)
  const arrowClicksRef = useRef(0)
  const arrowTimerRef = useRef<number | null>(null)
  const themeTogglesRef = useRef(0)
  const themeTimerRef = useRef<number | null>(null)
  const visitedSectionsRef = useRef<Set<string>>(loadVisitedSections())
  const toastTimerRef = useRef<number | null>(null)

  useEffect(() => {
    unlockedRef.current = unlocked
  }, [unlocked])

  const showToast = useCallback((
    messageKey: string,
    options: EasterEggToastOptions = {}
  ) => {
    const { duration = 5000, eggId, progress } = options

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }

    setActiveToast({ messageKey, eggId, progress })

    toastTimerRef.current = window.setTimeout(() => {
      setActiveToast(null)
      toastTimerRef.current = null
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

  const applySpaceMode = useCallback(() => {
    document.documentElement.classList.add('space-mode')
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
      showToast('easterEgg.arrowHint', { eggId: 'arrow-hint', duration: 4500 })
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
      showToast('easterEgg.themeHunter', { eggId: 'theme-hunter', duration: 4500 })
      themeTogglesRef.current = 0
    }
    themeTimerRef.current = window.setTimeout(() => {
      themeTogglesRef.current = 0
    }, 3000)
  }, [unlock, showToast])

  const registerSectionVisit = useCallback((sectionId: string) => {
    if (unlockedRef.current.has('section-tour')) return
    if (!SECTION_TOUR_IDS.includes(sectionId as (typeof SECTION_TOUR_IDS)[number])) {
      return
    }

    if (visitedSectionsRef.current.has(sectionId)) return

    visitedSectionsRef.current.add(sectionId)
    saveVisitedSections(visitedSectionsRef.current)

    const count = visitedSectionsRef.current.size
    const progress = count / SECTION_TOUR_IDS.length

    if (count >= SECTION_TOUR_IDS.length) {
      unlock('section-tour')
      showToast('easterEgg.sectionTourDesc', {
        eggId: 'section-tour',
        progress: 1,
        duration: 6000
      })
      return
    }

    showToast('easterEgg.sectionTourProgress', {
      eggId: 'section-tour',
      progress,
      duration: 2800
    })
  }, [unlock, showToast])

  const revealAllInCatalog = useCallback(() => {
    setCatalogRevealAll(true)
  }, [])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') === 'space') {
      unlock('space-mode')
      applySpaceMode()
      showToast('easterEgg.spaceModeActive', {
        eggId: 'space-mode',
        duration: 5500
      })
    }
  }, [unlock, applySpaceMode, showToast])

  useEffect(() => {
    if (unlocked.has('space-mode')) {
      applySpaceMode()
    }
  }, [unlocked, applySpaceMode])

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
          showToast('easterEgg.konamiActive', { eggId: 'konami', duration: 5000 })
          konamiIndex = 0
        }
      } else {
        konamiIndex = 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [unlock, showToast])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    }
  }, [])

  const value = useMemo(
    () => ({
      unlocked,
      unlock,
      isUnlocked,
      totalUnlocked: unlocked.size,
      totalEggs: TOTAL_EGGS,
      activeToast,
      catalogRevealAll,
      incrementLogoClick,
      incrementArrowClick,
      registerThemeToggle,
      registerSectionVisit,
      revealAllInCatalog,
      showToast
    }),
    [
      unlocked,
      unlock,
      isUnlocked,
      activeToast,
      catalogRevealAll,
      incrementLogoClick,
      incrementArrowClick,
      registerThemeToggle,
      registerSectionVisit,
      revealAllInCatalog,
      showToast
    ]
  )

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  )
}
