import { useEffect, useState } from 'react'
import { ProjectCardData } from '../components/Card/Card'
import { GITHUB_USERNAME } from '../constants/cv'
import { applyMediaToCard } from '../utils/mergeProjects'
import { resolveRepoMedia } from '../utils/resolveRepoMedia'

export function useEnrichedProjects (projects: ProjectCardData[]) {
  const [enriched, setEnriched] = useState<ProjectCardData[]>(projects)

  useEffect(() => {
    setEnriched(projects)

    let cancelled = false

    const enrich = async () => {
      const updates = await Promise.all(
        projects.map(async (project) => {
          if (project.media || (project.image && !project.usesPlaceholder)) {
            return project
          }

          const media = await resolveRepoMedia(
            GITHUB_USERNAME,
            project.repoName,
            project.image || undefined
          )

          if (cancelled) return project
          return applyMediaToCard(project, media)
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
