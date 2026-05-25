import { BriefcaseIcon, ArrowLeftIcon } from '@phosphor-icons/react'
import { Fade } from 'react-awesome-reveal'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Button from '../../components/Button/Button'
import Container from '../../components/Container/Container'
import {
  matchRepoName,
  RECRUITER_FEATURED_REPO_ORDER
} from '../../constants/recruiterFeatured'
import { CV_DOWNLOAD_NAME, CV_URL } from '../../constants/cv'
import { useRecruiterMode } from '../../context/useRecruiterMode'
import useGitHubProjects from '../../hooks/useGitHubProjects'
import { mergeGitHubProjects } from '../../utils/mergeProjects'
import styles from './RecruiterView.module.scss'

export default function RecruiterView () {
  const { t, i18n } = useTranslation()
  const { disableRecruiterMode } = useRecruiterMode()
  const { pinned, recent } = useGitHubProjects()

  const locale = i18n.language.startsWith('pt') ? 'pt' : 'en'

  const featuredProjects = useMemo(() => {
    const all = mergeGitHubProjects(pinned, recent, locale)
    const picked = RECRUITER_FEATURED_REPO_ORDER.map((target) =>
      all.find((p) => matchRepoName(p.repoName, target))
    ).filter((p): p is NonNullable<typeof p> => Boolean(p))

    if (picked.length > 0) return picked

    return all.filter((p) => p.pinned).slice(0, 3).length
      ? all.filter((p) => p.pinned).slice(0, 3)
      : all.slice(0, 3)
  }, [pinned, recent, locale])

  return (
    <Fade triggerOnce>
      <div className={styles.recruiter}>
        <Container>
          <header className={styles.header}>
            <div>
              <h1>Rafael Vieira</h1>
              <p className={styles.role}>{t('recruiter.role')}</p>
              <p className={styles.bio}>{t('recruiter.bio')}</p>
              <p className={styles.aboutExtended}>{t('recruiter.aboutExtended')}</p>
            </div>
            <Button variant='secondary' onClick={disableRecruiterMode}>
              <ArrowLeftIcon size={18} weight='bold' />
              {t('recruiter.back')}
            </Button>
          </header>

          <section className={styles.block}>
            <h2>{t('recruiter.stackTitle')}</h2>
            <p>{t('about.highlights.focus')}</p>
            <p className={styles.stackNote}>{t('recruiter.stackNote')}</p>
          </section>

          <section className={styles.block}>
            <h2>{t('recruiter.projectsTitle')}</h2>
            <ul className={styles.projectList}>
              {featuredProjects.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong>
                  <span>{p.description}</span>
                  <div className={styles.projectMeta}>
                    {p.languages.slice(0, 4).map((lang) => (
                      <span key={lang}>{lang}</span>
                    ))}
                  </div>
                  <a href={p.urlGitHub} target='_blank' rel='noopener noreferrer'>
                    GitHub
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.block}>
            <h2>{t('recruiter.contactTitle')}</h2>
            <div className={styles.contactRow}>
              <a href='mailto:rafaelvieira1720@gmail.com'>
                <MdEmail size={20} /> E-mail
              </a>
              <a href='https://github.com/RafaelHDSV' target='_blank' rel='noopener noreferrer'>
                <FaGithub size={20} /> GitHub
              </a>
              <a
                href='https://www.linkedin.com/in/rafael-vieira1720/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaLinkedin size={20} /> LinkedIn
              </a>
            </div>
            <Button href={CV_URL} variant='primary' download={CV_DOWNLOAD_NAME}>
              <BriefcaseIcon size={18} weight='bold' />
              {t('recruiter.downloadCv')}
            </Button>
          </section>
        </Container>
      </div>
    </Fade>
  )
}
