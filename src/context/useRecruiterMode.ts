import { useContext } from 'react'
import { RecruiterModeContext } from './RecruiterModeContext'

export function useRecruiterMode () {
  const ctx = useContext(RecruiterModeContext)
  if (!ctx) throw new Error('useRecruiterMode requires RecruiterModeProvider')
  return ctx
}
