import { useContext } from 'react'
import { LinkedInContext } from './LinkedInContext'

export function useLinkedInContext () {
  return useContext(LinkedInContext)
}
