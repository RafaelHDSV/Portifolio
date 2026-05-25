import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EasterEggContext } from './EasterEggContext'
import { EasterEggId, LEGACY_EGG_IDS, TOTAL_EGGS } from './useEasterEgg.types'

const STORAGE_KEY = 'eggs-unlocked'

const EGG_EFFECT_CLASSES: Partial<Record<EasterEggId, string>> = {
  'logo-clicks': 'egg-blueprint-mode',
  'locale-hopper': 'egg-locale-hopper-done',
  'theme-hunter': 'egg-theme-spectrum',
  'rocket-email': 'egg-vieira-launch',
  konami: 'easter-egg-accent'
}

function migrateEggId (id: string): EasterEggId | null {
  if (
    id === 'scroll-explorer' ||
    id === 'section-tour' ||
    id === 'scroll-voyage'
  ) {
    return LEGACY_EGG_IDS.scrollVoyage
  }
  if (id === 'space-mode') return LEGACY_EGG_IDS.spaceMode

  const valid: EasterEggId[] = [
    'konami',
    'logo-clicks',
    'locale-hopper',
    'rocket-email',
    'vieira-mode',
    'theme-hunter',
    'arrow-hint'
  ]
  return valid.includes(id as EasterEggId) ? (id as EasterEggId) : null
}

function loadUnlocked (): Set<EasterEggId> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    const migrated = parsed
      .map(migrateEggId)
      .filter((id): id is EasterEggId => id !== null)
    return new Set(migrated)
  } catch {
    return new Set()
  }
}

function saveUnlocked (set: Set<EasterEggId>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

function playEggEffect (id: EasterEggId, durationMs: number) {
  const className = EGG_EFFECT_CLASSES[id]
  if (!className) return

  document.documentElement.classList.add(className)
  window.setTimeout(() => {
    document.documentElement.classList.remove(className)
  }, durationMs)
}

function getScrollProgress (): number {
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max <= 0) return 0
  return Math.min(1, Math.max(0, window.scrollY / max))
}

function isVieiraModeUrl (): boolean {
  const mode = new URLSearchParams(window.location.search).get('mode')
  return mode === 'vieira' || mode === 'space'
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
  const [vieiraLaunchActive, setVieiraLaunchActive] = useState(false)
  const [arrowTravelActive, setArrowTravelActive] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [catalogRevealAll, setCatalogRevealAll] = useState(false)
  const unlockedRef = useRef(unlocked)
  const logoClicksRef = useRef(0)
  const logoTimerRef = useRef<number | null>(null)
  const arrowClicksRef = useRef(0)
  const arrowTimerRef = useRef<number | null>(null)
  const themeTogglesRef = useRef(0)
  const themeTimerRef = useRef<number | null>(null)
  const localeTogglesRef = useRef(0)
  const localeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    unlockedRef.current = unlocked
  }, [unlocked])

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
      window.setTimeout(() => setArrowTravelActive(false), 6500)
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

  const registerLocaleToggle = useCallback(() => {
    if (localeTimerRef.current) window.clearTimeout(localeTimerRef.current)
    localeTogglesRef.current += 1
    if (localeTogglesRef.current >= 4) {
      unlock('locale-hopper')
      playEggEffect('locale-hopper', 4000)
      localeTogglesRef.current = 0
    }
    localeTimerRef.current = window.setTimeout(() => {
      localeTogglesRef.current = 0
    }, 5000)
  }, [unlock])

  const triggerVieiraLaunch = useCallback(() => {
    unlock('rocket-email')
    setVieiraLaunchActive(true)
    window.setTimeout(() => setVieiraLaunchActive(false), 6000)
  }, [unlock])

  const revealAllInCatalog = useCallback(() => {
    setCatalogRevealAll(true)
  }, [])

  useEffect(() => {
    if (isVieiraModeUrl() && !unlockedRef.current.has('vieira-mode')) {
      unlock('vieira-mode')
    }
  }, [unlock])

  useEffect(() => {
    const onScroll = () => setScrollProgress(getScrollProgress())

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

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
      vieiraLaunchActive,
      arrowTravelActive,
      scrollProgress,
      catalogRevealAll,
      incrementLogoClick,
      incrementArrowClick,
      registerThemeToggle,
      registerLocaleToggle,
      revealAllInCatalog,
      triggerVieiraLaunch
    }),
    [
      unlocked,
      unlock,
      isUnlocked,
      logoRevealActive,
      vieiraLaunchActive,
      arrowTravelActive,
      scrollProgress,
      catalogRevealAll,
      incrementLogoClick,
      incrementArrowClick,
      registerThemeToggle,
      registerLocaleToggle,
      revealAllInCatalog,
      triggerVieiraLaunch
    ]
  )

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  )
}
