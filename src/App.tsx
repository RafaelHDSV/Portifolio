import CustomCursor from './components/CustomCursor/CustomCursor'
import Navbar from './components/Navbar/Navbar'
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'
import { EasterEggProvider } from './hooks/EasterEggProvider'
import { useEasterEgg } from './hooks/useEasterEgg'
import About from './screens/About/About'
import Contact from './screens/Contact/Contact'
import DevelopmentScreen from './screens/DevelopmentScreen/DevelopmentScreen'
import Footer from './screens/Footer/Footer'
import Header from './screens/Header/Header'
import Languages from './screens/Languages/Languages'
import Projects from './screens/Projects/Projects'
import styles from './App.module.scss'
import './styles/main.scss'

function AppContent () {
  const { showDevScreen, setShowDevScreen } = useEasterEgg()

  return (
    <div className={styles.app}>
      <Navbar />
      <Header />
      <About />
      <Languages />
      <Projects />
      <Contact />
      <Footer />
      <ScrollToTopButton />
      <CustomCursor />
      {showDevScreen && (
        <DevelopmentScreen onClose={() => setShowDevScreen(false)} />
      )}
    </div>
  )
}

export default function App () {
  return (
    <EasterEggProvider>
      <AppContent />
    </EasterEggProvider>
  )
}
