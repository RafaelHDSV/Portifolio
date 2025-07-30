import { Fade } from 'react-awesome-reveal'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <Fade triggerOnce>
      <FooterContent />
    </Fade>
  )
}

function FooterContent() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} Rafael Vieira</span>
      </div>

      <nav className={styles.footerNav}>
        <a href='#about'>sobre</a>
        <a href='#languages'>linguagens</a>
        <a href='#projects'>projetos</a>
        <a href='#contact'>contato</a>
      </nav>
    </footer>
  )
}
