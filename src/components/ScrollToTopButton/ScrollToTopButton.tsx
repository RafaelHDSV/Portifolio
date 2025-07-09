import { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import styles from './ScrollToTopButton.module.scss'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY >= 250)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => window.scrollTo(0, 0)

  return (
    <button
      className={`${styles.btnUp} ${visible ? styles.visible : ''}`}
      onClick={handleClick}
      aria-label='Scroll to top'
      type='button'
    >
      <FaArrowUp className={styles.arrowUp} />
    </button>
  )
}
