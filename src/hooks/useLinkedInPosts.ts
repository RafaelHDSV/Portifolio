import { useEffect, useState } from 'react'

export interface LinkedInPost {
  postId: string
  profileUsername: string
  texto: string
  url: string
  publicadoEm: string | null
  tipoMidia: string
  midiaUrls: string[]
  reacoesCount: number | null
}

interface LinkedInPostsResponse {
  posts: LinkedInPost[]
}

const POSTS_LIMIT = 3

interface UseLinkedInPostsResult {
  posts: LinkedInPost[]
  loading: boolean
  error: boolean
}

export function useLinkedInPosts (): UseLinkedInPostsResult {
  const [posts, setPosts] = useState<LinkedInPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`/api/linkedin-posts?limit=${POSTS_LIMIT}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Resposta ${response.status}`)
        return response.json() as Promise<LinkedInPostsResponse>
      })
      .then((data) => {
        setPosts(data.posts.slice(0, POSTS_LIMIT))
        setError(false)
      })
      .catch((fetchError: unknown) => {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return
        setError(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { posts, loading, error }
}
