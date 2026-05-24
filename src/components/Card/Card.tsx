import { ArrowSquareOutIcon, GithubLogoIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Badge from '../Badge/Badge'
import styles from './Card.module.scss'

export interface ProjectCardData {
  id: string
  name: string
  image: string
  description: string
  languages: string[]
  urlProject?: string
  urlGitHub: string
  featured?: boolean
}

interface CardProps {
  project: ProjectCardData
  compact?: boolean
}

export default function Card ({ project, compact = false }: CardProps) {
  const { t } = useTranslation()

  return (
    <article
      className={`${styles.card} ${project.featured ? styles.featured : ''} ${compact ? styles.compact : ''}`}
    >
      <div className={styles.imageWrapper}>
        <img src={project.image} alt={project.name} loading='lazy' />
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
            <a
              href={project.urlProject}
              target='_blank'
              rel='noopener noreferrer'
            >
              <ArrowSquareOutIcon size={16} weight='bold' />
              {t('projects.viewDemo')}
            </a>
          )}
          <a href={project.urlGitHub} target='_blank' rel='noopener noreferrer'>
            <GithubLogoIcon size={16} weight='bold' />
            GitHub
          </a>
        </div>
      </div>
    </article>
  )
}
