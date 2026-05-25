import { ArrowSquareOutIcon, GithubLogoIcon, ImageIcon, PlayIcon, PushPinIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Badge from '../Badge/Badge'
import Button from '../Button/Button'
import styles from './Card.module.scss'

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
  const [isPlaying, setIsPlaying] = useState(false)

  const isVideo = project.media?.type === 'video'
  const showPlaceholder = project.usesPlaceholder && !isPlaying

  const renderMedia = () => {
    if (showPlaceholder) {
      return (
        <div className={styles.imagePlaceholder} aria-hidden='true'>
          <ImageIcon size={40} weight='duotone' />
        </div>
      )
    }

    if (isVideo && isPlaying) {
      return (
        <video
          className={styles.video}
          src={project.media!.url}
          controls
          autoPlay
          playsInline
          aria-label={project.name}
        />
      )
    }

    if (isVideo) {
      return (
        <button
          type='button'
          className={styles.videoThumb}
          onClick={() => setIsPlaying(true)}
          aria-label={t('projects.playVideo', { name: project.name })}
        >
          {project.image ? (
            <img src={project.image} alt='' loading='lazy' />
          ) : (
            <div className={styles.videoFallback} />
          )}
          <span className={styles.playOverlay}>
            <PlayIcon size={32} weight='fill' />
          </span>
        </button>
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

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {renderMedia()}
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
            variant='ghost'
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
