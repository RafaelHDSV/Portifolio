import { useEffect, useState } from 'react'
import { GithubRepository } from '../repository/GithubRepository'
import { IGithubRepo } from '../types/IGithub'

export function useGetRepos() {
  const [repos, setRepos] = useState<IGithubRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getReposApi = async () => {
      try {
        setLoading(true)

        const repos = await GithubRepository.getRepos()
        setRepos(repos)
      } catch (err) {
        console.error('Error fetching user repos from GitHub:', err)
        setError(err as string)
      } finally {
        setLoading(false)
      }
    }

    getReposApi()
  }, [])

  return {
    repos,
    loading,
    error
  }
}
