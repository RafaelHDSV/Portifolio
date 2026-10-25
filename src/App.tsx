import { LegalPage, NotFoundPage, SiteFooter } from '@vieira/institucional'
import { lazy, Suspense } from 'react'
import BuyMeCoffee from './components/BuyMeCoffee/BuyMeCoffee'
import CustomCursor from './components/CustomCursor/CustomCursor'
import Navbar from './components/Navbar/Navbar'
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'
import ScrollProgressBar from './components/ScrollProgressBar/ScrollProgressBar'
import SectionFallback from './components/SectionFallback/SectionFallback'
import { RecruiterModeProvider } from './context/RecruiterModeProvider'
import { useHashScroll } from './hooks/useHashScroll'
import { useRecruiterMode } from './context/useRecruiterMode'
import { institucionalView } from './constants/institucionalRoutes'
import { EasterEggProvider } from './hooks/EasterEggProvider'
import About from './screens/About/About'
import Experience from './screens/Experience/Experience'
import Footer from './screens/Footer/Footer'
import Header from './screens/Header/Header'
import Languages from './screens/Languages/Languages'
import styles from './App.module.scss'
import './styles/main.scss'

const Projects = lazy(() => import('./screens/Projects/Projects'))
const LinkedInPosts = lazy(() => import('./screens/LinkedInPosts/LinkedInPosts'))
const Contact = lazy(() => import('./screens/Contact/Contact'))
const RecruiterView = lazy(() => import('./screens/Recruiter/RecruiterView'))

function AppContent () {
  const { isRecruiterMode } = useRecruiterMode()
  useHashScroll(!isRecruiterMode)

  if (isRecruiterMode) {
    return (
      <div className={styles.app}>
        <Navbar recruiterOnly />
        <Suspense fallback={<SectionFallback minHeight='60vh' />}>
          <RecruiterView />
        </Suspense>
        <SiteFooter className={styles.legalFooter} />
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
      <Experience />
      <Languages />
      <Suspense fallback={<SectionFallback minHeight='24rem' />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight='20rem' />}>
        <LinkedInPosts />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight='16rem' />}>
        <Contact />
      </Suspense>
      <Footer />
      <SiteFooter className={styles.legalFooter} />
      <ScrollToTopButton />
      <CustomCursor />
    </div>
  )
}

export default function App () {
  const view = institucionalView(window.location.pathname)
  if (view === 'privacy') return <LegalPage kind='privacy' />
  if (view === 'terms') return <LegalPage kind='terms' />
  if (view === 'not-found') return <NotFoundPage />

  return (
    <EasterEggProvider>
      <RecruiterModeProvider>
        <AppContent />
        <BuyMeCoffee />
      </RecruiterModeProvider>
    </EasterEggProvider>
  )
}
