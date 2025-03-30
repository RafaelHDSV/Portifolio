import { useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import HeaderContainer from './components/HeaderContainer/Header'
import { AboutContainer } from './components/AboutContainer/About'
import { LanguagesContainer } from './components/LanguagesContainer/Languages'
import { ProjectsContainer } from './components/ProjectsContainer/Projects'
import { ContactContainer } from './components/ContactContainer/Contact'
import { FooterContainer } from './components/FooterContainer/Footer'
import styles from './App.module.scss'

export function App() {
  const [developmentClick, setDevelopmentClick] = useState(0)
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  window.addEventListener('scroll', () => {
    setScrollY(window.scrollY)
  })

  window.addEventListener('load', () => {
    setLoading(false)
  })

  const isDevelopment = process.env.NODE_ENV === 'development'
  if (!isDevelopment && developmentClick < 30) {
    return (
      <div className={styles.loader} onClick={() => setDevelopmentClick(developmentClick + 1)}>
        <h1>Obrigado por acessar o meu projeto!</h1>
        <p>Porém este projeto ainda está em desenvolvimento. Aguarde até a finalização do projeto</p>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <HeaderContainer></HeaderContainer>
      <AboutContainer></AboutContainer>
      <LanguagesContainer></LanguagesContainer>
      <ProjectsContainer></ProjectsContainer>
      <ContactContainer></ContactContainer>
      <FooterContainer></FooterContainer>

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

      {loading && <div className={`${styles.loading} ${loading && styles.visible}`}></div>}
    </div>
  )
}
