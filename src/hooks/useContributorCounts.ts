import { useEffect, useState } from 'react'
import { GITHUB_USERNAME } from '../constants/cv'
import { GithubRepository } from '../repository/GithubRepository'

export function useContributorCounts (repoNames: string[]) {
  const [counts, setCounts] = useState<Map<string, number>>(() => new Map())
  const namesKey = repoNames
    .map((name) => name.toLowerCase())
    .sort()
    .join('|')

  useEffect(() => {
    if (repoNames.length === 0) {
      setCounts(new Map())
      return
    }

    let cancelled = false

    GithubRepository.getContributorCounts(GITHUB_USERNAME, repoNames)
      .then((result) => {
        if (!cancelled) setCounts(result)
      })
      .catch(() => {
        if (!cancelled) setCounts(new Map())
      })

    return () => {
      cancelled = true
    }
  }, [namesKey, repoNames])

  return counts
}