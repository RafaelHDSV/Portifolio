import { ReactNode } from 'react'
import { useLinkedInPosts } from '../hooks/useLinkedInPosts'
import { LinkedInContext } from './LinkedInContext'

export function LinkedInProvider ({ children }: { children: ReactNode }) {
  const { posts, loading } = useLinkedInPosts()
  const hasPosts = !loading && posts.length > 0

  return (
    <LinkedInContext.Provider value={{ posts, loading, hasPosts }}>
      {children}
    </LinkedInContext.Provider>
  )
}
