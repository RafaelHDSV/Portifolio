import { GlobeIcon, ListIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useActiveSection from '../../hooks/useActiveSection'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import { setLocale } from '../../i18n'
import ThemeSwitcher from '../SwitchTheme/SwitchTheme'
import styles from './Navbar.module.scss'

const NAV_LINKS = [
  { href: '#about', key: 'about' as const, section: 'about' },
  { href: '#languages', key: 'stack' as const, section: 'languages' },
  { href: '#projects', key: 'projects' as const, section: 'projects' },
  { href: '#contact', key: 'contact' as const, section: 'contact' }
]

export default function Navbar () {
  const { t, i18n } = useTranslation()
  const activeSection = useActiveSection()
  const { incrementLogoClick } = useEasterEgg()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const locale = i18n.language.startsWith('pt') ? 'pt' : 'en'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleLocale = () => {
    setLocale(locale === 'pt' ? 'en' : 'pt')
  }

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      aria-label='Navegacao principal'
    >
      <a
        href='/'
        className={styles.logo}
        onClick={incrementLogoClick}
        aria-label='Rafael Vieira - inicio'
      >
        RV
      </a>

      <div className={styles.desktopActions}>
        <div className={styles.links}>
          {NAV_LINKS.map(({ href, key, section }) => (
            <a
              key={key}
              href={href}
              className={activeSection === section ? styles.active : ''}
            >
              {t(`nav.${key}`)}
            </a>
          ))}
          <a
            href='cv.pdf'
            download='Rafael Vieira - Curriculo'
            className={styles.cvLink}
          >
            {t('nav.cv')}
          </a>
        </div>

        <div className={styles.controls}>
          <button
            type='button'
            className={styles.localeToggle}
            onClick={toggleLocale}
            aria-label={
              locale === 'pt' ? 'Switch to English' : 'Mudar para portugues'
            }
          >
            <GlobeIcon size={18} weight='bold' />
            {locale.toUpperCase()}
          </button>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.mobileControls}>
        <button
          type='button'
          className={styles.localeToggle}
          onClick={toggleLocale}
          aria-label={
            locale === 'pt' ? 'Switch to English' : 'Mudar para portugues'
          }
        >
          <GlobeIcon size={18} weight='bold' />
          {locale.toUpperCase()}
        </button>
        <ThemeSwitcher />
        <button
          type='button'
          className={styles.menuButton}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.menu')}
        >
          {menuOpen ? <XIcon size={24} /> : <ListIcon size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(({ href, key, section }) => (
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
            href='cv.pdf'
            download='Rafael Vieira - Curriculo'
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.cv')}
          </a>
        </div>
      )}
    </nav>
  )
}
