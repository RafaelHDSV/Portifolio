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
    id: 'locale-hopper',
    nameKey: 'easterEgg.catalog.localeHopper.name',
    triggerKey: 'easterEgg.catalog.localeHopper.trigger',
    resultKey: 'easterEgg.catalog.localeHopper.result'
  },
  {
    id: 'rocket-email',
    nameKey: 'easterEgg.catalog.vieiraMessage.name',
    triggerKey: 'easterEgg.catalog.vieiraMessage.trigger',
    resultKey: 'easterEgg.catalog.vieiraMessage.result'
  },
  {
    id: 'vieira-mode',
    nameKey: 'easterEgg.catalog.vieiraMode.name',
    triggerKey: 'easterEgg.catalog.vieiraMode.trigger',
    resultKey: 'easterEgg.catalog.vieiraMode.result'
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
  },
  {
    id: 'filter-ninja',
    nameKey: 'easterEgg.catalog.filterNinja.name',
    triggerKey: 'easterEgg.catalog.filterNinja.trigger',
    resultKey: 'easterEgg.catalog.filterNinja.result'
  }
]
