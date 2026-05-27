import { ReactNode, useCallback, useEffect, useState } from 'react'
import {
  isRecruiterPath,
  navigateToHomePath,
  navigateToRecruiterPath,
  replaceWithRecruiterPath
} from '../constants/recruiterRoutes'
import { useRecruiterNoIndex } from '../hooks/useRecruiterNoIndex'
import { RecruiterModeContext } from './RecruiterModeContext'

const STORAGE_KEY = 'recruiter-mode'

function readRecruiterModeFromBrowser (): boolean {
  if (typeof window === 'undefined') return false
  return (
    isRecruiterPath(window.location.pathname) ||
    localStorage.getItem(STORAGE_KEY) === 'true'
  )
}

export function RecruiterModeProvider ({ children }: { children: ReactNode }) {
  const [isRecruiterMode, setIsRecruiterMode] = useState(readRecruiterModeFromBrowser)

  useRecruiterNoIndex(isRecruiterMode)

  const syncFromPath = useCallback((pathname: string) => {
    const active = isRecruiterPath(pathname)

    if (active) {
      localStorage.setItem(STORAGE_KEY, 'true')
      setIsRecruiterMode(true)
      return
    }

    localStorage.removeItem(STORAGE_KEY)
    setIsRecruiterMode(false)
  }, [])

  useEffect(() => {
    const shouldEnable = readRecruiterModeFromBrowser()

    if (shouldEnable) {
      localStorage.setItem(STORAGE_KEY, 'true')
      setIsRecruiterMode(true)

      if (!isRecruiterPath(window.location.pathname)) {
        replaceWithRecruiterPath()
      }
    } else {
      syncFromPath(window.location.pathname)
    }

    const onPopState = () => syncFromPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)

    return () => window.removeEventListener('popstate', onPopState)
  }, [syncFromPath])

  const enableRecruiterMode = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsRecruiterMode(true)
    navigateToRecruiterPath()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const disableRecruiterMode = () => {
    localStorage.removeItem(STORAGE_KEY)
    setIsRecruiterMode(false)
    navigateToHomePath()
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
