import { useContext } from 'react'
import { EasterEggContext } from './EasterEggContext'

export function useEasterEgg () {
  const ctx = useContext(EasterEggContext)
  if (!ctx) {
    throw new Error('useEasterEgg must be used within EasterEggProvider')
  }
  return ctx
}
