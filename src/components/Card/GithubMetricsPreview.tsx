import {
  GitForkIcon,
  GithubLogoIcon,
  StarIcon,
  UsersIcon,
  WarningCircleIcon
} from '@phosphor-icons/react'
import { GITHUB_USERNAME } from '../../constants/cv'
import { displayRepoTitle } from '../../utils/displayRepoTitle'
import type { ProjectCardData } from './Card'
import styles from './GithubMetricsPreview.module.scss'

const OWNER_AVATAR = '/og/avatar.jpg'

/** Cores tipicas da barra inferior do OG do GitHub (linguagens). */
const LANG_COLORS: Record<string, string> = {
  Javascript: '#f1e05a',
  JavaScript: '#f1e05a',
  Typescript: '#3178c6',
  TypeScript: '#3178c6',
  Kotlin: '#a97bff',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Sass: '#c6538c',
  SCSS: '#c6538c',
  PowerShell: '#012456',
  React: '#61dafb',
  Java: '#b07219',
  PLpgSQL: '#336791',
  PostgreSQL: '#336791'
}

interface GithubMetricsPreviewProps {
  project: ProjectCardData
  contributorCount?: number
}

function pluralLabel (count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}

/** Layout espelhando o OG publico: opengraph.githubassets.com/... */
export default function GithubMetricsPreview ({
  project,
  contributorCount = 1
}: GithubMetricsPreviewProps) {
  const github = project.github
  if (!github) return null

  const repoLabel = displayRepoTitle(project.repoName || project.name)
  const description = project.description.trim()
  const langs = project.languages.slice(0, 2)
  const primary = LANG_COLORS[langs[0]] ?? '#3178c6'
  const secondary = LANG_COLORS[langs[1]] ?? '#e34c26'
  const primaryShare = langs.length > 1 ? 0.72 : 1

  const contributors = Math.max(1, contributorCount)
  const issues = github.openIssues
  const stars = github.stars
  const forks = github.forks

  return (
    <div className={styles.preview} aria-hidden='true'>
      <div className={styles.content}>
        <div className={styles.left}>
          <p className={styles.owner}>{GITHUB_USERNAME}/</p>
          <p className={styles.repo}>{repoLabel}</p>
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statHead}>
                <UsersIcon size={14} weight='regular' />
                <span className={styles.statValue}>{contributors}</span>
              </div>
              <span className={styles.statLabel}>
                {pluralLabel(contributors, 'Contributor', 'Contributors')}
              </span>
            </div>
            <div className={styles.stat}>
              <div className={styles.statHead}>
                <WarningCircleIcon size={14} weight='regular' />
                <span className={styles.statValue}>{issues}</span>
              </div>
              <span className={styles.statLabel}>
                {pluralLabel(issues, 'Issue', 'Issues')}
              </span>
            </div>
            <div className={styles.stat}>
              <div className={styles.statHead}>
                <StarIcon size={14} weight='regular' />
                <span className={styles.statValue}>{stars}</span>
              </div>
              <span className={styles.statLabel}>
                {pluralLabel(stars, 'Star', 'Stars')}
              </span>
            </div>
            <div className={styles.stat}>
              <div className={styles.statHead}>
                <GitForkIcon size={14} weight='regular' />
                <span className={styles.statValue}>{forks}</span>
              </div>
              <span className={styles.statLabel}>
                {pluralLabel(forks, 'Fork', 'Forks')}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <img
            className={styles.avatar}
            src={OWNER_AVATAR}
            alt=''
            width={88}
            height={88}
            loading='lazy'
            decoding='async'
          />
          <GithubLogoIcon
            className={styles.ghLogo}
            size={40}
            weight='fill'
          />
        </div>
      </div>

      <div className={styles.colorBar}>
        <span style={{ flex: primaryShare, background: primary }} />
        {langs.length > 1 && (
          <span style={{ flex: 1 - primaryShare, background: secondary }} />
        )}
      </div>
    </div>
  )
}
