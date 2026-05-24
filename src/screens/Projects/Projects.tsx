import { useMemo, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { FaGithub } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Card from '../../components/Card/Card'
import Container from '../../components/Container/Container'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import {
  PROJECT_FILTERS,
  ProjectFilter
} from '../../constants/projects.config'
import useGetRepos from '../../hooks/useGetRepos'
import { filterProjects, mergeProjects } from '../../utils/mergeProjects'
import styles from './Project.module.scss'

const INITIAL_VISIBLE = 6

function ProjectsSkeleton () {
  return (
    <div className={styles.skeletonGrid} aria-hidden='true'>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  )
}

function ProjectsContent () {
  const { t, i18n } = useTranslation()
  const { repos, loading, error } = useGetRepos()
  const [filter, setFilter] = useState<ProjectFilter>('all')
  const [showAll, setShowAll] = useState(false)

  const locale = i18n.language.startsWith('pt') ? 'pt' : 'en'

  const allProjects = useMemo(
    () => mergeProjects(repos, locale),
    [repos, locale]
  )

  const filtered = useMemo(
    () => filterProjects(allProjects, filter),
    [allProjects, filter]
  )

  const featured = filtered.filter((p) => p.featured)
  const others = filtered.filter((p) => !p.featured)
  const visibleOthers = showAll ? others : others.slice(0, INITIAL_VISIBLE)

  return (
    <>
      <div className={styles.filters} role='tablist' aria-label='Filtros'>
        {PROJECT_FILTERS.map((f) => (
          <button
            key={f}
            type='button'
            role='tab'
            aria-selected={filter === f}
            className={`${styles.filterChip} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {t(`projects.filters.${f}`)}
          </button>
        ))}
      </div>

      {loading && <ProjectsSkeleton />}

      {error && !loading && (
        <p className={`${styles.status} ${styles.error}`} role='alert'>
          {t('projects.error')}
        </p>
      )}

      {!loading && (
        <>
          {featured.length > 0 && (
            <>
              <p className={styles.sectionLabel}>{t('projects.featured')}</p>
              <div className={styles.featuredGrid}>
                {featured.map((project) => (
                  <Card key={project.id} project={project} />
                ))}
              </div>
            </>
          )}

          {visibleOthers.length > 0 && (
            <div className={styles.grid}>
              {visibleOthers.map((project) => (
                <Card key={project.id} project={project} compact />
              ))}
            </div>
          )}

          {others.length > INITIAL_VISIBLE && (
            <div className={styles.actions}>
              <button
                type='button'
                className={styles.filterChip}
                onClick={() => setShowAll((s) => !s)}
              >
                {showAll ? t('projects.showLess') : t('projects.showMore')}
              </button>
            </div>
          )}
        </>
      )}

      <div className={styles.actions}>
        <a
          className={styles.btnGithub}
          href='https://github.com/RafaelHDSV?tab=repositories'
          target='_blank'
          rel='noreferrer'
        >
          <FaGithub />
          {t('projects.viewMore')}
        </a>
      </div>
    </>
  )
}

export default function Projects () {
  const { t } = useTranslation()

  return (
    <Fade triggerOnce>
      <section id='projects' className={`mainContainer ${styles.projectsContainer}`}>
        <Container>
          <SectionTitle
            title={t('projects.title')}
            subtitle={t('projects.subtitle')}
          />
          <ProjectsContent />
        </Container>
      </section>
    </Fade>
  )
}
