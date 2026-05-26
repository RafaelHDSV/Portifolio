import {
  ArrowSquareOutIcon,
  CircleNotchIcon,
  GitForkIcon,
  GithubLogoIcon,
  ImageIcon,
  PushPinIcon,
  StarIcon,
  WarningCircleIcon
} from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
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
  usesGithubPreview?: boolean
  github?: ProjectGithubStats
  media?: {
    type: 'image' | 'gif' | 'video'
    url: string
    poster?: string
  }
  mediaLoading?: boolean
}

interface CardProps {
  project: ProjectCardData
}

export default function Card ({ project }: CardProps) {
  const { t } = useTranslation()
  const [videoError, setVideoError] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [contributors, setContributors] = useState<string[]>([])
  const [loadingContributors, setLoadingContributors] = useState(false)

  useEffect(() => {
    setImageError(false)
    setVideoError(false)
  }, [project.id, project.image, project.media?.url])

  const isVideo = project.media?.type === 'video' && !videoError
  const videoUrl = project.media?.url ?? ''
  const thumbImage = project.image || project.media?.poster || ''
  const fallbackImage = project.github?.ogImage ?? ''

  const handleImageError = useCallback(() => {
    if (fallbackImage && project.image !== fallbackImage) {
      setImageError(true)
    }
  }, [fallbackImage, project.image])

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
    if (project.mediaLoading) {
      return (
        <div
          className={styles.mediaLoading}
          role='status'
          aria-label={t('projects.mediaLoading')}
        >
          <CircleNotchIcon size={32} weight='bold' aria-hidden />
        </div>
      )
    }

    const displayImage =
      imageError && fallbackImage ? fallbackImage : project.image

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
      if (project.github?.ogImage) {
        return (
          <img
            src={displayImage || project.github.ogImage}
            alt={project.name}
            loading='lazy'
            onError={handleImageError}
          />
        )
      }

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
          onError={handleImageError}
        />
      )
    }

    return (
      <img
        src={displayImage}
        alt={project.name}
        loading='lazy'
        onError={handleImageError}
      />
    )
  }

  const renderGithubOverlay = () => {
    if (!project.github) return null

    return (
      <div
        className={`${styles.githubOverlay} ${project.usesGithubPreview ? styles.githubOverlayStatsOnly : ''}`}
        aria-hidden='true'
      >
        {!project.usesGithubPreview && (
          <img
            className={styles.githubOgImage}
            src={project.github.ogImage}
            alt=''
            loading='lazy'
          />
        )}
        <div className={styles.githubOverlayMeta}>
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
      </div>
    )
  }

  return (
    <article
      className={`${styles.card} ${project.usesGithubPreview ? styles.githubPreviewCard : ''}`}
      onMouseEnter={loadContributors}
    >
      <div className={styles.imageWrapper}>
        <div className={styles.mediaDefault}>{renderMedia()}</div>
        {!project.mediaLoading && renderGithubOverlay()}
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
