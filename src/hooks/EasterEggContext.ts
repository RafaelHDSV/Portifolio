import { createContext } from 'react'
import { EasterEggId } from './useEasterEgg.types'

export interface EasterEggContextValue {
  unlocked: Set<EasterEggId>
  unlock: (id: EasterEggId) => void
  isUnlocked: (id: EasterEggId) => boolean
  totalUnlocked: number
  totalEggs: number
  logoRevealActive: boolean
  vieiraLaunchActive: boolean
  arrowTravelActive: boolean
  scrollProgress: number
  catalogRevealAll: boolean
  incrementLogoClick: () => void
  incrementArrowClick: () => void
  registerThemeToggle: () => void
  registerLocaleToggle: () => void
  revealAllInCatalog: () => void
  triggerVieiraLaunch: () => void
}

export const EasterEggContext = createContext<EasterEggContextValue | null>(
  null
)
