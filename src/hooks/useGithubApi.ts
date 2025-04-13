import { useEffect, useState } from 'react'
import { githubApi } from '../services/apis/gitHub'
import { IGithubUser } from '../interfaces'

export function useGetMe() {
  const [user, setUser] = useState<IGithubUser>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    const getUserApi = async () => {
      try {
        setLoading(true)
        const response = await githubApi.get('/users/RafaelHDSV')
        setUser(response.data)
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
