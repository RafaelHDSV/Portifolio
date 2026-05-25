import { fetchLinkedInPosts } from '../lib/linkedin/fetchPosts'

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
}

export default async function handler (
  _req: unknown,
  res: VercelResponse
) {
  try {
    const posts = await fetchLinkedInPosts()

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600')
    res.status(200).json({ posts })
  } catch (err) {
    console.error(err)
    res.status(500).json({ posts: [], error: 'Failed to load LinkedIn posts' })
  }
}
