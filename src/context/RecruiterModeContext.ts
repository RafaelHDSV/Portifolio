import { createContext } from 'react'

export interface RecruiterModeContextValue {
  isRecruiterMode: boolean
  enableRecruiterMode: () => void
  disableRecruiterMode: () => void
}

export const RecruiterModeContext = createContext<RecruiterModeContextValue | null>(
  null
)
