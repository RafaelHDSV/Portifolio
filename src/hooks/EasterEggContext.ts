import { createContext } from 'react'
import { EasterEggId } from './useEasterEgg.types'

export interface EasterEggContextValue {
  unlocked: Set<EasterEggId>
  unlock: (id: EasterEggId) => void
  isUnlocked: (id: EasterEggId) => boolean
  totalUnlocked: number
  totalEggs: number
  showDevScreen: boolean
  setShowDevScreen: (show: boolean) => void
  accentOverride: boolean
  setAccentOverride: (active: boolean) => void
  showExplorerBadge: boolean
  incrementPortfolioClick: () => void
  incrementLogoClick: () => void
  trackScrollCycle: () => void
}

export const EasterEggContext = createContext<EasterEggContextValue | null>(
  null
)
