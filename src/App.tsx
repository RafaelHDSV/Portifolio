import CustomCursor from './components/CustomCursor/CustomCursor'
import Navbar from './components/Navbar/Navbar'
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'
import ScrollProgressBar from './components/ScrollProgressBar/ScrollProgressBar'
import { RecruiterModeProvider } from './context/RecruiterModeProvider'
import { useRecruiterMode } from './context/useRecruiterMode'
import { EasterEggProvider } from './hooks/EasterEggProvider'
import About from './screens/About/About'
import Contact from './screens/Contact/Contact'
import Footer from './screens/Footer/Footer'
import Header from './screens/Header/Header'
import Languages from './screens/Languages/Languages'
import Projects from './screens/Projects/Projects'
import RecruiterView from './screens/Recruiter/RecruiterView'
import styles from './App.module.scss'
import './styles/main.scss'

function AppContent () {
  const { isRecruiterMode } = useRecruiterMode()

  if (isRecruiterMode) {
    return (
      <div className={styles.app}>
        <Navbar recruiterOnly />
        <RecruiterView />
        <CustomCursor />
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Navbar />
      <ScrollProgressBar />
      <Header />
      <About />
      <Languages />
      <Projects />
      <Contact />
      <Footer />
      <ScrollToTopButton />
      <CustomCursor />
    </div>
  )
}

export default function App () {
  return (
    <EasterEggProvider>
      <RecruiterModeProvider>
        <AppContent />
      </RecruiterModeProvider>
    </EasterEggProvider>
  )
}
