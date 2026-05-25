import { ArrowSquareOutIcon, GithubLogoIcon, PushPinIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Badge from '../Badge/Badge'
import Button from '../Button/Button'
import styles from './Card.module.scss'

export interface ProjectCardData {
  id: string
  name: string
  image: string
  description: string
  languages: string[]
  urlProject?: string
  urlGitHub: string
  pinned?: boolean
  imagePending?: boolean
}

interface CardProps {
  project: ProjectCardData
}

export default function Card ({ project }: CardProps) {
  const { t } = useTranslation()

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {project.imagePending ? (
          <div className={styles.imagePlaceholder}>
            <span>{t('projects.imagePending')}</span>
          </div>
        ) : (
          <img src={project.image} alt={project.name} loading='lazy' />
        )}
        {project.pinned && (
          <span className={styles.pinBadge}>
            <PushPinIcon size={14} weight='fill' />
            {t('projects.pinned')}
          </span>
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
