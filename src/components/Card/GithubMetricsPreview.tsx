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

/** Card no estilo do OG publico do GitHub — usado quando o OG privado e so o placeholder. */
export default function GithubMetricsPreview ({
  project
}: GithubMetricsPreviewProps) {
  const github = project.github
  if (!github) return null

  const repoLabel = displayRepoTitle(project.repoName || project.name)
  const description = project.description.trim()
  const language = project.languages[0]

  return (
    <div className={styles.preview} aria-hidden='true'>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.copy}>
            <p className={styles.repoPath}>
              <span className={styles.owner}>{GITHUB_USERNAME}</span>
              <span className={styles.slash}>/</span>
              <span className={styles.repo}>{repoLabel}</span>
            </p>
            {description && <p className={styles.description}>{description}</p>}
            <div className={styles.stats}>
              <span>
                <StarIcon size={14} weight='fill' />
                {github.stars}
              </span>
              <span>
                <GitForkIcon size={14} weight='bold' />
                {github.forks}
              </span>
              <span>
                <WarningCircleIcon size={14} weight='bold' />
                {github.openIssues}
              </span>
            </div>
          </div>
          <img
            className={styles.avatar}
            src={OWNER_AVATAR}
            alt=''
            width={56}
            height={56}
            loading='lazy'
          />
        </div>
        {language && (
          <div className={styles.langBar} data-lang={language}>
            <span className={styles.langDot} />
            <span className={styles.langName}>{language}</span>
          </div>
        )}
      </div>
    </div>
  )
}
