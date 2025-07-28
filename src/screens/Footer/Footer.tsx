import { Fade } from 'react-awesome-reveal'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <Fade>
      <FooterContent />
    </Fade>
  )
}

function FooterContent() {
  return (
    <footer className={styles.footer}>
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
        <p className={styles.footerTitle}>Info</p>
        <ul className={styles.footerInfo}>
          <li>Atualizado em: Julho de 2025</li>
          <li>Feito com React, TypeScript e Sass</li>
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

      <div className={styles.footerBottom}>
        © {new Date().getFullYear()} Rafael Vieira. Todos os direitos
        reservados.
      </div>
    </footer>
  )
}
