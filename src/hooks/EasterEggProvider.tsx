import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EasterEggContext } from './EasterEggContext'
import { EasterEggId, TOTAL_EGGS } from './useEasterEgg.types'

const STORAGE_KEY = 'eggs-unlocked'

function loadUnlocked (): Set<EasterEggId> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as EasterEggId[])
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
  const [showDevScreen, setShowDevScreen] = useState(false)
  const [accentOverride, setAccentOverride] = useState(false)
  const [showExplorerBadge, setShowExplorerBadge] = useState(false)
  const [logoClickTimer, setLogoClickTimer] = useState<number | null>(null)
  const [wasAtBottom, setWasAtBottom] = useState(false)
  const portfolioClicksRef = useRef(0)
  const logoClicksRef = useRef(0)
  const scrollCyclesRef = useRef(0)

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

  const incrementPortfolioClick = useCallback(() => {
    portfolioClicksRef.current += 1
    if (portfolioClicksRef.current >= 30) {
      unlock('portfolio-clicks')
      setShowDevScreen(true)
    }
  }, [unlock])

  const incrementLogoClick = useCallback(() => {
    if (logoClickTimer) window.clearTimeout(logoClickTimer)
    logoClicksRef.current += 1
    if (logoClicksRef.current >= 5) {
      unlock('logo-clicks')
      console.log(
        '%c RV Secret %c https://github.com/RafaelHDSV/Plann.er ',
        'background:#38bdf8;color:#0a0a0b;padding:4px 8px;border-radius:4px;font-weight:bold',
        'color:#a1a1aa'
      )
      logoClicksRef.current = 0
    }
    const timer = window.setTimeout(() => {
      logoClicksRef.current = 0
    }, 2000)
    setLogoClickTimer(timer)
  }, [logoClickTimer, unlock])

  const trackScrollCycle = useCallback(() => {
    const atBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
    const atTop = window.scrollY < 50

    if (atBottom) setWasAtBottom(true)
    if (atTop && wasAtBottom) {
      scrollCyclesRef.current += 1
      if (scrollCyclesRef.current >= 3) {
        unlock('scroll-explorer')
        setShowExplorerBadge(true)
        window.setTimeout(() => setShowExplorerBadge(false), 5000)
      }
      setWasAtBottom(false)
    }
  }, [wasAtBottom, unlock])

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
            setAccentOverride(true)
            document.documentElement.classList.add('easter-egg-accent')
            window.setTimeout(() => {
              setAccentOverride(false)
              document.documentElement.classList.remove('easter-egg-accent')
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

  useEffect(() => {
    window.addEventListener('scroll', trackScrollCycle, { passive: true })
    return () => window.removeEventListener('scroll', trackScrollCycle)
  }, [trackScrollCycle])

  const value = useMemo(
    () => ({
      unlocked,
      unlock,
      isUnlocked,
      totalUnlocked: unlocked.size,
      totalEggs: TOTAL_EGGS,
      showDevScreen,
      setShowDevScreen,
      accentOverride,
      setAccentOverride,
      showExplorerBadge,
      incrementPortfolioClick,
      incrementLogoClick,
      trackScrollCycle
    }),
    [
      unlocked,
      unlock,
      isUnlocked,
      showDevScreen,
      accentOverride,
      showExplorerBadge,
      incrementPortfolioClick,
      incrementLogoClick,
      trackScrollCycle
    ]
  )

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  )
}
