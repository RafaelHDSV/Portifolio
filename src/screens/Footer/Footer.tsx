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
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <p className={styles.footerTitle}>Navegação</p>
          <nav className={styles.footerNav}>
            <a href='#about'>Sobre</a>
            <a href='#languages'>Linguagens</a>
            <a href='#projects'>Projetos</a>
            <a href='#contact'>Contato</a>
          </nav>
        </div>

        <div className={styles.footerSection}>
          <p className={styles.footerTitle}>Informações</p>
          <ul className={styles.footerInfo}>
            <li>
              <a
                href='/cv-rafael-vieira.pdf'
                target='_blank'
                rel='noopener noreferrer'
              >
                Baixar currículo
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} Rafael Vieira</span>
        <span>Todos os direitos reservados.</span>
      </div>
    </footer>
  )
}
