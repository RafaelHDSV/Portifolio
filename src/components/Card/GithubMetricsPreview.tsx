import { GITHUB_USERNAME } from '../../constants/cv'
import { displayRepoTitle } from '../../utils/displayRepoTitle'
import type { ProjectCardData } from './Card'
import styles from './GithubMetricsPreview.module.scss'

const OWNER_AVATAR = '/og/avatar.jpg'

/** Cores Linguist (mesmas do OG do GitHub). */
const LANG_COLORS: Record<string, string> = {
  Javascript: '#f1e05a',
  JavaScript: '#f1e05a',
  Typescript: '#3178c6',
  TypeScript: '#3178c6',
  Kotlin: '#A97BFF',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Sass: '#c6538c',
  SCSS: '#c6538c',
  PowerShell: '#012456',
  React: '#61dafb',
  Java: '#b07219',
  PLpgSQL: '#336791',
  PostgreSQL: '#336791',
  Shell: '#89e051',
  Batchfile: '#C1F12E'
}

interface GithubMetricsPreviewProps {
  project: ProjectCardData
  contributorCount?: number
}

function pluralLabel (count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}

/** Pesos decrescentes — espelha a barra do OG quando nao ha bytes da API. */
function languageBarSegments (languages: string[]): Array<{ color: string; flex: number }> {
  const langs = languages.filter((lang) => LANG_COLORS[lang]).slice(0, 5)
  if (langs.length === 0) {
    return [{ color: '#3178c6', flex: 1 }]
  }

  const weights = [0.72, 0.16, 0.07, 0.035, 0.015].slice(0, langs.length)
  const total = weights.reduce((sum, w) => sum + w, 0)

  return langs.map((lang, index) => ({
    color: LANG_COLORS[lang],
    flex: weights[index] / total
  }))
}

function PeopleIcon () {
  return (
    <svg viewBox='0 0 16 16' aria-hidden className={styles.octicon}>
      <path
        fill='currentColor'
        d='M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.507 5.507 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.49 3.49 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.375 2.5 2.5 0 0 0-3.831-1.315A3.001 3.001 0 0 1 11 4Z'
      />
    </svg>
  )
}

function IssueIcon () {
  return (
    <svg viewBox='0 0 16 16' aria-hidden className={styles.octicon}>
      <path
        fill='currentColor'
        d='M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'
      />
      <path
        fill='currentColor'
        d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z'
      />
    </svg>
  )
}

function StarOcticons () {
  return (
    <svg viewBox='0 0 16 16' aria-hidden className={styles.octicon}>
      <path
        fill='currentColor'
        d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z'
      />
    </svg>
  )
}

function ForkIcon () {
  return (
    <svg viewBox='0 0 16 16' aria-hidden className={styles.octicon}>
      <path
        fill='currentColor'
        d='M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z'
      />
    </svg>
  )
}

function MarkGithub () {
  return (
    <svg viewBox='0 0 16 16' aria-hidden className={styles.ghLogo}>
      <path
        fill='currentColor'
        d='M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z'
      />
    </svg>
  )
}

/** Layout calibrado no OG 1200×600 de opengraph.githubassets.com. */
export default function GithubMetricsPreview ({
  project,
  contributorCount = 1
}: GithubMetricsPreviewProps) {
  const github = project.github
  if (!github) return null

  const repoLabel = displayRepoTitle(project.repoName || project.name)
  const description = project.description.trim()
  const bar = languageBarSegments(project.languages)

  const contributors = Math.max(1, contributorCount)
  const issues = github.openIssues
  const stars = github.stars
  const forks = github.forks

  return (
    <div className={styles.preview} aria-hidden='true'>
      <div className={styles.frame}>
        <div className={styles.header}>
          <div className={styles.titles}>
            <p className={styles.owner}>{GITHUB_USERNAME}/</p>
            <p className={styles.repo}>{repoLabel}</p>
          </div>
          <img
            className={styles.avatar}
            src={OWNER_AVATAR}
            alt=''
            width={120}
            height={120}
            loading='lazy'
            decoding='async'
          />
        </div>

        {description ? (
          <p className={styles.description}>{description}</p>
        ) : (
          <span className={styles.descriptionSpacer} />
        )}

        <div className={styles.footer}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statHead}>
                <PeopleIcon />
                <span>{contributors}</span>
              </div>
              <span className={styles.statLabel}>
                {pluralLabel(contributors, 'Contributor', 'Contributors')}
              </span>
            </div>
            <div className={styles.stat}>
              <div className={styles.statHead}>
                <IssueIcon />
                <span>{issues}</span>
              </div>
              <span className={styles.statLabel}>
                {pluralLabel(issues, 'Issue', 'Issues')}
              </span>
            </div>
            <div className={styles.stat}>
              <div className={styles.statHead}>
                <StarOcticons />
                <span>{stars}</span>
              </div>
              <span className={styles.statLabel}>
                {pluralLabel(stars, 'Star', 'Stars')}
              </span>
            </div>
            <div className={styles.stat}>
              <div className={styles.statHead}>
                <ForkIcon />
                <span>{forks}</span>
              </div>
              <span className={styles.statLabel}>
                {pluralLabel(forks, 'Fork', 'Forks')}
              </span>
            </div>
          </div>
          <MarkGithub />
        </div>
      </div>

      <div className={styles.colorBar}>
        {bar.map((segment) => (
          <span
            key={`${segment.color}-${segment.flex}`}
            style={{ flex: segment.flex, background: segment.color }}
          />
        ))}
      </div>
    </div>
  )
}
