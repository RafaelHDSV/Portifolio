import { useEffect, useState } from 'react'
import { ProjectCardData } from '../components/Card/Card'
import { GITHUB_USERNAME } from '../constants/cv'
import { projectsConfig } from '../constants/projects.config'
import { GithubRepository } from '../repository/GithubRepository'
import { applyMediaToCard } from '../utils/mergeProjects'
import { mapGithubLanguagesToBadges } from '../utils/mapGithubLanguages'
import { resolveRepoMedia } from '../utils/resolveRepoMedia'

export function useEnrichedProjects (projects: ProjectCardData[]) {
  const [enriched, setEnriched] = useState<ProjectCardData[]>(projects)

  useEffect(() => {
    setEnriched(projects)

    let cancelled = false

    const enrich = async () => {
      const updates = await Promise.all(
        projects.map(async (project) => {
          let card = project

          if (!project.media && (!project.image || project.usesPlaceholder)) {
            const media = await resolveRepoMedia(
              GITHUB_USERNAME,
              project.repoName,
              project.image || undefined
            )
            if (!cancelled) card = applyMediaToCard(card, media)
          }

          const config = projectsConfig.find(
            (p) => p.repoName?.toLowerCase() === project.repoName.toLowerCase()
          )

          if (config?.languages?.length && config.languages.length > 1) {
            return card
          }

          const apiLangs = await GithubRepository.getRepoLanguages(
            GITHUB_USERNAME,
            project.repoName
          )

          if (cancelled || apiLangs.length === 0) return card

          const languages = mapGithubLanguagesToBadges(apiLangs, [])
          return { ...card, languages: languages.length ? languages : card.languages }
        })
      )

      if (!cancelled) setEnriched(updates)
    }

    void enrich()

    return () => {
      cancelled = true
    }
  }, [projects])

  return enriched
}
