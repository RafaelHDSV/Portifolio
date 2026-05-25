import { CompassIcon } from '@phosphor-icons/react'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Container from '../../components/Container/Container'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import styles from './Footer.module.scss'

export default function Footer () {
  const { t } = useTranslation()
  const { totalUnlocked, totalEggs, showExplorerBadge, explorerMessage } =
    useEasterEgg()

  return (
    <>
      <Fade triggerOnce>
        <footer className={styles.footer}>
          <Container className={styles.inner}>
            <div className={styles.row}>
              <div className={styles.brand}>
                <span className={styles.copyright}>
                  &copy; {new Date().getFullYear()} Rafael Vieira &middot;{' '}
                  {t('footer.role')}
                </span>
                <span className={styles.eggCounter}>
                  {t('footer.eggCounter', {
                    count: totalUnlocked,
                    total: totalEggs
                  })}
                </span>
              </div>

              <nav className={styles.footerNav} aria-label='Footer'>
                <a href='#about'>{t('nav.about')}</a>
                <a href='#languages'>{t('nav.stack')}</a>
                <a href='#projects'>{t('nav.projects')}</a>
                <a href='#contact'>{t('nav.contact')}</a>
              </nav>

              <div className={styles.social}>
                <a
                  href='mailto:rafaelvieira1720@gmail.com'
                  aria-label='Email'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <MdEmail size={22} />
                </a>
                <a
                  href='https://github.com/RafaelHDSV'
                  aria-label='GitHub'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaGithub size={22} />
                </a>
                <a
                  href='https://www.linkedin.com/in/rafael-vieira1720/'
                  aria-label='LinkedIn'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaLinkedin size={22} />
                </a>
              </div>
            </div>
          </Container>
        </footer>
      </Fade>

      {showExplorerBadge && (
        <div className={styles.explorerBadge} role='status'>
          <CompassIcon size={28} weight='duotone' className={styles.explorerIcon} />
          <div>
            <strong>{t('easterEgg.explorer')}</strong>
            <p>{explorerMessage ? t(explorerMessage) : t('easterEgg.explorerDesc')}</p>
          </div>
        </div>
      )}
    </>
  )
}
