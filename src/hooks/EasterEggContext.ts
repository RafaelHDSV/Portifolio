import { createContext } from 'react'
import { EasterEggId } from './useEasterEgg.types'

export interface EasterEggContextValue {
  unlocked: Set<EasterEggId>
  unlock: (id: EasterEggId) => void
  isUnlocked: (id: EasterEggId) => boolean
  totalUnlocked: number
  totalEggs: number
  showExplorerBadge: boolean
  explorerMessage: string | null
  incrementLogoClick: () => void
  incrementArrowClick: () => void
  registerThemeToggle: () => void
}

export const EasterEggContext = createContext<EasterEggContextValue | null>(
  null
)
