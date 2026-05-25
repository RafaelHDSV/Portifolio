import { useMemo, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { FaGithub } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Card from '../../components/Card/Card'
import Container from '../../components/Container/Container'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import { useEnrichedProjects } from '../../hooks/useEnrichedProjects'
import useGitHubProjects from '../../hooks/useGitHubProjects'
import {
  collectAvailableFilters,
  filterProjectsMulti,
  mergeGitHubProjects
} from '../../utils/mergeProjects'
import { getProjectFilterLabel } from '../../utils/filterLabels'
import styles from './Project.module.scss'

function ProjectsSkeleton () {
  return (
    <div className={styles.skeletonGrid} aria-hidden='true'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  )
}

function ProjectsContent () {
  const { t, i18n } = useTranslation()
  const { pinned, recent, loading, error } = useGitHubProjects()
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const locale = i18n.language.startsWith('pt') ? 'pt' : 'en'

  const allProjects = useMemo(
    () => mergeGitHubProjects(pinned, recent, locale),
    [pinned, recent, locale]
  )

  const enrichedProjects = useEnrichedProjects(allProjects)

  const availableFilters = useMemo(
    () => collectAvailableFilters(enrichedProjects),
    [enrichedProjects]
  )

  const filtered = useMemo(
    () => filterProjectsMulti(enrichedProjects, selectedFilters),
    [enrichedProjects, selectedFilters]
  )

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    )
  }

  return (
    <>
      <div className={styles.filters} role='group' aria-label='Filtros'>
        {availableFilters.map((f) => (
          <button
            key={f}
            type='button'
            aria-pressed={selectedFilters.includes(f)}
            className={`${styles.filterChip} ${selectedFilters.includes(f) ? styles.active : ''}`}
            onClick={() => toggleFilter(f)}
          >
            {getProjectFilterLabel(f, t)}
          </button>
        ))}
        {selectedFilters.length > 0 && (
          <button
            type='button'
            className={styles.clearFilters}
            onClick={() => setSelectedFilters([])}
          >
            {t('projects.clearFilters')}
          </button>
        )}
      </div>

      {loading && <ProjectsSkeleton />}

      {error && !loading && (
        <p className={`${styles.status} ${styles.error}`} role='alert'>
          {t('projects.error')}
        </p>
      )}

      {!loading && (
        <div className={styles.grid}>
          {filtered.map((project) => (
            <Card key={project.id} project={project} />
          ))}
        </div>
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
