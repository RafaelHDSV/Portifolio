import { Fade } from 'react-awesome-reveal'
import ThemeSwitcher from '../SwitchTheme/SwitchTheme'
import styles from './Navbar.module.scss'

export default function Navbar() {
  return (
    <nav>
      <Fade damping={0.3}>
        <a href='/'>
          <h2>RV</h2>
        </a>
      </Fade>
      <div className={styles.optionsNav}>
        <Fade cascade damping={0.3}>
          <a href='#about'>Sobre</a>
          <a href='#languages'>Linguagens</a>
          <a href='#projects'>Projetos</a>
          <a href='#contact'>Contato</a>
          <ThemeSwitcher />
        </Fade>
      </div>
    </nav>
  )
}
