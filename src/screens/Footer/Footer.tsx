import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import styles from './Footer.module.scss'

export default function Footer () {
  const { t } = useTranslation()
  const { totalUnlocked, showExplorerBadge } = useEasterEgg()

  return (
    <>
      <Fade triggerOnce>
        <footer className={styles.footer}>
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

          <nav className={styles.footerNav} aria-label='Footer'>
            <a href='#about'>{t('nav.about')}</a>
            <a href='#languages'>{t('nav.stack')}</a>
            <a href='#projects'>{t('nav.projects')}</a>
            <a href='#contact'>{t('nav.contact')}</a>
          </nav>

          <div className={styles.footerBottom}>
            <span>
              &copy; {new Date().getFullYear()} Rafael Vieira &middot;{' '}
              {t('footer.role')}
            </span>
            {totalUnlocked > 0 && (
              <span className={styles.eggCounter}>
                {t('easterEgg.counter', { count: totalUnlocked })}
              </span>
            )}
            <a href='#home' className={styles.backToTop}>
              {t('footer.backToTop')}
            </a>
          </div>
        </footer>
      </Fade>

      {showExplorerBadge && (
        <div className={styles.explorerBadge} role='status'>
          {t('easterEgg.explorer')}
        </div>
      )}
    </>
  )
}
