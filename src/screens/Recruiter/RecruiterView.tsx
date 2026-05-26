import {
  ArrowSquareOutIcon,
  BriefcaseIcon,
  ClockIcon,
  CodeIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  GlobeHemisphereWestIcon,
  MapPinIcon,
  PushPinIcon
} from '@phosphor-icons/react'
import { Fade } from 'react-awesome-reveal'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import Button from '../../components/Button/Button'
import Container from '../../components/Container/Container'
import {
  matchRepoName,
  RECRUITER_FEATURED_REPO_ORDER,
  RECRUITER_PROJECT_CATEGORY,
  RECRUITER_STACK_PRIMARY,
  RECRUITER_STACK_SECONDARY
} from '../../constants/recruiterFeatured'
import { CV_DOWNLOAD_NAME, CV_URL, GITHUB_USERNAME } from '../../constants/cv'
import { useRecruiterMode } from '../../context/useRecruiterMode'
import { useContributorCounts } from '../../hooks/useContributorCounts'
import useGetMe from '../../hooks/useGetMe'
import useGitHubProjects from '../../hooks/useGitHubProjects'
import { ProjectCardData } from '../../components/Card/Card'
import {
  collectPortfolioRepoCandidates,
  mergeGitHubProjects
} from '../../utils/mergeProjects'
import styles from './RecruiterView.module.scss'

const CONTACT = {
  email: 'rafaelvieira1720@gmail.com',
  github: `https://github.com/${GITHUB_USERNAME}`,
  linkedin: 'https://www.linkedin.com/in/rafael-vieira1720/'
} as const

function resolveProjectCategory (repoName: string): string | null {
  for (const [key, category] of Object.entries(RECRUITER_PROJECT_CATEGORY)) {
    if (matchRepoName(repoName, key)) return category
  }
  return null
}

