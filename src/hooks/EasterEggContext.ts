import { createContext } from 'react'
import { EasterEggId } from './useEasterEgg.types'

export interface EasterEggContextValue {
  unlocked: Set<EasterEggId>
  unlock: (id: EasterEggId) => void
  isUnlocked: (id: EasterEggId) => boolean
  totalUnlocked: number
  totalEggs: number
  logoRevealActive: boolean
  rocketLaunchActive: boolean
  sectionTourProgress: number
  catalogRevealAll: boolean
  incrementLogoClick: () => void
  incrementArrowClick: () => void
  registerThemeToggle: () => void
  registerSectionVisit: (sectionId: string) => void
  revealAllInCatalog: () => void
  triggerRocketLaunch: () => void
}

export const EasterEggContext = createContext<EasterEggContextValue | null>(
  null
)
