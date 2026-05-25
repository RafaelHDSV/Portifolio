import {
  ArrowSquareOutIcon,
  GitForkIcon,
  GithubLogoIcon,
  ImageIcon,
  PushPinIcon,
  StarIcon,
  WarningCircleIcon
} from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GITHUB_USERNAME } from '../../constants/cv'
import { GithubRepository } from '../../repository/GithubRepository'
import Badge from '../Badge/Badge'
import Button from '../Button/Button'
import styles from './Card.module.scss'

export interface ProjectGithubStats {
  stars: number
  forks: number
  openIssues: number
  ogImage: string
}

export interface ProjectCardData {
  id: string
  repoName: string
  name: string
  image: string
  description: string
  languages: string[]
  urlProject?: string
  urlGitHub: string
  pinned?: boolean
  private?: boolean
  usesPlaceholder?: boolean
  github?: ProjectGithubStats
  media?: {
    type: 'image' | 'gif' | 'video'
    url: string
    poster?: string
  }
}

interface CardProps {
  project: ProjectCardData
}

export default function Card ({ project }: CardProps) {
  const { t } = useTranslation()
  const [videoError, setVideoError] = useState(false)
  const [contributors, setContributors] = useState<string[]>([])
  const [loadingContributors, setLoadingContributors] = useState(false)

  const isVideo = project.media?.type === 'video' && !videoError
  const videoUrl = project.media?.url ?? ''
  const thumbImage = project.image || project.media?.poster || ''

  const handleVideoError = useCallback(() => {
    if (thumbImage) return
    setVideoError(true)
  }, [thumbImage])

  const loadContributors = useCallback(async () => {
    if (contributors.length > 0 || loadingContributors || !project.repoName) return
    setLoadingContributors(true)
    try {
      const avatars = await GithubRepository.getContributorAvatars(
        GITHUB_USERNAME,
        project.repoName
      )
      setContributors(avatars)
    } finally {
      setLoadingContributors(false)
    }
  }, [contributors.length, loadingContributors, project.repoName])

  const renderMedia = () => {
    if (isVideo) {
      return (
        <video
          className={styles.video}
          src={videoUrl}
          poster={thumbImage || undefined}
          autoPlay
          muted
          loop
          playsInline
          onError={handleVideoError}
          aria-label={project.name}
        />
      )
    }

    if (videoError && videoUrl) {
      return (
        <a
          className={styles.videoFallbackLink}
          href={videoUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('projects.openVideo')}
        </a>
      )
    }

    if (project.usesPlaceholder) {
      return (
        <div className={styles.imagePlaceholder} aria-hidden='true'>
          <ImageIcon size={40} weight='duotone' />
        </div>
      )
    }

    if (project.media?.type === 'gif') {
      return (
        <img
          src={project.media.url}
          alt={project.name}
          loading='lazy'
        />
      )
    }

    return (
      <img
        src={project.image}
        alt={project.name}
        loading='lazy'
      />
    )
  }

  const renderGithubOverlay = () => {
    if (!project.github) return null

    return (
      <div className={styles.githubOverlay} aria-hidden='true'>
        <img
          className={styles.githubOgImage}
          src={project.github.ogImage}
          alt=''
          loading='lazy'
        />
        <div className={styles.githubStats}>
          <span>
            <StarIcon size={16} weight='fill' />
            {project.github.stars}
          </span>
          <span>
            <GitForkIcon size={16} weight='bold' />
            {project.github.forks}
          </span>
          <span>
            <WarningCircleIcon size={16} weight='bold' />
            {project.github.openIssues}
          </span>
        </div>
        {contributors.length > 0 && (
          <div className={styles.contributors}>
            {contributors.map((avatar) => (
              <img key={avatar} src={avatar} alt='' loading='lazy' />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <article
      className={styles.card}
      onMouseEnter={loadContributors}
    >
      <div className={styles.imageWrapper}>
        <div className={styles.mediaDefault}>{renderMedia()}</div>
        {renderGithubOverlay()}
        {project.pinned && (
          <span className={styles.pinBadge}>
            <PushPinIcon size={14} weight='fill' />
            {t('projects.pinned')}
          </span>
        )}
        {project.private && (
          <span className={styles.privateBadge}>{t('projects.private')}</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{project.name}</h3>

        <div className={styles.badges}>
          {project.languages.map((lang) => (
            <Badge key={lang} name={lang} />
          ))}
        </div>

        <p className={styles.description}>{project.description}</p>

        <div className={styles.links}>
          {project.urlProject && (
            <Button
              href={project.urlProject}
              variant='secondary'
              className={styles.linkBtn}
            >
              <ArrowSquareOutIcon size={16} weight='bold' />
              {t('projects.viewDemo')}
            </Button>
          )}
          <Button
            href={project.urlGitHub}
            variant='secondary'
            className={styles.linkBtn}
          >
            <GithubLogoIcon size={16} weight='bold' />
            GitHub
          </Button>
        </div>
      </div>
    </article>
  )
}
