import { createContext } from 'react'
import { useLinkedInPosts } from '../hooks/useLinkedInPosts'

export interface LinkedInContextValue {
  posts: ReturnType<typeof useLinkedInPosts>['posts']
  loading: boolean
  hasPosts: boolean
}

export const LinkedInContext = createContext<LinkedInContextValue>({
  posts: [],
  loading: true,
  hasPosts: false
})
