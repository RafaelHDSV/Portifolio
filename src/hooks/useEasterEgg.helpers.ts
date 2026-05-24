import { EasterEggId } from './useEasterEgg.types'

export function unlockRocketEmail (unlock: (id: EasterEggId) => void) {
  unlock('rocket-email')
}
