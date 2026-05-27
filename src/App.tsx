import { lazy, Suspense } from 'react'
import CustomCursor from './components/CustomCursor/CustomCursor'
import Navbar from './components/Navbar/Navbar'
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'
import ScrollProgressBar from './components/ScrollProgressBar/ScrollProgressBar'
import SectionFallback from './components/SectionFallback/SectionFallback'
import { RecruiterModeProvider } from './context/RecruiterModeProvider'
import { useRecruiterMode } from './context/useRecruiterMode'
import { EasterEggProvider } from './hooks/EasterEggProvider'
import About from './screens/About/About'
import Footer from './screens/Footer/Footer'
import Header from './screens/Header/Header'
import Languages from './screens/Languages/Languages'
import styles from './App.module.scss'
import './styles/main.scss'

const Projects = lazy(() => import('./screens/Projects/Projects'))
const Contact = lazy(() => import('./screens/Contact/Contact'))
const RecruiterView = lazy(() => import('./screens/Recruiter/RecruiterView'))

function AppContent () {
  const { isRecruiterMode } = useRecruiterMode()

  if (isRecruiterMode) {
    return (
      <div className={styles.app}>
        <Navbar recruiterOnly />
        <Suspense fallback={<SectionFallback minHeight='60vh' />}>
          <RecruiterView />
        </Suspense>
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
      <Suspense fallback={<SectionFallback minHeight='24rem' />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight='16rem' />}>
        <Contact />
      </Suspense>
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
