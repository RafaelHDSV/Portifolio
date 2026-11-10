import { fetchPublicSummary, shouldShowVisitCount } from '@vieira/analytics'
import { useEffect, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Container from '../../components/Container/Container'
import Modal from '../../components/Modal/Modal'
import { EASTER_EGG_CATALOG } from '../../constants/easterEggCatalog'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import styles from './Footer.module.scss'

const FOOTER_LINKS = [
  { href: '#projects', key: 'projects' as const },
  { href: '#contact', key: 'contact' as const }
] as const

const SOCIAL = [
  {
    href: 'mailto:rafaelvieira1720@gmail.com',
    label: 'Email',
    Icon: MdEmail
  },
  {
    href: 'https://wa.me/5511947100007',
    label: 'WhatsApp',
    Icon: FaWhatsapp
  },
  {
    href: 'https://github.com/RafaelHDSV',
    label: 'GitHub',
    Icon: FaGithub
  },
  {
    href: 'https://www.linkedin.com/in/rafael-vieira1720/',
    label: 'LinkedIn',
    Icon: FaLinkedin
  }
] as const

function FooterVisitCount () {
  const { t, i18n } = useTranslation()
  const [pageviews, setPageviews] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    void fetchPublicSummary('portifolio', { signal: controller.signal }).then(
      summary => {
        if (cancelled) return
        if (!shouldShowVisitCount(summary) || !summary) {
          setPageviews(null)
          return
        }
        setPageviews(summary.pageviews)
      }
    )

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  if (pageviews == null) return null

  const formatted = new Intl.NumberFormat(
    i18n.language?.startsWith('en') ? 'en-US' : 'pt-BR'
  ).format(pageviews)

  return (
    <p className={styles.visitCount} aria-live='polite'>
      <span className={styles.visitCountNum}>{formatted}</span>{' '}
      <span className={styles.visitCountSuffix}>
        {t('footer.visitCountSuffix')}
      </span>
    </p>
  )
}

export default function Footer () {
  const { t } = useTranslation()
  const {
    totalUnlocked,
    totalEggs,
    catalogRevealAll,
    revealAllInCatalog,
    isUnlocked
  } = useEasterEgg()
  const [catalogOpen, setCatalogOpen] = useState(false)
  const isDev = import.meta.env.DEV

  return (
    <>
      <Fade triggerOnce>
        <footer className={styles.footer}>
          <Container className={styles.inner}>
            <div className={styles.grid}>
              <div className={styles.col}>
                <p className={styles.colLabel}>{t('footer.colCredits')}</p>
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
                <FooterVisitCount />
              </div>

              <div className={styles.col}>
                <p className={styles.colLabel}>{t('footer.colLinks')}</p>
                <nav className={styles.footerNav} aria-label='Footer'>
                  {FOOTER_LINKS.map(({ href, key }) => (
                    <a key={key} href={href}>
                      {t(`nav.${key}`)}
                    </a>
                  ))}
                  <a href='/privacidade'>{t('footer.privacy')}</a>
                  <a href='/termos'>{t('footer.terms')}</a>
                </nav>
              </div>

              <div className={styles.col}>
                <p className={styles.colLabel}>{t('footer.colSocial')}</p>
                <div className={styles.social}>
                  {SOCIAL.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Icon size={22} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </footer>
      </Fade>

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
            {EASTER_EGG_CATALOG.map(egg => {
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
