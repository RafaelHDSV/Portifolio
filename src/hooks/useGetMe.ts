import { useEffect, useState } from 'react'
import { GithubRepository } from '../repository/GithubRepository'
import { IGithubUser } from '../types/IGithub'

export default function useGetMe() {
  const [user, setUser] = useState<IGithubUser>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUserApi = async () => {
      setLoading(true)

      try {
        const user = await GithubRepository.getUserDetails()
        setUser(user)
      } catch (err) {
        console.error('Error fetching user from GitHub:', err)
        setError(err as string)
      } finally {
        setLoading(false)
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
