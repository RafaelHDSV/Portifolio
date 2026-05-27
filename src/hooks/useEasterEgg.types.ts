export type EasterEggId =
  | 'konami'
  | 'logo-clicks'
  | 'locale-hopper'
  | 'rocket-email'
  | 'vieira-mode'
  | 'theme-hunter'
  | 'arrow-hint'
  | 'filter-ninja'

export const TOTAL_EGGS = 8

/** @deprecated legacy ids — migrated in EasterEggProvider */
export const LEGACY_EGG_IDS = {
  sectionTour: 'locale-hopper',
  scrollVoyage: 'locale-hopper',
  spaceMode: 'vieira-mode'
} as const
