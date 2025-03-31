import Typewriter from 'typewriter-effect'
import { FaArrowDownLong } from 'react-icons/fa6'
import styles from './Header.module.scss'

export default function HeaderContainer() {
  return (
    <div className={styles.headerContainer}>
      <nav>
        <a href='/'>
          <h2>RV</h2>
        </a>

        <div className={styles.optionsNav}>
          <a href='#about'>Sobre</a>
          <a href='#languages'>Linguagens</a>
          <a href='#projects'>Projetos</a>
          <a href='#contact'>Contato</a>
        </div>
      </nav>

      <h1>Rafael Vieira</h1>

      <Typewriter
        options={{
          autoStart: true,
          loop: true,
          delay: 60,
          deleteSpeed: 30,
          skipAddStyles: true,
          wrapperClassName: styles.typewriter,
          strings: ['Desenvolvedor Front-End', 'React | Sass | Typescript | Javascript', 'Desenvolvedor Web', 'Front End Developer', 'Web Developer']
        }}
      />

      <FaArrowDownLong className={styles.arrowDown} size='2rem' />
    </div>
  )
}
