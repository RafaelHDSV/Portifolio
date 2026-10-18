import {
  GitForkIcon,
  StarIcon,
  WarningCircleIcon
} from '@phosphor-icons/react'
import { GITHUB_USERNAME } from '../../constants/cv'
import { displayRepoTitle } from '../../utils/displayRepoTitle'
import type { ProjectCardData } from './Card'
import styles from './GithubMetricsPreview.module.scss'

const OWNER_AVATAR = '/og/avatar.jpg'

interface GithubMetricsPreviewProps {
  project: ProjectCardData
}

/** Replica visual do OG publico do GitHub (privado so serve o logo generico). */
export default function GithubMetricsPreview ({
  project
}: GithubMetricsPreviewProps) {
  const github = project.github
  if (!github) return null

  const repoLabel = displayRepoTitle(project.repoName || project.name)
  const description = project.description.trim()
  const language = project.languages[0]

  return (
    <div className={styles.preview} aria-hidden='true' data-lang={language || undefined}>
      <div className={styles.body}>
        <div className={styles.main}>
          <p className={styles.repoPath}>
            <span className={styles.owner}>{GITHUB_USERNAME}</span>
            <span className={styles.slash}>/</span>
            <span className={styles.repo}>{repoLabel}</span>
          </p>
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
          <div className={styles.stats}>
            <span>
              <StarIcon size={13} weight='fill' />
              {github.stars}
            </span>
            <span>
              <GitForkIcon size={13} weight='bold' />
              {github.forks}
            </span>
            <span>
              <WarningCircleIcon size={13} weight='bold' />
              {github.openIssues}
            </span>
          </div>
        </div>
        <img
          className={styles.avatar}
          src={OWNER_AVATAR}
          alt=''
          width={72}
          height={72}
          loading='lazy'
          decoding='async'
        />
      </div>
      {language ? (
        <div className={styles.langFooter}>
          <span className={styles.langDot} />
          <span className={styles.langName}>{language}</span>
        </div>
      ) : (
        <div className={styles.langBarOnly} />
      )}
    </div>
  )
}
