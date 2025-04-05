import Typewriter from 'typewriter-effect'
import { FaArrowDownLong } from 'react-icons/fa6'
import styles from './Header.module.scss'
import { Fade, Slide } from 'react-awesome-reveal'

export default function HeaderContainer() {
  return (
    <div className={styles.headerContainer}>
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
          </Fade>
        </div>
      </nav>

      <Slide direction='left' triggerOnce>
        <h1>Rafael Vieira</h1>
      </Slide>

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
