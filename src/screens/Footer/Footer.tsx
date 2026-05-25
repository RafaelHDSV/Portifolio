import { CompassIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Container from '../../components/Container/Container'
import Modal from '../../components/Modal/Modal'
import { EASTER_EGG_CATALOG } from '../../constants/easterEggCatalog'
import { useLinkedInContext } from '../../context/useLinkedInContext'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import styles from './Footer.module.scss'

export default function Footer () {
  const { t } = useTranslation()
  const { hasPosts } = useLinkedInContext()
  const {
    totalUnlocked,
    totalEggs,
    showExplorerBadge,
    explorerMessage,
    isUnlocked,
    catalogRevealAll,
    revealAllInCatalog
  } = useEasterEgg()
  const [catalogOpen, setCatalogOpen] = useState(false)
  const isDev = import.meta.env.DEV

  const footerLinks = [
    { href: '#about', key: 'about' as const },
    { href: '#languages', key: 'stack' as const },
    { href: '#projects', key: 'projects' as const },
    ...(hasPosts ? [{ href: '#linkedin', key: 'linkedin' as const }] : []),
    { href: '#contact', key: 'contact' as const }
  ]

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
                <button
                  type='button'
                  className={styles.eggCounterBtn}
                  onClick={() => setCatalogOpen(true)}
                  title={t('easterEgg.catalogOpenHint')}
                >
                  {t('footer.eggCounter', {
                    count: totalUnlocked,
                    total: totalEggs
                  })}
                </button>
              </div>

              <nav className={styles.footerNav} aria-label='Footer'>
                {footerLinks.map(({ href, key }) => (
                  <a key={key} href={href}>
                    {t(`nav.${key}`)}
                  </a>
                ))}
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

      <Modal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        title={t('easterEgg.catalogTitle')}
      >
        <div className={styles.catalog}>
          {isDev && (
            <button
              type='button'
              className={styles.revealAllBtn}
              onClick={revealAllInCatalog}
            >
              {t('easterEgg.catalogRevealAll')}
            </button>
          )}
          <div className={styles.catalogGrid}>
            {EASTER_EGG_CATALOG.map((egg) => {
              const unlocked = isUnlocked(egg.id)
              const visible = unlocked || catalogRevealAll

              return (
                <article
                  key={egg.id}
                  className={`${styles.catalogCard} ${!visible ? styles.catalogLocked : ''}`}
                >
                  <h3>{t(egg.nameKey)}</h3>
                  <p className={styles.catalogTrigger}>
                    <strong>{t('easterEgg.catalogColTrigger')}:</strong>{' '}
                    {visible ? t(egg.triggerKey) : '???'}
                  </p>
                  <p>
                    <strong>{t('easterEgg.catalogColResult')}:</strong>{' '}
                    {visible ? t(egg.resultKey) : '???'}
                  </p>
                  <span className={styles.catalogStatus}>
                    {unlocked
                      ? t('easterEgg.catalogUnlocked')
                      : t('easterEgg.catalogLocked')}
                  </span>
                </article>
              )
            })}
          </div>
        </div>
      </Modal>
    </>
  )
}
