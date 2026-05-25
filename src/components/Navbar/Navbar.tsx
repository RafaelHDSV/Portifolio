import { BriefcaseIcon, GlobeIcon, ListIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CV_DOWNLOAD_NAME, CV_URL } from '../../constants/cv'
import { useLinkedInContext } from '../../context/useLinkedInContext'
import { useRecruiterMode } from '../../context/useRecruiterMode'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import { setLocale } from '../../i18n'
import Logo from '../Logo/Logo'
import ThemeSwitcher from '../SwitchTheme/SwitchTheme'
import styles from './Navbar.module.scss'

const NAV_LINKS = [
  { href: '#about', key: 'about' as const, section: 'about' },
  { href: '#languages', key: 'stack' as const, section: 'languages' },
  { href: '#projects', key: 'projects' as const, section: 'projects' },
  { href: '#linkedin', key: 'linkedin' as const, section: 'linkedin' },
  { href: '#contact', key: 'contact' as const, section: 'contact' }
]

interface NavbarProps {
  recruiterOnly?: boolean
}

export default function Navbar ({ recruiterOnly = false }: NavbarProps) {
  const { t, i18n } = useTranslation()
  const activeSection = useActiveSection()
  const { incrementLogoClick } = useEasterEgg()
  const { hasPosts } = useLinkedInContext()
  const { enableRecruiterMode } = useRecruiterMode()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const locale = i18n.language.startsWith('pt') ? 'pt' : 'en'

  const navLinks = useMemo(
    () => NAV_LINKS.filter((link) => link.key !== 'linkedin' || hasPosts),
    [hasPosts]
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleLocale = () => {
    setLocale(locale === 'pt' ? 'en' : 'pt')
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    incrementLogoClick()
    if (!recruiterOnly) {
      document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      aria-label='Navegação principal'
    >
      <a
        href='#home'
        className={styles.logoLink}
        aria-label='Rafael Vieira - início'
        onClick={handleLogoClick}
      >
        <Logo />
      </a>

      <div className={styles.desktopActions}>
        {!recruiterOnly && (
          <div className={styles.links}>
            {navLinks.map(({ href, key, section }) => (
              <a
                key={key}
                href={href}
                className={activeSection === section ? styles.active : ''}
              >
                {t(`nav.${key}`)}
              </a>
            ))}
            <a
              href={CV_URL}
              download={CV_DOWNLOAD_NAME}
              className={styles.cvLink}
              target='_blank'
              rel='noopener noreferrer'
            >
              {t('nav.cv')}
            </a>
          </div>
        )}

        <div className={styles.controls}>
          {!recruiterOnly && (
            <button
              type='button'
              className={styles.recruiterBtn}
              onClick={enableRecruiterMode}
              title={t('recruiter.enable')}
            >
              <BriefcaseIcon size={16} weight='bold' />
              {t('recruiter.enableShort')}
            </button>
          )}
          <button
            type='button'
            className={styles.pillToggle}
            onClick={toggleLocale}
            aria-label={
              locale === 'pt' ? 'Switch to English' : 'Mudar para português'
            }
          >
            <GlobeIcon size={16} weight='bold' />
            {locale.toUpperCase()}
          </button>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.mobileControls}>
        {!recruiterOnly && (
          <button
            type='button'
            className={styles.recruiterBtn}
            onClick={enableRecruiterMode}
            title={t('recruiter.enable')}
          >
            <BriefcaseIcon size={16} weight='bold' />
          </button>
        )}
        <button
          type='button'
          className={styles.pillToggle}
          onClick={toggleLocale}
          aria-label={
            locale === 'pt' ? 'Switch to English' : 'Mudar para português'
          }
        >
          <GlobeIcon size={16} weight='bold' />
          {locale.toUpperCase()}
        </button>
        <ThemeSwitcher />
        {!recruiterOnly && (
          <button
            type='button'
            className={styles.menuButton}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.menu')}
          >
            {menuOpen ? <XIcon size={24} /> : <ListIcon size={24} />}
          </button>
        )}
      </div>

      {menuOpen && !recruiterOnly && (
        <div className={styles.mobileMenu}>
          {navLinks.map(({ href, key, section }) => (
            <a
              key={key}
              href={href}
              className={activeSection === section ? styles.active : ''}
              onClick={() => setMenuOpen(false)}
            >
              {t(`nav.${key}`)}
            </a>
          ))}
          <a
            href={CV_URL}
            download={CV_DOWNLOAD_NAME}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.cv')}
          </a>
        </div>
      )}
    </nav>
  )
}
