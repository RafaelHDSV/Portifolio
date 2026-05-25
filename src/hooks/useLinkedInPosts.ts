import { useEffect, useState } from 'react'

export interface LinkedInPost {
  id: string
  title: string
  excerpt: string
  url: string
  publishedAt: string
}

export function useLinkedInPosts () {
  const [posts, setPosts] = useState<LinkedInPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/linkedin-posts')
        if (!response.ok) return
        const data = (await response.json()) as { posts?: LinkedInPost[] }
        setPosts(data.posts ?? [])
      } catch {
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  return { posts, loading }
}
