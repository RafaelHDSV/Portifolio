import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './SwitchTheme.module.scss'

const getInitialTheme = (): boolean => {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme !== null) return storedTheme === 'dark'
  return true
}

export default function ThemeSwitcher () {
  const { t } = useTranslation()
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(getInitialTheme)

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkTheme])

  return (
    <button
      aria-label={
        isDarkTheme ? t('theme.switchToLight') : t('theme.switchToDark')
      }
      aria-pressed={isDarkTheme}
      className={styles.switcher}
      onClick={() => setIsDarkTheme((prev) => !prev)}
      title={isDarkTheme ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      <div className={styles.track}>
        <div className={styles.icons}>
          <span className={styles.sun}>
            <SunIcon size={14} weight='bold' />
          </span>
          <span className={styles.moon}>
            <MoonIcon size={14} weight='bold' />
          </span>
        </div>
        <div
          className={`${styles.thumb} ${isDarkTheme ? styles.dark : styles.light}`}
          aria-hidden='true'
        />
      </div>
    </button>
  )
}
