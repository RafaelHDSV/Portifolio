import { useEffect, useState } from 'react'
import styles from './SwitchTheme.module.scss'

export default function ThemeSwitcher() {
  const storedTheme = localStorage.getItem('theme')
  const initialTheme = storedTheme ? storedTheme === 'dark' : true
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(initialTheme)

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkTheme])

  function toggleTheme() {
    setIsDarkTheme((prev) => !prev)
  }

  return (
    <label className={styles.switch}>
      <input type='checkbox' checked={isDarkTheme} onChange={toggleTheme} />
      <span className={styles.slider}></span>
    </label>
  )
}
