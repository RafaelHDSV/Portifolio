import { BriefcaseIcon, ArrowLeftIcon } from '@phosphor-icons/react'
import { Fade } from 'react-awesome-reveal'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Button from '../../components/Button/Button'
import Container from '../../components/Container/Container'
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

  const topProjects = useMemo(() => {
    const all = mergeGitHubProjects(pinned, recent, locale)
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
            </div>
            <Button variant='secondary' onClick={disableRecruiterMode}>
              <ArrowLeftIcon size={18} weight='bold' />
              {t('recruiter.back')}
            </Button>
          </header>

          <section className={styles.block}>
            <h2>{t('recruiter.stackTitle')}</h2>
            <p>{t('about.highlights.focus')}</p>
          </section>

          <section className={styles.block}>
            <h2>{t('recruiter.projectsTitle')}</h2>
            <ul className={styles.projectList}>
              {topProjects.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong>
                  <span>{p.description}</span>
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
