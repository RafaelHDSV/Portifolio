import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import styles from './SwitchTheme.module.scss'

const getInitialTheme = (): boolean => {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme !== null) return storedTheme === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function ThemeSwitcher() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(getInitialTheme)

  // useEffect(() => {
  //   if (isDarkTheme) {
  //     document.documentElement.classList.add('dark')
  //     localStorage.setItem('theme', 'dark')
  //   } else {
  //     document.documentElement.classList.remove('dark')
  //     localStorage.setItem('theme', 'light')
  //   }
  // }, [isDarkTheme])

  return (
    <button
      aria-label={`Mudar para tema ${isDarkTheme ? 'claro' : 'escuro'}`}
      aria-pressed={isDarkTheme}
      className={styles.switcher}
      onClick={() => setIsDarkTheme((prev) => !prev)}
      title='Alternar tema'
    >
      <div className={styles.track}>
        <div className={styles.icons}>
          <span className={styles.sun}>
            <SunIcon size={400} />
          </span>
          <span className={styles.moon}>
            <MoonIcon size={400} />
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
