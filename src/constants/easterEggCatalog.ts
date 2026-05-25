import type { EasterEggId } from '../hooks/useEasterEgg.types'

export interface EasterEggCatalogEntry {
  id: EasterEggId
  nameKey: string
  triggerKey: string
  resultKey: string
}

export const EASTER_EGG_CATALOG: EasterEggCatalogEntry[] = [
  {
    id: 'konami',
    nameKey: 'easterEgg.catalog.konami.name',
    triggerKey: 'easterEgg.catalog.konami.trigger',
    resultKey: 'easterEgg.catalog.konami.result'
  },
  {
    id: 'logo-clicks',
    nameKey: 'easterEgg.catalog.logo.name',
    triggerKey: 'easterEgg.catalog.logo.trigger',
    resultKey: 'easterEgg.catalog.logo.result'
  },
  {
    id: 'scroll-explorer',
    nameKey: 'easterEgg.catalog.scroll.name',
    triggerKey: 'easterEgg.catalog.scroll.trigger',
    resultKey: 'easterEgg.catalog.scroll.result'
  },
  {
    id: 'rocket-email',
    nameKey: 'easterEgg.catalog.rocket.name',
    triggerKey: 'easterEgg.catalog.rocket.trigger',
    resultKey: 'easterEgg.catalog.rocket.result'
  },
  {
    id: 'space-mode',
    nameKey: 'easterEgg.catalog.space.name',
    triggerKey: 'easterEgg.catalog.space.trigger',
    resultKey: 'easterEgg.catalog.space.result'
  },
  {
    id: 'theme-hunter',
    nameKey: 'easterEgg.catalog.theme.name',
    triggerKey: 'easterEgg.catalog.theme.trigger',
    resultKey: 'easterEgg.catalog.theme.result'
  },
  {
    id: 'arrow-hint',
    nameKey: 'easterEgg.catalog.arrow.name',
    triggerKey: 'easterEgg.catalog.arrow.trigger',
    resultKey: 'easterEgg.catalog.arrow.result'
  }
]
