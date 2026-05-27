import {
  ArrowSquareOutIcon,
  ChartBarIcon,
  CircleNotchIcon,
  GitForkIcon,
  GithubLogoIcon,
  ImageIcon,
  PushPinIcon,
  StarIcon,
  WarningCircleIcon
} from '@phosphor-icons/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GITHUB_USERNAME } from '../../constants/cv'
import { GithubRepository } from '../../repository/GithubRepository'
import {
  getPrimaryImageUrl,
  ImageFallbackStage,
  nextFallbackStage,
  resolveCardImageDisplay
} from '../../utils/cardImageFallback'
import Badge from '../Badge/Badge'
import Button from '../Button/Button'
import { getProjectFilterLabel } from '../../utils/filterLabels'
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
  onLanguageClick?: (language: string) => void
  activeLanguageFilters?: string[]
}

export default function Card ({
  project,
  onLanguageClick,
  activeLanguageFilters = []
}: CardProps) {
  const { t } = useTranslation()
  const cardRef = useRef<HTMLElement>(null)
  const [videoError, setVideoError] = useState(false)
  const [imageStage, setImageStage] = useState<ImageFallbackStage>('primary')
  const [contributors, setContributors] = useState<string[]>([])
  const [loadingContributors, setLoadingContributors] = useState(false)
  const [statsExpanded, setStatsExpanded] = useState(false)
  const [canHover, setCanHover] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(hover: hover)').matches
      : true
  )

  const statsOverlayId = `github-stats-${project.id}`

  const primaryImage = useMemo(
    () => getPrimaryImageUrl({ image: project.image, media: project.media }),
    [project.image, project.media]
  )
  const imageDisplay = useMemo(
    () => resolveCardImageDisplay(imageStage, primaryImage),
    [imageStage, primaryImage]
  )

  useEffect(() => {
    setImageStage('primary')
    setVideoError(false)
    setStatsExpanded(false)
  }, [project.id, primaryImage, project.media?.url])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)')
    const updateCanHover = () => setCanHover(mediaQuery.matches)

    updateCanHover()
    mediaQuery.addEventListener('change', updateCanHover)
    return () => mediaQuery.removeEventListener('change', updateCanHover)
  }, [])

  const isTouchStatsDevice = !canHover

  const isVideo = project.media?.type === 'video' && !videoError
  const videoUrl = project.media?.url ?? ''
  const thumbImage = project.image || project.media?.poster || ''

  const handleImageError = useCallback(() => {
    setImageStage(() => nextFallbackStage())
  }, [])

  const handleVideoError = useCallback(() => {
    setVideoError(true)
  }, [])

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

  useEffect(() => {
    const card = cardRef.current
    if (!card || !project.repoName || canHover) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadContributors()
        }
      },
      { rootMargin: '80px', threshold: 0.1 }
    )

    observer.observe(card)
    return () => observer.disconnect()
  }, [canHover, loadContributors, project.repoName, project.id])

  const handleStatsToggle = useCallback(() => {
    setStatsExpanded((prev) => {
      if (!prev) {
        loadContributors()
      }
      return !prev
    })
  }, [loadContributors])

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

    if (videoError && project.media?.type === 'video') {
      const fallbackSrc = imageDisplay.src || project.github?.ogImage
      if (fallbackSrc) {
        return (
          <img
            src={fallbackSrc}
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

    if (imageDisplay.src) {
      return (
        <img
          src={imageDisplay.src}
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

  const renderGithubOverlay = () => {
    if (!project.github) return null

    return (
      <div
        id={statsOverlayId}
        className={styles.githubOverlay}
        role='group'
        aria-label={t('projects.githubStatsLabel', { name: project.name })}
      >
        <img
          className={styles.githubOgImage}
          src={project.github.ogImage}
          alt=''
          loading='lazy'
          aria-hidden
        />
        <div className={styles.githubOverlayMeta}>
          <div className={styles.githubStats}>
            <span
              aria-label={`${t('projects.statsStars')}: ${project.github.stars}`}
            >
              <StarIcon size={16} weight='fill' aria-hidden />
              {project.github.stars}
            </span>
            <span
              aria-label={`${t('projects.statsForks')}: ${project.github.forks}`}
            >
              <GitForkIcon size={16} weight='bold' aria-hidden />
              {project.github.forks}
            </span>
            <span
              aria-label={`${t('projects.statsIssues')}: ${project.github.openIssues}`}
            >
              <WarningCircleIcon size={16} weight='bold' aria-hidden />
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

  const cardClassName = [
    styles.card,
    statsExpanded ? styles.statsExpanded : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article
      ref={cardRef}
      className={cardClassName}
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
          {project.languages.map((lang) => {
            const isActive = activeLanguageFilters.some(
              (filter) => filter.toLowerCase() === lang.toLowerCase()
            )

            return (
              <Badge
                key={lang}
                name={lang}
                onClick={
                  onLanguageClick ? () => onLanguageClick(lang) : undefined
                }
                active={isActive}
                ariaLabel={
                  onLanguageClick
                    ? t('projects.filterByLanguage', {
                        language: getProjectFilterLabel(lang, t)
                      })
                    : undefined
                }
              />
            )
          })}
        </div>

        <p className={styles.description}>{project.description}</p>

        {isTouchStatsDevice && project.github && (
          <Button
            type='button'
            variant='ghost'
            className={styles.statsToggle}
            aria-expanded={statsExpanded}
            aria-controls={statsOverlayId}
            onClick={handleStatsToggle}
          >
            <ChartBarIcon size={16} weight='bold' aria-hidden />
            {statsExpanded ? t('projects.hideStats') : t('projects.viewStats')}
          </Button>
        )}

        <div className={styles.links}>
          {project.urlProject && (
            <Button
              href={project.urlProject}
              variant='secondary'
              className={styles.linkBtn}
              aria-label={t('projects.openDemo', { name: project.name })}
            >
              <ArrowSquareOutIcon size={16} weight='bold' aria-hidden />
              {t('projects.viewDemo')}
            </Button>
          )}
          <Button
            href={project.urlGitHub}
            variant='secondary'
            className={styles.linkBtn}
            aria-label={t('projects.openGitHub', { name: project.name })}
          >
            <GithubLogoIcon size={16} weight='bold' aria-hidden />
            GitHub
          </Button>
        </div>
      </div>
    </article>
  )
}
