import { useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import styles from './App.module.scss'
import AboutContainer from './components/AboutContainer/About'
import ContactContainer from './components/ContactContainer/Contact'
import DevelopmentScreen from './components/DevelopmentScreen/DevelopmentScreen'
import FooterContainer from './components/FooterContainer/Footer'
import HeaderContainer from './components/HeaderContainer/Header'
import LanguagesContainer from './components/LanguagesContainer/Languages'
import ProjectsContainer from './components/ProjectsContainer/Projects'

export function App() {
  const [devClickCount, setDevClickCount] = useState(0)
  const [loading] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  window.addEventListener('scroll', () => {
    setScrollY(window.scrollY)
  })

  // FIXME: Corrigir loading inicial
  // window.addEventListener('load', () => {
  //   setLoading(false)
  // })

  if (loading) return <div className={`${styles.loading} ${loading && styles.visible}`}></div>

  const isDevelopment = process.env.NODE_ENV === 'development'
  if (!isDevelopment && devClickCount < 30) {
    return <DevelopmentScreen clickCount={setDevClickCount} />
  }

  return (
    <div className={styles.app}>
      <HeaderContainer />
      <AboutContainer />
      <LanguagesContainer />
      <ProjectsContainer />
      <ContactContainer />
      <FooterContainer />

      {scrollY >= 250 && (
        <button
          className={styles.btnUp}
          onClick={() => {
            window.scrollTo(0, 0)
          }}
        >
          <FaArrowUp className={styles.arrowUp} />
        </button>
      )}
    </div>
  )
}
