import { useEffect, useState } from 'react'
import { GITHUB_USERNAME } from '../constants/cv'
import { GithubRepository } from '../repository/GithubRepository'

export function useRepoLanguages (repoNames: string[]) {
  const [languages, setLanguages] = useState<Map<string, string[]>>(
    () => new Map()
  )
  const namesKey = repoNames
    .map((name) => name.toLowerCase())
    .sort()
    .join('|')

  useEffect(() => {
    if (repoNames.length === 0) {
      setLanguages(new Map())
      return
    }

    let cancelled = false

    GithubRepository.getRepoLanguagesBatch(GITHUB_USERNAME, repoNames)
      .then((result) => {
        if (!cancelled) setLanguages(result)
      })
      .catch(() => {
        if (!cancelled) setLanguages(new Map())
      })

    return () => {
      cancelled = true
    }
  }, [namesKey, repoNames])

  return languages
}
