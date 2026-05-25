import { useCallback, useEffect, useState } from 'react'
import { GithubRepository } from '../repository/GithubRepository'
import { IGithubResponseRepo } from '../types/IGithub'
import { GITHUB_USERNAME } from '../constants/cv'

export default function useGitHubProjects () {
  const [pinned, setPinned] = useState<IGithubResponseRepo[]>([])
  const [recent, setRecent] = useState<IGithubResponseRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [pinnedRepos, recentRepos] = await Promise.all([
        GithubRepository.getPinnedRepos(GITHUB_USERNAME),
        GithubRepository.getRecentRepos(GITHUB_USERNAME, 10)
      ])

      setPinned(pinnedRepos)
      setRecent(recentRepos)
    } catch (err) {
      console.error('Error loading GitHub projects:', err)
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { pinned, recent, loading, error, retry: load }
}
