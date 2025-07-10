import { useEffect, useState } from 'react'
import styles from './App.module.scss'
import Navbar from './components/Navbar/Navbar'
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'
import AboutContainer from './screens/AboutContainer/About'
import ContactContainer from './screens/ContactContainer/Contact'
import DevelopmentScreen from './screens/DevelopmentScreen/DevelopmentScreen'
import FooterContainer from './screens/FooterContainer/Footer'
import HeaderContainer from './screens/HeaderContainer/Header'
import LanguagesContainer from './screens/LanguagesContainer/Languages'
import ProjectsContainer from './screens/ProjectsContainer/Projects'
import './styles/main.scss'
import { isDevelopment } from './utils/environment'

export default function App() {
  const [devClickCount, setDevClickCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  if (loading)
    return <div className={`${styles.loading} ${loading && styles.visible}`} />

  if (!isDevelopment && devClickCount < 30) {
    return (
      <DevelopmentScreen
        devClickCount={devClickCount}
        setDevClickCount={setDevClickCount}
      />
    )
  }

  return (
    <div className={styles.app}>
      <Navbar />

      <HeaderContainer />
      <AboutContainer />
      <LanguagesContainer />
      <ProjectsContainer />
      <ContactContainer />
      <FooterContainer />

      <ScrollToTopButton />
    </div>
  )
}
