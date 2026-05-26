import { useEffect, useMemo, useState } from 'react'
import { ProjectCardData } from '../components/Card/Card'
import { GITHUB_USERNAME } from '../constants/cv'
import { GithubRepository } from '../repository/GithubRepository'
import { applyMediaToCard } from '../utils/mergeProjects'
import { mapGithubLanguagesToBadges } from '../utils/mapGithubLanguages'
import { resolveRepoMedia } from '../utils/resolveRepoMedia'

function withMediaLoading (projects: ProjectCardData[]): ProjectCardData[] {
  return projects.map((project) => ({
    ...project,
    mediaLoading: shouldResolveRepoMedia(project)
  }))
}

function shouldResolveRepoMedia (project: ProjectCardData): boolean {
  if (project.media) return false
  if (!project.repoName) return false
  if (project.image && !project.usesPlaceholder) return false
  return true
}

function buildRepoNamesKey (projects: ProjectCardData[]): string {
  return projects
    .map((project) => project.repoName.toLowerCase())
    .filter(Boolean)
    .sort()
    .join('|')
}

export function useEnrichedProjects (projects: ProjectCardData[]) {
  const [enriched, setEnriched] = useState<ProjectCardData[]>(() =>
    withMediaLoading(projects)
  )

  const repoNamesKey = useMemo(() => buildRepoNamesKey(projects), [projects])

  useEffect(() => {
    setEnriched(withMediaLoading(projects))

    let cancelled = false

    const enrich = async () => {
      const repoNames = projects
        .map((project) => project.repoName)
        .filter(Boolean)

      const languagesMap = await GithubRepository.getRepoLanguagesBatch(
        GITHUB_USERNAME,
        repoNames
      )

      const updates = await Promise.all(
        projects.map(async (project) => {
          let card: ProjectCardData = {
            ...project,
            mediaLoading: shouldResolveRepoMedia(project)
          }

          if (!project.media) {
            const media = await resolveRepoMedia(
              GITHUB_USERNAME,
              project.repoName
            )
            if (!cancelled) {
              card = { ...applyMediaToCard(card, media), mediaLoading: false }
            }
          } else {
            card = { ...card, mediaLoading: false }
          }

          const apiLangs =
            languagesMap.get(project.repoName.toLowerCase()) ?? []

          if (cancelled || apiLangs.length === 0) return card

          const languages = mapGithubLanguagesToBadges(apiLangs, [])
          return {
            ...card,
            languages: languages.length ? languages : card.languages
          }
        })
      )

      if (!cancelled) setEnriched(updates)
    }

    void enrich()

    return () => {
      cancelled = true
    }
  }, [projects, repoNamesKey])

  return enriched
}
