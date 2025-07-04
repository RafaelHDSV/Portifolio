import { useEffect, useState } from 'react'
import { IGithubRepo, IGithubUser } from '../interfaces/IGithub'
import { GithubRepository } from '../repository/GithubRepository'

export function useGetMe() {
  const [user, setUser] = useState<IGithubUser>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUserApi = async () => {
      try {
        setLoading(true)

        const user = await GithubRepository.getUserDetails()
        setUser(user)
      } catch (err) {
        console.error('Error fetching user from GitHub:', err)
        setError(err as string)
      } finally {
        setLoading(false)
        setError(null)
      }
    }

    getUserApi()
  }, [])

  return {
    user,
    loading,
    error
  }
}

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
        setError(null)
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
