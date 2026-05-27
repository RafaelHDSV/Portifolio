import { FunnelSimpleIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import { FaGithub } from 'react-icons/fa'
import Card from '../../components/Card/Card'
import Container from '../../components/Container/Container'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import { useContributorCounts } from '../../hooks/useContributorCounts'
import { useEnrichedProjects } from '../../hooks/useEnrichedProjects'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import useGitHubProjects from '../../hooks/useGitHubProjects'
import { gitHubToken } from '../../utils/environment'
import { getProjectFilterLabel } from '../../utils/filterLabels'
import {
  collectAvailableFilters,
  collectPortfolioRepoCandidates,
  filterProjectsMulti,
  mergeGitHubProjects
} from '../../utils/mergeProjects'
import styles from './Project.module.scss'
import ProjectCardSkeleton from './ProjectCardSkeleton'

function ProjectsSkeleton () {
  return (
    <div className={styles.skeletonGrid} aria-hidden='true'>
      {Array.from({ length: 6 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  )
}

function ProjectsContent () {
  const { t, i18n } = useTranslation()
  const { registerFilterNinja } = useEasterEgg()
  const { pinned, recent, loading, error } = useGitHubProjects()
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const locale = i18n.language.startsWith('pt') ? 'pt' : 'en'

  const repoCandidates = useMemo(
    () => collectPortfolioRepoCandidates(pinned, recent),
    [pinned, recent]
  )

  const repoNames = useMemo(
    () =>
      repoCandidates
        .map((repo) => repo.name)
        .filter((name): name is string => Boolean(name)),
    [repoCandidates]
  )

  const contributorCounts = useContributorCounts(repoNames)

  const allProjects = useMemo(
    () => mergeGitHubProjects(pinned, recent, locale, contributorCounts),
    [pinned, recent, locale, contributorCounts]
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
    const exists = selectedFilters.some(
      (f) => f.toLowerCase() === filter.toLowerCase()
    )

    if (exists) {
      setSelectedFilters((prev) =>
        prev.filter((f) => f.toLowerCase() !== filter.toLowerCase())
      )
      return
    }

    const canonical =
      availableFilters.find(
        (f) => f.toLowerCase() === filter.toLowerCase()
      ) ?? filter
    const next = [...selectedFilters, canonical]
    setSelectedFilters(next)

    if (next.length >= 3) {
      registerFilterNinja(next.length)
    }
  }

  const clearFilters = () => setSelectedFilters([])

  const showEmptyFilters =
    !loading &&
    !error &&
    selectedFilters.length > 0 &&
    filtered.length === 0

  return (
    <>
      {!gitHubToken && !loading && (
        <p className={styles.tokenNotice} role='note'>
          {t('projects.tokenHintPrivate')}
        </p>
      )}

      <div className={styles.filters} role='group' aria-label='Filtros'>
        {availableFilters.map((f) => {
          const isActive = selectedFilters.some(
            (selected) => selected.toLowerCase() === f.toLowerCase()
          )

          return (
          <button
            key={f}
            type='button'
            aria-pressed={isActive}
            className={`${styles.filterChip} ${isActive ? styles.active : ''}`}
            onClick={() => toggleFilter(f)}
          >
            {getProjectFilterLabel(f, t)}
          </button>
          )
        })}
        {selectedFilters.length > 0 && (
          <button
            type='button'
            className={styles.clearFilters}
            onClick={clearFilters}
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

      {!loading && !error && showEmptyFilters && (
        <div className={styles.emptyState} role='status'>
          <FunnelSimpleIcon
            className={styles.emptyIcon}
            size={40}
            weight='duotone'
            aria-hidden
          />
          <p className={styles.emptyTitle}>{t('projects.emptyFiltersTitle')}</p>
          <p className={styles.emptyHint}>{t('projects.emptyFiltersHint')}</p>
          <button type='button' className={styles.emptyCta} onClick={clearFilters}>
            {t('projects.clearFilters')}
          </button>
        </div>
      )}

      {!loading && !error && !showEmptyFilters && (
        <div className={styles.grid}>
          {filtered.map((project) => (
            <Card
              key={project.id}
              project={project}
              onLanguageClick={toggleFilter}
              activeLanguageFilters={selectedFilters}
            />
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
