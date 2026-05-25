import CustomCursor from './components/CustomCursor/CustomCursor'
import Navbar from './components/Navbar/Navbar'
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'
import { EasterEggProvider } from './hooks/EasterEggProvider'
import About from './screens/About/About'
import Contact from './screens/Contact/Contact'
import Footer from './screens/Footer/Footer'
import Header from './screens/Header/Header'
import Languages from './screens/Languages/Languages'
import LinkedInPosts from './screens/LinkedIn/LinkedInPosts'
import Projects from './screens/Projects/Projects'
import styles from './App.module.scss'
import './styles/main.scss'

function AppContent () {
  return (
    <div className={styles.app}>
      <Navbar />
      <Header />
      <About />
      <Languages />
      <Projects />
      <LinkedInPosts />
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
      <AppContent />
    </EasterEggProvider>
  )
}
