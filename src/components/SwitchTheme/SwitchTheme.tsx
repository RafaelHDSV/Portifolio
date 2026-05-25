import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEasterEgg } from '../../hooks/useEasterEgg'
import styles from './SwitchTheme.module.scss'

const getInitialTheme = (): boolean => {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme !== null) return storedTheme === 'dark'
  return true
}

export default function ThemeSwitcher () {
  const { t } = useTranslation()
  const { registerThemeToggle } = useEasterEgg()
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

  const handleToggle = () => {
    registerThemeToggle()
    setIsDarkTheme((prev) => !prev)
  }

  return (
    <button
      type='button'
      aria-label={
        isDarkTheme ? t('theme.switchToLight') : t('theme.switchToDark')
      }
      aria-pressed={isDarkTheme}
      className={styles.pillToggle}
      onClick={handleToggle}
      title={isDarkTheme ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      {isDarkTheme ? (
        <MoonIcon size={16} weight='bold' />
      ) : (
        <SunIcon size={16} weight='bold' />
      )}
      {isDarkTheme ? 'Dark' : 'Light'}
    </button>
  )
}
