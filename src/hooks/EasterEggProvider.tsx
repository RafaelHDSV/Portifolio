import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EasterEggContext } from './EasterEggContext'
import { EasterEggId, SECTION_TOUR_IDS, TOTAL_EGGS } from './useEasterEgg.types'

const STORAGE_KEY = 'eggs-unlocked'
const SECTIONS_KEY = 'egg-sections-visited'

const EGG_EFFECT_CLASSES: Partial<Record<EasterEggId, string>> = {
  'logo-clicks': 'egg-blueprint-mode',
  'section-tour': 'egg-section-tour-done',
  'theme-hunter': 'egg-theme-spectrum',
  'arrow-hint': 'egg-arrow-travel',
  'rocket-email': 'egg-rocket-launch',
  konami: 'easter-egg-accent'
}

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

function flashSection (sectionId: string) {
  const el = document.getElementById(sectionId)
  if (!el) return
  el.classList.add('egg-section-flash')
  window.setTimeout(() => el.classList.remove('egg-section-flash'), 1800)
}

function playEggEffect (id: EasterEggId, durationMs: number) {
  const className = EGG_EFFECT_CLASSES[id]
  if (!className) return

  document.documentElement.classList.add(className)
  window.setTimeout(() => {
    document.documentElement.classList.remove(className)
  }, durationMs)
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
  const [logoRevealActive, setLogoRevealActive] = useState(false)
  const [rocketLaunchActive, setRocketLaunchActive] = useState(false)
  const [arrowTravelActive, setArrowTravelActive] = useState(false)
  const [sectionTourProgress, setSectionTourProgress] = useState(0)
  const [sectionTourVisitedCount, setSectionTourVisitedCount] = useState(
    () => loadVisitedSections().size
  )
  const [catalogRevealAll, setCatalogRevealAll] = useState(false)
  const unlockedRef = useRef(unlocked)
  const logoClicksRef = useRef(0)
  const logoTimerRef = useRef<number | null>(null)
  const arrowClicksRef = useRef(0)
  const arrowTimerRef = useRef<number | null>(null)
  const themeTogglesRef = useRef(0)
  const themeTimerRef = useRef<number | null>(null)
  const visitedSectionsRef = useRef<Set<string>>(loadVisitedSections())

  useEffect(() => {
    unlockedRef.current = unlocked
  }, [unlocked])

  useEffect(() => {
    const count = visitedSectionsRef.current.size
    setSectionTourVisitedCount(count)
    setSectionTourProgress(count / SECTION_TOUR_IDS.length)
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
      setLogoRevealActive(true)
      playEggEffect('logo-clicks', 14000)
      window.setTimeout(() => setLogoRevealActive(false), 14000)
      logoClicksRef.current = 0
    }
    logoTimerRef.current = window.setTimeout(() => {
      logoClicksRef.current = 0
    }, 2000)
  }, [unlock])

  const incrementArrowClick = useCallback(() => {
    if (arrowTimerRef.current) window.clearTimeout(arrowTimerRef.current)
    arrowClicksRef.current += 1
    if (arrowClicksRef.current >= 5) {
      unlock('arrow-hint')
      setArrowTravelActive(true)
      playEggEffect('arrow-hint', 5000)
      window.setTimeout(() => setArrowTravelActive(false), 5000)
      arrowClicksRef.current = 0
    }
    arrowTimerRef.current = window.setTimeout(() => {
      arrowClicksRef.current = 0
    }, 2000)
  }, [unlock])

  const registerThemeToggle = useCallback(() => {
    if (themeTimerRef.current) window.clearTimeout(themeTimerRef.current)
    themeTogglesRef.current += 1
    if (themeTogglesRef.current >= 5) {
      unlock('theme-hunter')
      playEggEffect('theme-hunter', 5000)
      themeTogglesRef.current = 0
    }
    themeTimerRef.current = window.setTimeout(() => {
      themeTogglesRef.current = 0
    }, 3000)
  }, [unlock])

  const registerSectionVisit = useCallback((sectionId: string) => {
    if (unlockedRef.current.has('section-tour')) return
    if (!SECTION_TOUR_IDS.includes(sectionId as (typeof SECTION_TOUR_IDS)[number])) {
      return
    }

    if (visitedSectionsRef.current.has(sectionId)) return

    visitedSectionsRef.current.add(sectionId)
    saveVisitedSections(visitedSectionsRef.current)
    flashSection(sectionId)

    const count = visitedSectionsRef.current.size
    const progress = count / SECTION_TOUR_IDS.length
    setSectionTourVisitedCount(count)
    setSectionTourProgress(progress)

    if (count >= SECTION_TOUR_IDS.length) {
      unlock('section-tour')
      playEggEffect('section-tour', 6000)
    }
  }, [unlock])

  const triggerRocketLaunch = useCallback(() => {
    unlock('rocket-email')
    setRocketLaunchActive(true)
    playEggEffect('rocket-email', 4500)
    window.setTimeout(() => setRocketLaunchActive(false), 4500)
  }, [unlock])

  const revealAllInCatalog = useCallback(() => {
    setCatalogRevealAll(true)
  }, [])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') === 'space') {
      if (!unlockedRef.current.has('space-mode')) {
        unlock('space-mode')
      }
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
      logoRevealActive,
      rocketLaunchActive,
      arrowTravelActive,
      sectionTourProgress,
      sectionTourVisitedCount,
      sectionTourTotal: SECTION_TOUR_IDS.length,
      catalogRevealAll,
      incrementLogoClick,
      incrementArrowClick,
      registerThemeToggle,
      registerSectionVisit,
      revealAllInCatalog,
      triggerRocketLaunch
    }),
    [
      unlocked,
      unlock,
      isUnlocked,
      logoRevealActive,
      rocketLaunchActive,
      arrowTravelActive,
      sectionTourProgress,
      sectionTourVisitedCount,
      catalogRevealAll,
      incrementLogoClick,
      incrementArrowClick,
      registerThemeToggle,
      registerSectionVisit,
      revealAllInCatalog,
      triggerRocketLaunch
    ]
  )

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  )
}
