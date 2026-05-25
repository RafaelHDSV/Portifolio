import { ReactNode, useEffect, useState } from 'react'
import { RecruiterModeContext } from './RecruiterModeContext'

const STORAGE_KEY = 'recruiter-mode'

export function RecruiterModeProvider ({ children }: { children: ReactNode }) {
  const [isRecruiterMode, setIsRecruiterMode] = useState(false)

  useEffect(() => {
    setIsRecruiterMode(localStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  const enableRecruiterMode = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsRecruiterMode(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const disableRecruiterMode = () => {
    localStorage.removeItem(STORAGE_KEY)
    setIsRecruiterMode(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <RecruiterModeContext.Provider
      value={{ isRecruiterMode, enableRecruiterMode, disableRecruiterMode }}
    >
      {children}
    </RecruiterModeContext.Provider>
  )
}
