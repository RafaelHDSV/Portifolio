import { createContext } from 'react'
import type { EasterEggToastData } from '../components/EasterEggToast/EasterEggToast'
import { EasterEggId } from './useEasterEgg.types'

export interface EasterEggToastOptions {
  duration?: number
  eggId?: EasterEggId
  progress?: number
}

export interface EasterEggContextValue {
  unlocked: Set<EasterEggId>
  unlock: (id: EasterEggId) => void
  isUnlocked: (id: EasterEggId) => boolean
  totalUnlocked: number
  totalEggs: number
  activeToast: EasterEggToastData | null
  catalogRevealAll: boolean
  incrementLogoClick: () => void
  incrementArrowClick: () => void
  registerThemeToggle: () => void
  registerSectionVisit: (sectionId: string) => void
  revealAllInCatalog: () => void
  showToast: (messageKey: string, options?: EasterEggToastOptions) => void
}

export const EasterEggContext = createContext<EasterEggContextValue | null>(
  null
)
