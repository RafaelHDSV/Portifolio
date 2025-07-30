import { useEffect, useState } from 'react'
import styles from './SwitchTheme.module.scss'

export default function ThemeSwitcher() {
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
    <label className={styles.switch}>
      <input
        type='checkbox'
        checked={isDarkTheme}
        onChange={() => setIsDarkTheme((prev) => !prev)}
      />
      <span className={styles.slider}></span>
    </label>
  )
}

const getInitialTheme = (): boolean => {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme !== null) return storedTheme === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}
