import { useEffect, useState } from 'react'
import styles from './App.module.scss'
import CustomCursor from './components/CustomCursor/CustomCursor'
import Navbar from './components/Navbar/Navbar'
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'
import About from './screens/About/About'
import Contact from './screens/Contact/Contact'
import DevelopmentScreen from './screens/DevelopmentScreen/DevelopmentScreen'
import Footer from './screens/Footer/Footer'
import Header from './screens/Header/Header'
import Languages from './screens/Languages/Languages'
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

      <Header />
      <About />
      <Languages />
      {/* <Projects /> */}
      <Contact />
      <Footer />

      <ScrollToTopButton />
      <CustomCursor />
    </div>
  )
}
