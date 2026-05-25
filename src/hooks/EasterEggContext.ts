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
  catalogRevealAll: boolean
  incrementLogoClick: () => void
  incrementArrowClick: () => void
  registerThemeToggle: () => void
  registerSectionVisit: (sectionId: string) => void
  revealAllInCatalog: () => void
}

export const EasterEggContext = createContext<EasterEggContextValue | null>(
  null
)
