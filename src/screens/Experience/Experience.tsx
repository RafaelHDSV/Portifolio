import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import AmbientOrbs from '../../components/AmbientOrbs/AmbientOrbs'
import Container from '../../components/Container/Container'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import styles from './Experience.module.scss'

interface ExperienceTrack {
  title: string
  body: string
}

export default function Experience () {
  const { t } = useTranslation()
  const tracks = t('experience.tracks', { returnObjects: true }) as ExperienceTrack[]

  return (
    <Fade triggerOnce>
      <section
        id='experience'
        className={`mainContainer ${styles.experience}`}
      >
        <AmbientOrbs preset='stack' />
        <Container className={styles.sectionContent}>
          <SectionTitle
            title={t('experience.title')}
            subtitle={t('experience.subtitle')}
          />

          <header className={styles.roleHeader}>
            <p className={styles.role}>{t('experience.role')}</p>
            <p className={styles.meta}>
              <span>{t('experience.company')}</span>
              <span aria-hidden='true'>·</span>
              <span>{t('experience.period')}</span>
            </p>
          </header>

          <p className={styles.intro}>{t('experience.intro')}</p>

          <ol className={styles.tracks}>
            {tracks.map((track, index) => (
              <li key={track.title} className={styles.track}>
                <span className={styles.trackIndex} aria-hidden='true'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{track.title}</h3>
                <p>{track.body}</p>
              </li>
            ))}
          </ol>

          <p className={styles.confidentiality}>
            {t('experience.confidentiality')}
          </p>
        </Container>
      </section>
    </Fade>
  )
}