export default function RecruiterView () {
  const { t, i18n } = useTranslation()
  const { disableRecruiterMode } = useRecruiterMode()
  const { pinned, recent } = useGitHubProjects()
  const { user } = useGetMe()

  const locale = i18n.language.startsWith('pt') ? 'pt' : 'en'
  const deliverables = t('recruiter.deliverables', {
    returnObjects: true
  }) as string[]
  const experienceItems = t('recruiter.experienceItems', {
    returnObjects: true
  }) as Array<{
    period: string
    title: string
    company: string
    description: string
  }>

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

  const featuredProjects = useMemo(() => {
    const all = mergeGitHubProjects(pinned, recent, locale, contributorCounts)
    const picked = RECRUITER_FEATURED_REPO_ORDER.map((target) =>
      all.find((p) => matchRepoName(p.repoName, target))
    ).filter((p): p is NonNullable<typeof p> => Boolean(p))

    if (picked.length > 0) return picked

    return all.filter((p) => p.pinned).slice(0, 3).length
      ? all.filter((p) => p.pinned).slice(0, 3)
      : all.slice(0, 3)
  }, [pinned, recent, locale, contributorCounts])

  const handleViewAllProjects = () => {
    disableRecruiterMode()
    window.setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const publicRepos = user?.public_repos

  return (
    <Fade triggerOnce>
      <div className={styles.recruiter}>
        <Container>
          <div className={styles.heroRow}>
            <article className={styles.profileCard}>
              <p className={styles.modeBadge}>
                <BriefcaseIcon size={14} weight='bold' aria-hidden />
                {t('recruiter.modeLabel')}
              </p>

              <h1 className={styles.name}>
                Rafael <span className={styles.nameAccent}>Vieira</span>
              </h1>
              <p className={styles.role}>{t('recruiter.role')}</p>
              <p className={styles.bio}>{t('recruiter.bio')}</p>
              <p className={styles.aboutExtended}>{t('recruiter.aboutExtended')}</p>

              <div className={styles.profileActions}>
                <Button href={CV_URL} variant='primary' download={CV_DOWNLOAD_NAME}>
                  <DownloadSimpleIcon size={18} weight='bold' />
                  {t('recruiter.downloadCv')}
                </Button>
                <Button href={`mailto:${CONTACT.email}`} variant='secondary'>
                  <EnvelopeSimpleIcon size={18} weight='bold' />
                  {t('recruiter.contactAction')}
                </Button>
              </div>

              <ul className={styles.metaRow}>
                <li>
                  <MapPinIcon size={16} weight='duotone' aria-hidden />
                  {t('recruiter.meta.location')}
                </li>
                <li>
                  <ClockIcon size={16} weight='duotone' aria-hidden />
                  {t('recruiter.meta.response')}
                </li>
                <li>
                  <GlobeHemisphereWestIcon size={16} weight='duotone' aria-hidden />
                  {t('recruiter.meta.contract')}
                </li>
              </ul>
            </article>

            <aside className={styles.sidebarCol}>
              <div className={styles.statsCard}>
                <div className={styles.statItem}>
                  <strong>{t('recruiter.stats.yearsValue')}</strong>
                  <span>{t('recruiter.stats.yearsLabel')}</span>
                </div>
                <div className={styles.statItem}>
                  <strong>{publicRepos ?? '—'}</strong>
                  <span>{t('recruiter.stats.reposLabel')}</span>
                </div>
                <div className={styles.statItem}>
                  <strong className={styles.statAccent}>
                    {t('recruiter.stats.scopeValue')}
                  </strong>
                  <span>{t('recruiter.stats.scopeLabel')}</span>
                </div>
              </div>

              <div className={styles.deliverablesCard}>
                <h2>
                  <CodeIcon size={18} weight='duotone' aria-hidden />
                  {t('recruiter.deliverablesTitle')}
                </h2>
                <ul>
                  {deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className={styles.middleRow}>
            <section className={styles.stackCard}>
              <h2>{t('recruiter.stackTitle')}</h2>
              <p className={styles.sectionSubtitle}>{t('recruiter.stackSubtitle')}</p>
              <div className={styles.stackPrimary}>
                {RECRUITER_STACK_PRIMARY.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <p className={styles.stackAlsoLabel}>{t('recruiter.stackAlsoLabel')}</p>
              <div className={styles.stackSecondary}>
                {RECRUITER_STACK_SECONDARY.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </section>

            <section className={styles.experienceCard}>
              <h2>{t('recruiter.experienceTitle')}</h2>
              <p className={styles.sectionSubtitle}>
                {t('recruiter.experienceSubtitle')}
              </p>
              <ol className={styles.timeline}>
                {experienceItems.map((item) => (
                  <li key={item.period}>
                    <span className={styles.timelinePeriod}>{item.period}</span>
                    <strong>{item.title}</strong>
                    <span className={styles.timelineCompany}>{item.company}</span>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section className={styles.projectsSection}>
            <div className={styles.projectsHeader}>
              <div>
                <h2>{t('recruiter.projectsTitle')}</h2>
                <p className={styles.sectionSubtitle}>
                  {t('recruiter.projectsSubtitle')}
                </p>
              </div>
              <button
                type='button'
                className={styles.viewAllBtn}
                onClick={handleViewAllProjects}
              >
                {t('recruiter.viewAll')}
                <ArrowSquareOutIcon size={16} weight='bold' />
              </button>
            </div>

            <ul className={styles.projectGrid}>
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} t={t} />
              ))}
            </ul>
          </section>

          <section className={styles.contactSection}>
            <div className={styles.contactHeader}>
              <div>
                <h2>{t('recruiter.contactHeading')}</h2>
                <p className={styles.sectionSubtitle}>
                  {t('recruiter.contactSubtitle')}
                </p>
              </div>
              <Button href={CV_URL} variant='primary' download={CV_DOWNLOAD_NAME}>
                <DownloadSimpleIcon size={18} weight='bold' />
                {t('recruiter.downloadCvPdf')}
              </Button>
            </div>

            <div className={styles.contactGrid}>
              <a href={`mailto:${CONTACT.email}`} className={styles.contactCard}>
                <EnvelopeSimpleIcon size={22} weight='duotone' aria-hidden />
                <span>{t('recruiter.contactEmail')}</span>
                <strong>{CONTACT.email}</strong>
              </a>
              <a
                href={CONTACT.github}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.contactCard}
              >
                <FaGithub size={22} aria-hidden />
                <span>GitHub</span>
                <strong>@{GITHUB_USERNAME}</strong>
              </a>
              <a
                href={CONTACT.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.contactCard}
              >
                <FaLinkedin size={22} aria-hidden />
                <span>LinkedIn</span>
                <strong>in/rafael-vieira1720</strong>
              </a>
            </div>
          </section>

          <footer className={styles.footer}>
            <p>
              {t('recruiter.footerCopyright', { year: new Date().getFullYear() })}
            </p>
            <p className={styles.footerNote}>{t('recruiter.footerNote')}</p>
          </footer>
        </Container>
      </div>
    </Fade>
  )
}

function ProjectCard ({
  project,
  t
}: {
  project: ProjectCardData
  t: (key: string, options?: Record<string, unknown>) => string
}) {
  const categoryKey = resolveProjectCategory(project.repoName)
  const categoryLabel = categoryKey
    ? t(`recruiter.projectCategories.${categoryKey}`)
    : null

  return (
    <li>
      <a
        href={project.urlGitHub}
        target='_blank'
        rel='noopener noreferrer'
        className={styles.projectCard}
      >
        {project.pinned && (
          <PushPinIcon
            className={styles.projectPin}
            size={16}
            weight='fill'
            aria-label={t('projects.pinned')}
          />
        )}
        {categoryLabel && (
          <span className={styles.projectCategory}>{categoryLabel}</span>
        )}
        <strong>{project.name}</strong>
        <p>{project.description}</p>
        <div className={styles.projectTags}>
          {project.languages.slice(0, 4).map((lang) => (
            <span key={lang}>{lang}</span>
          ))}
        </div>
      </a>
    </li>
  )
}
