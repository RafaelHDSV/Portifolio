export type EasterEggId =
  | 'konami'
  | 'logo-clicks'
  | 'scroll-voyage'
  | 'rocket-email'
  | 'vieira-mode'
  | 'theme-hunter'
  | 'arrow-hint'

export const TOTAL_EGGS = 7

/** @deprecated legacy ids — migrated in EasterEggProvider */
export const LEGACY_EGG_IDS = {
  sectionTour: 'scroll-voyage',
  spaceMode: 'vieira-mode'
} as const
